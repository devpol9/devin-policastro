import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Sparkles, CornerDownLeft, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface Props { open: boolean; onOpenChange: (o: boolean) => void; }

const examples = [
  "log 12 to weekly leads",
  "add priority: call Joe about valence demo",
  "remember: try gemini-pro-image for the 2thirty hero",
  "add person Sarah Chen, founder at Acme, met at WeFest",
  "new project: ship Q3 referral landing — high priority, valence",
];

const HqCommandBar = ({ open, onOpenChange }: Props) => {
  const [prompt, setPrompt] = useState("");
  const [busy, setBusy] = useState(false);
  const [last, setLast] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const qc = useQueryClient();

  useEffect(() => {
    if (open) { setPrompt(""); setLast(null); setTimeout(() => inputRef.current?.focus(), 50); }
  }, [open]);

  const run = async () => {
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
    // Invalidate broad swath so dashboards refresh
    qc.invalidateQueries();
    if (r?.type !== "answer") setTimeout(() => onOpenChange(false), 700);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-0 gap-0 overflow-hidden" data-lenis-prevent>
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border/40">
          <Sparkles size={16} className="text-accent" />
          <input
            ref={inputRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") run(); }}
            placeholder="Tell HQ what to do…"
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground/60"
            disabled={busy}
          />
          {busy ? <Loader2 size={14} className="animate-spin text-muted-foreground" /> :
            <button onClick={run} className="text-[10px] text-muted-foreground flex items-center gap-1 hover:text-foreground">
              run <CornerDownLeft size={11} />
            </button>}
        </div>
        <div className="p-3 text-[11px] text-muted-foreground space-y-1.5 max-h-72 overflow-y-auto">
          {last && <div className="text-foreground text-xs px-1 pb-2">{last}</div>}
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground/50 px-1">try</div>
          {examples.map((ex) => (
            <button
              key={ex}
              onClick={() => { setPrompt(ex); inputRef.current?.focus(); }}
              className="block w-full text-left px-2 py-1.5 rounded hover:bg-muted/40 transition-colors"
            >
              {ex}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HqCommandBar;
