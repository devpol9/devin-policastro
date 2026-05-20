import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const OWNER = "3461594b-dfe8-4227-b328-1cdae1ab49a0";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  // Pull live values
  const [pv, vis, chats, qual] = await Promise.all([
    supabase.from("analytics_events").select("id", { count: "exact", head: true })
      .eq("event_name", "page_view").gte("created_at", since),
    supabase.from("analytics_events").select("user_agent")
      .gte("created_at", since).not("user_agent", "is", null),
    supabase.from("chat_sessions").select("id", { count: "exact", head: true })
      .gte("last_message_at", since),
    supabase.from("chat_sessions").select("id", { count: "exact", head: true })
      .in("lead_status", ["qualified", "hot"]).gte("last_message_at", since),
  ]);

  const uniqueVisitors = new Set((vis.data || []).map((r: any) => r.user_agent)).size;

  const values: Record<string, number> = {
    "Weekly page views": pv.count ?? 0,
    "Weekly site visitors": uniqueVisitors,
    "Chatbot conversations / wk": chats.count ?? 0,
    "Qualified chat leads / wk": qual.count ?? 0,
  };

  const { data: kpis, error: kErr } = await supabase
    .from("kpis").select("id, name").eq("user_id", OWNER).in("name", Object.keys(values));
  if (kErr) return new Response(JSON.stringify({ error: kErr.message }),
    { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });

  const today = new Date().toISOString().slice(0, 10);
  const rows = (kpis || []).map((k: any) => ({
    kpi_id: k.id, value: values[k.name], entry_date: today,
    note: "Auto-refreshed from live site data",
  }));

  // Replace today's auto-entries
  await supabase.from("kpi_entries").delete()
    .in("kpi_id", (kpis || []).map((k: any) => k.id))
    .eq("entry_date", today).eq("note", "Auto-refreshed from live site data");

  const { error: insErr } = await supabase.from("kpi_entries").insert(rows);
  if (insErr) return new Response(JSON.stringify({ error: insErr.message }),
    { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });

  return new Response(JSON.stringify({ ok: true, updated: rows.length, values }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } });
});
