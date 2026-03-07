import { motion } from "framer-motion";
import { Copy, Check, ExternalLink, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

interface PromoCode {
  brand: string;
  code: string;
  discount: string;
  shopUrl: string;
  logo?: string;
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

  const copyCode = (code: string, brand: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Copied code for ${brand}: ${code}`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <section id="codes" className="section-padding relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(210_100%_55%/0.04)_0%,transparent_70%)]" />

      <div className="container-tight relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-primary font-display text-sm tracking-[0.25em] uppercase mb-3">Promo Codes</p>
          <h2 className="font-display font-bold text-3xl sm:text-5xl mb-4">
            My Codes. <span className="text-muted-foreground">Your Savings.</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            These are my active promo codes across every brand I partner with. 
            One tap to copy. Start saving.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {promoCodes.map((promo, i) => (
            <motion.div
              key={promo.code}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="glass-card-hover p-5 flex flex-col gap-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display font-semibold text-base">{promo.brand}</h3>
                  <p className="text-primary text-sm font-semibold">{promo.discount}</p>
                </div>
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Tag size={16} className="text-primary" />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyCode(promo.code, promo.brand)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-secondary border border-border/50 font-mono text-sm font-bold tracking-wider hover:border-primary/40 transition-all group"
                >
                  {copiedCode === promo.code ? (
                    <>
                      <Check size={14} className="text-primary" />
                      <span className="text-primary">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
                      {promo.code}
                    </>
                  )}
                </button>
                <Button variant="glow" size="sm" asChild>
                  <a href={promo.shopUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink size={14} />
                    Shop
                  </a>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CodesSection;
