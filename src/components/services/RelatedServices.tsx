import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { getRelated, type ServiceSlug } from "@/lib/serviceContent";

interface Props {
  current: ServiceSlug;
}

const RelatedServices = ({ current }: Props) => {
  const items = getRelated(current);
  if (!items.length) return null;

  return (
    <section className="mt-8 mb-20">
      <div className="flex items-center gap-2.5 mb-4">
        <span className="font-mono text-[10px] text-foreground/50 tracking-tight">[ Related ]</span>
        <span className="h-px w-5 bg-foreground/15" />
      </div>
      <h2 className="font-display font-extrabold text-2xl sm:text-3xl mb-6 tracking-[-0.02em]">
        Also explore.
      </h2>
      <div className="grid sm:grid-cols-3 gap-3 sm:gap-4">
        {items.map((r, i) => {
          const Icon = r.icon;
          return (
            <motion.div
              key={r.slug}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
            >
              <Link
                to={`/${r.slug}`}
                className="group relative overflow-hidden rounded-lg p-5 block transition-all duration-300"
                style={{
                  background: `linear-gradient(145deg, hsl(36 30% 99% / 0.95) 0%, hsl(33 20% 95% / 0.8) 100%)`,
                  border: `1px solid hsl(${r.color} / 0.15)`,
                }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-[2px]"
                  style={{ background: `linear-gradient(90deg, transparent, hsl(${r.color}), transparent)` }}
                />
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                      background: `hsl(${r.color} / 0.15)`,
                      border: `1px solid hsl(${r.color} / 0.25)`,
                    }}
                  >
                    <Icon size={18} style={{ color: `hsl(${r.color})` }} />
                  </div>
                  <ArrowUpRight
                    size={16}
                    className="opacity-50 group-hover:opacity-100 transition-opacity"
                    style={{ color: `hsl(${r.color})` }}
                  />
                </div>
                <h3 className="font-display font-bold text-sm mb-1.5" style={{ color: `hsl(${r.color})` }}>
                  {r.label}
                </h3>
                <p className="text-muted-foreground text-xs leading-[1.6]">{r.blurb}</p>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default RelatedServices;
