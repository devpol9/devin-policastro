import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { format, subDays } from "date-fns";
import { Check, Pencil, ArrowRight, BookOpen, Pin, ArrowUpRight, Mail as MailIcon } from "lucide-react";
import { toast } from "sonner";
import AdminShell from "@/components/admin/AdminShell";
import AdminGuard from "@/components/admin/AdminGuard";
import SectionHeader from "@/components/SectionHeader";
import CrossVentureInbox from "@/components/admin/CrossVentureInbox";
import { useVentures } from "@/hooks/use-ventures";
import { useProjects } from "@/hooks/use-projects";
import { useScheduledThisWeek } from "@/hooks/use-content";
import { usePinnedKpis } from "@/hooks/use-kpis";
import { useRecentCaptures, useCreateCapture } from "@/hooks/use-captures";
import { useSaveDailyLog, useDailyLog } from "@/hooks/use-daily-log";
import KpiCard from "@/components/admin/KpiCard";
import KpiDetail from "@/components/admin/KpiDetail";
import { PLATFORM_ICON, type Platform } from "@/lib/content-constants";
import VoiceCaptureButton from "@/components/admin/VoiceCaptureButton";
import VoicePostCaptureSheet, { type VoiceCaptured } from "@/components/admin/VoicePostCaptureSheet";
import VenturePill from "@/components/admin/VenturePill";
import DailyDigest from "@/components/admin/DailyDigest";
import StaleInquiriesCard from "@/components/admin/StaleInquiriesCard";

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
  form_data: any;
}

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
};

const todayISO = () => format(new Date(), "yyyy-MM-dd");

const SubHeader = ({ title, onView, viewLabel = "View all" }: { title: string; onView?: () => void; viewLabel?: string }) => (
  <div className="flex items-center justify-between mb-3">
    <h3 className="text-[13px] font-medium text-foreground">{title}</h3>
    {onView && (
      <button onClick={onView} className="text-[11px] text-muted-foreground hover:text-accent flex items-center gap-1">
        {viewLabel} <ArrowRight size={11} />
      </button>
    )}
  </div>
);

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
    <div className="panel p-4 sm:p-5 flex flex-col gap-3 min-h-[110px]">
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
          className="bg-transparent border-b border-border/60 focus:border-accent outline-none text-base font-display py-1"
        />
      ) : (
        <button
          onClick={() => setEditing(true)}
          className={`text-left text-base font-display flex-1 ${
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

const VENTURE_SLUG_LABEL: Record<string, string> = {
  "impact-zone": "IZ",
  "2thirty": "230",
  valence: "VLC",
  onlyshitz: "OS",
  "creative-vision": "CV",
  personal: "DP",
  "new-projects": "NEW",
};

const Today = () => {
  const navigate = useNavigate();
  const { activeVentures } = useVentures();
  const { projects: inProgressProjects } = useProjects({ status: "in-progress" });
  const topInProgress = inProgressProjects.slice(0, 3);
  const { items: scheduledContent } = useScheduledThisWeek();
  const { pinned } = usePinnedKpis();
  const [openKpiId, setOpenKpiId] = useState<string | null>(null);
  const topContent = scheduledContent
    .filter((c) => c.scheduled_at)
    .sort((a, b) => new Date(a.scheduled_at!).getTime() - new Date(b.scheduled_at!).getTime())
    .slice(0, 4);

  const [userId, setUserId] = useState<string>("");
  const [priorities, setPriorities] = useState<Priority[]>([
    { slot: 1, title: "", completed: false },
    { slot: 2, title: "", completed: false },
    { slot: 3, title: "", completed: false },
  ]);
  const [weekTotal, setWeekTotal] = useState(0);
  const [newCount, setNewCount] = useState(0);
  const [recent, setRecent] = useState<Inquiry[]>([]);
  const [quickLog, setQuickLog] = useState("");
  const [savingLog, setSavingLog] = useState(false);
  const [voiceCapture, setVoiceCapture] = useState<VoiceCaptured | null>(null);
  const [logMode, setLogMode] = useState<"log" | "capture">("capture");

  const saveLogMut = useSaveDailyLog();
  const createCapture = useCreateCapture();
  const { data: todayLog } = useDailyLog(todayISO());
  const { data: recentCaptures = [] } = useRecentCaptures(3);

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

    const since = subDays(new Date(), 7).toISOString();
    const { data: inq } = await supabase
      .from("inquiries")
      .select("created_at, status")
      .gte("created_at", since);
    setWeekTotal(inq?.length ?? 0);
    setNewCount((inq ?? []).filter((r: any) => r.status === "new").length);

    const { data: recentRows } = await supabase
      .from("inquiries")
      .select("id, name, service_type, email, created_at, status, form_data")
      .order("created_at", { ascending: false })
      .limit(5);
    setRecent((recentRows as any[]) ?? []);
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
    try {
      if (logMode === "log") {
        const existing = (todayLog?.notes ?? "").trim();
        const next = existing ? `${existing}\n\n---\n\n${quickLog.trim()}` : quickLog.trim();
        await saveLogMut.mutateAsync({ date: todayISO(), partial: { notes: next } });
        toast.success("Logged.");
      } else {
        await createCapture.mutateAsync({ kind: "note", body: quickLog.trim() });
        toast.success("Captured.");
      }
      setQuickLog("");
    } catch (e: any) {
      toast.error(e.message ?? "Couldn't save");
    } finally {
      setSavingLog(false);
    }
  };

  return (
    <AdminGuard>
    <AdminShell>
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-10"
      >
        <h2 className="font-display font-black leading-[0.95] tracking-[-0.03em] text-[clamp(2rem,5vw,3.25rem)]">
          {greeting()}, <span className="accent-headline">Devin.</span>
        </h2>
        <p className="font-mono text-xs text-muted-foreground mt-2">
          {format(new Date(), "EEEE, MMMM d, yyyy")}
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          {newCount} new {newCount === 1 ? "inquiry" : "inquiries"} · {weekTotal} this week
        </p>
      </motion.div>

      {/* Cross-venture inbox (assigned / mentions you) */}
      <CrossVentureInbox compact />

      {/* Venture quick-jump row */}
      {activeVentures.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.03 }}
          className="flex gap-2 overflow-x-auto pb-2 mb-8 -mx-1 px-1 snap-x"
          data-lenis-prevent
        >
          {activeVentures.map((v) => (
            <VenturePill key={v.id} venture={v} size="md" />
          ))}
        </motion.div>
      )}

      {/* Today's three */}
      <motion.section
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.05 }}
        className="mb-12"
      >
        <SectionHeader as="h2" numeral="01" eyebrow="Priorities" title={<>Today's <span className="accent-headline">three.</span></>} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {priorities.map((p) => (
            <PrioritySlot key={p.slot} slot={p.slot} value={p} onSave={savePriority} />
          ))}
        </div>
      </motion.section>

      {/* Pinned KPIs */}
      <motion.section
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.08 }}
        className="mb-12"
      >
        <SubHeader title="Pinned KPIs" onView={() => navigate("/hq/kpis")} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {pinned.map((k) => (
            <KpiCard key={k.id} kpi={k} compact onClick={() => setOpenKpiId(k.id)} />
          ))}
          {Array.from({ length: Math.max(0, 4 - pinned.length) }).map((_, i) => (
            <button
              key={`empty-${i}`}
              onClick={() => navigate("/hq/kpis")}
              className="panel p-3 min-h-[90px] flex items-center justify-center gap-2 border-dashed border-border/40 text-muted-foreground/60 hover:text-accent hover:border-accent/40 transition-colors text-xs"
            >
              <Pin size={12} /> Pin a KPI
            </button>
          ))}
        </div>
      </motion.section>

      {/* Quick capture */}
      <motion.section
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
        className="panel p-5 mb-12"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[13px] font-medium text-foreground">
            {logMode === "log" ? "Today's journal" : "Capture a thought"}
          </h3>
          <div className="flex gap-1">
            {(["capture", "log"] as const).map((m) => (
              <button key={m} onClick={() => setLogMode(m)}
                className={`px-2 py-0.5 text-[10px] rounded capitalize ${logMode === m ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}>
                {m}
              </button>
            ))}
          </div>
        </div>
        <textarea
          value={quickLog}
          onChange={(e) => setQuickLog(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) saveLog(); }}
          rows={3}
          placeholder={logMode === "log" ? "Append to today's notes…" : "What's on your mind? (⌘+Enter to save)"}
          className="w-full bg-secondary/40 border border-border/40 rounded-md p-3 text-sm outline-none focus:border-accent resize-none"
        />
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-2">
          <button
            onClick={saveLog}
            disabled={!quickLog.trim() || savingLog}
            className="flex-1 px-3 py-2 rounded-md bg-foreground text-background text-xs font-semibold disabled:opacity-40"
          >
            {savingLog ? "Saving…" : logMode === "log" ? "Add to log" : "Capture"}
          </button>
          <VoiceCaptureButton fullWidth onCaptured={(c) => setVoiceCapture(c)} />
          <button
            onClick={() => navigate("/hq/notes")}
            className="text-xs text-muted-foreground hover:text-accent flex items-center justify-center gap-1 px-3 py-2"
          >
            <BookOpen size={11} /> All notes <ArrowUpRight size={11} />
          </button>
        </div>

        {recentCaptures.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border/40 space-y-1.5">
            {recentCaptures.map((c) => (
              <button key={c.id} onClick={() => navigate("/hq/notes")}
                className="w-full text-left flex items-center justify-between gap-3 text-xs hover:text-accent transition-colors">
                <span className="truncate text-muted-foreground">
                  {c.title || c.body.split("\n")[0].slice(0, 70)}
                </span>
                <span className="font-mono text-[10px] text-muted-foreground/60 whitespace-nowrap">
                  {format(new Date(c.created_at), "MMM d")}
                </span>
              </button>
            ))}
          </div>
        )}
      </motion.section>

      {/* Recent inquiries */}
      <motion.section
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.12 }}
        className="mb-12"
      >
        <SubHeader title="Recent inbox" onView={() => navigate("/hq/inquiries")} />
        {recent.length === 0 ? (
          <p className="text-sm text-muted-foreground">No inquiries yet.</p>
        ) : (
          <div className="grid gap-2">
            {recent.map((r) => {
              const ventureSlug = r.form_data?.venture_slug as string | undefined;
              const ventureLabel = ventureSlug ? VENTURE_SLUG_LABEL[ventureSlug] : null;
              const isNew = r.status === "new";
              return (
                <button
                  key={r.id}
                  onClick={() => navigate(`/hq/inquiries/${r.id}`)}
                  className="text-left panel p-3 flex items-center gap-3 hover:border-accent/40 transition-colors"
                >
                  {isNew && <MailIcon size={12} className="text-accent shrink-0" />}
                  {ventureLabel && (
                    <span className="text-[9px] font-display font-black tracking-wider px-1.5 py-0.5 rounded shrink-0 bg-accent/15 text-accent">
                      {ventureLabel}
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-display font-semibold text-sm truncate">{r.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {r.service_type.replace(" Inquiry", "")} · {r.email}
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground whitespace-nowrap shrink-0">
                    {format(new Date(r.created_at), "MMM d")}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </motion.section>

      {/* Active projects + Scheduled content side by side */}
      <div className="grid lg:grid-cols-2 gap-6 mb-12">
        {topInProgress.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.14 }}
          >
            <SubHeader title="In progress" onView={() => navigate("/hq/ventures")} />
            <div className="grid gap-2">
              {topInProgress.map((p) => (
                <button
                  key={p.id}
                  onClick={() => navigate(`/hq/projects/${p.id}`)}
                  className="text-left panel p-3 flex items-center justify-between gap-3 hover:border-accent/40 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="font-display font-semibold text-sm truncate">{p.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{p.status}</p>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground whitespace-nowrap">
                    {p.percent_complete}%
                  </span>
                </button>
              ))}
            </div>
          </motion.section>
        )}

        {topContent.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.16 }}
          >
            <SubHeader title="Scheduled content" onView={() => navigate("/hq/content")} viewLabel="Calendar" />
            <div className="grid gap-2">
              {topContent.map((c) => {
                const v = activeVentures.find((x) => x.id === c.venture_id);
                const Icon = PLATFORM_ICON[c.platform as Platform];
                const accent = v?.accent_color ?? "hsl(30 8% 50%)";
                return (
                  <button
                    key={c.id}
                    onClick={() => navigate("/hq/content")}
                    className="text-left panel p-3 flex items-center justify-between gap-3 hover:border-accent/40 transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="h-2 w-2 rounded-full shrink-0" style={{ background: accent }} />
                      <Icon size={12} className="text-muted-foreground shrink-0" />
                      <div className="min-w-0">
                        <p className="font-display font-semibold text-sm truncate">{c.title}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {v?.short_name ?? v?.name ?? "—"} · {c.status}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground whitespace-nowrap shrink-0">
                      {format(new Date(c.scheduled_at!), "EEE p")}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.section>
        )}
      </div>

      <KpiDetail kpiId={openKpiId} onOpenChange={(o) => !o && setOpenKpiId(null)} />
      <VoicePostCaptureSheet capture={voiceCapture} onClose={() => setVoiceCapture(null)} />
    </AdminShell>
    </AdminGuard>
  );
};

export default Today;
