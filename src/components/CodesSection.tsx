import { motion } from "framer-motion";
import { Copy, Check, ExternalLink, Tag, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import TiltCard from "@/components/effects/TiltCard";

interface PromoCode {
  brand: string;
  code: string;
  discount: string;
  shopUrl: string;
}

const promoCodes: PromoCode[] = [
  { brand: "2THIRTY", code: "DEV", discount: "35% Off + Free Shipping", shopUrl: "https://drink2thirty.com/shop" },
  { brand: "Fitrition", code: "DEVIN10", discount: "10% Off", shopUrl: "https://fitrition.com" },
  { brand: "Impact Zone NJ", code: "DEVINFREE", discount: "Free Day Pass", shopUrl: "https://onlinejoin.abcfitness.com/signup/plan?club=30591" },
];

const CodesSection = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [ripple, setRipple] = useState<string | null>(null);

  const copyCode = (code: string, brand: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setRipple(code);
    toast.success(`Copied code for ${brand}: ${code}`);
    setTimeout(() => setCopiedCode(null), 2000);
    setTimeout(() => setRipple(null), 600);
  };

  return (
    <section id="codes" className="section-padding relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/4 rounded-full blur-[180px] animate-float" />

      <div className="container-tight relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 60 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="h-px bg-primary/60 mb-10"
          />
          <p className="text-primary/80 font-display text-[10px] tracking-[0.5em] uppercase mb-5">[ 05 — Promo Codes ]</p>
          <h2 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl leading-[0.88] mb-8 tracking-[-0.02em]">
            My Codes.
            <br />
            <span className="gradient-text">Your Savings.</span>
          </h2>
          <p className="text-muted-foreground max-w-md text-base leading-[1.8]">
            Active promo codes across every brand I partner with. One tap to copy.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-4 max-w-4xl">
          {promoCodes.map((promo, i) => (
            <motion.div
              key={promo.code}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
            >
              <TiltCard intensity={6}>
                <div className="glass-card p-6 relative overflow-hidden hover:border-primary/20 transition-all duration-700 group">
                  {ripple === promo.code && (
                    <div className="absolute inset-0 z-0">
                      <div className="absolute inset-0 bg-primary/8 animate-fade-in rounded-lg" />
                    </div>
                  )}

                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-5">
                      <div>
                        <h3 className="font-display font-bold text-base group-hover:text-primary transition-colors duration-300">{promo.brand}</h3>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <Sparkles size={11} className="text-primary/70" />
                          <p className="text-primary/80 text-sm font-medium">{promo.discount}</p>
                        </div>
                      </div>
                      <div className="w-9 h-9 rounded-lg bg-primary/8 flex items-center justify-center group-hover:bg-primary/15 group-hover:scale-105 transition-all duration-500">
                        <Tag size={15} className="text-primary/70" />
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={() => copyCode(promo.code, promo.brand)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-card border border-border/30 font-mono text-xs font-bold tracking-[0.15em] hover:border-primary/30 transition-all group/copy relative overflow-hidden"
                      >
                        <div className="absolute inset-0 -translate-x-full group-hover/copy:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-primary/5 to-transparent" />
                        <span className="relative z-10 flex items-center gap-2">
                          {copiedCode === promo.code ? (
                            <>
                              <Check size={13} className="text-primary" />
                              <span className="text-primary">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy size={13} className="text-muted-foreground group-hover/copy:text-primary transition-colors" />
                              {promo.code}
                            </>
                          )}
                        </span>
                      </button>
                      <a
                        href={promo.shopUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-3 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-xs tracking-wide hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.02] transition-all duration-500 flex items-center gap-1.5"
                      >
                        <ExternalLink size={12} />
                        Shop
                      </a>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CodesSection;