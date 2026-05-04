import { motion } from "framer-motion";
import { Dumbbell, Droplets, Sparkles, Briefcase, Car, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TiltCard from "@/components/effects/TiltCard";
import TextScramble from "@/components/effects/TextScramble";

const verticals = [
  {
    icon: Dumbbell,
    title: "FITNESS",
    desc: "Impact Zone Fitness — Bergen County's premier 51,000 sq ft facility in Norwood, NJ. 100+ machines, cold plunges, infrared saunas, hot yoga, red light therapy, basketball court, and 5K sports turf.",
    link: "https://impactzonenj.com",
    route: null,
    color: "24 32% 52%",
    label: "Impact Zone",
  },
  {
    icon: Droplets,
    title: "HYDRATION",
    desc: "2THIRTY — The only 5-in-1 hydration+ mixer. Zero sugar, zero calories. NAC, L-Glutathione, Milk Thistle, Ginseng Root. 4.9 stars from 3,500+ reviews.",
    link: "https://drink2thirty.com",
    route: null,
    color: "200 22% 50%",
    label: "2THIRTY",
  },
  {
    icon: Briefcase,
    title: "MANUFACTURING",
    desc: "Creative Vision — custom apparel, jump ropes, mini bands, wrist wraps, blow-up tents, and more. Premium fitness products from concept to delivery.",
    link: null,
    route: "/manufacturing",
    color: "270 18% 55%",
    label: "Creative Vision",
  },
  {
    icon: Sparkles,
    title: "VALENCE",
    desc: "The gym industry runs on broken software. Valence is the all-in-one platform replacing ABC Fitness and Mindbody — member management, billing, scheduling, and retention tools built by someone who actually runs a gym.",
    link: null,
    route: null,
    color: "140 18% 45%",
    label: "Coming Soon",
  },
  {
    icon: Car,
    title: "AUTOMOTIVE",
    desc: "Vinyl wraps, PPF, ceramic coating, window tinting, tuning, and full custom builds. I'll connect you with the right people.",
    link: null,
    route: "/automotive",
    color: "18 38% 50%",
    label: "AUTOMOTIVE",
  },
  {
    icon: Video,
    title: "CONTENT",
    desc: "Documenting the grind on Instagram, TikTok, and YouTube — @devinpolicastro. Real talk, real results, no filter.",
    link: "https://instagram.com/devinpolicastro",
    route: null,
    color: "350 22% 55%",
    label: "@devinpolicastro",
  },
];

const AboutSection = () => {
  const navigate = useNavigate();

  const handleCardClick = (v: typeof verticals[0]) => {
    if (v.route) {
      navigate(v.route);
    } else if (v.link) {
      window.open(v.link, "_blank", "noopener,noreferrer");
    }
  };

  return (
  <section id="about" className="section-padding relative overflow-hidden">
    <div
      className="absolute top-0 right-0 w-1/2 h-full opacity-[0.015]"
      style={{
        backgroundImage: `linear-gradient(hsl(40 10% 50%) 1px, transparent 1px), linear-gradient(90deg, hsl(40 10% 50%) 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }}
    />

    <div className="container-tight relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mb-14 sm:mb-24"
      >
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: 60 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="h-px bg-primary/60 mb-8 sm:mb-10"
        />
        <p className="text-primary/80 font-display text-[10px] tracking-[0.5em] uppercase mb-4 sm:mb-5">[ 01 — My World ]</p>
        <h2 className="font-display font-extrabold text-3xl sm:text-6xl lg:text-7xl leading-[0.88] mb-6 sm:mb-8 tracking-[-0.02em]">
          <span className="text-muted-foreground">I Just</span>
          <br />
          <span className="gradient-text">Build.</span>
        </h2>
        <p className="text-muted-foreground max-w-md text-sm sm:text-base leading-[1.8]">
          Entrepreneur from Norwood, New Jersey. Leading Impact Zone, building 2THIRTY,
          manufacturing through Creative Vision, and developing Valence.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {verticals.map((v, i) => (
          <motion.div
            key={v.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: i * 0.08 }}
          >
            <TiltCard className="h-full">
              <div
                onClick={() => handleCardClick(v)}
                className={`h-full block group relative overflow-hidden rounded-lg transition-all duration-500 ${v.link || v.route ? "cursor-pointer" : "cursor-default"}`}
                style={{
                  background: `linear-gradient(145deg, hsl(225 20% 7% / 0.95) 0%, hsl(225 20% 5% / 0.8) 100%)`,
                  border: `1px solid hsl(${v.color} / 0.15)`,
                  boxShadow: `0 4px 24px hsl(225 30% 2% / 0.6), inset 0 1px 0 hsl(${v.color} / 0.08)`,
                }}
              >
                {/* Top accent bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-[2px] transition-opacity duration-500 opacity-60 group-hover:opacity-100"
                  style={{ background: `linear-gradient(90deg, transparent, hsl(${v.color}), transparent)` }}
                />

                {/* Ambient glow background */}
                <div
                  className="absolute inset-0 opacity-[0.06] group-hover:opacity-[0.14] transition-opacity duration-700"
                  style={{ background: `radial-gradient(ellipse at 50% 0%, hsl(${v.color}) 0%, transparent 70%)` }}
                />

                {/* Hover border glow */}
                <div
                  className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ boxShadow: `inset 0 0 0 1px hsl(${v.color} / 0.4), 0 0 30px hsl(${v.color} / 0.12)` }}
                />

                <div className="relative z-10 p-5 sm:p-7 lg:p-8 flex flex-col h-full">
                  {/* Icon + label row */}
                  <div className="flex items-start justify-between mb-5 sm:mb-7">
                    <div
                      className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-500 relative"
                      style={{
                        background: `linear-gradient(135deg, hsl(${v.color} / 0.2) 0%, hsl(${v.color} / 0.08) 100%)`,
                        border: `1px solid hsl(${v.color} / 0.25)`,
                        boxShadow: `0 0 20px hsl(${v.color} / 0.15)`,
                      }}
                    >
                      <v.icon
                        size={20}
                        style={{ color: `hsl(${v.color})`, filter: `drop-shadow(0 0 6px hsl(${v.color} / 0.6))` }}
                      />
                    </div>
                    <span
                      className="text-[8px] sm:text-[9px] font-display font-bold tracking-[0.3em] uppercase px-2.5 py-1 rounded-full"
                      style={{
                        color: `hsl(${v.color})`,
                        background: `hsl(${v.color} / 0.1)`,
                        border: `1px solid hsl(${v.color} / 0.2)`,
                      }}
                    >
                      {v.label}
                    </span>
                  </div>

                  <h3 className="font-display font-extrabold text-sm sm:text-base tracking-[0.12em] mb-2 sm:mb-3 transition-colors duration-300"
                    style={{ color: `hsl(${v.color})` }}
                  >
                    <TextScramble text={v.title} delay={i * 200 + 500} />
                  </h3>
                  <p className="text-muted-foreground text-xs sm:text-sm leading-[1.7] flex-1">{v.desc}</p>

                  {(v.link || v.route) && (
                    <div
                      className="mt-5 sm:mt-7 flex items-center gap-2 text-xs font-display font-semibold tracking-widest uppercase opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500"
                      style={{ color: `hsl(${v.color})` }}
                    >
                      <span>Explore</span>
                      <span className="text-sm">→</span>
                    </div>
                  )}
                </div>
              </div>
            </TiltCard>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
  );
};

export default AboutSection;
