import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type Step = 1 | 2 | 3;

interface StepDef {
  step: Step;
  daysAfter: number;
  subject: (firstName: string) => string;
  html: (firstName: string) => string;
}

const wrap = (inner: string) => `
<div style="font-family: -apple-system, Segoe UI, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; color: #1a1a1a; line-height: 1.6;">
  ${inner}
  <hr style="border: none; border-top: 1px solid #eee; margin: 28px 0 16px;" />
  <p style="font-size: 12px; color: #888; margin: 0;">
    You're getting this because you grabbed the NJ Entrepreneur Playbook. Reply with "stop" and I'll take you off.
  </p>
</div>`;

const signature = `
<p style="font-size: 16px; margin: 24px 0 0;">
  — Devin<br/>
  <span style="color: #666; font-size: 14px;">Norwood, NJ</span>
</p>`;

const STEPS: StepDef[] = [
  {
    step: 1,
    daysAfter: 2,
    subject: (fn) => `${fn}, the lesson that cost me $40k`,
    html: (fn) => wrap(`
      <p style="font-size: 16px; margin: 0 0 16px;">Hey ${fn},</p>
      <p style="font-size: 16px; margin: 0 0 16px;">
        Quick follow-up on the playbook. If you only act on one chapter, make it <strong>"Charge more than feels comfortable."</strong>
      </p>
      <p style="font-size: 16px; margin: 0 0 16px;">
        First year of Impact Zone I priced memberships at what the market "expected." Left roughly $40k on the table because I was scared of pushback. Raised prices 22% the next year — lost 6% of members, made 14% more revenue, and got a better clientele overnight.
      </p>
      <p style="font-size: 16px; margin: 0 0 16px;">
        Whatever you charge now, the ceiling is probably 20-30% higher than you think. Test it.
      </p>
      ${signature}
    `),
  },
  {
    step: 2,
    daysAfter: 5,
    subject: (fn) => `${fn}, the 2THIRTY playbook in 4 lines`,
    html: (fn) => wrap(`
      <p style="font-size: 16px; margin: 0 0 16px;">Hey ${fn},</p>
      <p style="font-size: 16px; margin: 0 0 16px;">
        Here's the abbreviated version of how 2THIRTY (our hydration brand) actually got off the ground:
      </p>
      <ol style="font-size: 16px; margin: 0 0 16px; padding-left: 20px;">
        <li style="margin-bottom: 8px;">Built it for one audience — Impact Zone members. Not "everyone who hydrates."</li>
        <li style="margin-bottom: 8px;">Sold it in-person before we built the website.</li>
        <li style="margin-bottom: 8px;">Used the gym as our content studio. Every member is a potential testimonial.</li>
        <li style="margin-bottom: 8px;">Reinvested every dollar of profit for 18 months. Zero withdrawals.</li>
      </ol>
      <p style="font-size: 16px; margin: 0 0 16px;">
        If you've got a product, service, or idea you're trying to launch — I run a consulting service for exactly this kind of thing. <a href="https://devinpolicastro.com/consulting" style="color: #b78a5e; font-weight: 600;">Details here</a> if you want to chat.
      </p>
      ${signature}
    `),
  },
  {
    step: 3,
    daysAfter: 9,
    subject: (fn) => `${fn} — what are you building?`,
    html: (fn) => wrap(`
      <p style="font-size: 16px; margin: 0 0 16px;">Hey ${fn},</p>
      <p style="font-size: 16px; margin: 0 0 16px;">
        Last one from me — promise.
      </p>
      <p style="font-size: 16px; margin: 0 0 16px;">
        I read every reply personally. If you've got a business you're building, an idea you're chewing on, or you're stuck on something specific — hit reply and tell me. Two sentences is enough.
      </p>
      <p style="font-size: 16px; margin: 0 0 16px;">
        I connect people for a living. Worst case I point you at someone who can help. Best case we end up working together.
      </p>
      ${signature}
    `),
  },
];

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  if (!RESEND_API_KEY) {
    console.error("RESEND_API_KEY missing");
    return new Response(JSON.stringify({ error: "Email not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const { data: people, error } = await supabase
    .from("people")
    .select("id, name, email, tags, meta, created_at")
    .contains("tags", ["lead-magnet"]);

  if (error) {
    console.error("Fetch people error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const results: Array<{ email: string; step: Step; ok: boolean; reason?: string }> = [];
  const now = Date.now();

  for (const p of people ?? []) {
    if (!p.email) continue;
    const meta = (p.meta ?? {}) as Record<string, unknown>;
    const nurture = (meta.nurture ?? {}) as { unsubscribed?: boolean; step?: number; last_sent_at?: string };

    if (nurture.unsubscribed) continue;
    const currentStep = nurture.step ?? 0;
    if (currentStep >= 3) continue;

    const signupAt = new Date(p.created_at).getTime();
    const daysSinceSignup = (now - signupAt) / (1000 * 60 * 60 * 24);

    const nextStep = STEPS.find((s) => s.step === ((currentStep + 1) as Step));
    if (!nextStep) continue;
    if (daysSinceSignup < nextStep.daysAfter) continue;

    const firstName = (p.name || "").split(/\s+/)[0] || "there";

    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Devin Policastro <inquiries@updates.devinpolicastro.com>",
          to: [p.email],
          subject: nextStep.subject(firstName),
          html: nextStep.html(firstName),
          reply_to: "dev@devinpolicastro.com",
        }),
      });

      if (!res.ok) {
        const txt = await res.text();
        console.error(`Resend ${p.email} step ${nextStep.step}:`, txt);
        results.push({ email: p.email, step: nextStep.step, ok: false, reason: txt });
        continue;
      }

      const updatedMeta = {
        ...meta,
        nurture: {
          ...nurture,
          step: nextStep.step,
          last_sent_at: new Date().toISOString(),
        },
      };

      await supabase.from("people").update({ meta: updatedMeta }).eq("id", p.id);
      results.push({ email: p.email, step: nextStep.step, ok: true });
    } catch (err) {
      console.error(`Send failed ${p.email}:`, err);
      results.push({
        email: p.email,
        step: nextStep.step,
        ok: false,
        reason: err instanceof Error ? err.message : "unknown",
      });
    }
  }

  return new Response(
    JSON.stringify({
      processed: results.length,
      sent: results.filter((r) => r.ok).length,
      results,
    }),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
});
