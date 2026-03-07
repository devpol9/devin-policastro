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
  { brand: "2THIRTY", code: "DEVON20", discount: "20% Off", shopUrl: "https://drink2thirty.com" },
  { brand: "Impact Zone NJ", code: "DEVONFREE", discount: "Free Day Pass", shopUrl: "#" },
  { brand: "Supplement Brand", code: "DEVON15", discount: "15% Off First Order", shopUrl: "#" },
  { brand: "Car Detailing Co.", code: "POLICASTRO10", discount: "10% Off", shopUrl: "#" },
  { brand: "Athletic Apparel", code: "DEVON25", discount: "25% Off Sitewide", shopUrl: "#" },
  { brand: "Meal Prep Service", code: "DEVMEALS", discount: "$30 Off First Week", shopUrl: "#" },
  { brand: "Fitness App Pro", code: "DEVFIT", discount: "1 Month Free", shopUrl: "#" },
  { brand: "Grooming Brand", code: "DEVON20G", discount: "20% Off Everything", shopUrl: "#" },
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
      {/* Animated gradient orb */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] animate-float" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/3 rounded-full blur-[120px] animate-float" style={{ animationDelay: "3s" }} />

      <div className="container-tight relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="h-px bg-primary mb-8"
          />
          <p className="text-primary font-display text-xs tracking-[0.4em] uppercase mb-4">[ 05 — Promo Codes ]</p>
          <h2 className="font-display font-bold text-4xl sm:text-6xl lg:text-7xl leading-[0.9] mb-6">
            My Codes.
            <br />
            <span className="gradient-text">Your Savings.</span>
          </h2>
          <p className="text-muted-foreground max-w-lg text-lg">
            Active promo codes across every brand I partner with. One tap to copy. Start saving.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-4 max-w-4xl">
          {promoCodes.map((promo, i) => (
            <motion.div
              key={promo.code}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
            >
              <TiltCard intensity={6}>
                <div className="glass-card p-6 relative overflow-hidden border border-border/20 hover:border-primary/30 transition-all duration-500 group">
                  {/* Ripple on copy */}
                  {ripple === promo.code && (
                    <div className="absolute inset-0 z-0">
                      <div className="absolute inset-0 bg-primary/10 animate-fade-in rounded-xl" />
                    </div>
                  )}

                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-display font-bold text-base group-hover:text-primary transition-colors">{promo.brand}</h3>
                        <div className="flex items-center gap-1.5 mt-1">
                          <Sparkles size={12} className="text-primary" />
                          <p className="text-primary text-sm font-semibold">{promo.discount}</p>
                        </div>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                        <Tag size={18} className="text-primary" />
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => copyCode(promo.code, promo.brand)}
                        className="flex-1 flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-secondary/80 border border-border/50 font-mono text-sm font-bold tracking-widest hover:border-primary/40 hover:bg-secondary transition-all group/copy relative overflow-hidden"
                      >
                        {/* Shine on hover */}
                        <div className="absolute inset-0 -translate-x-full group-hover/copy:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
                        <span className="relative z-10 flex items-center gap-2">
                          {copiedCode === promo.code ? (
                            <>
                              <Check size={14} className="text-primary" />
                              <span className="text-primary">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy size={14} className="text-muted-foreground group-hover/copy:text-primary transition-colors" />
                              {promo.code}
                            </>
                          )}
                        </span>
                      </button>
                      <a
                        href={promo.shopUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:shadow-lg hover:shadow-primary/30 hover:scale-105 transition-all duration-300 flex items-center gap-1.5"
                      >
                        <ExternalLink size={14} />
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
