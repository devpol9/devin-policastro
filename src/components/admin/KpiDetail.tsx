import { useEffect, useMemo, useState } from "react";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Archive, ArchiveRestore, Pencil, Pin, PinOff, Trash2,
  ArrowUp, ArrowDown, Minus, Download, ChevronDown, ChevronRight,
} from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Area, AreaChart,
} from "recharts";
import { format, formatDistanceToNow, subDays } from "date-fns";
import { toast } from "sonner";
import VenturePill from "@/components/admin/VenturePill";
import KpiDialog from "@/components/admin/KpiDialog";
import { useVentures } from "@/hooks/use-ventures";
import {
  useKpi, useKpiSummary, useKpiEntries,
  useArchiveKpi, useDeleteKpi, usePinKpi, usePinnedKpis,
  useLogKpiEntry, useUpdateKpiEntry, useDeleteKpiEntry,
  type KpiEntry,
} from "@/hooks/use-kpis";
import {
  formatKpiValue, computeDelta, computePercentToTarget,
  cadenceHint, RANGE_DAYS, type RangeKey,
} from "@/lib/kpi-utils";

interface Props {
  kpiId: string | null;
  onOpenChange: (open: boolean) => void;
}

const RANGE_KEYS: RangeKey[] = ["30d", "90d", "1y", "all"];

const KpiDetail = ({ kpiId, onOpenChange }: Props) => {
  const open = !!kpiId;
  const { data: kpi } = useKpi(kpiId);
  const { ventures } = useVentures();
  const venture = kpi?.venture_id ? ventures.find((v) => v.id === kpi.venture_id) : undefined;
  const accent = venture?.accent_color ?? "hsl(24 32% 52%)";

  const [rangeKey, setRangeKey] = useState<RangeKey>("90d");
  const rangeDays = RANGE_DAYS[rangeKey];

  const { data: summary } = useKpiSummary(kpiId, rangeDays);
  const { data: entries = [] } = useKpiEntries(kpiId, rangeDays);
  const { data: allEntries = [] } = useKpiEntries(kpiId, 0);

  const archiveMut = useArchiveKpi();
  const deleteMut = useDeleteKpi();
  const pinMut = usePinKpi();
  const logMut = useLogKpiEntry();
  const updateEntryMut = useUpdateKpiEntry();
  const deleteEntryMut = useDeleteKpiEntry();
  const { pinned } = usePinnedKpis();

  const [editOpen, setEditOpen] = useState(false);
  const [delConfirm, setDelConfirm] = useState("");

  // quick log form
  const [entryDate, setEntryDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [entryValue, setEntryValue] = useState("");
  const [entryNote, setEntryNote] = useState("");

  // metadata collapsed
  const [metaOpen, setMetaOpen] = useState(false);

  // pagination for entries table
  const [page, setPage] = useState(0);
  const pageSize = 20;

  // Pre-fill quick log if entry exists for selected date
  useEffect(() => {
    const existing = allEntries.find((e) => e.entry_date === entryDate);
    if (existing) {
      setEntryValue(String(existing.value));
      setEntryNote(existing.note ?? "");
    } else {
      setEntryValue("");
      setEntryNote("");
    }
  }, [entryDate, allEntries]);

  // Reset on open
  useEffect(() => {
    if (open) {
      setEntryDate(format(new Date(), "yyyy-MM-dd"));
      setPage(0);
    }
  }, [open, kpiId]);

  if (!open) return null;

  const isPinned = Number((kpi?.meta as any)?.pinned_sort ?? 0) > 0;

  const handleLog = async () => {
    if (!kpi) return;
    const v = Number(entryValue);
    if (!entryValue.trim() || Number.isNaN(v)) return toast.error("Enter a valid value");
    try {
      await logMut.mutateAsync({
        kpi_id: kpi.id,
        value: v,
        entry_date: entryDate,
        note: entryNote.trim() || null,
      });
      toast.success(allEntries.some((e) => e.entry_date === entryDate) ? "Entry updated" : "Entry logged");
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to log entry");
    }
  };

  const handlePin = async () => {
    if (!kpi) return;
    if (isPinned) {
      await pinMut.mutateAsync({ id: kpi.id, sort_order: null, currentMeta: kpi.meta });
      toast.success("Unpinned");
      return;
    }
    // find next free slot 1-4
    const used = new Set(
      pinned.map((p) => Number((p.meta as any)?.pinned_sort ?? 0)).filter((n) => n > 0)
    );
    let slot: number | null = null;
    for (let i = 1; i <= 4; i++) {
      if (!used.has(i)) { slot = i; break; }
    }
    if (slot === null) {
      const which = window.prompt("4 KPIs are already pinned. Which slot to replace? (1-4)");
      const n = Number(which);
      if (!n || n < 1 || n > 4) return;
      slot = n;
      // also unpin whoever holds this slot
      const occupant = pinned.find((p) => Number((p.meta as any)?.pinned_sort ?? 0) === n);
      if (occupant) {
        await pinMut.mutateAsync({ id: occupant.id, sort_order: null, currentMeta: occupant.meta });
      }
    }
    await pinMut.mutateAsync({ id: kpi.id, sort_order: slot, currentMeta: kpi.meta });
    toast.success(`Pinned to slot ${slot}`);
  };

  const handleArchive = async () => {
    if (!kpi) return;
    await archiveMut.mutateAsync({ id: kpi.id, archived: !kpi.archived });
    toast.success(kpi.archived ? "Unarchived" : "Archived");
  };

  const handleDelete = async () => {
    if (!kpi || delConfirm !== kpi.name) return;
    try {
      await deleteMut.mutateAsync(kpi.id);
      toast.success("KPI deleted");
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err?.message ?? "Delete failed");
    }
  };

  const exportCsv = () => {
    if (!kpi) return;
    const header = ["entry_date", "value", "note", "logged_at"];
    const rows = allEntries.map((e) => [
      e.entry_date,
      String(e.value),
      (e.note ?? "").replace(/"/g, '""'),
      e.created_at,
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map((c) => `"${c ?? ""}"`).join(","))
      .join("\n");
    const safeName = kpi.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const stamp = format(new Date(), "yyyy-MM-dd");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kpi-${safeName}-${stamp}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const delta = computeDelta(summary?.current_value, summary?.prior_value, kpi?.direction ?? "up");
  const pctToTarget = computePercentToTarget(summary?.current_value, kpi?.target_value, kpi?.direction ?? "up");
  const chartData = useMemo(
    () => entries.map((e) => ({ date: e.entry_date, value: Number(e.value), note: e.note })),
    [entries],
  );

  const sortedAll = useMemo(
    () => [...allEntries].sort((a, b) => (a.entry_date < b.entry_date ? 1 : -1)),
    [allEntries],
  );
  const totalPages = Math.max(1, Math.ceil(sortedAll.length / pageSize));
  const pageEntries = sortedAll.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <>
      <Sheet open={open} onOpenChange={(v) => !v && onOpenChange(false)}>
        <SheetContent side="right" className="w-full sm:max-w-[600px] p-0 flex flex-col" data-lenis-prevent>
          <SheetHeader className="px-5 py-4 border-b border-border/40 flex-row items-center justify-between gap-2 space-y-0">
            <div className="min-w-0">
              <SheetTitle className="font-display font-bold text-base truncate">
                {kpi?.name ?? "Loading…"}
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground truncate">
                {kpi?.description ?? "KPI details and entries"}
              </SheetDescription>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Button variant="ghost" size="sm" onClick={handlePin} title={isPinned ? "Unpin" : "Pin"}>
                {isPinned ? <PinOff size={14} /> : <Pin size={14} />}
              </Button>
              <Button variant="ghost" size="sm" onClick={handleArchive} title={kpi?.archived ? "Unarchive" : "Archive"}>
                {kpi?.archived ? <ArchiveRestore size={14} /> : <Archive size={14} />}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setEditOpen(true)} title="Edit">
                <Pencil size={14} />
              </Button>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
            {kpi && (
              <>
                {/* 1. Header */}
                <div className="space-y-2">
                  {venture && <VenturePill venture={venture} />}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      {kpi.direction === "up" ? <ArrowUp size={11} /> : <ArrowDown size={11} />}
                      {kpi.direction === "up" ? "Higher is better" : "Lower is better"}
                    </span>
                    {kpi.target_value !== null && (
                      <>
                        <span>·</span>
                        <span>Target {formatKpiValue(kpi, kpi.target_value)}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* 2. Current state */}
                <div className="glass-card p-5">
                  <p className="text-[11px] text-muted-foreground/70 font-medium mb-2">CURRENT</p>
                  <p className="font-display font-black text-4xl tracking-tight" style={{ color: accent }}>
                    {formatKpiValue(kpi, summary?.current_value)}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    {delta.hasPrior ? (
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-mono ${
                          delta.isNeutral
                            ? "text-muted-foreground"
                            : delta.isPositive
                            ? "text-[hsl(140_55%_38%)]"
                            : "text-destructive"
                        }`}
                      >
                        {delta.isNeutral ? <Minus size={11} /> : delta.pct >= 0 ? <ArrowUp size={11} /> : <ArrowDown size={11} />}
                        {delta.label}
                      </span>
                    ) : (
                      <span className="text-xs font-mono text-muted-foreground">{delta.label}</span>
                    )}
                    <span className="text-[11px] font-mono text-muted-foreground">vs prior {rangeKey}</span>
                  </div>
                  {kpi.target_value !== null && pctToTarget !== null && (
                    <div className="mt-3">
                      <div className="flex justify-between text-[10px] font-mono text-muted-foreground mb-1">
                        <span>Progress to target</span>
                        <span>{Math.round(pctToTarget)}%</span>
                      </div>
                      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${pctToTarget}%`, background: accent }} />
                      </div>
                    </div>
                  )}
                  <p className="text-[11px] font-mono text-muted-foreground mt-3">
                    {summary?.latest_entry_date
                      ? `Last entry ${format(new Date(summary.latest_entry_date + "T00:00:00"), "MMM d, yyyy")} (${formatDistanceToNow(new Date(summary.latest_entry_date + "T00:00:00"), { addSuffix: true })})`
                      : "No entries yet"}
                  </p>
                </div>

                {/* 3. Quick log */}
                <div className="glass-card p-5 space-y-3">
                  <p className="text-[11px] text-muted-foreground/70 font-medium">QUICK LOG</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Date</Label>
                      <Input type="date" value={entryDate} onChange={(e) => setEntryDate(e.target.value)} />
                    </div>
                    <div>
                      <Label className="text-xs">Value</Label>
                      <Input
                        type="number"
                        step="any"
                        value={entryValue}
                        onChange={(e) => setEntryValue(e.target.value)}
                        placeholder={kpi.unit === "currency" ? "$ amount" : kpi.unit === "percent" ? "% number" : "value"}
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">Note (optional)</Label>
                    <Textarea
                      value={entryNote}
                      onChange={(e) => setEntryNote(e.target.value)}
                      rows={2}
                      placeholder="What changed?"
                    />
                  </div>
                  <Button onClick={handleLog} disabled={logMut.isPending} className="w-full">
                    {allEntries.some((e) => e.entry_date === entryDate) ? "Update entry" : "Log entry"}
                  </Button>
                </div>

                {/* 4. Trend chart */}
                <div className="glass-card p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[11px] text-muted-foreground/70 font-medium">TREND</p>
                    <div className="flex gap-1">
                      {RANGE_KEYS.map((r) => (
                        <button
                          key={r}
                          onClick={() => setRangeKey(r)}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                            rangeKey === r
                              ? "bg-accent/15 text-accent border border-accent/30"
                              : "bg-secondary text-muted-foreground border border-transparent"
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                  {chartData.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic text-center py-8">
                      Log your first entry to start seeing trends.
                    </p>
                  ) : (
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                          <defs>
                            <linearGradient id={`trend-${kpi.id}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor={accent} stopOpacity={0.3} />
                              <stop offset="100%" stopColor={accent} stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} vertical={false} />
                          <XAxis
                            dataKey="date"
                            tick={{ fontSize: 10 }}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(d) => format(new Date(d + "T00:00:00"), "MMM d")}
                            minTickGap={40}
                          />
                          <YAxis
                            tick={{ fontSize: 10 }}
                            tickLine={false}
                            axisLine={false}
                            width={50}
                            tickFormatter={(v) => {
                              if (kpi.unit === "percent") return `${v}%`;
                              if (kpi.unit === "currency") {
                                if (v >= 1000) return `${(v / 1000).toFixed(0)}k`;
                                return String(v);
                              }
                              if (v >= 1000) return `${(v / 1000).toFixed(0)}k`;
                              return String(v);
                            }}
                          />
                          <Tooltip
                            contentStyle={{
                              background: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              fontSize: "11px",
                              borderRadius: 6,
                            }}
                            labelFormatter={(d) => format(new Date(d + "T00:00:00"), "MMM d, yyyy")}
                            formatter={(value: any, _name, item: any) => {
                              const note = item?.payload?.note;
                              return [
                                <span key="val">
                                  {formatKpiValue(kpi, Number(value))}
                                  {note ? <span className="block text-muted-foreground italic mt-0.5">{note}</span> : null}
                                </span>,
                                "",
                              ];
                            }}
                          />
                          {kpi.target_value !== null && (
                            <ReferenceLine
                              y={Number(kpi.target_value)}
                              stroke={accent}
                              strokeDasharray="4 4"
                              strokeOpacity={0.6}
                              label={{ value: "target", position: "right", fontSize: 9, fill: accent }}
                            />
                          )}
                          <Area
                            type="monotone"
                            dataKey="value"
                            stroke={accent}
                            strokeWidth={2}
                            fill={`url(#trend-${kpi.id})`}
                            isAnimationActive={false}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>

                {/* 5. Entries table */}
                <div className="glass-card p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[11px] text-muted-foreground/70 font-medium">
                      ENTRIES · {sortedAll.length}
                    </p>
                    <Button variant="outline" size="sm" onClick={exportCsv} disabled={sortedAll.length === 0}>
                      <Download size={11} className="mr-1" /> CSV
                    </Button>
                  </div>
                  {sortedAll.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic">No entries yet.</p>
                  ) : (
                    <>
                      <div className="border border-border/40 rounded-md overflow-hidden">
                        <table className="w-full text-xs">
                          <thead className="bg-secondary/40">
                            <tr>
                              <th className="text-left font-mono font-normal text-[10px] text-muted-foreground tracking-[0.14em] px-2 py-1.5">Date</th>
                              <th className="text-right font-mono font-normal text-[10px] text-muted-foreground tracking-[0.14em] px-2 py-1.5">Value</th>
                              <th className="text-left font-mono font-normal text-[10px] text-muted-foreground tracking-[0.14em] px-2 py-1.5">Note</th>
                              <th className="px-2 py-1.5 w-8"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {pageEntries.map((e) => (
                              <EntryRow
                                key={e.id}
                                entry={e}
                                kpi={kpi}
                                onUpdate={async (patch) => {
                                  try {
                                    await updateEntryMut.mutateAsync({ id: e.id, kpi_id: kpi.id, patch });
                                  } catch (err: any) {
                                    toast.error(err?.message ?? "Update failed");
                                  }
                                }}
                                onDelete={async () => {
                                  if (!window.confirm("Delete this entry?")) return;
                                  try {
                                    await deleteEntryMut.mutateAsync({ id: e.id, kpi_id: kpi.id });
                                    toast.success("Entry deleted");
                                  } catch (err: any) {
                                    toast.error(err?.message ?? "Delete failed");
                                  }
                                }}
                              />
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-2 text-[11px] font-mono text-muted-foreground">
                          <button
                            onClick={() => setPage((p) => Math.max(0, p - 1))}
                            disabled={page === 0}
                            className="px-2 py-1 disabled:opacity-30"
                          >
                            ← Prev
                          </button>
                          <span>Page {page + 1} of {totalPages}</span>
                          <button
                            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                            disabled={page >= totalPages - 1}
                            className="px-2 py-1 disabled:opacity-30"
                          >
                            Next →
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* 6. Metadata */}
                <div className="glass-card p-5">
                  <button
                    onClick={() => setMetaOpen((v) => !v)}
                    className="w-full flex items-center justify-between text-left"
                  >
                    <p className="text-[11px] text-muted-foreground/70 font-medium">METADATA</p>
                    {metaOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                  </button>
                  {metaOpen && (
                    <div className="mt-3 space-y-1 text-[11px] font-mono text-muted-foreground">
                      <p>Created {format(new Date(kpi.created_at), "MMM d, yyyy")}</p>
                      <p>Updated {format(new Date(kpi.updated_at), "MMM d, yyyy")}</p>
                      <p>Unit: {kpi.unit}{kpi.unit === "currency" ? ` (${kpi.currency_code})` : kpi.unit === "custom" ? ` (${kpi.custom_unit_label})` : ""}</p>
                      <p>Cadence: {cadenceHint(kpi.entry_cadence)}</p>
                      <p>Sort order: {kpi.sort_order}</p>
                    </div>
                  )}
                </div>

                {/* Delete (danger) */}
                <div className="glass-card p-5 border-destructive/30">
                  <p className="font-mono text-[10px] text-destructive tracking-[0.18em] mb-2">DANGER ZONE</p>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" className="w-full">
                        <Trash2 size={12} className="mr-1" /> Delete KPI permanently
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete this KPI?</AlertDialogTitle>
                        <AlertDialogDescription>
                          All {allEntries.length} entries will be deleted. Type <span className="font-mono font-semibold">{kpi.name}</span> to confirm.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <Input
                        value={delConfirm}
                        onChange={(e) => setDelConfirm(e.target.value)}
                        placeholder={kpi.name}
                      />
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDelConfirm("")}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} disabled={delConfirm !== kpi.name}>
                          Delete forever
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {kpi && (
        <KpiDialog open={editOpen} onOpenChange={setEditOpen} editing={kpi} />
      )}
    </>
  );
};

// ============================================================
// Inline-editable entry row
// ============================================================
const EntryRow = ({
  entry, kpi, onUpdate, onDelete,
}: {
  entry: KpiEntry;
  kpi: { unit: string; currency_code: string | null; custom_unit_label: string | null; direction: string; target_value: number | null };
  onUpdate: (patch: Partial<KpiEntry>) => Promise<void>;
  onDelete: () => Promise<void>;
}) => {
  const [val, setVal] = useState(String(entry.value));
  const [note, setNote] = useState(entry.note ?? "");
  useEffect(() => { setVal(String(entry.value)); setNote(entry.note ?? ""); }, [entry.id, entry.value, entry.note]);

  return (
    <tr className="border-t border-border/30">
      <td className="px-2 py-1.5 font-mono text-[11px] whitespace-nowrap">
        {format(new Date(entry.entry_date + "T00:00:00"), "MMM d, yyyy")}
      </td>
      <td className="px-2 py-1.5 text-right">
        <input
          type="number"
          step="any"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onBlur={() => {
            const n = Number(val);
            if (!Number.isNaN(n) && n !== Number(entry.value)) onUpdate({ value: n });
          }}
          className="w-24 bg-transparent text-right font-mono text-xs border-0 outline-none focus:bg-secondary/40 rounded px-1"
        />
      </td>
      <td className="px-2 py-1.5">
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onBlur={() => { if (note !== (entry.note ?? "")) onUpdate({ note: note || null }); }}
          placeholder="—"
          className="w-full bg-transparent text-xs border-0 outline-none focus:bg-secondary/40 rounded px-1"
        />
      </td>
      <td className="px-2 py-1.5">
        <button
          onClick={onDelete}
          className="text-muted-foreground/60 hover:text-destructive"
          title="Delete"
        >
          <Trash2 size={11} />
        </button>
      </td>
    </tr>
  );
};

export default KpiDetail;
