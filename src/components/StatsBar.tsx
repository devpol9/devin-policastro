import { motion } from "framer-motion";
import AnimatedCounter from "@/components/effects/AnimatedCounter";

const stats = [
  { value: 51000, suffix: "", label: "Sq Ft Gym", prefix: "" },
  { value: 3500, suffix: "+", label: "5-Star Reviews", prefix: "" },
  { value: 7000, suffix: "+", label: "Packs Sold", prefix: "" },
  { value: 3000, suffix: "+", label: "Happy Members", prefix: "" },
  { value: 60, suffix: "+", label: "Weekly Classes", prefix: "" },
];

const StatsBar = () => (
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
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-y-12 gap-x-6 sm:gap-x-10">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
          >
            <div className="font-display font-black text-4xl sm:text-6xl lg:text-7xl mb-3 tracking-[-0.04em] leading-none">
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

export default StatsBar;