import { useState } from "react";
import SEOHead from "@/components/SEOHead";
import { seoPages } from "@/lib/seoData";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Paintbrush, Shield, Sun, Gauge, Sparkles, Car, Disc, Sofa, Lightbulb, type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import FloatingNav from "@/components/FloatingNav";
import MobileBottomNav from "@/components/MobileBottomNav";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/effects/CustomCursor";
import MouseSpotlight from "@/components/effects/MouseSpotlight";
import ServiceInquiryDialog from "@/components/services/ServiceInquiryDialog";

const COLOR = "0 85% 60%";

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
      <CustomCursor />
      <MouseSpotlight />
      <FloatingNav />

      <section className="section-padding pt-32 sm:pt-40">
        <div className="container-tight">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-display mb-8"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 sm:mb-16"
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 60 }}
              transition={{ duration: 1 }}
              className="h-px mb-8 sm:mb-10"
              style={{ background: `hsl(${COLOR} / 0.6)` }}
            />
            <p className="font-display text-[10px] tracking-[0.5em] uppercase mb-4 sm:mb-5" style={{ color: `hsl(${COLOR})` }}>
              [ Automotive ]
            </p>
            <h1 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-7xl leading-[0.88] mb-6 sm:mb-8 tracking-[-0.02em]">
              Automotive
              <br />
              <span className="text-muted-foreground">& Custom Builds.</span>
            </h1>
            <p className="text-muted-foreground max-w-xl text-sm sm:text-base leading-[1.8] mb-6">
              Builds, mods, and the car culture that fuels me. Always something new in the garage.
              Tell me what you need — I'll connect you with the right people and make sure you're taken care of.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setGeneralInquiryOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-display font-semibold transition-all duration-300 hover:scale-[1.02]"
                style={{
                  background: `hsl(${COLOR})`,
                  color: `hsl(225 25% 3%)`,
                }}
              >
                General Inquiry
                <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>

          {/* Services Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-12">
            {autoServices.map((service, i) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.06 }}
                  className="group relative overflow-hidden rounded-lg transition-all duration-500"
                  style={{
                    background: `linear-gradient(145deg, hsl(225 20% 7% / 0.95) 0%, hsl(225 20% 5% / 0.8) 100%)`,
                    border: `1px solid hsl(${COLOR} / 0.15)`,
                  }}
                >
                  {/* Top glow line */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[2px] opacity-40 group-hover:opacity-80 transition-opacity duration-500"
                    style={{ background: `linear-gradient(90deg, transparent, hsl(${COLOR}), transparent)` }}
                  />
                  {/* Hover radial */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-[0.08] transition-opacity duration-700"
                    style={{ background: `radial-gradient(ellipse at 50% 0%, hsl(${COLOR}) 0%, transparent 70%)` }}
                  />

                  <div className="relative z-10 p-5 sm:p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-500"
                        style={{
                          background: `linear-gradient(135deg, hsl(${COLOR} / 0.2) 0%, hsl(${COLOR} / 0.08) 100%)`,
                          border: `1px solid hsl(${COLOR} / 0.25)`,
                          boxShadow: `0 0 20px hsl(${COLOR} / 0.15)`,
                        }}
                      >
                        <Icon size={18} style={{ color: `hsl(${COLOR})`, filter: `drop-shadow(0 0 6px hsl(${COLOR} / 0.6))` }} />
                      </div>
                      <span
                        className="text-[8px] font-display font-bold tracking-[0.3em] uppercase px-2.5 py-1 rounded-full"
                        style={{
                          color: `hsl(${COLOR})`,
                          background: `hsl(${COLOR} / 0.1)`,
                          border: `1px solid hsl(${COLOR} / 0.2)`,
                        }}
                      >
                        AUTOMOTIVE
                      </span>
                    </div>

                    <h3
                      className="font-display font-bold text-sm sm:text-base mb-2 transition-colors duration-300"
                      style={{ color: `hsl(${COLOR} / 0.9)` }}
                    >
                      {service.name}
                    </h3>
                    <p className="text-muted-foreground text-xs leading-relaxed mb-1">{service.desc}</p>
                    <p className="text-muted-foreground/60 text-[11px] leading-relaxed mb-5">{service.detail}</p>

                    <div
                      className="flex items-center gap-2 pt-4"
                      style={{ borderTop: `1px solid hsl(${COLOR} / 0.12)` }}
                    >
                      <button
                        onClick={() => openInquiry(service.name)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-display font-semibold tracking-wider uppercase transition-all duration-300 hover:scale-[1.02]"
                        style={{
                          background: `hsl(${COLOR})`,
                          color: `hsl(225 25% 3%)`,
                        }}
                      >
                        Inquire
                        <ArrowRight size={12} />
                      </button>
                    </div>
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
