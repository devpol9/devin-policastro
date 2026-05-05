import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
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
  route: string;
}

const tabs: ServiceTab[] = [
  { key: "consulting", num: "01", label: "Consulting", tagline: "Brand strategy & growth advisory.", icon: Briefcase, color: "270 16% 50%", route: "/consulting" },
  { key: "manufacturing", num: "02", label: "Manufacturing", tagline: "Concept to shelf, end to end.", icon: Factory, color: "270 16% 48%", route: "/manufacturing" },
  { key: "content", num: "03", label: "Content", tagline: "Short-form video & storytelling.", icon: Camera, color: "350 22% 55%", route: "/content" },
  { key: "automotive", num: "04", label: "Automotive", tagline: "Wraps, PPF, tuning, builds.", icon: Car, color: "12 45% 48%", route: "/automotive" },
  { key: "financing", num: "05", label: "Financing", tagline: "Capital access & deal structure.", icon: CreditCard, color: "210 22% 50%", route: "/financing" },
  { key: "networking", num: "06", label: "Networking", tagline: "The right intros, on purpose.", icon: Handshake, color: "140 18% 42%", route: "/networking" },
  { key: "fitness", num: "07", label: "Fitness", tagline: "Training & lifestyle coaching.", icon: Dumbbell, color: "24 32% 52%", route: "/fitness" },
];

const ServicesSection = () => {
  const navigate = useNavigate();

  return (
    <section id="services" className="section-padding relative">
      <div className="container-tight">
        <SectionHeader
          numeral="05"
          eyebrow="Services"
          title={<>Let's <span className="italic font-light text-accent">work.</span></>}
          description="Pick a lane. Real services, real outcomes — no agency markup, no middlemen."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {tabs.map((tab, i) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => navigate(tab.route)}
                className="group relative overflow-hidden rounded-lg text-left p-5 sm:p-7 transition-all duration-500 hover:-translate-y-1"
                style={{
                  background: `linear-gradient(145deg, hsl(36 30% 99% / 0.95) 0%, hsl(33 20% 95% / 0.8) 100%)`,
                  border: `1px solid hsl(${tab.color} / 0.18)`,
                  boxShadow: `0 4px 24px hsl(30 20% 30% / 0.06), inset 0 1px 0 hsl(${tab.color} / 0.06)`,
                }}
              >
                {/* Ghost numeral */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-3 -top-6 font-display font-black leading-none tracking-[-0.06em] text-[7rem] sm:text-[9rem] opacity-[0.06] group-hover:opacity-[0.14] transition-opacity duration-500"
                  style={{ color: `hsl(${tab.color})` }}
                >
                  {tab.num}
                </span>

                {/* Top accent bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-[2px] opacity-50 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `linear-gradient(90deg, transparent, hsl(${tab.color}), transparent)` }}
                />

                <div className="relative z-10 flex flex-col gap-5 sm:gap-7 min-h-[160px] sm:min-h-[180px]">
                  <div className="flex items-center justify-between">
                    <div
                      className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110"
                      style={{
                        background: `hsl(${tab.color} / 0.12)`,
                        border: `1px solid hsl(${tab.color} / 0.25)`,
                      }}
                    >
                      <Icon size={18} style={{ color: `hsl(${tab.color})` }} />
                    </div>
                    <ArrowUpRight
                      size={18}
                      className="opacity-30 group-hover:opacity-100 transition-all duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
                      style={{ color: `hsl(${tab.color})` }}
                    />
                  </div>

                  <div className="mt-auto">
                    <h3
                      className="font-display font-black tracking-[-0.03em] leading-[0.95] text-3xl sm:text-4xl mb-2 transition-colors"
                      style={{ color: `hsl(${tab.color})` }}
                    >
                      {tab.label}.
                    </h3>
                    <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                      {tab.tagline}
                    </p>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
