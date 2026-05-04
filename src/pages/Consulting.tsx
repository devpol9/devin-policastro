import { useState } from "react";
import SEOHead from "@/components/SEOHead";
import { seoPages } from "@/lib/seoData";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Briefcase, DollarSign, Droplets, TrendingUp, BarChart3, Megaphone } from "lucide-react";
import { Link } from "react-router-dom";
import FloatingNav from "@/components/FloatingNav";
import MobileBottomNav from "@/components/MobileBottomNav";
import Footer from "@/components/Footer";
import ServiceInquiryDialog from "@/components/services/ServiceInquiryDialog";

const COLOR = "270 16% 50%";

const consultingServices = [
  {
    icon: Briefcase,
    name: "Brand Consulting",
    desc: "I'll break down your brand, your content, and your revenue strategy.",
    detail: "Full brand audit, positioning strategy, content direction, and monetization roadmap. No fluff — just what works.",
    price: "Starting at $500",
    tag: "BUSINESS",
  },
  {
    icon: DollarSign,
    name: "Brand Clarity Calls",
    desc: "30-minute call where I rip apart your brand and tell you exactly what to fix.",
    detail: "Quick, direct feedback on what's working and what's not. Walk away with a clear action plan.",
    price: "$150 / 30 min",
    tag: "CONSULTING",
  },
  {
    icon: Droplets,
    name: "2THIRTY Wholesale",
    desc: "Stock 2THIRTY at your gym, studio, or store.",
    detail: "Zero sugar, 5-in-1 hydration mixer. Bulk pricing available. Perfect for gyms, studios, and retail.",
    price: "Request a Quote",
    tag: "PARTNERSHIP",
  },
  {
    icon: TrendingUp,
    name: "Revenue Strategy",
    desc: "Maximize what you're already doing. Find the gaps.",
    detail: "Revenue stream analysis, pricing optimization, upsell strategies, and recurring revenue models.",
    price: "Starting at $750",
    tag: "STRATEGY",
  },
  {
    icon: BarChart3,
    name: "Market Positioning",
    desc: "Stand out in a crowded market. Own your lane.",
    detail: "Competitive analysis, unique value prop development, and go-to-market positioning.",
    price: "Starting at $500",
    tag: "POSITIONING",
  },
  {
    icon: Megaphone,
    name: "Content Strategy",
    desc: "Build a content engine that drives revenue.",
    detail: "Platform strategy, content calendar, audience growth tactics, and conversion optimization.",
    price: "Starting at $400",
    tag: "CONTENT",
  },
];

const Consulting = () => {
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");

  const openInquiry = (serviceName: string) => {
    setSelectedService(serviceName);
    setInquiryOpen(true);
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden noise-overlay">
      <SEOHead {...seoPages["/consulting"]} canonicalPath="/consulting" />
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
            <p className="font-display text-[10px] tracking-[0.5em]  mb-4 sm:mb-5" style={{ color: `hsl(${COLOR})` }}>
              [ Consulting ]
            </p>
            <h1 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-7xl leading-[0.88] mb-6 sm:mb-8 tracking-[-0.02em]">
              Build Smarter.
              <br />
              <span className="text-muted-foreground">Scale Faster.</span>
            </h1>
            <p className="text-muted-foreground max-w-xl text-sm sm:text-base leading-[1.8] mb-6">
              Brand strategy, revenue optimization, and content direction.
              I've built multiple brands from scratch — let me show you what actually works.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-12">
            {consultingServices.map((service, i) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.06 }}
                  className="group relative overflow-hidden rounded-lg transition-all duration-500"
                  style={{
                    background: `linear-gradient(145deg, hsl(36 30% 99% / 0.95) 0%, hsl(33 20% 95% / 0.8) 100%)`,
                    border: `1px solid hsl(${COLOR} / 0.15)`,
                  }}
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-[2px] opacity-40 group-hover:opacity-80 transition-opacity duration-500"
                    style={{ background: `linear-gradient(90deg, transparent, hsl(${COLOR}), transparent)` }}
                  />
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
                        className="text-[8px] font-display font-bold tracking-[0.3em]  px-2.5 py-1 rounded-full"
                        style={{
                          color: `hsl(${COLOR})`,
                          background: `hsl(${COLOR} / 0.1)`,
                          border: `1px solid hsl(${COLOR} / 0.2)`,
                        }}
                      >
                        {service.tag}
                      </span>
                    </div>

                    <h3
                      className="font-display font-bold text-sm sm:text-base mb-2"
                      style={{ color: `hsl(${COLOR} / 0.9)` }}
                    >
                      {service.name}
                    </h3>
                    <p className="text-muted-foreground text-xs leading-relaxed mb-1">{service.desc}</p>
                    <p className="text-muted-foreground/60 text-[11px] leading-relaxed mb-5">{service.detail}</p>

                    <div
                      className="flex items-center justify-between pt-4"
                      style={{ borderTop: `1px solid hsl(${COLOR} / 0.12)` }}
                    >
                      <span className="font-display font-bold text-xs" style={{ color: `hsl(${COLOR})` }}>
                        {service.price}
                      </span>
                      <button
                        onClick={() => openInquiry(service.name)}
                        className="flex items-center gap-1.5 text-[10px] font-display font-semibold tracking-wider  transition-all duration-300 hover:scale-[1.02]"
                        style={{ color: `hsl(${COLOR} / 0.7)` }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = `hsl(${COLOR})`)}
                        onMouseLeave={(e) => (e.currentTarget.style.color = `hsl(${COLOR} / 0.7)`)}
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

      <ServiceInquiryDialog
        open={inquiryOpen}
        onOpenChange={setInquiryOpen}
        title={`${selectedService} Inquiry`}
        subtitle="Tell me about your brand and what you need help with."
        color={COLOR}
        emailSubject={`Consulting Inquiry: ${selectedService}`}
        fields={[
          { key: "brand", label: "Your brand / business", placeholder: "Company name and what you do", type: "input", required: true },
          { key: "revenue", label: "Current revenue range", placeholder: "Pre-revenue, $10K/mo, $100K/mo...", type: "input" },
          { key: "help", label: "What do you need help with?", placeholder: "Content strategy, revenue growth, positioning...", type: "textarea", rows: 2, required: true },
          { key: "budget", label: "Budget & timeline", placeholder: "Budget range and when you want to start", type: "input" },
        ]}
      />
    </div>
  );
};

export default Consulting;
