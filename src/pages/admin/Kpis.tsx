import { useMemo, useState, useEffect } from "react";
import { Plus, LayoutGrid, Table as TableIcon, Sparkles, ArrowUp, ArrowDown, Minus } from "lucide-react";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminShell from "@/components/admin/AdminShell";
import SectionHeader from "@/components/SectionHeader";
import VenturePill from "@/components/admin/VenturePill";
import KpiCard from "@/components/admin/KpiCard";
import KpiDialog from "@/components/admin/KpiDialog";
import KpiDetail from "@/components/admin/KpiDetail";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { useVentures } from "@/hooks/use-ventures";
import {
  useKpis, useKpiSummary, useCreateKpisBatch, type Kpi,
} from "@/hooks/use-kpis";
import {
  formatKpiValue, formatKpiValueShort, computeDelta, computePercentToTarget,
  buildSuggestions, RANGE_DAYS, type RangeKey, type SuggestionEntry,
} from "@/lib/kpi-utils";
import { format, formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

const RANGE_KEYS: RangeKey[] = ["30d", "90d", "1y", "all"];
const VIEW_KEY = "devhq.kpis.view";
const RANGE_PERSIST_KEY = "devhq.kpis.range";

const Kpis = () => {
  const { activeVentures } = useVentures();
  const [showArchived, setShowArchived] = useState(false);
  const [selectedVentures, setSelectedVentures] = useState<Set<string>>(new Set());
  const [view, setView] = useState<"grid" | "table">(
    (typeof localStorage !== "undefined" && (localStorage.getItem(VIEW_KEY) as "grid" | "table")) || "grid"
  );
  const [rangeKey, setRangeKey] = useState<RangeKey>(
    (typeof localStorage !== "undefined" && (localStorage.getItem(RANGE_PERSIST_KEY) as RangeKey)) || "90d"
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogDefaults, setDialogDefaults] = useState<{ venture_id?: string | null }>({});
  const [detailId, setDetailId] = useState<string | null>(null);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [selectedSuggestions, setSelectedSuggestions] = useState<Set<number>>(new Set());

  const ventureIds = selectedVentures.size > 0 ? Array.from(selectedVentures) : undefined;
  const { kpis, isLoading } = useKpis({
    venture_ids: ventureIds,
    archived: showArchived ? undefined : false,
  });

  useEffect(() => { try { localStorage.setItem(VIEW_KEY, view); } catch {} }, [view]);
  useEffect(() => { try { localStorage.setItem(RANGE_PERSIST_KEY, rangeKey); } catch {} }, [rangeKey]);

  const pinned = useMemo(() => {
    return kpis
      .map((k) => ({ k, pin: Number((k.meta as any)?.pinned_sort ?? 0) }))
      .filter((x) => x.pin > 0 && x.pin <= 4)
      .sort((a, b) => a.pin - b.pin)
      .map((x) => x.k);
  }, [kpis]);

  const headlineSlots: (Kpi | null)[] = useMemo(() => {
    const out: (Kpi | null)[] = [null, null, null, null];
    for (const k of pinned) {
      const slot = Number((k.meta as any)?.pinned_sort ?? 0);
      if (slot >= 1 && slot <= 4) out[slot - 1] = k;
    }
    return out;
  }, [pinned]);

  const toggleVenture = (id: string) => {
    setSelectedVentures((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const suggestions = useMemo(() => buildSuggestions(activeVentures), [activeVentures]);
  const createBatch = useCreateKpisBatch();

  const submitSuggestions = async () => {
    if (selectedSuggestions.size === 0) return;
    const picks = Array.from(selectedSuggestions).map((i) => suggestions[i]).filter(Boolean);
    const rows = picks.map((s: SuggestionEntry) => ({
      name: s.name,
      venture_id: s.venture_id,
      unit: s.unit,
      direction: s.direction,
      entry_cadence: s.entry_cadence,
      currency_code: s.unit === "currency" ? (s.currency_code ?? "USD") : null,
      custom_unit_label: s.unit === "custom" ? (s.custom_unit_label ?? null) : null,
      target_value: s.target_value ?? null,
      description: s.description ?? null,
    }));
    try {
      const created = await createBatch.mutateAsync(rows);
      toast.success(`Created ${created.length} KPI${created.length === 1 ? "" : "s"}`);
      setSuggestionsOpen(false);
      setSelectedSuggestions(new Set());
    } catch (err: any) {
      toast.error(err?.message ?? "Failed");
    }
  };

  const hasAnyKpis = kpis.length > 0 || pinned.length > 0;

  return (
    <AdminGuard>
      <AdminShell>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
          <SectionHeader
            numeral="06"
            eyebrow="Signal"
            title={<>What's growing, what's <span className="accent-headline">kpis.</span></>}
            description="What's growing, what's not."
          />
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              disabled={refreshing}
              onClick={async () => {
                setRefreshing(true);
                try {
                  const { data, error } = await supabase.functions.invoke("refresh-site-kpis");
                  if (error) throw error;
                  toast.success(`Refreshed ${data?.updated ?? 0} KPIs`);
                  await qc.invalidateQueries({ queryKey: ["kpi_entries"] });
                  await qc.invalidateQueries({ queryKey: ["kpi_summary"] });
                } catch (e: any) {
                  toast.error(e?.message || "Refresh failed");
                } finally {
                  setRefreshing(false);
                }
              }}
            >
              <RefreshCw size={14} className={`mr-1 ${refreshing ? "animate-spin" : ""}`} />
              {refreshing ? "Refreshing…" : "Refresh now"}
            </Button>
            <Button onClick={() => { setDialogDefaults({}); setDialogOpen(true); }}>
              <Plus size={14} className="mr-1" /> New KPI
            </Button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setSelectedVentures(new Set())}
              className={`px-2.5 py-1 rounded-md border text-[11px] font-display ${
                selectedVentures.size === 0
                  ? "bg-foreground text-background border-foreground"
                  : "border-border text-muted-foreground"
              }`}
            >
              All
            </button>
            {activeVentures.map((v) => {
              const on = selectedVentures.has(v.id);
              return (
                <button
                  key={v.id}
                  onClick={() => toggleVenture(v.id)}
                  className={`inline-flex items-center gap-1.5 rounded-md border whitespace-nowrap px-2.5 py-1 text-[11px] font-display transition-colors ${
                    on ? "" : "opacity-60 hover:opacity-100"
                  }`}
                  style={{
                    background: on ? `color-mix(in oklch, ${v.accent_color} 18%, transparent)` : "transparent",
                    borderColor: `color-mix(in oklch, ${v.accent_color} 45%, transparent)`,
                    color: v.accent_color,
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: v.accent_color }} />
                  {v.short_name || v.name}
                </button>
              );
            })}
            <label className="flex items-center gap-1.5 ml-2 text-[11px] font-mono text-muted-foreground cursor-pointer">
              <Checkbox checked={showArchived} onCheckedChange={(v) => setShowArchived(!!v)} />
              Show archived
            </label>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex gap-0.5 bg-secondary/40 border border-border/40 rounded-md p-0.5">
              {RANGE_KEYS.map((r) => (
                <button
                  key={r}
                  onClick={() => setRangeKey(r)}
                  className={`px-2 py-1 rounded text-[10px] font-mono ${
                    rangeKey === r ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            <div className="flex gap-0.5 bg-secondary/40 border border-border/40 rounded-md p-0.5">
              <button
                onClick={() => setView("grid")}
                className={`px-2 py-1 rounded ${view === "grid" ? "bg-foreground text-background" : "text-muted-foreground"}`}
                title="Grid view"
              >
                <LayoutGrid size={12} />
              </button>
              <button
                onClick={() => setView("table")}
                className={`px-2 py-1 rounded ${view === "table" ? "bg-foreground text-background" : "text-muted-foreground"}`}
                title="Table view"
              >
                <TableIcon size={12} />
              </button>
            </div>
          </div>
        </div>

        {/* Headline tiles */}
        {hasAnyKpis && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            {headlineSlots.map((k, i) =>
              k ? (
                <KpiCard key={k.id} kpi={k} rangeKey={rangeKey} hero onClick={() => setDetailId(k.id)} />
              ) : (
                <button
                  key={`empty-${i}`}
                  onClick={() => toast.info("Pin a KPI from its detail view (Pin icon) to add it here.")}
                  className="panel p-5 flex flex-col items-center justify-center text-center min-h-[180px] border-dashed border-2 border-border text-muted-foreground hover:text-foreground hover:border-accent/40 transition-colors"
                >
                  <Plus size={20} className="mb-1" />
                  <span className="text-xs font-display">Pin a KPI</span>
                  <span className="text-[10px] text-muted-foreground/70 mt-0.5">Slot {i + 1}</span>
                </button>
              )
            )}
          </div>
        )}

        {/* Empty state */}
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : !hasAnyKpis ? (
          <div className="space-y-6">
            <div className="panel p-10 text-center">
              <h3 className="font-display font-bold text-xl mb-2">No KPIs yet</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto mb-5">
                Track what matters. MRR, members, churn, signups — anything you want to know is moving.
              </p>
              <Button onClick={() => { setDialogDefaults({}); setDialogOpen(true); }}>
                <Plus size={14} className="mr-1" /> Create your first KPI
              </Button>
            </div>

            {suggestions.length > 0 && (
              <div className="panel p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-[11px] text-muted-foreground/70 font-medium">SUGGESTIONS</p>
                    <h3 className="font-display font-bold text-lg mt-1 flex items-center gap-2">
                      <Sparkles size={14} className="text-accent" /> Based on your ventures
                    </h3>
                  </div>
                  {!suggestionsOpen ? (
                    <Button variant="outline" size="sm" onClick={() => setSuggestionsOpen(true)}>
                      Browse suggested KPIs
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={submitSuggestions}
                      disabled={selectedSuggestions.size === 0 || createBatch.isPending}
                    >
                      {createBatch.isPending ? "Creating…" : `Create ${selectedSuggestions.size}`}
                    </Button>
                  )}
                </div>
                {suggestionsOpen && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {suggestions.map((s, i) => {
                      const on = selectedSuggestions.has(i);
                      return (
                        <button
                          key={`${s.venture_id}-${s.name}`}
                          onClick={() => {
                            setSelectedSuggestions((prev) => {
                              const next = new Set(prev);
                              if (next.has(i)) next.delete(i);
                              else next.add(i);
                              return next;
                            });
                          }}
                          className={`flex items-start gap-3 p-3 rounded-md border text-left transition-colors ${
                            on ? "border-accent bg-accent/5" : "border-border/40 bg-secondary/20"
                          }`}
                        >
                          <Checkbox checked={on} className="mt-0.5 pointer-events-none" />
                          <div className="min-w-0 flex-1">
                            <p className="font-display font-semibold text-sm truncate">{s.name}</p>
                            <p className="text-[11px] text-muted-foreground mt-0.5">
                              {s.venture_name} · {s.unit} · {s.direction === "up" ? "↑ higher" : "↓ lower"} is better · {s.entry_cadence}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : view === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {kpis.map((k) => (
              <KpiCard key={k.id} kpi={k} rangeKey={rangeKey} onClick={() => setDetailId(k.id)} />
            ))}
          </div>
        ) : (
          <div className="panel p-0 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[10px] font-mono tracking-[0.14em]">Name</TableHead>
                  <TableHead className="text-[10px] font-mono tracking-[0.14em]">Venture</TableHead>
                  <TableHead className="text-[10px] font-mono tracking-[0.14em] text-right">Current</TableHead>
                  <TableHead className="text-[10px] font-mono tracking-[0.14em] text-right">Δ</TableHead>
                  <TableHead className="text-[10px] font-mono tracking-[0.14em] text-right">Target</TableHead>
                  <TableHead className="text-[10px] font-mono tracking-[0.14em]">Last entry</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {kpis.map((k) => (
                  <KpiTableRow
                    key={k.id}
                    kpi={k}
                    rangeKey={rangeKey}
                    onClick={() => setDetailId(k.id)}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <KpiDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          defaults={dialogDefaults}
          onCreated={(k) => setDetailId(k.id)}
        />
        <KpiDetail kpiId={detailId} onOpenChange={(v) => !v && setDetailId(null)} />
      </AdminShell>
    </AdminGuard>
  );
};

const KpiTableRow = ({ kpi, rangeKey, onClick }: { kpi: Kpi; rangeKey: RangeKey; onClick: () => void }) => {
  const rangeDays = RANGE_DAYS[rangeKey];
  const { data: summary } = useKpiSummary(kpi.id, rangeDays);
  const delta = computeDelta(summary?.current_value, summary?.prior_value, kpi.direction);
  const pct = computePercentToTarget(summary?.current_value, kpi.target_value, kpi.direction);
  const { ventures } = useVentures();
  const v = kpi.venture_id ? ventures.find((x) => x.id === kpi.venture_id) : undefined;

  return (
    <TableRow onClick={onClick} className="cursor-pointer hover:bg-secondary/30">
      <TableCell className="font-display font-semibold text-sm">{kpi.name}</TableCell>
      <TableCell>{v ? <VenturePill venture={v} clickable={false} /> : <span className="text-xs text-muted-foreground">—</span>}</TableCell>
      <TableCell className="text-right font-mono">{formatKpiValue(kpi, summary?.current_value)}</TableCell>
      <TableCell className="text-right font-mono text-xs">
        {delta.hasPrior ? (
          <span
            className={
              delta.isNeutral
                ? "text-muted-foreground"
                : delta.isPositive
                ? "text-[hsl(140_55%_38%)]"
                : "text-destructive"
            }
          >
            {delta.label}
          </span>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </TableCell>
      <TableCell className="text-right font-mono text-xs">
        {kpi.target_value !== null ? (
          <span>
            {formatKpiValueShort(kpi, kpi.target_value)}
            {pct !== null && <span className="text-muted-foreground ml-1">({Math.round(pct)}%)</span>}
          </span>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </TableCell>
      <TableCell className="text-xs font-mono text-muted-foreground">
        {summary?.latest_entry_date
          ? formatDistanceToNow(new Date(summary.latest_entry_date + "T00:00:00"), { addSuffix: true })
          : "never"}
      </TableCell>
    </TableRow>
  );
};

export default Kpis;
