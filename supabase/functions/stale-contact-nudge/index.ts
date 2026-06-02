import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SITE = "https://devinpolicastro.com";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString();

    // Strong (★3+) contacts not contacted in 30+ days (or never)
    const { data: stale, error } = await supabase
      .from("people")
      .select("id, name, email, phone, company, role, relationship_strength, last_contacted_at, tags")
      .gte("relationship_strength", 3)
      .or(`last_contacted_at.lt.${thirtyDaysAgo},last_contacted_at.is.null`)
      .order("relationship_strength", { ascending: false })
      .order("last_contacted_at", { ascending: true, nullsFirst: true })
      .limit(10);

    if (error) throw error;

    if (!stale || stale.length === 0) {
      return new Response(JSON.stringify({ ok: true, sent: false, reason: "no stale contacts" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const daysSince = (iso: string | null) => iso == null
      ? "never"
      : `${Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)}d ago`;

    const rows = stale.map((p) => {
      const meta = [p.role, p.company].filter(Boolean).join(" · ");
      const stars = "★".repeat(p.relationship_strength ?? 0);
      return `
        <tr>
          <td style="padding:12px 14px;border-bottom:1px solid #1a1a1a;vertical-align:top;">
            <div style="font-weight:600;color:#fff;">${escape(p.name)}</div>
            ${meta ? `<div style="font-size:12px;color:#888;margin-top:2px;">${escape(meta)}</div>` : ""}
            <div style="font-size:11px;color:#c9a37a;margin-top:4px;letter-spacing:0.04em;">${stars} · last contact ${daysSince(p.last_contacted_at)}</div>
          </td>
          <td style="padding:12px 14px;border-bottom:1px solid #1a1a1a;text-align:right;vertical-align:top;white-space:nowrap;">
            ${p.email ? `<a href="mailto:${encodeURIComponent(p.email)}" style="color:#c9a37a;text-decoration:none;font-size:12px;display:block;">Email</a>` : ""}
            ${p.phone ? `<a href="tel:${encodeURIComponent(p.phone)}" style="color:#888;text-decoration:none;font-size:12px;display:block;margin-top:4px;">Call</a>` : ""}
            <a href="${SITE}/hq/people?person=${p.id}" style="color:#888;text-decoration:none;font-size:11px;display:block;margin-top:4px;">Open card →</a>
          </td>
        </tr>`;
    }).join("");

    const html = `<!DOCTYPE html><html><body style="margin:0;background:#000;color:#fff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
      <div style="max-width:560px;margin:0 auto;padding:32px 20px;">
        <div style="font-size:11px;letter-spacing:0.18em;color:#c9a37a;margin-bottom:8px;">Sunday nudge</div>
        <h1 style="font-size:26px;line-height:1.1;margin:0 0 8px 0;font-weight:800;">Reach out this week.</h1>
        <p style="color:#888;font-size:14px;line-height:1.5;margin:0 0 20px 0;">
          ${stale.length} strong contact${stale.length === 1 ? "" : "s"} you haven't touched in 30+ days. One text keeps the relationship warm.
        </p>
        <table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;background:#0a0a0a;border:1px solid #1a1a1a;border-radius:8px;">
          ${rows}
        </table>
        <p style="color:#666;font-size:12px;margin-top:20px;line-height:1.5;">
          From HQ · <a href="${SITE}/hq/people?filter=stale" style="color:#c9a37a;text-decoration:none;">Open the full list</a>
        </p>
      </div>
    </body></html>`;

    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) throw new Error("RESEND_API_KEY missing");

    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "HQ <inquiries@updates.devinpolicastro.com>",
        to: ["dev@devinpolicastro.com", "devinpolicastro@gmail.com"],
        subject: `${stale.length} stale contact${stale.length === 1 ? "" : "s"} — Sunday nudge`,
        html,
      }),
    });

    if (!emailRes.ok) {
      const t = await emailRes.text();
      throw new Error(`Resend ${emailRes.status}: ${t}`);
    }

    return new Response(JSON.stringify({ ok: true, sent: true, count: stale.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function escape(s: string | null) {
  if (!s) return "";
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}
