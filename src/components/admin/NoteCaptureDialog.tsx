import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useVentures } from "@/hooks/use-ventures";
import { useCreateCapture, type CaptureKind } from "@/hooks/use-captures";
import TriageSuggestionSheet from "@/components/admin/TriageSuggestionSheet";
import { toast } from "sonner";

const LAST_KIND = "devhq.notes.lastKind";
const LAST_VENTURE = "devhq.notes.lastVenture";

const KINDS: { value: CaptureKind; label: string }[] = [
  { value: "note", label: "Note" },
  { value: "idea", label: "Idea" },
  { value: "quote", label: "Quote" },
  { value: "link", label: "Link" },
  { value: "reference", label: "Reference" },
];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NoteCaptureDialog = ({ open, onOpenChange }: Props) => {
  const { activeVentures } = useVentures();
  const create = useCreateCapture();
  const [body, setBody] = useState("");
  const [kind, setKind] = useState<CaptureKind>("note");
  const [ventureId, setVentureId] = useState<string>("none");
  const [triageFor, setTriageFor] = useState<{ id: string; body: string } | null>(null);

  useEffect(() => {
    if (!open) return;
    setBody("");
    setKind((localStorage.getItem(LAST_KIND) as CaptureKind) || "note");
    setVentureId(localStorage.getItem(LAST_VENTURE) || "none");
  }, [open]);

  const submit = async () => {
    if (!body.trim()) return;
    try {
      const created = await create.mutateAsync({
        kind,
        body: body.trim(),
        venture_id: ventureId === "none" ? null : ventureId,
      });
      try {
        localStorage.setItem(LAST_KIND, kind);
        localStorage.setItem(LAST_VENTURE, ventureId);
      } catch {}
      toast.success("Captured.");
      const savedBody = body.trim();
      onOpenChange(false);
      setTriageFor({ id: (created as any).id, body: savedBody });
    } catch (e: any) {
      toast.error(e.message ?? "Couldn't save");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg" data-lenis-prevent>
        <DialogHeader>
          <DialogTitle>Quick capture</DialogTitle>
          <DialogDescription>What's on your mind? ⌘/Ctrl + Enter to save.</DialogDescription>
        </DialogHeader>
        <textarea
          autoFocus
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              submit();
            }
          }}
          rows={6}
          placeholder="What's on your mind?"
          className="w-full bg-secondary/40 border border-border/40 rounded-md p-3 text-sm outline-none focus:border-accent resize-none"
        />
        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-muted-foreground">as</span>
            <Select value={kind} onValueChange={(v) => setKind(v as CaptureKind)}>
              <SelectTrigger className="h-8 w-[110px] text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {KINDS.map((k) => <SelectItem key={k.value} value={k.value}>{k.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <span className="text-[11px] text-muted-foreground ml-2">in</span>
            <Select value={ventureId} onValueChange={setVentureId}>
              <SelectTrigger className="h-8 w-[150px] text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">— No venture —</SelectItem>
                {activeVentures.map((v) => (
                  <SelectItem key={v.id} value={v.id}>{v.short_name || v.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button size="sm" onClick={submit} disabled={!body.trim() || create.isPending}>
            {create.isPending ? "Saving…" : "Capture"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NoteCaptureDialog;
