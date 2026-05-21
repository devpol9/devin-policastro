import { useEffect, useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useVentures } from "@/hooks/use-ventures";
import {
  useCreateKpi, useUpdateKpi, type Kpi,
} from "@/hooks/use-kpis";
import {
  UNIT_OPTIONS, CADENCE_OPTIONS, CURRENCY_CODES,
  type KpiUnit, type KpiDirection, type KpiCadence,
} from "@/lib/kpi-utils";
import { toast } from "sonner";
import { ArrowUp, ArrowDown, Globe } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing?: Kpi | null;
  defaults?: { venture_id?: string | null };
  onCreated?: (kpi: Kpi) => void;
}

const KpiDialog = ({ open, onOpenChange, editing, defaults, onCreated }: Props) => {
  const { activeVentures } = useVentures();
  const createMut = useCreateKpi();
  const updateMut = useUpdateKpi();

  const [name, setName] = useState("");
  const [ventureId, setVentureId] = useState<string>("__none");
  const [description, setDescription] = useState("");
  const [unit, setUnit] = useState<KpiUnit>("count");
  const [currency, setCurrency] = useState("USD");
  const [customLabel, setCustomLabel] = useState("");
  const [target, setTarget] = useState<string>("");
  const [direction, setDirection] = useState<KpiDirection>("up");
  const [cadence, setCadence] = useState<KpiCadence>("manual");
  const [isPublic, setIsPublic] = useState(false);
  const [publicLabel, setPublicLabel] = useState("");
  const [publicPrefix, setPublicPrefix] = useState("");
  const [publicSuffix, setPublicSuffix] = useState("");
  const [publicSortOrder, setPublicSortOrder] = useState<string>("0");

  useEffect(() => {
    if (!open) return;
    if (editing) {
      setName(editing.name);
      setVentureId(editing.venture_id ?? "__none");
      setDescription(editing.description ?? "");
      setUnit((editing.unit as KpiUnit) ?? "count");
      setCurrency(editing.currency_code ?? "USD");
      setCustomLabel(editing.custom_unit_label ?? "");
      setTarget(editing.target_value !== null ? String(editing.target_value) : "");
      setDirection((editing.direction as KpiDirection) ?? "up");
      setCadence((editing.entry_cadence as KpiCadence) ?? "manual");
      setIsPublic((editing as any).is_public ?? false);
      setPublicLabel((editing as any).public_label ?? "");
      setPublicPrefix((editing as any).public_prefix ?? "");
      setPublicSuffix((editing as any).public_suffix ?? "");
      setPublicSortOrder(String((editing as any).public_sort_order ?? 0));
    } else {
      setName("");
      setVentureId(defaults?.venture_id ?? "__none");
      setDescription("");
      setUnit("count");
      setCurrency("USD");
      setCustomLabel("");
      setTarget("");
      setDirection("up");
      setCadence("manual");
      setIsPublic(false);
      setPublicLabel("");
      setPublicPrefix("");
      setPublicSuffix("");
      setPublicSortOrder("0");
    }
  }, [open, editing, defaults?.venture_id]);

  const saving = createMut.isPending || updateMut.isPending;

  const submit = async () => {
    if (name.trim().length < 2) return toast.error("Name needs at least 2 characters");
    if (name.length > 60) return toast.error("Name max 60 chars");
    if (description.length > 200) return toast.error("Description max 200 chars");
    if (unit === "custom" && !customLabel.trim()) return toast.error("Custom unit label required");

    const payload = {
      name: name.trim(),
      venture_id: ventureId === "__none" ? null : ventureId,
      description: description.trim() || null,
      unit,
      currency_code: unit === "currency" ? currency : null,
      custom_unit_label: unit === "custom" ? customLabel.trim() : null,
      target_value: target.trim() ? Number(target) : null,
      direction,
      entry_cadence: cadence,
      is_public: isPublic,
      public_label: isPublic ? (publicLabel.trim() || null) : null,
      public_prefix: isPublic ? (publicPrefix || null) : null,
      public_suffix: isPublic ? (publicSuffix || null) : null,
      public_sort_order: Number.isFinite(Number(publicSortOrder)) ? Number(publicSortOrder) : 0,
    } as any;

    try {
      if (editing) {
        await updateMut.mutateAsync({ id: editing.id, patch: payload });
        toast.success("Saved");
        onOpenChange(false);
      } else {
        const created = await createMut.mutateAsync(payload);
        toast.success("KPI created");
        onOpenChange(false);
        onCreated?.(created);
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to save");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto" data-lenis-prevent>
        <DialogHeader>
          <DialogTitle>{editing ? "Edit KPI" : "New KPI"}</DialogTitle>
          <DialogDescription>
            Define what you're tracking. You can log entries after this is created.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 py-2">
          <div>
            <Label className="text-xs">Name *</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. 2THIRTY Monthly Revenue"
              maxLength={60}
            />
          </div>

          <div>
            <Label className="text-xs">Venture</Label>
            <Select value={ventureId} onValueChange={setVentureId}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="__none">No venture / Global</SelectItem>
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
            <Label className="text-xs">Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              maxLength={200}
              placeholder="Optional context"
            />
          </div>

          <div>
            <Label className="text-xs mb-1.5 block">Unit *</Label>
            <div className="grid grid-cols-5 gap-1.5">
              {UNIT_OPTIONS.map((u) => (
                <button
                  key={u.value}
                  type="button"
                  onClick={() => setUnit(u.value)}
                  className={`flex flex-col items-center justify-center gap-1 px-1 py-2 rounded-md border text-[10px] leading-none font-display transition-colors ${
                    unit === u.value
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border bg-secondary/30 text-muted-foreground hover:border-border-foreground/40"
                  }`}
                  title={u.hint}
                >
                  <span className="text-[13px] font-mono leading-none">{u.icon}</span>
                  <span>{u.label}</span>
                </button>
              ))}
            </div>
          </div>

          {unit === "currency" && (
            <div>
              <Label className="text-xs">Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CURRENCY_CODES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {unit === "custom" && (
            <div>
              <Label className="text-xs">Unit label *</Label>
              <Input
                value={customLabel}
                onChange={(e) => setCustomLabel(e.target.value)}
                placeholder="lbs, subscribers, hours/wk"
                maxLength={20}
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Target value</Label>
              <Input
                type="number"
                step="any"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="Optional"
              />
            </div>
            <div>
              <Label className="text-xs mb-1.5 block">Direction *</Label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setDirection("up")}
                  className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-md border text-[11px] font-display transition-colors ${
                    direction === "up"
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border bg-secondary/30 text-muted-foreground"
                  }`}
                >
                  <ArrowUp size={12} /> Higher
                </button>
                <button
                  type="button"
                  onClick={() => setDirection("down")}
                  className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-md border text-[11px] font-display transition-colors ${
                    direction === "down"
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border bg-secondary/30 text-muted-foreground"
                  }`}
                >
                  <ArrowDown size={12} /> Lower
                </button>
              </div>
            </div>
          </div>

          <div>
            <Label className="text-xs mb-1.5 block">Entry cadence *</Label>
            <div className="flex flex-wrap gap-1.5">
              {CADENCE_OPTIONS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setCadence(c.value)}
                  className={`px-3 py-1.5 rounded-md border text-[11px] font-display transition-colors ${
                    cadence === c.value
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border bg-secondary/30 text-muted-foreground"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>Cancel</Button>
          <Button onClick={submit} disabled={saving}>
            {saving ? "Saving…" : editing ? "Save" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default KpiDialog;
