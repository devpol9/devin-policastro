// HQ AI command bar — natural language → structured action via tool calling
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';

const SYSTEM = `You are DevHQ's command interpreter for Devin Policastro.
Parse the user's natural-language request into ONE structured action via the tools provided.
Be decisive. If ambiguous, pick the most useful interpretation and proceed.
Today is ${new Date().toISOString().slice(0,10)}.`;

const tools = [
  {
    type: "function",
    function: {
      name: "log_kpi",
      description: "Log a value against an existing KPI (matched by fuzzy name).",
      parameters: {
        type: "object",
        properties: {
          kpi_name: { type: "string" },
          value: { type: "number" },
          note: { type: "string" },
          entry_date: { type: "string", description: "YYYY-MM-DD, optional, defaults today" },
        },
        required: ["kpi_name", "value"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "add_priority",
      description: "Add a today priority (max 3 slots).",
      parameters: {
        type: "object",
        properties: { title: { type: "string" } },
        required: ["title"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "capture_note",
      description: "Save a quick note or idea.",
      parameters: {
        type: "object",
        properties: {
          body: { type: "string" },
          title: { type: "string" },
          venture_slug: { type: "string" },
          tags: { type: "array", items: { type: "string" } },
        },
        required: ["body"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "add_person",
      description: "Add a person to the connector CRM.",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string" },
          email: { type: "string" },
          phone: { type: "string" },
          company: { type: "string" },
          role: { type: "string" },
          notes: { type: "string" },
          tags: { type: "array", items: { type: "string" } },
        },
        required: ["name"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "create_project",
      description: "Create a new project.",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          venture_slug: { type: "string" },
          priority: { type: "string", enum: ["low","medium","high"] },
        },
        required: ["title"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "convert_inquiry",
      description: "Convert a recent inbound inquiry into a project. Match by person's name and/or service type.",
      parameters: {
        type: "object",
        properties: {
          match: { type: "string", description: "Name, email, or service type to fuzzy-match the inquiry." },
          venture_slug: { type: "string" },
          priority: { type: "string", enum: ["low","medium","high","urgent"] },
          title: { type: "string", description: "Optional override for project title." },
        },
        required: ["match"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "answer",
      description: "Respond with text only — for questions or when no action fits.",
      parameters: {
        type: "object",
        properties: { text: { type: "string" } },
        required: ["text"],
      },
    },
  },
];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );
    const { data: userData } = await createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } },
    ).auth.getUser();
    const user = userData?.user;
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { prompt } = await req.json();
    if (!prompt || typeof prompt !== 'string') {
      return new Response(JSON.stringify({ error: 'prompt required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY missing');

    // Context for fuzzy matches
    const [{ data: kpis }, { data: ventures }, { data: recentInquiries }] = await Promise.all([
      supabase.from('kpis').select('id,name').eq('user_id', user.id).eq('archived', false),
      supabase.from('ventures').select('id,slug,name,short_name').eq('user_id', user.id),
      supabase.from('inquiries').select('id,name,email,service_type,status,converted_project_id,created_at,form_data').is('converted_project_id', null).order('created_at', { ascending: false }).limit(25),
    ]);

    const inqList = (recentInquiries||[]).map(i => `${i.id} | ${i.name} | ${i.email} | ${i.service_type} | ${i.status}`).join('\n');
    const ctx = `\nAvailable KPIs: ${(kpis||[]).map(k=>k.name).join(', ') || 'none'}\nVentures: ${(ventures||[]).map(v=>`${v.slug}=${v.name}`).join(', ') || 'none'}\nRecent open inquiries (id | name | email | service | status):\n${inqList || 'none'}`;

    const aiRes = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${LOVABLE_API_KEY}` },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: SYSTEM + ctx },
          { role: 'user', content: prompt },
        ],
        tools,
        tool_choice: 'required',
      }),
    });

    if (!aiRes.ok) {
      const t = await aiRes.text();
      if (aiRes.status === 429) return new Response(JSON.stringify({ error: 'Rate limit, try again in a moment.' }), { status: 429, headers: { ...corsHeaders, 'Content-Type':'application/json' } });
      if (aiRes.status === 402) return new Response(JSON.stringify({ error: 'AI credits exhausted.' }), { status: 402, headers: { ...corsHeaders, 'Content-Type':'application/json' } });
      console.error('ai error', aiRes.status, t);
      return new Response(JSON.stringify({ error: 'AI error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type':'application/json' } });
    }

    const ai = await aiRes.json();
    const call = ai?.choices?.[0]?.message?.tool_calls?.[0];
    if (!call) {
      return new Response(JSON.stringify({ result: { type: 'answer', text: ai?.choices?.[0]?.message?.content || 'No action.' } }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const args = JSON.parse(call.function.arguments || '{}');
    const name = call.function.name;

    const ventureBySlug = (slug?: string) => slug ? (ventures||[]).find(v => v.slug === slug)?.id ?? null : null;

    let result: any = { type: name, args };

    if (name === 'log_kpi') {
      const target = (kpis||[]).find(k => k.name.toLowerCase() === String(args.kpi_name).toLowerCase())
        ?? (kpis||[]).find(k => k.name.toLowerCase().includes(String(args.kpi_name).toLowerCase()));
      if (!target) { result.error = `No KPI matching "${args.kpi_name}"`; }
      else {
        const { error } = await supabase.from('kpi_entries').insert({
          kpi_id: target.id, value: args.value, entry_date: args.entry_date || new Date().toISOString().slice(0,10), note: args.note ?? null,
        });
        if (error) result.error = error.message; else result.message = `Logged ${args.value} to "${target.name}".`;
      }
    } else if (name === 'add_priority') {
      const today = new Date().toISOString().slice(0,10);
      const { data: existing } = await supabase.from('priorities_today').select('slot').eq('user_id', user.id).eq('priority_date', today);
      const used = new Set((existing||[]).map(p => p.slot));
      const slot = [1,2,3].find(s => !used.has(s));
      if (!slot) { result.error = 'All 3 slots taken today.'; }
      else {
        const { error } = await supabase.from('priorities_today').insert({ user_id: user.id, priority_date: today, slot, title: args.title });
        if (error) result.error = error.message; else result.message = `Added priority #${slot}.`;
      }
    } else if (name === 'capture_note') {
      const { error } = await supabase.from('quick_captures').insert({
        user_id: user.id, body: args.body, title: args.title ?? null,
        venture_id: ventureBySlug(args.venture_slug), tags: args.tags ?? [],
      });
      if (error) result.error = error.message; else result.message = 'Note saved.';
    } else if (name === 'add_person') {
      const { error } = await supabase.from('people').insert({
        user_id: user.id, name: args.name, email: args.email ?? null, phone: args.phone ?? null,
        company: args.company ?? null, role: args.role ?? null, notes: args.notes ?? null, tags: args.tags ?? [],
      });
      if (error) result.error = error.message; else result.message = `Added ${args.name} to CRM.`;
    } else if (name === 'create_project') {
      const { error } = await supabase.from('projects').insert({
        user_id: user.id, title: args.title, description: args.description ?? null,
        venture_id: ventureBySlug(args.venture_slug), priority: args.priority ?? 'medium',
      });
      if (error) result.error = error.message; else result.message = `Project "${args.title}" created.`;
    } else if (name === 'convert_inquiry') {
      const m = String(args.match || '').toLowerCase();
      const inq = (recentInquiries||[]).find(i =>
        i.name?.toLowerCase().includes(m) ||
        i.email?.toLowerCase().includes(m) ||
        i.service_type?.toLowerCase().includes(m)
      );
      if (!inq) { result.error = `No open inquiry matching "${args.match}"`; }
      else {
        let ventureId = ventureBySlug(args.venture_slug);
        if (!ventureId) {
          const st = (inq.service_type || '').toLowerCase();
          const match = (ventures||[]).find(v => st.includes(v.name.toLowerCase()) || (v.short_name && st.includes(v.short_name.toLowerCase())));
          ventureId = match?.id ?? null;
        }
        const descMarkdown = Object.entries(inq.form_data || {})
          .filter(([, v]) => v).map(([k, v]) => `- **${k}**: ${String(v)}`).join('\n');
        const { data: project, error } = await supabase.from('projects').insert({
          user_id: user.id,
          title: args.title || `${inq.name} — ${inq.service_type}`,
          description: descMarkdown || null,
          venture_id: ventureId,
          status: 'planning',
          priority: args.priority || 'medium',
          source_type: 'inquiry',
          source_id: inq.id,
        }).select().single();
        if (error) { result.error = error.message; }
        else {
          await supabase.from('inquiries').update({
            converted_project_id: project.id,
            status: ['new','contacted'].includes(inq.status) ? 'in-progress' : inq.status,
          }).eq('id', inq.id);
          result.message = `Converted ${inq.name}'s inquiry → project.`;
        }
      }
    } else if (name === 'answer') {
      result.message = args.text;
    }

    return new Response(JSON.stringify({ result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('hq-command error', e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
