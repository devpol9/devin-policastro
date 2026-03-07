import { motion } from "framer-motion";
import { ReactNode } from "react";

interface MarqueeProps {
  children: ReactNode;
  speed?: number;
  className?: string;
}

const Marquee = ({ children, speed = 30, className = "" }: MarqueeProps) => {
  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <motion.div
        className="inline-flex"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
      >
        <div className="inline-flex items-center">{children}</div>
        <div className="inline-flex items-center">{children}</div>
      </motion.div>
    </div>
  );
};

export default Marquee;
