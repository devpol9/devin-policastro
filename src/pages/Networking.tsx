import { useState } from "react";
import SEOHead from "@/components/SEOHead";
import { seoPages } from "@/lib/seoData";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Handshake, Camera, Users, Globe, Briefcase, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import FloatingNav from "@/components/FloatingNav";
import MobileBottomNav from "@/components/MobileBottomNav";
import Footer from "@/components/Footer";
import ServiceInquiryDialog from "@/components/services/ServiceInquiryDialog";

const COLOR = "140 18% 42%";

const networkingServices = [
  {
    icon: Handshake,
    name: "Paid Introductions",
    desc: "I know people across Bergen County and beyond.",
    detail: "Contractors, suppliers, investors, partners — I'll connect you to the right person for what you need.",
    price: "$100–$500",
    tag: "NETWORK",
  },
  {
    icon: Camera,
    name: "Influencer Collabs",
    desc: "If your brand fits my audience, let's create content that converts.",
    detail: "Product reviews, sponsored content, UGC, event coverage. Authentic content that drives sales.",
    price: "Starting at $250",
    tag: "CONTENT",
  },
  {
    icon: Users,
    name: "Partnership Brokering",
    desc: "I'll find the right partner for your business.",
    detail: "Strategic partnerships, co-ventures, joint marketing. I connect brands that complement each other.",
    price: "$250–$1K",
    tag: "PARTNERSHIPS",
  },
  {
    icon: Globe,
    name: "Vendor Sourcing",
    desc: "Need a supplier, manufacturer, or service provider?",
    detail: "I'll tap my network to find the right vendor for your project. Any industry, any scale.",
    price: "$100–$300",
    tag: "SOURCING",
  },
  {
    icon: Briefcase,
    name: "Talent & Hiring",
    desc: "Looking for the right person for the job?",
    detail: "Trainers, managers, designers, developers, marketers — I know people who deliver.",
    price: "$150–$500",
    tag: "TALENT",
  },
  {
    icon: MessageSquare,
    name: "Advisory Intros",
    desc: "Connect with advisors, mentors, and industry leaders.",
    detail: "Introductions to experienced operators who can guide your next move.",
    price: "$200–$500",
    tag: "ADVISORY",
  },
];

const Networking = () => {
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");

  const openInquiry = (serviceName: string) => {
    setSelectedService(serviceName);
    setInquiryOpen(true);
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden noise-overlay">
      <SEOHead {...seoPages["/networking"]} canonicalPath="/networking" />
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
            <p className="font-display text-[10px] tracking-[0.5em] uppercase mb-4 sm:mb-5" style={{ color: `hsl(${COLOR})` }}>
              [ Networking ]
            </p>
            <h1 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-7xl leading-[0.88] mb-6 sm:mb-8 tracking-[-0.02em]">
              I Know
              <br />
              <span className="text-muted-foreground">The Right People.</span>
            </h1>
            <p className="text-muted-foreground max-w-xl text-sm sm:text-base leading-[1.8] mb-6">
              Need an introduction? A vendor? A partner? Tell me what you're looking for
              and I'll connect you with someone who can help.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-12">
            {networkingServices.map((service, i) => {
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
                        className="text-[8px] font-display font-bold tracking-[0.3em] uppercase px-2.5 py-1 rounded-full"
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
                        {service.price}
                      </span>
                      <button
                        onClick={() => openInquiry(service.name)}
                        className="flex items-center gap-1.5 text-[10px] font-display font-semibold tracking-wider uppercase transition-all duration-300 hover:scale-[1.02]"
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
        subtitle="Tell me who you're looking for and I'll make the introduction."
        color={COLOR}
        emailSubject={`Networking Inquiry: ${selectedService}`}
        fields={[
          { key: "looking-for", label: "Who are you looking for?", placeholder: "Contractor, supplier, investor, partner...", type: "input", required: true },
          { key: "industry", label: "Industry / niche", placeholder: "Fitness, real estate, automotive, tech...", type: "input", required: true },
          { key: "context", label: "Why do you need this intro?", placeholder: "Starting a business, need a vendor, looking for talent...", type: "textarea", rows: 2 },
          { key: "budget", label: "Budget for intro fee", placeholder: "$100, $250, $500...", type: "input" },
        ]}
      />
    </div>
  );
};

export default Networking;
