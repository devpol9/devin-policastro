import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PLAYBOOK_URL = "https://vprroffyczhnalpwwltf.supabase.co/storage/v1/object/public/lead-magnets/nj-entrepreneur-playbook.pdf";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { name, email, source } = await req.json();
    if (!name || !email || !/^\S+@\S+\.\S+$/.test(email)) {
      return new Response(JSON.stringify({ error: "Valid name and email required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Find admin user to own the new person record
    const { data: roles } = await supabase.from("user_roles").select("user_id").eq("role", "admin");
    const adminId = roles?.[0]?.user_id;

    if (adminId) {
      // Upsert by email — append lead-magnet tag if person exists
      const { data: existing } = await supabase
        .from("people")
        .select("id, tags")
        .eq("user_id", adminId)
        .eq("email", email.toLowerCase())
        .maybeSingle();

      if (existing) {
        const tags = Array.from(new Set([...(existing.tags || []), "lead-magnet"]));
        await supabase.from("people").update({ tags, last_contacted_at: new Date().toISOString() }).eq("id", existing.id);
      } else {
        await supabase.from("people").insert({
          user_id: adminId,
          name: name.slice(0, 120),
          email: email.toLowerCase(),
          source: source || "playbook",
          tags: ["lead-magnet"],
          notes: "Downloaded the NJ Entrepreneur Playbook",
        });
      }

      // Log a capture so it lights up the HQ signal feed
      await supabase.from("quick_captures").insert({
        user_id: adminId,
        kind: "lead",
        title: `Playbook download — ${name}`,
        body: `${name} (${email}) downloaded the NJ Entrepreneur Playbook${source ? ` via ${source}` : ""}.`,
        tags: ["lead-magnet", "playbook"],
        meta: { email, name, source: source || "playbook" },
      });
    }

    // Send PDF via Resend
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (RESEND_API_KEY) {
      const html = `
<div style="font-family:-apple-system,Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;color:#111;">
  <p style="font-size:11px;letter-spacing:.15em;color:#B07A52;margin:0 0 18px;text-transform:uppercase;">The Playbook</p>
  <h1 style="font-size:26px;line-height:1.2;margin:0 0 16px;color:#000;">Here it is, ${name.split(" ")[0]}.</h1>
  <p style="font-size:15px;line-height:1.55;margin:0 0 18px;">The NJ Entrepreneur Playbook — 11 lessons from building 7 businesses in New Jersey. Cost me real money to learn. Free to you.</p>
  <p style="margin:28px 0;">
    <a href="${PLAYBOOK_URL}" style="background:#000;color:#fff;text-decoration:none;padding:14px 24px;border-radius:6px;font-weight:600;font-size:15px;display:inline-block;">Download the PDF</a>
  </p>
  <p style="font-size:14px;line-height:1.55;margin:24px 0 8px;">Read it tonight. Reply and tell me which chapter hit hardest — I read every one.</p>
  <p style="font-size:14px;line-height:1.55;margin:18px 0 4px;">If you need help on a specific piece — consulting, content, manufacturing, financing, automotive, fitness, or networking — everything lives at <a href="https://devinpolicastro.com" style="color:#B07A52;">devinpolicastro.com</a>.</p>
  <p style="font-size:14px;margin:28px 0 0;">Stay sharp,<br/><strong>Devin Policastro</strong></p>
  <hr style="border:none;border-top:1px solid #eee;margin:32px 0 16px;"/>
  <p style="font-size:11px;color:#888;line-height:1.4;margin:0;">You're receiving this because you requested the playbook at devinpolicastro.com.</p>
</div>`;

      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
        body: JSON.stringify({
          from: "Devin Policastro <inquiries@updates.devinpolicastro.com>",
          to: [email],
          bcc: ["dev@devinpolicastro.com", "devinpolicastro@gmail.com"],
          reply_to: "dev@devinpolicastro.com",
          subject: "The NJ Entrepreneur Playbook — your copy inside",
          html,
        }),
      });
    }

    return new Response(JSON.stringify({ ok: true, downloadUrl: PLAYBOOK_URL }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("capture-lead-magnet error", e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
