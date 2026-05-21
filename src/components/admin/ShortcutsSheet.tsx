import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SHORTCUTS: { keys: string; label: string }[] = [
  { keys: "⌘ K", label: "Open command bar (Ask HQ)" },
  { keys: "⌘ ⇧ N", label: "Quick note capture" },
  { keys: "?", label: "Show this shortcut sheet" },
  { keys: "G then T", label: "Go to Today (coming soon)" },
  { keys: "G then I", label: "Go to Inbox (coming soon)" },
  { keys: "G then V", label: "Go to Ventures (coming soon)" },
  { keys: "Esc", label: "Close any open dialog" },
];

const ShortcutsSheet = ({ open, onOpenChange }: Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Keyboard shortcuts</DialogTitle>
        </DialogHeader>
        <div className="space-y-1.5 mt-2">
          {SHORTCUTS.map((s) => (
            <div
              key={s.keys}
              className="flex items-center justify-between gap-3 py-1.5 px-2 rounded-md hover:bg-secondary/40"
            >
              <span className="text-sm text-foreground">{s.label}</span>
              <kbd className="font-mono text-[11px] px-2 py-0.5 rounded border border-border/60 bg-secondary/40 text-muted-foreground whitespace-nowrap">
                {s.keys}
              </kbd>
            </div>
          ))}
        </div>
        <p className="text-[10px] font-mono text-muted-foreground mt-3">
          Press ? anywhere in DevHQ.
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default ShortcutsSheet;
