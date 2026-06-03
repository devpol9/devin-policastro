import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Briefcase, Camera, Handshake, Dumbbell,
  ArrowUpRight, Factory, Car, CreditCard,
  type LucideIcon,
} from "lucide-react";
import SectionHeader from "@/components/SectionHeader";


interface ServiceTab {
  key: string;
  num: string;
  label: string;
  tagline: string;
  icon: LucideIcon;
  color: string;
  to: string;
}


const ACCENT = "38 55% 58%";
const tabs: ServiceTab[] = [
  { key: "consulting",    num: "01", label: "Consulting",    tagline: "Brand strategy & growth advisory.",   icon: Briefcase,  color: ACCENT, to: "/consulting" },
  { key: "manufacturing", num: "02", label: "Manufacturing", tagline: "Concept to shelf, end to end.",        icon: Factory,    color: ACCENT, to: "/manufacturing" },
  { key: "content",       num: "03", label: "Content",       tagline: "Short-form video & storytelling.",    icon: Camera,     color: ACCENT, to: "/content" },
  { key: "automotive",    num: "04", label: "Automotive",    tagline: "Wraps, PPF, tuning, builds.",         icon: Car,        color: ACCENT, to: "/automotive" },
  { key: "financing",     num: "05", label: "Financing",     tagline: "Capital access & deal structure.",    icon: CreditCard, color: ACCENT, to: "/financing" },
  { key: "networking",    num: "06", label: "Networking",    tagline: "The right intros, on purpose.",       icon: Handshake,  color: ACCENT, to: "/networking" },
  { key: "fitness",       num: "07", label: "Fitness",       tagline: "Training & lifestyle coaching.",      icon: Dumbbell,   color: ACCENT, to: "/fitness" },
];

const ServicesSection = () => {
  return (
    <section id="services" className="section-padding relative">

      <div className="container-tight">
        <SectionHeader
          numeral="05"
          eyebrow="Services"
          title="Let's work"
          description="Pick a lane. Real services, real outcomes — no agency markup, no middlemen."
        />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4">
          {tabs.map((tab, i) => {
            const Icon = tab.icon;
            const spans = ["md:col-span-12", "md:col-span-7", "md:col-span-5", "md:col-span-6", "md:col-span-6", "md:col-span-7", "md:col-span-5"];
            const span = spans[i] ?? "md:col-span-6";
            const isFeatured = i === 0;

            return (
              <motion.div
                key={tab.key}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.05, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className={span}
              >
                <Link
                  to={tab.to}
                  className={`group relative overflow-hidden flex text-left rounded-2xl bg-card border border-foreground/5 md:hover:border-accent/40 md:hover:bg-card/80 transition-all duration-500 tap-highlight-transparent w-full h-full ${
                    isFeatured ? "p-5 sm:p-8 min-h-[150px] sm:min-h-[200px]" : "p-4 sm:p-7 min-h-[140px] sm:min-h-[200px]"
                  }`}
                >
                  <div className={`relative z-10 flex flex-col h-full w-full ${isFeatured ? "gap-5 sm:gap-10" : "gap-4 sm:gap-7"}`}>
                    <div className="flex items-start justify-between">
                      <div
                        className={`rounded-xl flex items-center justify-center bg-background border border-foreground/5 transition-all duration-500 ${
                          isFeatured ? "w-11 h-11 sm:w-16 sm:h-16 text-accent group-hover:scale-105" : "w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground group-hover:text-accent"
                        }`}
                      >
                        <Icon size={isFeatured ? 22 : 18} strokeWidth={1.5} />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] sm:text-xs text-muted-foreground tabular-nums">{tab.num}</span>
                        <ArrowUpRight
                          size={isFeatured ? 22 : 18}
                          className="text-muted-foreground group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                        />
                      </div>
                    </div>

                    <div className="mt-auto">
                      {isFeatured && (
                        <span className="block text-[10px] sm:text-xs text-muted-foreground mb-2 font-mono">
                          {tab.num} / Flagship service
                        </span>
                      )}
                      <h3
                        className={`font-display font-semibold tracking-tight leading-[1] text-foreground mb-1.5 ${
                          isFeatured ? "text-2xl sm:text-5xl" : "text-xl sm:text-3xl"
                        }`}
                      >
                        {tab.label}
                      </h3>
                      <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                        {tab.tagline}
                      </p>
                      <span className="inline-flex items-center gap-1.5 mt-3 text-[11px] sm:text-xs font-mono tracking-tight text-accent">
                        Explore →
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>

  );
};

export default ServicesSection;
