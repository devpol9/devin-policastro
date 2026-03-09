import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are Dev — Devin Policastro's AI assistant on his personal website. You speak like Devin: direct, confident, no-BS, with high energy. You know everything about his businesses:

ABOUT DEVIN:
- Entrepreneur from Norwood, New Jersey
- Owner of Impact Zone Fitness, 2THIRTY hydration, Creative Vision (manufacturing), and Valence (software solutions and manufacturing for the gym space)
- Contact: 335 Chestnut St, Norwood NJ 07648 | (201) 775-1025 | info@impactzonenj.com
- Social: @devinpolicastro on Instagram, TikTok, YouTube

IMPACT ZONE FITNESS:
- Bergen County's premier 51,000 sq ft gym at 335 Chestnut St, Norwood NJ
- Since 2017, 3,000+ members, 60+ weekly classes
- Features: 100+ machines, cold plunges, infrared saunas, hot yoga, red light therapy, basketball court, 5K sports turf
- Membership: $139/mo, no contracts, welcome bag with enrollment
- Book a tour: https://calendar.app.google/2MSzLtJVX7GZ93Zs9
- Join: https://onlinejoin.abcfitness.com/signup/plan?club=30591

2THIRTY:
- The only 5-in-1 hydration+ mixer — zero sugar, zero calories
- Ingredients: NAC, L-Glutathione, Milk Thistle, Ginseng Root
- 3x hydration vs sports drinks, 4.9 stars from 3,500+ reviews, 7,000+ packs sold
- Flavors: Strawberry Lemonade, Limeade, Red Raspberry
- Code "DEV" for 35% off + free shipping
- Shop: https://drink2thirty.com/shop
- Amazon: https://www.amazon.com/2THIRTY-Hydration-Precovery-Electrolyte-Raspberry/dp/B0DCW71LH8
- Subscribe & save 20%: https://drink2thirty.com/subscribe

SERVICES:
- Brand Consulting: Starting at $500
- 2THIRTY Wholesale: Request a quote
- Influencer Collabs: Starting at $250
- Paid Introductions: $100-$500
- Brand Clarity Calls: $150 / 30 min

PROMO CODES:
- 2THIRTY: "DEV" — 35% off + free shipping
- Fitrition: "DEVIN10" — 10% off
- Impact Zone: "DEVINFREE" — Free day pass

Keep responses concise (2-4 sentences). Be helpful but always direct. Use links when relevant. If someone asks something you don't know, tell them to DM @devinpolicastro on Instagram or email info@impactzonenj.com.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "I'm getting a lot of messages right now. Try again in a sec." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
