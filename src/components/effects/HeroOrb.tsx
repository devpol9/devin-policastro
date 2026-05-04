import { motion } from "framer-motion";

const HeroOrb = () => {
  return (
    <div className="absolute inset-0 z-[1] pointer-events-none flex items-center justify-center opacity-75">
      <motion.div
        animate={{
          rotate: [0, 360],
          y: [0, -8, 0, 8, 0],
        }}
        transition={{
          rotate: { duration: 25, repeat: Infinity, ease: "linear" },
          y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
        }}
        className="w-[280px] h-[280px] sm:w-[420px] sm:h-[420px] rounded-full relative"
        style={{
          background: `radial-gradient(circle at 35% 35%, hsl(24 32% 52% / 0.15), hsl(20 28% 42% / 0.08) 50%, transparent 70%)`,
          boxShadow: `
            0 0 80px 40px hsl(24 32% 52% / 0.06),
            inset 0 0 60px 20px hsl(24 32% 52% / 0.04)
          `,
          border: `1px solid hsl(24 32% 52% / 0.08)`,
        }}
      >
        {/* Inner glow ring */}
        <div
          className="absolute inset-4 rounded-full"
          style={{
            background: `radial-gradient(circle at 40% 40%, hsl(24 32% 52% / 0.1), transparent 60%)`,
            border: `1px solid hsl(24 32% 52% / 0.05)`,
          }}
        />
      </motion.div>
    </div>
  );
};

export default HeroOrb;
