import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ArrowRight, Tag, ChevronDown } from "lucide-react";
import TextScramble from "@/components/effects/TextScramble";
import MagneticButton from "@/components/effects/MagneticButton";
import HeroOrb from "@/components/effects/HeroOrb";

const HeroSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.8], [1, 0.95]);
  const y = useTransform(scrollYProgress, [0, 0.8], [0, 80]);

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const particles: { x: number; y: number; vx: number; vy: number; size: number; opacity: number }[] = [];
    const particleCount = 40;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        size: Math.random() * 1.2 + 0.3,
        opacity: Math.random() * 0.2 + 0.03,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(38, 90%, 58%, ${p.opacity})`;
        ctx.fill();
        for (let j = i + 1; j < particles.length; j++) {
          const dx = p.x - particles[j].x;
          const dy = p.y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `hsla(38, 90%, 58%, ${0.03 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });
      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section id="home" ref={ref} className="relative min-h-screen flex items-center justify-center overflow-x-hidden overflow-y-visible">
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />
      
      <div className="block">
        <HeroOrb />
      </div>
      
      <div className="absolute inset-0 z-[2] bg-[radial-gradient(ellipse_at_top,hsl(38_90%_58%/0.04)_0%,transparent_50%)]" />
      <div className="absolute bottom-0 left-0 right-0 h-48 z-[2] bg-gradient-to-t from-background to-transparent" />

      <motion.div style={{ opacity, scale, y }} className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto pt-20 sm:pt-16 w-full">
        {/* Profile image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mb-6 sm:mb-10 relative"
        >
          <div className="w-24 h-24 sm:w-40 sm:h-40 rounded-full overflow-hidden border border-primary/20 mx-auto ring-[3px] ring-primary/10 ring-offset-4 ring-offset-background">
            <img src="/images/devin-profile.jpg" alt="Devin Policastro" className="w-full h-full object-cover" />
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-card/80 backdrop-blur-xl border border-primary/20 text-primary text-[8px] sm:text-[10px] font-display font-bold tracking-[0.14em] sm:tracking-[0.24em] uppercase whitespace-normal text-center max-w-[78vw] sm:max-w-none leading-tight"
          >
            Relentless Entrepreneur
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent mx-auto max-w-[200px] mb-6 sm:mb-10"
        />

        <motion.p
          initial={{ opacity: 0, letterSpacing: "0.1em" }}
          animate={{ opacity: 1, letterSpacing: "0.25em" }}
          transition={{ duration: 1.5, delay: 0.4 }}
          className="text-muted-foreground font-display font-medium text-[9px] sm:text-xs uppercase mb-6 sm:mb-8 px-2 tracking-[0.18em] sm:tracking-[0.25em] leading-relaxed"
        >
          2THIRTY · Impact Zone · SBS · Manufacturing
        </motion.p>

        <h1 className="font-display font-extrabold text-[14vw] sm:text-7xl md:text-8xl lg:text-[10rem] leading-[0.86] mb-4 tracking-[-0.02em]">
          <motion.span
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="block text-foreground/90"
          >
            DEVIN
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="block gradient-text"
          >
            <TextScramble text="POLICASTRO" delay={1200} />
          </motion.span>
        </h1>

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, delay: 1, ease: [0.16, 1, 0.3, 1] }}
          className="h-px bg-gradient-to-r from-transparent via-border to-transparent mx-auto max-w-lg mb-6 sm:mb-10"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-muted-foreground text-xs sm:text-lg max-w-xl mx-auto mb-8 sm:mb-14 font-body leading-relaxed px-2"
        >
          Entrepreneur dedicated to creating impactful experiences across fitness, wellness, and business.
          <span className="text-foreground/70 font-medium"> 335 Chestnut St. Norwood, NJ.</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 px-2"
        >
          <MagneticButton strength={0.2}>
            <Button variant="hero" size="lg" onClick={() => scrollTo("#shop")} className="w-full sm:w-auto min-w-[180px] h-12 sm:h-13 text-xs sm:text-sm font-display font-semibold tracking-wide">
              <ShoppingBag size={16} />
              Shop 2THIRTY
            </Button>
          </MagneticButton>
          <MagneticButton strength={0.2}>
            <Button variant="heroOutline" size="lg" onClick={() => scrollTo("#services")} className="w-full sm:w-auto min-w-[180px] h-12 sm:h-13 text-xs sm:text-sm font-display font-semibold tracking-wide">
              Work With Me
              <ArrowRight size={16} />
            </Button>
          </MagneticButton>
          <MagneticButton strength={0.2}>
            <Button variant="glass" size="lg" onClick={() => scrollTo("#codes")} className="w-full sm:w-auto min-w-[180px] h-12 sm:h-13 text-xs sm:text-sm font-display font-semibold tracking-wide">
              <Tag size={16} />
              Get the Code
            </Button>
          </MagneticButton>
        </motion.div>
      </motion.div>

      <motion.button
        onClick={() => scrollTo("#marquee")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-20 md:bottom-10 left-1/2 -translate-x-1/2 z-10 group hidden sm:block"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-muted-foreground text-[9px] font-display tracking-[0.4em] uppercase group-hover:text-primary transition-colors duration-300">
            Scroll
          </span>
          <ChevronDown size={14} className="text-muted-foreground group-hover:text-primary transition-colors duration-300" />
        </motion.div>
      </motion.button>
    </section>
  );
};

export default HeroSection;