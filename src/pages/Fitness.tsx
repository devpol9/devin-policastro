import { useState } from "react";
import SEOHead from "@/components/SEOHead";
import { seoPages } from "@/lib/seoData";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Dumbbell, Heart, Apple, Calendar, Users, Target, Flame, Trophy, type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import FloatingNav from "@/components/FloatingNav";
import MobileBottomNav from "@/components/MobileBottomNav";
import Footer from "@/components/Footer";
import ServiceInquiryDialog from "@/components/services/ServiceInquiryDialog";
import SectionHeader from "@/components/SectionHeader";

const COLOR = "24 32% 52%";

interface FitnessService {
  icon: LucideIcon;
  name: string;
  desc: string;
  detail: string;
  tag: string;
}

const fitnessServices: FitnessService[] = [
  {
    icon: Dumbbell,
    name: "Personal Training",
    desc: "1-on-1 training tailored to your goals.",
    detail: "Custom programming, form correction, accountability. In-person at Impact Zone NJ or remote.",
    tag: "TRAINING",
  },
  {
    icon: Users,
    name: "Lifestyle Coaching",
    desc: "Holistic approach to fitness and daily habits.",
    detail: "Sleep, stress management, routine building, mindset. Not just workouts — a full lifestyle shift.",
    tag: "COACHING",
  },
  {
    icon: Apple,
    name: "Nutrition Guidance",
    desc: "Macro-friendly meal planning and nutrition advice.",
    detail: "Custom macro targets, meal timing, supplement recommendations. Built around your schedule and preferences.",
    tag: "NUTRITION",
  },
  {
    icon: Calendar,
    name: "Workout Programming",
    desc: "Structured programs built for results.",
    detail: "Periodized training blocks — hypertrophy, strength, conditioning. Weekly or monthly programming.",
    tag: "PROGRAMS",
  },
  {
    icon: Target,
    name: "Goal-Specific Plans",
    desc: "Compete, cut, bulk, or just get moving.",
    detail: "Bodybuilding prep, weight loss, athletic performance, or general fitness. Plans built for your timeline.",
    tag: "GOALS",
  },
  {
    icon: Flame,
    name: "Group Training",
    desc: "Small group sessions for motivation and community.",
    detail: "2-4 person sessions. Shared energy, individual attention. Perfect for friends or couples.",
    tag: "GROUP",
  },
  {
    icon: Heart,
    name: "Recovery & Wellness",
    desc: "Cold plunge, sauna, red light, and mobility.",
    detail: "Recovery protocols using Impact Zone's full amenity suite. Integrated into your training plan.",
    tag: "RECOVERY",
  },
  {
    icon: Trophy,
    name: "Accountability Coaching",
    desc: "Weekly check-ins and progress tracking.",
    detail: "Photo check-ins, weigh-ins, habit tracking, and adjustments. Stay on track with direct access.",
    tag: "ACCOUNTABILITY",
  },
];

const Fitness = () => {
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const [generalInquiryOpen, setGeneralInquiryOpen] = useState(false);

  const openInquiry = (serviceName: string) => {
    setSelectedService(serviceName);
    setInquiryOpen(true);
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden noise-overlay">
      <SEOHead {...seoPages["/fitness"]} canonicalPath="/fitness" />
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
            numeral="07"
            eyebrow="Fitness"
            accentColor={COLOR}
            title={<>Train with <span className="italic font-light" style={{ color: `hsl(${COLOR})` }}>purpose.</span></>}
            description="Personal training, lifestyle coaching, nutrition, and structured programming. Whether you're just starting or leveling up — I'll build the plan and keep you accountable."
          />
          <div className="mb-10 sm:mb-16">
            <button
              onClick={() => setGeneralInquiryOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-display font-semibold transition-all duration-300 hover:scale-[1.02]"
              style={{
                background: `hsl(${COLOR})`,
                color: `hsl(36 30% 98%)`,
              }}
            >
              Get Started
              <ArrowRight size={14} />
            </button>
          </motion.div>

          {/* Services Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-12">
            {fitnessServices.map((service, i) => {
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

                    <h3
                      className="font-display font-bold text-sm sm:text-base mb-2 transition-colors duration-300"
                      style={{ color: `hsl(${COLOR} / 0.9)` }}
                    >
                      {service.name}
                    </h3>
                    <p className="text-muted-foreground text-xs leading-relaxed mb-1">{service.desc}</p>
                    <p className="text-muted-foreground/60 text-[11px] leading-relaxed mb-5">{service.detail}</p>

                    <div
                      className="pt-4"
                      style={{ borderTop: `1px solid hsl(${COLOR} / 0.12)` }}
                    >
                      <button
                        onClick={() => openInquiry(service.name)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-display font-semibold tracking-[0.06em]  transition-all duration-300 hover:scale-[1.02]"
                        style={{
                          background: `hsl(${COLOR})`,
                          color: `hsl(36 30% 98%)`,
                        }}
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
        subtitle="Tell me about your goals and I'll build the right plan for you."
        color={COLOR}
        emailSubject={`Fitness Inquiry: ${selectedService}`}
        fields={[
          { key: "goals", label: "What are your fitness goals?", placeholder: "Lose weight, build muscle, get stronger, feel better...", type: "textarea", rows: 2, required: true },
          { key: "experience", label: "Training experience", placeholder: "Beginner, intermediate, advanced, returning after break...", type: "input", required: true },
          { key: "schedule", label: "How many days per week?", placeholder: "3 days, 5 days, flexible...", type: "input" },
          { key: "location", label: "In-person or remote?", placeholder: "Impact Zone NJ, remote, hybrid...", type: "input" },
        ]}
      />

      <ServiceInquiryDialog
        open={generalInquiryOpen}
        onOpenChange={setGeneralInquiryOpen}
        title="Fitness Inquiry"
        subtitle="Tell me where you're at and where you want to go."
        color={COLOR}
        emailSubject="General Fitness Inquiry"
        fields={[
          { key: "goals", label: "What are your goals?", placeholder: "Lose weight, build muscle, compete, general health...", type: "textarea", rows: 2, required: true },
          { key: "experience", label: "Current fitness level", placeholder: "Beginner, intermediate, advanced...", type: "input", required: true },
          { key: "interests", label: "What services interest you?", placeholder: "Personal training, nutrition, coaching, programming...", type: "input" },
          { key: "schedule", label: "Availability", placeholder: "Mornings, evenings, weekends, flexible...", type: "input" },
        ]}
      />
    </div>
  );
};

export default Fitness;
