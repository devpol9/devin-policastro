import TabBar from "@/components/admin/TabBar";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminShell from "@/components/admin/AdminShell";
import SectionHeader from "@/components/SectionHeader";
import VentureDialog from "@/components/admin/VentureDialog";
import { getVentureIcon } from "@/components/admin/ventureIcons";
import { invalidateVentures, useVentures, type Venture } from "@/hooks/use-ventures";
import { Button } from "@/components/ui/button";

const STATUSES = ["all", "active", "paused", "archived", "idea"] as const;
type StatusFilter = typeof STATUSES[number];

const statusLabel = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const VentureCard = ({ venture, index }: { venture: Venture; index: number }) => {
  const navigate = useNavigate();
  const Icon = getVentureIcon(venture.icon);
  const color = venture.accent_color;
  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onClick={() => navigate(`/hq/ventures/${venture.slug}`)}
      className="text-left glass-card p-5 flex flex-col gap-3 relative overflow-hidden border-l-4"
      style={{ borderLeftColor: color }}
    >
      <Icon size={28} style={{ color }} />
      <div>
        <h3 className="font-display font-semibold text-base leading-tight">{venture.name}</h3>
        {venture.short_name && (
          <p className="font-mono text-[10px] text-muted-foreground mt-0.5">{venture.short_name}</p>
        )}
      </div>
      {venture.description && (
        <p className="text-xs text-muted-foreground line-clamp-2">{venture.description}</p>
      )}
      <div className="flex items-center justify-between mt-auto pt-2">
        <span
          className="text-[10px] font-display font-semibold px-2 py-0.5 rounded-md border"
          style={{
            background: `color-mix(in oklch, ${color} 12%, transparent)`,
            borderColor: `color-mix(in oklch, ${color} 40%, transparent)`,
            color,
          }}
        >
          {statusLabel(venture.status)}
        </span>
        <div className="flex gap-3 text-[10px] font-mono text-muted-foreground">
          <span>0 projects</span>
          <span>0 content</span>
        </div>
      </div>
    </motion.button>
  );
};

const Ventures = () => {
  const { ventures, isLoading } = useVentures();
  const [filter, setFilter] = useState<StatusFilter>("active");
  const [dialogOpen, setDialogOpen] = useState(false);
  const qc = useQueryClient();

  const filtered = useMemo(() => {
    if (filter === "all") return ventures.filter((v) => v.status !== "archived");
    return ventures.filter((v) => v.status === filter);
  }, [ventures, filter]);

  const activeCount = ventures.filter((v) => v.status === "active").length;

  const seedDefaults = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.rpc("seed_default_ventures", { target_user_id: user.id });
    if (error) toast.error(error.message);
    else {
      toast.success("Default ventures seeded");
      invalidateVentures(qc);
    }
  };

  return (
    <AdminGuard>
      <AdminShell>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <SectionHeader
              as="h2"
              numeral="02"
              eyebrow="Operations"
              title={<>Your <span className="accent-headline">ventures.</span></>}
              description={`${activeCount} active ${activeCount === 1 ? "venture" : "ventures"}`}
            />
          </div>
          <Button onClick={() => setDialogOpen(true)} className="shrink-0 mt-2">
            <Plus size={14} className="mr-1" /> New venture
          </Button>
        </div>

        <TabBar
          className="mb-6"
          value={filter}
          onChange={(v) => setFilter(v as any)}
          items={STATUSES.map((s) => ({ value: s as string, label: statusLabel(s) }))}
        />

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : filtered.length === 0 ? (
          ventures.length === 0 ? (
            <div className="glass-card p-10 text-center">
              <p className="text-sm text-muted-foreground mb-4">No ventures yet.</p>
              <Button onClick={seedDefaults}>Seed default ventures</Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No ventures match this filter.</p>
          )
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((v, i) => (
              <VentureCard key={v.id} venture={v} index={i} />
            ))}
          </div>
        )}

        <VentureDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      </AdminShell>
    </AdminGuard>
  );
};

export default Ventures;
