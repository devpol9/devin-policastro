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

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const cutoff = new Date(Date.now() - SLA_HOURS * 60 * 60 * 1000).toISOString();

  const { data: stale, error } = await supabase
    .from("inquiries")
    .select("id, name, email, service_type, created_at, status, phone")
    .eq("status", "new")
    .lt("created_at", cutoff)
    .order("created_at", { ascending: true });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (!stale || stale.length === 0) {
    return new Response(
      JSON.stringify({ stale_count: 0, sent: false, message: "All caught up." }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const rowsHtml = stale.map((i) => {
    const ageHours = Math.floor((Date.now() - new Date(i.created_at).getTime()) / 3600000);
    return `<p style="margin:0 0 12px;font-size:14px;line-height:1.5;">
      <strong>${i.name}</strong> — ${i.service_type}
      <span style="color:#c44;font-weight:600;"> · ${ageHours}h old</span><br/>
      <a href="mailto:${i.email}" style="color:#c79b54;font-size:13px;">${i.email}</a>
      ${i.phone ? ` · <span style="color:#666;font-size:13px;">${i.phone}</span>` : ""}
      · <a href="https://admin.devinpolicastro.com/hq/inquiries/${i.id}" style="color:#c79b54;font-weight:600;">Open →</a>
    </p>`;
  }).join("");

  const today = new Date().toISOString().slice(0, 10);
  const { error: sendErr } = await supabase.functions.invoke("send-transactional-email", {
    body: {
      templateName: "notify-admin",
      recipientEmail: HQ_INBOX,
      idempotencyKey: `sla-alert-${today}-${stale.length}`,
      templateData: {
        title: `${stale.length} inquir${stale.length === 1 ? "y" : "ies"} waiting on you`,
        preheader: `Stale > ${SLA_HOURS}h — oldest first`,
        intro: `Status still "new" after more than ${SLA_HOURS} hours. Oldest first.`,
        bodyHtml: rowsHtml +
          `<p style="margin-top:16px;font-size:13px;"><a href="https://admin.devinpolicastro.com/hq/inquiries" style="color:#c79b54;font-weight:600;">Open the full inbox →</a></p>`,
      },
    },
  });

  if (sendErr) console.error("SLA alert send error:", sendErr);

  return new Response(
    JSON.stringify({ stale_count: stale.length, sent: !sendErr }),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
