import { useState } from "react";
import SEOHead from "@/components/SEOHead";
import { seoPages } from "@/lib/seoData";
import { ArrowLeft, ArrowRight, Paintbrush, Shield, Sun, Gauge, Sparkles, Car, Disc, Sofa, Lightbulb, type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import FloatingNav from "@/components/FloatingNav";
import MobileBottomNav from "@/components/MobileBottomNav";
import Footer from "@/components/Footer";
import ServiceInquiryDialog from "@/components/services/ServiceInquiryDialog";
import ServiceCard from "@/components/services/ServiceCard";
import SectionHeader from "@/components/SectionHeader";

const COLOR = "12 45% 48%";

interface AutoService {
  icon: LucideIcon;
  name: string;
  desc: string;
  detail: string;
}

const autoServices: AutoService[] = [
  { icon: Paintbrush, name: "Vinyl Wrap", desc: "Full or partial wraps in any color, finish, or texture.", detail: "Gloss, matte, satin, chrome, color-shift — full body or accents." },
  { icon: Shield, name: "Paint Protection Film", desc: "Invisible armor against scratches, chips, and damage.", detail: "Self-healing PPF from XPEL and 3M. Full front, full body, or custom." },
  { icon: Sparkles, name: "Ceramic Coating", desc: "Nano-coating with paint correction for lasting shine.", detail: "Multi-stage correction plus pro-grade ceramic for years of protection." },
  { icon: Sun, name: "Window Tinting", desc: "Premium films — 99% UV block, privacy, sleek look.", detail: "Ceramic and carbon films. Legal compliance guidance included." },
  { icon: Gauge, name: "Tuning & Performance", desc: "ECU remapping, downpipes, exhaust. More power.", detail: "Custom tunes for BMW, Audi, Mercedes, and more. Dyno-tested." },
  { icon: Disc, name: "Powder Coating", desc: "Wheels, calipers, metal surfaces. Durable finish.", detail: "OEM or custom colors. Calipers, wheels, engine covers, suspension." },
  { icon: Sofa, name: "Custom Interiors", desc: "Luxury upholstery, stitching, trim, and materials.", detail: "Leather swaps, Alcantara, custom stitching, headliner wraps." },
  { icon: Lightbulb, name: "Exterior Styling", desc: "Aero kits, spoilers, diffusers, custom lighting.", detail: "Carbon fiber lips, splitters, custom headlight and taillight builds." },
  { icon: Car, name: "Full Build / Customization", desc: "Complete builds — wheels, suspension, body, interior.", detail: "End-to-end project management. The whole vision, executed." },
];

const SERVICE_NAMES = autoServices.map((s) => s.name);

const Automotive = () => {
  const [inquiryOpen, setInquiryOpen] = useState(false);

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
            Back to home
          </Link>

          <SectionHeader
            as="h1"
            numeral="04"
            eyebrow="Automotive"
            accentColor={COLOR}
            title={<>Automotive <span className="italic font-light" style={{ color: `hsl(${COLOR})` }}>& custom builds.</span></>}
            description="Builds, mods, and the car culture that fuels me. Tell me what you need — I'll connect you with the right people and make sure you're taken care of."
          />

          <div className="mb-10 sm:mb-12">
            <button
              onClick={() => setInquiryOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-display font-semibold bg-foreground text-background hover:bg-foreground/90 transition-all"
            >
              Start an inquiry
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 mb-12">
            {autoServices.map((service, i) => (
              <ServiceCard
                key={service.name}
                icon={service.icon}
                name={service.name}
                desc={service.desc}
                detail={service.detail}
                index={i}
                accentColor={COLOR}
              />
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <MobileBottomNav />

      <ServiceInquiryDialog
        open={inquiryOpen}
        onOpenChange={setInquiryOpen}
        title="Automotive inquiry"
        subtitle="Tell me what you're working with and I'll get you connected to the right specialist."
        color={COLOR}
        emailSubject="Automotive Inquiry"
        fields={[
          { key: "service", label: "Which service?", placeholder: "Select a service…", type: "select", options: ["Not sure yet", ...SERVICE_NAMES], required: true },
          { key: "vehicle", label: "Vehicle (year / make / model)", placeholder: "2024 BMW M4", type: "input", required: true },
          { key: "details", label: "What are you looking for?", placeholder: "Full body PPF, color change wrap, ceramic, tune…", type: "textarea", rows: 3, required: true },
          { key: "budget", label: "Budget range", placeholder: "$1K–$3K, $3K–$5K, $5K+…", type: "input" },
          { key: "timeline", label: "Timeline", placeholder: "ASAP, within a month, flexible…", type: "input" },
        ]}
      />
    </div>
  );
};

export default Automotive;
