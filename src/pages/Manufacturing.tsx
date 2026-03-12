import { motion } from "framer-motion";
import { ArrowLeft, Factory, Wrench, Package, Lightbulb, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import FloatingNav from "@/components/FloatingNav";
import MobileBottomNav from "@/components/MobileBottomNav";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/effects/CustomCursor";
import MouseSpotlight from "@/components/effects/MouseSpotlight";
import ServiceInquiryDialog from "@/components/services/ServiceInquiryDialog";
import { useState } from "react";

const COLOR = "280 70% 60%";

const Manufacturing = () => {
  const [inquiryOpen, setInquiryOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden noise-overlay">
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
            className="mb-14 sm:mb-20"
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 60 }}
              transition={{ duration: 1 }}
              className="h-px bg-primary/60 mb-8 sm:mb-10"
            />
            <p className="font-display text-[10px] tracking-[0.5em] uppercase mb-4 sm:mb-5" style={{ color: `hsl(${COLOR})` }}>
              [ Manufacturing ]
            </p>
            <h1 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl leading-[0.88] mb-6 sm:mb-8 tracking-[-0.02em]">
              Creative Vision
              <br />
              <span className="text-muted-foreground">Manufacturing.</span>
            </h1>
            <p className="text-muted-foreground max-w-lg text-sm sm:text-base leading-[1.8]">
              From concept to shelf — we manufacture, formulate, and bring products to life.
              More details coming soon. Reach out to learn about current capabilities.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {[
              { icon: Factory, title: "Product Manufacturing", desc: "End-to-end manufacturing for consumer products. From formulation to finished goods." },
              { icon: Package, title: "Private Label", desc: "White-label and private-label solutions. Your brand, our production." },
              { icon: Wrench, title: "Custom Formulation", desc: "R&D and custom formulation for supplements, beverages, and wellness products." },
              { icon: Lightbulb, title: "Brand Development", desc: "Packaging design, compliance, and go-to-market strategy." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="group relative overflow-hidden rounded-lg p-6 transition-all duration-500"
                style={{
                  background: `linear-gradient(145deg, hsl(225 20% 7% / 0.95) 0%, hsl(225 20% 5% / 0.8) 100%)`,
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
              color: `hsl(225 25% 3%)`,
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
          { key: "product", label: "What product do you want to manufacture?", placeholder: "Supplement, beverage, skincare, wellness...", type: "textarea", rows: 3, required: true },
          { key: "stage", label: "Current stage", placeholder: "Idea, prototype, ready to scale, existing product...", type: "input", required: true },
          { key: "volume", label: "Estimated volume / MOQ needs", placeholder: "500 units, 5,000 units, 50,000+...", type: "input" },
          { key: "timeline", label: "Target launch timeline", placeholder: "3 months, 6 months, ASAP...", type: "input" },
          { key: "details", label: "Anything else?", placeholder: "Existing formulas, certifications needed, packaging ideas...", type: "textarea", rows: 3 },
        ]}
      />
    </div>
  );
};

export default Manufacturing;
