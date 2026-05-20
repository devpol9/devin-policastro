import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Zap, Search, Pin, Archive, Sparkles, ExternalLink } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { formatDistanceToNow } from "date-fns";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminShell from "@/components/admin/AdminShell";
import SectionHeader from "@/components/SectionHeader";
import VenturePill from "@/components/admin/VenturePill";
import NoteDialog from "@/components/admin/NoteDialog";
import NoteCaptureDialog from "@/components/admin/NoteCaptureDialog";
import NoteDetail from "@/components/admin/NoteDetail";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useVentures } from "@/hooks/use-ventures";
import { useCaptures, type CaptureKind, type CaptureFilters, type Capture } from "@/hooks/use-captures";

const KINDS: { value: CaptureKind | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "note", label: "Notes" },
  { value: "idea", label: "Ideas" },
  { value: "quote", label: "Quotes" },
  { value: "link", label: "Links" },
  { value: "reference", label: "References" },
];

const VIEWS = ["wall", "list", "venture"] as const;
type View = typeof VIEWS[number];

const VIEW_KEY = "devhq.notes.view";

const CaptureCard = ({ capture, onClick }: { capture: Capture; onClick: () => void }) => {
  const { ventures } = useVentures();
  const venture = capture.venture_id ? ventures.find((v) => v.id === capture.venture_id) : undefined;
  const accent = venture?.accent_color ?? "hsl(24 32% 52%)";
  const title = capture.title || capture.body.split("\n")[0].slice(0, 80);
  const body = capture.title ? capture.body : capture.body.split("\n").slice(1).join("\n");
  const meta = (capture.meta ?? {}) as any;

  return (
    <button
      onClick={onClick}
      className="group text-left glass-card p-4 flex flex-col gap-2 hover:border-accent/40 transition-all"
      style={{ borderLeft: `3px solid ${accent}` }}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] font-display font-semibold tracking-[0.12em] uppercase text-muted-foreground">
          {capture.kind}
        </span>
        <div className="flex items-center gap-1">
          {capture.promoted_project_id && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent/15 text-accent font-display font-semibold">→ Project</span>
          )}
          {capture.pinned && <Pin size={11} className="text-accent" />}
        </div>
      </div>
      <p className="font-display font-semibold text-sm leading-snug line-clamp-2">{title}</p>
      {body.trim() && (
        <div className="text-xs text-muted-foreground line-clamp-3 prose prose-xs max-w-none">
          <ReactMarkdown>{body.slice(0, 200)}</ReactMarkdown>
        </div>
      )}
      {capture.kind === "link" && meta.url && (
        <span className="inline-flex items-center gap-1 text-[10px] font-mono text-muted-foreground truncate">
          <ExternalLink size={10} /> {meta.url}
        </span>
      )}
      <div className="flex items-center justify-between mt-1 pt-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          {venture && <VenturePill venture={venture} clickable={false} />}
          {capture.tags.slice(0, 3).map((t) => (
            <span key={t} className="text-[10px] px-1.5 py-0.5 rounded-full border border-border/50 text-muted-foreground">#{t}</span>
          ))}
          {capture.tags.length > 3 && (
            <span className="text-[10px] text-muted-foreground">+{capture.tags.length - 3}</span>
          )}
        </div>
        <span className="text-[10px] font-mono text-muted-foreground/70 whitespace-nowrap">
          {formatDistanceToNow(new Date(capture.created_at), { addSuffix: true })}
        </span>
      </div>
    </button>
  );
};

const NotesIdeasInner = () => {
  const { activeVentures } = useVentures();
  const [view, setView] = useState<View>(() => {
    try { return (localStorage.getItem(VIEW_KEY) as View) || "wall"; } catch { return "wall"; }
  });
  useEffect(() => { try { localStorage.setItem(VIEW_KEY, view); } catch {} }, [view]);

  const [kind, setKind] = useState<CaptureKind | "all">("all");
  const [ventureFilter, setVentureFilter] = useState<string>("all"); // all | unscoped | ventureId
  const [showArchived, setShowArchived] = useState(false);
  const [showPromoted, setShowPromoted] = useState(true);
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  useEffect(() => { const t = setTimeout(() => setDebounced(search), 200); return () => clearTimeout(t); }, [search]);

  const filters: CaptureFilters = {
    kind,
    venture_id: ventureFilter as any,
    archived: showArchived,
    showPromoted,
    search: debounced.trim() || undefined,
  };
  const { data: captures = [], isLoading } = useCaptures(filters);

  const [newOpen, setNewOpen] = useState(false);
  const [quickOpen, setQuickOpen] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);

  const grouped = useMemo(() => {
    const map = new Map<string | null, Capture[]>();
    captures.forEach((c) => {
      const key = c.venture_id ?? null;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(c);
    });
    return map;
  }, [captures]);

  return (
    <AdminShell>
      <div className="flex items-start justify-between gap-4 mb-2">
        <div className="flex-1">
          <SectionHeader
            as="h2"
            numeral="09"
            eyebrow="Capture"
            title={<>Notes & <span className="accent-headline">ideas.</span></>}
            description="Everything worth keeping."
          />
        </div>
        <div className="flex gap-2 shrink-0 mt-2">
          <Button variant="outline" size="sm" onClick={() => setQuickOpen(true)}>
            <Zap size={12} className="mr-1" /> Quick
          </Button>
          <Button size="sm" onClick={() => setNewOpen(true)}>
            <Plus size={12} className="mr-1" /> New capture
          </Button>
        </div>
      </div>

      <div className="glass-card p-3 mb-6 flex flex-wrap items-center gap-2">
        <div className="flex gap-1">
          {VIEWS.map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-2.5 py-1 text-[11px] font-display rounded-md capitalize ${
                view === v ? "bg-foreground text-background" : "hover:bg-secondary/60"
              }`}
            >
              {v === "venture" ? "By venture" : v}
            </button>
          ))}
        </div>
        <span className="text-border">|</span>
        <div className="flex gap-1 flex-wrap">
          {KINDS.map((k) => (
            <button
              key={k.value}
              onClick={() => setKind(k.value)}
              className={`px-2 py-1 text-[10px] font-display rounded-full border ${
                kind === k.value ? "bg-accent/15 border-accent text-accent" : "border-border/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              {k.label}
            </button>
          ))}
        </div>
        <span className="text-border">|</span>
        <select
          value={ventureFilter}
          onChange={(e) => setVentureFilter(e.target.value)}
          className="text-[11px] bg-secondary/40 border border-border/40 rounded px-2 py-1 outline-none"
        >
          <option value="all">All ventures</option>
          <option value="unscoped">Unscoped</option>
          {activeVentures.map((v) => (
            <option key={v.id} value={v.id}>{v.short_name || v.name}</option>
          ))}
        </select>
        <label className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <input type="checkbox" checked={showArchived} onChange={(e) => setShowArchived(e.target.checked)} /> Archived
        </label>
        <label className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <input type="checkbox" checked={showPromoted} onChange={(e) => setShowPromoted(e.target.checked)} /> Promoted
        </label>
        <div className="flex-1 min-w-[180px] flex items-center gap-1 bg-secondary/40 border border-border/40 rounded px-2 ml-auto">
          <Search size={12} className="text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="bg-transparent text-xs outline-none flex-1 py-1"
          />
        </div>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : captures.length === 0 ? (
        <div className="glass-card p-10 text-center">
          <p className="text-sm text-muted-foreground mb-3">
            No captures yet. Capture anything — a quote, an idea, a link.
          </p>
          <Button onClick={() => setQuickOpen(true)}><Zap size={12} className="mr-1" /> Quick capture</Button>
        </div>
      ) : view === "wall" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {captures.map((c) => (
            <CaptureCard key={c.id} capture={c} onClick={() => setOpenId(c.id)} />
          ))}
        </div>
      ) : view === "list" ? (
        <div className="glass-card overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-secondary/40 text-muted-foreground">
              <tr>
                <th className="text-left p-2 font-display">Title</th>
                <th className="text-left p-2 font-display">Kind</th>
                <th className="text-left p-2 font-display">Venture</th>
                <th className="text-left p-2 font-display">Tags</th>
                <th className="text-left p-2 font-display">Status</th>
                <th className="text-left p-2 font-display">Updated</th>
              </tr>
            </thead>
            <tbody>
              {captures.map((c) => {
                const v = c.venture_id ? activeVentures.find((x) => x.id === c.venture_id) : undefined;
                return (
                  <tr key={c.id} onClick={() => setOpenId(c.id)}
                    className="border-t border-border/40 hover:bg-secondary/30 cursor-pointer">
                    <td className="p-2 font-display font-semibold truncate max-w-xs">
                      {c.title || c.body.split("\n")[0].slice(0, 60)}
                    </td>
                    <td className="p-2 capitalize text-muted-foreground">{c.kind}</td>
                    <td className="p-2">{v ? (v.short_name || v.name) : <span className="text-muted-foreground">—</span>}</td>
                    <td className="p-2 text-muted-foreground truncate max-w-[180px]">{c.tags.join(", ") || "—"}</td>
                    <td className="p-2">
                      {c.pinned && <Pin size={10} className="inline text-accent mr-1" />}
                      {c.promoted_project_id && <Sparkles size={10} className="inline text-accent mr-1" />}
                      {c.archived && <Archive size={10} className="inline text-muted-foreground" />}
                    </td>
                    <td className="p-2 text-muted-foreground font-mono text-[10px]">
                      {formatDistanceToNow(new Date(c.updated_at), { addSuffix: true })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        // By venture
        <div className="space-y-8">
          {(() => {
            const sections: { key: string; label: string; venture?: typeof activeVentures[number]; items: Capture[] }[] = [];
            const unscoped = grouped.get(null) ?? [];
            if (unscoped.length) sections.push({ key: "unscoped", label: "Unscoped", items: unscoped });
            activeVentures.forEach((v) => {
              const items = grouped.get(v.id) ?? [];
              if (items.length) sections.push({ key: v.id, label: v.name, venture: v, items });
            });
            return sections.map((s) => (
              <div key={s.key}>
                <div className="flex items-center gap-2 mb-3">
                  {s.venture ? <VenturePill venture={s.venture} clickable={false} /> : (
                    <span className="text-xs font-display font-semibold text-muted-foreground">{s.label}</span>
                  )}
                  <span className="text-[10px] font-mono text-muted-foreground">{s.items.length}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {s.items.map((c) => <CaptureCard key={c.id} capture={c} onClick={() => setOpenId(c.id)} />)}
                </div>
              </div>
            ));
          })()}
        </div>
      )}

      <NoteDialog open={newOpen} onOpenChange={setNewOpen} onCreated={(c) => setOpenId(c.id)} />
      <NoteCaptureDialog open={quickOpen} onOpenChange={setQuickOpen} />
      <NoteDetail captureId={openId} onOpenChange={(o) => !o && setOpenId(null)} />
    </AdminShell>
  );
};

const NotesIdeas = () => (
  <AdminGuard><NotesIdeasInner /></AdminGuard>
);

export default NotesIdeas;
