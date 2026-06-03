import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { trackEvent } from "@/lib/analytics";

const CONSULT_URL = "https://calendar.app.google/xXzaDYrcPvFHRCQ28";

const focusAreas = [
  "Operations & scaling",
  "Brand & manufacturing",
  "Capital & connections",
];

const HeroSection = () => {
  return (
    <section className="relative min-h-screen w-full bg-background text-foreground flex items-center justify-center px-5 sm:px-8 md:px-12 pt-24 pb-12">
      <div className="max-w-5xl w-full mx-auto flex flex-col gap-12 md:gap-20">
        {/* Meta header */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex justify-between items-start w-full border-b border-foreground/10 pb-4"
        >
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[10px] text-accent tracking-tighter">[ 00 / Index ]</span>
            <span className="text-[11px] sm:text-xs font-medium text-foreground/50">Norwood, New Jersey</span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="font-mono text-[10px] text-accent tracking-tighter text-right">[ 01 / Available ]</span>
            <span className="text-[11px] sm:text-xs font-medium text-foreground/50">Est. day one</span>
          </div>
        </motion.div>

        {/* Hero block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-12 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
            className="lg:col-span-7 flex flex-col gap-8"
          >
            <div className="space-y-4">
              <h1 className="font-display text-6xl sm:text-7xl lg:text-8xl xl:text-[7.5rem] font-black tracking-tight leading-[0.85]">
                Devin
                <br />
                <span className="text-accent">Policastro.</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl font-medium text-foreground/70 max-w-md leading-snug">
                Founder, operator, and connector — building products, gyms, and brands out of Norwood, NJ. Tell me what you're working on, I'll point you the right way.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <span className="font-mono text-[10px] text-foreground/40 tracking-widest">Core focus areas</span>
              <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium">
                {focusAreas.map((f) => (
                  <div key={f} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    <span className="text-foreground/85">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
              <a
                href={CONSULT_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("outbound_click", { url: CONSULT_URL, location: "hero-consult" })}
                className="group flex items-center justify-between bg-foreground text-background px-6 py-4 rounded-sm font-bold transition-all hover:bg-accent hover:text-foreground"
              >
                Book a 15-min consult
                <ArrowRight size={18} className="ml-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#services"
                className="flex items-center justify-center border border-foreground/20 px-6 py-4 rounded-sm font-medium hover:bg-foreground/5 transition-colors"
              >
                What I can help with
              </a>
            </div>
          </motion.div>

          {/* Right — portrait card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="lg:col-span-5 relative"
          >
            <div className="aspect-[4/5] w-full rounded-2xl overflow-hidden border border-foreground/10 relative bg-card">
              <img
                src="/images/devin-profile.jpg"
                alt="Devin Policastro — founder & operator, Norwood, NJ"
                className="w-full h-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 sm:bottom-6 sm:left-6 sm:right-6">
                <span className="font-mono text-[10px] text-accent mb-1 block">[ Identity ]</span>
                <p className="text-base sm:text-lg font-bold text-foreground">Founder · Operator · Connector</p>
                <p className="text-[11px] sm:text-xs text-foreground/60 font-medium tracking-wide mt-0.5">
                  Norwood, NJ · Building at scale
                </p>
              </div>
            </div>

            {/* Decorative corner */}
            <div className="absolute -top-3 -right-3 w-20 h-20 border-t border-r border-accent/30 pointer-events-none" />
          </motion.div>
        </div>

        {/* Sub-strip: jump to ventures */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap items-center justify-between gap-3 text-[10px] font-mono text-foreground/30 tracking-widest border-t border-foreground/10 pt-4"
        >
          <span>[ Devin Policastro · 2026 ]</span>
          <a href="#ventures" className="hover:text-foreground/70 transition-colors">
            See what I'm building →
          </a>

        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
