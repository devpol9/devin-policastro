import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingBag, Tag } from "lucide-react";

const HeroSection = () => {
  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(210_100%_55%/0.08)_0%,transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,hsl(210_80%_40%/0.05)_0%,transparent_50%)]" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(210 20% 50%) 1px, transparent 1px), linear-gradient(90deg, hsl(210 20% 50%) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-primary/3 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />

      <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-primary font-display font-medium text-sm sm:text-base tracking-[0.3em] uppercase mb-4">
            Entrepreneur · Connector · Builder
          </p>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="font-display font-bold text-5xl sm:text-7xl lg:text-8xl leading-[0.9] mb-6"
        >
          DEVIN
          <br />
          <span className="gradient-text">POLICASTRO</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto mb-10 font-body"
        >
          I build brands, connect people, and turn every handshake into a revenue stream. 
          Welcome to the headquarters.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button variant="hero" size="lg" onClick={() => scrollTo("#shop")} className="min-w-[180px]">
            <ShoppingBag size={18} />
            Shop My Picks
          </Button>
          <Button variant="heroOutline" size="lg" onClick={() => scrollTo("#services")} className="min-w-[180px]">
            Work With Me
            <ArrowRight size={18} />
          </Button>
          <Button variant="glass" size="lg" onClick={() => scrollTo("#codes")} className="min-w-[180px]">
            <Tag size={18} />
            Get the Code
          </Button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-24 md:bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-1.5">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-primary"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
