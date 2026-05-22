import { motion } from "framer-motion";
import AnimatedCounter from "@/components/effects/AnimatedCounter";
import { usePublicKpis, type PublicKpi } from "@/hooks/use-public-kpis";

interface Stat {
  value: number;
  prefix: string;
  suffix: string;
  label: string;
}

// Fallback used until KPIs are flagged public in /hq/kpis
const FALLBACK_STATS: Stat[] = [
  { value: 51000, suffix: "", label: "Sq Ft Gym", prefix: "" },
  { value: 3500, suffix: "+", label: "5-Star Reviews", prefix: "" },
  { value: 7000, suffix: "+", label: "Packs Sold", prefix: "" },
  { value: 3000, suffix: "+", label: "Happy Members", prefix: "" },
  { value: 60, suffix: "+", label: "Weekly Classes", prefix: "" },
];

const kpiToStat = (k: PublicKpi): Stat | null => {
  if (k.latest_value === null || k.latest_value === undefined) return null;
  let prefix = k.prefix ?? "";
  if (!prefix && k.unit === "currency") prefix = "$";
  let suffix = k.suffix ?? "";
  if (!suffix && k.unit === "percent") suffix = "%";
  return {
    value: Number(k.latest_value),
    prefix,
    suffix,
    label: k.label,
  };
};

const StatsBar = () => {
  const { data: publicKpis } = usePublicKpis();

  const liveStats = (publicKpis ?? [])
    .map(kpiToStat)
    .filter((s): s is Stat => s !== null);

  const stats: Stat[] = liveStats.length > 0 ? liveStats.slice(0, 5) : FALLBACK_STATS;
  const gridCols = stats.length >= 5 ? "sm:grid-cols-3 lg:grid-cols-5" : stats.length === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-3";

  return (
    <section className="px-5 sm:px-8 lg:px-10 py-20 sm:py-28 relative overflow-hidden bg-accent text-accent-foreground">
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--accent-foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--accent-foreground)) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />
      <div className="container-tight relative z-10">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-accent-foreground/70 text-[10px] sm:text-xs font-display font-medium tracking-[0.22em] mb-10 sm:mb-14 text-center"
        >
          — Receipts, not promises
        </motion.p>
        <div className={`grid grid-cols-2 ${gridCols} gap-y-14 gap-x-8 sm:gap-x-12 lg:gap-x-6`}>
          {stats.map((stat, i) => (
            <motion.div
              key={`${stat.label}-${i}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-center min-w-0 px-2"
            >
              <div className="font-display font-black mb-3 tracking-[-0.03em] leading-none whitespace-nowrap text-[clamp(2.25rem,5vw,4.5rem)]">
                <AnimatedCounter
                  target={stat.value}
                  suffix={stat.suffix}
                  prefix={stat.prefix}
                />
              </div>
              <p className="text-accent-foreground/70 text-[10px] sm:text-xs font-display font-medium tracking-[0.18em]">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsBar;
