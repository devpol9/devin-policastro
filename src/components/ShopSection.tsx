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
  price?: string;
  originalPrice?: string;
  rating?: string;
  reviews?: string;
  link: string;
  image: string;
}

const products: Product[] = [
  {
    name: "Strawberry Lemonade",
    note: "The OG flavor — 5-in-1 hydration+ mixer. Zero sugar, zero calories. 3x hydration vs sports drinks. I drink this every single day.",
    category: "2THIRTY",
    code: "DEV",
    price: "$12.97",
    originalPrice: "$19.99",
    rating: "4.9",
    reviews: "847",
    link: "https://drink2thirty.com/product/drink-mixer-pre-covery?flavor=strawberry-lemonade&quantity=6-pack",
    image: "/images/2thirty-strawberry.png",
  },
  {
    name: "Limeade",
    note: "Clean, crisp, and my go-to for daytime focus. NAC + L-Glutathione for liver support. Caffeine-free steady energy.",
    category: "2THIRTY",
    code: "DEV",
    price: "$12.97",
    originalPrice: "$19.99",
    rating: "4.9",
    reviews: "519",
    link: "https://drink2thirty.com/product/drink-mixer-pre-covery?flavor=limeade&quantity=6-pack",
    image: "/images/2thirty-limeade.png",
  },
  {
    name: "Red Raspberry",
    note: "Night mode flavor — pre-covery support with adaptogens like Milk Thistle and Ginseng Root. Feel human the next day.",
    category: "2THIRTY",
    code: "DEV",
    price: "$12.97",
    originalPrice: "$19.99",
    rating: "4.8",
    reviews: "632",
    link: "https://drink2thirty.com/product/drink-mixer-pre-covery?flavor=red-raspberry&quantity=6-pack",
    image: "/images/2thirty-raspberry.png",
  },
  {
    name: "Subscribe & Save 20%",
    note: "Never run out. Subscribe and save 20% on every order. Auto-delivered on your schedule. $10.38/pack.",
    category: "2THIRTY",
    link: "https://drink2thirty.com/subscribe",
    image: "/images/2thirty-strawberry.png",
  },
  {
    name: "Impact Zone Membership",
    note: "51,000 sq ft. No contracts. Cold plunges, infrared saunas, hot yoga, red light therapy, basketball court, 5K turf. $139/mo.",
    category: "Fitness",
    link: "https://onlinejoin.abcfitness.com/signup/plan?club=30591",
    image: "/images/iz-hero.jpg",
  },
  {
    name: "Book a Gym Tour",
    note: "Come see Impact Zone in person. Schedule a tour directly with me — 335 Chestnut St, Norwood, NJ.",
    category: "Fitness",
    link: "https://calendar.app.google/2MSzLtJVX7GZ93Zs9",
    image: "/images/iz-mezzanine.jpg",
  },
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
            2THIRTY is my brand — 5-in-1 hydration+ mixer with zero sugar, zero calories. 
            4.9 stars from 3,500+ reviews. 7,000+ packs sold. Made in the USA.
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
                  <div className="aspect-[4/3] overflow-hidden relative bg-secondary/30">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 p-4"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60" />
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-[10px] font-display font-bold tracking-[0.2em] uppercase bg-background/80 backdrop-blur-sm text-primary border border-primary/20">
                        {product.category}
                      </span>
                      {product.price && (
                        <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-primary text-primary-foreground">
                          35% OFF
                        </span>
                      )}
                    </div>
                    {product.rating && (
                      <div className="absolute top-4 right-4 px-2 py-1 rounded-full text-[10px] font-bold bg-background/80 backdrop-blur-sm text-foreground border border-border/20">
                        ⭐ {product.rating} ({product.reviews})
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="font-display font-bold text-lg mb-2 group-hover:text-primary transition-colors">{product.name}</h3>
                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed line-clamp-2">{product.note}</p>

                    {product.price && (
                      <div className="flex items-center gap-2 mb-4">
                        <span className="font-display font-bold text-lg text-primary">{product.price}</span>
                        <span className="text-muted-foreground text-sm line-through">{product.originalPrice}</span>
                        <span className="text-[10px] text-muted-foreground">• FREE Shipping</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      {product.code && (
                        <button
                          onClick={() => copyCode(product.code!)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs font-mono font-bold hover:bg-primary/20 transition-all group/code"
                        >
                          {copiedCode === product.code ? (
                            <><Check size={12} /><span>Copied!</span></>
                          ) : (
                            <><Copy size={12} className="group-hover/code:scale-110 transition-transform" />Code: {product.code}</>
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
