import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { Send, Instagram, ArrowUpRight } from "lucide-react";

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
    <section id="contact" className="section-padding pb-32 md:pb-24">
      <div className="container-tight">
        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-primary font-display text-sm tracking-[0.25em] uppercase mb-3">Get In Touch</p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl mb-6">
              Let's Talk Business.
              <br />
              <span className="text-muted-foreground">Or Just Say What's Up.</span>
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Whether it's a collab, a wholesale inquiry, a brand question, or you just want to connect — 
              drop me a line. I respond to everything.
            </p>

            <div className="flex flex-col gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card-hover p-4 flex items-center gap-3 group"
              >
                <Instagram size={20} className="text-primary" />
                <span className="font-medium text-sm">DM me on Instagram</span>
                <ArrowUpRight size={16} className="ml-auto text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
            </div>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-6 sm:p-8 space-y-5"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Name</label>
                <Input placeholder="Your name" required className="bg-secondary/50 border-border/50 focus:border-primary/50" />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Email</label>
                <Input type="email" placeholder="you@email.com" required className="bg-secondary/50 border-border/50 focus:border-primary/50" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Subject</label>
              <Input placeholder="What's this about?" required className="bg-secondary/50 border-border/50 focus:border-primary/50" />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Message</label>
              <Textarea placeholder="Give me the details..." rows={4} required className="bg-secondary/50 border-border/50 focus:border-primary/50 resize-none" />
            </div>
            <Button variant="hero" size="lg" type="submit" className="w-full" disabled={sending}>
              <Send size={16} />
              {sending ? "Sending..." : "Send It"}
            </Button>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
