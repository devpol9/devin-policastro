import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SITE = "https://devinpolicastro.com";
const ADMIN = "https://admin.devinpolicastro.com";

function esc(s: string | null) {
  if (!s) return "";
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString();

    const { data: stale, error } = await supabase
      .from("people")
      .select("id, name, email, phone, company, role, relationship_strength, last_contacted_at")
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

    const daysSince = (iso: string | null) =>
      iso == null ? "never" : `${Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)}d ago`;

    const rowsHtml = stale.map((p) => {
      const meta = [p.role, p.company].filter(Boolean).join(" · ");
      const stars = "★".repeat(p.relationship_strength ?? 0);
      return `<p style="margin:0 0 14px;padding:0 0 14px;border-bottom:1px solid #e9e6df;">
        <strong style="color:#0f0f0f;">${esc(p.name)}</strong>
        ${meta ? `<span style="color:#5b5b5b;font-size:13px;"> — ${esc(meta)}</span>` : ""}<br/>
        <span style="color:#c79b54;font-size:12px;">${stars}</span>
        <span style="color:#5b5b5b;font-size:12px;"> · last contact ${daysSince(p.last_contacted_at)}</span><br/>
        ${p.email ? `<a href="mailto:${esc(p.email)}" style="color:#c79b54;font-size:13px;font-weight:600;">Email</a>` : ""}
        ${p.phone ? ` · <a href="tel:${esc(p.phone)}" style="color:#5b5b5b;font-size:13px;">Call</a>` : ""}
         · <a href="${ADMIN}/hq/people?person=${p.id}" style="color:#5b5b5b;font-size:13px;">Open card →</a>
      </p>`;
    }).join("");

    const week = new Date().toISOString().slice(0, 10);
    await supabase.functions.invoke("send-transactional-email", {
      body: {
        templateName: "notify-admin",
        recipientEmail: "devinpolicastro@gmail.com",
        idempotencyKey: `stale-nudge-${week}`,
        templateData: {
          title: "Reach out this week",
          preheader: `${stale.length} strong contact${stale.length === 1 ? "" : "s"} gone quiet`,
          intro: `${stale.length} strong contact${stale.length === 1 ? "" : "s"} you haven't touched in 30+ days. One text keeps the relationship warm.`,
          bodyHtml: rowsHtml +
            `<p style="margin-top:12px;font-size:13px;"><a href="${ADMIN}/hq/people?filter=stale" style="color:#c79b54;font-weight:600;">Open the full list →</a></p>`,
        },
      },
    });

    return new Response(JSON.stringify({ ok: true, sent: true, count: stale.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
