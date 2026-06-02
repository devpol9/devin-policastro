// Daily 7am ET briefing: today's signals, overdue intros, stale relationships,
// new inquiries (24h), today's scheduled content, KPI deltas (today vs yesterday),
// fresh ideas. Stores to daily_briefings + emails Devin.
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';

const DEVIN_EMAIL = 'dev@devinpolicastro.com';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: roles } = await supabase.from('user_roles').select('user_id').eq('role', 'admin');
    const adminId = roles?.[0]?.user_id;
    if (!adminId) throw new Error('No admin user');

    const now = new Date();
    const todayIso = now.toISOString().slice(0, 10);
    const yesterday = new Date(now); yesterday.setDate(yesterday.getDate() - 1);
    const yIso = yesterday.toISOString().slice(0, 10);
    const last24h = new Date(now.getTime() - 24 * 3600 * 1000).toISOString();
    const dayStart = new Date(now); dayStart.setHours(0,0,0,0);
    const dayEnd = new Date(now); dayEnd.setHours(23,59,59,999);
    const staleCutoff = new Date(now); staleCutoff.setDate(staleCutoff.getDate() - 30);

    // Parallel fetches
    const [inqRes, introRes, staleRes, contentSchedRes, contentPostedRes, kpisRes, capRes, projRes] = await Promise.all([
      supabase.from('inquiries')
        .select('id, name, service_type, created_at')
        .eq('status', 'new')
        .gte('created_at', last24h)
        .order('created_at', { ascending: false }),
      supabase.from('intros')
        .select('id, status, follow_up_at, context, to_person_id, from_person_id')
        .in('status', ['proposed', 'in_progress'])
        .not('follow_up_at', 'is', null)
        .lte('follow_up_at', todayIso)
        .order('follow_up_at', { ascending: true }),
      supabase.from('people')
        .select('id, name, last_contacted_at, relationship_strength')
        .gte('relationship_strength', 4)
        .or(`last_contacted_at.is.null,last_contacted_at.lte.${staleCutoff.toISOString()}`)
        .order('last_contacted_at', { ascending: true, nullsFirst: true })
        .limit(8),
      supabase.from('content_items')
        .select('id, title, platform, scheduled_at, status')
        .gte('scheduled_at', dayStart.toISOString())
        .lte('scheduled_at', dayEnd.toISOString())
        .neq('status', 'posted')
        .order('scheduled_at', { ascending: true }),
      supabase.from('content_items')
        .select('id, platform, title')
        .gte('posted_at', last24h),
      supabase.from('kpis').select('id, name, unit').eq('user_id', adminId).eq('archived', false),
      supabase.from('quick_captures')
        .select('id, title, body, kind, created_at')
        .eq('archived', false)
        .is('promoted_project_id', null)
        .gte('created_at', last24h)
        .order('created_at', { ascending: false }),
      supabase.from('projects')
        .select('id, title, due_date, priority, status')
        .eq('user_id', adminId)
        .neq('status', 'done')
        .not('due_date', 'is', null)
        .lte('due_date', todayIso)
        .order('priority', { ascending: false }),
    ]);

    // Resolve people names for intros
    const personIds = new Set<string>();
    (introRes.data ?? []).forEach((i: any) => {
      if (i.to_person_id) personIds.add(i.to_person_id);
      if (i.from_person_id) personIds.add(i.from_person_id);
    });
    let peopleMap: Record<string, string> = {};
    if (personIds.size) {
      const { data } = await supabase.from('people').select('id, name').in('id', Array.from(personIds));
      peopleMap = Object.fromEntries((data ?? []).map((p: any) => [p.id, p.name]));
    }

    // KPI deltas (today vs yesterday)
    const kpiLines: string[] = [];
    for (const k of kpisRes.data ?? []) {
      const { data: entries } = await supabase.from('kpi_entries')
        .select('value, entry_date')
        .eq('kpi_id', k.id)
        .order('entry_date', { ascending: false })
        .limit(2);
      const cur = entries?.[0];
      const prev = entries?.[1];
      if (!cur) continue;
      const delta = prev ? Number(cur.value) - Number(prev.value) : null;
      const arrow = delta == null ? '·' : delta > 0 ? '▲' : delta < 0 ? '▼' : '·';
      const unit = k.unit && k.unit !== 'count' ? ' ' + k.unit : '';
      kpiLines.push(`- ${k.name}: ${cur.value}${unit} ${arrow}${delta != null ? ` ${delta > 0 ? '+' : ''}${delta}` : ''}`);
    }

    const inqs = inqRes.data ?? [];
    const intros = introRes.data ?? [];
    const stale = staleRes.data ?? [];
    const sched = contentSchedRes.data ?? [];
    const posted = contentPostedRes.data ?? [];
    const caps = capRes.data ?? [];
    const overdueProjects = projRes.data ?? [];

    const fmtTime = (iso: string) => new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'America/New_York' });

    const md = [
      `# Daily Briefing — ${now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'America/New_York' })}`,
      ``,
      `## What needs you today`,
      intros.length === 0 && overdueProjects.length === 0
        ? '_All clear — no overdue intros or projects._'
        : [
            ...overdueProjects.slice(0, 5).map((p: any) => `- ⚠ Project overdue: **${p.title}** (due ${p.due_date})`),
            ...intros.slice(0, 5).map((i: any) => {
              const to = i.to_person_id ? peopleMap[i.to_person_id] : null;
              const from = i.from_person_id ? peopleMap[i.from_person_id] : null;
              const pair = [from, to].filter(Boolean).join(' → ') || 'Intro';
              return `- 🤝 Intro follow-up: **${pair}** — ${i.context ? i.context.slice(0, 80) : `due ${i.follow_up_at}`}`;
            }),
          ].join('\n'),
      ``,
      `## New inquiries (last 24h) — ${inqs.length}`,
      inqs.length === 0 ? '_None._' : inqs.slice(0, 8).map((i: any) => `- **${i.name}** — ${i.service_type}`).join('\n'),
      ``,
      `## Scheduled today — ${sched.length}`,
      sched.length === 0 ? '_Nothing on the calendar._' : sched.map((c: any) => `- ${fmtTime(c.scheduled_at)} · ${c.platform}: ${c.title}`).join('\n'),
      ``,
      `## KPIs (vs yesterday)`,
      kpiLines.length ? kpiLines.join('\n') : '_no fresh entries_',
      ``,
      `## Going cold — top ${Math.min(stale.length, 5)}`,
      stale.length === 0 ? '_All warm._' : stale.slice(0, 5).map((p: any) => {
        const last = p.last_contacted_at ? new Date(p.last_contacted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'never';
        return `- ${p.name} (last: ${last})`;
      }).join('\n'),
      ``,
      caps.length ? `## Fresh ideas captured (24h)` : '',
      caps.length ? caps.slice(0, 5).map((c: any) => `- ${c.title || c.body.split('\n')[0].slice(0, 80)}`).join('\n') : '',
      ``,
      `---`,
      `Posted yesterday: ${posted.length} pieces · [Open HQ](https://admin.devinpolicastro.com/hq)`,
    ].filter(Boolean).join('\n');

    const stats = {
      inquiries_24h: inqs.length,
      intros_overdue: intros.length,
      projects_overdue: overdueProjects.length,
      content_scheduled: sched.length,
      content_posted_24h: posted.length,
      stale_contacts: stale.length,
      fresh_captures: caps.length,
    };

    const { error: upErr } = await supabase.from('daily_briefings').upsert({
      user_id: adminId, briefing_date: todayIso, content: md, stats,
    }, { onConflict: 'user_id,briefing_date' });
    if (upErr) console.error('daily-briefing upsert', upErr);

    // Skip email if nothing actionable
    const isEmpty = inqs.length === 0 && intros.length === 0 && overdueProjects.length === 0 && sched.length === 0 && kpiLines.length === 0;

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (RESEND_API_KEY && !isEmpty) {
      const html = `<pre style="font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:13px;line-height:1.55;white-space:pre-wrap;background:#0a0a0a;color:#e5e5e5;padding:20px;border-radius:8px">${md.replace(/</g, '&lt;')}</pre>`;
      const subject = `☀ ${now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'America/New_York' })} — ${stats.inquiries_24h} new · ${stats.intros_overdue + stats.projects_overdue} to do`;
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${RESEND_API_KEY}` },
        body: JSON.stringify({
          from: 'DevHQ <inquiries@updates.devinpolicastro.com>',
          to: [DEVIN_EMAIL],
          subject,
          html,
        }),
      });
      if (res.ok) {
        await supabase.from('daily_briefings').update({ emailed_at: new Date().toISOString() }).eq('user_id', adminId).eq('briefing_date', todayIso);
      } else {
        console.error('resend error', await res.text());
      }
    }

    return new Response(JSON.stringify({ ok: true, date: todayIso, stats, emailed: !isEmpty }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('daily-briefing error', e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
