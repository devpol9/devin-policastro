import { useState } from "react";
import { format } from "date-fns";
import { Check, Plus } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLogKpiEntry, type Kpi } from "@/hooks/use-kpis";

interface Props {
  kpis: Kpi[];
}

const KpiQuickLog = ({ kpis }: Props) => {
  const [kpiId, setKpiId] = useState<string>(kpis[0]?.id ?? "");
  const [value, setValue] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const logMut = useLogKpiEntry();

  if (kpis.length === 0) return null;

  const submit = async () => {
    const num = parseFloat(value);
    if (!kpiId || isNaN(num)) {
      toast.error("Pick a KPI and enter a number");
      return;
    }
    try {
      await logMut.mutateAsync({ kpi_id: kpiId, value: num, entry_date: date });
      toast.success("Logged");
      setValue("");
    } catch (e: any) {
      toast.error(e.message || "Failed to log");
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4 p-2 rounded-md border border-border/40 bg-secondary/20">
      <span className="text-[10px] font-mono text-muted-foreground px-1">Quick log</span>
      <Select value={kpiId} onValueChange={setKpiId}>
        <SelectTrigger className="h-8 w-40 text-xs"><SelectValue placeholder="Pick KPI" /></SelectTrigger>
        <SelectContent>
          {kpis.map((k) => (
            <SelectItem key={k.id} value={k.id} className="text-xs">{k.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        type="number"
        inputMode="decimal"
        step="any"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder="Value"
        className="h-8 w-24 text-xs"
      />
      <Input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="h-8 w-36 text-xs"
      />
      <Button size="sm" variant="outline" onClick={submit} disabled={logMut.isPending} className="h-8">
        {logMut.isPending ? <Plus size={12} className="animate-spin" /> : <Check size={12} />}
        <span className="ml-1 text-xs">Log</span>
      </Button>
    </div>
  );
};

export default KpiQuickLog;
