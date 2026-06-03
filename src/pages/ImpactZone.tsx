import { useState } from "react";
import SEOHead from "@/components/SEOHead";
import { localBusinessJsonLd } from "@/lib/seoData";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Snowflake,
  Flame,
  Sun,
  Heart,
  Dumbbell,
  Users,
  CalendarCheck,
  Sparkles,
  Waves,
  type LucideIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import FloatingNav from "@/components/FloatingNav";
import MobileBottomNav from "@/components/MobileBottomNav";
import Footer from "@/components/Footer";
import ServiceInquiryDialog from "@/components/services/ServiceInquiryDialog";
import SectionHeader from "@/components/SectionHeader";
import { motion } from "framer-motion";

const COLOR = "38 55% 58%";

type Path = "join" | "visit";

interface OptionItem {
  icon: LucideIcon;
  name: string;
  desc: string;
}

const JOIN_OPTIONS: OptionItem[] = [
  { icon: Building2, name: "Full Membership", desc: "24/7 access to the full 51,000 sq ft facility. No long-term contracts." },
  { icon: Dumbbell, name: "Personal Training", desc: "Get matched with an Impact Zone trainer for your goal." },
  { icon: Users, name: "Group Training & Classes", desc: "Small group sessions, hot yoga, conditioning — shared energy, personal attention." },
  { icon: Heart, name: "Recovery Membership", desc: "Cold plunge, infrared sauna, red light, mobility add-on." },
];

const VISIT_OPTIONS: OptionItem[] = [
  { icon: CalendarCheck, name: "Book a Tour", desc: "Walk the floor, meet the team, see the recovery suite." },
  { icon: Sparkles, name: "Day Pass / Drop-In", desc: "Train for a day — open gym, turf, machines, recovery." },
  { icon: Snowflake, name: "Cold Plunge Session", desc: "Single cold plunge + sauna contrast session." },
  { icon: Sun, name: "Infrared Sauna", desc: "Single infrared sauna session — book a slot." },
  { icon: Flame, name: "Hot Yoga Class", desc: "Drop into a hot yoga class — no membership needed." },
  { icon: Waves, name: "Red Light Therapy", desc: "Recovery and skin protocol — single or pack." },
];

const seo = {
  title: "Impact Zone Fitness — Gym, Recovery & Training | Norwood, NJ",
  description:
    "51,000 sq ft of gym, recovery, and training in Norwood, NJ. Cold plunge, infrared sauna, hot yoga, red light, turf, basketball, 24/7 access. No contracts.",
};

const ImpactZone = () => {
  const [path, setPath] = useState<Path | null>(null);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>("");

  const openInquiry = (optionName: string) => {
    setSelectedOption(optionName);
    setInquiryOpen(true);
  };

  const isJoin = path === "join";
  const options = isJoin ? JOIN_OPTIONS : VISIT_OPTIONS;

  return (
    <div className="min-h-screen bg-background overflow-x-hidden noise-overlay">
      <SEOHead {...seo} canonicalPath="/impact-zone" />
      <FloatingNav />

      <section className="section-padding pt-32 sm:pt-40">
        <div className="container-tight">
          <Link
            to="/#services"
            className="inline-flex items-center gap-2 text-muted-foreground md:hover:text-foreground transition-colors text-sm font-display mb-8"
          >
            <ArrowLeft size={16} />
            Back to home
          </Link>

          <SectionHeader
            as="h1"
            numeral="07"
            eyebrow="Impact Zone"
            accentColor={COLOR}
            title={
              <>
                51,000 sq ft. Train.{" "}
                <span className="italic font-light" style={{ color: `hsl(${COLOR})` }}>
                  Recover.
                </span>
              </>
            }
            description="Norwood, NJ. 100+ machines, cold plunge, infrared sauna, hot yoga, red light, basketball court, sports turf. No long-term contracts."
          />

          {/* Facility photo strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-10 sm:mb-12">
            {[
              { src: "/images/iz-hero.jpg", label: "The floor" },
              { src: "/images/iz-machines-red.jpg", label: "100+ machines" },
              { src: "/images/iz-cold-plunge.jpg", label: "Cold plunge" },
              { src: "/images/iz-basketball.jpg", label: "Court & turf" },
            ].map((img) => (
              <div key={img.src} className="group relative aspect-[4/5] sm:aspect-[3/4] rounded-xl overflow-hidden bg-card border border-border/30">
                <img
                  src={img.src}
                  alt={`Impact Zone — ${img.label}`}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 md:group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/20 to-transparent" />
                <span className="absolute bottom-2 left-2.5 sm:bottom-3 sm:left-3 text-[10px] sm:text-xs font-display font-semibold text-foreground/90 tracking-tight">
                  {img.label}
                </span>
              </div>
            ))}
          </div>



          {/* Step 1: Path picker */}
          <div className="mb-8 sm:mb-10">
            <p className="font-mono text-[10px] text-foreground/50 mb-3 tracking-tight">
              [ Step 1 ] What are you looking for?
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(
                [
                  { id: "join" as Path, icon: Building2, label: "Become a member", sub: "24/7 access, training, recovery." },
                  { id: "visit" as Path, icon: CalendarCheck, label: "Visit or drop in", sub: "Tour, day pass, single sessions." },
                ]
              ).map((p) => {
                const Icon = p.icon;
                const active = path === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setPath(p.id)}
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
                  [ Step 2 ] {isJoin ? "Pick your membership type" : "Pick what you want to try"}
                </p>
                <button
                  onClick={() => openInquiry("Not sure yet")}
                  className="text-[11px] font-display text-muted-foreground md:hover:text-foreground transition-colors underline-offset-4 md:hover:underline"
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
                            <h4 className="font-display font-semibold text-sm sm:text-base leading-tight">{opt.name}</h4>
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

          {/* Cross-link to coaching */}
          <div className="rounded-2xl border border-border/40 bg-card/40 p-5 sm:p-6 mb-16 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-display font-semibold text-base sm:text-lg leading-tight">Want a coach, not just a gym?</h3>
              <p className="text-muted-foreground text-xs sm:text-sm mt-1">
                Personal training, programming, nutrition, lifestyle coaching — in-person or remote.
              </p>
            </div>
            <Link
              to="/fitness"
              className="inline-flex shrink-0 items-center gap-2 px-5 py-2.5 rounded-md text-sm font-display font-semibold border border-border md:hover:border-foreground/60 text-foreground transition-all"
            >
              See coaching options
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <MobileBottomNav />

      <ServiceInquiryDialog
        open={inquiryOpen}
        onOpenChange={setInquiryOpen}
        title={isJoin ? "Impact Zone — Membership" : "Impact Zone — Visit"}
        subtitle={
          isJoin
            ? "Tell me how you want to train — I'll get you set up with the right plan."
            : "Tell me when you'd like to come in — I'll book the tour or session."
        }
        color={COLOR}
        emailSubject={`Impact Zone — ${isJoin ? "Join" : "Visit"}${selectedOption ? ` — ${selectedOption}` : ""}`}
        fields={
          isJoin
            ? [
                {
                  key: "service",
                  label: "What are you interested in?",
                  placeholder: "Select…",
                  type: "select",
                  options: ["Not sure yet", ...JOIN_OPTIONS.map((o) => o.name)],
                  required: true,
                  defaultValue:
                    selectedOption && JOIN_OPTIONS.some((o) => o.name === selectedOption) ? selectedOption : undefined,
                },
                { key: "goals", label: "What are you training for?", placeholder: "General fitness, strength, recovery, sport-specific…", type: "textarea", rows: 3, required: true },
                { key: "experience", label: "Experience level", placeholder: "Beginner, intermediate, advanced…", type: "input" },
                { key: "schedule", label: "When would you train?", placeholder: "Mornings, evenings, weekends, 24/7…", type: "input" },
                { key: "start", label: "When do you want to start?", placeholder: "This week, this month, just exploring…", type: "input" },
              ]
            : [
                {
                  key: "service",
                  label: "What do you want to try?",
                  placeholder: "Select…",
                  type: "select",
                  options: ["Not sure yet", ...VISIT_OPTIONS.map((o) => o.name)],
                  required: true,
                  defaultValue:
                    selectedOption && VISIT_OPTIONS.some((o) => o.name === selectedOption) ? selectedOption : undefined,
                },
                { key: "when", label: "Preferred date & time", placeholder: "Saturday morning, weekday evening…", type: "input", required: true },
                { key: "who", label: "How many people?", placeholder: "Just me, partner, group of 4…", type: "input" },
                { key: "notes", label: "Anything I should know?", placeholder: "First-timer, injury, specific questions…", type: "textarea", rows: 2 },
              ]
        }
      />
    </div>
  );
};

export default ImpactZone;
