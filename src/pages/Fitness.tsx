import { useState } from "react";
import SEOHead from "@/components/SEOHead";
import { seoPages } from "@/lib/seoData";
import {
  ArrowLeft,
  ArrowRight,
  Dumbbell,
  Heart,
  Apple,
  Calendar,
  Users,
  Target,
  Flame,
  Trophy,
  Building2,
  User,
  Snowflake,
  Sun,
  type LucideIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import FloatingNav from "@/components/FloatingNav";
import MobileBottomNav from "@/components/MobileBottomNav";
import Footer from "@/components/Footer";
import ServiceInquiryDialog from "@/components/services/ServiceInquiryDialog";
import SectionHeader from "@/components/SectionHeader";
import ServiceDeep from "@/components/services/ServiceDeep";
import RelatedServices from "@/components/services/RelatedServices";
import { getFAQSchema, getServiceSchema } from "@/lib/serviceContent";
import { motion } from "framer-motion";

const COLOR = "24 32% 52%";

type Path = "coach" | "gym";

interface OptionItem {
  icon: LucideIcon;
  name: string;
  desc: string;
}

const COACH_OPTIONS: OptionItem[] = [
  { icon: Dumbbell, name: "Personal Training", desc: "1-on-1 sessions, custom programming, form correction." },
  { icon: Calendar, name: "Workout Programming", desc: "Periodized plans — hypertrophy, strength, conditioning." },
  { icon: Apple, name: "Nutrition Guidance", desc: "Macros, meal timing, supplementation dialed in." },
  { icon: Target, name: "Goal-Specific Plans", desc: "Compete, cut, bulk, post-rehab, or general fitness." },
  { icon: Users, name: "Lifestyle Coaching", desc: "Sleep, stress, routine, mindset — full lifestyle shift." },
  { icon: Trophy, name: "Accountability Coaching", desc: "Weekly check-ins, photos, weigh-ins, adjustments." },
];

const GYM_OPTIONS: OptionItem[] = [
  { icon: Building2, name: "Impact Zone Membership", desc: "24/7 access to the full facility in Wayne, NJ." },
  { icon: User, name: "Open Gym & Day Pass", desc: "Drop in, try it out, train on your schedule." },
  { icon: Flame, name: "Group Training & Classes", desc: "Small group sessions — shared energy, individual attention." },
  { icon: Snowflake, name: "Cold Plunge & Recovery", desc: "Cold plunge, sauna, red light, mobility tools." },
  { icon: Sun, name: "Turf, Lifting & Cardio", desc: "Full turf, heavy lifting platforms, conditioning floor." },
  { icon: Heart, name: "Trainer Match", desc: "Get paired with the right Impact Zone trainer for your goal." },
];

const Fitness = () => {
  const [path, setPath] = useState<Path | null>(null);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>("");

  const openInquiry = (optionName: string) => {
    setSelectedOption(optionName);
    setInquiryOpen(true);
  };

  const isCoach = path === "coach";
  const options = isCoach ? COACH_OPTIONS : GYM_OPTIONS;

  return (
    <div className="min-h-screen bg-background overflow-x-hidden noise-overlay">
      <SEOHead
        {...seoPages["/fitness"]}
        canonicalPath="/fitness"
        jsonLd={[getServiceSchema("fitness"), getFAQSchema("fitness")]}
      />
      <FloatingNav />

      <section className="section-padding pt-32 sm:pt-40">
        <div className="container-tight">
          <Link
            to="/#services"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-display mb-8"
          >
            <ArrowLeft size={16} />
            Back to home
          </Link>

          <SectionHeader
            as="h1"
            numeral="07"
            eyebrow="Fitness"
            accentColor={COLOR}
            title={
              <>
                Train with{" "}
                <span className="italic font-light" style={{ color: `hsl(${COLOR})` }}>
                  purpose.
                </span>
              </>
            }
            description="Coaching, programming, and a real gym to do the work in. Pick your path — I'll handle the rest."
          />

          {/* Step 1: Path picker */}
          <div className="mb-8 sm:mb-10">
            <p className="font-mono text-[10px] text-foreground/50 mb-3 tracking-tight">
              [ Step 1 ] What are you looking for?
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(
                [
                  { id: "coach" as Path, icon: Dumbbell, label: "Coaching & training", sub: "1-on-1, programming, nutrition, accountability." },
                  { id: "gym" as Path, icon: Building2, label: "Impact Zone gym", sub: "Membership, classes, recovery, day passes." },
                ]
              ).map((p) => {
                const Icon = p.icon;
                const active = path === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      setPath(p.id);
                    }}
                    className={`group text-left rounded-2xl p-5 sm:p-6 border transition-all tap-highlight-transparent ${
                      active
                        ? "bg-card border-transparent"
                        : "bg-card/40 border-border/40 md:hover:border-accent/40 md:hover:bg-card/70"
                    }`}
                    style={
                      active
                        ? { borderColor: `hsl(${COLOR} / 0.6)`, boxShadow: `0 0 0 1px hsl(${COLOR} / 0.25)` }
                        : undefined
                    }
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center border border-border/50 bg-background"
                        style={active ? { color: `hsl(${COLOR})`, borderColor: `hsl(${COLOR} / 0.4)` } : undefined}
                      >
                        <Icon size={20} strokeWidth={1.6} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-display font-semibold text-base sm:text-lg leading-tight">{p.label}</h3>
                        <p className="text-muted-foreground text-xs sm:text-sm mt-0.5">{p.sub}</p>
                      </div>
                      <ArrowRight
                        size={16}
                        className={`transition-all ${active ? "translate-x-0.5" : "text-muted-foreground"}`}
                        style={active ? { color: `hsl(${COLOR})` } : undefined}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Options */}
          {path && (
            <motion.div
              key={path}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="mb-12 sm:mb-16"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="font-mono text-[10px] text-foreground/50 tracking-tight">
                  [ Step 2 ] {isCoach ? "Pick what you need" : "Pick what you want at the gym"}
                </p>
                <button
                  onClick={() => openInquiry("Not sure yet")}
                  className="text-[11px] font-display text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
                >
                  Not sure? Just talk to me →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                {options.map((opt, i) => {
                  const Icon = opt.icon;
                  return (
                    <motion.button
                      key={opt.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.4 }}
                      onClick={() => openInquiry(opt.name)}
                      className="group relative text-left rounded-xl p-4 sm:p-5 bg-card border border-border/40 md:hover:border-accent/40 transition-all tap-highlight-transparent"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 shrink-0 rounded-lg flex items-center justify-center bg-background border border-border/40 text-muted-foreground md:group-hover:text-accent transition-colors">
                          <Icon size={16} strokeWidth={1.6} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="font-display font-semibold text-sm sm:text-base leading-tight">
                              {opt.name}
                            </h4>
                            <ArrowRight
                              size={14}
                              className="text-muted-foreground/60 md:group-hover:text-accent md:group-hover:translate-x-0.5 transition-all"
                            />
                          </div>
                          <p className="text-muted-foreground text-xs leading-relaxed mt-1">{opt.desc}</p>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          <ServiceDeep slug="fitness" />
          <RelatedServices current="fitness" />
        </div>
      </section>

      <Footer />
      <MobileBottomNav />

      <ServiceInquiryDialog
        open={inquiryOpen}
        onOpenChange={setInquiryOpen}
        title={isCoach ? "Coaching inquiry" : "Impact Zone inquiry"}
        subtitle={
          isCoach
            ? "Tell me where you're at and where you want to go — I'll build the plan."
            : "Tell me how you want to use the gym — I'll get you set up."
        }
        color={COLOR}
        emailSubject={`Fitness — ${isCoach ? "Coaching" : "Impact Zone"}${selectedOption ? ` — ${selectedOption}` : ""}`}
        fields={
          isCoach
            ? [
                {
                  key: "service",
                  label: "Which service?",
                  placeholder: "Select…",
                  type: "select",
                  options: ["Not sure yet", ...COACH_OPTIONS.map((o) => o.name)],
                  required: true,
                  defaultValue:
                    selectedOption && COACH_OPTIONS.some((o) => o.name === selectedOption) ? selectedOption : undefined,
                },
                { key: "goals", label: "What are your goals?", placeholder: "Lose weight, build muscle, compete, general health…", type: "textarea", rows: 3, required: true },
                { key: "experience", label: "Current fitness level", placeholder: "Beginner, intermediate, advanced…", type: "input", required: true },
                { key: "schedule", label: "Availability", placeholder: "Mornings, evenings, weekends, flexible…", type: "input" },
                { key: "location", label: "In-person or remote?", placeholder: "Impact Zone NJ, remote, hybrid…", type: "input" },
              ]
            : [
                {
                  key: "service",
                  label: "What are you interested in?",
                  placeholder: "Select…",
                  type: "select",
                  options: ["Not sure yet", ...GYM_OPTIONS.map((o) => o.name)],
                  required: true,
                  defaultValue:
                    selectedOption && GYM_OPTIONS.some((o) => o.name === selectedOption) ? selectedOption : undefined,
                },
                { key: "goals", label: "What are you training for?", placeholder: "General fitness, strength, recovery, sport-specific…", type: "textarea", rows: 3, required: true },
                { key: "experience", label: "Experience level", placeholder: "Beginner, intermediate, advanced…", type: "input" },
                { key: "schedule", label: "When would you train?", placeholder: "Mornings, evenings, weekends, 24/7…", type: "input" },
                { key: "tour", label: "Want a tour of the facility?", placeholder: "Yes — best day/time, or just send info…", type: "input" },
              ]
        }
      />
    </div>
  );
};

export default Fitness;
