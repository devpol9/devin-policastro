import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const [capturesRes, inquiriesRes, pillarsRes] = await Promise.all([
      supabase.from("quick_captures")
        .select("title, body, tags, created_at")
        .eq("user_id", user.id)
        .eq("archived", false)
        .order("created_at", { ascending: false })
        .limit(20),
      supabase.from("inquiries")
        .select("service_type, form_data, created_at")
        .order("created_at", { ascending: false })
        .limit(10),
      supabase.from("content_pillars")
        .select("name, description")
        .eq("user_id", user.id),
    ]);

    const captures = (capturesRes.data ?? [])
      .map((c: any) => `- ${c.title ? c.title + ": " : ""}${(c.body || "").slice(0, 240)}`)
      .join("\n");

    const inquiries = (inquiriesRes.data ?? [])
      .map((i: any) => {
        const msg = i.form_data?.message || i.form_data?.notes || "";
        return `- [${i.service_type}] ${String(msg).slice(0, 200)}`;
      })
      .join("\n");

    const pillarList = (pillarsRes.data ?? []).map((p: any) => p.name).join(", ") || "none";

    const systemPrompt = `You are Devin Policastro's content strategist. Devin is a no-BS NJ entrepreneur — owner of Impact Zone (combat sports gym), 2THIRTY apparel, Valence, and connector for ambitious operators. Voice: direct, plainspoken, confident, no corporate fluff. Generate 5 social post ideas grounded in his recent thoughts and inbound demand. Pillars available: ${pillarList}.`;

    const userPrompt = `RECENT IDEAS / NOTES:\n${captures || "(none)"}\n\nRECENT INBOUND INQUIRIES:\n${inquiries || "(none)"}\n\nReturn 5 distinct post ideas. Mix platforms (instagram, tiktok, youtube, x, linkedin). Each idea: a punchy hook (one line, hooky, scroll-stopping), an angle (2 sentences explaining the story/payoff), suggested platform, and optional pillar from the list.`;

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [{
          type: "function",
          function: {
            name: "post_ideas",
            description: "Return 5 social post ideas",
            parameters: {
              type: "object",
              properties: {
                ideas: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      hook: { type: "string" },
                      angle: { type: "string" },
                      platform: { type: "string", enum: ["instagram", "tiktok", "youtube", "x", "linkedin", "threads"] },
                      pillar: { type: "string" },
                    },
                    required: ["hook", "angle", "platform"],
                    additionalProperties: false,
                  },
                },
              },
              required: ["ideas"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "post_ideas" } },
      }),
    });

    if (!aiRes.ok) {
      const txt = await aiRes.text();
      if (aiRes.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit hit. Try again in a minute." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiRes.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      console.error("AI error", aiRes.status, txt);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiJson = await aiRes.json();
    const call = aiJson.choices?.[0]?.message?.tool_calls?.[0];
    const args = call ? JSON.parse(call.function.arguments) : { ideas: [] };

    return new Response(JSON.stringify(args), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
