import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown } from "lucide-react";
import MagneticButton from "@/components/effects/MagneticButton";

const HeroSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.8], [0, 60]);

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
        className="relative z-10 px-6 sm:px-10 max-w-6xl mx-auto pt-24 pb-20 w-full"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14 items-center">
          {/* Left — portrait */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-5 flex md:justify-start justify-center"
          >
            <div className="relative">
              <div className="absolute -inset-4 rounded-full bg-accent/10 blur-2xl" />
              <div className="relative w-44 h-44 sm:w-56 sm:h-56 md:w-72 md:h-72 rounded-full overflow-hidden border border-border">
                <img
                  src="/images/devin-profile.jpg"
                  alt="Devin Policastro"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </motion.div>

          {/* Right — type */}
          <div className="md:col-span-7 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center gap-2 mb-6 sm:mb-8"
            >
              <span className="h-px w-8 bg-foreground/30" />
              <span className="text-foreground/60 text-[10px] sm:text-xs font-display font-medium tracking-[0.12em] ">
                Norwood, NJ — Builder
              </span>
            </motion.div>

            <h1 className="font-display font-extrabold leading-[0.9] tracking-[-0.03em] mb-6 sm:mb-8">
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="block text-foreground text-[clamp(2.4rem,9vw,7rem)]"
              >
                Devin
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="block text-foreground/40 text-[clamp(2.4rem,9vw,7rem)] italic font-light"
              >
                Policastro.
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto md:mx-0 mb-10 leading-relaxed"
            >
              I build brands, connect people, and turn every handshake into a
              revenue stream.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="flex flex-wrap items-center gap-4 justify-center md:justify-start"
            >
              <MagneticButton strength={0.2}>
                <Button
                  variant="default"
                  size="lg"
                  onClick={() => scrollTo("#services")}
                  className="h-12 px-7 text-sm font-display font-semibold tracking-wide rounded-full"
                >
                  Work With Me
                  <ArrowRight size={16} />
                </Button>
              </MagneticButton>
              <button
                onClick={() => scrollTo("#about")}
                className="text-sm font-display font-medium tracking-wide text-foreground/70 hover:text-foreground transition-colors underline-offset-4 hover:underline"
              >
                About →
              </button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <motion.button
        onClick={() => scrollTo("#marquee")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 group hidden sm:block"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-muted-foreground text-[10px] font-display tracking-[0.15em]  group-hover:text-foreground transition-colors">
            Scroll
          </span>
          <ChevronDown size={14} className="text-muted-foreground group-hover:text-foreground transition-colors" />
        </motion.div>
      </motion.button>
    </section>
  );
};

export default HeroSection;
