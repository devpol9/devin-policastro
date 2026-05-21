import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { startOfWeek, endOfWeek, subWeeks, format, formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import {
  TrendingUp, TrendingDown, Minus, ChevronLeft, ChevronRight,
  Inbox, Calendar, Users, LineChart as LineChartIcon, Trophy, AlertTriangle, Printer,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminShell from "@/components/admin/AdminShell";

type KpiDelta = {
  id: string; name: string; unit: string;
  current: number | null; prior: number | null;
};

type Counts = {
  inquiries_new: number; inquiries_closed: number;
  content_posted: number; intros_created: number;
  notes_logged: number; captures: number;
};

type StalePerson = {
  id: string; name: string; relationship_strength: number | null; last_contacted_at: string | null;
};

const Stat = ({ label, value, sub, icon: Icon, tone = "default" }: {
  label: string; value: string | number; sub?: string;
  icon: any; tone?: "default" | "good" | "bad";
}) => (
  <div className="panel p-4">
    <div className="flex items-center gap-1.5 text-[10px] font-display tracking-[0.1em] text-muted-foreground">
      <Icon size={11} /> {label}
    </div>
    <div className="mt-1 flex items-baseline gap-2">
      <span className="font-display font-bold text-2xl tabular-nums">{value}</span>
      {sub && (
        <span className={
          tone === "good" ? "text-[11px] text-emerald-500" :
          tone === "bad" ? "text-[11px] text-red-500" :
          "text-[11px] text-muted-foreground"
        }>{sub}</span>
      )}
    </div>
  </div>
);

const fmtNum = (n: number | null) => n == null ? "—" : (Math.round(n * 100) / 100).toLocaleString();

const ReviewPage = () => {
  const [weekOffset, setWeekOffset] = useState(0); // 0 = this week, 1 = last week...
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState<Counts>({
    inquiries_new: 0, inquiries_closed: 0, content_posted: 0,
    intros_created: 0, notes_logged: 0, captures: 0,
  });
  const [priorCounts, setPriorCounts] = useState<Counts>({
    inquiries_new: 0, inquiries_closed: 0, content_posted: 0,
    intros_created: 0, notes_logged: 0, captures: 0,
  });
  const [kpiDeltas, setKpiDeltas] = useState<KpiDelta[]>([]);
  const [wins, setWins] = useState<{ date: string; text: string }[]>([]);
  const [challenges, setChallenges] = useState<{ date: string; text: string }[]>([]);
  const [stale, setStale] = useState<StalePerson[]>([]);
  const [topContent, setTopContent] = useState<any[]>([]);

  const range = useMemo(() => {
    const ref = subWeeks(new Date(), weekOffset);
    const start = startOfWeek(ref, { weekStartsOn: 1 });
    const end = endOfWeek(ref, { weekStartsOn: 1 });
    const priorStart = startOfWeek(subWeeks(ref, 1), { weekStartsOn: 1 });
    const priorEnd = endOfWeek(subWeeks(ref, 1), { weekStartsOn: 1 });
    return { start, end, priorStart, priorEnd };
  }, [weekOffset]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { start, end, priorStart, priorEnd } = range;
      const sIso = start.toISOString(), eIso = end.toISOString();
      const psIso = priorStart.toISOString(), peIso = priorEnd.toISOString();

      const headCount = (b: any) => b.select("id", { count: "exact", head: true });

      const [
        inqNew, inqClosed,
        contentPosted, intros, notesQ, capturesQ,
        priorInqNew, priorInqClosed, priorContent, priorIntros, priorNotes, priorCaptures,
        kpis,
        logs,
        people,
        topContentQ,
      ] = await Promise.all([
        headCount(supabase.from("inquiries")).gte("created_at", sIso).lte("created_at", eIso),
        headCount(supabase.from("inquiries")).eq("status", "closed").gte("created_at", sIso).lte("created_at", eIso),
        headCount(supabase.from("content_items")).eq("status", "posted").gte("posted_at", sIso).lte("posted_at", eIso),
        headCount(supabase.from("intros")).gte("created_at", sIso).lte("created_at", eIso),
        headCount(supabase.from("daily_logs")).gte("log_date", format(start, "yyyy-MM-dd")).lte("log_date", format(end, "yyyy-MM-dd")),
        headCount(supabase.from("quick_captures")).gte("created_at", sIso).lte("created_at", eIso),
        headCount(supabase.from("inquiries")).gte("created_at", psIso).lte("created_at", peIso),
        headCount(supabase.from("inquiries")).eq("status", "closed").gte("created_at", psIso).lte("created_at", peIso),
        headCount(supabase.from("content_items")).eq("status", "posted").gte("posted_at", psIso).lte("posted_at", peIso),
        headCount(supabase.from("intros")).gte("created_at", psIso).lte("created_at", peIso),
        headCount(supabase.from("daily_logs")).gte("log_date", format(priorStart, "yyyy-MM-dd")).lte("log_date", format(priorEnd, "yyyy-MM-dd")),
        headCount(supabase.from("quick_captures")).gte("created_at", psIso).lte("created_at", peIso),
        supabase.from("kpis").select("id, name, unit").eq("archived", false).order("sort_order"),
        supabase.from("daily_logs").select("log_date, wins, challenges")
          .gte("log_date", format(start, "yyyy-MM-dd"))
          .lte("log_date", format(end, "yyyy-MM-dd")),
        supabase.from("people").select("id, name, relationship_strength, last_contacted_at")
          .gte("relationship_strength", 4)
          .order("last_contacted_at", { ascending: true, nullsFirst: true })
          .limit(8),
        supabase.from("content_items").select("id, title, platform, posted_at, performance_stats")
          .eq("status", "posted").gte("posted_at", sIso).lte("posted_at", eIso)
          .order("posted_at", { ascending: false }).limit(5),
      ]);

      if (cancelled) return;
      setCounts({
        inquiries_new: inqNew.count ?? 0,
        inquiries_closed: inqClosed.count ?? 0,
        content_posted: contentPosted.count ?? 0,
        intros_created: intros.count ?? 0,
        notes_logged: notesQ.count ?? 0,
        captures: capturesQ.count ?? 0,
      });
      setPriorCounts({
        inquiries_new: priorInqNew.count ?? 0,
        inquiries_closed: priorInqClosed.count ?? 0,
        content_posted: priorContent.count ?? 0,
        intros_created: priorIntros.count ?? 0,
        notes_logged: priorNotes.count ?? 0,
        captures: priorCaptures.count ?? 0,
      });

      // KPI deltas: for each kpi, get latest in window and latest prior to start
      const kpiRows = (kpis.data ?? []) as { id: string; name: string; unit: string }[];
      const deltas = await Promise.all(kpiRows.map(async (k) => {
        const [cur, pri] = await Promise.all([
          supabase.from("kpi_entries").select("value, entry_date")
            .eq("kpi_id", k.id)
            .lte("entry_date", format(end, "yyyy-MM-dd"))
            .order("entry_date", { ascending: false }).limit(1).maybeSingle(),
          supabase.from("kpi_entries").select("value, entry_date")
            .eq("kpi_id", k.id)
            .lt("entry_date", format(start, "yyyy-MM-dd"))
            .order("entry_date", { ascending: false }).limit(1).maybeSingle(),
        ]);
        return {
          id: k.id, name: k.name, unit: k.unit,
          current: (cur.data?.value as number | undefined) ?? null,
          prior: (pri.data?.value as number | undefined) ?? null,
        };
      }));
      if (cancelled) return;
      setKpiDeltas(deltas.filter(d => d.current != null));

      const winsList: { date: string; text: string }[] = [];
      const challengesList: { date: string; text: string }[] = [];
      (logs.data ?? []).forEach((l: any) => {
        if (l.wins?.trim()) winsList.push({ date: l.log_date, text: l.wins.trim() });
        if (l.challenges?.trim()) challengesList.push({ date: l.log_date, text: l.challenges.trim() });
      });
      setWins(winsList);
      setChallenges(challengesList);

      const stalePpl = (people.data ?? []).filter((p: any) => {
        if (!p.last_contacted_at) return true;
        const days = (Date.now() - new Date(p.last_contacted_at).getTime()) / 86400000;
        return days > 30;
      });
      setStale(stalePpl as StalePerson[]);

      setTopContent(topContentQ.data ?? []);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [range]);

  const delta = (cur: number, prev: number) => {
    if (prev === 0 && cur === 0) return { txt: "—", tone: "default" as const };
    if (prev === 0) return { txt: `+${cur}`, tone: "good" as const };
    const diff = cur - prev;
    const pct = Math.round((diff / prev) * 100);
    return {
      txt: `${diff >= 0 ? "+" : ""}${pct}% vs last`,
      tone: (diff > 0 ? "good" : diff < 0 ? "bad" : "default") as "good" | "bad" | "default",
    };
  };

  const weekLabel = weekOffset === 0 ? "This week" : weekOffset === 1 ? "Last week" : `${weekOffset} weeks ago`;

  return (
    <AdminGuard>
      <AdminShell>
        <div className="flex flex-wrap items-end justify-between gap-3 mb-6 print:hidden">
          <div>
            <h1 className="font-display font-black text-3xl sm:text-4xl tracking-[-0.02em]">
              Weekly <span className="accent-headline">review</span>
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              {format(range.start, "MMM d")} – {format(range.end, "MMM d, yyyy")} · {weekLabel}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setWeekOffset((w) => w + 1)}
              className="h-8 w-8 rounded-md border border-border/40 flex items-center justify-center hover:bg-secondary/40">
              <ChevronLeft size={14} />
            </button>
            <button onClick={() => setWeekOffset((w) => Math.max(0, w - 1))}
              disabled={weekOffset === 0}
              className="h-8 w-8 rounded-md border border-border/40 flex items-center justify-center hover:bg-secondary/40 disabled:opacity-30">
              <ChevronRight size={14} />
            </button>
            <button onClick={() => window.print()}
              className="h-8 px-3 rounded-md border border-border/40 text-[11px] font-display font-semibold flex items-center gap-1.5 hover:bg-secondary/40">
              <Printer size={12} /> Print
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Activity stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {([
                { label: "New inquiries", key: "inquiries_new", icon: Inbox },
                { label: "Closed", key: "inquiries_closed", icon: Inbox },
                { label: "Content posted", key: "content_posted", icon: Calendar },
                { label: "Intros made", key: "intros_created", icon: Users },
                { label: "Daily logs", key: "notes_logged", icon: LineChartIcon },
                { label: "Captures", key: "captures", icon: LineChartIcon },
              ] as const).map((s) => {
                const cur = counts[s.key], prev = priorCounts[s.key];
                const d = delta(cur, prev);
                return <Stat key={s.key} label={s.label} value={cur} sub={d.txt} icon={s.icon} tone={d.tone} />;
              })}
            </div>

            {/* KPI deltas */}
            <section className="panel p-5">
              <div className="flex items-center gap-2 mb-3">
                <LineChartIcon size={14} className="text-accent" />
                <h2 className="font-display font-bold text-lg">KPI movement</h2>
              </div>
              {kpiDeltas.length === 0 ? (
                <p className="text-xs text-muted-foreground">No KPI entries yet for this window.</p>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {kpiDeltas.map((k) => {
                    const diff = k.prior != null && k.current != null ? k.current - k.prior : null;
                    const pct = k.prior && k.prior !== 0 && diff != null ? Math.round((diff / Math.abs(k.prior)) * 100) : null;
                    const Icon = diff == null ? Minus : diff > 0 ? TrendingUp : diff < 0 ? TrendingDown : Minus;
                    const tone = diff == null ? "text-muted-foreground" : diff > 0 ? "text-emerald-500" : diff < 0 ? "text-red-500" : "text-muted-foreground";
                    return (
                      <Link key={k.id} to={`/hq/kpis`} className="rounded-md border border-border/40 px-3 py-2 hover:bg-secondary/30 transition-colors">
                        <div className="text-[11px] text-muted-foreground truncate">{k.name}</div>
                        <div className="flex items-baseline justify-between gap-2 mt-0.5">
                          <span className="font-display font-bold tabular-nums">{fmtNum(k.current)}</span>
                          <span className={`text-[11px] font-display tabular-nums flex items-center gap-1 ${tone}`}>
                            <Icon size={11} />
                            {pct != null ? `${pct >= 0 ? "+" : ""}${pct}%` : (k.prior == null ? "new" : "0%")}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </section>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Wins */}
              <section className="panel p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Trophy size={14} className="text-accent" />
                  <h2 className="font-display font-bold text-lg">Wins</h2>
                </div>
                {wins.length === 0 ? (
                  <p className="text-xs text-muted-foreground">Nothing logged yet. Open Today and capture one.</p>
                ) : (
                  <ul className="space-y-2.5">
                    {wins.map((w, i) => (
                      <li key={i} className="text-sm">
                        <div className="text-[10px] font-display tracking-[0.1em] text-muted-foreground">
                          {format(new Date(w.date), "EEE MMM d")}
                        </div>
                        <p className="text-foreground/90 whitespace-pre-wrap">{w.text}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              {/* Challenges */}
              <section className="panel p-5">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle size={14} className="text-accent" />
                  <h2 className="font-display font-bold text-lg">Challenges</h2>
                </div>
                {challenges.length === 0 ? (
                  <p className="text-xs text-muted-foreground">None logged.</p>
                ) : (
                  <ul className="space-y-2.5">
                    {challenges.map((w, i) => (
                      <li key={i} className="text-sm">
                        <div className="text-[10px] font-display tracking-[0.1em] text-muted-foreground">
                          {format(new Date(w.date), "EEE MMM d")}
                        </div>
                        <p className="text-foreground/90 whitespace-pre-wrap">{w.text}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Stale top relationships */}
              <section className="panel p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Users size={14} className="text-accent" />
                  <h2 className="font-display font-bold text-lg">Reach out</h2>
                </div>
                {stale.length === 0 ? (
                  <p className="text-xs text-muted-foreground">Top relationships are all fresh. Nice.</p>
                ) : (
                  <ul className="divide-y divide-border/30">
                    {stale.map((p) => (
                      <li key={p.id} className="py-2 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-sm font-display font-semibold truncate">{p.name}</div>
                          <div className="text-[11px] text-muted-foreground">
                            Last touch {p.last_contacted_at ? formatDistanceToNow(new Date(p.last_contacted_at), { addSuffix: true }) : "never"}
                          </div>
                        </div>
                        <span className="text-[10px] text-accent">★ {p.relationship_strength ?? "—"}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              {/* Top content */}
              <section className="panel p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar size={14} className="text-accent" />
                  <h2 className="font-display font-bold text-lg">Content shipped</h2>
                </div>
                {topContent.length === 0 ? (
                  <p className="text-xs text-muted-foreground">Nothing posted this week.</p>
                ) : (
                  <ul className="divide-y divide-border/30">
                    {topContent.map((c) => (
                      <li key={c.id} className="py-2">
                        <div className="text-sm font-display font-semibold truncate">{c.title}</div>
                        <div className="text-[11px] text-muted-foreground">
                          {c.platform} · {c.posted_at ? format(new Date(c.posted_at), "EEE MMM d") : "—"}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>
          </motion.div>
        )}
      </AdminShell>
    </AdminGuard>
  );
};

export default ReviewPage;
