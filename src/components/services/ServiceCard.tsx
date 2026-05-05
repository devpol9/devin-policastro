import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface ServiceCardProps {
  icon: LucideIcon;
  name: string;
  desc: string;
  detail?: string;
  meta?: string;
  index: number;
  accentColor: string;
}

/**
 * Calm, neutral, premium service tile.
 * Accent color is reserved for a single hairline at the top — never on text or icon by default.
 * No per-card CTA. Inquiries are routed through the page-level "Start an inquiry" button.
 */
const ServiceCard = ({ icon: Icon, name, desc, detail, meta, index, accentColor }: ServiceCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ delay: 0.06 + index * 0.04, duration: 0.4 }}
    className="group relative overflow-hidden rounded-xl bg-card border border-border/60 hover:border-foreground/20 transition-colors duration-300"
  >
    <div
      className="absolute top-0 left-0 right-0 h-px opacity-50 group-hover:opacity-100 transition-opacity"
      style={{ background: `hsl(${accentColor})` }}
    />
    <div className="p-4 sm:p-5">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center shrink-0 group-hover:bg-foreground/[0.06] transition-colors">
          <Icon size={15} className="text-foreground/70 group-hover:text-foreground transition-colors" strokeWidth={1.6} />
        </div>
        <div className="flex-1 min-w-0 pt-0.5">
          <h3 className="font-display font-bold text-sm sm:text-[15px] leading-tight text-foreground">
            {name}
          </h3>
          {meta && (
            <p className="text-foreground/50 text-[10px] font-display font-medium tracking-wide mt-0.5">
              {meta}
            </p>
          )}
        </div>
      </div>
      <p className="text-muted-foreground text-[12px] sm:text-[13px] leading-[1.55]">
        {desc}
      </p>
      {detail && (
        <p className="text-muted-foreground/70 text-[11px] sm:text-xs leading-[1.55] mt-1.5">
          {detail}
        </p>
      )}
    </div>
  </motion.div>
);

export default ServiceCard;
