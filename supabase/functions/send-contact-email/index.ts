import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ADMIN_INBOX = "devinpolicastro@gmail.com";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { name, email, phone, subject, message, formData } = await req.json();

    if (!name || !email || !subject) {
      return new Response(JSON.stringify({ error: "Name, email, and subject are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: inserted, error: dbError } = await supabase
      .from("inquiries")
      .insert({
        service_type: subject,
        name,
        email,
        phone: phone || null,
        form_data: formData || {},
      })
      .select("id")
      .single();

    if (dbError) console.error("DB insert error:", dbError);
    const inquiryId = inserted?.id ?? crypto.randomUUID();

    // Build admin notification fields
    const baseFields = [
      { label: "Name", value: name },
      { label: "Email", value: email },
    ];
    if (phone) baseFields.push({ label: "Phone", value: phone });
    baseFields.push({ label: "Service", value: subject });

    const extraFields = formData
      ? Object.entries(formData)
          .filter(([k, v]) => v && !["name", "email", "phone"].includes(k))
          .map(([k, v]) => ({ label: k, value: String(v) }))
      : [];

    const fields = [...baseFields, ...extraFields];
    const bodyHtml = message
      ? `<p style="font-size:15px;line-height:1.6;margin:0;"><strong>Message:</strong><br/>${
          String(message).replace(/</g, "&lt;").replace(/\n/g, "<br/>")
        }</p>`
      : "";

    // 1) Admin notification — replies go to the inquirer
    await supabase.functions.invoke("send-transactional-email", {
      body: {
        templateName: "notify-admin",
        recipientEmail: ADMIN_INBOX,
        idempotencyKey: `inquiry-admin-${inquiryId}`,
        replyTo: email,
        templateData: {
          title: `New ${subject}`,
          preheader: `${name} just submitted the ${subject} form`,
          intro: `New inquiry from ${name}. Reply directly — their email is the reply-to.`,
          fields,
          bodyHtml,
        },
      },
    });

    // 2) Auto-reply to inquirer — replies route to Devin
    await supabase.functions.invoke("send-transactional-email", {
      body: {
        templateName: "contact-confirmation",
        recipientEmail: email,
        idempotencyKey: `inquiry-confirm-${inquiryId}`,
        replyTo: ADMIN_INBOX,
        templateData: { name, subject },
      },
    });


    return new Response(JSON.stringify({
      success: true,
      message: "Inquiry received! Devin will get back to you soon.",
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Contact form error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
