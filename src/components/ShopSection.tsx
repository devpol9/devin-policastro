import { motion } from "framer-motion";
import { ExternalLink, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

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

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Code copied: ${code}`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <section id="shop" className="section-padding">
      <div className="container-tight">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-primary font-display text-sm tracking-[0.25em] uppercase mb-3">Shop</p>
          <h2 className="font-display font-bold text-3xl sm:text-5xl mb-4">
            Things I Actually Use.
            <br />
            <span className="text-muted-foreground">Not Just Promote.</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Every product here is something I personally use, trust, and stand behind. 
            No paid placements — just real recommendations.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((product, i) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass-card-hover overflow-hidden group"
            >
              <div className="aspect-square overflow-hidden bg-secondary">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="p-5">
                <span className="text-primary text-xs font-display font-medium tracking-wider uppercase">
                  {product.category}
                </span>
                <h3 className="font-display font-semibold text-lg mt-1 mb-2">{product.name}</h3>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{product.note}</p>

                <div className="flex items-center gap-2">
                  {product.code && (
                    <button
                      onClick={() => copyCode(product.code!)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors"
                    >
                      {copiedCode === product.code ? <Check size={12} /> : <Copy size={12} />}
                      {product.code}
                    </button>
                  )}
                  <Button variant="glow" size="sm" className="ml-auto" asChild>
                    <a href={product.link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink size={14} />
                      Shop
                    </a>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopSection;
