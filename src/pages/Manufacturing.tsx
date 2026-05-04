import { motion } from "framer-motion";
import SEOHead from "@/components/SEOHead";
import { seoPages } from "@/lib/seoData";
import { ArrowLeft, Factory, Wrench, Package, Lightbulb, ArrowRight, Shirt, Dumbbell, ShoppingBag, Crown } from "lucide-react";
import { Link } from "react-router-dom";
import FloatingNav from "@/components/FloatingNav";
import MobileBottomNav from "@/components/MobileBottomNav";
import Footer from "@/components/Footer";
import ServiceInquiryDialog from "@/components/services/ServiceInquiryDialog";
import SectionHeader from "@/components/SectionHeader";
import { useState } from "react";

const COLOR = "270 16% 48%";

const Manufacturing = () => {
  const [inquiryOpen, setInquiryOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden noise-overlay">
      <SEOHead {...seoPages["/manufacturing"]} canonicalPath="/manufacturing" />
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
            numeral="02"
            eyebrow="Manufacturing"
            accentColor={COLOR}
            title={<>Creative Vision <span className="italic font-light" style={{ color: `hsl(${COLOR})` }}>manufacturing.</span></>}
            description="From concept to shelf — we manufacture, formulate, and bring products to life. Custom apparel, accessories, hats, gym equipment, supplements, beverages, and ecom-ready products. Whether you're building your next Amazon brand or launching a private label — we handle it all."
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {[
              { icon: Shirt, title: "Custom Apparel & Accessories", desc: "T-shirts, hoodies, hats, bags — branded merchandise from design to bulk production." },
              { icon: Dumbbell, title: "Gym & Fitness Equipment", desc: "Jump ropes, mini bands, wrist wraps, resistance gear, and custom fitness products." },
              { icon: Wrench, title: "Custom Formulation", desc: "R&D and formulation for supplements, beverages, and wellness products." },
              { icon: Package, title: "Private Label & White Label", desc: "Your brand, our production. Ready-to-sell products under your name." },
              { icon: ShoppingBag, title: "Ecom & Amazon Products", desc: "Products designed for ecommerce — Amazon FBA, DTC, and marketplace-ready." },
              { icon: Factory, title: "Full-Scale Manufacturing", desc: "End-to-end production — sourcing, prototyping, production runs, and fulfillment." },
              { icon: Crown, title: "Brand Development", desc: "Packaging design, compliance, go-to-market strategy, and launch support." },
              { icon: Lightbulb, title: "Product Ideation & R&D", desc: "Got an idea? We'll help you develop it from napkin sketch to finished product." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="group relative overflow-hidden rounded-lg p-6 transition-all duration-500"
                style={{
                  background: `linear-gradient(145deg, hsl(36 30% 99% / 0.95) 0%, hsl(33 20% 95% / 0.8) 100%)`,
                  border: `1px solid hsl(${COLOR} / 0.15)`,
                }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-[2px] opacity-40 group-hover:opacity-80 transition-opacity duration-500"
                  style={{ background: `linear-gradient(90deg, transparent, hsl(${COLOR}), transparent)` }}
                />
                <item.icon size={24} className="mb-4" style={{ color: `hsl(${COLOR})` }} />
                <h3 className="font-display font-bold text-sm mb-2" style={{ color: `hsl(${COLOR} / 0.9)` }}>
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-xs leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            onClick={() => setInquiryOpen(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-lg font-display font-semibold text-sm tracking-wide transition-all duration-300 hover:scale-[1.02]"
            style={{
              background: `hsl(${COLOR})`,
              color: `hsl(36 30% 98%)`,
            }}
          >
            Inquire About Manufacturing
            <ArrowRight size={16} />
          </motion.button>
        </div>
      </section>

      <Footer />
      <MobileBottomNav />

      <ServiceInquiryDialog
        open={inquiryOpen}
        onOpenChange={setInquiryOpen}
        title="Manufacturing Inquiry"
        subtitle="Tell us about your product idea and we'll explore how we can bring it to life."
        color={COLOR}
        emailSubject="Manufacturing Inquiry"
        fields={[
          { key: "product", label: "What do you want to manufacture?", placeholder: "Apparel, supplements, gym accessories, Amazon product, custom merch...", type: "textarea", rows: 2, required: true },
          { key: "stage", label: "Current stage", placeholder: "Idea, prototype, ready to scale, existing product...", type: "input", required: true },
          { key: "volume", label: "Estimated volume / MOQ needs", placeholder: "500 units, 5,000 units, 50,000+...", type: "input" },
          { key: "timeline", label: "Target launch timeline", placeholder: "3 months, 6 months, ASAP...", type: "input" },
          { key: "details", label: "Anything else?", placeholder: "Existing formulas, certifications needed, packaging ideas...", type: "textarea", rows: 2 },
        ]}
      />
    </div>
  );
};

export default Manufacturing;
