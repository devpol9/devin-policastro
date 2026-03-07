import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ArrowRight, Tag, ChevronDown } from "lucide-react";
import TextScramble from "@/components/effects/TextScramble";
import MagneticButton from "@/components/effects/MagneticButton";

const HeroSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.8], [1, 0.9]);
  const y = useTransform(scrollYProgress, [0, 0.8], [0, 100]);

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  // Particle effect
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const particles: { x: number; y: number; vx: number; vy: number; size: number; opacity: number }[] = [];
    const particleCount = 80;

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
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
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
        ctx.fillStyle = `hsla(210, 100%, 55%, ${p.opacity})`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = p.x - particles[j].x;
          const dy = p.y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `hsla(210, 100%, 55%, ${0.08 * (1 - dist / 150)})`;
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
    <section id="home" ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_top,hsl(210_100%_55%/0.1)_0%,transparent_50%)]" />
      <div className="absolute bottom-0 left-0 right-0 h-32 z-[1] bg-gradient-to-t from-background to-transparent" />

      <motion.div style={{ opacity, scale, y }} className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto">
        {/* Profile image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mb-8 relative"
        >
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-2 border-primary/30 mx-auto ring-4 ring-primary/10">
            <img
              src="/images/devin-profile.jpg"
              alt="Devin Policastro"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30 text-primary text-[10px] font-display font-bold tracking-widest uppercase">
            Relentless Entrepreneur
          </div>
        </motion.div>

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent mx-auto max-w-xs mb-8"
        />

        <motion.p
          initial={{ opacity: 0, letterSpacing: "0.1em" }}
          animate={{ opacity: 1, letterSpacing: "0.35em" }}
          transition={{ duration: 1.2, delay: 0.4 }}
          className="text-primary font-display font-medium text-xs sm:text-sm uppercase mb-6"
        >
          2THIRTY · Impact Zone · SBS · Impactful Brands
        </motion.p>

        <h1 className="font-display font-bold text-6xl sm:text-8xl lg:text-9xl leading-[0.85] mb-4 tracking-tight">
          <motion.span
            initial={{ opacity: 0, y: 80, rotateX: 40 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="block"
          >
            DEVIN
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 80, rotateX: 40 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="block gradient-text"
          >
            <TextScramble text="POLICASTRO" delay={1200} />
          </motion.span>
        </h1>

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.5, delay: 1, ease: [0.16, 1, 0.3, 1] }}
          className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent mx-auto max-w-lg mb-8"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto mb-12 font-body leading-relaxed"
        >
          Entrepreneur dedicated to creating impactful experiences across fitness, wellness, and business. 
          Leading Impact Zone, building 2THIRTY, delivering premium products through Impactful Brands.
          <span className="text-foreground font-medium"> 335 Chestnut St. Norwood, NJ.</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <MagneticButton strength={0.2}>
            <Button variant="hero" size="lg" onClick={() => scrollTo("#shop")} className="min-w-[200px] h-13 text-base">
              <ShoppingBag size={18} />
              Shop 2THIRTY
            </Button>
          </MagneticButton>
          <MagneticButton strength={0.2}>
            <Button variant="heroOutline" size="lg" onClick={() => scrollTo("#services")} className="min-w-[200px] h-13 text-base">
              Work With Me
              <ArrowRight size={18} />
            </Button>
          </MagneticButton>
          <MagneticButton strength={0.2}>
            <Button variant="glass" size="lg" onClick={() => scrollTo("#codes")} className="min-w-[200px] h-13 text-base">
              <Tag size={18} />
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
        className="absolute bottom-24 md:bottom-10 left-1/2 -translate-x-1/2 z-10 group"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-muted-foreground text-[10px] font-display tracking-[0.3em] uppercase group-hover:text-primary transition-colors">
            Scroll
          </span>
          <ChevronDown size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
        </motion.div>
      </motion.button>
    </section>
  );
};

export default HeroSection;
