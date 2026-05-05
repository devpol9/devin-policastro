import SEOHead from "@/components/SEOHead";
import { seoPages } from "@/lib/seoData";
import { ArrowLeft, Factory, Wrench, Package, Lightbulb, ArrowRight, Shirt, Dumbbell, ShoppingBag, Crown } from "lucide-react";
import { Link } from "react-router-dom";
import FloatingNav from "@/components/FloatingNav";
import MobileBottomNav from "@/components/MobileBottomNav";
import Footer from "@/components/Footer";
import ServiceInquiryDialog from "@/components/services/ServiceInquiryDialog";
import ServiceCard from "@/components/services/ServiceCard";
import SectionHeader from "@/components/SectionHeader";
import { useState } from "react";

const COLOR = "270 16% 48%";

const services = [
  { icon: Shirt, name: "Custom Apparel & Accessories", desc: "T-shirts, hoodies, hats, bags — branded merchandise from design to bulk." },
  { icon: Dumbbell, name: "Gym & Fitness Equipment", desc: "Jump ropes, mini bands, wrist wraps, resistance gear, custom fitness products." },
  { icon: Wrench, name: "Custom Formulation", desc: "R&D and formulation for supplements, beverages, and wellness products." },
  { icon: Package, name: "Private & White Label", desc: "Your brand, our production. Ready-to-sell products under your name." },
  { icon: ShoppingBag, name: "Ecom & Amazon Products", desc: "Designed for ecommerce — Amazon FBA, DTC, and marketplace-ready." },
  { icon: Factory, name: "Full-Scale Manufacturing", desc: "End-to-end — sourcing, prototyping, production runs, and fulfillment." },
  { icon: Crown, name: "Brand Development", desc: "Packaging, compliance, go-to-market strategy, and launch support." },
  { icon: Lightbulb, name: "Product Ideation & R&D", desc: "Got an idea? We'll develop it from napkin sketch to finished product." },
];

const Manufacturing = () => {
  const [inquiryOpen, setInquiryOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden noise-overlay">
      <SEOHead {...seoPages["/manufacturing"]} canonicalPath="/manufacturing" />
      <FloatingNav />

      <section className="section-padding pt-32 sm:pt-40">
        <div className="container-tight">
          <Link to="/#services" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-display mb-8">
            <ArrowLeft size={16} />
            Back to home
          </Link>

          <SectionHeader
            as="h1"
            numeral="02"
            eyebrow="Manufacturing"
            accentColor={COLOR}
            title={<>Creative Vision <span className="italic font-light" style={{ color: `hsl(${COLOR})` }}>manufacturing.</span></>}
            description="From concept to shelf — we manufacture, formulate, and bring products to life. Apparel, accessories, equipment, supplements, beverages, and ecom-ready products."
          />

          <div className="mb-10 sm:mb-12">
            <button
              onClick={() => setInquiryOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-display font-semibold bg-foreground text-background hover:bg-foreground/90 transition-all"
            >
              Start a project
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 mb-12">
            {services.map((s, i) => (
              <ServiceCard key={s.name} icon={s.icon} name={s.name} desc={s.desc} index={i} accentColor={COLOR} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <MobileBottomNav />

      <ServiceInquiryDialog
        open={inquiryOpen}
        onOpenChange={setInquiryOpen}
        title="Manufacturing inquiry"
        subtitle="Tell us about your product idea and we'll explore how to bring it to life."
        color={COLOR}
        emailSubject="Manufacturing Inquiry"
        fields={[
          { key: "service", label: "What do you need?", placeholder: "Select…", type: "select", options: ["Not sure yet", ...services.map((s) => s.name)], required: true },
          { key: "product", label: "What do you want to manufacture?", placeholder: "Apparel, supplements, gym accessories, custom merch…", type: "textarea", rows: 3, required: true },
          { key: "stage", label: "Current stage", placeholder: "Idea, prototype, ready to scale…", type: "input", required: true },
          { key: "volume", label: "Estimated volume / MOQ", placeholder: "500, 5,000, 50,000+…", type: "input" },
          { key: "timeline", label: "Target launch", placeholder: "3 months, 6 months, ASAP…", type: "input" },
        ]}
      />
    </div>
  );
};

export default Manufacturing;
