// Classifies a quick capture using Lovable AI and stores routing suggestion in meta.triage.
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';

const SYSTEM = `You are a triage assistant for a founder's personal capture inbox.
Classify the note into ONE category and propose routing.

Categories:
- task: something the user needs to do; should become a project/action
- person: mentions a specific person to add to CRM (name present)
- kpi: a metric/number worth logging (revenue, signups, weight, etc.)
- idea: a concept, hypothesis, or thing to think about later
- note: anything else (quote, reference, journal)

Return concise, lowercase tags (max 4, no #). Title 3-7 words.`;

const TOOL = {
  type: 'function',
  function: {
    name: 'triage',
    description: 'Classify capture and propose routing',
    parameters: {
      type: 'object',
      properties: {
        category: { type: 'string', enum: ['task', 'person', 'kpi', 'idea', 'note'] },
        suggested_title: { type: 'string' },
        tags: { type: 'array', items: { type: 'string' }, maxItems: 4 },
        confidence: { type: 'number' },
        task: {
          type: 'object',
          properties: { title: { type: 'string' }, priority: { type: 'string', enum: ['low','medium','high'] } },
        },
        person: {
          type: 'object',
          properties: { name: { type: 'string' }, email: { type: 'string' }, company: { type: 'string' }, context: { type: 'string' } },
        },
        kpi: {
          type: 'object',
          properties: { name: { type: 'string' }, value: { type: 'number' }, unit: { type: 'string' } },
        },
      },
      required: ['category', 'suggested_title', 'tags', 'confidence'],
    },
  },
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return j({ error: 'Unauthorized' }, 401);
    const supa = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: userData } = await supa.auth.getUser();
    if (!userData?.user) return j({ error: 'Unauthorized' }, 401);

    const { capture_id } = await req.json();
    if (!capture_id) return j({ error: 'capture_id required' }, 400);

    const { data: cap, error: capErr } = await supa
      .from('quick_captures').select('*').eq('id', capture_id).maybeSingle();
    if (capErr || !cap) return j({ error: 'capture not found' }, 404);

    const KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!KEY) throw new Error('LOVABLE_API_KEY missing');

    const aiRes = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${KEY}` },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: SYSTEM },
          { role: 'user', content: `Title: ${cap.title ?? '(none)'}\n\nBody:\n${cap.body}` },
        ],
        tools: [TOOL],
        tool_choice: { type: 'function', function: { name: 'triage' } },
      }),
    });

    if (!aiRes.ok) {
      const t = await aiRes.text();
      console.error('ai err', aiRes.status, t);
      if (aiRes.status === 429) return j({ error: 'Rate limited' }, 429);
      if (aiRes.status === 402) return j({ error: 'AI credits exhausted' }, 402);
      return j({ error: 'triage failed', detail: t.slice(0, 400) }, 500);
    }

    const ai = await aiRes.json();
    const call = ai?.choices?.[0]?.message?.tool_calls?.[0];
    if (!call?.function?.arguments) return j({ error: 'no triage' }, 500);
    let parsed: any;
    try { parsed = JSON.parse(call.function.arguments); }
    catch { return j({ error: 'bad triage json' }, 500); }

    const existingTags: string[] = Array.isArray(cap.tags) ? cap.tags : [];
    const suggestedTags: string[] = Array.isArray(parsed.tags) ? parsed.tags.map((t: any) => String(t).toLowerCase()) : [];
    const mergedTags = Array.from(new Set([...existingTags, ...suggestedTags])).slice(0, 8);

    const meta = { ...(cap.meta && typeof cap.meta === 'object' ? cap.meta : {}), triage: parsed };

    const patch: Record<string, unknown> = { meta, tags: mergedTags };
    if (!cap.title && parsed.suggested_title) patch.title = String(parsed.suggested_title).slice(0, 80);
    // Map category to existing capture kind enum
    if (parsed.category === 'idea' && cap.kind === 'note') patch.kind = 'idea';

    const { data: updated, error: upErr } = await supa
      .from('quick_captures').update(patch).eq('id', cap.id).select().single();
    if (upErr) throw upErr;

    return j({ capture: updated, triage: parsed });
  } catch (e) {
    console.error('triage-capture err', e);
    return j({ error: String(e) }, 500);
  }
});

function j(b: unknown, status = 200) {
  return new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
}
