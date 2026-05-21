import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import { ArrowUp, ArrowDown, Mail, Send, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface DigestKpi { name: string; value: number; delta: number | null; }
interface Digest {
  kpisMoved: DigestKpi[];
  inquiriesNew: number;
  contentPosted: number;
}

const yesterdayISO = format(subDays(new Date(), 1), "yyyy-MM-dd");

const DailyDigest = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<Digest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const y = subDays(new Date(), 1);
      const yStart = startOfDay(y).toISOString();
      const yEnd = endOfDay(y).toISOString();

      const [entriesRes, inqRes, postedRes] = await Promise.all([
        supabase
          .from("kpi_entries")
          .select("kpi_id, value, kpis(name)")
          .eq("entry_date", yesterdayISO),
        supabase
          .from("inquiries")
          .select("id", { count: "exact", head: true })
          .gte("created_at", yStart)
          .lte("created_at", yEnd),
        supabase
          .from("content_items")
          .select("id", { count: "exact", head: true })
          .gte("posted_at", yStart)
          .lte("posted_at", yEnd),
      ]);

      // compute deltas: lookup previous value per kpi
      const entries = (entriesRes.data || []) as any[];
      const kpisMoved: DigestKpi[] = [];
      for (const e of entries) {
        const { data: prior } = await supabase
          .from("kpi_entries")
          .select("value")
          .eq("kpi_id", e.kpi_id)
          .lt("entry_date", yesterdayISO)
          .order("entry_date", { ascending: false })
          .limit(1)
          .maybeSingle();
        const delta = prior?.value != null
          ? ((Number(e.value) - Number(prior.value)) / Math.abs(Number(prior.value) || 1)) * 100
          : null;
        kpisMoved.push({ name: e.kpis?.name ?? "KPI", value: Number(e.value), delta });
      }

      setData({
        kpisMoved: kpisMoved.slice(0, 3),
        inquiriesNew: inqRes.count ?? 0,
        contentPosted: postedRes.count ?? 0,
      });
      setLoading(false);
    })();
  }, []);

  if (loading) return null;
  if (!data) return null;

  const isEmpty =
    data.kpisMoved.length === 0 && data.inquiriesNew === 0 && data.contentPosted === 0;
  if (isEmpty) return null;

  return (
    <div className="panel p-4 mb-8">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-[10px] font-mono text-muted-foreground tracking-[0.12em]">YESTERDAY</p>
          <h3 className="text-sm font-display font-semibold">
            {format(subDays(new Date(), 1), "EEEE, MMM d")}
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => navigate("/hq/inquiries")}
          className="text-left p-3 rounded-md border border-border/40 hover:border-accent/40 transition-colors"
        >
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Mail size={12} />
            <span className="text-[10px] font-mono">Inquiries</span>
          </div>
          <p className="font-display font-black text-2xl tabular-nums">{data.inquiriesNew}</p>
        </button>

        <button
          onClick={() => navigate("/hq/content")}
          className="text-left p-3 rounded-md border border-border/40 hover:border-accent/40 transition-colors"
        >
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Send size={12} />
            <span className="text-[10px] font-mono">Posted</span>
          </div>
          <p className="font-display font-black text-2xl tabular-nums">{data.contentPosted}</p>
        </button>

        <button
          onClick={() => navigate("/hq/kpis")}
          className="text-left p-3 rounded-md border border-border/40 hover:border-accent/40 transition-colors"
        >
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <TrendingUp size={12} />
            <span className="text-[10px] font-mono">KPIs logged</span>
          </div>
          <p className="font-display font-black text-2xl tabular-nums">{data.kpisMoved.length}</p>
        </button>
      </div>

      {data.kpisMoved.length > 0 && (
        <div className="mt-3 space-y-1.5 pt-3 border-t border-border/40">
          {data.kpisMoved.map((k) => (
            <div key={k.name} className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground truncate">{k.name}</span>
              <span className="flex items-center gap-1 font-mono tabular-nums">
                {k.value.toLocaleString()}
                {k.delta != null && (
                  <span
                    className={`inline-flex items-center gap-0.5 text-[10px] ${
                      k.delta > 0
                        ? "text-[hsl(140_55%_45%)]"
                        : k.delta < 0
                        ? "text-destructive"
                        : "text-muted-foreground"
                    }`}
                  >
                    {k.delta > 0 ? <ArrowUp size={9} /> : k.delta < 0 ? <ArrowDown size={9} /> : null}
                    {Math.abs(k.delta).toFixed(0)}%
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DailyDigest;
