import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SectionHeaderProps {
  numeral: string; // e.g. "01"
  eyebrow: string; // e.g. "My World"
  title: ReactNode; // can include <span className="italic font-light"> etc
  description?: ReactNode;
  align?: "left" | "center";
}

/**
 * Bold editorial section header.
 * Massive ghosted numeral sits behind a serif display title.
 */
const SectionHeader = ({
  numeral,
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeaderProps) => {
  const alignCls = align === "center" ? "text-center items-center" : "text-left items-start";
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`relative mb-14 sm:mb-20 flex flex-col ${alignCls}`}
    >
      {/* Ghosted numeral */}
      <span
        aria-hidden
        className={`pointer-events-none select-none absolute -top-8 sm:-top-16 ${
          align === "center" ? "left-1/2 -translate-x-1/2" : "-left-2 sm:-left-4"
        } font-display font-black leading-none text-foreground/[0.05] text-[8rem] sm:text-[14rem] lg:text-[18rem] tracking-[-0.06em]`}
      >
        {numeral}
      </span>

      <div className="relative z-10">
        <div className={`flex items-center gap-3 mb-5 sm:mb-7 ${align === "center" ? "justify-center" : ""}`}>
          <span className="h-px w-8 bg-accent" />
          <span className="text-foreground/60 text-[10px] sm:text-xs font-display font-medium tracking-[0.18em]">
            {eyebrow}
          </span>
        </div>

        <h2 className="font-display font-black leading-[0.86] tracking-[-0.045em] text-[clamp(2.6rem,9vw,7rem)] mb-6 sm:mb-8">
          {title}
        </h2>

        {description && (
          <p className="text-muted-foreground max-w-xl text-sm sm:text-base leading-[1.75]">
            {description}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default SectionHeader;
