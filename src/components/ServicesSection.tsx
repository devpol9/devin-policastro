import { useState } from "react";
import { motion } from "framer-motion";
import {
  Briefcase, Camera, Handshake, Dumbbell,
  ArrowUpRight, Factory, Car, CreditCard,
  type LucideIcon,
} from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import ServiceInquiryDialog from "@/components/services/ServiceInquiryDialog";

interface InquiryField {
  key: string;
  label: string;
  placeholder: string;
  type: "input" | "textarea" | "select";
  required?: boolean;
  rows?: number;
  options?: string[];
}

interface ServiceTab {
  key: string;
  num: string;
  label: string;
  tagline: string;
  icon: LucideIcon;
  color: string;
  subtitle: string;
  fields: InquiryField[];
}

const tabs: ServiceTab[] = [
  {
    key: "consulting", num: "01", label: "Consulting", tagline: "Brand strategy & growth advisory.", icon: Briefcase, color: "270 16% 50%",
    subtitle: "Tell me what you're building. I'll tell you what's working and what to stop wasting time on.",
    fields: [
      { key: "company", label: "Company / brand", placeholder: "What you're building", type: "input", required: true },
      { key: "stage", label: "Stage", placeholder: "Select…", type: "select", options: ["Idea", "Pre-launch", "Early revenue", "Scaling", "Established"], required: true },
      { key: "goal", label: "What do you need help with?", placeholder: "Brand positioning, growth strategy, scaling ops…", type: "textarea", rows: 4, required: true },
    ],
  },
  {
    key: "manufacturing", num: "02", label: "Manufacturing", tagline: "Concept to shelf, end to end.", icon: Factory, color: "270 16% 48%",
    subtitle: "Apparel, fitness gear, custom products. From sketch to shipped — I handle the supply chain.",
    fields: [
      { key: "product", label: "Product type", placeholder: "Apparel, jump ropes, mini bands, tents…", type: "input", required: true },
      { key: "quantity", label: "Estimated quantity", placeholder: "100, 500, 1,000+", type: "input" },
      { key: "details", label: "Project details", placeholder: "Materials, branding, deadline, packaging…", type: "textarea", rows: 4, required: true },
    ],
  },
  {
    key: "content", num: "03", label: "Content", tagline: "Short-form video & storytelling.", icon: Camera, color: "350 22% 55%",
    subtitle: "I'll connect you with the team that makes content that actually converts — not just views.",
    fields: [
      { key: "type", label: "Content type", placeholder: "Select…", type: "select", options: ["Short-form video (Reels/TikTok)", "Long-form (YouTube)", "Brand campaign", "Personal brand build", "Not sure"], required: true },
      { key: "audience", label: "Who are you trying to reach?", placeholder: "Founders, fitness, e-commerce buyers…", type: "input" },
      { key: "details", label: "What's the goal?", placeholder: "Build audience, drive sales, brand awareness…", type: "textarea", rows: 3, required: true },
    ],
  },
  {
    key: "automotive", num: "04", label: "Automotive", tagline: "Wraps, PPF, tuning, builds.", icon: Car, color: "12 45% 48%",
    subtitle: "Tell me what you need — I'll connect you with the right people and make sure you're taken care of.",
    fields: [
      { key: "service", label: "What are you looking for?", placeholder: "Select…", type: "select", options: ["Buy a car", "Vinyl wrap", "Paint protection film", "Ceramic coating", "Window tint", "Tuning", "Wheels", "Custom interior", "Not sure"], required: true },
      { key: "vehicle", label: "Vehicle (year / make / model)", placeholder: "2024 BMW M4", type: "input", required: true },
      { key: "details", label: "Details", placeholder: "Color, finish, timeline, budget…", type: "textarea", rows: 3 },
    ],
  },
  {
    key: "financing", num: "05", label: "Financing", tagline: "Capital access & deal structure.", icon: CreditCard, color: "210 22% 50%",
    subtitle: "Getting funded is half the battle. I'll point you to the right capital partner.",
    fields: [
      { key: "purpose", label: "What's the capital for?", placeholder: "Select…", type: "select", options: ["Real estate", "Business growth", "Equipment", "Inventory", "Working capital", "Other"], required: true },
      { key: "amount", label: "Amount needed", placeholder: "$50K, $250K, $1M+…", type: "input", required: true },
      { key: "details", label: "Tell me about the deal", placeholder: "Timeline, use of funds, current revenue…", type: "textarea", rows: 3, required: true },
    ],
  },
  {
    key: "networking", num: "06", label: "Networking", tagline: "The right intros, on purpose.", icon: Handshake, color: "140 18% 42%",
    subtitle: "Years of relationships across Bergen County, the tri-state, and beyond. Tell me who you need to meet.",
    fields: [
      { key: "looking_for", label: "Who do you want to meet?", placeholder: "Investors, gym owners, manufacturers, founders…", type: "input", required: true },
      { key: "why", label: "Why — what's the play?", placeholder: "What you're working on and why this intro matters", type: "textarea", rows: 4, required: true },
    ],
  },
  {
    key: "fitness", num: "07", label: "Fitness", tagline: "Training & lifestyle coaching.", icon: Dumbbell, color: "24 32% 52%",
    subtitle: "Impact Zone Fitness or 1-on-1 coaching — let's figure out what you actually need.",
    fields: [
      { key: "interest", label: "What are you interested in?", placeholder: "Select…", type: "select", options: ["Impact Zone membership", "1-on-1 training", "Lifestyle / nutrition coaching", "Group / corporate", "Just exploring"], required: true },
      { key: "goal", label: "What's your goal?", placeholder: "Lose 20 lbs, build muscle, train for event…", type: "textarea", rows: 3, required: true },
    ],
  },
];

const ServicesSection = () => {
  const [active, setActive] = useState<ServiceTab | null>(null);

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
                onClick={() => setActive(tab)}
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
                      Start inquiry →
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
