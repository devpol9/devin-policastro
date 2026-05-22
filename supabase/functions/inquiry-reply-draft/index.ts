import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { inquiry_id, tone } = await req.json();
    if (!inquiry_id) {
      return new Response(JSON.stringify({ error: "inquiry_id required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: inq, error } = await supabase
      .from("inquiries").select("*").eq("id", inquiry_id).single();
    if (error || !inq) {
      return new Response(JSON.stringify({ error: "inquiry not found" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const formLines = Object.entries(inq.form_data || {})
      .filter(([k, v]) => v && !["website", "person_id", "ai_brief", "ai_brief_generated_at"].includes(k))
      .map(([k, v]) => `${k}: ${String(v)}`).join("\n");

    const aiBrief = (inq.form_data as any)?.ai_brief ?? "";
    const toneLabel = tone === "warm" ? "warm and personal" : tone === "direct" ? "blunt and direct" : "friendly but no-BS";
    const firstName = (inq.name || "").split(" ")[0] || "there";

    const prompt = `You are drafting an email reply AS Devin Policastro — a no-BS NJ entrepreneur who connects people. Direct, warm, never corporate, never starts with "I hope this finds you well". Write at a 6th-grade reading level.

REPLY RULES:
- Subject line first, then a blank line, then the body.
- Body: 4 short lines MAX. Acknowledge what they want, give one real next step (call, quick reply, intro), end with a question or clear CTA.
- Sign "— Devin"
- No emojis. No "Best regards". No "Looking forward to hearing from you". No "Thank you for reaching out".
- Tone: ${toneLabel}.
- Greeting uses their first name: "${firstName},"

CONTEXT:
Service requested: ${inq.service_type}
${formLines}
${aiBrief ? `\nChief of staff brief: ${aiBrief}` : ""}

Return the email exactly in this format:
Subject: <subject>

<greeting>

<body>

— Devin`;

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (aiRes.status === 429) {
      return new Response(JSON.stringify({ error: "Rate limited, try again in a moment." }), {
        status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (aiRes.status === 402) {
      return new Response(JSON.stringify({ error: "AI credits exhausted. Top up in Settings → Workspace → Usage." }), {
        status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!aiRes.ok) {
      const t = await aiRes.text();
      return new Response(JSON.stringify({ error: `AI gateway ${aiRes.status}`, detail: t }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await aiRes.json();
    const raw = (aiData.choices?.[0]?.message?.content ?? "").trim();
    if (!raw) {
      return new Response(JSON.stringify({ error: "empty draft" }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Split subject from body
    const subjMatch = raw.match(/^Subject:\s*(.+?)\n([\s\S]*)$/i);
    const subject = subjMatch ? subjMatch[1].trim() : `Re: ${inq.service_type}`;
    const body = subjMatch ? subjMatch[2].trim() : raw;

    return new Response(JSON.stringify({ subject, body, full: raw }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
