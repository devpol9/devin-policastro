import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useKpis } from "@/hooks/use-kpis";
import KpiQuickLog from "./KpiQuickLog";

const QuickKpiDialog = ({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) => {
  const { kpis } = useKpis({ archived: false });
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Log a KPI</DialogTitle>
        </DialogHeader>
        {kpis.length === 0 ? (
          <p className="text-xs text-muted-foreground py-4">No KPIs yet. Create one from the KPIs page.</p>
        ) : (
          <KpiQuickLog kpis={kpis} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default QuickKpiDialog;
