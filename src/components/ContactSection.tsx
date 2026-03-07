import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { Send, Instagram, ArrowUpRight, Mail } from "lucide-react";
import MagneticButton from "@/components/effects/MagneticButton";

const ContactSection = () => {
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast.success("Message sent! I'll get back to you.");
    }, 1000);
  };

  return (
    <section id="contact" className="section-padding pb-32 md:pb-24 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,hsl(210_100%_55%/0.05)_0%,transparent_60%)]" />

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
              whileInView={{ width: 80 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="h-px bg-primary mb-8"
            />
            <p className="text-primary font-display text-xs tracking-[0.4em] uppercase mb-4">[ 07 — Contact ]</p>
            <h2 className="font-display font-bold text-4xl sm:text-5xl leading-[0.9] mb-6">
              Let's Talk
              <br />
              <span className="text-muted-foreground">Business.</span>
            </h2>
            <p className="text-muted-foreground mb-10 leading-relaxed">
              Whether it's a collab, a wholesale inquiry, or you just want to connect — 
              I respond to everything.
            </p>

            <div className="flex flex-col gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card p-4 flex items-center gap-4 group border border-border/20 hover:border-primary/30 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Instagram size={18} className="text-primary" />
                </div>
                <div className="flex-1">
                  <span className="font-display font-semibold text-sm">Instagram DM</span>
                  <p className="text-muted-foreground text-xs">Fastest way to reach me</p>
                </div>
                <ArrowUpRight size={16} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </a>
              <a
                href="mailto:hello@devinpolicastro.com"
                className="glass-card p-4 flex items-center gap-4 group border border-border/20 hover:border-primary/30 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Mail size={18} className="text-primary" />
                </div>
                <div className="flex-1">
                  <span className="font-display font-semibold text-sm">Email</span>
                  <p className="text-muted-foreground text-xs">For formal inquiries</p>
                </div>
                <ArrowUpRight size={16} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </a>
            </div>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8 space-y-5 lg:col-span-3 border border-border/20"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-display font-medium tracking-wider uppercase text-muted-foreground mb-2 block">Name</label>
                <Input placeholder="Your name" required className="bg-secondary/50 border-border/30 focus:border-primary/50 h-12" />
              </div>
              <div>
                <label className="text-xs font-display font-medium tracking-wider uppercase text-muted-foreground mb-2 block">Email</label>
                <Input type="email" placeholder="you@email.com" required className="bg-secondary/50 border-border/30 focus:border-primary/50 h-12" />
              </div>
            </div>
            <div>
              <label className="text-xs font-display font-medium tracking-wider uppercase text-muted-foreground mb-2 block">Subject</label>
              <Input placeholder="What's this about?" required className="bg-secondary/50 border-border/30 focus:border-primary/50 h-12" />
            </div>
            <div>
              <label className="text-xs font-display font-medium tracking-wider uppercase text-muted-foreground mb-2 block">Message</label>
              <Textarea placeholder="Give me the details..." rows={5} required className="bg-secondary/50 border-border/30 focus:border-primary/50 resize-none" />
            </div>
            <MagneticButton strength={0.15} className="w-full">
              <Button variant="hero" size="lg" type="submit" className="w-full h-13 text-base" disabled={sending}>
                <Send size={16} />
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
