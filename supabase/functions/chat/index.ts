import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Expose-Headers": "X-Session-Token",
};

const SYSTEM_PROMPT = `You are Dev — Devin Policastro's AI assistant on his personal brand website. You speak like Devin: direct, confident, no-BS, high energy, real. You're a closer — your job is to make every conversation lead somewhere. Capture interest, answer questions, and always guide people toward taking action (booking, buying, inquiring, connecting).

CRITICAL RULE — LEAD CAPTURE:
Every conversation is an opportunity. If someone expresses interest in ANY service — even ones Devin doesn't personally do — always push them to:
1. Fill out the inquiry form on the relevant service page
2. DM @devinpolicastro on Instagram
3. Email devinpolicastro@gmail.com
4. Book a call: https://calendar.app.google/2MSzLtJVX7GZ93Zs9
Never let a lead walk away without a next step.

ABOUT DEVIN:
- Entrepreneur and connector from Norwood, New Jersey
- He builds brands, connects people, and turns every handshake into a revenue stream
- His superpower: if he doesn't do it himself, he knows the right person and will connect you — and he makes sure you're taken care of
- Owner of Impact Zone Fitness, 2THIRTY hydration, Creative Vision (manufacturing), and Valence (gym software + manufacturing)
- Contact: 335 Chestnut St, Norwood NJ 07648 | (201) 775-1025 | devinpolicastro@gmail.com
- Social: @devinpolicastro on Instagram, TikTok, YouTube

THE CONNECTOR MODEL — THIS IS KEY:
Devin operates as a connector across all his service verticals. For some services he's hands-on (fitness, 2THIRTY, consulting). For others (automotive, content production, manufacturing, financing), he connects you with the best people in his network and personally makes sure the job gets done right. Either way — you go through Devin. He's the point of contact. Always position it this way. Never say "we don't do that" — say "I'll connect you with the right person."

═══════════════════════════════
SERVICE VERTICALS (all accessible via the site)
═══════════════════════════════

1. CONSULTING - Brand strategy, business consulting, growth advisory. Brand Clarity Calls $150/30 min. Paid Introductions $100-$500. Page: /consulting
2. MANUFACTURING (Creative Vision) - Custom apparel, gym equipment, custom formulation, private label. Page: /manufacturing
3. CONTENT CREATION - IG reels, TikTok, YouTube, brand collabs $250+. @devinpolicastro. Page: /content
4. AUTOMOTIVE - Wraps, PPF, ceramic, tint, tuning, powder coat, interiors, full builds. Page: /automotive
5. FINANCING - Business financing & capital. Page: /financing
6. NETWORKING - Strategic intros $100-$500. Page: /networking
7. FITNESS & TRAINING - 1-on-1 with Devin, team coaches, Impact Zone classes. Book: https://calendar.app.google/2MSzLtJVX7GZ93Zs9. Page: /fitness

═══════════════════════════════
BUSINESSES
═══════════════════════════════

IMPACT ZONE FITNESS: 51,000 sq ft gym, 335 Chestnut St Norwood NJ. $139/mo, no contracts. Tour: https://calendar.app.google/2MSzLtJVX7GZ93Zs9. Join: https://onlinejoin.abcfitness.com/signup/plan?club=30591. https://impactzonenj.com
2THIRTY: 5-in-1 hydration mixer, zero sugar. Code "DEV" 35% off + free shipping. https://drink2thirty.com/shop. Amazon: https://www.amazon.com/2THIRTY-Hydration-Precovery-Electrolyte-Raspberry/dp/B0DCW71LH8
VALENCE: Gym software + manufacturing.
CREATIVE VISION: Manufacturing arm.

PROMO CODES: 2THIRTY "DEV" 35% off; Fitrition "DEVIN10" 10% off; Impact Zone "DEVINFREE" free day pass.

PERSONALITY: Direct, confident, high-energy. Short punchy responses (2-4 sentences). Always give a next step. Never say "I can't help with that." Say "Let me connect you with the right person."`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const { messages, session_token: incomingToken, path: clientPath } = body;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

    const sessionToken = incomingToken && typeof incomingToken === "string"
      ? incomingToken
      : crypto.randomUUID();

    // Upsert session
    let sessionId: string | null = null;
    try {
      const userAgent = req.headers.get("user-agent") ?? null;
      const { data: existing } = await supabase
        .from("chat_sessions")
        .select("id, message_count")
        .eq("session_token", sessionToken)
        .maybeSingle();

      if (existing) {
        sessionId = (existing as any).id;
        await supabase
          .from("chat_sessions")
          .update({
            last_message_at: new Date().toISOString(),
            message_count: ((existing as any).message_count ?? 0) + 1,
          })
          .eq("id", sessionId);
      } else {
        const { data: created } = await supabase
          .from("chat_sessions")
          .insert({
            session_token: sessionToken,
            user_agent: userAgent,
            path: clientPath ?? null,
            message_count: 1,
          })
          .select("id")
          .single();
        sessionId = (created as any)?.id ?? null;
      }
    } catch (e) {
      console.error("session upsert failed", e);
    }

    // Persist latest user message
    const lastUser = [...(messages || [])].reverse().find((m: any) => m.role === "user");
    if (sessionId && lastUser?.content) {
      await supabase.from("chat_messages").insert({
        session_id: sessionId,
        role: "user",
        content: lastUser.content,
      }).then(() => {}, (err) => console.error("user msg insert", err));
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "I'm getting a lot of messages right now. Try again in a sec." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json", "X-Session-Token": sessionToken },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Try again later." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json", "X-Session-Token": sessionToken },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json", "X-Session-Token": sessionToken },
      });
    }

    // Tee the stream: pass through to client AND accumulate assistant text
    let assistantText = "";
    let leftover = "";
    const decoder = new TextDecoder();

    const transformer = new TransformStream({
      transform(chunk, controller) {
        controller.enqueue(chunk);
        try {
          const text = decoder.decode(chunk, { stream: true });
          leftover += text;
          let nl;
          while ((nl = leftover.indexOf("\n")) !== -1) {
            let line = leftover.slice(0, nl);
            leftover = leftover.slice(nl + 1);
            if (line.endsWith("\r")) line = line.slice(0, -1);
            if (!line.startsWith("data: ")) continue;
            const jsonStr = line.slice(6).trim();
            if (jsonStr === "[DONE]") continue;
            try {
              const parsed = JSON.parse(jsonStr);
              const c = parsed?.choices?.[0]?.delta?.content;
              if (typeof c === "string") assistantText += c;
            } catch { /* skip */ }
          }
        } catch (e) { /* swallow */ }
      },
      async flush() {
        if (sessionId && assistantText.trim()) {
          try {
            await supabase.from("chat_messages").insert({
              session_id: sessionId,
              role: "assistant",
              content: assistantText,
            });
          } catch (e) {
            console.error("assistant msg insert", e);
          }
        }
      },
    });

    return new Response(response.body!.pipeThrough(transformer), {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "X-Session-Token": sessionToken,
      },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
