import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { Send, Instagram, ArrowUpRight, Mail, MapPin, Phone, Calendar, ChevronDown } from "lucide-react";
import MagneticButton from "@/components/effects/MagneticButton";
import { supabase } from "@/integrations/supabase/client";

type SubjectKey = "" | "gym-tour" | "membership" | "training" | "wholesale" | "brand-consulting" | "collab" | "general";

interface SubjectOption {
  value: SubjectKey;
  label: string;
  prompts: { label: string; placeholder: string }[];
}

const subjectOptions: SubjectOption[] = [
  {
    value: "gym-tour",
    label: "Book a Gym Tour",
    prompts: [
      { label: "Preferred Date & Time", placeholder: "e.g. Saturday morning, weekday evening..." },
      { label: "What are you looking for in a gym?", placeholder: "Recovery, lifting, classes, community..." },
    ],
  },
  {
    value: "membership",
    label: "Membership / Join Impact Zone",
    prompts: [
      { label: "Current fitness routine?", placeholder: "How often do you train? What's your style?" },
      { label: "Any questions about the facility?", placeholder: "Cold plunge hours, class schedule, pricing..." },
    ],
  },
  {
    value: "training",
    label: "Training / Coaching",
    prompts: [
      { label: "What are your goals?", placeholder: "Weight loss, muscle gain, sport-specific, rehab..." },
      { label: "Experience level & schedule", placeholder: "Beginner/advanced, how many days per week..." },
    ],
  },
  {
    value: "wholesale",
    label: "2THIRTY Wholesale",
    prompts: [
      { label: "Business name & type", placeholder: "Gym, studio, retail store, online..." },
      { label: "Estimated monthly volume", placeholder: "How many units/cases per month?" },
    ],
  },
  {
    value: "brand-consulting",
    label: "Brand Consulting",
    prompts: [
      { label: "What's your brand / business?", placeholder: "Tell me about your company and what you do." },
      { label: "What do you need help with?", placeholder: "Content strategy, revenue, positioning..." },
    ],
  },
  {
    value: "collab",
    label: "Influencer Collab / Sponsorship",
    prompts: [
      { label: "Your platform & audience size", placeholder: "Instagram 50K, TikTok 100K, YouTube..." },
      { label: "What kind of collab?", placeholder: "Product review, sponsored post, event..." },
    ],
  },
  {
    value: "general",
    label: "General Inquiry",
    prompts: [
      { label: "What's on your mind?", placeholder: "Ask me anything — I respond to everything." },
    ],
  },
];

const ContactSection = () => {
  const [sending, setSending] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "" as SubjectKey,
    prompts: {} as Record<string, string>,
    message: "",
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

    const promptDetails = selectedSubject?.prompts
      .map((p) => `${p.label}: ${formData.prompts[p.label] || "N/A"}`)
      .join("\n") || "";

    try {
      const { data, error } = await supabase.functions.invoke("send-contact-email", {
        body: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: selectedSubject?.label || formData.subject,
          message: formData.message
            ? `${promptDetails}\n\nAdditional message:\n${formData.message}`
            : promptDetails,
        },
      });

      if (error) throw error;
      toast.success(data?.message || "Message sent! Devin will get back to you.");
      setFormData({ name: "", email: "", phone: "", subject: "", prompts: {}, message: "" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to send. DM @devinpolicastro on Instagram instead.");
    } finally {
      setSending(false);
    }
  };

  const contactLinks = [
    { href: "https://instagram.com/devinpolicastro", icon: Instagram, label: "Instagram DM", sub: "@devinpolicastro", external: true },
    { href: "mailto:info@impactzonenj.com", icon: Mail, label: "Email", sub: "info@impactzonenj.com", external: false },
    { href: "tel:201-775-1025", icon: Phone, label: "Phone", sub: "(201) 775-1025", external: false },
    { href: "https://calendar.app.google/2MSzLtJVX7GZ93Zs9", icon: Calendar, label: "Book a Meeting", sub: "Schedule a tour or consultation", external: true },
  ];

  return (
    <section id="contact" className="section-padding pb-32 md:pb-24 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,hsl(38_90%_58%/0.03)_0%,transparent_60%)]" />

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
            <p className="text-primary/80 font-display text-[10px] tracking-[0.5em] uppercase mb-4 sm:mb-5">[ 08 — Contact ]</p>
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
                  <span className="font-display font-semibold text-xs sm:text-sm block">Impact Zone</span>
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

            {/* Phone */}
            <div>
              <label className="text-[10px] font-display font-semibold tracking-[0.3em] uppercase text-muted-foreground/70 mb-2 block">Phone</label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                type="tel"
                placeholder="(555) 123-4567"
                maxLength={20}
                className="bg-card/50 border-border/20 focus:border-primary/30 h-11 sm:h-12 text-sm"
              />
            </div>

            {/* Subject dropdown */}
            <div className="relative">
              <label className="text-[10px] font-display font-semibold tracking-[0.3em] uppercase text-muted-foreground/70 mb-2 block">Subject *</label>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full flex items-center justify-between bg-card/50 border border-border/20 focus:border-primary/30 h-11 sm:h-12 text-sm rounded-md px-3 text-left transition-colors hover:border-primary/20"
              >
                <span className={formData.subject ? "text-foreground" : "text-muted-foreground"}>
                  {selectedSubject?.label || "What's this about?"}
                </span>
                <ChevronDown size={14} className={`text-muted-foreground transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="absolute z-30 top-full mt-1 left-0 right-0 bg-card border border-border/30 rounded-lg overflow-hidden shadow-2xl shadow-black/40 backdrop-blur-2xl"
                  >
                    {subjectOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          setFormData((p) => ({ ...p, subject: opt.value, prompts: {} }));
                          setDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-xs sm:text-sm font-display transition-colors duration-200 ${
                          formData.subject === opt.value
                            ? "bg-primary/10 text-primary font-semibold"
                            : "text-foreground/80 hover:bg-primary/5 hover:text-foreground"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Dynamic prompts based on subject */}
            <AnimatePresence mode="popLayout">
              {selectedSubject && selectedSubject.prompts.length > 0 && (
                <motion.div
                  key={formData.subject}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3 sm:space-y-4 overflow-hidden"
                >
                  <div className="pt-1 border-t border-primary/10">
                    <p className="text-[9px] font-display font-bold tracking-[0.3em] uppercase text-primary/60 mb-3 sm:mb-4">
                      Tell me more →
                    </p>
                    {selectedSubject.prompts.map((prompt) => (
                      <div key={prompt.label} className="mb-3">
                        <label className="text-[10px] font-display font-semibold tracking-[0.2em] uppercase text-muted-foreground/60 mb-1.5 block">
                          {prompt.label}
                        </label>
                        <Textarea
                          value={formData.prompts[prompt.label] || ""}
                          onChange={(e) =>
                            setFormData((p) => ({
                              ...p,
                              prompts: { ...p.prompts, [prompt.label]: e.target.value },
                            }))
                          }
                          placeholder={prompt.placeholder}
                          rows={2}
                          maxLength={500}
                          className="bg-card/50 border-border/20 focus:border-primary/30 resize-none text-sm"
                        />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Additional message */}
            <div>
              <label className="text-[10px] font-display font-semibold tracking-[0.3em] uppercase text-muted-foreground/70 mb-2 block">
                Anything else?
              </label>
              <Textarea
                value={formData.message}
                onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
                placeholder="Additional details, links, whatever you want me to know..."
                rows={3}
                maxLength={1000}
                className="bg-card/50 border-border/20 focus:border-primary/30 resize-none text-sm"
              />
            </div>

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
