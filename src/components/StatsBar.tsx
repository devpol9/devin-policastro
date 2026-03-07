import { motion } from "framer-motion";
import AnimatedCounter from "@/components/effects/AnimatedCounter";

const stats = [
  { value: 51000, suffix: "", label: "Sq Ft Gym", prefix: "" },
  { value: 8, suffix: "+", label: "Revenue Streams", prefix: "" },
  { value: 500, suffix: "K+", label: "Social Reach", prefix: "" },
  { value: 100, suffix: "+", label: "Brand Partners", prefix: "" },
];

const StatsBar = () => (
  <section className="section-padding py-16 relative overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(210_100%_55%/0.05)_0%,transparent_70%)]" />
    <div className="container-tight relative z-10">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.6 }}
            className="text-center"
          >
            <div className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl mb-2">
              <AnimatedCounter
                target={stat.value}
                suffix={stat.suffix}
                prefix={stat.prefix}
                className="gradient-text"
              />
            </div>
            <p className="text-muted-foreground text-sm sm:text-base font-medium tracking-wide uppercase">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default StatsBar;
