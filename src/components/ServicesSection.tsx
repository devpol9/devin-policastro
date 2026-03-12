import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Briefcase, Droplets, Camera, Handshake, DollarSign, ArrowRight,
  Factory, Car, CreditCard, Wrench,
} from "lucide-react";
import TiltCard from "@/components/effects/TiltCard";
import ServiceInquiryDialog from "@/components/services/ServiceInquiryDialog";


interface ServiceTab {
  key: string;
  label: string;
  icon: React.ElementType;
  color: string;
  action: "cards" | "page" | "dialog";
  route?: string;
}

const tabs: ServiceTab[] = [
  { key: "consulting", label: "Consulting", icon: Briefcase, color: "265 80% 65%", action: "cards" },
  { key: "manufacturing", label: "Manufacturing", icon: Factory, color: "280 70% 60%", action: "page", route: "/manufacturing" },
  { key: "content", label: "Content", icon: Camera, color: "340 80% 62%", action: "page", route: "/content" },
  { key: "automotive", label: "Automotive", icon: Car, color: "0 85% 60%", action: "page", route: "/automotive" },
  { key: "financing", label: "Financing", icon: CreditCard, color: "210 80% 60%", action: "cards" },
  { key: "networking", label: "Networking", icon: Handshake, color: "155 75% 48%", action: "cards" },
];

interface ServiceCard {
  icon: React.ElementType;
  title: string;
  desc: string;
  price: string;
  tag: string;
  color: string;
}

const tabCards: Record<string, ServiceCard[]> = {
  consulting: [
    { icon: Briefcase, title: "Brand Consulting", desc: "I'll break down your brand, your content, and your revenue strategy. No fluff — just what works.", price: "Starting at $500", tag: "BUSINESS", color: "265 80% 65%" },
    { icon: DollarSign, title: "Brand Clarity Calls", desc: "30-minute call where I rip apart your brand and tell you exactly what to fix.", price: "$150 / 30 min", tag: "CONSULTING", color: "18 90% 58%" },
    { icon: Droplets, title: "2THIRTY Wholesale", desc: "Stock 2THIRTY at your gym, studio, or store. Zero sugar, 5-in-1 hydration mixer. Bulk pricing available.", price: "Request a Quote", tag: "PARTNERSHIP", color: "195 90% 55%" },
  ],
  financing: [
    { icon: CreditCard, title: "Business Financing", desc: "Need capital for your business? I'll connect you with lenders and financing experts who can get it done.", price: "Free Intro", tag: "FINANCING", color: "210 80% 60%" },
    { icon: DollarSign, title: "Credit Repair & Building", desc: "Get connected with credit specialists who can help you build or repair your credit score.", price: "Free Intro", tag: "CREDIT", color: "170 70% 50%" },
    { icon: Wrench, title: "Equipment Financing", desc: "Gym equipment, vehicles, business tools — I know the right people to get you financed.", price: "Free Intro", tag: "EQUIPMENT", color: "38 90% 58%" },
  ],
  networking: [
    { icon: Handshake, title: "Paid Introductions", desc: "I know people across Bergen County and beyond. I'll connect you to the right person.", price: "$100–$500", tag: "NETWORK", color: "155 75% 48%" },
    { icon: Camera, title: "Influencer Collabs", desc: "If your brand fits my audience, let's create content that converts.", price: "Starting at $250", tag: "CONTENT", color: "340 80% 62%" },
  ],
};

const inquiryConfigs: Record<string, { title: string; subtitle: string; color: string; emailSubject: string; fields: any[] }> = {
  consulting: {
    title: "Consulting Inquiry",
    subtitle: "Tell me about your brand and what you need help with.",
    color: "265 80% 65%",
    emailSubject: "Consulting Inquiry",
    fields: [
      { key: "brand", label: "Your brand / business", placeholder: "Company name and what you do", type: "input", required: true },
      { key: "revenue", label: "Current revenue range", placeholder: "Pre-revenue, $10K/mo, $100K/mo...", type: "input" },
      { key: "help", label: "What do you need help with?", placeholder: "Content strategy, revenue growth, positioning...", type: "textarea", rows: 2, required: true },
      { key: "budget", label: "Budget & timeline", placeholder: "Budget range and when you want to start", type: "input" },
    ],
  },
  financing: {
    title: "Financing Inquiry",
    subtitle: "Tell me what you need financed and I'll connect you with the right expert.",
    color: "210 80% 60%",
    emailSubject: "Financing / Credit Inquiry",
    fields: [
      { key: "type", label: "What do you need?", placeholder: "Business loan, credit repair, equipment financing, SBA...", type: "input", required: true },
      { key: "amount", label: "Amount needed", placeholder: "$10K, $50K, $100K+...", type: "input" },
      { key: "business", label: "Business details", placeholder: "Business type, years in operation, credit score range...", type: "textarea", rows: 2, required: true },
      { key: "timeline", label: "How soon do you need this?", placeholder: "ASAP, 30 days, flexible...", type: "input" },
    ],
  },
  networking: {
    title: "Connection Request",
    subtitle: "Tell me who you're looking for and I'll make the introduction.",
    color: "155 75% 48%",
    emailSubject: "Networking / Introduction Request",
    fields: [
      { key: "looking-for", label: "Who are you looking for?", placeholder: "Contractor, supplier, investor, partner...", type: "input", required: true },
      { key: "industry", label: "Industry / niche", placeholder: "Fitness, real estate, automotive, tech...", type: "input", required: true },
      { key: "context", label: "Why do you need this intro?", placeholder: "Starting a business, need a vendor, looking for talent...", type: "textarea", rows: 2 },
      { key: "budget", label: "Budget for intro fee", placeholder: "$100, $250, $500...", type: "input" },
    ],
  },
};

const ServicesSection = () => {
  const [activeTab, setActiveTab] = useState("consulting");
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const navigate = useNavigate();

  const handleTabClick = (tab: ServiceTab) => {
    if (tab.action === "page" && tab.route) {
      navigate(tab.route);
    } else {
      setActiveTab(tab.key);
    }
  };

  const cards = tabCards[activeTab] || [];
  const inquiry = inquiryConfigs[activeTab];

  return (
    <section id="services" className="section-padding relative">
      <div className="container-tight">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 sm:mb-20"
        >
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 60 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="h-px bg-primary/60 mb-8 sm:mb-10"
          />
          <p className="text-primary/80 font-display text-[10px] tracking-[0.5em] uppercase mb-4 sm:mb-5">[ 06 — Services ]</p>
          <h2 className="font-display font-extrabold text-3xl sm:text-6xl lg:text-7xl leading-[0.88] mb-6 sm:mb-8 tracking-[-0.02em]">
            Work With Me.
            <br />
            <span className="text-muted-foreground">Or I'll Introduce</span>
            <br />
            <span className="text-muted-foreground">You to Someone</span>
            <br />
            <span className="gradient-text">Who Can.</span>
          </h2>
        </motion.div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key && tab.action === "cards";
            const isLink = tab.action === "page" || tab.action === "dialog";
            return (
              <button
                key={tab.key}
                onClick={() => handleTabClick(tab)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-display font-semibold tracking-wide transition-all duration-300"
                style={{
                  background: isActive
                    ? `hsl(${tab.color} / 0.2)`
                    : `hsl(225 20% 8% / 0.6)`,
                  border: `1px solid ${isActive ? `hsl(${tab.color} / 0.5)` : `hsl(225 12% 15% / 0.4)`}`,
                  color: isActive ? `hsl(${tab.color})` : `hsl(220 10% 55%)`,
                  boxShadow: isActive ? `0 0 20px hsl(${tab.color} / 0.15)` : "none",
                }}
              >
                <Icon size={14} />
                {tab.label}
                {isLink && <ArrowRight size={11} className="opacity-50" />}
              </button>
            );
          })}
        </div>

        {/* Cards for active tab */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {cards.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
            >
              <TiltCard className="h-full" intensity={6}>
                <div
                  className="h-full flex flex-col relative overflow-hidden rounded-lg transition-all duration-500 group cursor-default"
                  style={{
                    background: `linear-gradient(145deg, hsl(225 20% 7% / 0.95) 0%, hsl(225 20% 5% / 0.8) 100%)`,
                    border: `1px solid hsl(${service.color} / 0.15)`,
                    boxShadow: `0 4px 24px hsl(225 30% 2% / 0.6), inset 0 1px 0 hsl(${service.color} / 0.08)`,
                  }}
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-[2px] opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `linear-gradient(90deg, transparent, hsl(${service.color}), transparent)` }}
                  />
                  <div
                    className="absolute inset-0 opacity-[0.06] group-hover:opacity-[0.14] transition-opacity duration-700"
                    style={{ background: `radial-gradient(ellipse at 50% 0%, hsl(${service.color}) 0%, transparent 70%)` }}
                  />
                  <div
                    className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ boxShadow: `inset 0 0 0 1px hsl(${service.color} / 0.4), 0 0 30px hsl(${service.color} / 0.12)` }}
                  />

                  <div className="relative z-10 p-5 sm:p-7 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-5 sm:mb-6">
                      <div
                        className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-500"
                        style={{
                          background: `linear-gradient(135deg, hsl(${service.color} / 0.2) 0%, hsl(${service.color} / 0.08) 100%)`,
                          border: `1px solid hsl(${service.color} / 0.25)`,
                          boxShadow: `0 0 20px hsl(${service.color} / 0.15)`,
                        }}
                      >
                        <service.icon
                          size={20}
                          style={{ color: `hsl(${service.color})`, filter: `drop-shadow(0 0 6px hsl(${service.color} / 0.6))` }}
                        />
                      </div>
                      <span
                        className="text-[8px] sm:text-[9px] font-display font-bold tracking-[0.3em] uppercase px-2.5 py-1 rounded-full"
                        style={{
                          color: `hsl(${service.color})`,
                          background: `hsl(${service.color} / 0.1)`,
                          border: `1px solid hsl(${service.color} / 0.2)`,
                        }}
                      >
                        {service.tag}
                      </span>
                    </div>

                    <h3
                      className="font-display font-bold text-sm sm:text-base mb-2 sm:mb-3 transition-colors duration-300"
                      style={{ color: `hsl(${service.color} / 0.9)` }}
                    >
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground text-xs sm:text-sm mb-4 sm:mb-6 flex-1 leading-[1.7]">{service.desc}</p>

                    <div
                      className="flex items-center justify-between pt-4 sm:pt-5"
                      style={{ borderTop: `1px solid hsl(${service.color} / 0.12)` }}
                    >
                      <span
                        className="font-display font-bold text-xs sm:text-sm"
                        style={{ color: `hsl(${service.color})` }}
                      >
                        {service.price}
                      </span>
                      <button
                        onClick={() => setInquiryOpen(true)}
                        className="flex items-center gap-1.5 text-[10px] sm:text-xs font-display font-semibold tracking-wider uppercase transition-all duration-300 group/btn"
                        style={{ color: `hsl(${service.color} / 0.6)` }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = `hsl(${service.color})`)}
                        onMouseLeave={(e) => (e.currentTarget.style.color = `hsl(${service.color} / 0.6)`)}
                      >
                        Inquire
                        <ArrowRight size={12} className="group-hover/btn:translate-x-1 transition-transform duration-300" />
                      </button>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tab-specific inquiry dialogs */}
      {inquiry && (
        <ServiceInquiryDialog
          open={inquiryOpen}
          onOpenChange={setInquiryOpen}
          title={inquiry.title}
          subtitle={inquiry.subtitle}
          color={inquiry.color}
          emailSubject={inquiry.emailSubject}
          fields={inquiry.fields}
        />
      )}

      {/* Automotive dialog */}
      <AutomotiveDialog open={autoDialogOpen} onOpenChange={setAutoDialogOpen} />
    </section>
  );
};

export default ServicesSection;
