import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useVentures } from "@/hooks/use-ventures";
import {
  createProject, updateProject, invalidateProjects, type Project,
} from "@/hooks/use-projects";

const STATUSES = ["backlog", "planning", "in-progress", "blocked", "done", "archived"] as const;
const PRIORITIES = ["low", "medium", "high", "urgent"] as const;

const schema = z.object({
  venture_id: z.string().uuid("Pick a venture"),
  title: z.string().min(3, "Min 3 chars"),
  description: z.string().optional().or(z.literal("")),
  status: z.enum(STATUSES),
  priority: z.enum(PRIORITIES),
  due_date: z.string().optional().or(z.literal("")),
  tags: z.string().optional().or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: Project;
  defaults?: Partial<{
    venture_id: string;
    title: string;
    description: string;
    status: typeof STATUSES[number];
    priority: typeof PRIORITIES[number];
    source_type: string;
    source_id: string;
  }>;
  /** If true, do not navigate to the new project after create (e.g. kanban quick-add). */
  stayOnCreate?: boolean;
  onCreated?: (project: Project) => void;
}

const ProjectDialog = ({ open, onOpenChange, project, defaults, stayOnCreate, onCreated }: Props) => {
  const isEdit = !!project;
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { activeVentures } = useVentures();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      venture_id: project?.venture_id ?? defaults?.venture_id ?? "",
      title: project?.title ?? defaults?.title ?? "",
      description: project?.description ?? defaults?.description ?? "",
      status: (project?.status as any) ?? defaults?.status ?? "backlog",
      priority: (project?.priority as any) ?? defaults?.priority ?? "medium",
      due_date: project?.due_date ?? "",
      tags: (project?.tags ?? []).join(", "),
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        venture_id: project?.venture_id ?? defaults?.venture_id ?? "",
        title: project?.title ?? defaults?.title ?? "",
        description: project?.description ?? defaults?.description ?? "",
        status: (project?.status as any) ?? defaults?.status ?? "backlog",
        priority: (project?.priority as any) ?? defaults?.priority ?? "medium",
        due_date: project?.due_date ?? "",
        tags: (project?.tags ?? []).join(", "),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, project?.id]);

  const onSubmit = async (v: FormValues) => {
    const tags = v.tags
      ? v.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : [];
    const payload = {
      venture_id: v.venture_id || null,
      title: v.title,
      description: v.description || null,
      status: v.status,
      priority: v.priority,
      due_date: v.due_date || null,
      tags,
      source_type: defaults?.source_type ?? project?.source_type ?? null,
      source_id: defaults?.source_id ?? project?.source_id ?? null,
    };

    if (isEdit && project) {
      const ok = await updateProject(project.id, payload as any);
      if (!ok) return;
      invalidateProjects(qc);
      toast.success("Saved");
      onOpenChange(false);
      return;
    }
    const created = await createProject(payload as any);
    if (!created) return;
    invalidateProjects(qc);
    toast.success("Project created");
    onOpenChange(false);
    onCreated?.(created);
    if (!stayOnCreate) navigate(`/hq/projects/${created.id}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto" data-lenis-prevent>
        <DialogHeader>
          <DialogTitle className="font-display">
            {isEdit ? "Edit project" : "New project"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Venture</Label>
            <Select
              value={form.watch("venture_id")}
              onValueChange={(v) => form.setValue("venture_id", v)}
            >
              <SelectTrigger><SelectValue placeholder="Pick a venture" /></SelectTrigger>
              <SelectContent>
                {activeVentures.map((v) => (
                  <SelectItem key={v.id} value={v.id}>
                    <span className="inline-flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ background: v.accent_color }}
                      />
                      {v.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.venture_id && (
              <p className="text-xs text-destructive mt-1">{form.formState.errors.venture_id.message}</p>
            )}
          </div>

          <div>
            <Label>Title</Label>
            <Input {...form.register("title")} />
            {form.formState.errors.title && (
              <p className="text-xs text-destructive mt-1">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div>
            <Label>Description</Label>
            <Textarea rows={3} {...form.register("description")} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Status</Label>
              <Select
                value={form.watch("status")}
                onValueChange={(v) => form.setValue("status", v as any)}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Priority</Label>
              <Select
                value={form.watch("priority")}
                onValueChange={(v) => form.setValue("priority", v as any)}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Due date</Label>
              <Input type="date" {...form.register("due_date")} />
            </div>
            <div>
              <Label>Tags (comma sep)</Label>
              <Input {...form.register("tags")} placeholder="ops, q2" />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {isEdit ? "Save" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDialog;
