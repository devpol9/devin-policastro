import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import MagneticButton from "@/components/effects/MagneticButton";

const ticker = [
  "Impact Zone — Norwood, NJ",
  "2THIRTY — 7,000+ packs sold",
  "Creative Vision — manufacturing",
  "Valence — gym OS, coming soon",
];

const HeroSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const opacity = useTransform(scrollYProgress, [0.6, 1], [1, 0]);
  const y = useTransform(scrollYProgress, [0.6, 1], [0, 60]);

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      ref={ref}
      className="relative min-h-screen flex flex-col overflow-x-hidden bg-background"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--accent)/0.08)_0%,transparent_60%)]" />
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background to-transparent pointer-events-none" />

      <motion.div
        style={{ opacity, y }}
        className="relative z-10 flex-1 flex flex-col justify-center px-5 sm:px-10 lg:px-14 xl:px-16 max-w-7xl w-full mx-auto pt-28 pb-12"
      >
        {/* Editorial header strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="flex items-center justify-between mb-10 sm:mb-14 text-[10px] sm:text-xs font-mono tracking-[0.22em] text-foreground/50"
        >
          <span className="text-accent">[ 00 / Index ]</span>
          <span className="hidden sm:inline">Norwood, NJ — Est. day one</span>
          <span>{new Date().getFullYear()}</span>
        </motion.div>

        {/* Asymmetric split: name left (8) / portrait+meta right (4) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 items-end">
          <div className="md:col-span-8 order-2 md:order-1">
            <h1 className="font-display font-bold leading-[0.78] tracking-[-0.055em] sm:tracking-[-0.06em] mb-8 sm:mb-10 text-[clamp(2.85rem,11.5vw,10rem)]">
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="block text-foreground"
              >
                Devin
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="block accent-headline"
              >
                Policastro.
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="font-display text-foreground/80 text-xl sm:text-2xl md:text-3xl max-w-2xl mb-8 sm:mb-10 leading-[1.2] tracking-[-0.015em]"
            >
              I build brands, connect people, and turn every handshake into a{" "}
              <span className="accent-headline">revenue stream</span>.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.85 }}
              className="flex flex-wrap items-center gap-5"
            >
              <MagneticButton strength={0.2}>
                <Button
                  variant="default"
                  size="lg"
                  onClick={() => scrollTo("#services")}
                  className="h-14 px-8 text-sm font-display font-semibold tracking-wide rounded-md"
                >
                  Work with me
                  <ArrowRight size={16} />
                </Button>
              </MagneticButton>
              <button
                onClick={() => scrollTo("#about")}
                className="text-sm font-display font-semibold tracking-wide text-foreground/70 hover:text-accent transition-colors underline underline-offset-[6px] decoration-1"
              >
                What I'm building →
              </button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-4 order-1 md:order-2"
          >
            <div className="relative w-full max-w-[260px] md:max-w-none aspect-[4/5] md:aspect-auto md:h-[26rem] rounded-2xl overflow-hidden border border-foreground/10">
              <img
                src="/images/devin-profile.jpg"
                alt="Devin Policastro, Norwood NJ entrepreneur and founder"
                width={480}
                height={640}
                {...({ fetchpriority: "high" } as any)}
                decoding="async"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-background/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[9px] sm:text-[10px] font-mono tracking-[0.18em] text-foreground/80">
                <span className="px-2 py-1 rounded-full bg-background/50 border border-foreground/15 backdrop-blur-sm">— Founder</span>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <p className="font-display font-semibold text-foreground text-sm sm:text-base md:text-lg leading-tight mb-1">
                  Founder · Operator · Connector
                </p>
                <p className="text-[10px] sm:text-[11px] font-mono tracking-[0.18em] text-foreground/55">
                  Norwood · Eatontown · NYC
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom ticker */}
      <div className="relative z-10 border-t border-foreground/10 bg-background/60 backdrop-blur-sm overflow-hidden">
        <div className="flex items-center gap-12 py-3 sm:py-4 animate-[marquee_30s_linear_infinite] whitespace-nowrap">
          {[...ticker, ...ticker, ...ticker].map((t, i) => (
            <span key={i} className="flex items-center gap-12 text-[10px] sm:text-xs font-mono tracking-[0.22em] text-foreground/50">
              <span className="text-accent">◆</span>
              {t}
            </span>
          ))}
        </div>
        <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-33.333%); } }`}</style>
      </div>
    </section>
  );
};

export default HeroSection;
