import { useState } from "react";
import SEOHead from "@/components/SEOHead";
import { seoPages } from "@/lib/seoData";
import { ArrowLeft, ArrowRight, Handshake, Camera, Users, Globe, Briefcase, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import FloatingNav from "@/components/FloatingNav";
import MobileBottomNav from "@/components/MobileBottomNav";
import Footer from "@/components/Footer";
import ServiceInquiryDialog from "@/components/services/ServiceInquiryDialog";
import ServiceCard from "@/components/services/ServiceCard";
import SectionHeader from "@/components/SectionHeader";

const COLOR = "140 18% 42%";

const networkingServices = [
  { icon: Handshake, name: "Paid Introductions", desc: "I know people across Bergen County and beyond.", detail: "Contractors, suppliers, investors, partners — connected directly.", price: "$100–$500" },
  { icon: Camera, name: "Influencer Collabs", desc: "If your brand fits my audience, let's create content that converts.", detail: "Reviews, sponsored content, UGC, event coverage.", price: "Starting at $250" },
  { icon: Users, name: "Partnership Brokering", desc: "I'll find the right partner for your business.", detail: "Strategic partnerships, co-ventures, joint marketing.", price: "$250–$1K" },
  { icon: Globe, name: "Vendor Sourcing", desc: "Need a supplier, manufacturer, or service provider?", detail: "I'll tap my network — any industry, any scale.", price: "$100–$300" },
  { icon: Briefcase, name: "Talent & Hiring", desc: "Looking for the right person for the job?", detail: "Trainers, managers, designers, developers, marketers.", price: "$150–$500" },
  { icon: MessageSquare, name: "Advisory Intros", desc: "Connect with advisors, mentors, and industry leaders.", detail: "Introductions to operators who can guide your next move.", price: "$200–$500" },
];

const Networking = () => {
  const [inquiryOpen, setInquiryOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden noise-overlay">
      <SEOHead {...seoPages["/networking"]} canonicalPath="/networking" />
      <FloatingNav />

      <section className="section-padding pt-32 sm:pt-40">
        <div className="container-tight">
          <Link to="/#services" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-display mb-8">
            <ArrowLeft size={16} />
            Back to home
          </Link>

          <SectionHeader
            as="h1"
            numeral="06"
            eyebrow="Networking"
            accentColor={COLOR}
            title={<>I know <span className="italic font-light" style={{ color: `hsl(${COLOR})` }}>the right people.</span></>}
            description="Need an introduction, a vendor, a partner? Tell me what you're looking for and I'll connect you with someone who can help."
          />

          <div className="mb-10 sm:mb-12">
            <button
              onClick={() => setInquiryOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-display font-semibold bg-foreground text-background hover:bg-foreground/90 transition-all"
            >
              Request an intro
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 mb-12">
            {networkingServices.map((service, i) => (
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
        </div>
      </section>

      <Footer />
      <MobileBottomNav />

      <ServiceInquiryDialog
        open={inquiryOpen}
        onOpenChange={setInquiryOpen}
        title="Networking inquiry"
        subtitle="Tell me who you're looking for and I'll make the introduction."
        color={COLOR}
        emailSubject="Networking Inquiry"
        fields={[
          { key: "service", label: "What kind of help?", placeholder: "Select…", type: "select", options: ["Not sure yet", ...networkingServices.map((s) => s.name)], required: true },
          { key: "looking-for", label: "Who are you looking for?", placeholder: "Contractor, supplier, investor, partner…", type: "input", required: true },
          { key: "industry", label: "Industry / niche", placeholder: "Fitness, real estate, automotive, tech…", type: "input", required: true },
          { key: "context", label: "Why do you need this intro?", placeholder: "Starting a business, need a vendor, looking for talent…", type: "textarea", rows: 3 },
          { key: "budget", label: "Budget for intro fee", placeholder: "$100, $250, $500…", type: "input" },
        ]}
      />
    </div>
  );
};

export default Networking;
