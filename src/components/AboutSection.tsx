import { motion } from "framer-motion";
import { Dumbbell, Droplets, Sparkles, Briefcase, Car, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TiltCard from "@/components/effects/TiltCard";
import TextScramble from "@/components/effects/TextScramble";
import SectionHeader from "@/components/SectionHeader";

const verticals = [
  {
    icon: Dumbbell,
    title: "Fitness",
    desc: "Impact Zone Fitness — Bergen County's premier 51,000 sq ft facility in Norwood, NJ. 100+ machines, cold plunges, infrared saunas, hot yoga, red light therapy, basketball court, and 5K sports turf.",
    link: "https://impactzonenj.com",
    route: null,
    color: "24 32% 52%",
    label: "Impact Zone",
  },
  {
    icon: Droplets,
    title: "Hydration",
    desc: "2THIRTY — The only 5-in-1 hydration+ mixer. Zero sugar, zero calories. NAC, L-Glutathione, Milk Thistle, Ginseng Root. 4.9 stars from 3,500+ reviews.",
    link: "https://drink2thirty.com",
    route: null,
    color: "200 22% 50%",
    label: "2THIRTY",
  },
  {
    icon: Briefcase,
    title: "Manufacturing",
    desc: "Creative Vision — custom apparel, jump ropes, mini bands, wrist wraps, blow-up tents, and more. Premium fitness products from concept to delivery.",
    link: null,
    route: "/manufacturing",
    color: "270 18% 55%",
    label: "Creative Vision",
  },
  {
    icon: Sparkles,
    title: "Valence",
    desc: "The gym industry runs on broken software. Valence is the all-in-one platform replacing ABC Fitness and Mindbody — member management, billing, scheduling, and retention tools built by someone who actually runs a gym.",
    link: null,
    route: null,
    color: "140 18% 45%",
    label: "Coming Soon",
  },
  {
    icon: Car,
    title: "Automotive",
    desc: "Vinyl wraps, PPF, ceramic coating, window tinting, tuning, and full custom builds. I'll connect you with the right people.",
    link: null,
    route: "/automotive",
    color: "18 38% 50%",
    label: "Automotive",
  },
  {
    icon: Video,
    title: "Content",
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
      className="absolute top-0 right-0 w-1/2 h-full opacity-[0.04] pointer-events-none"
      style={{
        backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
        backgroundSize: "80px 80px",
      }}
    />

    <div className="container-tight relative z-10">
      <SectionHeader
        numeral="01"
        eyebrow="My World"
        title={<>I just <span className="italic font-light text-accent">build.</span></>}
        description="Entrepreneur from Norwood, New Jersey. Leading Impact Zone, building 2THIRTY, manufacturing through Creative Vision, and developing Valence."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {verticals.map((v, i) => (
          <motion.div
            key={v.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: i * 0.08 }}
          >
            <div
              onClick={() => handleCardClick(v)}
              className={`h-full block group relative overflow-hidden rounded-lg bg-card border border-border transition-all duration-500 hover:border-foreground/30 ${v.link || v.route ? "cursor-pointer" : "cursor-default"}`}
            >
              {/* Top accent bar (brand color, hover only) */}
              <div
                className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-80 transition-opacity duration-500"
                style={{ background: `hsl(${v.color})` }}
              />

              <div className="relative z-10 p-5 sm:p-7 lg:p-8 flex flex-col h-full">
                <div className="flex items-start justify-between mb-5 sm:mb-7">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center bg-secondary border border-border group-hover:scale-105 transition-transform duration-500">
                    <v.icon size={20} className="text-foreground/70 group-hover:text-foreground transition-colors" />
                  </div>
                  <span className="text-[8px] sm:text-[9px] font-display font-semibold tracking-[0.12em] px-2.5 py-1 rounded-full text-foreground/60 bg-secondary border border-border">
                    {v.label}
                  </span>
                </div>

                <h3 className="font-display font-extrabold text-sm sm:text-base tracking-[0.1em] mb-2 sm:mb-3 text-foreground">
                  {v.title}
                </h3>
                <p className="text-muted-foreground text-xs sm:text-sm leading-[1.7] flex-1">{v.desc}</p>

                {(v.link || v.route) && (
                  <div className="mt-5 sm:mt-7 flex items-center gap-2 text-xs font-display font-semibold tracking-[0.1em] text-foreground/50 group-hover:text-accent opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                    <span>Explore</span>
                    <span className="text-sm">→</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
  );
};

export default AboutSection;
