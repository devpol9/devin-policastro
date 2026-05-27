import { motion } from "framer-motion";
import AnimatedCounter from "@/components/effects/AnimatedCounter";
import { usePublicKpis, type PublicKpi } from "@/hooks/use-public-kpis";

interface Stat {
  value: number;
  prefix: string;
  suffix: string;
  label: string;
}

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
  // Keep "Packs Sold" consistent with the hero marquee — 7,000+
  const isPacksSold = /packs?\s*sold/i.test(k.label);
  const value = isPacksSold ? 7000 : Number(k.latest_value);
  const finalSuffix = isPacksSold && !suffix ? "+" : suffix;
  return {
    value,
    prefix,
    suffix: finalSuffix,
    label: k.label,
  };
};

const StatsBar = () => {
  const { data: publicKpis } = usePublicKpis();

  const liveStats = (publicKpis ?? [])
    .map(kpiToStat)
    .filter((s): s is Stat => s !== null);

  const stats: Stat[] = liveStats.length > 0 ? liveStats.slice(0, 5) : FALLBACK_STATS;
  const [featured, ...rest] = stats;

  return (
    <section className="px-5 sm:px-8 lg:px-10 py-24 sm:py-32 relative overflow-hidden bg-background text-foreground border-y border-foreground/10">
      <div className="container-tight relative z-10">
        <div className="flex items-center justify-between mb-12 sm:mb-16">
          <span className="text-accent text-[10px] sm:text-xs font-mono tracking-[0.22em]">
            [ 04 / Receipts ]
          </span>
          <span className="text-foreground/40 text-[10px] sm:text-xs font-mono tracking-[0.22em] hidden sm:block">
            Not promises
          </span>
        </div>

        {/* Featured stat */}
        {featured && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 pb-10 sm:pb-14 border-b border-foreground/10"
          >
            <div className="font-display font-black tracking-[-0.04em] leading-[0.85] text-[clamp(4rem,14vw,11rem)] text-foreground">
              <AnimatedCounter target={featured.value} suffix={featured.suffix} prefix={featured.prefix} />
            </div>
            <div className="md:text-right md:max-w-xs">
              <p className="text-accent text-[10px] sm:text-xs font-mono tracking-[0.22em] mb-2">
                — {featured.label}
              </p>
              <p className="text-foreground/50 text-sm font-display">
                The Impact Zone HQ — built brick by brick in Eatontown, NJ.
              </p>
            </div>
          </motion.div>
        )}

        {/* Row of remaining stats with hairline dividers */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-foreground/10 mt-px">
          {rest.map((stat, i) => (
            <motion.div
              key={`${stat.label}-${i}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="bg-background px-5 sm:px-8 py-10 sm:py-14 flex flex-col gap-3 group hover:bg-card transition-colors duration-500"
            >
              <span className="text-accent/60 text-[10px] font-mono tracking-[0.22em]">
                0{i + 1}
              </span>
              <div className="font-display font-black tracking-[-0.03em] leading-none text-[clamp(2rem,5vw,3.5rem)] text-foreground">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
              </div>
              <p className="text-foreground/50 text-[11px] sm:text-xs font-mono tracking-[0.18em] mt-auto">
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
