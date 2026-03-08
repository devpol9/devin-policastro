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

  return (
    <section id="contact" className="section-padding pb-28 md:pb-24 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,hsl(38_90%_58%/0.03)_0%,transparent_60%)]" />

      <div className="container-tight relative z-10">
        <div className="grid lg:grid-cols-5 gap-12 max-w-6xl mx-auto">
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
              className="h-px bg-primary/60 mb-10"
            />
            <p className="text-primary/80 font-display text-[10px] tracking-[0.5em] uppercase mb-5">[ 07 — Contact ]</p>
            <h2 className="font-display font-extrabold text-4xl sm:text-5xl leading-[0.88] mb-8 tracking-[-0.02em]">
              Let's Talk
              <br />
              <span className="text-muted-foreground">Business.</span>
            </h2>
            <p className="text-muted-foreground mb-12 leading-[1.8] text-sm">
              Whether it's a collab, wholesale inquiry for 2THIRTY, Impact Zone membership, 
              or you just want to connect — I respond to everything.
            </p>

            <div className="flex flex-col gap-2.5">
              <a href="https://instagram.com/devinpolicastro" target="_blank" rel="noopener noreferrer" className="glass-card p-4 flex items-center gap-4 group hover:border-primary/20 transition-all duration-500">
                <div className="w-9 h-9 rounded-lg bg-primary/8 flex items-center justify-center group-hover:bg-primary/15 transition-all duration-500"><Instagram size={16} className="text-primary/70 group-hover:text-primary transition-colors" /></div>
                <div className="flex-1"><span className="font-display font-semibold text-sm">Instagram DM</span><p className="text-muted-foreground text-xs">@devinpolicastro</p></div>
                <ArrowUpRight size={14} className="text-muted-foreground/50 group-hover:text-primary transition-all duration-300" />
              </a>
              <a href="mailto:info@impactzonenj.com" className="glass-card p-4 flex items-center gap-4 group hover:border-primary/20 transition-all duration-500">
                <div className="w-9 h-9 rounded-lg bg-primary/8 flex items-center justify-center group-hover:bg-primary/15 transition-all duration-500"><Mail size={16} className="text-primary/70 group-hover:text-primary transition-colors" /></div>
                <div className="flex-1"><span className="font-display font-semibold text-sm">Email</span><p className="text-muted-foreground text-xs">info@impactzonenj.com</p></div>
                <ArrowUpRight size={14} className="text-muted-foreground/50 group-hover:text-primary transition-all duration-300" />
              </a>
              <a href="tel:201-775-1025" className="glass-card p-4 flex items-center gap-4 group hover:border-primary/20 transition-all duration-500">
                <div className="w-9 h-9 rounded-lg bg-primary/8 flex items-center justify-center group-hover:bg-primary/15 transition-all duration-500"><Phone size={16} className="text-primary/70 group-hover:text-primary transition-colors" /></div>
                <div className="flex-1"><span className="font-display font-semibold text-sm">Phone</span><p className="text-muted-foreground text-xs">(201) 775-1025</p></div>
                <ArrowUpRight size={14} className="text-muted-foreground/50 group-hover:text-primary transition-all duration-300" />
              </a>
              <a href="https://calendar.app.google/2MSzLtJVX7GZ93Zs9" target="_blank" rel="noopener noreferrer" className="glass-card p-4 flex items-center gap-4 group hover:border-primary/20 transition-all duration-500">
                <div className="w-9 h-9 rounded-lg bg-primary/8 flex items-center justify-center group-hover:bg-primary/15 transition-all duration-500"><Calendar size={16} className="text-primary/70 group-hover:text-primary transition-colors" /></div>
                <div className="flex-1"><span className="font-display font-semibold text-sm">Book a Meeting</span><p className="text-muted-foreground text-xs">Schedule a tour or consultation</p></div>
                <ArrowUpRight size={14} className="text-muted-foreground/50 group-hover:text-primary transition-all duration-300" />
              </a>
              <div className="glass-card p-4 flex items-center gap-4">
                <div className="w-9 h-9 rounded-lg bg-primary/8 flex items-center justify-center"><MapPin size={16} className="text-primary/70" /></div>
                <div className="flex-1"><span className="font-display font-semibold text-sm">Impact Zone</span><p className="text-muted-foreground text-xs">335 Chestnut St, Norwood, NJ 07648</p></div>
              </div>
            </div>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8 space-y-5 lg:col-span-3"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-display font-semibold tracking-[0.3em] uppercase text-muted-foreground/70 mb-2 block">Name</label>
                <Input value={formData.name} onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))} placeholder="Your name" required className="bg-card/50 border-border/20 focus:border-primary/30 h-12 text-sm" />
              </div>
              <div>
                <label className="text-[10px] font-display font-semibold tracking-[0.3em] uppercase text-muted-foreground/70 mb-2 block">Email</label>
                <Input value={formData.email} onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))} type="email" placeholder="you@email.com" required className="bg-card/50 border-border/20 focus:border-primary/30 h-12 text-sm" />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-display font-semibold tracking-[0.3em] uppercase text-muted-foreground/70 mb-2 block">Subject</label>
              <Input value={formData.subject} onChange={(e) => setFormData(p => ({ ...p, subject: e.target.value }))} placeholder="What's this about?" required className="bg-card/50 border-border/20 focus:border-primary/30 h-12 text-sm" />
            </div>
            <div>
              <label className="text-[10px] font-display font-semibold tracking-[0.3em] uppercase text-muted-foreground/70 mb-2 block">Message</label>
              <Textarea value={formData.message} onChange={(e) => setFormData(p => ({ ...p, message: e.target.value }))} placeholder="Give me the details..." rows={5} required className="bg-card/50 border-border/20 focus:border-primary/30 resize-none text-sm" />
            </div>
            <MagneticButton strength={0.15} className="w-full">
              <Button variant="hero" size="lg" type="submit" className="w-full h-13 text-sm font-display font-semibold tracking-wide" disabled={sending}>
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