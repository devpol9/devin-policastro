import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { format, parseISO, isToday, isYesterday, differenceInDays } from "date-fns";
import { Calendar as CalendarIcon, Search } from "lucide-react";
import ReactMarkdown from "react-markdown";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminShell from "@/components/admin/AdminShell";
import SectionHeader from "@/components/SectionHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
  useDailyLog, useDailyLogFeed, useSaveDailyLog, useTodayContext, useAllLogTags,
  type DailyLog,
} from "@/hooks/use-daily-log";

const toISO = (d: Date) => format(d, "yyyy-MM-dd");

const relativeDateLabel = (date: string) => {
  const d = parseISO(date + "T00:00:00");
  if (isToday(d)) return "Today";
  if (isYesterday(d)) return "Yesterday";
  const diff = differenceInDays(new Date(), d);
  if (diff > 0 && diff <= 7) return `${diff} days ago`;
  return format(d, "EEEE, MMMM d, yyyy");
};

const AutoTextarea = ({
  value, onSave, placeholder, rows = 3,
}: {
  value: string | null;
  onSave: (v: string) => void;
  placeholder: string;
  rows?: number;
}) => {
  const [local, setLocal] = useState(value ?? "");
  const [saved, setSaved] = useState(false);
  useEffect(() => { setLocal(value ?? ""); }, [value]);
  return (
    <div className="relative">
      <Textarea
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        onBlur={() => {
          if (local !== (value ?? "")) {
            onSave(local);
            setSaved(true);
            setTimeout(() => setSaved(false), 1400);
          }
        }}
        rows={rows}
        placeholder={placeholder}
        className="resize-none"
      />
      {saved && (
        <span className="absolute top-1 right-2 text-[10px] font-mono text-accent">Saved</span>
      )}
    </div>
  );
};

const Slider10 = ({ value, onChange, label, lowEmoji, highEmoji }: {
  value: number | null; onChange: (v: number) => void;
  label: string; lowEmoji: string; highEmoji: string;
}) => (
  <div>
    <div className="flex items-center justify-between mb-1">
      <span className="text-xs font-display font-semibold">{label}</span>
      <span className="text-xs font-mono text-muted-foreground">{value ?? "—"}/10</span>
    </div>
    <div className="flex items-center gap-2">
      <span>{lowEmoji}</span>
      <input
        type="range" min={1} max={10} step={1}
        value={value ?? 5}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 accent-[hsl(var(--accent))]"
      />
      <span>{highEmoji}</span>
    </div>
  </div>
);

const Editor = ({ date }: { date: string }) => {
  const { data: log } = useDailyLog(date);
  const { data: ctx } = useTodayContext(date);
  const save = useSaveDailyLog();
  const [tagInput, setTagInput] = useState("");

  const persist = (partial: Partial<DailyLog>) =>
    save.mutate({ date, partial: partial as any });

  const addTag = () => {
    const t = tagInput.trim();
    if (!t) return;
    const existing = log?.tags ?? [];
    if (!existing.includes(t)) persist({ tags: [...existing, t] });
    setTagInput("");
  };

  const removeTag = (t: string) =>
    persist({ tags: (log?.tags ?? []).filter((x) => x !== t) });

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <div className="lg:col-span-3 space-y-6">
        <div>
          <h3 className="font-display font-black text-3xl tracking-tight">{relativeDateLabel(date)}</h3>
          <p className="font-mono text-xs text-muted-foreground mt-1">{format(parseISO(date + "T00:00:00"), "EEE, MMM d, yyyy")}</p>
        </div>

        {(["wins", "challenges", "tomorrow_focus", "notes"] as const).map((field, idx) => {
          const labels = {
            wins: { num: "01", title: "Wins", placeholder: "What worked today?" },
            challenges: { num: "02", title: "Challenges", placeholder: "What got in the way?" },
            tomorrow_focus: { num: "03", title: "Tomorrow's focus", placeholder: "What's the one thing?" },
            notes: { num: "04", title: "Notes", placeholder: "Free-form. Whatever's on your mind." },
          }[field];
          return (
            <div key={field}>
              <div className="flex items-center gap-3 mb-2">
                <span className="font-mono text-[10px] text-foreground/40 tabular-nums">{labels.num}</span>
                <span className="h-px w-6 bg-foreground/20" />
                <span className="text-foreground/70 text-[10px] font-display font-medium tracking-[0.18em] uppercase">{labels.title}</span>
              </div>
              <AutoTextarea
                value={log?.[field] ?? ""}
                onSave={(v) => persist({ [field]: v } as any)}
                placeholder={labels.placeholder}
                rows={field === "notes" ? 8 : 3}
              />
            </div>
          );
        })}
      </div>

      <div className="lg:col-span-2 space-y-5">
        <div className="glass-card p-4 space-y-4">
          <p className="text-[11px] text-muted-foreground/70 font-medium">Mood & energy</p>
          <Slider10 value={log?.mood ?? null} label="Mood" lowEmoji="😞" highEmoji="😊"
            onChange={(v) => persist({ mood: v })} />
          <Slider10 value={log?.energy ?? null} label="Energy" lowEmoji="🪫" highEmoji="🔋"
            onChange={(v) => persist({ energy: v })} />
        </div>

        <div className="glass-card p-4">
          <p className="text-[11px] text-muted-foreground/70 font-medium mb-2">Tags</p>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {(log?.tags ?? []).map((t) => (
              <button key={t} onClick={() => removeTag(t)}
                className="text-[10px] px-2 py-0.5 rounded-md border border-accent/40 text-accent hover:bg-accent/10">
                #{t} ×
              </button>
            ))}
          </div>
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
            placeholder="Add a tag and press Enter"
            className="h-8 text-xs"
          />
        </div>

        {ctx && (
          <div className="glass-card p-4">
            <p className="text-[11px] text-muted-foreground/70 font-medium mb-2">Today's data</p>
            <ul className="space-y-1.5 text-xs">
              <li className="flex justify-between"><span className="text-muted-foreground">Priorities done</span><span className="font-mono">{ctx.prioritiesDone}/{ctx.prioritiesTotal || 3}</span></li>
              <li className="flex justify-between"><span className="text-muted-foreground">Inquiries received</span><span className="font-mono">{ctx.inquiries}</span></li>
              <li className="flex justify-between"><span className="text-muted-foreground">Content posted</span><span className="font-mono">{ctx.contentPosted}</span></li>
              <li className="flex justify-between"><span className="text-muted-foreground">Projects updated</span><span className="font-mono">{ctx.projectsUpdated}</span></li>
              <li className="flex justify-between"><span className="text-muted-foreground">KPIs logged</span><span className="font-mono">{ctx.kpisLogged}</span></li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

const FeedCard = ({ log, onOpen }: { log: DailyLog; onOpen: () => void }) => (
  <button onClick={onOpen} className="text-left glass-card p-4 w-full hover:border-accent/40 transition-colors">
    <div className="flex items-center justify-between mb-2">
      <h4 className="font-display font-bold text-base">{relativeDateLabel(log.log_date)}</h4>
      <span className="font-mono text-[10px] text-muted-foreground">{log.log_date}</span>
    </div>
    {(log.mood || log.energy) && (
      <p className="text-[11px] text-muted-foreground mb-2">
        {log.mood && <>Mood {log.mood}/10 · </>}{log.energy && <>Energy {log.energy}/10</>}
      </p>
    )}
    {log.wins && <div className="mb-2"><p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-0.5">Wins</p><p className="text-xs line-clamp-2">{log.wins}</p></div>}
    {log.challenges && <div className="mb-2"><p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-0.5">Challenges</p><p className="text-xs line-clamp-2">{log.challenges}</p></div>}
    {log.tomorrow_focus && <div className="mb-2"><p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-0.5">Tomorrow</p><p className="text-xs line-clamp-2">{log.tomorrow_focus}</p></div>}
    {log.notes && <p className="text-xs text-muted-foreground line-clamp-3 mt-2">{log.notes.slice(0, 200)}{log.notes.length > 200 ? "…" : ""}</p>}
    {log.tags.length > 0 && (
      <div className="flex flex-wrap gap-1 mt-3">
        {log.tags.map((t) => <span key={t} className="text-[10px] px-1.5 py-0.5 rounded-md border border-border/50 text-muted-foreground">#{t}</span>)}
      </div>
    )}
  </button>
);

const DailyLogInner = () => {
  const [date, setDate] = useState<string>(toISO(new Date()));
  const isOnToday = date === toISO(new Date());
  const [view, setView] = useState<"editor" | "feed">("editor");
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  useEffect(() => { const t = setTimeout(() => setDebounced(search), 200); return () => clearTimeout(t); }, [search]);
  const [activeTags, setActiveTags] = useState<string[]>([]);

  const { data: allTags = [] } = useAllLogTags();
  const { data: feed = [] } = useDailyLogFeed({
    search: debounced.trim() || undefined,
    tags: activeTags.length ? activeTags : undefined,
  });

  return (
    <AdminShell>
      <SectionHeader
        as="h2"
        numeral="05"
        eyebrow="Reflection"
        title={<>Daily <span className="accent-headline">log.</span></>}
        description="How today went. What tomorrow needs."
      />

      <div className="glass-card p-3 mb-6 flex flex-wrap items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className={cn("text-xs", !date && "text-muted-foreground")}>
              <CalendarIcon size={12} className="mr-1" />
              {format(parseISO(date + "T00:00:00"), "PPP")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={parseISO(date + "T00:00:00")}
              onSelect={(d) => d && setDate(toISO(d))}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
        {!isOnToday && (
          <Button size="sm" variant="ghost" onClick={() => setDate(toISO(new Date()))}>Today</Button>
        )}
        <div className="flex gap-1 ml-2">
          {(["editor", "feed"] as const).map((v) => (
            <button key={v} onClick={() => setView(v)}
              className={`px-2.5 py-1 text-[11px] font-display rounded-md capitalize ${view === v ? "bg-foreground text-background" : "hover:bg-secondary/60"}`}>
              {v}
            </button>
          ))}
        </div>
        {allTags.length > 0 && view === "feed" && (
          <div className="flex gap-1 flex-wrap items-center">
            <span className="text-[10px] text-muted-foreground ml-2">Tags:</span>
            {allTags.slice(0, 12).map((t) => (
              <button key={t}
                onClick={() => setActiveTags((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t])}
                className={`text-[10px] px-2 py-0.5 rounded-md border ${activeTags.includes(t) ? "bg-accent/15 border-accent text-accent" : "border-border/50 text-muted-foreground"}`}>
                #{t}
              </button>
            ))}
          </div>
        )}
        <div className="flex-1 min-w-[180px] flex items-center gap-1 bg-secondary/40 border border-border/40 rounded px-2 ml-auto">
          <Search size={12} className="text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search journal" className="bg-transparent text-xs outline-none flex-1 py-1" />
        </div>
      </div>

      {view === "editor" ? (
        <Editor key={date} date={date} />
      ) : feed.length === 0 ? (
        <div className="glass-card p-10 text-center">
          <p className="text-sm text-muted-foreground mb-3">No journal entries yet. Today's a good day to start.</p>
          <Button onClick={() => { setDate(toISO(new Date())); setView("editor"); }}>Start today's entry</Button>
        </div>
      ) : (
        <div className="space-y-3">
          {feed.map((l) => (
            <FeedCard key={l.id} log={l} onOpen={() => { setDate(l.log_date); setView("editor"); }} />
          ))}
        </div>
      )}
    </AdminShell>
  );
};

const DailyLogPage = () => (
  <AdminGuard><DailyLogInner /></AdminGuard>
);

export default DailyLogPage;
