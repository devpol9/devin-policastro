import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MarkdownEditor from "@/components/admin/MarkdownEditor";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useVentures } from "@/hooks/use-ventures";
import {
  useCreateCapture, useUpdateCapture, type Capture, type CaptureKind,
} from "@/hooks/use-captures";
import { toast } from "sonner";

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
  capture?: Capture | null;
  onCreated?: (c: Capture) => void;
}

const NoteDialog = ({ open, onOpenChange, capture, onCreated }: Props) => {
  const isEdit = !!capture;
  const { activeVentures } = useVentures();
  const create = useCreateCapture();
  const update = useUpdateCapture();

  const [kind, setKind] = useState<CaptureKind>("note");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [ventureId, setVentureId] = useState<string>("none");
  const [tagsStr, setTagsStr] = useState("");
  const [pinned, setPinned] = useState(false);
  const [url, setUrl] = useState("");
  const [source, setSource] = useState("");

  useEffect(() => {
    if (!open) return;
    setKind((capture?.kind as CaptureKind) ?? "note");
    setTitle(capture?.title ?? "");
    setBody(capture?.body ?? "");
    setVentureId(capture?.venture_id ?? "none");
    setTagsStr((capture?.tags ?? []).join(", "));
    setPinned(capture?.pinned ?? false);
    const meta = (capture?.meta ?? {}) as any;
    setUrl(meta.url ?? "");
    setSource(meta.source ?? "");
  }, [open, capture]);

  const submit = async () => {
    if (!body.trim()) { toast.error("Body is required"); return; }
    if (kind === "idea" && !title.trim()) { toast.error("Ideas need a title"); return; }
    if (kind === "link" && url && !/^https?:\/\//i.test(url)) { toast.error("URL must start with http(s)://"); return; }

    const tags = tagsStr.split(",").map((t) => t.trim()).filter(Boolean);
    const meta: Record<string, any> = {};
    if (kind === "link") meta.url = url;
    if (kind === "quote") meta.source = source;

    const payload = {
      kind,
      title: title.trim() || null,
      body: body.trim(),
      venture_id: ventureId === "none" ? null : ventureId,
      tags,
      pinned,
      meta,
    };

    try {
      if (isEdit && capture) {
        await update.mutateAsync({ id: capture.id, patch: payload });
        toast.success("Saved");
      } else {
        const created = await create.mutateAsync(payload);
        toast.success("Captured");
        onCreated?.(created);
      }
      onOpenChange(false);
    } catch (e: any) {
      toast.error(e.message ?? "Couldn't save");
    }
  };

  const saving = create.isPending || update.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-lenis-prevent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit capture" : "New capture"}</DialogTitle>
          <DialogDescription>Capture once. Refine later.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div>
            <Label className="text-xs">Kind</Label>
            <Select value={kind} onValueChange={(v) => setKind(v as CaptureKind)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {KINDS.map((k) => <SelectItem key={k.value} value={k.value}>{k.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">
              Title {kind === "idea" && <span className="text-destructive">*</span>}
              <span className="text-muted-foreground ml-1">{kind !== "idea" && "(optional)"}</span>
            </Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={100} placeholder="Give it a name" />
          </div>
          <div>
            <Label className="text-xs">Body</Label>
            <MarkdownEditor value={body} onChange={setBody} minHeight={260} placeholder="Markdown supported — # heading, **bold**, - list, [link](url)" />
          </div>
          {kind === "link" && (
            <div>
              <Label className="text-xs">URL</Label>
              <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" />
            </div>
          )}
          {kind === "quote" && (
            <div>
              <Label className="text-xs">Source</Label>
              <Input value={source} onChange={(e) => setSource(e.target.value)} placeholder="Author, book, podcast…" />
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Venture</Label>
              <Select value={ventureId} onValueChange={setVentureId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">— None —</SelectItem>
                  {activeVentures.map((v) => (
                    <SelectItem key={v.id} value={v.id}>{v.short_name || v.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Tags (comma-separated)</Label>
              <Input value={tagsStr} onChange={(e) => setTagsStr(e.target.value)} placeholder="e.g. growth, draft" />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={pinned} onCheckedChange={(v) => setPinned(!!v)} />
            <span>Pin to top</span>
          </label>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>Cancel</Button>
          <Button onClick={submit} disabled={saving}>{saving ? "Saving…" : isEdit ? "Save" : "Capture"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NoteDialog;
