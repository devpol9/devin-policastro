import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

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

    // Save to database
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error: dbError } = await supabase.from("inquiries").insert({
      service_type: subject,
      name,
      email,
      phone: phone || null,
      form_data: formData || {},
    });

    if (dbError) {
      console.error("DB insert error:", dbError);
    }

    // Send email via Resend if API key is configured
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

    if (RESEND_API_KEY) {
      const fieldDetails = formData
        ? Object.entries(formData)
            .filter(([_, v]) => v)
            .map(([k, v]) => `<p><strong>${k}:</strong> ${v}</p>`)
            .join("")
        : "";

      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #1a1a1a; border-bottom: 2px solid #e5a83b; padding-bottom: 10px;">
            New ${subject}
          </h2>
          <div style="background: #f9f9f9; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
          </div>
          ${fieldDetails ? `<div style="margin-top: 16px;">${fieldDetails}</div>` : ""}
          ${message ? `<div style="margin-top: 16px;"><strong>Message:</strong><p>${message}</p></div>` : ""}
        </div>
      `;

      try {
        const resendRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Policastro HQ <inquiries@updates.devinpolicastro.com>",
            to: ["devinpolicastro@gmail.com"],
            subject: `New ${subject} from ${name}`,
            html: emailHtml,
            reply_to: email,
          }),
        });

        if (!resendRes.ok) {
          const errText = await resendRes.text();
          console.error("Resend error:", errText);
        }
      } catch (emailErr) {
        console.error("Email send error:", emailErr);
      }
    } else {
      console.log("No RESEND_API_KEY configured. Inquiry saved to DB only:", { name, email, subject });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Inquiry received! Devin will get back to you soon." 
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
