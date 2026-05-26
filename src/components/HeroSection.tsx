import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown } from "lucide-react";
import MagneticButton from "@/components/effects/MagneticButton";

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
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background"
    >
      {/* Soft ambient wash */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--accent)/0.08)_0%,transparent_60%)]" />
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background to-transparent" />

      <motion.div
        style={{ opacity, y }}
        className="relative z-10 px-5 sm:px-10 max-w-7xl mx-auto pt-28 pb-16 w-full"
      >
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="flex items-center gap-3 mb-8 sm:mb-10"
        >
          <span className="h-px w-10 bg-accent" />
          <span className="text-foreground/60 text-[11px] sm:text-xs font-display font-medium tracking-[0.22em]">
            Norwood, NJ — Est. since day one
          </span>
        </motion.div>

        {/* Massive headline */}
        <h1 className="font-display font-bold leading-[0.78] tracking-[-0.06em] mb-10 sm:mb-12 text-[clamp(3.5rem,14vw,11rem)]">
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

        {/* Bottom row: portrait + tagline + CTAs */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 items-end">
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-4 order-2 md:order-1"
          >
            <div className="relative w-40 h-52 sm:w-48 sm:h-60 md:w-full md:h-80 rounded-md overflow-hidden border border-border shadow-[0_30px_60px_-20px_hsl(30_20%_20%/0.25)]">
              <img
                src="/images/devin-profile.jpg"
                alt="Devin Policastro, Norwood NJ entrepreneur and founder"
                width={480}
                height={640}
                {...({ fetchpriority: "high" } as any)}
                decoding="async"
                className="w-full h-full object-cover grayscale-[0.15]"
              />
              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 text-[8px] sm:text-[9px] font-display font-semibold tracking-[0.14em] text-white whitespace-nowrap">
                <span>— Founder</span>
                <span>Norwood, NJ</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="md:col-span-8 order-1 md:order-2"
          >
            <p className="font-display text-foreground/80 text-xl sm:text-2xl md:text-3xl max-w-2xl mb-8 sm:mb-10 leading-[1.25] tracking-[-0.015em]">
              I build brands, connect people, and turn every handshake into a{" "}
              <span className="accent-headline">revenue stream</span>.
            </p>

            <div className="flex flex-wrap items-center gap-5">
              <MagneticButton strength={0.2}>
                <Button
                  variant="default"
                  size="lg"
                  onClick={() => scrollTo("#services")}
                  className="h-14 px-8 text-sm font-display font-semibold tracking-wide rounded-md"
                >
                  Work With Me
                  <ArrowRight size={16} />
                </Button>
              </MagneticButton>
              <button
                onClick={() => scrollTo("#about")}
                className="text-sm font-display font-semibold tracking-wide text-foreground/70 hover:text-accent transition-colors underline underline-offset-[6px] decoration-1"
              >
                What I'm building →
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>

    </section>
  );
};

export default HeroSection;
