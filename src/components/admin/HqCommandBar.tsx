import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Sparkles, CornerDownLeft, Loader2, FileText, KanbanSquare,
  Users, Mail, Search,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface Props { open: boolean; onOpenChange: (o: boolean) => void; }

type Hit = {
  id: string;
  kind: "capture" | "project" | "person" | "inquiry";
  title: string;
  subtitle?: string;
  to: string;
};

const KIND_META: Record<Hit["kind"], { icon: typeof FileText; label: string }> = {
  capture: { icon: FileText, label: "Note" },
  project: { icon: KanbanSquare, label: "Project" },
  person: { icon: Users, label: "Person" },
  inquiry: { icon: Mail, label: "Inquiry" },
};

const examples = [
  "log 12 to weekly leads",
  "add priority: call Joe about valence demo",
  "convert Sarah's manufacturing inquiry to a project",
  "remember: try gemini-pro-image for the 2thirty hero",
  "add person Sarah Chen, founder at Acme, met at WeFest",
  "new project: ship Q3 referral landing — high priority, valence",
];

const HqCommandBar = ({ open, onOpenChange }: Props) => {
  const [prompt, setPrompt] = useState("");
  const [debounced, setDebounced] = useState("");
  const [busy, setBusy] = useState(false);
  const [searching, setSearching] = useState(false);
  const [hits, setHits] = useState<Hit[]>([]);
  const [cursor, setCursor] = useState(0);
  const [last, setLast] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const qc = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      setPrompt(""); setLast(null); setHits([]); setCursor(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebounced(prompt.trim()), 150);
    return () => clearTimeout(t);
  }, [prompt]);

  // Live search across captures / projects / people / inquiries
  useEffect(() => {
    let cancelled = false;
    const q = debounced;
    if (q.length < 2) { setHits([]); setSearching(false); return; }
    setSearching(true);
    const like = `%${q}%`;
    (async () => {
      const [caps, projs, ppl, inq] = await Promise.all([
        supabase.from("quick_captures")
          .select("id,title,body,kind")
          .or(`title.ilike.${like},body.ilike.${like}`)
          .eq("archived", false)
          .order("updated_at", { ascending: false })
          .limit(4),
        supabase.from("projects")
          .select("id,title,description,status")
          .or(`title.ilike.${like},description.ilike.${like}`)
          .order("updated_at", { ascending: false })
          .limit(4),
        supabase.from("people")
          .select("id,name,company,role,email")
          .or(`name.ilike.${like},company.ilike.${like},email.ilike.${like}`)
          .order("updated_at", { ascending: false })
          .limit(4),
        supabase.from("inquiries")
          .select("id,name,email,service_type,status")
          .or(`name.ilike.${like},email.ilike.${like},service_type.ilike.${like}`)
          .order("created_at", { ascending: false })
          .limit(4),
      ]);
      if (cancelled) return;
      const out: Hit[] = [];
      (caps.data ?? []).forEach((c: any) => out.push({
        id: c.id, kind: "capture",
        title: c.title || (c.body ?? "").split("\n")[0].slice(0, 80) || "Untitled note",
        subtitle: c.kind,
        to: "/hq/notes",
      }));
      (projs.data ?? []).forEach((p: any) => out.push({
        id: p.id, kind: "project",
        title: p.title,
        subtitle: p.status,
        to: `/hq/projects/${p.id}`,
      }));
      (ppl.data ?? []).forEach((p: any) => out.push({
        id: p.id, kind: "person",
        title: p.name,
        subtitle: [p.role, p.company].filter(Boolean).join(" · ") || p.email || undefined,
        to: "/hq/people",
      }));
      (inq.data ?? []).forEach((i: any) => out.push({
        id: i.id, kind: "inquiry",
        title: i.name,
        subtitle: `${i.service_type} · ${i.status}`,
        to: `/hq/inquiries/${i.id}`,
      }));
      setHits(out);
      setCursor(0);
      setSearching(false);
    })();
    return () => { cancelled = true; };
  }, [debounced]);

  const runAi = async () => {
    const text = prompt.trim();
    if (!text || busy) return;
    setBusy(true); setLast(null);
    const { data, error } = await supabase.functions.invoke("hq-command", { body: { prompt: text } });
    setBusy(false);
    if (error) { toast.error(error.message || "Command failed"); return; }
    const r = data?.result;
    if (r?.error) { toast.error(r.error); setLast(r.error); return; }
    toast.success(r?.message || "Done");
    setLast(r?.message || null);
    setPrompt("");
    qc.invalidateQueries();
    if (r?.type !== "answer") setTimeout(() => onOpenChange(false), 700);
  };

  const openHit = (h: Hit) => {
    onOpenChange(false);
    navigate(h.to);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" && hits.length) {
      e.preventDefault(); setCursor((c) => Math.min(c + 1, hits.length - 1));
    } else if (e.key === "ArrowUp" && hits.length) {
      e.preventDefault(); setCursor((c) => Math.max(c - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (hits.length > 0) openHit(hits[cursor]);
      else runAi();
    }
  };

  const grouped = useMemo(() => {
    const m: Record<Hit["kind"], Hit[]> = { capture: [], project: [], person: [], inquiry: [] };
    hits.forEach((h) => m[h.kind].push(h));
    return m;
  }, [hits]);

  const showResults = hits.length > 0;
  const showExamples = !showResults && !prompt.trim();

  let flatIdx = -1;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-0 gap-0 overflow-hidden" data-lenis-prevent>
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border/40">
          {showResults ? <Search size={16} className="text-muted-foreground" /> : <Sparkles size={16} className="text-accent" />}
          <input
            ref={inputRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search or tell HQ what to do…"
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground/60"
            disabled={busy}
          />
          {(busy || searching) ? <Loader2 size={14} className="animate-spin text-muted-foreground" /> : (
            <button onClick={() => (hits.length ? openHit(hits[cursor]) : runAi())}
              className="text-[10px] text-muted-foreground flex items-center gap-1 hover:text-foreground">
              {hits.length ? "open" : "run"} <CornerDownLeft size={11} />
            </button>
          )}
        </div>

        <div className="p-2 text-[11px] text-muted-foreground max-h-80 overflow-y-auto">
          {last && <div className="text-foreground text-xs px-2 py-2">{last}</div>}

          {showResults && (
            <div className="space-y-3 py-1">
              {(Object.keys(grouped) as Hit["kind"][]).map((k) => {
                const list = grouped[k];
                if (!list.length) return null;
                const Icon = KIND_META[k].icon;
                return (
                  <div key={k}>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground/50 px-2 pb-1">
                      {KIND_META[k].label}s
                    </div>
                    {list.map((h) => {
                      flatIdx += 1;
                      const active = flatIdx === cursor;
                      return (
                        <button
                          key={h.id}
                          onClick={() => openHit(h)}
                          onMouseEnter={() => setCursor(flatIdx)}
                          className={`w-full text-left px-2 py-1.5 rounded flex items-center gap-2 ${
                            active ? "bg-muted/60 text-foreground" : "hover:bg-muted/40"
                          }`}
                        >
                          <Icon size={12} className="text-muted-foreground shrink-0" />
                          <span className="text-xs font-medium truncate flex-1">{h.title}</span>
                          {h.subtitle && (
                            <span className="text-[10px] text-muted-foreground truncate max-w-[40%]">{h.subtitle}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}

          {!showResults && prompt.trim().length >= 2 && !searching && (
            <div className="px-2 py-3 text-[11px] text-muted-foreground">
              No matches. Press <kbd className="text-[10px] px-1 py-0.5 rounded border border-border/40">Enter</kbd> to ask HQ.
            </div>
          )}

          {showExamples && (
            <div className="space-y-0.5 py-1">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground/50 px-2 pb-1">try</div>
              {examples.map((ex) => (
                <button
                  key={ex}
                  onClick={() => { setPrompt(ex); inputRef.current?.focus(); }}
                  className="block w-full text-left px-2 py-1.5 rounded text-[11px] text-muted-foreground hover:bg-muted/40 hover:text-foreground transition-colors"
                >
                  {ex}
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HqCommandBar;
