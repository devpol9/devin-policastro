import { motion } from "framer-motion";
import { ExternalLink, Copy, Check } from "lucide-react";
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
  { name: "2THIRTY Strawberry Lemonade", note: "My brand. The OG flavor — 5-in-1 hydration with zero sugar, zero calories. I drink this every single day.", category: "2THIRTY", code: "35% OFF", link: "https://drink2thirty.com/product/drink-mixer-pre-covery?flavor=strawberry-lemonade&quantity=6-pack", image: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400&h=400&fit=crop" },
  { name: "2THIRTY Limeade", note: "Clean, crisp, and my go-to for daytime focus. NAC + L-Glutathione for liver support.", category: "2THIRTY", link: "https://drink2thirty.com/product/drink-mixer-pre-covery?flavor=limeade&quantity=6-pack", image: "https://images.unsplash.com/photo-1593095948071-474c5cc2c4d8?w=400&h=400&fit=crop" },
  { name: "2THIRTY Red Raspberry", note: "Night mode flavor — pre-covery support with adaptogens like Milk Thistle and Ginseng Root.", category: "2THIRTY", link: "https://drink2thirty.com/product/drink-mixer-pre-covery?flavor=red-raspberry&quantity=6-pack", image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=400&fit=crop" },
  { name: "2THIRTY Subscribe & Save", note: "Never run out. Subscribe and save 20% on every order. Auto-delivered on your schedule.", category: "2THIRTY", link: "https://drink2thirty.com/subscribe", image: "https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=400&h=400&fit=crop" },
  { name: "Impact Zone Membership", note: "51,000 sq ft of Bergen County's biggest gym. No contracts, $139/mo. Cold plunges, saunas, turf, basketball court.", category: "Fitness", link: "https://onlinejoin.abcfitness.com/signup/plan?club=30591", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop" },
  { name: "Book a Gym Tour", note: "Come see Impact Zone in person. Schedule a tour directly with me — Norwood, NJ.", category: "Fitness", link: "https://calendar.app.google/2MSzLtJVX7GZ93Zs9", image: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=400&h=400&fit=crop" },
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
            2THIRTY is my brand — the rest are real recommendations from my daily life.
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
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60" />
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
