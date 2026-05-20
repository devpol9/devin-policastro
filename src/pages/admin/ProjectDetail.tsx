import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Check, Trash2, GripVertical, Plus, ExternalLink, Pencil } from "lucide-react";
import { format, formatDistanceToNowStrict } from "date-fns";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminShell from "@/components/admin/AdminShell";
import VenturePill from "@/components/admin/VenturePill";
import { useVentures } from "@/hooks/use-ventures";
import {
  useProject, useSubtasks, invalidateProjects,
  updateProject, deleteProject,
  createSubtask, updateSubtask, deleteSubtask,
} from "@/hooks/use-projects";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";

const STATUSES = ["backlog","planning","in-progress","blocked","done","archived"];
const PRIORITIES = ["low","medium","high","urgent"];

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { ventures } = useVentures();
  const { data: project, isLoading } = useProject(id);
  const { data: subtasks = [] } = useSubtasks(id);

  const [titleEditing, setTitleEditing] = useState(false);
  const [titleVal, setTitleVal] = useState("");
  const [descEditing, setDescEditing] = useState(false);
  const [descVal, setDescVal] = useState("");
  const [newSub, setNewSub] = useState("");
  const [delConfirm, setDelConfirm] = useState("");
  const [sourceInquiry, setSourceInquiry] = useState<any>(null);

  useEffect(() => {
    if (project) {
      setTitleVal(project.title);
      setDescVal(project.description ?? "");
    }
  }, [project?.id]);

  useEffect(() => {
    if (project?.source_type === "inquiry" && project.source_id) {
      supabase
        .from("inquiries")
        .select("id, name, service_type")
        .eq("id", project.source_id)
        .maybeSingle()
        .then(({ data }) => setSourceInquiry(data));
    }
  }, [project?.source_id, project?.source_type]);

  if (isLoading || !project) {
    return (
      <AdminGuard>
        <AdminShell>
          <p className="text-sm text-muted-foreground">Loading…</p>
        </AdminShell>
      </AdminGuard>
    );
  }

  const venture = ventures.find((v) => v.id === project.venture_id);

  const save = async (patch: any) => {
    const ok = await updateProject(project.id, patch);
    if (ok) {
      invalidateProjects(qc);
      qc.invalidateQueries({ queryKey: ["project", project.id] });
    }
  };

  const saveTitle = async () => {
    setTitleEditing(false);
    if (titleVal.trim() && titleVal !== project.title) {
      await save({ title: titleVal.trim() });
    }
  };

  const saveDesc = async () => {
    setDescEditing(false);
    if (descVal !== (project.description ?? "")) {
      await save({ description: descVal || null });
    }
  };

  const addSubtask = async () => {
    if (!newSub.trim()) return;
    const order = (subtasks.length + 1) * 100;
    await createSubtask(project.id, newSub.trim(), order);
    setNewSub("");
    qc.invalidateQueries({ queryKey: ["subtasks", project.id] });
    await recomputePercent();
  };

  const toggleSubtask = async (sId: string, completed: boolean) => {
    await updateSubtask(sId, { completed });
    qc.invalidateQueries({ queryKey: ["subtasks", project.id] });
    await recomputePercent(sId, completed);
  };

  const removeSubtask = async (sId: string) => {
    await deleteSubtask(sId);
    qc.invalidateQueries({ queryKey: ["subtasks", project.id] });
    await recomputePercent();
  };

  const renameSubtask = async (sId: string, title: string) => {
    if (!title.trim()) return;
    await updateSubtask(sId, { title: title.trim() });
    qc.invalidateQueries({ queryKey: ["subtasks", project.id] });
  };

  const recomputePercent = async (changedId?: string, changedCompleted?: boolean) => {
    // Recompute based on current cached subtasks (with override)
    const list: any[] = qc.getQueryData(["subtasks", project.id]) ?? subtasks;
    const total = list.length + (changedId === "__new__" ? 1 : 0);
    if (total === 0) return;
    const done = list.reduce((acc, s) => {
      if (changedId && s.id === changedId) return acc + (changedCompleted ? 1 : 0);
      return acc + (s.completed ? 1 : 0);
    }, 0);
    const pct = Math.round((done / list.length) * 100);
    await save({ percent_complete: pct });
  };

  const handleArchive = async () => {
    await save({ status: "archived" });
    toast.success("Archived");
    navigate("/hq/projects");
  };

  const handleDelete = async () => {
    if (delConfirm !== project.title) return;
    const ok = await deleteProject(project.id);
    if (ok) {
      invalidateProjects(qc);
      toast.success("Deleted");
      navigate("/hq/projects");
    }
  };

  return (
    <AdminGuard>
      <AdminShell>
        <Link to="/hq/projects" className="inline-flex items-center gap-1 text-xs font-mono text-muted-foreground mb-4">
          <ArrowLeft size={12} /> all projects
        </Link>

        <div className="flex flex-wrap items-center gap-3 mb-4">
          {venture && <VenturePill venture={venture} />}
          {project.source_type === "inquiry" && sourceInquiry && (
            <Link
              to={`/hq/inquiries/${sourceInquiry.id}`}
              className="inline-flex items-center gap-1 text-[10px] font-display text-accent border border-accent/40 rounded-full px-2 py-0.5"
            >
              Converted from inquiry <ExternalLink size={10} />
            </Link>
          )}
        </div>

        {titleEditing ? (
          <input
            autoFocus
            value={titleVal}
            onChange={(e) => setTitleVal(e.target.value)}
            onBlur={saveTitle}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveTitle();
              if (e.key === "Escape") { setTitleVal(project.title); setTitleEditing(false); }
            }}
            className="w-full font-display font-bold text-2xl sm:text-3xl bg-transparent border-b border-accent/60 outline-none mb-3"
          />
        ) : (
          <button
            onClick={() => setTitleEditing(true)}
            className="group flex items-start gap-2 text-left mb-3"
          >
            <h1 className="font-display font-bold text-2xl sm:text-3xl tracking-tight">
              {project.title}
            </h1>
            <Pencil size={14} className="opacity-30 group-hover:opacity-80 mt-2" />
          </button>
        )}

        <div className="flex flex-wrap items-center gap-2 mb-6">
          <Select value={project.status} onValueChange={(v) => save({ status: v })}>
            <SelectTrigger className="h-8 w-36 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={project.priority} onValueChange={(v) => save({ priority: v })}>
            <SelectTrigger className="h-8 w-28 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              {PRIORITIES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {project.status === "done" && project.completed_at && (
          <div className="glass-card p-3 mb-6 border-accent/30">
            <p className="text-xs font-display text-accent">
              Completed {formatDistanceToNowStrict(new Date(project.completed_at))} ago ✓
            </p>
          </div>
        )}

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Main */}
          <div className="lg:col-span-3 space-y-5">
            <div className="glass-card p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="font-mono text-[10px] text-muted-foreground tracking-[0.18em]">DESCRIPTION</p>
                <button
                  onClick={() => setDescEditing((v) => !v)}
                  className="text-[10px] font-display text-muted-foreground hover:text-foreground"
                >
                  {descEditing ? "Preview" : "Edit"}
                </button>
              </div>
              {descEditing ? (
                <Textarea
                  value={descVal}
                  onChange={(e) => setDescVal(e.target.value)}
                  onBlur={saveDesc}
                  rows={8}
                  placeholder="Markdown supported…"
                />
              ) : descVal ? (
                <div className="prose prose-sm max-w-none text-foreground/90">
                  <ReactMarkdown>{descVal}</ReactMarkdown>
                </div>
              ) : (
                <button
                  onClick={() => setDescEditing(true)}
                  className="text-xs text-muted-foreground italic"
                >
                  Add description…
                </button>
              )}
            </div>

            <div className="glass-card p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="font-mono text-[10px] text-muted-foreground tracking-[0.18em]">
                  SUBTASKS · {subtasks.filter((s) => s.completed).length}/{subtasks.length}
                </p>
              </div>
              <div className="space-y-1">
                {subtasks.map((s) => (
                  <div key={s.id} className="flex items-center gap-2 group">
                    <GripVertical size={12} className="text-muted-foreground/30" />
                    <button
                      onClick={() => toggleSubtask(s.id, !s.completed)}
                      className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                        s.completed
                          ? "bg-accent border-accent text-accent-foreground"
                          : "border-border"
                      }`}
                    >
                      {s.completed && <Check size={10} />}
                    </button>
                    <input
                      defaultValue={s.title}
                      onBlur={(e) => {
                        if (e.target.value !== s.title) renameSubtask(s.id, e.target.value);
                      }}
                      className={`flex-1 bg-transparent text-sm outline-none ${
                        s.completed ? "line-through text-muted-foreground" : ""
                      }`}
                    />
                    <button
                      onClick={() => removeSubtask(s.id)}
                      className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
                <div className="flex items-center gap-2 pt-2">
                  <Plus size={12} className="text-muted-foreground" />
                  <input
                    value={newSub}
                    onChange={(e) => setNewSub(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") addSubtask(); }}
                    placeholder="Add subtask…"
                    className="flex-1 bg-transparent text-sm outline-none border-b border-border/40 focus:border-accent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-5">
            <div className="glass-card p-5 space-y-4">
              <div>
                <p className="font-mono text-[10px] text-muted-foreground tracking-[0.18em] mb-1">DUE DATE</p>
                <Input
                  type="date"
                  value={project.due_date ?? ""}
                  onChange={(e) => save({ due_date: e.target.value || null })}
                />
              </div>
              <div>
                <p className="font-mono text-[10px] text-muted-foreground tracking-[0.18em] mb-1">TAGS</p>
                <Input
                  defaultValue={(project.tags ?? []).join(", ")}
                  onBlur={(e) => {
                    const tags = e.target.value.split(",").map((t) => t.trim()).filter(Boolean);
                    save({ tags });
                  }}
                  placeholder="comma, separated"
                />
              </div>
              <div>
                <p className="font-mono text-[10px] text-muted-foreground tracking-[0.18em] mb-1">
                  PROGRESS · {project.percent_complete}%
                </p>
                <Slider
                  value={[project.percent_complete]}
                  onValueChange={([v]) => save({ percent_complete: v })}
                  disabled={subtasks.length > 0}
                  min={0}
                  max={100}
                  step={5}
                />
                {subtasks.length > 0 && (
                  <p className="text-[10px] text-muted-foreground italic mt-1">Auto from subtasks</p>
                )}
              </div>
              <div className="text-[10px] text-muted-foreground space-y-0.5 pt-1 border-t border-border/40">
                <p>Created {format(new Date(project.created_at), "MMM d, yyyy")}</p>
                <p>Updated {format(new Date(project.updated_at), "MMM d, yyyy")}</p>
                {project.completed_at && (
                  <p>Completed {format(new Date(project.completed_at), "MMM d, yyyy")}</p>
                )}
              </div>
            </div>

            {sourceInquiry && (
              <div className="glass-card p-5">
                <p className="font-mono text-[10px] text-muted-foreground tracking-[0.18em] mb-2">LINKED INQUIRY</p>
                <Link
                  to={`/hq/inquiries/${sourceInquiry.id}`}
                  className="block p-2 rounded border border-border/40 hover:border-accent/60"
                >
                  <p className="font-display font-semibold text-sm">{sourceInquiry.name}</p>
                  <p className="text-xs text-muted-foreground">{sourceInquiry.service_type}</p>
                </Link>
              </div>
            )}

            <div className="glass-card p-5 border-destructive/30">
              <p className="font-mono text-[10px] text-destructive tracking-[0.18em] mb-3">DANGER ZONE</p>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full" onClick={handleArchive}>
                  Archive
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" className="w-full">
                      <Trash2 size={12} className="mr-1" /> Delete permanently
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete this project?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Type <span className="font-mono font-semibold">{project.title}</span> to confirm. All subtasks will be deleted.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <Input
                      value={delConfirm}
                      onChange={(e) => setDelConfirm(e.target.value)}
                      placeholder={project.title}
                    />
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setDelConfirm("")}>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        disabled={delConfirm !== project.title}
                      >
                        Delete forever
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </div>
      </AdminShell>
    </AdminGuard>
  );
};

export default ProjectDetail;
