import { useState } from "react";
import SEOHead from "@/components/SEOHead";
import { seoPages } from "@/lib/seoData";
import { ArrowLeft, ArrowRight, CreditCard, DollarSign, Wrench, Building2, TrendingUp, ShieldCheck } from "lucide-react";
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

const COLOR = "24 38% 56%";

const financingServices = [
  { icon: CreditCard, name: "Business Financing", desc: "Need capital for your business? I'll connect you with lenders who get it done.", detail: "SBA loans, lines of credit, MCA, revenue-based financing." },
  { icon: ShieldCheck, name: "Credit Repair & Building", desc: "Get connected with credit specialists who can rebuild your score.", detail: "Disputes, tradelines, and credit-building programs." },
  { icon: Wrench, name: "Equipment Financing", desc: "Gym equipment, vehicles, business tools — get financed.", detail: "Flexible terms across gyms, restaurants, construction, medical." },
  { icon: Building2, name: "Real Estate Financing", desc: "Commercial or residential — I know the right lenders.", detail: "Investment, commercial, construction loans across the tri-state." },
  { icon: TrendingUp, name: "Startup Funding", desc: "Early-stage capital and investor introductions.", detail: "Angels, VC intros, pitch deck guidance." },
  { icon: DollarSign, name: "Debt Consolidation", desc: "Simplify your payments and lower your rates.", detail: "Business and personal consolidation through trusted partners." },
];

const Financing = () => {
  const [inquiryOpen, setInquiryOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden noise-overlay">
      <SEOHead {...seoPages["/financing"]} canonicalPath="/financing" jsonLd={[getServiceSchema("financing"), getFAQSchema("financing")]} />
      <FloatingNav />

      <section className="section-padding pt-32 sm:pt-40">
        <div className="container-tight">
          <Link to="/#services" className="inline-flex items-center gap-2 text-muted-foreground md:hover:text-foreground transition-colors text-sm font-display mb-8">
            <ArrowLeft size={16} />
            Back to home
          </Link>

          <SectionHeader
            as="h1"
            numeral="05"
            eyebrow="Financing"
            accentColor={COLOR}
            title={<>Get funded. <span className="italic font-light" style={{ color: `hsl(${COLOR})` }}>Get moving.</span></>}
            description="I'll connect you with the right financing experts, lenders, and credit specialists. Free introductions — I just make sure you're taken care of."
          />

          <div className="mb-10 sm:mb-12">
            <button
              onClick={() => setInquiryOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-display font-semibold bg-foreground text-background md:hover:bg-foreground/90 transition-all"
            >
              Get connected
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 mb-12">
            {financingServices.map((service, i) => (
              <ServiceCard
                key={service.name}
                icon={service.icon}
                name={service.name}
                desc={service.desc}
                detail={service.detail}
                meta="Free intro"
                index={i}
                accentColor={COLOR}
              />
            ))}
          </div>

          <ServiceDeep slug="financing" />
          <RelatedServices current="financing" />
        </div>
      </section>

      <Footer />
      <MobileBottomNav />

      <ServiceInquiryDialog
        open={inquiryOpen}
        onOpenChange={setInquiryOpen}
        title="Financing inquiry"
        subtitle="Tell me what you need and I'll connect you with the right expert."
        color={COLOR}
        emailSubject="Financing Inquiry"
        fields={[
          { key: "service", label: "What do you need?", placeholder: "Select…", type: "select", options: ["Not sure yet", ...financingServices.map((s) => s.name)], required: true },
          { key: "amount", label: "Amount needed", placeholder: "$10K, $50K, $100K+…", type: "input" },
          { key: "business", label: "Business details", placeholder: "Type, years operating, credit score range…", type: "textarea", rows: 3, required: true },
          { key: "timeline", label: "How soon do you need this?", placeholder: "ASAP, 30 days, flexible…", type: "input" },
        ]}
      />
    </div>
  );
};

export default Financing;
