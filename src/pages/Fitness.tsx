import { useState } from "react";
import SEOHead from "@/components/SEOHead";
import { seoPages } from "@/lib/seoData";
import { ArrowLeft, ArrowRight, Dumbbell, Heart, Apple, Calendar, Users, Target, Flame, Trophy, type LucideIcon } from "lucide-react";
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

const COLOR = "24 32% 52%";

interface FitnessService {
  icon: LucideIcon;
  name: string;
  desc: string;
  detail: string;
}

const fitnessServices: FitnessService[] = [
  { icon: Dumbbell, name: "Personal Training", desc: "1-on-1 training tailored to your goals.", detail: "Custom programming, form correction, accountability. In-person or remote." },
  { icon: Users, name: "Lifestyle Coaching", desc: "Holistic approach to fitness and daily habits.", detail: "Sleep, stress, routine, mindset — a full lifestyle shift." },
  { icon: Apple, name: "Nutrition Guidance", desc: "Macro-friendly meal planning and nutrition advice.", detail: "Custom macros, meal timing, and supplement recommendations." },
  { icon: Calendar, name: "Workout Programming", desc: "Structured programs built for results.", detail: "Periodized training — hypertrophy, strength, conditioning." },
  { icon: Target, name: "Goal-Specific Plans", desc: "Compete, cut, bulk, or just get moving.", detail: "Bodybuilding prep, weight loss, athletic performance, or general fitness." },
  { icon: Flame, name: "Group Training", desc: "Small group sessions for motivation and community.", detail: "2–4 person sessions. Shared energy, individual attention." },
  { icon: Heart, name: "Recovery & Wellness", desc: "Cold plunge, sauna, red light, and mobility.", detail: "Recovery protocols using Impact Zone's full amenity suite." },
  { icon: Trophy, name: "Accountability Coaching", desc: "Weekly check-ins and progress tracking.", detail: "Photos, weigh-ins, habit tracking, and adjustments." },
];

const Fitness = () => {
  const [inquiryOpen, setInquiryOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden noise-overlay">
      <SEOHead {...seoPages["/fitness"]} canonicalPath="/fitness" jsonLd={[getServiceSchema("fitness"), getFAQSchema("fitness")]} />
      <FloatingNav />

      <section className="section-padding pt-32 sm:pt-40">
        <div className="container-tight">
          <Link to="/#services" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-display mb-8">
            <ArrowLeft size={16} />
            Back to home
          </Link>

          <SectionHeader
            as="h1"
            numeral="07"
            eyebrow="Fitness"
            accentColor={COLOR}
            title={<>Train with <span className="italic font-light" style={{ color: `hsl(${COLOR})` }}>purpose.</span></>}
            description="Personal training, lifestyle coaching, nutrition, and structured programming. Whether you're starting or leveling up — I'll build the plan and keep you accountable."
          />

          <div className="mb-10 sm:mb-12">
            <button
              onClick={() => setInquiryOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-display font-semibold bg-foreground text-background hover:bg-foreground/90 transition-all"
            >
              Get started
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 mb-12">
            {fitnessServices.map((service, i) => (
              <ServiceCard
                key={service.name}
                icon={service.icon}
                name={service.name}
                desc={service.desc}
                detail={service.detail}
                index={i}
                accentColor={COLOR}
              />
            ))}
          </div>

          <ServiceDeep slug="fitness" />
          <RelatedServices current="fitness" />
        </div>
      </section>

      <Footer />
      <MobileBottomNav />

      <ServiceInquiryDialog
        open={inquiryOpen}
        onOpenChange={setInquiryOpen}
        title="Fitness inquiry"
        subtitle="Tell me where you're at and where you want to go."
        color={COLOR}
        emailSubject="Fitness Inquiry"
        fields={[
          { key: "service", label: "Which service?", placeholder: "Select…", type: "select", options: ["Not sure yet", ...fitnessServices.map((s) => s.name)], required: true },
          { key: "goals", label: "What are your goals?", placeholder: "Lose weight, build muscle, compete, general health…", type: "textarea", rows: 3, required: true },
          { key: "experience", label: "Current fitness level", placeholder: "Beginner, intermediate, advanced…", type: "input", required: true },
          { key: "schedule", label: "Availability", placeholder: "Mornings, evenings, weekends, flexible…", type: "input" },
          { key: "location", label: "In-person or remote?", placeholder: "Impact Zone NJ, remote, hybrid…", type: "input" },
        ]}
      />
    </div>
  );
};

export default Fitness;
