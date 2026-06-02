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
            to: ["dev@devinpolicastro.com", "devinpolicastro@gmail.com"],
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

      // Auto-reply to the inquirer
      const firstName = name.split(/\s+/)[0] || name;
      const autoReplyHtml = `
        <div style="font-family: -apple-system, Segoe UI, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; color: #1a1a1a; line-height: 1.55;">
          <p style="font-size: 16px; margin: 0 0 16px;">Hey ${firstName},</p>
          <p style="font-size: 16px; margin: 0 0 16px;">
            Got your <strong>${subject}</strong> — it's in front of me, not buried in a queue. I read every inquiry myself and usually reply within 24 hours (often same day).
          </p>
          <p style="font-size: 16px; margin: 0 0 16px;">
            While you wait, grab the free <a href="https://devinpolicastro.com/playbook" style="color: #b78a5e; font-weight: 600;">NJ Entrepreneur Playbook</a> — 11 lessons from building 7 businesses here in Bergen County.
          </p>
          <p style="font-size: 16px; margin: 0 0 24px;">
            Talk soon,<br/>
            <strong>Devin Policastro</strong><br/>
            <span style="color: #666; font-size: 14px;">Norwood, NJ</span>
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
          <p style="font-size: 12px; color: #888; margin: 0;">
            You're getting this because you submitted an inquiry at devinpolicastro.com. Reply directly to this email and it'll come to me.
          </p>
        </div>
      `;

      try {
        const autoRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Devin Policastro <inquiries@updates.devinpolicastro.com>",
            to: [email],
            subject: `Got it, ${firstName} — talk soon`,
            html: autoReplyHtml,
            reply_to: "dev@devinpolicastro.com",
          }),
        });
        if (!autoRes.ok) {
          const errText = await autoRes.text();
          console.error("Auto-reply error:", errText);
        }
      } catch (autoErr) {
        console.error("Auto-reply send error:", autoErr);
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
