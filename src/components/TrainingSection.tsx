import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dumbbell, Users, ArrowUpRight, Zap, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const tabs = [
  {
    id: "personal",
    label: "Train with Devin",
    icon: Dumbbell,
    index: "01",
    title: "1-on-1 with Devin",
    desc: "Train with me directly. I'll build a program around your goals, your schedule, and what actually works — not some generic template.",
    cta: "Book a session",
    ctaAction: "calendar" as const,
  },
  {
    id: "coaching",
    label: "Get a coach",
    icon: Users,
    index: "02",
    title: "Get matched with a coach",
    desc: "Tell me your goals and I'll pair you with the best coach on my team — strength, weight loss, sports performance, rehab, you name it.",
    cta: "Find my coach",
    ctaAction: "fitness" as const,
  },
  {
    id: "programs",
    label: "Programs",
    icon: Zap,
    index: "03",
    title: "Group programs & classes",
    desc: "Structured group sessions — HIIT, strength circuits, and sport-specific programming. Show up, put in the work, get better.",
    cta: "View programs",
    ctaAction: "external" as const,
  },
];

const TrainingSection = () => {
  const [active, setActive] = useState("personal");
  const current = tabs.find((t) => t.id === active)!;
  const navigate = useNavigate();

  const handleCta = () => {
    if (current.ctaAction === "calendar") {
      window.open("https://calendar.app.google/2MSzLtJVX7GZ93Zs9", "_blank", "noopener,noreferrer");
    } else if (current.ctaAction === "fitness") {
      navigate("/fitness");
    } else if (current.ctaAction === "external") {
      window.open("https://www.impactzonenj.com/classes", "_blank", "noopener,noreferrer");
    }
  };

  return (
    <section id="training" className="section-padding relative overflow-hidden">
      <div className="container-tight relative z-10">
        {/* Header strip */}
        <div className="flex items-center justify-between mb-10 sm:mb-14 text-[10px] sm:text-xs font-mono tracking-[0.22em]">
          <span className="text-accent">[ 06 / Training ]</span>
          <span className="text-foreground/40 hidden sm:inline">Impact Zone · Norwood NJ</span>
        </div>

        <h2 className="font-display font-bold text-[clamp(2.6rem,9vw,6rem)] leading-[0.86] tracking-[-0.045em] text-foreground mb-12 sm:mb-16 max-w-4xl">
          Move <span className="accent-headline">smarter.</span> Not harder.
        </h2>

        {/* Split layout: sticky tab rail left / content card right */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4">
          {/* Tab rail */}
          <div className="md:col-span-4 flex flex-col gap-2">
            {tabs.map((tab) => {
              const isActive = tab.id === active;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActive(tab.id)}
                  className={`group relative text-left p-5 sm:p-6 rounded-2xl border transition-all duration-500 ${
                    isActive
                      ? "bg-card border-accent/40"
                      : "bg-card/40 border-foreground/5 hover:bg-card hover:border-foreground/10"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <tab.icon size={18} strokeWidth={1.5} className={isActive ? "text-accent" : "text-muted-foreground"} />
                    <span className={`text-[10px] font-mono tracking-[0.22em] ${isActive ? "text-accent" : "text-foreground/40"}`}>
                      {tab.index}
                    </span>
                  </div>
                  <p className={`font-display font-semibold text-base sm:text-lg tracking-tight ${isActive ? "text-foreground" : "text-foreground/70"}`}>
                    {tab.label}
                  </p>
                  {isActive && (
                    <motion.span
                      layoutId="training-active-indicator"
                      className="absolute left-0 top-5 bottom-5 w-px bg-accent"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Content card */}
          <div className="md:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="relative h-full min-h-[420px] rounded-2xl sm:rounded-3xl overflow-hidden bg-card border border-foreground/5"
              >
                <div className="absolute inset-0 opacity-30">
                  <img
                    src="/images/iz-training.jpg"
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-background via-background/85 to-background/60" />

                <div className="relative h-full p-7 sm:p-12 flex flex-col">
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-[10px] sm:text-xs font-mono tracking-[0.22em] text-accent">
                      {current.index} / {current.label}
                    </span>
                    <current.icon size={22} strokeWidth={1.5} className="text-accent" />
                  </div>

                  <h3 className="font-display font-semibold text-3xl sm:text-5xl tracking-tight leading-[1.02] text-foreground mb-5 max-w-xl">
                    {current.title}
                  </h3>

                  <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-lg mb-auto">
                    {current.desc}
                  </p>

                  <div className="mt-8 sm:mt-12">
                    <button
                      onClick={handleCta}
                      className="group inline-flex items-center gap-3 px-6 py-3.5 rounded-full bg-accent text-accent-foreground font-display font-semibold text-sm tracking-wide hover:gap-4 transition-all"
                    >
                      {current.cta}
                      {current.ctaAction === "external" || current.ctaAction === "calendar" ? (
                        <ArrowUpRight size={16} />
                      ) : (
                        <ArrowRight size={16} />
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrainingSection;
