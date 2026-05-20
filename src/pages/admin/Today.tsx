import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { format, subDays, startOfDay } from "date-fns";
import { Check, Pencil, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { BarChart, Bar, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import AdminShell from "@/components/admin/AdminShell";
import SectionHeader from "@/components/SectionHeader";
import VenturePill from "@/components/admin/VenturePill";
import { useVentures } from "@/hooks/use-ventures";

interface Priority {
  id?: string;
  slot: number;
  title: string;
  completed: boolean;
}

interface Inquiry {
  id: string;
  name: string;
  service_type: string;
  email: string;
  created_at: string;
  status: string;
}

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
};

const todayISO = () => format(new Date(), "yyyy-MM-dd");

const PrioritySlot = ({
  slot, value, onSave,
}: {
  slot: number;
  value: Priority;
  onSave: (next: Priority) => Promise<void>;
}) => {
  const [editing, setEditing] = useState(!value.title);
  const [text, setText] = useState(value.title);

  useEffect(() => { setText(value.title); }, [value.title]);

  const commit = async () => {
    setEditing(false);
    if (text.trim() === value.title) return;
    await onSave({ ...value, title: text.trim() });
  };

  const toggleComplete = async () => {
    if (!value.title) return;
    await onSave({ ...value, completed: !value.completed });
  };

  return (
    <div className="glass-card p-4 flex flex-col gap-3 min-h-[120px]">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] text-muted-foreground">0{slot}</span>
        {value.title && (
          <button
            onClick={toggleComplete}
            className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
              value.completed
                ? "bg-accent border-accent text-accent-foreground"
                : "border-border hover:border-accent"
            }`}
          >
            {value.completed && <Check size={12} />}
          </button>
        )}
      </div>
      {editing ? (
        <input
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit();
            if (e.key === "Escape") { setText(value.title); setEditing(false); }
          }}
          placeholder={`Set priority ${slot}`}
          className="bg-transparent border-b border-border/60 focus:border-accent outline-none text-sm font-display py-1"
        />
      ) : (
        <button
          onClick={() => setEditing(true)}
          className={`text-left text-sm font-display flex-1 ${
            value.title
              ? value.completed
                ? "line-through text-muted-foreground"
                : "text-foreground"
              : "text-muted-foreground/60 italic"
          }`}
        >
          {value.title || `Set priority ${slot}`}
          {value.title && <Pencil size={11} className="inline ml-2 opacity-40" />}
        </button>
      )}
    </div>
  );
};

const Today = () => {
  const navigate = useNavigate();
  const { activeVentures } = useVentures();
  const [userId, setUserId] = useState<string>("");
  const [priorities, setPriorities] = useState<Priority[]>([
    { slot: 1, title: "", completed: false },
    { slot: 2, title: "", completed: false },
    { slot: 3, title: "", completed: false },
  ]);
  const [pulse, setPulse] = useState<{ day: string; count: number }[]>([]);
  const [weekTotal, setWeekTotal] = useState(0);
  const [newCount, setNewCount] = useState(0);
  const [recent, setRecent] = useState<Inquiry[]>([]);
  const [quickLog, setQuickLog] = useState("");
  const [savingLog, setSavingLog] = useState(false);
  const [topPaths, setTopPaths] = useState<{ path: string; count: number }[]>([]);
  const [pv24, setPv24] = useState(0);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserId(data.user.id);
    });
  }, []);

  useEffect(() => {
    if (!userId) return;
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const loadAll = async () => {
    const date = todayISO();
    const { data: pri } = await supabase
      .from("priorities_today")
      .select("*")
      .eq("user_id", userId)
      .eq("priority_date", date);
    const map = new Map<number, Priority>();
    (pri ?? []).forEach((p: any) => map.set(p.slot, { id: p.id, slot: p.slot, title: p.title ?? "", completed: p.completed }));
    setPriorities([1, 2, 3].map((s) => map.get(s) ?? { slot: s, title: "", completed: false }));

    const since = subDays(startOfDay(new Date()), 6).toISOString();
    const { data: inq } = await supabase
      .from("inquiries")
      .select("created_at, status")
      .gte("created_at", since);
    const buckets: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = format(subDays(new Date(), i), "MMM d");
      buckets[d] = 0;
    }
    (inq ?? []).forEach((row: any) => {
      const d = format(new Date(row.created_at), "MMM d");
      if (d in buckets) buckets[d]++;
    });
    setPulse(Object.entries(buckets).map(([day, count]) => ({ day, count })));
    setWeekTotal(inq?.length ?? 0);
    setNewCount((inq ?? []).filter((r: any) => r.status === "new").length);

    const { data: recentRows } = await supabase
      .from("inquiries")
      .select("id, name, service_type, email, created_at, status")
      .order("created_at", { ascending: false })
      .limit(5);
    setRecent((recentRows as any[]) ?? []);

    const since24 = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
    const { data: ev } = await supabase
      .from("analytics_events")
      .select("path")
      .eq("event_name", "page_view")
      .gte("created_at", since24);
    if (ev && ev.length > 0) {
      setPv24(ev.length);
      const counts: Record<string, number> = {};
      ev.forEach((e: any) => {
        const p = e.path || "/";
        counts[p] = (counts[p] ?? 0) + 1;
      });
      setTopPaths(
        Object.entries(counts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([path, count]) => ({ path, count }))
      );
    }
  };

  const savePriority = async (next: Priority) => {
    if (!userId) return;
    setPriorities((prev) => prev.map((p) => (p.slot === next.slot ? next : p)));
    if (!next.title && !next.id) return;
    const payload = {
      user_id: userId,
      priority_date: todayISO(),
      slot: next.slot,
      title: next.title || null,
      completed: next.completed,
    };
    const { data, error } = await supabase
      .from("priorities_today")
      .upsert(payload, { onConflict: "user_id,priority_date,slot" })
      .select()
      .single();
    if (error) {
      toast.error("Failed to save");
      return;
    }
    setPriorities((prev) =>
      prev.map((p) => (p.slot === next.slot ? { ...next, id: (data as any).id } : p))
    );
  };

  const saveLog = async () => {
    if (!quickLog.trim() || !userId) return;
    setSavingLog(true);
    const { error } = await supabase.from("daily_logs_quick").insert({
      user_id: userId,
      content: quickLog.trim(),
    });
    setSavingLog(false);
    if (error) {
      toast.error("Couldn't save");
    } else {
      setQuickLog("");
      toast.success("Logged.");
    }
  };

  return (
    <AdminShell>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-10"
      >
        <h2 className="font-display font-black leading-[0.95] tracking-[-0.03em] text-[clamp(2rem,5vw,3.25rem)]">
          {greeting()}, <span className="italic font-light text-accent">Devin.</span>
        </h2>
        <p className="font-mono text-xs text-muted-foreground mt-2 lowercase">
          {format(new Date(), "EEEE, MMMM d, yyyy")}
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          {newCount} new {newCount === 1 ? "inquiry" : "inquiries"} · {weekTotal} this week
        </p>
      </motion.div>

      {activeVentures.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.03 }}
          className="mb-8"
        >
          <p className="font-mono text-[10px] text-muted-foreground tracking-[0.18em] mb-2 lowercase">
            your ventures — {activeVentures.length} active
          </p>
          <div className="flex gap-2 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 pb-2 scrollbar-thin">
            {activeVentures.map((v) => (
              <VenturePill key={v.id} venture={v} size="md" />
            ))}
          </div>
        </motion.section>
      )}

      <motion.section
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.05 }}
        className="mb-10"
      >
        <SectionHeader as="h2" numeral="01" eyebrow="Priorities" title={<>Today's <span className="italic font-light text-accent">three.</span></>} />
        <div className="grid sm:grid-cols-3 gap-4">
          {priorities.map((p) => (
            <PrioritySlot key={p.slot} slot={p.slot} value={p} onSave={savePriority} />
          ))}
        </div>
      </motion.section>

      <div className="grid lg:grid-cols-3 gap-6 mb-10">
        <motion.section
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          className="lg:col-span-2 glass-card p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-mono text-[10px] text-muted-foreground tracking-[0.18em]">02 · INQUIRY PULSE</p>
              <h3 className="font-display font-bold text-lg mt-1">Last 7 days</h3>
            </div>
            <button
              onClick={() => navigate("/inquiries")}
              className="text-xs font-display text-muted-foreground hover:text-accent flex items-center gap-1"
            >
              View all <ArrowRight size={12} />
            </button>
          </div>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pulse} onClick={() => navigate("/inquiries")}>
                <XAxis dataKey="day" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: "hsl(var(--accent) / 0.08)" }}
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    fontSize: "12px",
                    borderRadius: 6,
                  }}
                />
                <Bar dataKey="count" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}
          className="glass-card p-5"
        >
          <p className="font-mono text-[10px] text-muted-foreground tracking-[0.18em] mb-1">03 · QUICK LOG</p>
          <h3 className="font-display font-bold text-lg mb-3">Log a thought</h3>
          <textarea
            value={quickLog}
            onChange={(e) => setQuickLog(e.target.value)}
            rows={4}
            placeholder="Capture it before it's gone…"
            className="w-full bg-secondary/40 border border-border/40 rounded-md p-2 text-sm outline-none focus:border-accent resize-none"
          />
          <button
            onClick={saveLog}
            disabled={!quickLog.trim() || savingLog}
            className="mt-2 w-full px-3 py-2 rounded-md bg-foreground text-background text-xs font-display font-semibold disabled:opacity-40"
          >
            {savingLog ? "Saving…" : "Save"}
          </button>
        </motion.section>
      </div>

      <motion.section
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-10"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-mono text-[10px] text-muted-foreground tracking-[0.18em]">04 · INBOX</p>
            <h3 className="font-display font-bold text-lg mt-1">Recent inquiries</h3>
          </div>
          <button
            onClick={() => navigate("/inquiries")}
            className="text-xs font-display text-muted-foreground hover:text-accent flex items-center gap-1"
          >
            View all <ArrowRight size={12} />
          </button>
        </div>
        {recent.length === 0 ? (
          <p className="text-sm text-muted-foreground">No inquiries yet.</p>
        ) : (
          <div className="grid gap-2">
            {recent.map((r) => (
              <button
                key={r.id}
                onClick={() => navigate(`/inquiries/${r.id}`)}
                className="text-left glass-card p-3 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="font-display font-semibold text-sm truncate">{r.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {r.service_type.replace(" Inquiry", "")} · {r.email}
                  </p>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground whitespace-nowrap">
                  {format(new Date(r.created_at), "MMM d")}
                </span>
              </button>
            ))}
          </div>
        )}
      </motion.section>

      {pv24 > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }}
          className="glass-card p-4"
        >
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
            <div>
              <p className="font-mono text-[10px] text-muted-foreground tracking-[0.18em]">24H TRAFFIC</p>
              <p className="font-display font-bold text-2xl">{pv24}</p>
            </div>
            <div className="flex-1 min-w-[200px]">
              <p className="font-mono text-[10px] text-muted-foreground tracking-[0.18em] mb-1">TOP PATHS</p>
              <div className="space-y-0.5">
                {topPaths.map((tp) => (
                  <div key={tp.path} className="flex justify-between text-xs">
                    <span className="font-mono text-foreground/80 truncate">{tp.path}</span>
                    <span className="font-mono text-muted-foreground tabular-nums">{tp.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>
      )}
    </AdminShell>
  );
};

export default Today;
