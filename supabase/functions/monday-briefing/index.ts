// Generates Monday-morning briefing: KPI deltas, leads, projects, content, IZ activity.
// Stores to briefings table and emails Devin.
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';

const DEVIN_EMAIL = 'devinpolicastro@gmail.com';

function weekStart(d = new Date()) {
  const x = new Date(d);
  const day = x.getDay(); // 0=Sun
  const diff = (day + 6) % 7; // back to Monday
  x.setDate(x.getDate() - diff);
  x.setHours(0,0,0,0);
  return x;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    // Find Devin
    const { data: roles } = await supabase.from('user_roles').select('user_id').eq('role','admin');
    const adminId = roles?.[0]?.user_id;
    if (!adminId) throw new Error('No admin user');

    const wk = weekStart();
    const wkIso = wk.toISOString().slice(0,10);
    const prevWk = new Date(wk); prevWk.setDate(prevWk.getDate() - 7);
    const prevIso = prevWk.toISOString().slice(0,10);

    // KPIs
    const { data: kpis } = await supabase.from('kpis').select('id,name,unit').eq('user_id', adminId).eq('archived', false);
    const { data: entries } = await supabase.from('kpi_entries')
      .select('kpi_id,value,entry_date')
      .gte('entry_date', prevIso)
      .order('entry_date', { ascending: false });

    const kpiLines: string[] = [];
    for (const k of kpis || []) {
      const mine = (entries||[]).filter(e => e.kpi_id === k.id);
      const cur = mine.find(e => e.entry_date >= wkIso)?.value;
      const prev = mine.find(e => e.entry_date < wkIso)?.value;
      if (cur != null) {
        const delta = prev != null ? (Number(cur) - Number(prev)) : null;
        const arrow = delta == null ? '·' : delta > 0 ? '▲' : delta < 0 ? '▼' : '·';
        kpiLines.push(`- ${k.name}: ${cur}${k.unit !== 'count' ? ' '+k.unit : ''} ${arrow}${delta != null ? ` ${delta>0?'+':''}${delta}` : ''}`);
      }
    }

    // Inquiries last 7d
    const sevenAgo = new Date(); sevenAgo.setDate(sevenAgo.getDate()-7);
    const { data: inqs } = await supabase.from('inquiries').select('id,name,service_type,status,created_at').gte('created_at', sevenAgo.toISOString()).order('created_at', { ascending: false });
    const newInqs = (inqs||[]).filter(i => i.status === 'new');

    // Projects
    const { data: projects } = await supabase.from('projects').select('id,title,status,due_date,priority').eq('user_id', adminId).neq('status','done').order('priority',{ascending:false});
    const overdue = (projects||[]).filter(p => p.due_date && p.due_date < wkIso);

    // Content posted last 7d
    const { data: posted } = await supabase.from('content_items').select('id,title,platform,posted_at').eq('user_id', adminId).gte('posted_at', sevenAgo.toISOString());

    const md = [
      `# Monday Briefing — ${wkIso}`,
      ``,
      `## KPIs`,
      kpiLines.length ? kpiLines.join('\n') : '_no entries this week_',
      ``,
      `## Inquiries (last 7d)`,
      `Total: ${(inqs||[]).length} · New: ${newInqs.length}`,
      ...newInqs.slice(0,10).map(i => `- ${i.name} — ${i.service_type}`),
      ``,
      `## Projects in flight`,
      `Active: ${(projects||[]).length} · Overdue: ${overdue.length}`,
      ...overdue.slice(0,5).map(p => `- ⚠ ${p.title} (due ${p.due_date})`),
      ``,
      `## Content posted (last 7d)`,
      `${(posted||[]).length} pieces`,
      ...((posted||[]).slice(0,8).map(c => `- ${c.platform}: ${c.title}`)),
    ].join('\n');

    const stats = {
      kpis: kpiLines.length,
      inquiries_total: (inqs||[]).length,
      inquiries_new: newInqs.length,
      projects_active: (projects||[]).length,
      projects_overdue: overdue.length,
      content_posted: (posted||[]).length,
    };

    // Upsert briefing
    const { error: upErr } = await supabase.from('briefings').upsert({
      user_id: adminId, week_start: wkIso, content: md, stats,
    }, { onConflict: 'user_id,week_start' });
    if (upErr) console.error('briefing upsert error', upErr);

    // Email via Resend
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (RESEND_API_KEY) {
      const html = `<pre style="font-family:ui-monospace,monospace;font-size:13px;white-space:pre-wrap">${md.replace(/</g,'&lt;')}</pre>`;
      const emailRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${RESEND_API_KEY}` },
        body: JSON.stringify({
          from: 'DevHQ <inquiries@updates.devinpolicastro.com>',
          to: [DEVIN_EMAIL],
          subject: `Monday Briefing — ${wkIso}`,
          html,
        }),
      });
      if (emailRes.ok) {
        await supabase.from('briefings').update({ emailed_at: new Date().toISOString() }).eq('user_id', adminId).eq('week_start', wkIso);
      } else {
        console.error('resend error', await emailRes.text());
      }
    }

    return new Response(JSON.stringify({ ok: true, week_start: wkIso, stats }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('monday-briefing error', e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
