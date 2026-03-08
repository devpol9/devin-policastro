import { motion } from "framer-motion";
import { Dumbbell, Droplets, Sparkles, Briefcase, Car, Video } from "lucide-react";
import TiltCard from "@/components/effects/TiltCard";
import TextScramble from "@/components/effects/TextScramble";

const verticals = [
  { icon: Dumbbell, title: "FITNESS", desc: "Impact Zone Fitness — Bergen County's premier 51,000 sq ft facility in Norwood, NJ. 100+ machines, cold plunges, infrared saunas, hot yoga, red light therapy, basketball court, and 5K sports turf.", link: "https://impactzonenj.com" },
  { icon: Droplets, title: "HYDRATION", desc: "2THIRTY — The only 5-in-1 hydration+ mixer. Zero sugar, zero calories. NAC, L-Glutathione, Milk Thistle, Ginseng Root. 4.9 stars from 3,500+ reviews.", link: "https://drink2thirty.com" },
  { icon: Briefcase, title: "MANUFACTURING", desc: "Impactful Brands — custom apparel, jump ropes, mini bands, wrist wraps, blow-up tents, and more. Premium fitness products from concept to delivery.", link: "#" },
  { icon: Sparkles, title: "SBS", desc: "Strategic business solutions — connecting dots others can't see. Consulting, partnerships, and growth strategies for brands ready to level up.", link: "#" },
  { icon: Car, title: "AUTOMOTIVE", desc: "Builds, mods, and the car culture that fuels me. Always something new in the garage.", link: "#" },
  { icon: Video, title: "CONTENT", desc: "Documenting the grind on Instagram, TikTok, and YouTube — @devinpolicastro. Real talk, real results, no filter.", link: "https://instagram.com/devinpolicastro" },
];

const AboutSection = () => (
  <section id="about" className="section-padding relative overflow-hidden">
    <div className="absolute top-0 right-0 w-1/2 h-full opacity-[0.015]"
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
          I Don't Pick
          <br />
          One Lane.
          <br />
          <span className="text-muted-foreground">I Build the</span>
          <br />
          <span className="gradient-text">Highway.</span>
        </h2>
        <p className="text-muted-foreground max-w-md text-sm sm:text-base leading-[1.8]">
          Entrepreneur from Norwood, New Jersey. Leading Impact Zone, building 2THIRTY, 
          manufacturing through Impactful Brands and SBS.
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
              <a
                href={v.link}
                target={v.link.startsWith("http") ? "_blank" : undefined}
                rel={v.link.startsWith("http") ? "noopener noreferrer" : undefined}
                className="glass-card p-5 sm:p-7 lg:p-8 h-full block group relative overflow-hidden cursor-pointer hover:border-primary/20 transition-all duration-700"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative z-10">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary/8 flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-primary/15 transition-all duration-500 group-hover:scale-105">
                    <v.icon size={18} className="text-primary/80 group-hover:text-primary transition-colors duration-500" />
                  </div>
                  <h3 className="font-display font-bold text-xs sm:text-sm tracking-[0.15em] mb-2 sm:mb-3">
                    <TextScramble text={v.title} delay={i * 200 + 500} />
                  </h3>
                  <p className="text-muted-foreground text-xs sm:text-sm leading-[1.7]">{v.desc}</p>
                  <div className="mt-4 sm:mt-6 flex items-center gap-2 text-primary/70 text-xs font-display font-medium tracking-wider uppercase opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                    <span>Explore</span>
                    <span className="text-sm">→</span>
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