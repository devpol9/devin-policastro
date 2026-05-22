import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const HQ_INBOX = "devinpolicastro@gmail.com";
const SLA_HOURS = 24;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const cutoff = new Date(Date.now() - SLA_HOURS * 60 * 60 * 1000).toISOString();

  const { data: stale, error } = await supabase
    .from("inquiries")
    .select("id, name, email, service_type, created_at, status, phone")
    .eq("status", "new")
    .lt("created_at", cutoff)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Fetch stale inquiries error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (!stale || stale.length === 0) {
    return new Response(
      JSON.stringify({ stale_count: 0, sent: false, message: "All caught up." }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  if (!RESEND_API_KEY) {
    return new Response(
      JSON.stringify({ stale_count: stale.length, sent: false, message: "RESEND_API_KEY missing" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const rows = stale
    .map((i) => {
      const ageHours = Math.floor((Date.now() - new Date(i.created_at).getTime()) / (1000 * 60 * 60));
      return `
        <tr>
          <td style="padding: 12px 8px; border-bottom: 1px solid #eee; font-size: 14px;">
            <strong>${i.name}</strong><br/>
            <a href="mailto:${i.email}" style="color: #b78a5e; font-size: 12px;">${i.email}</a>
            ${i.phone ? `<br/><span style="color: #888; font-size: 12px;">${i.phone}</span>` : ""}
          </td>
          <td style="padding: 12px 8px; border-bottom: 1px solid #eee; font-size: 13px; color: #333;">
            ${i.service_type}
          </td>
          <td style="padding: 12px 8px; border-bottom: 1px solid #eee; font-size: 13px; color: #c44; text-align: right; white-space: nowrap;">
            ${ageHours}h old
          </td>
          <td style="padding: 12px 8px; border-bottom: 1px solid #eee; text-align: right;">
            <a href="https://devinpolicastro.com/hq/inquiries/${i.id}" style="color: #b78a5e; font-size: 13px; font-weight: 600; text-decoration: none;">Open →</a>
          </td>
        </tr>`;
    })
    .join("");

  const html = `
    <div style="font-family: -apple-system, Segoe UI, Arial, sans-serif; max-width: 640px; margin: 0 auto; padding: 32px 24px; color: #1a1a1a;">
      <h1 style="font-size: 22px; margin: 0 0 8px;">${stale.length} inquir${stale.length === 1 ? "y" : "ies"} waiting on you</h1>
      <p style="font-size: 14px; color: #666; margin: 0 0 24px;">
        Status still "new" after more than ${SLA_HOURS} hours. Oldest first.
      </p>
      <table style="width: 100%; border-collapse: collapse; border-top: 2px solid #1a1a1a;">
        ${rows}
      </table>
      <p style="font-size: 13px; color: #666; margin: 24px 0 0;">
        <a href="https://devinpolicastro.com/hq/inquiries" style="color: #b78a5e; font-weight: 600;">Open the full inbox →</a>
      </p>
    </div>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Devin HQ <inquiries@updates.devinpolicastro.com>",
        to: [HQ_INBOX],
        subject: `${stale.length} stale inquir${stale.length === 1 ? "y" : "ies"} — needs reply`,
        html,
      }),
    });
    if (!res.ok) {
      const txt = await res.text();
      console.error("Resend SLA alert error:", txt);
      return new Response(JSON.stringify({ stale_count: stale.length, sent: false, error: txt }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } catch (err) {
    console.error("SLA alert send error:", err);
    return new Response(
      JSON.stringify({ stale_count: stale.length, sent: false, error: String(err) }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  return new Response(
    JSON.stringify({ stale_count: stale.length, sent: true }),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
});
