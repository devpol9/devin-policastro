import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Plus, Search, Calendar as CalendarIcon, KanbanSquare, List as ListIcon,
  ChevronLeft, ChevronRight, Filter,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import TabBar from "@/components/admin/TabBar";
import {
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays,
  isSameMonth, isSameDay, addMonths,
} from "date-fns";
import {
  DndContext, DragEndEvent, PointerSensor, useSensor, useSensors, closestCorners,
} from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminShell from "@/components/admin/AdminShell";
import SectionHeader from "@/components/SectionHeader";
import ContentDialog from "@/components/admin/ContentDialog";
import QuickCaptureDialog from "@/components/admin/QuickCaptureDialog";
import ContentDetail from "@/components/admin/ContentDetail";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { useVentures } from "@/hooks/use-ventures";
import {
  useContentItems, useContentPillars, moveContentStatus, invalidateContent,
  type ContentItem,
} from "@/hooks/use-content";
import {
  PLATFORMS, PLATFORM_LABEL, PLATFORM_ICON, CONTENT_STATUSES, STATUS_LABEL,
  STATUS_COLOR, type Platform, type ContentStatus,
} from "@/lib/content-constants";

type View = "calendar" | "pipeline" | "list";
const VIEW_KEY = "devhq.content.view";

const PIPELINE_COLUMNS: ContentStatus[] = ["idea","drafting","ready","scheduled","posted","archived"];

const Content = () => {
  const qc = useQueryClient();
  const { activeVentures } = useVentures();
  const { pillars } = useContentPillars();

  const [view, setView] = useState<View>(() => {
    try { return (localStorage.getItem(VIEW_KEY) as View) || "calendar"; } catch { return "calendar"; }
  });
  useEffect(() => { try { localStorage.setItem(VIEW_KEY, view); } catch {} }, [view]);

  const [ventureFilter, setVentureFilter] = useState<Set<string>>(new Set());
  const [platformFilter, setPlatformFilter] = useState<Set<string>>(new Set());
  const [pillarFilter, setPillarFilter] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 200);
    return () => clearTimeout(t);
  }, [search]);

  const filters = useMemo(() => ({
    venture_ids: ventureFilter.size ? Array.from(ventureFilter) : undefined,
    platforms: platformFilter.size ? Array.from(platformFilter) : undefined,
    pillars: pillarFilter.size ? Array.from(pillarFilter) : undefined,
    search: debounced || undefined,
  }), [ventureFilter, platformFilter, pillarFilter, debounced]);

  const { items, isLoading } = useContentItems(filters);

  // dialogs / drawer
  const [newOpen, setNewOpen] = useState(false);
  const [quickOpen, setQuickOpen] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [newDefaults, setNewDefaults] = useState<any>(undefined);

  const openNew = (defaults?: any) => { setNewDefaults(defaults); setNewOpen(true); };

  const toggle = <T extends string>(set: Set<T>, setter: (s: Set<T>) => void, val: T) => {
    const next = new Set(set);
    next.has(val) ? next.delete(val) : next.add(val);
    setter(next);
  };

  return (
    <AdminGuard>
      <AdminShell>
        <div className="flex items-start justify-between gap-3 mb-6">
          <SectionHeader
            as="h1" numeral="04" eyebrow="Creative"
            title={<>Your <span className="accent-headline">content.</span></>}
            description="Plan, draft, schedule, and ship content across every venture."
          />
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="ghost" size="sm" asChild>
              <a href="/hq/settings/pillars">Pillars</a>
            </Button>
            <Button variant="outline" size="sm" onClick={() => setQuickOpen(true)}>
              <Plus size={14} className="mr-1" /> Quick capture
            </Button>
            <Button size="sm" onClick={() => openNew()}>
              <Plus size={14} className="mr-1" /> New content
            </Button>
          </div>
        </div>

        {/* View toggle */}
        <TabBar<View>
          className="mb-4"
          value={view}
          onChange={setView}
          items={[
            { value: "calendar" as View, label: <span className="inline-flex items-center gap-1.5"><CalendarIcon size={12} /> Calendar</span> },
            { value: "pipeline" as View, label: <span className="inline-flex items-center gap-1.5"><KanbanSquare size={12} /> Pipeline</span> },
            { value: "list" as View, label: <span className="inline-flex items-center gap-1.5"><ListIcon size={12} /> List</span> },
          ]}
        />

        {/* Filter toolbar */}
        <div className="flex flex-wrap items-center gap-2 mb-5">
          <div className="flex items-center gap-2 bg-secondary/40 border border-border/40 rounded-md px-2 py-1.5 flex-1 min-w-[180px]">
            <Search size={12} className="text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title, caption, hook…"
              className="bg-transparent text-xs outline-none flex-1"
            />
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter size={12} /> Filters
                {(ventureFilter.size + platformFilter.size + pillarFilter.size) > 0 && (
                  <span className="text-[10px] tabular-nums rounded-md bg-accent text-accent-foreground px-1.5 py-0.5">
                    {ventureFilter.size + platformFilter.size + pillarFilter.size}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-72 p-3 space-y-3">
              <div>
                <p className="text-[11px] text-muted-foreground lowercase mb-1.5">Ventures</p>
                <div className="flex flex-wrap gap-1">
                  {activeVentures.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => toggle(ventureFilter, setVentureFilter, v.id)}
                      className="text-[10px] px-2 py-1 rounded-md border"
                      style={{
                        borderColor: ventureFilter.has(v.id) ? v.accent_color : "hsl(var(--border))",
                        background: ventureFilter.has(v.id) ? `${v.accent_color}22` : "transparent",
                        color: ventureFilter.has(v.id) ? v.accent_color : "hsl(var(--muted-foreground))",
                      }}
                    >{v.short_name ?? v.name}</button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground lowercase mb-1.5">Platforms</p>
                <div className="flex flex-wrap gap-1">
                  {PLATFORMS.map((p) => {
                    const Icon = PLATFORM_ICON[p];
                    const on = platformFilter.has(p);
                    return (
                      <button
                        key={p}
                        onClick={() => toggle(platformFilter, setPlatformFilter, p)}
                        className={`text-[10px] px-1.5 py-1 rounded-md border ${on ? "border-accent text-accent bg-accent/10" : "border-border/40 text-muted-foreground"}`}
                        title={PLATFORM_LABEL[p]}
                      ><Icon size={11} /></button>
                    );
                  })}
                </div>
              </div>
              {pillars.length > 0 && (
                <div>
                  <p className="text-[11px] text-muted-foreground lowercase mb-1.5">Pillars</p>
                  <div className="flex flex-wrap gap-1">
                    {pillars.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => toggle(pillarFilter, setPillarFilter, p.name)}
                        className="text-[10px] px-2 py-1 rounded-md border"
                        style={{
                          borderColor: pillarFilter.has(p.name) ? p.color : "hsl(var(--border))",
                          background: pillarFilter.has(p.name) ? `${p.color}22` : "transparent",
                          color: pillarFilter.has(p.name) ? p.color : "hsl(var(--muted-foreground))",
                        }}
                      >{p.name}</button>
                    ))}
                  </div>
                </div>
              )}
              {(ventureFilter.size + platformFilter.size + pillarFilter.size) > 0 && (
                <button
                  onClick={() => { setVentureFilter(new Set()); setPlatformFilter(new Set()); setPillarFilter(new Set()); }}
                  className="text-[11px] text-muted-foreground hover:text-foreground w-full text-left pt-1 border-t border-border/60"
                >Clear all</button>
              )}
            </PopoverContent>
          </Popover>
        </div>


        {isLoading ? (
          <div className="text-center py-20 text-muted-foreground text-sm">Loading…</div>
        ) : items.length === 0 ? (
          <div className="panel p-12 text-center">
            <p className="text-sm text-muted-foreground mb-4">No content yet — start planning your first piece.</p>
            <Button onClick={() => openNew()}><Plus size={14} className="mr-1" /> New content</Button>
          </div>
        ) : view === "calendar" ? (
          <CalendarView items={items} onOpen={setDetailId} onCreateOn={(d) => openNew({ scheduled_at: d.toISOString() })} />
        ) : view === "pipeline" ? (
          <PipelineView items={items} onOpen={setDetailId} onMove={async (id, status) => {
            await moveContentStatus(id, status);
            invalidateContent(qc);
          }} />
        ) : (
          <ListView items={items} onOpen={setDetailId} />
        )}

        <ContentDialog
          open={newOpen} onOpenChange={setNewOpen}
          defaults={newDefaults}
          onCreated={(item) => setDetailId(item.id)}
        />
        <QuickCaptureDialog open={quickOpen} onOpenChange={setQuickOpen} />
        <ContentDetail itemId={detailId} onOpenChange={(o) => !o && setDetailId(null)} />
      </AdminShell>
    </AdminGuard>
  );
};

// ===== Calendar view =====
const CalendarView = ({ items, onOpen, onCreateOn }: {
  items: ContentItem[]; onOpen: (id: string) => void; onCreateOn: (d: Date) => void;
}) => {
  const { activeVentures } = useVentures();
  const [cursor, setCursor] = useState(new Date());
  const monthStart = startOfMonth(cursor);
  const monthEnd = endOfMonth(cursor);
  const start = startOfWeek(monthStart);
  const end = endOfWeek(monthEnd);
  const days: Date[] = [];
  for (let d = start; d <= end; d = addDays(d, 1)) days.push(d);

  const byDay = useMemo(() => {
    const m = new Map<string, ContentItem[]>();
    items.forEach((i) => {
      if (!i.scheduled_at) return;
      const k = format(new Date(i.scheduled_at), "yyyy-MM-dd");
      if (!m.has(k)) m.set(k, []);
      m.get(k)!.push(i);
    });
    return m;
  }, [items]);

  const unscheduled = items.filter((i) => !i.scheduled_at && !["posted","archived"].includes(i.status));

  return (
    <div className="grid lg:grid-cols-[1fr_240px] gap-4">
      <div className="panel p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-lg">{format(cursor, "MMMM yyyy")}</h3>
          <div className="flex items-center gap-1">
            <Button size="sm" variant="outline" onClick={() => setCursor(addMonths(cursor, -1))}><ChevronLeft size={14} /></Button>
            <Button size="sm" variant="outline" onClick={() => setCursor(new Date())}>Today</Button>
            <Button size="sm" variant="outline" onClick={() => setCursor(addMonths(cursor, 1))}><ChevronRight size={14} /></Button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-px text-[10px] font-mono text-muted-foreground mb-1">
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => <div key={d} className="px-2 py-1">{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-px bg-border/30 rounded overflow-hidden">
          {days.map((d) => {
            const inMonth = isSameMonth(d, cursor);
            const isToday = isSameDay(d, new Date());
            const dayItems = byDay.get(format(d, "yyyy-MM-dd")) ?? [];
            return (
              <button
                key={d.toISOString()}
                onClick={() => onCreateOn(d)}
                className={`min-h-[88px] p-1.5 text-left flex flex-col gap-1 transition-colors ${
                  inMonth ? "bg-background hover:bg-secondary/40" : "bg-secondary/20 text-muted-foreground/40"
                }`}
              >
                <span className={`text-[10px] font-mono ${isToday ? "text-accent font-bold" : ""}`}>
                  {format(d, "d")}
                </span>
                <div className="flex flex-col gap-0.5">
                  {dayItems.slice(0, 3).map((it) => {
                    const v = activeVentures.find((x) => x.id === it.venture_id);
                    const Icon = PLATFORM_ICON[it.platform as Platform];
                    return (
                      <span
                        key={it.id}
                        onClick={(e) => { e.stopPropagation(); onOpen(it.id); }}
                        className="text-[9px] px-1 py-0.5 rounded truncate inline-flex items-center gap-1 cursor-pointer"
                        style={{
                          background: `${v?.accent_color ?? "hsl(30 8% 50%)"}22`,
                          color: v?.accent_color ?? "hsl(var(--foreground))",
                        }}
                      ><Icon size={9} /><span className="truncate">{it.title}</span></span>
                    );
                  })}
                  {dayItems.length > 3 && (
                    <span className="text-[9px] text-muted-foreground">+{dayItems.length - 3} more</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
      <div className="panel p-4">
        <p className="text-[11px] text-muted-foreground lowercase mb-2">Unscheduled · {unscheduled.length}</p>
        <div className="space-y-2 max-h-[60vh] overflow-y-auto">
          {unscheduled.length === 0 && <p className="text-xs text-muted-foreground italic">All scheduled.</p>}
          {unscheduled.map((it) => {
            const v = activeVentures.find((x) => x.id === it.venture_id);
            const Icon = PLATFORM_ICON[it.platform as Platform];
            return (
              <button
                key={it.id} onClick={() => onOpen(it.id)}
                className="w-full text-left p-2 rounded-md border border-border/40 hover:border-accent/40 transition-colors"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="h-2 w-2 rounded-full shrink-0" style={{ background: v?.accent_color ?? "hsl(30 8% 50%)" }} />
                  <Icon size={10} className="text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground lowercase">{it.status}</span>
                </div>
                <p className="text-xs font-display font-semibold truncate">{it.title}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ===== Pipeline view =====
const SortableCard = ({ item, onOpen }: { item: ContentItem; onOpen: (id: string) => void }) => {
  const { activeVentures } = useVentures();
  const v = activeVentures.find((x) => x.id === item.venture_id);
  const Icon = PLATFORM_ICON[item.platform as Platform];
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="touch-none">
      <button
        type="button"
        onClick={() => onOpen(item.id)}
        className="w-full text-left panel p-2.5"
        style={{ borderLeft: `3px solid ${v?.accent_color ?? "hsl(30 8% 50%)"}` }}
      >
        <div className="flex items-center gap-1.5 mb-1 text-[10px] text-muted-foreground">
          <Icon size={10} />
          <span>{v?.short_name ?? v?.name ?? "—"}</span>
          {item.scheduled_at && <span className="ml-auto">{format(new Date(item.scheduled_at), "MMM d")}</span>}
        </div>
        <p className="text-xs font-display font-semibold leading-snug line-clamp-2">{item.title}</p>
      </button>
    </div>
  );
};

const PipelineView = ({ items, onOpen, onMove }: {
  items: ContentItem[]; onOpen: (id: string) => void;
  onMove: (id: string, status: string) => Promise<void>;
}) => {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
  const [archiveOpen, setArchiveOpen] = useState(false);

  const cols = useMemo(() => {
    const map: Record<string, ContentItem[]> = {};
    PIPELINE_COLUMNS.forEach((s) => { map[s] = []; });
    items.forEach((i) => { (map[i.status] ?? map.idea).push(i); });
    return map;
  }, [items]);

  const onDragEnd = async (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over) return;
    const overCol = PIPELINE_COLUMNS.find((c) => c === over.id || cols[c].some((it) => it.id === over.id));
    const fromCol = PIPELINE_COLUMNS.find((c) => cols[c].some((it) => it.id === active.id));
    if (!overCol || !fromCol || overCol === fromCol) return;
    await onMove(active.id as string, overCol);
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={onDragEnd}>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {PIPELINE_COLUMNS.map((status) => {
          const list = cols[status];
          const collapsed = status === "archived" && !archiveOpen;
          return (
            <div key={status} id={status} className="bg-secondary/30 rounded-md p-2 min-h-[120px]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-medium lowercase inline-flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: STATUS_COLOR[status] }} />
                  {STATUS_LABEL[status]}
                  <span className="text-muted-foreground/70 tabular-nums">{list.length}</span>
                </span>
                {status === "archived" && (
                  <button onClick={() => setArchiveOpen(!archiveOpen)} className="text-[10px] text-muted-foreground">
                    {archiveOpen ? "Hide" : "Show"}
                  </button>
                )}
              </div>
              {!collapsed && (
                <SortableContext items={list.map((i) => i.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-2">
                    {list.map((it) => <SortableCard key={it.id} item={it} onOpen={onOpen} />)}
                  </div>
                </SortableContext>
              )}
            </div>
          );
        })}
      </div>
    </DndContext>
  );
};

// ===== List view =====
const ListView = ({ items, onOpen }: {
  items: ContentItem[]; onOpen: (id: string) => void;
}) => {
  const { activeVentures } = useVentures();
  return (
    <div className="panel overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Venture</TableHead>
            <TableHead>Platform</TableHead>
            <TableHead>Pillar</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Scheduled</TableHead>
            <TableHead>Posted</TableHead>
            <TableHead className="text-right">Reach</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((it) => {
            const v = activeVentures.find((x) => x.id === it.venture_id);
            const Icon = PLATFORM_ICON[it.platform as Platform];
            const stats = (it.performance_stats as Record<string, any>) ?? {};
            const reach = Number(stats.reach ?? stats.views ?? stats.impressions ?? 0);
            return (
              <TableRow key={it.id} onClick={() => onOpen(it.id)} className="cursor-pointer">
                <TableCell className="font-display font-semibold">{it.title}</TableCell>
                <TableCell className="text-xs">
                  {v && <span className="inline-flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ background: v.accent_color }} />{v.short_name ?? v.name}
                  </span>}
                </TableCell>
                <TableCell><Icon size={12} className="text-muted-foreground" /></TableCell>
                <TableCell className="text-xs text-muted-foreground">{it.pillar ?? "—"}</TableCell>
                <TableCell>
                  <span className="text-[10px] font-display font-semibold px-2 py-0.5 rounded border"
                    style={{ borderColor: STATUS_COLOR[it.status as ContentStatus], color: STATUS_COLOR[it.status as ContentStatus] }}
                  >{STATUS_LABEL[it.status as ContentStatus]}</span>
                </TableCell>
                <TableCell className="text-xs font-mono">{it.scheduled_at ? format(new Date(it.scheduled_at), "MMM d") : "—"}</TableCell>
                <TableCell className="text-xs font-mono">{it.posted_at ? format(new Date(it.posted_at), "MMM d") : "—"}</TableCell>
                <TableCell className="text-xs font-mono text-right tabular-nums">{reach > 0 ? reach.toLocaleString() : "—"}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default Content;
