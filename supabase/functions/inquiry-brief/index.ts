import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { inquiry_id } = await req.json();
    if (!inquiry_id) {
      return new Response(JSON.stringify({ error: "inquiry_id required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: inq, error: inqErr } = await supabase
      .from("inquiries").select("*").eq("id", inquiry_id).single();
    if (inqErr || !inq) {
      return new Response(JSON.stringify({ error: "inquiry not found" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Pull historical context: any prior inquiries from same email
    const { data: history } = await supabase
      .from("inquiries").select("service_type, created_at, form_data")
      .eq("email", inq.email).neq("id", inq.id)
      .order("created_at", { ascending: false }).limit(5);

    const formLines = Object.entries(inq.form_data || {})
      .filter(([k, v]) => v && !["website", "person_id", "ai_brief"].includes(k))
      .map(([k, v]) => `${k}: ${String(v)}`).join("\n");

    const historyBlock = history?.length
      ? `\nPrior inquiries from this email:\n${history.map((h: any) =>
          `- ${h.service_type} (${new Date(h.created_at).toISOString().slice(0,10)})`).join("\n")}`
      : "\nNo prior inquiries from this email.";

    const prompt = `You are Devin Policastro's chief of staff. A new inquiry just landed. In EXACTLY 3 short sentences write a tactical brief so Devin walks into the reply with context. No fluff, no greeting, no signoff.

Sentence 1 — Who they likely are (infer from name, email domain, company, role, city if present).
Sentence 2 — What they probably actually need (read between the lines of their message).
Sentence 3 — The single best opening question Devin should ask to qualify and move this forward.

INQUIRY:
Name: ${inq.name}
Email: ${inq.email}
Phone: ${inq.phone ?? "none"}
Service requested: ${inq.service_type}
${formLines}
${historyBlock}

Return ONLY the 3 sentences as plain text.`;

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

    if (!aiRes.ok) {
      const text = await aiRes.text();
      return new Response(JSON.stringify({ error: `AI gateway ${aiRes.status}`, detail: text }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await aiRes.json();
    const brief = (aiData.choices?.[0]?.message?.content ?? "").trim();
    if (!brief) {
      return new Response(JSON.stringify({ error: "empty brief" }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Persist into form_data.ai_brief + timestamp
    const nextFormData = {
      ...(inq.form_data || {}),
      ai_brief: brief,
      ai_brief_generated_at: new Date().toISOString(),
    };
    await supabase.from("inquiries")
      .update({ form_data: nextFormData }).eq("id", inquiry_id);

    return new Response(JSON.stringify({ brief, generated_at: nextFormData.ai_brief_generated_at }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
