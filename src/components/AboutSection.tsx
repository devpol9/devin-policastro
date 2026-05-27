import { motion } from "framer-motion";
import { Dumbbell, Droplets, Sparkles, Briefcase, Car, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
        title={<>I just <span className="accent-headline">build.</span></>}
        description="Entrepreneur from Norwood, New Jersey. Leading Impact Zone, building 2THIRTY, manufacturing through Creative Vision, and developing Valence."
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4">
        {verticals.map((v, i) => {
          const spans = ["md:col-span-12", "md:col-span-7", "md:col-span-5", "md:col-span-5", "md:col-span-7", "md:col-span-12"];
          const span = spans[i] ?? "md:col-span-6";
          const isFeatured = i === 0 || i === 5;
          const isClickable = !!(v.link || v.route);

          return (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              className={span}
            >
              <div
                onClick={() => handleCardClick(v)}
                className={`group relative h-full overflow-hidden rounded-2xl sm:rounded-3xl bg-card border border-foreground/5 transition-all duration-500 hover:border-accent/40 hover:bg-card/80 ${
                  isClickable ? "cursor-pointer" : "cursor-default"
                } ${isFeatured ? "p-7 sm:p-10" : "p-6 sm:p-8"}`}
              >
                <div className={`relative z-10 flex h-full ${isFeatured ? "flex-col md:flex-row md:items-center gap-6 md:gap-10" : "flex-col"}`}>
                  {/* Icon + label header */}
                  <div className={`flex items-start justify-between ${isFeatured ? "md:flex-col md:items-start md:justify-start md:gap-6 md:shrink-0" : "mb-6 sm:mb-8"}`}>
                    <div
                      className={`rounded-xl flex items-center justify-center bg-background border border-foreground/5 transition-all duration-500 ${
                        isFeatured ? "w-14 h-14 sm:w-16 sm:h-16 text-accent group-hover:scale-105" : "w-12 h-12 text-muted-foreground group-hover:text-accent"
                      }`}
                    >
                      <v.icon size={isFeatured ? 26 : 22} strokeWidth={1.5} />
                    </div>
                    <span className="text-[10px] sm:text-xs font-mono px-3 py-1.5 rounded-full text-muted-foreground bg-background/60 border border-foreground/5">
                      {v.label}
                    </span>
                  </div>

                  {/* Content */}
                  <div className={`flex flex-col flex-1 ${isFeatured ? "min-w-0" : ""}`}>
                    {isFeatured && (
                      <span className="block text-[10px] sm:text-xs text-muted-foreground mb-2 font-mono">
                        {String(i + 1).padStart(2, "0")} / Anchor venture
                      </span>
                    )}
                    <h3
                      className={`font-display font-semibold tracking-tight text-foreground leading-[1.05] mb-3 ${
                        isFeatured ? "text-3xl sm:text-4xl md:text-5xl" : "text-xl sm:text-2xl"
                      }`}
                    >
                      {v.title}
                    </h3>
                    <p className={`text-muted-foreground leading-relaxed flex-1 ${isFeatured ? "text-sm sm:text-base max-w-2xl" : "text-xs sm:text-sm"}`}>
                      {v.desc}
                    </p>

                    {isClickable && (
                      <div className="mt-6 flex items-center gap-2 text-xs sm:text-sm font-mono text-accent group-hover:gap-3 transition-all">
                        <span>Explore</span>
                        <span>→</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
  );
};

export default AboutSection;
