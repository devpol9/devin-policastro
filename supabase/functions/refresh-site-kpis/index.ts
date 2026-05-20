import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const OWNER = "3461594b-dfe8-4227-b328-1cdae1ab49a0";
const NOTE = "Auto-refreshed from live site data";

// Impact Zone (read-only via anon key)
const IZ_URL = "https://qgfgemknktfupcvqdqtr.supabase.co";
const IZ_ANON =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFnZmdlbWtua3RmdXBjdnFkcXRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwMDcwNzIsImV4cCI6MjA4MTU4MzA3Mn0.QrcBHEG22bZvMsLtNObalTdesiumrA_Qw1iQGDmwzgk";

// 2THIRTY Shopify
const SHOP_DOMAIN = "03999f-2.myshopify.com";
const SHOP_API = `https://${SHOP_DOMAIN}/admin/api/2025-07/graphql.json`;

async function fetchShopifyWeekly(token: string, sinceISO: string) {
  let units = 0;
  let revenue = 0;
  let cursor: string | null = null;
  const query = `
    query($q: String!, $after: String) {
      orders(first: 50, query: $q, after: $after) {
        edges {
          cursor
          node {
            currentSubtotalLineItemsQuantity
            currentTotalPriceSet { shopMoney { amount } }
          }
        }
        pageInfo { hasNextPage }
      }
    }`;
  const qStr = `created_at:>=${sinceISO} AND financial_status:paid`;
  for (let i = 0; i < 20; i++) {
    const r = await fetch(SHOP_API, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": token },
      body: JSON.stringify({ query, variables: { q: qStr, after: cursor } }),
    });
    const j: any = await r.json();
    const edges = j?.data?.orders?.edges ?? [];
    for (const e of edges) {
      units += Number(e.node?.currentSubtotalLineItemsQuantity ?? 0);
      revenue += Number(e.node?.currentTotalPriceSet?.shopMoney?.amount ?? 0);
    }
    if (!j?.data?.orders?.pageInfo?.hasNextPage || edges.length === 0) break;
    cursor = edges[edges.length - 1].cursor;
  }
  return { units, revenue: Math.round(revenue * 100) / 100 };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
  const iz = createClient(IZ_URL, IZ_ANON, { auth: { persistSession: false } });

  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const headOpts = { count: "exact" as const, head: true };

  // Local site data
  const [pv, vis, chats, qual] = await Promise.all([
    supabase.from("analytics_events").select("id", headOpts)
      .eq("event_name", "page_view").gte("created_at", since),
    supabase.from("analytics_events").select("user_agent")
      .gte("created_at", since).not("user_agent", "is", null),
    supabase.from("chat_sessions").select("id", headOpts).gte("last_message_at", since),
    supabase.from("chat_sessions").select("id", headOpts)
      .in("lead_status", ["qualified", "hot"]).gte("last_message_at", since),
  ]);

  // Impact Zone data (anon-readable tables only)
  const [izInq, izComp, izFC] = await Promise.all([
    iz.from("contact_inquiries").select("id", headOpts).gte("created_at", since),
    iz.from("comp_session_inquiries").select("id", headOpts).gte("created_at", since),
    iz.from("membership_requests").select("id", headOpts)
      .gte("created_at", since).in("request_type", ["freeze", "cancel", "membership_cancel", "training_cancel"]),
  ]);

  // 2THIRTY Shopify (paid orders in last 7 days)
  const shopifyToken = Deno.env.get("SHOPIFY_ACCESS_TOKEN");
  let shopify = { units: 0, revenue: 0 };
  if (shopifyToken) {
    try {
      shopify = await fetchShopifyWeekly(shopifyToken, since);
    } catch (e) {
      console.error("Shopify fetch failed", e);
    }
  }

  const uniqueVisitors = new Set((vis.data || []).map((r: any) => r.user_agent)).size;

  const values: Record<string, number> = {
    "Weekly page views": pv.count ?? 0,
    "Weekly site visitors": uniqueVisitors,
    "Chatbot conversations / wk": chats.count ?? 0,
    "Qualified chat leads / wk": qual.count ?? 0,
    "IZ contact inquiries / wk": izInq.count ?? 0,
    "IZ free-trial signups / wk": izComp.count ?? 0,
    "IZ freeze + cancel / wk": izFC.count ?? 0,
    "2THIRTY units sold": shopify.units,
    "2THIRTY revenue": shopify.revenue,
  };

  const { data: kpis, error: kErr } = await supabase
    .from("kpis").select("id, name").eq("user_id", OWNER).in("name", Object.keys(values));
  if (kErr) return new Response(JSON.stringify({ error: kErr.message }),
    { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });

  const today = new Date().toISOString().slice(0, 10);
  const ids = (kpis || []).map((k: any) => k.id);
  const rows = (kpis || []).map((k: any) => ({
    kpi_id: k.id, value: values[k.name], entry_date: today, note: NOTE,
  }));

  if (ids.length) {
    await supabase.from("kpi_entries").delete()
      .in("kpi_id", ids).eq("entry_date", today).eq("note", NOTE);
    const { error: insErr } = await supabase.from("kpi_entries").insert(rows);
    if (insErr) return new Response(JSON.stringify({ error: insErr.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  return new Response(JSON.stringify({ ok: true, updated: rows.length, values }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } });
});
