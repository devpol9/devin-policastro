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
  subject: (fn: string) => string;
  heading: (fn: string) => string;
  bodyHtml: (fn: string) => string;
  ctaLabel?: string;
  ctaUrl?: string;
}

const STEPS: StepDef[] = [
  {
    step: 1,
    daysAfter: 2,
    subject: (fn) => `${fn}, the lesson that cost me $40k`,
    heading: () => "Charge more than feels comfortable",
    bodyHtml: () => `
      <p>Quick follow-up on the playbook. If you only act on one chapter, make it <strong>"Charge more than feels comfortable."</strong></p>
      <p>First year of Impact Zone I priced memberships at what the market "expected." Left roughly $40k on the table because I was scared of pushback. Raised prices 22% the next year — lost 6% of members, made 14% more revenue, and got a better clientele overnight.</p>
      <p>Whatever you charge now, the ceiling is probably 20–30% higher than you think. Test it.</p>
    `,
  },
  {
    step: 2,
    daysAfter: 5,
    subject: (fn) => `${fn}, the 2THIRTY playbook in 4 lines`,
    heading: () => "How 2THIRTY actually got off the ground",
    bodyHtml: () => `
      <p>Here's the abbreviated version:</p>
      <ol style="padding-left:20px;margin:0 0 16px;">
        <li style="margin-bottom:6px;">Built it for one audience — Impact Zone members. Not "everyone who hydrates."</li>
        <li style="margin-bottom:6px;">Sold it in-person before we built the website.</li>
        <li style="margin-bottom:6px;">Used the gym as our content studio. Every member is a potential testimonial.</li>
        <li style="margin-bottom:6px;">Reinvested every dollar of profit for 18 months. Zero withdrawals.</li>
      </ol>
      <p>If you've got a product, service, or idea you're trying to launch, I run consulting for exactly this.</p>
    `,
    ctaLabel: "See consulting details",
    ctaUrl: "https://devinpolicastro.com/consulting",
  },
  {
    step: 3,
    daysAfter: 9,
    subject: (fn) => `${fn} — what are you building?`,
    heading: () => "Last one — what are you building?",
    bodyHtml: () => `
      <p>Last one from me — promise.</p>
      <p>I read every reply personally. If you've got a business you're building, an idea you're chewing on, or you're stuck on something specific — hit reply and tell me. Two sentences is enough.</p>
      <p>I connect people for a living. Worst case I point you at someone who can help. Best case we end up working together.</p>
    `,
  },
];

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { data: people, error } = await supabase
    .from("people")
    .select("id, name, email, tags, meta, created_at")
    .contains("tags", ["lead-magnet"]);

  if (error) {
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

    const { error: sendErr } = await supabase.functions.invoke("send-transactional-email", {
      body: {
        templateName: "playbook-nurture",
        recipientEmail: p.email,
        idempotencyKey: `nurture-${p.id}-step${nextStep.step}`,
        templateData: {
          name: p.name || firstName,
          subjectLine: nextStep.subject(firstName),
          heading: nextStep.heading(firstName),
          bodyHtml: nextStep.bodyHtml(firstName),
          ctaLabel: nextStep.ctaLabel,
          ctaUrl: nextStep.ctaUrl,
        },
      },
    });

    if (sendErr) {
      results.push({ email: p.email, step: nextStep.step, ok: false, reason: String(sendErr) });
      continue;
    }

    const updatedMeta = {
      ...meta,
      nurture: { ...nurture, step: nextStep.step, last_sent_at: new Date().toISOString() },
    };
    await supabase.from("people").update({ meta: updatedMeta }).eq("id", p.id);
    results.push({ email: p.email, step: nextStep.step, ok: true });
  }

  return new Response(
    JSON.stringify({
      processed: results.length,
      sent: results.filter((r) => r.ok).length,
      results,
    }),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
