import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, X, StickyNote, LineChart, Mic, Sparkles, Inbox, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  onOpenNote: () => void;
  onOpenCmd: () => void;
  onOpenVoice: () => void;
  onOpenKpi: () => void;
}

const QuickActionsFab = ({ onOpenNote, onOpenCmd, onOpenVoice, onOpenKpi }: Props) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const actions = [
    { label: "Ask HQ", icon: Sparkles, onClick: () => { onOpenCmd(); setOpen(false); } },
    { label: "Quick note", icon: StickyNote, onClick: () => { onOpenNote(); setOpen(false); } },
    { label: "Voice memo", icon: Mic, onClick: () => { onOpenVoice(); setOpen(false); } },
    { label: "Log KPI", icon: LineChart, onClick: () => { onOpenKpi(); setOpen(false); } },
    { label: "Inbox", icon: Inbox, onClick: () => { navigate("/hq/inquiries"); setOpen(false); } },
    { label: "Content", icon: Calendar, onClick: () => { navigate("/hq/content"); setOpen(false); } },
  ];

  return (
    <>
      {open && (
        <button
          aria-label="Close quick actions"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-background/50 backdrop-blur-[2px] animate-in fade-in"
        />
      )}

      <div className="fixed right-4 z-50 bottom-[4.5rem] md:bottom-6 flex flex-col items-end gap-2 pointer-events-none">
        {open && (
          <div className="flex flex-col items-end gap-2 pointer-events-auto">
            {actions.map((a, i) => {
              const Icon = a.icon;
              return (
                <button
                  key={a.label}
                  onClick={a.onClick}
                  style={{ animationDelay: `${i * 30}ms` }}
                  className="group flex items-center gap-2 animate-in fade-in slide-in-from-right-2"
                >
                  <span className="text-[11px] font-medium px-2 py-1 rounded-md bg-background border border-border/60 text-foreground shadow-sm">
                    {a.label}
                  </span>
                  <span className="h-10 w-10 rounded-full bg-background border border-border flex items-center justify-center text-foreground shadow-md hover:bg-secondary transition-colors">
                    <Icon size={16} strokeWidth={1.75} />
                  </span>
                </button>
              );
            })}
          </div>
        )}

        <button
          aria-label={open ? "Close quick actions" : "Open quick actions"}
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "pointer-events-auto h-12 w-12 rounded-full flex items-center justify-center shadow-lg transition-all",
            "bg-foreground text-background hover:scale-105 active:scale-95",
            open && "rotate-45"
          )}
        >
          {open ? <X size={18} /> : <Plus size={20} strokeWidth={2} />}
        </button>
      </div>
    </>
  );
};

export default QuickActionsFab;
