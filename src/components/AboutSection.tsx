import { motion } from "framer-motion";
import { Dumbbell, Droplets, Sparkles, Briefcase, Car, Video } from "lucide-react";
import TiltCard from "@/components/effects/TiltCard";
import TextScramble from "@/components/effects/TextScramble";

const verticals = [
  { icon: Dumbbell, title: "FITNESS", desc: "Impact Zone NJ — 51,000 sq ft of Bergen County's biggest gym.", link: "#", color: "from-blue-500/20 to-cyan-500/10" },
  { icon: Droplets, title: "HYDRATION", desc: "2THIRTY — Functional hydration mixers. Clean, effective, no BS.", link: "https://drink2thirty.com", color: "from-cyan-500/20 to-teal-500/10" },
  { icon: Sparkles, title: "LIFESTYLE", desc: "Living loud. Cars, travel, culture, and the hustle behind it all.", link: "#", color: "from-purple-500/20 to-pink-500/10" },
  { icon: Briefcase, title: "BUSINESS", desc: "Building brands, closing deals, and connecting the dots others can't see.", link: "#", color: "from-amber-500/20 to-orange-500/10" },
  { icon: Car, title: "AUTOMOTIVE", desc: "Builds, mods, and the car culture that fuels me.", link: "#", color: "from-red-500/20 to-orange-500/10" },
  { icon: Video, title: "CONTENT", desc: "Documenting the grind across IG, TikTok, and YouTube.", link: "#", color: "from-indigo-500/20 to-violet-500/10" },
];

const AboutSection = () => (
  <section id="about" className="section-padding relative overflow-hidden">
    {/* Decorative grid */}
    <div className="absolute top-0 right-0 w-1/2 h-full opacity-[0.02]"
      style={{
        backgroundImage: `linear-gradient(hsl(210 20% 50%) 1px, transparent 1px), linear-gradient(90deg, hsl(210 20% 50%) 1px, transparent 1px)`,
        backgroundSize: "40px 40px",
      }}
    />

    <div className="container-tight relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mb-20"
      >
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: 80 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="h-px bg-primary mb-8"
        />
        <p className="text-primary font-display text-xs tracking-[0.4em] uppercase mb-4">[ 01 — My World ]</p>
        <h2 className="font-display font-bold text-4xl sm:text-6xl lg:text-7xl leading-[0.9] mb-6">
          I Don't Pick
          <br />
          One Lane.
          <br />
          <span className="text-muted-foreground">I Build the</span>
          <br />
          <span className="gradient-text">Highway.</span>
        </h2>
        <p className="text-muted-foreground max-w-lg text-lg leading-relaxed">
          Entrepreneur from Jersey. Multiple businesses, multiple verticals, one mission: 
          build things that matter and connect people who move the needle.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {verticals.map((v, i) => (
          <motion.div
            key={v.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
          >
            <TiltCard className="h-full">
              <a
                href={v.link}
                target={v.link.startsWith("http") ? "_blank" : undefined}
                rel={v.link.startsWith("http") ? "noopener noreferrer" : undefined}
                className={`glass-card p-6 sm:p-8 h-full block group relative overflow-hidden cursor-pointer border border-border/20 hover:border-primary/30 transition-colors duration-500`}
              >
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${v.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110">
                    <v.icon size={24} className="text-primary" />
                  </div>
                  <h3 className="font-display font-bold text-lg tracking-wide mb-2">
                    <TextScramble text={v.title} delay={i * 200 + 500} />
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>

                  <div className="mt-5 flex items-center gap-2 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <span>Explore</span>
                    <span className="text-lg">→</span>
                  </div>
                </div>
              </a>
            </TiltCard>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default AboutSection;
