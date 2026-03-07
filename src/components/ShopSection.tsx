import { motion, useScroll, useTransform } from "framer-motion";
import { ExternalLink, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import { toast } from "sonner";
import TiltCard from "@/components/effects/TiltCard";

interface Product {
  name: string;
  note: string;
  category: string;
  code?: string;
  link: string;
  image: string;
}

const products: Product[] = [
  { name: "2THIRTY Hydration Mix", note: "My brand. Clean hydration with function — no sugar, no garbage. I drink this every single day.", category: "Hydration", code: "DEVON20", link: "https://drink2thirty.com", image: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400&h=400&fit=crop" },
  { name: "Whey Protein Isolate", note: "30g protein, mixes clean, tastes legit. Non-negotiable in my stack.", category: "Supplements", link: "#", image: "https://images.unsplash.com/photo-1593095948071-474c5cc2c4d8?w=400&h=400&fit=crop" },
  { name: "Pre-Workout Formula", note: "Smooth energy, no crash. I hit this 20 min before every session.", category: "Supplements", code: "DEVON15", link: "#", image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=400&fit=crop" },
  { name: "Wireless Earbuds", note: "Gym-proof, sweat-proof, sound quality is insane. Can't train without em.", category: "Tech", link: "#", image: "https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=400&h=400&fit=crop" },
  { name: "Training Shoes", note: "Flat sole, great grip. Perfect for heavy lifts and circuits.", category: "Gear", link: "#", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop" },
  { name: "Car Detailing Kit", note: "I'm obsessive about my cars. This kit is what I actually use.", category: "Automotive", link: "#", image: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=400&h=400&fit=crop" },
];

const ShopSection = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Code copied: ${code}`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <section id="shop" className="section-padding relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/3 rounded-full blur-[200px]" />

      <div className="container-tight relative z-10" ref={containerRef}>
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
          <p className="text-primary font-display text-xs tracking-[0.4em] uppercase mb-4">[ 04 — Shop ]</p>
          <h2 className="font-display font-bold text-4xl sm:text-6xl lg:text-7xl leading-[0.9] mb-6">
            Things I
            <br />
            <span className="text-muted-foreground">Actually Use.</span>
          </h2>
          <p className="text-muted-foreground max-w-lg text-lg">
            Every product here is something I personally use and stand behind. 
            No paid placements — just real recommendations.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, i) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
            >
              <TiltCard className="h-full">
                <div className="glass-card overflow-hidden group h-full border border-border/20 hover:border-primary/30 transition-all duration-500">
                  {/* Image with zoom */}
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60" />

                    {/* Category badge */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full text-[10px] font-display font-bold tracking-[0.2em] uppercase bg-background/80 backdrop-blur-sm text-primary border border-primary/20">
                        {product.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="font-display font-bold text-lg mb-2 group-hover:text-primary transition-colors">{product.name}</h3>
                    <p className="text-muted-foreground text-sm mb-5 leading-relaxed line-clamp-2">{product.note}</p>

                    <div className="flex items-center gap-2">
                      {product.code && (
                        <button
                          onClick={() => copyCode(product.code!)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs font-mono font-bold hover:bg-primary/20 transition-all group/code"
                        >
                          {copiedCode === product.code ? (
                            <><Check size={12} /><span>Copied!</span></>
                          ) : (
                            <><Copy size={12} className="group-hover/code:scale-110 transition-transform" />{product.code}</>
                          )}
                        </button>
                      )}
                      <a
                        href={product.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-auto flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:shadow-lg hover:shadow-primary/30 hover:scale-105 transition-all duration-300"
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

export default ShopSection;
