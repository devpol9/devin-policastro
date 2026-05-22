import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { format, startOfWeek } from "date-fns";

interface Stats {
  prioritiesDone: number;
  prioritiesTotal: number;
  newInquiries: number;
  staleFollowups: number;
}

const Stat = ({ label, value, sub, to }: { label: string; value: string; sub?: string; to: string }) => (
  <Link
    to={to}
    className="flex-1 min-w-0 panel px-3 py-2.5 rounded-lg hover:border-accent/40 active:scale-[0.98] transition-all"
  >
    <div className="text-[10px] uppercase tracking-wider text-muted-foreground/70 truncate">{label}</div>
    <div className="flex items-baseline gap-1.5 mt-0.5">
      <span className="font-display font-black text-xl leading-none">{value}</span>
      {sub && <span className="text-[10px] text-muted-foreground truncate">{sub}</span>}
    </div>
  </Link>
);

const GlanceStrip = () => {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const today = format(new Date(), "yyyy-MM-dd");
      const weekStart = format(startOfWeek(new Date(), { weekStartsOn: 1 }), "yyyy-MM-dd");
      const thirtyDaysAgo = new Date(Date.now() - 30 * 86400_000).toISOString();

      const [pri, inq, stale] = await Promise.all([
        supabase.from("priorities_today")
          .select("completed,title")
          .eq("priority_date", today),
        supabase.from("inquiries")
          .select("id", { count: "exact", head: true })
          .eq("status", "new")
          .gte("created_at", weekStart),
        supabase.from("people")
          .select("id", { count: "exact", head: true })
          .gte("relationship_strength", 3)
          .or(`last_contacted_at.lt.${thirtyDaysAgo},last_contacted_at.is.null`),
      ]);
      if (cancelled) return;
      const list = (pri.data ?? []).filter((p: any) => (p.title ?? "").trim());
      setStats({
        prioritiesDone: list.filter((p: any) => p.completed).length,
        prioritiesTotal: list.length,
        newInquiries: inq.count ?? 0,
        staleFollowups: stale.count ?? 0,
      });
    })();
    return () => { cancelled = true; };
  }, []);

  if (!stats) {
    return <div className="flex gap-2 mb-6 h-[58px]" aria-hidden />;
  }

  return (
    <div className="flex gap-2 mb-6">
      <Stat
        label="Today"
        value={`${stats.prioritiesDone}/${stats.prioritiesTotal || 3}`}
        sub="priorities"
        to="/hq"
      />
      <Stat
        label="This week"
        value={String(stats.newInquiries)}
        sub={stats.newInquiries === 1 ? "new lead" : "new leads"}
        to="/hq/inquiries"
      />
      <Stat
        label="Reach out"
        value={String(stats.staleFollowups)}
        sub="stale"
        to="/hq/people?filter=stale"
      />
    </div>
  );
};

export default GlanceStrip;
