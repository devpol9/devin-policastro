import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dumbbell, Users, ArrowRight, Zap } from "lucide-react";

const tabs = [
  {
    id: "personal",
    label: "Train With Devin",
    icon: Dumbbell,
    title: "1-on-1 With Devin",
    desc: "Personal sessions with me. I'll push you past your limits and build a program that actually works for your goals. No cookie-cutter plans — just results.",
    cta: "Book a Session",
    color: "38 90% 58%",
  },
  {
    id: "coaching",
    label: "Get a Coach",
    icon: Users,
    title: "Get Matched With a Coach",
    desc: "Tell me your goals and I'll pair you with the best coach on my team — strength, weight loss, sports performance, rehab, you name it.",
    cta: "Find My Coach",
    color: "195 90% 55%",
  },
  {
    id: "programs",
    label: "Programs",
    icon: Zap,
    title: "Group Programs & Classes",
    desc: "Join our structured group training sessions. From HIIT to strength circuits — push yourself alongside others who are just as hungry.",
    cta: "View Programs",
    color: "150 80% 50%",
  },
];

const TrainingSection = () => {
  const [active, setActive] = useState("personal");
  const current = tabs.find((t) => t.id === active)!;

  return (
    <section id="training" className="relative overflow-hidden">
      {/* Hero image */}
      <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] overflow-hidden">
        <img
          src="/images/iz-training.jpg"
          alt="Training at Impact Zone"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 font-display font-extrabold text-sm sm:text-lg tracking-[0.35em] uppercase text-foreground/70"
        >
          <span className="text-primary/80 text-[10px] tracking-[0.5em] block mb-1">[ 06 — Training ]</span>
        </motion.p>
      </div>

      {/* Tabs + Content */}
      <div className="container-tight relative z-10 py-10 sm:py-16">
        {/* Tab pills */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12">
          {tabs.map((tab) => {
            const isActive = tab.id === active;
            return (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                className="relative flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 rounded-full font-display text-[10px] sm:text-xs font-bold tracking-[0.15em] uppercase whitespace-nowrap transition-all duration-300"
                style={{
                  color: isActive ? `hsl(${tab.color})` : "hsl(var(--muted-foreground))",
                  background: isActive ? `hsl(${tab.color} / 0.12)` : "hsl(var(--card))",
                  border: `1px solid ${isActive ? `hsl(${tab.color} / 0.35)` : "hsl(var(--border))"}`,
                  boxShadow: isActive ? `0 0 20px hsl(${tab.color} / 0.15)` : "none",
                }}
              >
                <tab.icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            className="relative rounded-lg overflow-hidden"
            style={{
              background: `linear-gradient(145deg, hsl(${current.color} / 0.08) 0%, hsl(var(--card)) 100%)`,
              border: `1px solid hsl(${current.color} / 0.2)`,
            }}
          >
            {/* Top accent */}
            <div
              className="absolute top-0 left-0 right-0 h-[2px]"
              style={{ background: `linear-gradient(90deg, transparent, hsl(${current.color}), transparent)` }}
            />

            <div className="p-6 sm:p-10">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center"
                  style={{
                    background: `hsl(${current.color} / 0.15)`,
                    border: `1px solid hsl(${current.color} / 0.3)`,
                  }}
                >
                  <current.icon size={20} style={{ color: `hsl(${current.color})` }} />
                </div>
                <h3
                  className="font-display font-bold text-lg sm:text-2xl"
                  style={{ color: `hsl(${current.color})` }}
                >
                  {current.title}
                </h3>
              </div>

              <p className="text-muted-foreground text-sm sm:text-base leading-[1.8] max-w-xl mb-6 sm:mb-8">
                {current.desc}
              </p>

              <button
                className="flex items-center gap-2 text-xs sm:text-sm font-display font-bold tracking-wider uppercase transition-all duration-300 group"
                style={{ color: `hsl(${current.color})` }}
                onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
              >
                <span>{current.cta}</span>
                <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform duration-300" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default TrainingSection;
