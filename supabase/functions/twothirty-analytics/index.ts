import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const SHOP_DOMAIN = "03999f-2.myshopify.com";
const SHOP_API = `https://${SHOP_DOMAIN}/admin/api/2025-07/graphql.json`;

async function fetchOrders(token: string, sinceISO: string) {
  let units = 0;
  let revenue = 0;
  let orderCount = 0;
  const productMap = new Map<string, { title: string; units: number; revenue: number }>();
  const daily = new Map<string, { revenue: number; units: number; orders: number }>();
  let cursor: string | null = null;

  const query = `
    query($q: String!, $after: String) {
      orders(first: 50, query: $q, after: $after, sortKey: CREATED_AT, reverse: true) {
        edges {
          cursor
          node {
            id
            createdAt
            currentSubtotalLineItemsQuantity
            currentTotalPriceSet { shopMoney { amount currencyCode } }
            lineItems(first: 25) {
              edges {
                node {
                  title
                  quantity
                  originalTotalSet { shopMoney { amount } }
                  product { id }
                }
              }
            }
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
      const n = e.node;
      orderCount += 1;
      const orderRev = Number(n?.currentTotalPriceSet?.shopMoney?.amount ?? 0);
      const orderUnits = Number(n?.currentSubtotalLineItemsQuantity ?? 0);
      revenue += orderRev;
      units += orderUnits;

      const day = (n?.createdAt ?? "").slice(0, 10);
      if (day) {
        const d = daily.get(day) ?? { revenue: 0, units: 0, orders: 0 };
        d.revenue += orderRev;
        d.units += orderUnits;
        d.orders += 1;
        daily.set(day, d);
      }

      for (const li of n?.lineItems?.edges ?? []) {
        const pid = li.node?.product?.id ?? li.node?.title;
        const t = li.node?.title ?? "Unknown";
        const q = Number(li.node?.quantity ?? 0);
        const rev = Number(li.node?.originalTotalSet?.shopMoney?.amount ?? 0);
        const cur = productMap.get(pid) ?? { title: t, units: 0, revenue: 0 };
        cur.units += q;
        cur.revenue += rev;
        productMap.set(pid, cur);
      }
    }
    if (!j?.data?.orders?.pageInfo?.hasNextPage || edges.length === 0) break;
    cursor = edges[edges.length - 1].cursor;
  }

  const topProducts = [...productMap.values()]
    .sort((a, b) => b.units - a.units)
    .slice(0, 5)
    .map((p) => ({ ...p, revenue: Math.round(p.revenue * 100) / 100 }));

  const dailySeries = [...daily.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([day, v]) => ({ day, revenue: Math.round(v.revenue * 100) / 100, units: v.units, orders: v.orders }));

  return {
    units,
    revenue: Math.round(revenue * 100) / 100,
    orders: orderCount,
    aov: orderCount > 0 ? Math.round((revenue / orderCount) * 100) / 100 : 0,
    topProducts,
    daily: dailySeries,
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const token = Deno.env.get("SHOPIFY_ACCESS_TOKEN");
  if (!token) {
    return new Response(JSON.stringify({ error: "SHOPIFY_ACCESS_TOKEN not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let days = 30;
  try {
    if (req.method === "POST") {
      const body = await req.json().catch(() => ({}));
      if (body?.days) days = Math.max(1, Math.min(365, Number(body.days)));
    } else {
      const p = new URL(req.url).searchParams.get("days");
      if (p) days = Math.max(1, Math.min(365, Number(p)));
    }
  } catch { /* ignore */ }

  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

  try {
    const data = await fetchOrders(token, since);
    return new Response(JSON.stringify({ ok: true, days, since, ...data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("[twothirty-analytics] failed", e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
