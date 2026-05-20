import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Plus, Search, LayoutGrid, List, ChevronDown, ChevronRight } from "lucide-react";
import {
  DndContext, DragEndEvent, DragOverlay, PointerSensor, useSensor, useSensors,
  closestCorners,
} from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminShell from "@/components/admin/AdminShell";
import SectionHeader from "@/components/SectionHeader";
import ProjectCard from "@/components/admin/ProjectCard";
import ProjectDialog from "@/components/admin/ProjectDialog";
import VenturePill from "@/components/admin/VenturePill";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useVentures } from "@/hooks/use-ventures";
import {
  useProjects, invalidateProjects, moveProjectStatus, updateProject,
  type Project,
} from "@/hooks/use-projects";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

type View = "kanban" | "list";
const VIEW_KEY = "devhq.projects.view";

const COLUMNS: { id: Project["status"]; label: string }[] = [
  { id: "backlog", label: "Backlog" },
  { id: "planning", label: "Planning" },
  { id: "in-progress", label: "In Progress" },
  { id: "blocked", label: "Blocked" },
  { id: "done", label: "Done" },
];

const PRIORITY_OPTS = ["low", "medium", "high", "urgent"] as const;
const STATUS_OPTS_LIST = COLUMNS.map((c) => c.id);

const SortableProjectCard = ({ project }: { project: Project }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: project.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="touch-none">
      <ProjectCard project={project} compact />
    </div>
  );
};

const Projects = () => {
  const qc = useQueryClient();
  const [searchParams] = useSearchParams();
  const { activeVentures } = useVentures();

  const [view, setView] = useState<View>(() => {
    try {
      return (localStorage.getItem(VIEW_KEY) as View) || "kanban";
    } catch {
      return "kanban";
    }
  });
  useEffect(() => {
    try { localStorage.setItem(VIEW_KEY, view); } catch {}
  }, [view]);

  // Filters
  const ventureFromUrl = searchParams.get("venture");
  const initialVentureIds = useMemo(() => {
    if (!ventureFromUrl) return new Set<string>();
    const v = activeVentures.find((x) => x.slug === ventureFromUrl);
    return v ? new Set([v.id]) : new Set<string>();
  }, [ventureFromUrl, activeVentures]);

  const [ventureIds, setVentureIds] = useState<Set<string>>(initialVentureIds);
  useEffect(() => { setVentureIds(initialVentureIds); }, [initialVentureIds]);
  const [priorities, setPriorities] = useState<Set<string>>(new Set());
  const [statuses, setStatuses] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 200);
    return () => clearTimeout(t);
  }, [search]);

  const { projects, isLoading } = useProjects({ search: debounced });

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      if (ventureIds.size > 0 && !ventureIds.has(p.venture_id ?? "")) return false;
      if (priorities.size > 0 && !priorities.has(p.priority)) return false;
      if (view === "list" && statuses.size > 0 && !statuses.has(p.status)) return false;
      if (view === "kanban" && p.status === "archived") return false;
      return true;
    });
  }, [projects, ventureIds, priorities, statuses, view]);

  const totalActive = filtered.filter((p) => !["done", "archived"].includes(p.status)).length;
  const weekCount = filtered.filter((p) => {
    const dt = new Date(p.created_at);
    return Date.now() - dt.getTime() < 7 * 86400_000;
  }).length;

  // Dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogDefaults, setDialogDefaults] = useState<any>(undefined);
  const [quickAdd, setQuickAdd] = useState(false);
  const openNew = (status?: Project["status"]) => {
    setDialogDefaults(status ? { status } : undefined);
    setQuickAdd(!!status);
    setDialogOpen(true);
  };

  const [doneCollapsed, setDoneCollapsed] = useState(true);

  // Kanban drag
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeProject = filtered.find((p) => p.id === activeId);

  const byCol = useMemo(() => {
    const map: Record<string, Project[]> = {};
    COLUMNS.forEach((c) => (map[c.id] = []));
    filtered.forEach((p) => {
      if (map[p.status]) map[p.status].push(p);
    });
    return map;
  }, [filtered]);

  const onDragEnd = async (e: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = e;
    if (!over) return;
    const proj = filtered.find((p) => p.id === active.id);
    if (!proj) return;

    // Determine target column
    let targetStatus = proj.status as Project["status"];
    const overData = over.data?.current as any;
    if (overData?.type === "column") {
      targetStatus = overData.status;
    } else {
      const overProj = filtered.find((p) => p.id === over.id);
      if (overProj) targetStatus = overProj.status as Project["status"];
    }

    if (targetStatus === proj.status && active.id === over.id) return;

    const colCount = byCol[targetStatus]?.length ?? 0;
    const newSort = (colCount + 1) * 100;

    // Optimistic update
    const keys = qc.getQueryCache().findAll({ queryKey: ["projects"] });
    keys.forEach((k) => {
      qc.setQueryData(k.queryKey, (old: any) => {
        if (!Array.isArray(old)) return old;
        return old.map((p: Project) =>
          p.id === proj.id ? { ...p, status: targetStatus, sort_order: newSort } : p
        );
      });
    });

    const ok = await moveProjectStatus(proj.id, targetStatus, newSort);
    if (!ok) invalidateProjects(qc);
    else invalidateProjects(qc);
  };

  const Column = ({ col }: { col: typeof COLUMNS[number] }) => {
    const items = byCol[col.id] ?? [];
    const collapsed = col.id === "done" && doneCollapsed;
    return (
      <div
        data-status={col.id}
        ref={(el) => el && (el as any)}
        className="flex-shrink-0 w-72 sm:w-80 flex flex-col"
      >
        <div className="flex items-center justify-between mb-3 px-1">
          <button
            onClick={() => col.id === "done" && setDoneCollapsed((v) => !v)}
            className="flex items-center gap-1.5 font-display font-semibold text-sm"
          >
            {col.id === "done" && (collapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />)}
            {col.label}
            <span className="text-[10px] font-mono text-muted-foreground">{items.length}</span>
          </button>
          <button
            onClick={() => openNew(col.id)}
            className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-secondary/60"
            title="Quick add"
          >
            <Plus size={14} />
          </button>
        </div>
        {!collapsed && (
          <DroppableArea status={col.id}>
            <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
              <div className="flex flex-col gap-2 min-h-[60px]">
                {items.map((p) => (
                  <SortableProjectCard key={p.id} project={p} />
                ))}
                {items.length === 0 && (
                  <div className="text-[11px] text-muted-foreground/60 italic text-center py-4 rounded border border-dashed border-border/40">
                    Drop here
                  </div>
                )}
              </div>
            </SortableContext>
          </DroppableArea>
        )}
      </div>
    );
  };

  return (
    <AdminGuard>
      <AdminShell>
        <div className="flex items-start justify-between gap-3 mb-4">
          <SectionHeader
            as="h1"
            numeral="03"
            eyebrow="Execution"
            title={<>Your <span className="accent-headline">projects.</span></>}
            description={`${totalActive} active · ${weekCount} added this week`}
          />
          <Button onClick={() => openNew()} className="shrink-0">
            <Plus size={14} className="mr-1" /> New Project
          </Button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <div className="inline-flex rounded-md border border-border/60 p-0.5">
            <button
              onClick={() => setView("kanban")}
              className={`px-2.5 py-1 text-xs font-display rounded inline-flex items-center gap-1 ${
                view === "kanban" ? "bg-foreground text-background" : "text-muted-foreground"
              }`}
            >
              <LayoutGrid size={12} /> Kanban
            </button>
            <button
              onClick={() => setView("list")}
              className={`px-2.5 py-1 text-xs font-display rounded inline-flex items-center gap-1 ${
                view === "list" ? "bg-foreground text-background" : "text-muted-foreground"
              }`}
            >
              <List size={12} /> List
            </button>
          </div>

          <div className="flex items-center gap-2 bg-secondary/40 border border-border/40 rounded-md px-3 py-1.5 min-w-[200px] flex-1 max-w-sm">
            <Search size={13} className="text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title or description"
              className="bg-transparent text-xs outline-none flex-1"
            />
          </div>

          <div className="flex flex-wrap gap-1.5 items-center">
            <button
              onClick={() => setVentureIds(new Set())}
              className={`text-[10px] font-display px-2 py-1 rounded border ${
                ventureIds.size === 0
                  ? "bg-foreground text-background border-foreground"
                  : "border-border/60 text-muted-foreground"
              }`}
            >
              All ventures
            </button>
            {activeVentures.map((v) => {
              const on = ventureIds.has(v.id);
              return (
                <button
                  key={v.id}
                  onClick={() =>
                    setVentureIds((prev) => {
                      const next = new Set(prev);
                      if (on) next.delete(v.id);
                      else next.add(v.id);
                      return next;
                    })
                  }
                  className={`transition-opacity ${on ? "opacity-100" : "opacity-60"}`}
                >
                  <VenturePill venture={v} clickable={false} />
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-1.5 items-center">
            {PRIORITY_OPTS.map((p) => {
              const on = priorities.has(p);
              return (
                <button
                  key={p}
                  onClick={() =>
                    setPriorities((prev) => {
                      const next = new Set(prev);
                      if (on) next.delete(p);
                      else next.add(p);
                      return next;
                    })
                  }
                  className={`text-[10px] font-display px-2 py-1 rounded border ${
                    on ? "bg-foreground text-background border-foreground" : "border-border/60 text-muted-foreground"
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>

          {view === "list" && (
            <div className="flex flex-wrap gap-1.5 items-center">
              {STATUS_OPTS_LIST.map((s) => {
                const on = statuses.has(s);
                return (
                  <button
                    key={s}
                    onClick={() =>
                      setStatuses((prev) => {
                        const next = new Set(prev);
                        if (on) next.delete(s); else next.add(s);
                        return next;
                      })
                    }
                    className={`text-[10px] font-display px-2 py-1 rounded border ${
                      on ? "bg-foreground text-background border-foreground" : "border-border/60 text-muted-foreground"
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Body */}
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : filtered.length === 0 ? (
          <div className="panel p-10 text-center">
            <p className="text-sm text-muted-foreground mb-3">
              {ventureIds.size || priorities.size || statuses.size || debounced
                ? "No projects match your filters."
                : "No projects yet."}
            </p>
            {ventureIds.size || priorities.size || statuses.size || debounced ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setVentureIds(new Set());
                  setPriorities(new Set());
                  setStatuses(new Set());
                  setSearch("");
                }}
              >
                Clear filters
              </Button>
            ) : (
              <Button onClick={() => openNew()}>
                <Plus size={14} className="mr-1" /> Create your first project
              </Button>
            )}
          </div>
        ) : view === "kanban" ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={(e) => setActiveId(String(e.active.id))}
            onDragEnd={onDragEnd}
            onDragCancel={() => setActiveId(null)}
          >
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex gap-4 overflow-x-auto pb-4"
            >
              {COLUMNS.map((c) => (
                <Column key={c.id} col={c} />
              ))}
            </motion.div>
            <DragOverlay>
              {activeProject ? <ProjectCard project={activeProject} compact /> : null}
            </DragOverlay>
          </DndContext>
        ) : (
          <ListView projects={filtered} />
        )}

        <ProjectDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          defaults={dialogDefaults}
          stayOnCreate={quickAdd}
        />
      </AdminShell>
    </AdminGuard>
  );
};

// Droppable column wrapper using useDroppable from @dnd-kit
import { useDroppable } from "@dnd-kit/core";
const DroppableArea = ({ status, children }: { status: string; children: React.ReactNode }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `col-${status}`,
    data: { type: "column", status },
  });
  return (
    <div
      ref={setNodeRef}
      className={`rounded-md p-1 transition-colors ${isOver ? "bg-accent/5" : ""}`}
    >
      {children}
    </div>
  );
};

const ListView = ({ projects }: { projects: Project[] }) => {
  const qc = useQueryClient();
  const { activeVentures } = useVentures();
  const updateInline = async (id: string, patch: any) => {
    const ok = await updateProject(id, patch);
    if (ok) invalidateProjects(qc);
  };
  return (
    <div className="panel overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Venture</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Due</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((p) => {
            const v = activeVentures.find((x) => x.id === p.venture_id);
            return (
              <TableRow
                key={p.id}
                className="cursor-pointer"
                onClick={() => (window.location.href = `/hq/projects/${p.id}`)}
              >
                <TableCell className="font-display font-semibold">{p.title}</TableCell>
                <TableCell>{v ? <VenturePill venture={v} clickable={false} /> : "—"}</TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Select
                    value={p.status}
                    onValueChange={(val) => updateInline(p.id, { status: val })}
                  >
                    <SelectTrigger className="h-7 w-32 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {COLUMNS.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>
                      ))}
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Select
                    value={p.priority}
                    onValueChange={(val) => updateInline(p.id, { priority: val })}
                  >
                    <SelectTrigger className="h-7 w-24 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {PRIORITY_OPTS.map((pr) => (
                        <SelectItem key={pr} value={pr}>{pr}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-xs">
                  {p.due_date ? format(new Date(p.due_date), "MMM d") : "—"}
                </TableCell>
                <TableCell className="text-xs">{p.percent_complete}%</TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {format(new Date(p.updated_at), "MMM d")}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default Projects;
