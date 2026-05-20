import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Archive, ArchiveRestore, Pencil, Pin, PinOff, Sparkles, Trash2, ExternalLink } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import VenturePill from "@/components/admin/VenturePill";
import NoteDialog from "@/components/admin/NoteDialog";
import ProjectDialog from "@/components/admin/ProjectDialog";
import {
  useCapture, useUpdateCapture, useDeleteCapture, type Capture,
} from "@/hooks/use-captures";
import { useVentures } from "@/hooks/use-ventures";
import { toast } from "sonner";

interface Props {
  captureId: string | null;
  onOpenChange: (open: boolean) => void;
}

const KIND_LABEL: Record<string, string> = {
  note: "Note", idea: "Idea", quote: "Quote", link: "Link", reference: "Reference",
};

const NoteDetail = ({ captureId, onOpenChange }: Props) => {
  const open = !!captureId;
  const navigate = useNavigate();
  const { data: capture } = useCapture(captureId);
  const { ventures } = useVentures();
  const update = useUpdateCapture();
  const del = useDeleteCapture();
  const [editOpen, setEditOpen] = useState(false);
  const [promoteOpen, setPromoteOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");

  if (!capture) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-[600px]" data-lenis-prevent>
          <SheetHeader>
            <SheetTitle>Loading…</SheetTitle>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    );
  }

  const venture = capture.venture_id ? ventures.find((v) => v.id === capture.venture_id) : undefined;
  const meta = (capture.meta ?? {}) as any;
  const promoted = !!capture.promoted_project_id;

  const togglePin = () => update.mutate({ id: capture.id, patch: { pinned: !capture.pinned } });
  const toggleArchive = () => {
    update.mutate({ id: capture.id, patch: { archived: !capture.archived } });
    toast.success(capture.archived ? "Restored" : "Archived");
  };

  const onProjectCreated = async (project: any) => {
    await update.mutateAsync({
      id: capture.id,
      patch: { promoted_project_id: project.id, promoted_at: new Date().toISOString() },
    });
    toast.success("Promoted to project", {
      action: { label: "Open project", onClick: () => navigate(`/hq/projects/${project.id}`) },
    });
  };

  const title = capture.title || capture.body.split("\n")[0].slice(0, 80);

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-[600px] overflow-y-auto" data-lenis-prevent>
          <SheetHeader className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-display font-semibold tracking-[0.12em] uppercase px-2 py-1 rounded border border-border/60 text-muted-foreground">
                {KIND_LABEL[capture.kind] ?? capture.kind}
              </span>
              <div className="flex items-center gap-1">
                <Button size="sm" variant="ghost" onClick={togglePin} title={capture.pinned ? "Unpin" : "Pin"}>
                  {capture.pinned ? <Pin size={14} className="text-accent" /> : <PinOff size={14} />}
                </Button>
                {capture.kind === "idea" && !promoted && (
                  <Button size="sm" variant="outline" onClick={() => setPromoteOpen(true)}>
                    <Sparkles size={12} className="mr-1" /> Promote
                  </Button>
                )}
                <Button size="sm" variant="ghost" onClick={toggleArchive}>
                  {capture.archived ? <ArchiveRestore size={14} /> : <Archive size={14} />}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setEditOpen(true)}>
                  <Pencil size={14} />
                </Button>
              </div>
            </div>
            <SheetTitle className="font-display text-2xl text-left">{title}</SheetTitle>
            <SheetDescription className="sr-only">Capture details</SheetDescription>
            {venture && <div className="flex"><VenturePill venture={venture} /></div>}
          </SheetHeader>

          <div className="mt-6 space-y-5">
            {promoted && (
              <div className="panel p-3 flex items-center justify-between">
                <div className="text-xs">
                  <p className="font-display font-semibold">Linked project</p>
                  <p className="text-muted-foreground">Promoted {capture.promoted_at && formatDistanceToNow(new Date(capture.promoted_at), { addSuffix: true })}</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => navigate(`/hq/projects/${capture.promoted_project_id}`)}>
                  Open <ExternalLink size={11} className="ml-1" />
                </Button>
              </div>
            )}

            {capture.kind === "link" && meta.url && (
              <a href={meta.url} target="_blank" rel="noreferrer"
                className="panel p-3 flex items-center gap-2 text-xs hover:border-accent/40 transition-colors">
                <ExternalLink size={12} className="text-muted-foreground" />
                <span className="font-mono truncate flex-1">{meta.url}</span>
              </a>
            )}
            {capture.kind === "quote" && meta.source && (
              <p className="text-xs text-muted-foreground italic">— {meta.source}</p>
            )}

            <div className="prose prose-sm max-w-none prose-headings:font-display prose-p:text-foreground/90">
              <ReactMarkdown>{capture.body}</ReactMarkdown>
            </div>

            {capture.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {capture.tags.map((t) => (
                  <span key={t} className="text-[10px] px-2 py-0.5 rounded-md border border-border/60 text-muted-foreground">#{t}</span>
                ))}
              </div>
            )}

            <div className="pt-4 border-t border-border/40 text-[11px] font-mono text-muted-foreground space-y-0.5">
              <p>Created {format(new Date(capture.created_at), "MMM d, yyyy 'at' p")}</p>
              <p>Updated {formatDistanceToNow(new Date(capture.updated_at), { addSuffix: true })}</p>
            </div>

            <div className="pt-4 border-t border-destructive/20">
              <p className="text-xs font-display font-semibold text-destructive mb-2">Danger zone</p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="sm" variant="outline" className="text-destructive border-destructive/40">
                    <Trash2 size={12} className="mr-1" /> Delete permanently
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete capture?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Type <span className="font-mono font-semibold">{title.slice(0, 30)}</span> to confirm.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <Input value={confirmTitle} onChange={(e) => setConfirmTitle(e.target.value)} placeholder="Type title to confirm" />
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setConfirmTitle("")}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      disabled={confirmTitle !== title.slice(0, 30)}
                      onClick={async () => {
                        await del.mutateAsync(capture.id);
                        toast.success("Deleted");
                        setConfirmTitle("");
                        onOpenChange(false);
                      }}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <NoteDialog open={editOpen} onOpenChange={setEditOpen} capture={capture} />

      <ProjectDialog
        open={promoteOpen}
        onOpenChange={setPromoteOpen}
        stayOnCreate
        defaults={{
          title: capture.title || capture.body.split("\n")[0].slice(0, 80),
          description: capture.body,
          venture_id: capture.venture_id ?? undefined,
          status: "planning",
          priority: "medium",
          source_type: "idea",
          source_id: capture.id,
        }}
        onCreated={onProjectCreated}
      />
    </>
  );
};

export default NoteDetail;
