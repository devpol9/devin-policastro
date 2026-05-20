import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { format, formatDistanceToNowStrict } from "date-fns";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend,
  BarChart, Bar, AreaChart, Area, CartesianGrid,
} from "recharts";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminShell from "@/components/admin/AdminShell";
import SectionHeader from "@/components/SectionHeader";
import {
  useAnalyticsRange, useAnalyticsOverview, useActivityOverTime,
  useTopPaths, useTopEvents, useTopSources, type RangeKey,
} from "@/hooks/use-analytics";

const RANGES: { key: RangeKey; label: string }[] = [
  { key: "24h", label: "24h" },
  { key: "7d", label: "7d" },
  { key: "30d", label: "30d" },
  { key: "90d", label: "90d" },
  { key: "all", label: "All" },
];

const SERIES = [
  { key: "page_view", label: "Page views", color: "hsl(24 32% 52%)" },
  { key: "inquiry_submitted", label: "Inquiries", color: "hsl(140 60% 38%)" },
  { key: "chatbot_engaged", label: "Chat engaged", color: "hsl(210 35% 50%)" },
  { key: "link_clicked", label: "Link clicks", color: "hsl(350 22% 55%)" },
];

const delta = (cur: number, prev: number) => {
  if (prev === 0) return cur === 0 ? 0 : 100;
  return ((cur - prev) / prev) * 100;
};

const StatCard = ({ label, value, prev, sparkData }: {
  label: string; value: number; prev: number; sparkData: { v: number }[];
}) => {
  const d = delta(value, prev);
  const dColor = d > 1 ? "text-emerald-600" : d < -1 ? "text-destructive" : "text-muted-foreground";
  return (
    <div className="glass-card p-4 flex flex-col gap-2">
      <p className="font-mono text-[10px] text-muted-foreground tracking-[0.18em] uppercase">{label}</p>
      <div className="flex items-baseline gap-2">
        <span className="font-display font-black text-3xl tabular-nums">{value.toLocaleString()}</span>
        <span className={`text-[11px] font-mono ${dColor}`}>
          {d > 0 ? "+" : ""}{d.toFixed(0)}% vs prior
        </span>
      </div>
      <div className="h-10 -mx-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sparkData}>
            <Area type="monotone" dataKey="v" stroke="hsl(var(--accent))" fill="hsl(var(--accent) / 0.18)" strokeWidth={1.5} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const AnalyticsInner = () => {
  const { range, setRange, label } = useAnalyticsRange();
  const overview = useAnalyticsOverview(range);
  const overTime = useActivityOverTime(range);
  const topPaths = useTopPaths(range, 10);
  const topEvents = useTopEvents(range, 20);
  const topSources = useTopSources(range, 15);
  const [pathFilter, setPathFilter] = useState<string | null>(null);
  const [hiddenSeries, setHiddenSeries] = useState<Set<string>>(new Set());
  const [tab, setTab] = useState<"events" | "paths" | "sources">("events");

  // Reshape over-time data: pivot to per-bucket rows
  const timeSeries = useMemo(() => {
    const rows = overTime.data ?? [];
    const map = new Map<string, Record<string, any>>();
    rows.forEach((r) => {
      const k = r.bucket_start;
      if (!map.has(k)) map.set(k, { bucket: k });
      map.get(k)![r.event_name] = Number(r.count);
    });
    return Array.from(map.values()).sort((a, b) => a.bucket.localeCompare(b.bucket));
  }, [overTime.data]);

  // Sparkline data per stat — use the time series
  const sparkFor = (eventName: string) =>
    timeSeries.map((r) => ({ v: Number(r[eventName] ?? 0) }));

  const pathChartData = useMemo(() => {
    return (topPaths.data ?? []).map((p) => ({ path: p.path, value: Number(p.page_views) }));
  }, [topPaths.data]);

  const cur = overview.data?.current;
  const prev = overview.data?.previous;

  return (
    <AdminShell>
      <SectionHeader
        as="h1"
        numeral="07"
        eyebrow="Signal"
        title={<>What people do on <span className="accent-headline">analytics.</span></>}
        description="Real-time visitor signal from devinpolicastro.com. No cookies. No third parties."
      />

      <div className="flex flex-wrap items-center gap-2 mb-6">
        {RANGES.map((r) => (
          <button
            key={r.key}
            onClick={() => setRange(r.key)}
            className={`px-3 py-1.5 rounded-full text-[11px] font-display font-semibold tracking-[0.08em] transition-colors ${
              range === r.key ? "bg-foreground text-background" : "bg-card text-muted-foreground hover:text-foreground border border-border/50"
            }`}
          >{r.label}</button>
        ))}
        <span className="text-xs font-mono text-muted-foreground ml-2">{label}</span>
        {pathFilter && (
          <button
            onClick={() => setPathFilter(null)}
            className="ml-auto px-2.5 py-1 rounded-md text-[11px] bg-accent/15 text-accent border border-accent/30 font-mono"
          >
            filtered: {pathFilter} ✕
          </button>
        )}
      </div>

      {/* Section A — overview cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <StatCard
          label="Page views"
          value={Number(cur?.page_views ?? 0)}
          prev={Number(prev?.page_views ?? 0)}
          sparkData={sparkFor("page_view")}
        />
        <StatCard
          label="Sessions"
          value={Number(cur?.unique_sessions ?? 0)}
          prev={Number(prev?.unique_sessions ?? 0)}
          sparkData={sparkFor("page_view")}
        />
        <StatCard
          label="Inquiries"
          value={Number(cur?.inquiries ?? 0)}
          prev={Number(prev?.inquiries ?? 0)}
          sparkData={sparkFor("inquiry_submitted")}
        />
        <StatCard
          label="Chat engagements"
          value={Number(cur?.chat_engagements ?? 0)}
          prev={Number(prev?.chat_engagements ?? 0)}
          sparkData={sparkFor("chatbot_engaged")}
        />
      </div>

      {/* Section B — charts */}
      <div className="grid lg:grid-cols-2 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="glass-card p-4"
        >
          <p className="font-mono text-[10px] text-muted-foreground tracking-[0.18em] uppercase mb-3">
            Activity over time
          </p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeSeries}>
                <CartesianGrid stroke="hsl(var(--border) / 0.4)" strokeDasharray="2 4" vertical={false} />
                <XAxis
                  dataKey="bucket"
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => {
                    try {
                      return format(new Date(v), range === "24h" ? "ha" : "MMM d");
                    } catch { return v; }
                  }}
                />
                <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={28} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    fontSize: 12, borderRadius: 6,
                  }}
                  labelFormatter={(v) => {
                    try { return format(new Date(v as string), "PPpp"); } catch { return String(v); }
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: 11 }}
                  onClick={(e: any) => {
                    setHiddenSeries((prev) => {
                      const next = new Set(prev);
                      if (next.has(e.dataKey)) next.delete(e.dataKey); else next.add(e.dataKey);
                      return next;
                    });
                  }}
                />
                {SERIES.map((s) => (
                  <Line
                    key={s.key}
                    type="monotone"
                    dataKey={s.key}
                    name={s.label}
                    stroke={s.color}
                    strokeWidth={2}
                    dot={false}
                    hide={hiddenSeries.has(s.key)}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }}
          className="glass-card p-4"
        >
          <p className="font-mono text-[10px] text-muted-foreground tracking-[0.18em] uppercase mb-3">
            Top paths
          </p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pathChartData} layout="vertical" margin={{ left: 4, right: 12 }}>
                <CartesianGrid stroke="hsl(var(--border) / 0.4)" strokeDasharray="2 4" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="path" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={110} />
                <Tooltip
                  cursor={{ fill: "hsl(var(--accent) / 0.08)" }}
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    fontSize: 12, borderRadius: 6,
                  }}
                />
                <Bar
                  dataKey="value"
                  fill="hsl(var(--accent))"
                  radius={[0, 4, 4, 0]}
                  onClick={(d: any) => setPathFilter(d?.path ?? null)}
                  style={{ cursor: "pointer" }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Section C — tabs */}
      <div className="glass-card p-4 mb-8">
        <div className="flex gap-1 mb-4">
          {(["events", "paths", "sources"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-md text-xs font-display font-semibold capitalize transition-colors ${
                tab === t ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
              }`}
            >{t}</button>
          ))}
        </div>

        {tab === "events" && (
          <EventsTable rows={topEvents.data ?? []} total={Number(cur?.page_views ?? 0)} />
        )}
        {tab === "paths" && (
          <PathsTable rows={(topPaths.data ?? []).filter((r) => !pathFilter || r.path === pathFilter)} />
        )}
        {tab === "sources" && (
          <SourcesTable rows={topSources.data ?? []} />
        )}
      </div>

      <p className="text-[11px] text-muted-foreground text-center">
        Tracking is privacy-first: no cookies, no PII, no third parties. Data lives in your backend.
      </p>
    </AdminShell>
  );
};

const Th = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <th className={`text-left font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase py-2 ${className}`}>{children}</th>
);
const Td = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <td className={`py-2 border-t border-border/30 text-sm ${className}`}>{children}</td>
);

const EventsTable = ({ rows, total }: { rows: { event_name: string; count: number; latest: string }[]; total: number }) => {
  const all = rows.reduce((s, r) => s + Number(r.count), 0);
  return (
    <table className="w-full">
      <thead>
        <tr><Th>Event</Th><Th>Count</Th><Th>Latest</Th><Th>% of all events</Th></tr>
      </thead>
      <tbody>
        {rows.length === 0 ? (
          <tr><td colSpan={4} className="py-8 text-center text-sm text-muted-foreground">No events in range.</td></tr>
        ) : rows.map((r) => (
          <tr key={r.event_name}>
            <Td className="font-mono">{r.event_name}</Td>
            <Td className="tabular-nums">{Number(r.count).toLocaleString()}</Td>
            <Td className="text-muted-foreground">{r.latest ? formatDistanceToNowStrict(new Date(r.latest), { addSuffix: true }) : "—"}</Td>
            <Td className="tabular-nums text-muted-foreground">{all ? ((Number(r.count) / all) * 100).toFixed(1) : "0"}%</Td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const PathsTable = ({ rows }: { rows: { path: string; page_views: number; inquiries: number; last_visited: string }[] }) => (
  <table className="w-full">
    <thead>
      <tr><Th>Path</Th><Th>Views</Th><Th>Inquiries</Th><Th>Last visited</Th></tr>
    </thead>
    <tbody>
      {rows.length === 0 ? (
        <tr><td colSpan={4} className="py-8 text-center text-sm text-muted-foreground">No path data in range.</td></tr>
      ) : rows.map((r) => (
        <tr key={r.path}>
          <Td className="font-mono truncate max-w-[260px]">{r.path}</Td>
          <Td className="tabular-nums">{Number(r.page_views).toLocaleString()}</Td>
          <Td className="tabular-nums">{Number(r.inquiries)}</Td>
          <Td className="text-muted-foreground">{r.last_visited ? formatDistanceToNowStrict(new Date(r.last_visited), { addSuffix: true }) : "—"}</Td>
        </tr>
      ))}
    </tbody>
  </table>
);

const SourcesTable = ({ rows }: { rows: { source: string; sessions: number; inquiries: number }[] }) => (
  <table className="w-full">
    <thead>
      <tr><Th>Source</Th><Th>Sessions</Th><Th>Inquiries</Th><Th>Conv. rate</Th></tr>
    </thead>
    <tbody>
      {rows.length === 0 ? (
        <tr><td colSpan={4} className="py-8 text-center text-sm text-muted-foreground">No source data in range.</td></tr>
      ) : rows.map((r) => {
        const rate = Number(r.sessions) > 0 ? (Number(r.inquiries) / Number(r.sessions)) * 100 : 0;
        return (
          <tr key={r.source}>
            <Td className="font-mono">{r.source}</Td>
            <Td className="tabular-nums">{Number(r.sessions).toLocaleString()}</Td>
            <Td className="tabular-nums">{Number(r.inquiries)}</Td>
            <Td className="tabular-nums text-muted-foreground">{rate.toFixed(1)}%</Td>
          </tr>
        );
      })}
    </tbody>
  </table>
);

const Analytics = () => (
  <AdminGuard>
    <AnalyticsInner />
  </AdminGuard>
);

export default Analytics;
