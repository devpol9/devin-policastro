import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useVentures } from "@/hooks/use-ventures";
import { useProjects } from "@/hooks/use-projects";
import {
  useContentPillars, createContent, invalidateContent,
  type ContentItem,
} from "@/hooks/use-content";
import {
  PLATFORMS, PLATFORM_LABEL, PLATFORM_ICON,
  TYPES_BY_PLATFORM, CONTENT_TYPE_LABEL,
  type Platform, type ContentType,
} from "@/lib/content-constants";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaults?: Partial<Pick<ContentItem, "venture_id" | "project_id" | "scheduled_at" | "platform" | "pillar">>;
  onCreated?: (item: ContentItem) => void;
}

const LAST_USED_VENTURE = "devhq.content.lastVenture";

const ContentDialog = ({ open, onOpenChange, defaults, onCreated }: Props) => {
  const qc = useQueryClient();
  const { activeVentures } = useVentures();
  const { pillars } = useContentPillars();

  const [ventureId, setVentureId] = useState<string>(defaults?.venture_id ?? "");
  const [title, setTitle] = useState("");
  const [platform, setPlatform] = useState<Platform>((defaults?.platform as Platform) ?? "instagram");
  const [contentType, setContentType] = useState<ContentType>("reel");
  const [pillar, setPillar] = useState<string>(defaults?.pillar ?? "");
  const [projectId, setProjectId] = useState<string>(defaults?.project_id ?? "");
  const [scheduledAt, setScheduledAt] = useState<string>(
    defaults?.scheduled_at ? toLocalInput(defaults.scheduled_at) : ""
  );
  const [saving, setSaving] = useState(false);

  const { projects } = useProjects(ventureId ? { venture_id: ventureId } : undefined);

  const allowedTypes = useMemo(() => TYPES_BY_PLATFORM[platform], [platform]);
  useEffect(() => {
    if (!allowedTypes.includes(contentType)) setContentType(allowedTypes[0]);
  }, [platform, allowedTypes, contentType]);

  useEffect(() => {
    if (!open) return;
    // hydrate defaults on open
    setVentureId(defaults?.venture_id ?? localStorage.getItem(LAST_USED_VENTURE) ?? "");
    setTitle("");
    setPlatform((defaults?.platform as Platform) ?? "instagram");
    setPillar(defaults?.pillar ?? "");
    setProjectId(defaults?.project_id ?? "");
    setScheduledAt(defaults?.scheduled_at ? toLocalInput(defaults.scheduled_at) : "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const submit = async () => {
    if (!ventureId) { toast.error("Pick a venture"); return; }
    if (title.trim().length < 3) { toast.error("Title needs at least 3 chars"); return; }
    setSaving(true);
    const item = await createContent({
      venture_id: ventureId,
      title: title.trim(),
      platform,
      content_type: contentType,
      pillar: pillar || null,
      project_id: projectId || null,
      scheduled_at: scheduledAt ? new Date(scheduledAt).toISOString() : null,
      status: scheduledAt ? "scheduled" : "idea",
    });
    setSaving(false);
    if (!item) return;
    try { localStorage.setItem(LAST_USED_VENTURE, ventureId); } catch {}
    toast.success("Content created");
    invalidateContent(qc);
    onOpenChange(false);
    onCreated?.(item);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg" data-lenis-prevent>
        <DialogHeader>
          <DialogTitle>New content</DialogTitle>
          <DialogDescription>Get the idea on the calendar. You can fill in caption + assets later.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 py-2">
          <div>
            <Label className="text-xs">Venture *</Label>
            <Select value={ventureId} onValueChange={setVentureId}>
              <SelectTrigger><SelectValue placeholder="Pick a venture" /></SelectTrigger>
              <SelectContent>
                {activeVentures.map((v) => (
                  <SelectItem key={v.id} value={v.id}>
                    <span className="inline-flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ background: v.accent_color }} />
                      {v.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs">Title *</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Behind the scenes at Impact Zone" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Platform *</Label>
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
              <Label className="text-xs">Type *</Label>
              <Select value={contentType} onValueChange={(v) => setContentType(v as ContentType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {allowedTypes.map((t) => (
                    <SelectItem key={t} value={t}>{CONTENT_TYPE_LABEL[t]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Pillar</Label>
              <Select value={pillar || "__none"} onValueChange={(v) => setPillar(v === "__none" ? "" : v)}>
                <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none">None</SelectItem>
                  {pillars.map((p) => (
                    <SelectItem key={p.id} value={p.name}>
                      <span className="inline-flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                        {p.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Project</Label>
              <Select
                value={projectId || "__none"}
                onValueChange={(v) => setProjectId(v === "__none" ? "" : v)}
                disabled={!ventureId}
              >
                <SelectTrigger><SelectValue placeholder={ventureId ? "None" : "Pick venture first"} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none">None</SelectItem>
                  {projects.filter((p) => p.status !== "archived" && p.status !== "done").map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="text-xs">Schedule</Label>
            <Input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>Cancel</Button>
          <Button onClick={submit} disabled={saving}>{saving ? "Creating…" : "Create"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

function toLocalInput(iso: string): string {
  const d = new Date(iso);
  const tz = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tz).toISOString().slice(0, 16);
}

export default ContentDialog;
