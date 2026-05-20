import { useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Copy, ExternalLink, Plus, Trash2, Upload, X, Image as ImageIcon,
  Film, FileText as FileIcon, Check, ChevronDown,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  PLATFORMS, PLATFORM_LABEL, PLATFORM_ICON,
  CONTENT_TYPES, CONTENT_TYPE_LABEL, TYPES_BY_PLATFORM,
  CONTENT_STATUSES, STATUS_LABEL, STATUS_COLOR,
  PLATFORM_CHAR_LIMIT,
  type Platform, type ContentType, type ContentStatus,
} from "@/lib/content-constants";
import { useVentures } from "@/hooks/use-ventures";
import { useProjects } from "@/hooks/use-projects";
import {
  useContentItem, useContentAttachments, useContentPillars,
  updateContent, deleteContent, deleteAttachment, uploadAttachment,
  getSignedUrl, invalidateContent,
  type ContentAttachment,
} from "@/hooks/use-content";

interface Props {
  itemId: string | null;
  onOpenChange: (open: boolean) => void;
}

const ContentDetail = ({ itemId, onOpenChange }: Props) => {
  const qc = useQueryClient();
  const open = !!itemId;
  const { data: item } = useContentItem(itemId ?? undefined);
  const { data: attachments = [] } = useContentAttachments(itemId ?? undefined);
  const { activeVentures } = useVentures();
  const { pillars } = useContentPillars();

  // local edit state (debounced save)
  const [title, setTitle] = useState("");
  const [hook, setHook] = useState("");
  const [caption, setCaption] = useState("");
  const [notes, setNotes] = useState("");
  const [hashtagsInput, setHashtagsInput] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [externalUrl, setExternalUrl] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [perfDraft, setPerfDraft] = useState<Record<string, string>>({});
  const [newPerfKey, setNewPerfKey] = useState("");

  useEffect(() => {
    if (!item) return;
    setTitle(item.title);
    setHook(item.hook ?? "");
    setCaption(item.caption ?? "");
    setNotes(item.notes ?? "");
    setHashtagsInput((item.hashtags ?? []).join(" "));
    setTagsInput((item.tags ?? []).join(", "));
    setExternalUrl(item.external_url ?? "");
    setScheduledAt(item.scheduled_at ? toLocalInput(item.scheduled_at) : "");
    const stats = (item.performance_stats as Record<string, any>) ?? {};
    const draft: Record<string, string> = {};
    Object.entries(stats).forEach(([k, v]) => { draft[k] = String(v ?? ""); });
    setPerfDraft(draft);
  }, [item]);

  const platformProjects = useProjects(item?.venture_id ? { venture_id: item.venture_id } : undefined);

  const save = async (patch: Parameters<typeof updateContent>[1]) => {
    if (!item) return;
    const ok = await updateContent(item.id, patch);
    if (ok) invalidateContent(qc);
  };

  const onArchive = () => save({ status: "archived" });

  const [deleteConfirm, setDeleteConfirm] = useState("");
  const onDelete = async () => {
    if (!item || deleteConfirm !== item.title) return;
    const ok = await deleteContent(item.id);
    if (ok) {
      toast.success("Deleted");
      invalidateContent(qc);
      onOpenChange(false);
    }
  };

  if (!open) return null;
  if (!item) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-[600px]" data-lenis-prevent>
          <div className="p-6 text-sm text-muted-foreground">Loading…</div>
        </SheetContent>
      </Sheet>
    );
  }

  const venture = activeVentures.find((v) => v.id === item.venture_id);
  const linkedProject = platformProjects.projects.find((p) => p.id === item.project_id);
  const allowedTypes = TYPES_BY_PLATFORM[item.platform as Platform];
  const charLimit = PLATFORM_CHAR_LIMIT[item.platform as Platform];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className="w-full sm:max-w-[600px] p-0 flex flex-col"
        data-lenis-prevent
      >
        {/* Header */}
        <SheetHeader className="px-5 py-4 border-b border-border/40 space-y-2">
          <div className="flex items-center justify-between gap-3">
            <Select value={item.status} onValueChange={(v) => save({ status: v })}>
              <SelectTrigger
                className="h-8 w-40 text-xs font-display font-semibold border-2"
                style={{
                  borderColor: STATUS_COLOR[item.status as ContentStatus],
                  color: STATUS_COLOR[item.status as ContentStatus],
                }}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CONTENT_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>{STATUS_LABEL[s]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <SheetTitle className="sr-only">{item.title}</SheetTitle>
          <SheetDescription className="sr-only">Edit content item</SheetDescription>
        </SheetHeader>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
          {/* 1. Title */}
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => title.trim() && title !== item.title && save({ title: title.trim() })}
            className="text-xl font-display font-bold border-0 px-0 focus-visible:ring-0 shadow-none h-auto py-1"
            placeholder="Untitled"
          />

          {/* 2. Metadata */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-[10px] font-mono text-muted-foreground tracking-[0.12em]">VENTURE</Label>
              <Select value={item.venture_id ?? ""} onValueChange={(v) => save({ venture_id: v })}>
                <SelectTrigger className="h-9">
                  <SelectValue>
                    {venture ? (
                      <span className="inline-flex items-center gap-2 text-sm">
                        <span className="w-2 h-2 rounded-full" style={{ background: venture.accent_color }} />
                        {venture.name}
                      </span>
                    ) : "Unassigned"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {activeVentures.map((v) => (
                    <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-[10px] font-mono text-muted-foreground tracking-[0.12em]">PILLAR</Label>
              <Select value={item.pillar ?? "__none"} onValueChange={(v) => save({ pillar: v === "__none" ? null : v })}>
                <SelectTrigger className="h-9"><SelectValue placeholder="None" /></SelectTrigger>
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
              <Label className="text-[10px] font-mono text-muted-foreground tracking-[0.12em]">PLATFORM</Label>
              <Select value={item.platform} onValueChange={(v) => save({ platform: v })}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
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
              <Label className="text-[10px] font-mono text-muted-foreground tracking-[0.12em]">TYPE</Label>
              <Select value={item.content_type} onValueChange={(v) => save({ content_type: v })}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CONTENT_TYPES.filter((t) => allowedTypes.includes(t) || t === item.content_type).map((t) => (
                    <SelectItem key={t} value={t}>{CONTENT_TYPE_LABEL[t]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Project link */}
          <div>
            <Label className="text-[10px] font-mono text-muted-foreground tracking-[0.12em]">PROJECT</Label>
            <Select
              value={item.project_id ?? "__none"}
              onValueChange={(v) => save({ project_id: v === "__none" ? null : v })}
              disabled={!item.venture_id}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder={item.venture_id ? "Not linked" : "Pick a venture first"}>
                  {linkedProject?.title ?? "Not linked"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none">Not linked</SelectItem>
                {platformProjects.projects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 3. Schedule */}
          <div className="space-y-2">
            <Label className="text-[10px] font-mono text-muted-foreground tracking-[0.12em]">SCHEDULE</Label>
            <div className="flex items-center gap-2">
              <Input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                onBlur={() => {
                  const next = scheduledAt ? new Date(scheduledAt).toISOString() : null;
                  const cur = item.scheduled_at;
                  if (next !== cur) {
                    save({
                      scheduled_at: next,
                      ...(next && item.status === "idea" ? { status: "scheduled" } : {}),
                    });
                  }
                }}
                className="h-9"
              />
              {item.status === "scheduled" && (
                <Button size="sm" variant="default" onClick={() => save({ status: "posted" })}>
                  <Check size={14} className="mr-1" /> Mark posted
                </Button>
              )}
            </div>
            {item.posted_at && (
              <p className="text-[11px] text-muted-foreground">
                Posted {format(new Date(item.posted_at), "PPP p")}
              </p>
            )}
            {item.status === "posted" && (
              <Input
                placeholder="External URL (e.g. https://instagram.com/p/...)"
                value={externalUrl}
                onChange={(e) => setExternalUrl(e.target.value)}
                onBlur={() => externalUrl !== (item.external_url ?? "") && save({ external_url: externalUrl || null })}
                className="h-9"
              />
            )}
          </div>

          {/* 4. Hook */}
          <div>
            <Label className="text-[10px] font-mono text-muted-foreground tracking-[0.12em]">HOOK</Label>
            <Input
              value={hook}
              onChange={(e) => setHook(e.target.value)}
              onBlur={() => hook !== (item.hook ?? "") && save({ hook: hook || null })}
              placeholder="The first 2 seconds. What stops the scroll."
              className="h-9"
            />
          </div>

          {/* 5. Caption */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <Label className="text-[10px] font-mono text-muted-foreground tracking-[0.12em]">CAPTION</Label>
              <span className={`text-[10px] font-mono ${charLimit && caption.length > charLimit ? "text-destructive" : "text-muted-foreground"}`}>
                {caption.length}{charLimit ? ` / ${charLimit}` : ""} chars · {caption.trim().split(/\s+/).filter(Boolean).length} words
              </span>
            </div>
            <Textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              onBlur={() => caption !== (item.caption ?? "") && save({ caption: caption || null })}
              rows={6}
              placeholder="Write the caption…"
            />
          </div>

          {/* 6. Hashtags */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <Label className="text-[10px] font-mono text-muted-foreground tracking-[0.12em]">
                HASHTAGS · {item.hashtags?.length ?? 0}
              </Label>
              <Button
                size="sm" variant="ghost"
                onClick={() => {
                  navigator.clipboard.writeText((item.hashtags ?? []).join(" "));
                  toast.success("Copied");
                }}
              ><Copy size={12} className="mr-1" /> Copy all</Button>
            </div>
            <Input
              value={hashtagsInput}
              onChange={(e) => setHashtagsInput(e.target.value)}
              onBlur={() => {
                const tags = hashtagsInput.split(/\s+/).map((t) => t.trim()).filter(Boolean)
                  .map((t) => t.startsWith("#") ? t : `#${t}`);
                save({ hashtags: tags });
              }}
              placeholder="#fitness #nj #entrepreneur"
              className="h-9 font-mono text-xs"
            />
          </div>

          {/* 7. Attachments */}
          <AttachmentsSection
            contentItemId={item.id}
            userId={item.user_id}
            attachments={attachments}
          />

          {/* 8. Tags */}
          <div>
            <Label className="text-[10px] font-mono text-muted-foreground tracking-[0.12em]">TAGS</Label>
            <Input
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              onBlur={() => {
                const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
                save({ tags });
              }}
              placeholder="comma, separated, tags"
              className="h-9"
            />
          </div>

          {/* 9. Notes */}
          <div>
            <Label className="text-[10px] font-mono text-muted-foreground tracking-[0.12em]">INTERNAL NOTES</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={() => notes !== (item.notes ?? "") && save({ notes: notes || null })}
              rows={3}
              placeholder="Briefs, references, things to remember. Not published."
            />
          </div>

          {/* 10. Performance stats */}
          {item.status === "posted" && (
            <div className="panel p-4">
              <Label className="text-[10px] font-mono text-muted-foreground tracking-[0.12em] mb-2 block">
                PERFORMANCE
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {["views", "likes", "comments", "shares", "saves", "reach", "impressions"].map((k) => (
                  <PerfField
                    key={k} label={k}
                    value={perfDraft[k] ?? ""}
                    onChange={(v) => setPerfDraft({ ...perfDraft, [k]: v })}
                    onBlur={() => savePerf(item.id, item.performance_stats, perfDraft, qc)}
                  />
                ))}
                {Object.keys(perfDraft).filter((k) =>
                  !["views","likes","comments","shares","saves","reach","impressions"].includes(k)
                ).map((k) => (
                  <PerfField
                    key={k} label={k}
                    value={perfDraft[k] ?? ""}
                    onChange={(v) => setPerfDraft({ ...perfDraft, [k]: v })}
                    onBlur={() => savePerf(item.id, item.performance_stats, perfDraft, qc)}
                  />
                ))}
              </div>
              <div className="flex gap-2 mt-3">
                <Input
                  placeholder="Custom metric name"
                  value={newPerfKey}
                  onChange={(e) => setNewPerfKey(e.target.value)}
                  className="h-8 text-xs"
                />
                <Button
                  size="sm" variant="outline"
                  onClick={() => {
                    const k = newPerfKey.trim().toLowerCase().replace(/\s+/g, "_");
                    if (!k) return;
                    setPerfDraft({ ...perfDraft, [k]: "" });
                    setNewPerfKey("");
                  }}
                ><Plus size={12} /> Add</Button>
              </div>
            </div>
          )}

          {/* 11. Audit */}
          <div className="text-[10px] text-muted-foreground space-y-0.5 pt-2 border-t border-border/40">
            <p>Created {format(new Date(item.created_at), "PPP p")}</p>
            <p>Updated {format(new Date(item.updated_at), "PPP p")}</p>
          </div>

          {/* Danger zone */}
          <details className="panel p-4 border-destructive/30">
            <summary className="cursor-pointer text-[10px] font-mono text-destructive tracking-[0.12em] inline-flex items-center gap-1">
              <ChevronDown size={12} /> DANGER ZONE
            </summary>
            <div className="mt-3 space-y-3">
              <Button variant="outline" size="sm" onClick={onArchive} disabled={item.status === "archived"}>
                Archive
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="ml-2">
                    <Trash2 size={12} className="mr-1" /> Delete forever
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this content?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Type the title <span className="font-mono">{item.title}</span> to confirm.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <Input value={deleteConfirm} onChange={(e) => setDeleteConfirm(e.target.value)} />
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setDeleteConfirm("")}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onDelete} disabled={deleteConfirm !== item.title}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </details>
        </div>
      </SheetContent>
    </Sheet>
  );
};

// ----- Sub-components -----

const PerfField = ({ label, value, onChange, onBlur }: {
  label: string; value: string; onChange: (v: string) => void; onBlur: () => void;
}) => (
  <div>
    <Label className="text-[10px] text-muted-foreground capitalize">{label.replace(/_/g, " ")}</Label>
    <Input value={value} onChange={(e) => onChange(e.target.value)} onBlur={onBlur} className="h-8 text-xs" />
  </div>
);

async function savePerf(
  id: string,
  current: any,
  draft: Record<string, string>,
  qc: ReturnType<typeof useQueryClient>
) {
  const next: Record<string, any> = { ...(current ?? {}) };
  for (const [k, v] of Object.entries(draft)) {
    if (v === "") { delete next[k]; continue; }
    const n = Number(v);
    next[k] = Number.isFinite(n) ? n : v;
  }
  const ok = await updateContent(id, { performance_stats: next });
  if (ok) invalidateContent(qc);
}

const AttachmentsSection = ({
  contentItemId, userId, attachments,
}: {
  contentItemId: string;
  userId: string;
  attachments: ContentAttachment[];
}) => {
  const qc = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    let order = attachments.length;
    for (const f of Array.from(files)) {
      await uploadAttachment({ id: contentItemId, user_id: userId }, f, order++);
    }
    setUploading(false);
    qc.invalidateQueries({ queryKey: ["content_attachments", contentItemId] });
  };

  return (
    <div>
      <Label className="text-[10px] font-mono text-muted-foreground tracking-[0.12em]">ATTACHMENTS</Label>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault(); setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={`mt-1 border-2 border-dashed rounded-md p-4 text-center cursor-pointer transition-colors ${
          dragOver ? "border-accent bg-accent/5" : "border-border/60 hover:border-accent/60"
        }`}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
        <Upload size={16} className="inline-block mr-2 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">
          {uploading ? "Uploading…" : "Drop files or click to upload"}
        </span>
      </div>
      {attachments.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mt-3">
          {attachments.map((a) => (
            <AttachmentTile key={a.id} attachment={a} />
          ))}
        </div>
      )}
    </div>
  );
};

const AttachmentTile = ({ attachment }: { attachment: ContentAttachment }) => {
  const qc = useQueryClient();
  const [url, setUrl] = useState<string | null>(null);
  const isImage = attachment.mime_type?.startsWith("image/");
  const isVideo = attachment.mime_type?.startsWith("video/");

  useEffect(() => {
    if (isImage || isVideo) {
      getSignedUrl(attachment.storage_path).then(setUrl);
    }
  }, [attachment.storage_path, isImage, isVideo]);

  const onDelete = async () => {
    const ok = await deleteAttachment(attachment);
    if (ok) qc.invalidateQueries({ queryKey: ["content_attachments", attachment.content_item_id] });
  };

  return (
    <div className="relative group aspect-square rounded-md border border-border/60 overflow-hidden bg-secondary/30">
      {isImage && url ? (
        <img src={url} alt={attachment.file_name} className="w-full h-full object-cover" />
      ) : isVideo && url ? (
        <video src={url} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-1 p-2">
          {isVideo ? <Film size={20} /> : isImage ? <ImageIcon size={20} /> : <FileIcon size={20} />}
          <span className="text-[9px] text-muted-foreground text-center truncate w-full">
            {attachment.file_name}
          </span>
        </div>
      )}
      <button
        onClick={onDelete}
        className="absolute top-1 right-1 p-1 rounded-full bg-background/90 opacity-0 group-hover:opacity-100 transition-opacity"
        title="Delete"
      >
        <X size={10} />
      </button>
    </div>
  );
};

function toLocalInput(iso: string): string {
  const d = new Date(iso);
  const tz = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tz).toISOString().slice(0, 16);
}

export default ContentDetail;
