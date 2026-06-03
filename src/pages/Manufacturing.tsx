import { useState } from "react";
import SEOHead from "@/components/SEOHead";
import { seoPages } from "@/lib/seoData";
import { ArrowLeft, ArrowRight, Factory, Wrench, Package, Lightbulb, Shirt, Dumbbell, ShoppingBag, Crown, FlaskConical, Sparkles, type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import FloatingNav from "@/components/FloatingNav";
import MobileBottomNav from "@/components/MobileBottomNav";
import Footer from "@/components/Footer";
import ServiceInquiryDialog from "@/components/services/ServiceInquiryDialog";
import SectionHeader from "@/components/SectionHeader";
import ServiceDeep from "@/components/services/ServiceDeep";
import RelatedServices from "@/components/services/RelatedServices";
import { getFAQSchema, getServiceSchema } from "@/lib/serviceContent";
import { motion } from "framer-motion";

const COLOR = "24 38% 56%";

type Path = "develop" | "produce";

interface OptionItem {
  icon: LucideIcon;
  name: string;
  desc: string;
}

const DEVELOP_OPTIONS: OptionItem[] = [
  { icon: Lightbulb, name: "Product Ideation & R&D", desc: "Napkin sketch to finished product — full development." },
  { icon: FlaskConical, name: "Custom Formulation", desc: "Supplements, beverages, wellness — built from scratch." },
  { icon: Wrench, name: "Prototype & Sampling", desc: "Functional samples and pre-production runs." },
  { icon: Crown, name: "Brand Development", desc: "Packaging, compliance, go-to-market, and launch support." },
];

const PRODUCE_OPTIONS: OptionItem[] = [
  { icon: Shirt, name: "Custom Apparel & Accessories", desc: "T-shirts, hoodies, hats, bags — branded merch." },
  { icon: Dumbbell, name: "Gym & Fitness Equipment", desc: "Jump ropes, bands, wrist wraps, custom gear." },
  { icon: Package, name: "Private & White Label", desc: "Your brand, our production. Ready-to-sell." },
  { icon: ShoppingBag, name: "Ecom & Amazon Products", desc: "FBA, DTC, and marketplace-ready production." },
  { icon: Factory, name: "Full-Scale Manufacturing", desc: "Sourcing, production runs, and fulfillment." },
  { icon: Sparkles, name: "Reorder / Scale Up", desc: "Already producing? Let's run bigger and cheaper." },
];

const Manufacturing = () => {
  const [path, setPath] = useState<Path | null>(null);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>("");

  const openInquiry = (optionName: string) => {
    setSelectedOption(optionName);
    setInquiryOpen(true);
  };

  const isDevelop = path === "develop";
  const options = isDevelop ? DEVELOP_OPTIONS : PRODUCE_OPTIONS;

  return (
    <div className="min-h-screen bg-background overflow-x-hidden noise-overlay">
      <SEOHead {...seoPages["/manufacturing"]} canonicalPath="/manufacturing" jsonLd={[getServiceSchema("manufacturing"), getFAQSchema("manufacturing")]} />
      <FloatingNav />

      <section className="section-padding pt-32 sm:pt-40">
        <div className="container-tight">
          <Link
            to="/#services"
            className="inline-flex items-center gap-2 text-muted-foreground md:hover:text-foreground transition-colors text-sm font-display mb-8"
          >
            <ArrowLeft size={16} />
            Back to home
          </Link>

          <SectionHeader
            as="h1"
            numeral="02"
            eyebrow="Manufacturing"
            accentColor={COLOR}
            title={<>Creative Vision <span className="italic font-light" style={{ color: `hsl(${COLOR})` }}>manufacturing.</span></>}
            description="From concept to shelf — apparel, accessories, equipment, supplements, and ecom-ready products. Tell me what you're building."
          />

          {/* Step 1: Path picker */}
          <div className="mb-8 sm:mb-10">
            <p className="font-mono text-[10px] text-foreground/50 mb-3 tracking-tight">[ Step 1 ] What stage are you at?</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {([
                { id: "develop" as Path, icon: Lightbulb, label: "Develop a new product", sub: "Idea, formulation, prototype, brand." },
                { id: "produce" as Path, icon: Factory, label: "Manufacture & scale", sub: "Apparel, equipment, private label, ecom." },
              ]).map((p) => {
                const Icon = p.icon;
                const active = path === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => { setPath(p.id); }}
                    className={`group text-left rounded-2xl p-5 sm:p-6 border transition-all tap-highlight-transparent ${
                      active
                        ? "bg-card border-transparent"
                        : "bg-card/40 border-border/40 md:hover:border-accent/40 md:hover:bg-card/70"
                    }`}
                    style={active ? { borderColor: `hsl(${COLOR} / 0.6)`, boxShadow: `0 0 0 1px hsl(${COLOR} / 0.25)` } : undefined}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center border border-border/50 bg-background"
                        style={active ? { color: `hsl(${COLOR})`, borderColor: `hsl(${COLOR} / 0.4)` } : undefined}
                      >
                        <Icon size={20} strokeWidth={1.6} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-display font-semibold text-base sm:text-lg leading-tight">{p.label}</h3>
                        <p className="text-muted-foreground text-xs sm:text-sm mt-0.5">{p.sub}</p>
                      </div>
                      <ArrowRight size={16} className={`transition-all ${active ? "translate-x-0.5" : "text-muted-foreground"}`} style={active ? { color: `hsl(${COLOR})` } : undefined} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Options */}
          {path && (
            <motion.div
              key={path}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="mb-12 sm:mb-16"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="font-mono text-[10px] text-foreground/50 tracking-tight">
                  [ Step 2 ] {isDevelop ? "Pick what you need" : "Pick what to produce"}
                </p>
                <button
                  onClick={() => openInquiry("Not sure yet")}
                  className="text-[11px] font-display text-muted-foreground md:hover:text-foreground transition-colors underline-offset-4 md:hover:underline"
                >
                  Not sure? Just talk to me →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                {options.map((opt, i) => {
                  const Icon = opt.icon;
                  return (
                    <motion.button
                      key={opt.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.4 }}
                      onClick={() => openInquiry(opt.name)}
                      className="group relative text-left rounded-xl p-4 sm:p-5 bg-card border border-border/40 md:hover:border-accent/40 transition-all tap-highlight-transparent"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 shrink-0 rounded-lg flex items-center justify-center bg-background border border-border/40 text-muted-foreground md:group-hover:text-accent transition-colors">
                          <Icon size={16} strokeWidth={1.6} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="font-display font-semibold text-sm sm:text-base leading-tight">{opt.name}</h4>
                            <ArrowRight size={14} className="text-muted-foreground/60 md:group-hover:text-accent md:group-hover:translate-x-0.5 transition-all" />
                          </div>
                          <p className="text-muted-foreground text-xs leading-relaxed mt-1">{opt.desc}</p>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          <ServiceDeep slug="manufacturing" />
          <RelatedServices current="manufacturing" />
        </div>
      </section>

      <Footer />
      <MobileBottomNav />

      <ServiceInquiryDialog
        open={inquiryOpen}
        onOpenChange={setInquiryOpen}
        title={isDevelop ? "Develop a new product" : "Manufacturing inquiry"}
        subtitle={
          isDevelop
            ? "Tell me about your idea and I'll get you connected to the right team to build it."
            : "Tell me what you want to produce and I'll line up the right factory and partners."
        }
        color={COLOR}
        emailSubject={`Manufacturing — ${isDevelop ? "Develop" : "Produce"}${selectedOption ? ` — ${selectedOption}` : ""}`}
        fields={
          isDevelop
            ? [
                {
                  key: "service",
                  label: "What do you need?",
                  placeholder: "Select…",
                  type: "select",
                  options: ["Not sure yet", ...DEVELOP_OPTIONS.map((o) => o.name)],
                  required: true,
                  defaultValue: selectedOption && DEVELOP_OPTIONS.some((o) => o.name === selectedOption) ? selectedOption : undefined,
                },
                { key: "product", label: "What are you building?", placeholder: "Supplement, beverage, fitness product, apparel…", type: "textarea", rows: 3, required: true },
                { key: "stage", label: "Current stage", placeholder: "Just an idea, sketch, formulation, prototype…", type: "input", required: true },
                { key: "budget", label: "R&D budget", placeholder: "$5K, $10K–$25K, $25K+…", type: "input" },
                { key: "timeline", label: "Target launch", placeholder: "3 months, 6 months, flexible…", type: "input" },
              ]
            : [
                {
                  key: "service",
                  label: "What do you need produced?",
                  placeholder: "Select…",
                  type: "select",
                  options: ["Not sure yet", ...PRODUCE_OPTIONS.map((o) => o.name)],
                  required: true,
                  defaultValue: selectedOption && PRODUCE_OPTIONS.some((o) => o.name === selectedOption) ? selectedOption : undefined,
                },
                { key: "product", label: "Product details", placeholder: "Hoodies, jump ropes, private-label supplement…", type: "textarea", rows: 3, required: true },
                { key: "volume", label: "Estimated volume / MOQ", placeholder: "500, 5,000, 50,000+…", type: "input", required: true },
                { key: "budget", label: "Budget range", placeholder: "$5K, $10K–$25K, $25K+…", type: "input" },
                { key: "timeline", label: "Target launch", placeholder: "3 months, 6 months, ASAP…", type: "input" },
              ]
        }
      />
    </div>
  );
};

export default Manufacturing;
