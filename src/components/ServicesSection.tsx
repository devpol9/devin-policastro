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


const tabs: ServiceTab[] = [
  { key: "consulting",    num: "01", label: "Consulting",    tagline: "Brand strategy & growth advisory.",   icon: Briefcase,  color: "270 16% 50%", to: "/consulting" },
  { key: "manufacturing", num: "02", label: "Manufacturing", tagline: "Concept to shelf, end to end.",        icon: Factory,    color: "270 16% 48%", to: "/manufacturing" },
  { key: "content",       num: "03", label: "Content",       tagline: "Short-form video & storytelling.",    icon: Camera,     color: "350 22% 55%", to: "/content" },
  { key: "automotive",    num: "04", label: "Automotive",    tagline: "Wraps, PPF, tuning, builds.",         icon: Car,        color: "12 45% 48%",  to: "/automotive" },
  { key: "financing",     num: "05", label: "Financing",     tagline: "Capital access & deal structure.",    icon: CreditCard, color: "210 22% 50%", to: "/financing" },
  { key: "networking",    num: "06", label: "Networking",    tagline: "The right intros, on purpose.",       icon: Handshake,  color: "140 18% 42%", to: "/networking" },
  { key: "fitness",       num: "07", label: "Fitness",       tagline: "Training & lifestyle coaching.",      icon: Dumbbell,   color: "24 32% 52%",  to: "/fitness" },
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
              <motion.button
                key={tab.key}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.05, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => {
                  if (tab.key === "fitness") {
                    document.getElementById("training")?.scrollIntoView({ behavior: "smooth", block: "start" });
                  } else {
                    setActive(tab);
                  }
                }}
                className={`group relative overflow-hidden text-left rounded-2xl sm:rounded-3xl bg-card border border-foreground/5 md:hover:border-accent/40 md:hover:bg-card/80 transition-all duration-500 tap-highlight-transparent ${span} ${
                  isFeatured ? "p-7 sm:p-10 min-h-[200px]" : "p-6 sm:p-8 min-h-[180px] sm:min-h-[220px]"
                }`}
              >
                <div className={`relative z-10 flex flex-col h-full ${isFeatured ? "gap-8 sm:gap-12" : "gap-6 sm:gap-8"}`}>
                  <div className="flex items-start justify-between">
                    <div
                      className={`rounded-xl flex items-center justify-center bg-background border border-foreground/5 transition-all duration-500 ${
                        isFeatured ? "w-14 h-14 sm:w-16 sm:h-16 text-accent group-hover:scale-105" : "w-12 h-12 text-muted-foreground group-hover:text-accent"
                      }`}
                    >
                      <Icon size={isFeatured ? 26 : 22} strokeWidth={1.5} />
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
                      className={`font-display font-semibold tracking-tight leading-[1] text-foreground mb-2 ${
                        isFeatured ? "text-3xl sm:text-5xl" : "text-2xl sm:text-3xl"
                      }`}
                    >
                      {tab.label}
                    </h3>
                    <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                      {tab.tagline}
                    </p>
                    <span
                      className="inline-flex items-center gap-1.5 mt-4 text-[11px] sm:text-xs font-mono tracking-tight"
                      style={{ color: `hsl(${tab.color})` }}
                    >
                      {tab.key === "fitness" ? "See what we offer →" : "Start inquiry →"}
                    </span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      <ServiceInquiryDialog
        open={!!active}
        onOpenChange={(o) => { if (!o) setActive(null); }}
        title={active ? `${active.label} inquiry` : ""}
        subtitle={active?.subtitle ?? ""}
        color={active?.color ?? "24 32% 52%"}
        emailSubject={active ? `${active.label} — Inquiry` : "Inquiry"}
        fields={active?.fields ?? []}
      />
    </section>
  );
};

export default ServicesSection;
