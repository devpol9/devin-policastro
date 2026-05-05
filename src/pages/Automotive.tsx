import { useState } from "react";
import SEOHead from "@/components/SEOHead";
import { seoPages } from "@/lib/seoData";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Paintbrush, Shield, Sun, Gauge, Sparkles, Car, Disc, Sofa, Lightbulb, type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import FloatingNav from "@/components/FloatingNav";
import MobileBottomNav from "@/components/MobileBottomNav";
import Footer from "@/components/Footer";
import ServiceInquiryDialog from "@/components/services/ServiceInquiryDialog";
import SectionHeader from "@/components/SectionHeader";

const COLOR = "12 45% 48%";

interface AutoService {
  icon: LucideIcon;
  name: string;
  desc: string;
  detail: string;
  link: string;
}

const autoServices: AutoService[] = [
  {
    icon: Paintbrush,
    name: "Vinyl Wrap",
    desc: "Full or partial wraps in any color, finish, or texture.",
    detail: "Gloss, matte, satin, chrome, color-shift — any look you want. Full body or accents.",
    link: "https://nextgenautonj.com/vinyl-wrap/",
  },
  {
    icon: Shield,
    name: "Paint Protection Film",
    desc: "Invisible armor against scratches, chips, and damage.",
    detail: "Self-healing PPF from XPEL and 3M. Full front, full body, or custom coverage.",
    link: "https://nextgenautonj.com/paint-protection-film/",
  },
  {
    icon: Sparkles,
    name: "Ceramic Coating",
    desc: "Nano-coating with paint correction for lasting shine.",
    detail: "Multi-stage paint correction followed by professional-grade ceramic for years of protection.",
    link: "https://nextgenautonj.com/ceramic-coating/",
  },
  {
    icon: Sun,
    name: "Window Tinting",
    desc: "Premium films — 99% UV block, privacy, sleek look.",
    detail: "Ceramic and carbon films. Legal compliance guidance included. Windshield strips available.",
    link: "https://nextgenautonj.com/windows-tints/",
  },
  {
    icon: Gauge,
    name: "Tuning & Performance",
    desc: "ECU remapping, downpipes, exhaust. More power.",
    detail: "Custom tunes for BMW, Audi, Mercedes, and more. Dyno-tested. Downpipes, intakes, exhaust systems.",
    link: "https://nextgenautonj.com/tuning-and-performance/",
  },
  {
    icon: Disc,
    name: "Powder Coating",
    desc: "Wheels, calipers, metal surfaces. Durable finish.",
    detail: "OEM or custom colors. Brake calipers, wheels, engine covers, suspension components.",
    link: "https://nextgenautonj.com/",
  },
  {
    icon: Sofa,
    name: "Custom Interiors",
    desc: "Luxury upholstery, stitching, trim, and materials.",
    detail: "Full leather swaps, Alcantara, custom stitching patterns, headliner wraps, trim upgrades.",
    link: "https://nextgenautonj.com/",
  },
  {
    icon: Lightbulb,
    name: "Exterior Styling",
    desc: "Aero kits, spoilers, diffusers, custom lighting.",
    detail: "Carbon fiber lips, splitters, diffusers, custom headlight and taillight builds.",
    link: "https://nextgenautonj.com/",
  },
  {
    icon: Car,
    name: "Full Build / Customization",
    desc: "Complete builds — wheels, suspension, body, interior.",
    detail: "End-to-end project management. Wheels, coilovers, aero, paint, interior — the whole vision.",
    link: "https://nextgenautonj.com/",
  },
];

const Automotive = () => {
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const [generalInquiryOpen, setGeneralInquiryOpen] = useState(false);

  const openInquiry = (serviceName: string) => {
    setSelectedService(serviceName);
    setInquiryOpen(true);
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden noise-overlay">
      <SEOHead {...seoPages["/automotive"]} canonicalPath="/automotive" />
      <FloatingNav />

      <section className="section-padding pt-32 sm:pt-40">
        <div className="container-tight">
          <Link
            to="/#services"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-display mb-8"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>

          <SectionHeader
            as="h1"
            numeral="04"
            eyebrow="Automotive"
            accentColor={COLOR}
            title={<>Automotive <span className="italic font-light" style={{ color: `hsl(${COLOR})` }}>& custom builds.</span></>}
            description="Builds, mods, and the car culture that fuels me. Always something new in the garage. Tell me what you need — I'll connect you with the right people and make sure you're taken care of."
          />
          <div className="mb-8 sm:mb-12">
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setGeneralInquiryOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-display font-semibold transition-all duration-300 hover:scale-[1.02]"
                style={{
                  background: `hsl(${COLOR})`,
                  color: `hsl(36 30% 98%)`,
                }}
              >
                General inquiry
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Services Grid — dense, neutral, premium */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 mb-12">
            {autoServices.map((service, i) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.name}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.04, duration: 0.4 }}
                  className="group relative rounded-xl bg-card border border-border/60 hover:border-foreground/20 transition-colors duration-300"
                >
                  <div className="p-4 sm:p-5">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center shrink-0 group-hover:bg-foreground/[0.06] transition-colors">
                        <Icon size={15} className="text-foreground/70 group-hover:text-foreground transition-colors" strokeWidth={1.6} />
                      </div>
                      <div className="flex-1 min-w-0 pt-0.5">
                        <h3 className="font-display font-bold text-sm sm:text-[15px] leading-tight text-foreground">
                          {service.name}
                        </h3>
                      </div>
                    </div>

                    <p className="text-muted-foreground text-[12px] sm:text-[13px] leading-[1.55] mb-4">
                      {service.desc}
                    </p>

                    <button
                      onClick={() => openInquiry(service.name)}
                      className="w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-lg text-[11px] sm:text-xs font-display font-semibold tracking-wide bg-foreground text-background hover:bg-foreground/90 transition-colors"
                    >
                      <span>Inquire</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      <Footer />
      <MobileBottomNav />

      {/* Service-specific inquiry */}
      <ServiceInquiryDialog
        open={inquiryOpen}
        onOpenChange={setInquiryOpen}
        title={`${selectedService} Inquiry`}
        subtitle="Tell me what you need and I'll get you taken care of."
        color={COLOR}
        emailSubject={`Automotive Inquiry: ${selectedService}`}
        fields={[
          { key: "vehicle", label: "Vehicle (Year / Make / Model)", placeholder: "2024 BMW M4", type: "input", required: true },
          { key: "service-details", label: "What are you looking for?", placeholder: "Full body PPF, color change wrap, ceramic...", type: "textarea", rows: 2, required: true },
          { key: "budget", label: "Budget range", placeholder: "$1K-$3K, $3K-$5K, $5K+...", type: "input" },
          { key: "timeline", label: "When do you need this done?", placeholder: "ASAP, within a month, flexible...", type: "input" },
        ]}
      />

      {/* General inquiry */}
      <ServiceInquiryDialog
        open={generalInquiryOpen}
        onOpenChange={setGeneralInquiryOpen}
        title="Automotive Inquiry"
        subtitle="Tell me what you're working with and I'll get you connected."
        color={COLOR}
        emailSubject="General Automotive Inquiry"
        fields={[
          { key: "vehicle", label: "Vehicle (Year / Make / Model)", placeholder: "2024 BMW M4", type: "input", required: true },
          { key: "services", label: "What services are you interested in?", placeholder: "Wrap, PPF, tuning, full build...", type: "textarea", rows: 2, required: true },
          { key: "budget", label: "Budget range", placeholder: "$1K-$3K, $3K-$5K, $5K+...", type: "input" },
          { key: "timeline", label: "Timeline", placeholder: "ASAP, within a month, flexible...", type: "input" },
        ]}
      />
    </div>
  );
};

export default Automotive;
