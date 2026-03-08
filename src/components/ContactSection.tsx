import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { Send, Instagram, ArrowUpRight, Mail, MapPin, Phone, Calendar } from "lucide-react";
import MagneticButton from "@/components/effects/MagneticButton";
import { supabase } from "@/integrations/supabase/client";

const ContactSection = () => {
  const [sending, setSending] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    try {
      const { data, error } = await supabase.functions.invoke("send-contact-email", {
        body: formData,
      });

      if (error) throw error;
      toast.success(data?.message || "Message sent! Devin will get back to you.");
      setFormData({ name: "", email: "", subject: "", message: "" });
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
                  <span className="font-display font-semibold text-xs sm:text-sm block">Impact Zone</span>
                  <p className="text-muted-foreground text-[10px] sm:text-xs">335 Chestnut St, Norwood, NJ 07648</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-5 sm:p-8 space-y-4 sm:space-y-5 lg:col-span-3"
          >
            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="text-[10px] font-display font-semibold tracking-[0.3em] uppercase text-muted-foreground/70 mb-2 block">Name</label>
                <Input value={formData.name} onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))} placeholder="Your name" required className="bg-card/50 border-border/20 focus:border-primary/30 h-11 sm:h-12 text-sm" />
              </div>
              <div>
                <label className="text-[10px] font-display font-semibold tracking-[0.3em] uppercase text-muted-foreground/70 mb-2 block">Email</label>
                <Input value={formData.email} onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))} type="email" placeholder="you@email.com" required className="bg-card/50 border-border/20 focus:border-primary/30 h-11 sm:h-12 text-sm" />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-display font-semibold tracking-[0.3em] uppercase text-muted-foreground/70 mb-2 block">Subject</label>
              <Input value={formData.subject} onChange={(e) => setFormData(p => ({ ...p, subject: e.target.value }))} placeholder="What's this about?" required className="bg-card/50 border-border/20 focus:border-primary/30 h-11 sm:h-12 text-sm" />
            </div>
            <div>
              <label className="text-[10px] font-display font-semibold tracking-[0.3em] uppercase text-muted-foreground/70 mb-2 block">Message</label>
              <Textarea value={formData.message} onChange={(e) => setFormData(p => ({ ...p, message: e.target.value }))} placeholder="Give me the details..." rows={4} required className="bg-card/50 border-border/20 focus:border-primary/30 resize-none text-sm" />
            </div>
            <MagneticButton strength={0.15} className="w-full">
              <Button variant="hero" size="lg" type="submit" className="w-full h-12 sm:h-13 text-sm font-display font-semibold tracking-wide" disabled={sending}>
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