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
  <section className="px-5 sm:px-8 lg:px-10 py-12 sm:py-20 relative overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(38_90%_58%/0.03)_0%,transparent_70%)]" />
    <div className="container-tight relative z-10">
      <div className="flex flex-wrap justify-center gap-6 sm:gap-10">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.7 }}
            className="text-center w-[calc(50%-1.5rem)] sm:w-auto sm:flex-1 sm:max-w-[200px]"
          >
            <div className="font-display font-extrabold text-2xl sm:text-5xl lg:text-6xl mb-2 sm:mb-3 tracking-tight">
              <AnimatedCounter
                target={stat.value}
                suffix={stat.suffix}
                prefix={stat.prefix}
                className="gradient-text"
              />
            </div>
            <p className="text-muted-foreground text-[10px] sm:text-sm font-display font-medium tracking-[0.15em] sm:tracking-[0.2em] uppercase">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default StatsBar;