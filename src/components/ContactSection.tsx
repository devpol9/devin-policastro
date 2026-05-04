import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import {
  Send, Instagram, ArrowUpRight, Mail, MapPin, Calendar, ChevronDown,
  Dumbbell, Users, Target, Package, Lightbulb, Handshake, MessageCircle,
  type LucideIcon,
} from "lucide-react";
import MagneticButton from "@/components/effects/MagneticButton";
import { supabase } from "@/integrations/supabase/client";

type SubjectKey = "" | "gym-tour" | "membership" | "training" | "wholesale" | "brand-consulting" | "collab" | "general";

interface FieldConfig {
  key: string;
  label: string;
  placeholder: string;
  type: "input" | "textarea";
  required?: boolean;
  rows?: number;
}

interface SubjectOption {
  value: SubjectKey;
  label: string;
  icon: LucideIcon;
  description: string;
  fields: FieldConfig[];
}

const subjectOptions: SubjectOption[] = [
  {
    value: "gym-tour",
    label: "Book a Gym Tour",
    icon: Dumbbell,
    description: "Come see the facility in person",
    fields: [
      { key: "date", label: "Preferred Date & Time", placeholder: "e.g. Saturday morning, weekday evening...", type: "input", required: true },
      { key: "looking-for", label: "What are you looking for in a gym?", placeholder: "Recovery, lifting, classes, community...", type: "textarea", rows: 2 },
      { key: "experience", label: "Current training experience", placeholder: "Beginner, intermediate, advanced...", type: "input" },
    ],
  },
  {
    value: "membership",
    label: "Membership",
    icon: Users,
    description: "Join Impact Zone",
    fields: [
      { key: "routine", label: "Current fitness routine", placeholder: "How often do you train? What's your style?", type: "textarea", rows: 2 },
      { key: "interests", label: "What interests you most?", placeholder: "Cold plunge, sauna, turf, classes, open gym...", type: "input" },
      { key: "questions", label: "Questions about the facility?", placeholder: "Hours, pricing, class schedule...", type: "textarea", rows: 2 },
    ],
  },
  {
    value: "training",
    label: "Training / Coaching",
    icon: Target,
    description: "1-on-1 or group training",
    fields: [
      { key: "goals", label: "What are your goals?", placeholder: "Weight loss, muscle gain, sport-specific, rehab...", type: "textarea", rows: 2, required: true },
      { key: "experience", label: "Experience level", placeholder: "Beginner, intermediate, advanced...", type: "input" },
      { key: "schedule", label: "Preferred schedule", placeholder: "How many days per week? Morning or evening?", type: "input" },
      { key: "injuries", label: "Any injuries or limitations?", placeholder: "Knee issues, back pain, post-surgery...", type: "input" },
    ],
  },
  {
    value: "wholesale",
    label: "2THIRTY Wholesale",
    icon: Package,
    description: "Stock 2THIRTY at your location",
    fields: [
      { key: "business", label: "Business name & type", placeholder: "Gym, studio, retail store, café, online...", type: "input", required: true },
      { key: "location", label: "Location(s)", placeholder: "City, state — how many locations?", type: "input" },
      { key: "volume", label: "Estimated monthly volume", placeholder: "How many units or cases per month?", type: "input" },
      { key: "details", label: "Anything else about your business?", placeholder: "Website, current product lineup, distribution needs...", type: "textarea", rows: 2 },
    ],
  },
  {
    value: "brand-consulting",
    label: "Brand Consulting",
    icon: Lightbulb,
    description: "Grow & position your brand",
    fields: [
      { key: "brand", label: "What's your brand / business?", placeholder: "Tell me about your company and what you do.", type: "textarea", rows: 2, required: true },
      { key: "revenue", label: "Current revenue range", placeholder: "Pre-revenue, $10K/mo, $100K/mo, $1M+...", type: "input" },
      { key: "help", label: "What do you need help with?", placeholder: "Content strategy, revenue growth, positioning, launches...", type: "textarea", rows: 2 },
      { key: "timeline", label: "Timeline & budget", placeholder: "When do you want to start? Ballpark budget?", type: "input" },
    ],
  },
  {
    value: "collab",
    label: "Collab / Sponsorship",
    icon: Handshake,
    description: "Influencer & brand partnerships",
    fields: [
      { key: "platform", label: "Your platform & audience size", placeholder: "Instagram 50K, TikTok 100K, YouTube 25K...", type: "input", required: true },
      { key: "niche", label: "Your niche", placeholder: "Fitness, lifestyle, food, wellness...", type: "input" },
      { key: "collab-type", label: "What kind of collab?", placeholder: "Product review, sponsored post, event, long-term...", type: "textarea", rows: 2 },
      { key: "links", label: "Links to your content", placeholder: "Instagram, TikTok, YouTube, website...", type: "input" },
    ],
  },
  {
    value: "general",
    label: "General Inquiry",
    icon: MessageCircle,
    description: "Anything else — I respond to everything",
    fields: [
      { key: "message", label: "What's on your mind?", placeholder: "Ask me anything — business, fitness, 2THIRTY, whatever.", type: "textarea", rows: 4, required: true },
    ],
  },
];

const ContactSection = () => {
  const [sending, setSending] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "" as SubjectKey,
    fields: {} as Record<string, string>,
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const selectedSubject = subjectOptions.find((s) => s.value === formData.subject);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject) {
      toast.error("Please select a subject.");
      return;
    }
    setSending(true);

    const fieldDetails = selectedSubject?.fields
      .map((f) => `${f.label}: ${formData.fields[f.key] || "N/A"}`)
      .join("\n") || "";

    try {
      // Build a labeled formData object for DB storage and email
      const labeledFields: Record<string, string> = {};
      if (selectedSubject) {
        for (const field of selectedSubject.fields) {
          if (formData.fields[field.key]) {
            labeledFields[field.label] = formData.fields[field.key];
          }
        }
      }

      const { data, error } = await supabase.functions.invoke("send-contact-email", {
        body: {
          name: formData.name,
          email: formData.email,
          subject: selectedSubject?.label || formData.subject,
          formData: labeledFields,
        },
      });

      if (error) throw error;
      toast.success(data?.message || "Message sent! Devin will get back to you.");
      setFormData({ name: "", email: "", subject: "", fields: {} });
    } catch (err) {
      console.error(err);
      toast.error("Failed to send. DM @devinpolicastro on Instagram instead.");
    } finally {
      setSending(false);
    }
  };

  const contactLinks = [
    { href: "https://instagram.com/devinpolicastro", icon: Instagram, label: "Instagram DM", sub: "@devinpolicastro", external: true },
    { href: "mailto:devinpolicastro@gmail.com", icon: Mail, label: "Email", sub: "devinpolicastro@gmail.com", external: false },
    { href: "https://calendar.app.google/2MSzLtJVX7GZ93Zs9", icon: Calendar, label: "Book a Meeting", sub: "Schedule a tour or consultation", external: true },
  ];

  return (
    <section id="contact" className="section-padding pb-32 md:pb-24 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,hsl(24_32%_52%/0.03)_0%,transparent_60%)]" />

      <div className="container-tight relative z-10">
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {/* Left column — contact info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: 60 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="h-px bg-primary/60 mb-8 sm:mb-10"
            />
            <p className="text-primary/80 font-display text-[10px] tracking-[0.5em] uppercase mb-4 sm:mb-5">[ 07 — Contact ]</p>
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl leading-[0.88] mb-6 sm:mb-8 tracking-[-0.02em]">
              Let's Talk
              <br />
              <span className="text-muted-foreground">Business.</span>
            </h2>
            <p className="text-muted-foreground mb-8 sm:mb-12 leading-[1.8] text-xs sm:text-sm">
              Whether it's a collab, wholesale inquiry for 2THIRTY, Impact Zone membership, 
              or you just want to connect — I respond to everything.
            </p>

            <div className="flex flex-col gap-2">
              {contactLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className="glass-card p-3 sm:p-4 flex items-center gap-3 sm:gap-4 group hover:border-primary/20 transition-all duration-500"
                >
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-primary/8 flex items-center justify-center group-hover:bg-primary/15 transition-all duration-500 shrink-0">
                    <link.icon size={14} className="text-primary/70 group-hover:text-primary transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-display font-semibold text-xs sm:text-sm block">{link.label}</span>
                    <p className="text-muted-foreground text-[10px] sm:text-xs truncate">{link.sub}</p>
                  </div>
                  <ArrowUpRight size={14} className="text-muted-foreground/50 group-hover:text-primary transition-all duration-300 shrink-0" />
                </a>
              ))}
              <div className="glass-card p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-primary/8 flex items-center justify-center shrink-0">
                  <MapPin size={14} className="text-primary/70" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-display font-semibold text-xs sm:text-sm block">The Hub</span>
                  <p className="text-muted-foreground text-[10px] sm:text-xs">335 Chestnut St, Norwood, NJ 07648</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right column — form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-5 sm:p-8 space-y-4 sm:space-y-5 lg:col-span-3"
          >
            {/* Name / Email row */}
            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="text-[10px] font-display font-semibold tracking-[0.3em] uppercase text-muted-foreground/70 mb-2 block">Name *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Your name"
                  required
                  maxLength={100}
                  className="bg-card/50 border-border/20 focus:border-primary/30 h-11 sm:h-12 text-sm"
                />
              </div>
              <div>
                <label className="text-[10px] font-display font-semibold tracking-[0.3em] uppercase text-muted-foreground/70 mb-2 block">Email *</label>
                <Input
                  value={formData.email}
                  onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                  type="email"
                  placeholder="you@email.com"
                  required
                  maxLength={255}
                  className="bg-card/50 border-border/20 focus:border-primary/30 h-11 sm:h-12 text-sm"
                />
              </div>
            </div>

            {/* Subject selector — card grid */}
            <div>
              <label className="text-[10px] font-display font-semibold tracking-[0.3em] uppercase text-muted-foreground/70 mb-3 block">What's this about? *</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {subjectOptions.map((opt) => {
                  const isActive = formData.subject === opt.value;
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setFormData((p) => ({ ...p, subject: opt.value, fields: {} }))}
                      className={`relative p-3 rounded-lg border text-left transition-all duration-300 group ${
                        isActive
                          ? "border-primary/40 bg-primary/8 shadow-[0_0_20px_hsl(var(--primary)/0.08)]"
                          : "border-border/15 bg-card/30 hover:border-border/30 hover:bg-card/50"
                      }`}
                    >
                      <Icon
                        size={16}
                        className={`mb-1.5 transition-colors duration-300 ${
                          isActive ? "text-primary" : "text-muted-foreground/50 group-hover:text-muted-foreground"
                        }`}
                      />
                      <span className={`font-display font-semibold text-[11px] sm:text-xs block leading-tight ${
                        isActive ? "text-foreground" : "text-foreground/70"
                      }`}>
                        {opt.label}
                      </span>
                      <p className={`text-[9px] sm:text-[10px] mt-0.5 leading-tight ${
                        isActive ? "text-muted-foreground" : "text-muted-foreground/40"
                      }`}>
                        {opt.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dynamic tailored fields based on subject */}
            <AnimatePresence mode="popLayout">
              {selectedSubject && selectedSubject.fields.length > 0 && (
                <motion.div
                  key={formData.subject}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="pt-2 border-t border-primary/10 space-y-3 sm:space-y-4">
                    <p className="text-[9px] font-display font-bold tracking-[0.3em] uppercase text-primary/60">
                      {selectedSubject.label} →
                    </p>
                    {selectedSubject.fields.map((field, i) => (
                      <motion.div
                        key={field.key}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06, duration: 0.25 }}
                      >
                        <label className="text-[10px] font-display font-semibold tracking-[0.2em] uppercase text-muted-foreground/60 mb-1.5 block">
                          {field.label}{field.required ? " *" : ""}
                        </label>
                        {field.type === "textarea" ? (
                          <Textarea
                            value={formData.fields[field.key] || ""}
                            onChange={(e) =>
                              setFormData((p) => ({
                                ...p,
                                fields: { ...p.fields, [field.key]: e.target.value },
                              }))
                            }
                            placeholder={field.placeholder}
                            rows={field.rows || 2}
                            maxLength={500}
                            required={field.required}
                            className="bg-card/50 border-border/20 focus:border-primary/30 resize-none text-sm"
                          />
                        ) : (
                          <Input
                            value={formData.fields[field.key] || ""}
                            onChange={(e) =>
                              setFormData((p) => ({
                                ...p,
                                fields: { ...p.fields, [field.key]: e.target.value },
                              }))
                            }
                            placeholder={field.placeholder}
                            maxLength={200}
                            required={field.required}
                            className="bg-card/50 border-border/20 focus:border-primary/30 h-11 sm:h-12 text-sm"
                          />
                        )}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <MagneticButton strength={0.15} className="w-full">
              <Button
                variant="hero"
                size="lg"
                type="submit"
                className="w-full h-12 sm:h-13 text-sm font-display font-semibold tracking-wide"
                disabled={sending}
              >
                <Send size={14} />
                {sending ? "Sending..." : "Send It"}
              </Button>
            </MagneticButton>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
