import { useState } from "react";
import SEOHead from "@/components/SEOHead";
import { seoPages } from "@/lib/seoData";
import { ArrowLeft, ArrowRight, Briefcase, DollarSign, Droplets, TrendingUp, BarChart3, Megaphone } from "lucide-react";
import { Link } from "react-router-dom";
import FloatingNav from "@/components/FloatingNav";
import MobileBottomNav from "@/components/MobileBottomNav";
import Footer from "@/components/Footer";
import ServiceInquiryDialog from "@/components/services/ServiceInquiryDialog";
import ServiceCard from "@/components/services/ServiceCard";
import SectionHeader from "@/components/SectionHeader";
import ServiceDeep from "@/components/services/ServiceDeep";
import RelatedServices from "@/components/services/RelatedServices";
import { getFAQSchema, getServiceSchema } from "@/lib/serviceContent";

const COLOR = "270 16% 50%";

const consultingServices = [
  { icon: Briefcase, name: "Brand Consulting", desc: "I'll break down your brand, content, and revenue strategy.", detail: "Full audit, positioning, content direction, monetization roadmap.", price: "Starting at $500" },
  { icon: DollarSign, name: "Brand Clarity Calls", desc: "30 minutes — direct feedback on what's working and what's not.", detail: "Walk away with a clear action plan.", price: "$150 / 30 min" },
  { icon: Droplets, name: "2THIRTY Wholesale", desc: "Stock 2THIRTY at your gym, studio, or store.", detail: "Zero sugar, 5-in-1 hydration mixer. Bulk pricing available.", price: "Request a quote" },
  { icon: TrendingUp, name: "Revenue Strategy", desc: "Maximize what you're already doing. Find the gaps.", detail: "Stream analysis, pricing optimization, recurring revenue models.", price: "Starting at $750" },
  { icon: BarChart3, name: "Market Positioning", desc: "Stand out in a crowded market. Own your lane.", detail: "Competitive analysis and unique value prop development.", price: "Starting at $500" },
  { icon: Megaphone, name: "Content Strategy", desc: "Build a content engine that drives revenue.", detail: "Platform strategy, calendar, growth tactics, conversion.", price: "Starting at $400" },
];

const Consulting = () => {
  const [inquiryOpen, setInquiryOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden noise-overlay">
      <SEOHead {...seoPages["/consulting"]} canonicalPath="/consulting" jsonLd={[getServiceSchema("consulting"), getFAQSchema("consulting")]} />
      <FloatingNav />

      <section className="section-padding pt-32 sm:pt-40">
        <div className="container-tight">
          <Link to="/#services" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-display mb-8">
            <ArrowLeft size={16} />
            Back to home
          </Link>

          <SectionHeader
            as="h1"
            numeral="01"
            eyebrow="Consulting"
            accentColor={COLOR}
            title={<>Build smarter. <span className="italic font-light" style={{ color: `hsl(${COLOR})` }}>Scale faster.</span></>}
            description="Brand strategy, revenue optimization, and content direction. I've built multiple brands from scratch — let me show you what actually works."
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
            {consultingServices.map((service, i) => (
              <ServiceCard
                key={service.name}
                icon={service.icon}
                name={service.name}
                desc={service.desc}
                detail={service.detail}
                meta={service.price}
                index={i}
                accentColor={COLOR}
              />
            ))}
          </div>

          <ServiceDeep slug="consulting" />
          <RelatedServices current="consulting" />
        </div>
      </section>

      <Footer />
      <MobileBottomNav />

      <ServiceInquiryDialog
        open={inquiryOpen}
        onOpenChange={setInquiryOpen}
        title="Consulting inquiry"
        subtitle="Tell me about your brand and what you need help with."
        color={COLOR}
        emailSubject="Consulting Inquiry"
        fields={[
          { key: "service", label: "Which service?", placeholder: "Select…", type: "select", options: ["Not sure yet", ...consultingServices.map((s) => s.name)], required: true },
          { key: "brand", label: "Your brand / business", placeholder: "Company name and what you do", type: "input", required: true },
          { key: "revenue", label: "Current revenue range", placeholder: "Pre-revenue, $10K/mo, $100K/mo…", type: "input" },
          { key: "help", label: "What do you need help with?", placeholder: "Content, revenue growth, positioning…", type: "textarea", rows: 3, required: true },
          { key: "budget", label: "Budget & timeline", placeholder: "Budget range and when you want to start", type: "input" },
        ]}
      />
    </div>
  );
};

export default Consulting;
