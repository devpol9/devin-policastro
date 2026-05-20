import { motion } from "framer-motion";
import { ReactNode, CSSProperties } from "react";

interface SectionHeaderProps {
  numeral: string;
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2";
  /** Optional HSL string (e.g. "270 16% 50%") to override the accent color (used on service pages). */
  accentColor?: string;
}

const SectionHeader = ({
  numeral,
  eyebrow,
  title,
  description,
  align = "left",
  as = "h2",
  accentColor,
}: SectionHeaderProps) => {
  const alignCls = align === "center" ? "text-center items-center" : "text-left items-start";
  const Heading = as as keyof JSX.IntrinsicElements;
  const accentStyle: CSSProperties | undefined = accentColor
    ? ({ ["--header-accent" as never]: `hsl(${accentColor})` } as CSSProperties)
    : undefined;
  const lineStyle = accentColor ? { background: `hsl(${accentColor})` } : undefined;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`relative mb-10 sm:mb-14 flex flex-col ${alignCls}`}
      style={accentStyle}
    >
      <div className="relative z-10 w-full">
        <div className={`flex items-center gap-2.5 mb-4 sm:mb-5 ${align === "center" ? "justify-center" : ""}`}>
          <span className="font-mono text-[10px] text-foreground/50 tabular-nums tracking-tight">
            [ {numeral} ]
          </span>
          <span className="h-px w-5 bg-foreground/15" style={lineStyle} />
          <span className="text-foreground/60 text-[11px] font-body font-medium lowercase tracking-tight">
            {eyebrow}
          </span>
        </div>

        <Heading className="font-display font-black leading-[0.92] tracking-[-0.035em] text-[clamp(1.85rem,5.5vw,4rem)] mb-4 sm:mb-5">
          {title}
        </Heading>

        {description && (
          <p className="text-muted-foreground max-w-xl text-sm sm:text-base leading-[1.7]">
            {description}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default SectionHeader;
