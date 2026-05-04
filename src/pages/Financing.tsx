import { useState } from "react";
import SEOHead from "@/components/SEOHead";
import { seoPages } from "@/lib/seoData";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CreditCard, DollarSign, Wrench, Building2, TrendingUp, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import FloatingNav from "@/components/FloatingNav";
import MobileBottomNav from "@/components/MobileBottomNav";
import Footer from "@/components/Footer";
import ServiceInquiryDialog from "@/components/services/ServiceInquiryDialog";

const COLOR = "210 22% 50%";

const financingServices = [
  {
    icon: CreditCard,
    name: "Business Financing",
    desc: "Need capital for your business? I'll connect you with lenders who get it done.",
    detail: "SBA loans, lines of credit, merchant cash advances, revenue-based financing. I know the right people.",
    tag: "FINANCING",
  },
  {
    icon: ShieldCheck,
    name: "Credit Repair & Building",
    desc: "Get connected with credit specialists who can rebuild your score.",
    detail: "Dispute management, tradeline strategies, and credit building programs. Results-driven specialists.",
    tag: "CREDIT",
  },
  {
    icon: Wrench,
    name: "Equipment Financing",
    desc: "Gym equipment, vehicles, business tools — get financed.",
    detail: "Flexible terms for equipment purchases. Gyms, restaurants, construction, medical — any industry.",
    tag: "EQUIPMENT",
  },
  {
    icon: Building2,
    name: "Real Estate Financing",
    desc: "Commercial or residential — I know the right lenders.",
    detail: "Investment properties, commercial spaces, construction loans. Connected to lenders across the tri-state.",
    tag: "REAL ESTATE",
  },
  {
    icon: TrendingUp,
    name: "Startup Funding",
    desc: "Early-stage capital and investor introductions.",
    detail: "Angel investors, venture capital intros, pitch deck guidance. I'll connect you to the right people.",
    tag: "STARTUP",
  },
  {
    icon: DollarSign,
    name: "Debt Consolidation",
    desc: "Simplify your payments and lower your rates.",
    detail: "Business and personal debt consolidation through trusted financial partners.",
    tag: "CONSOLIDATION",
  },
];

const Financing = () => {
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");

  const openInquiry = (serviceName: string) => {
    setSelectedService(serviceName);
    setInquiryOpen(true);
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden noise-overlay">
      <SEOHead {...seoPages["/financing"]} canonicalPath="/financing" />
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
            <p className="font-display text-[10px] tracking-[0.18em]  mb-4 sm:mb-5" style={{ color: `hsl(${COLOR})` }}>
              [ Financing ]
            </p>
            <h1 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-7xl leading-[0.88] mb-6 sm:mb-8 tracking-[-0.02em]">
              Get Funded.
              <br />
              <span className="text-muted-foreground">Get Moving.</span>
            </h1>
            <p className="text-muted-foreground max-w-xl text-sm sm:text-base leading-[1.8] mb-6">
              I'll connect you with the right financing experts, lenders, and credit specialists.
              Free introductions — I just make sure you're taken care of.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-12">
            {financingServices.map((service, i) => {
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
                        className="text-[8px] font-display font-bold tracking-[0.12em]  px-2.5 py-1 rounded-full"
                        style={{
                          color: `hsl(${COLOR})`,
                          background: `hsl(${COLOR} / 0.1)`,
                          border: `1px solid hsl(${COLOR} / 0.2)`,
                        }}
                      >
                        {service.tag}
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-sm sm:text-base mb-2" style={{ color: `hsl(${COLOR} / 0.9)` }}>
                      {service.name}
                    </h3>
                    <p className="text-muted-foreground text-xs leading-relaxed mb-1">{service.desc}</p>
                    <p className="text-muted-foreground/60 text-[11px] leading-relaxed mb-5">{service.detail}</p>

                    <div
                      className="flex items-center justify-between pt-4"
                      style={{ borderTop: `1px solid hsl(${COLOR} / 0.12)` }}
                    >
                      <span className="font-display font-bold text-xs" style={{ color: `hsl(${COLOR})` }}>
                        Free Intro
                      </span>
                      <button
                        onClick={() => openInquiry(service.name)}
                        className="flex items-center gap-1.5 text-[10px] font-display font-semibold tracking-[0.06em]  transition-all duration-300 hover:scale-[1.02]"
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
        subtitle="Tell me what you need and I'll connect you with the right expert."
        color={COLOR}
        emailSubject={`Financing Inquiry: ${selectedService}`}
        fields={[
          { key: "type", label: "What do you need?", placeholder: "Business loan, credit repair, equipment financing, SBA...", type: "input", required: true },
          { key: "amount", label: "Amount needed", placeholder: "$10K, $50K, $100K+...", type: "input" },
          { key: "business", label: "Business details", placeholder: "Business type, years in operation, credit score range...", type: "textarea", rows: 2, required: true },
          { key: "timeline", label: "How soon do you need this?", placeholder: "ASAP, 30 days, flexible...", type: "input" },
        ]}
      />
    </div>
  );
};

export default Financing;
