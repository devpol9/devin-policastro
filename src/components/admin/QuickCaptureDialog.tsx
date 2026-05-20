import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useVentures } from "@/hooks/use-ventures";
import { createContent, invalidateContent } from "@/hooks/use-content";
import {
  PLATFORMS, PLATFORM_LABEL, PLATFORM_ICON, TYPES_BY_PLATFORM,
  type Platform,
} from "@/lib/content-constants";
import { toast } from "sonner";

const LAST_USED_VENTURE = "devhq.content.lastVenture";
const LAST_USED_PLATFORM = "devhq.content.lastPlatform";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const QuickCaptureDialog = ({ open, onOpenChange }: Props) => {
  const qc = useQueryClient();
  const { activeVentures } = useVentures();
  const [ventureId, setVentureId] = useState("");
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setVentureId(localStorage.getItem(LAST_USED_VENTURE) ?? activeVentures[0]?.id ?? "");
    setPlatform((localStorage.getItem(LAST_USED_PLATFORM) as Platform) || "instagram");
    setTitle(""); setNotes("");
  }, [open, activeVentures]);

  const submit = async () => {
    if (!ventureId) { toast.error("Pick a venture"); return; }
    if (!title.trim()) { toast.error("Give it a title"); return; }
    setSaving(true);
    const item = await createContent({
      venture_id: ventureId,
      title: title.trim(),
      platform,
      content_type: TYPES_BY_PLATFORM[platform][0],
      notes: notes.trim() || null,
      status: "idea",
    });
    setSaving(false);
    if (!item) return;
    try {
      localStorage.setItem(LAST_USED_VENTURE, ventureId);
      localStorage.setItem(LAST_USED_PLATFORM, platform);
    } catch {}
    toast.success("Captured.");
    invalidateContent(qc);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" data-lenis-prevent>
        <DialogHeader>
          <DialogTitle>Quick capture</DialogTitle>
          <DialogDescription>Get it down. Polish later.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 py-2">
          <Input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="One-line title"
            onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit(); }}
          />
          <div className="grid grid-cols-2 gap-3">
            <Select value={ventureId} onValueChange={setVentureId}>
              <SelectTrigger><SelectValue placeholder="Venture" /></SelectTrigger>
              <SelectContent>
                {activeVentures.map((v) => (
                  <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={platform} onValueChange={(v) => setPlatform(v as Platform)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {PLATFORMS.map((p) => {
                  const Icon = PLATFORM_ICON[p];
                  return (
                    <SelectItem key={p} value={p}>
                      <span className="inline-flex items-center gap-2"><Icon size={12} />{PLATFORM_LABEL[p]}</span>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">What's the idea?</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Notes, angle, references… anything to remember."
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>Cancel</Button>
          <Button onClick={submit} disabled={saving}>{saving ? "Saving…" : "Capture"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QuickCaptureDialog;
