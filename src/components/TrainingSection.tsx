import { motion } from "framer-motion";
import { Dumbbell, Users, Target, Zap, ArrowRight, Star, Clock, MapPin } from "lucide-react";
import TiltCard from "@/components/effects/TiltCard";

const perks = [
  { icon: Dumbbell, text: "100+ Machines & Free Weights" },
  { icon: Zap, text: "Cold Plunges & Infrared Saunas" },
  { icon: Star, text: "Hot Yoga & Red Light Therapy" },
  { icon: Target, text: "Basketball Court & 5K Turf" },
  { icon: Clock, text: "Month-to-Month, No Commitment" },
  { icon: MapPin, text: "335 Chestnut St, Norwood NJ" },
];

const paths = [
  {
    icon: Dumbbell,
    title: "Train With Devin",
    desc: "1-on-1 sessions with me. I'll push you past your limits and build a program that actually works for your goals.",
    cta: "Book a Session",
    color: "38 90% 58%",
    highlight: true,
  },
  {
    icon: Users,
    title: "Get Matched With a Coach",
    desc: "Tell me your goals and I'll pair you with the best coach on my team — strength, weight loss, sports performance, rehab, you name it.",
    cta: "Find My Coach",
    color: "195 90% 55%",
    highlight: false,
  },
];

const TrainingSection = () => (
  <section id="training" className="section-padding relative overflow-hidden">
    {/* Subtle grid overlay */}
    <div
      className="absolute inset-0 opacity-[0.012]"
      style={{
        backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
        backgroundSize: "80px 80px",
      }}
    />

    <div className="container-tight relative z-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mb-14 sm:mb-20"
      >
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: 60 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="h-px bg-primary/60 mb-8 sm:mb-10"
        />
        <p className="text-primary/80 font-display text-[10px] tracking-[0.5em] uppercase mb-4 sm:mb-5">
          [ 07 — Training ]
        </p>
        <h2 className="font-display font-extrabold text-3xl sm:text-6xl lg:text-7xl leading-[0.88] mb-6 sm:mb-8 tracking-[-0.02em]">
          Your Journey.
          <br />
          <span className="text-muted-foreground">Your Way.</span>
          <br />
          <span className="gradient-text">I'll Get You There.</span>
        </h2>
        <p className="text-muted-foreground max-w-lg text-sm sm:text-base leading-[1.8]">
          Whether you train with me or one of my handpicked coaches —
          I'll make sure you're set up for success.
        </p>
      </motion.div>

      {/* Two paths */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
        {paths.map((path, i) => (
          <motion.div
            key={path.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: i * 0.1 }}
          >
            <TiltCard className="h-full" intensity={6}>
              <div
                className="h-full flex flex-col relative overflow-hidden rounded-lg transition-all duration-500 group cursor-pointer"
                style={{
                  background: path.highlight
                    ? `linear-gradient(145deg, hsl(${path.color} / 0.12) 0%, hsl(225 20% 5% / 0.95) 100%)`
                    : `linear-gradient(145deg, hsl(225 20% 7% / 0.95) 0%, hsl(225 20% 5% / 0.8) 100%)`,
                  border: `1px solid hsl(${path.color} / ${path.highlight ? 0.3 : 0.15})`,
                  boxShadow: path.highlight
                    ? `0 4px 40px hsl(${path.color} / 0.15), inset 0 1px 0 hsl(${path.color} / 0.15)`
                    : `0 4px 24px hsl(225 30% 2% / 0.6), inset 0 1px 0 hsl(${path.color} / 0.08)`,
                }}
              >
                {/* Top accent bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-[2px] opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `linear-gradient(90deg, transparent, hsl(${path.color}), transparent)` }}
                />

                {/* Ambient glow */}
                <div
                  className="absolute inset-0 opacity-[0.06] group-hover:opacity-[0.18] transition-opacity duration-700"
                  style={{ background: `radial-gradient(ellipse at 50% 0%, hsl(${path.color}) 0%, transparent 70%)` }}
                />

                {/* Hover border glow */}
                <div
                  className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ boxShadow: `inset 0 0 0 1px hsl(${path.color} / 0.4), 0 0 30px hsl(${path.color} / 0.12)` }}
                />

                <div className="relative z-10 p-6 sm:p-8 flex flex-col h-full">
                  {/* Icon + highlight badge */}
                  <div className="flex items-start justify-between mb-6 sm:mb-8">
                    <div
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-500"
                      style={{
                        background: `linear-gradient(135deg, hsl(${path.color} / 0.2) 0%, hsl(${path.color} / 0.08) 100%)`,
                        border: `1px solid hsl(${path.color} / 0.3)`,
                        boxShadow: `0 0 24px hsl(${path.color} / 0.2)`,
                      }}
                    >
                      <path.icon
                        size={24}
                        style={{ color: `hsl(${path.color})`, filter: `drop-shadow(0 0 8px hsl(${path.color} / 0.6))` }}
                      />
                    </div>
                    {path.highlight && (
                      <span
                        className="text-[8px] sm:text-[9px] font-display font-bold tracking-[0.3em] uppercase px-3 py-1.5 rounded-full"
                        style={{
                          color: `hsl(${path.color})`,
                          background: `hsl(${path.color} / 0.12)`,
                          border: `1px solid hsl(${path.color} / 0.25)`,
                        }}
                      >
                        Popular
                      </span>
                    )}
                  </div>

                  <h3
                    className="font-display font-bold text-lg sm:text-xl mb-3 sm:mb-4 transition-colors duration-300"
                    style={{ color: `hsl(${path.color})` }}
                  >
                    {path.title}
                  </h3>

                  <p className="text-muted-foreground text-sm leading-[1.8] flex-1 mb-6 sm:mb-8">
                    {path.desc}
                  </p>

                  <button
                    className="flex items-center gap-2 text-xs sm:text-sm font-display font-bold tracking-wider uppercase transition-all duration-500 group/btn"
                    style={{ color: `hsl(${path.color})` }}
                    onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
                  >
                    <span>{path.cta}</span>
                    <ArrowRight size={16} className="group-hover/btn:translate-x-2 transition-transform duration-300" />
                  </button>
                </div>
              </div>
            </TiltCard>
          </motion.div>
        ))}
      </div>

    </div>
  </section>
);

export default TrainingSection;
