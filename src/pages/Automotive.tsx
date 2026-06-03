import { useState } from "react";
import SEOHead from "@/components/SEOHead";
import { seoPages } from "@/lib/seoData";
import { ArrowLeft, ArrowRight, Car, Wrench, Paintbrush, Shield, Sun, Gauge, Sparkles, Disc, Sofa, Lightbulb, KeyRound, type LucideIcon } from "lucide-react";
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

type Path = "buy" | "upgrade";

interface OptionItem {
  icon: LucideIcon;
  name: string;
  desc: string;
}

const BUY_OPTIONS: OptionItem[] = [
  { icon: KeyRound, name: "New", desc: "Brand new — dealer access, allocations, custom orders." },
  { icon: Car, name: "Used / Pre-owned", desc: "Certified, exotic, or daily — sourced and vetted." },
  { icon: Sparkles, name: "Lease", desc: "Best lease deals and pull-aheads through my network." },
  { icon: Gauge, name: "Trade-in / Sell", desc: "Get top dollar for your current vehicle." },
];

const UPGRADE_OPTIONS: OptionItem[] = [
  { icon: Paintbrush, name: "Vinyl Wrap", desc: "Full or partial — gloss, matte, satin, chrome, color-shift." },
  { icon: Shield, name: "Paint Protection Film", desc: "Self-healing PPF — full front, full body, or custom." },
  { icon: Sparkles, name: "Ceramic Coating", desc: "Paint correction + pro-grade ceramic. Years of shine." },
  { icon: Sun, name: "Window Tint", desc: "Ceramic + carbon films. 99% UV block." },
  { icon: Gauge, name: "Tuning & Performance", desc: "ECU, downpipes, exhaust. Dyno-tested." },
  { icon: Disc, name: "Wheels & Powder Coat", desc: "Wheels, calipers, brakes — OEM or custom." },
  { icon: Sofa, name: "Custom Interior", desc: "Leather, Alcantara, stitching, headliner." },
  { icon: Lightbulb, name: "Styling & Lighting", desc: "Aero, splitters, lights, full exterior builds." },
];

const Automotive = () => {
  const [path, setPath] = useState<Path | null>(null);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>("");

  const openInquiry = (optionName: string) => {
    setSelectedOption(optionName);
    setInquiryOpen(true);
  };

  const isBuy = path === "buy";
  const options = isBuy ? BUY_OPTIONS : UPGRADE_OPTIONS;

  return (
    <div className="min-h-screen bg-background overflow-x-hidden noise-overlay">
      <SEOHead {...seoPages["/automotive"]} canonicalPath="/automotive" jsonLd={[getServiceSchema("automotive"), getFAQSchema("automotive")]} />
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
            numeral="04"
            eyebrow="Automotive"
            accentColor={COLOR}
            title={<>Automotive <span className="italic font-light" style={{ color: `hsl(${COLOR})` }}>& custom builds.</span></>}
            description="Tell me what you need — I'll connect you with the right people and make sure you're taken care of."
          />

          {/* Step 1: Path picker */}
          <div className="mb-8 sm:mb-10">
            <p className="font-mono text-[10px] text-foreground/50 mb-3 tracking-tight">[ Step 1 ] What are you looking for?</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {([
                { id: "buy" as Path, icon: Car, label: "Buy a car", sub: "New, used, lease, or trade-in." },
                { id: "upgrade" as Path, icon: Wrench, label: "Upgrade my car", sub: "Wraps, PPF, tuning, interior, more." },
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
                  [ Step 2 ] {isBuy ? "Pick a path" : "Pick what to upgrade"}
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
                        <div
                          className="w-9 h-9 shrink-0 rounded-lg flex items-center justify-center bg-background border border-border/40 text-muted-foreground md:group-hover:text-accent transition-colors"
                        >
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

          <ServiceDeep slug="automotive" />
          <RelatedServices current="automotive" />
        </div>
      </section>

      <Footer />
      <MobileBottomNav />

      <ServiceInquiryDialog
        open={inquiryOpen}
        onOpenChange={setInquiryOpen}
        title={isBuy ? "Buy a car" : "Upgrade inquiry"}
        subtitle={
          isBuy
            ? "Tell me what you're shopping for and I'll connect you with the right dealer or specialist."
            : "Tell me what you're working with and I'll get you connected to the right shop."
        }
        color={COLOR}
        emailSubject={`Automotive — ${isBuy ? "Buy" : "Upgrade"}${selectedOption ? ` — ${selectedOption}` : ""}`}
        fields={
          isBuy
            ? [
                {
                  key: "buy_type",
                  label: "Looking for",
                  placeholder: "Select…",
                  type: "select",
                  options: BUY_OPTIONS.map((o) => o.name),
                  required: true,
                  defaultValue: selectedOption && BUY_OPTIONS.some((o) => o.name === selectedOption) ? selectedOption : undefined,
                },
                { key: "vehicle", label: "Make / model (or wishlist)", placeholder: "2025 Porsche 911, BMW M4, etc.", type: "input", required: true },
                { key: "budget", label: "Budget range", placeholder: "$40K–$60K, $60K–$100K, $100K+…", type: "input" },
                { key: "trade", label: "Trade-in?", placeholder: "Year / make / model — or none", type: "input" },
                { key: "timeline", label: "Timeline", placeholder: "ASAP, 30 days, flexible…", type: "input" },
              ]
            : [
                {
                  key: "service",
                  label: "Which upgrade?",
                  placeholder: "Select…",
                  type: "select",
                  options: ["Not sure yet", ...UPGRADE_OPTIONS.map((o) => o.name)],
                  required: true,
                  defaultValue: selectedOption && UPGRADE_OPTIONS.some((o) => o.name === selectedOption) ? selectedOption : undefined,
                },
                { key: "vehicle", label: "Vehicle (year / make / model)", placeholder: "2024 BMW M4", type: "input", required: true },
                { key: "details", label: "What are you looking for?", placeholder: "Full body PPF, color change wrap, tune…", type: "textarea", rows: 3, required: true },
                { key: "budget", label: "Budget range", placeholder: "$1K–$3K, $3K–$5K, $5K+…", type: "input" },
                { key: "timeline", label: "Timeline", placeholder: "ASAP, within a month, flexible…", type: "input" },
              ]
        }
      />
    </div>
  );
};

export default Automotive;
