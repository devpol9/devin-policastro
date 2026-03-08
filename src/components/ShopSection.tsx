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
    note: "The OG flavor — 5-in-1 hydration+ mixer. Zero sugar, zero calories. 3x hydration vs sports drinks.",
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
    note: "Clean, crisp, and my go-to for daytime focus. NAC + L-Glutathione for liver support.",
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
    note: "Night mode flavor — pre-covery support with adaptogens like Milk Thistle and Ginseng Root.",
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
    note: "Never run out. Auto-delivered on your schedule. $10.38/pack.",
    category: "2THIRTY",
    link: "https://drink2thirty.com/subscribe",
    image: "/images/2thirty-strawberry.png",
  },
  {
    name: "Impact Zone Membership",
    note: "51,000 sq ft. No contracts. Cold plunges, infrared saunas, hot yoga, red light therapy. $139/mo.",
    category: "Fitness",
    link: "https://onlinejoin.abcfitness.com/signup/plan?club=30591",
    image: "/images/iz-hero.jpg",
  },
  {
    name: "Book a Gym Tour",
    note: "Come see Impact Zone in person. Schedule a tour directly with me.",
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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/3 rounded-full blur-[200px]" />

      <div className="container-tight relative z-10" ref={containerRef}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 sm:mb-20"
        >
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 60 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="h-px bg-primary/60 mb-8 sm:mb-10"
          />
          <p className="text-primary/80 font-display text-[10px] tracking-[0.5em] uppercase mb-4 sm:mb-5">[ 04 — Shop ]</p>
          <h2 className="font-display font-extrabold text-3xl sm:text-6xl lg:text-7xl leading-[0.88] mb-6 sm:mb-8 tracking-[-0.02em]">
            Things I
            <br />
            <span className="text-muted-foreground">Actually Use.</span>
          </h2>
          <p className="text-muted-foreground max-w-md text-xs sm:text-base leading-[1.8]">
            2THIRTY is my brand — 5-in-1 hydration+ mixer with zero sugar, zero calories. 
            4.9 stars. 7,000+ packs sold. Made in the USA.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {products.map((product, i) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.7 }}
            >
              <TiltCard className="h-full">
                <div className="glass-card overflow-hidden group h-full hover:border-primary/20 transition-all duration-700">
                  <div className="aspect-[4/3] overflow-hidden relative bg-card/50">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 p-4"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60" />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2 sm:px-3 py-1 rounded-full text-[8px] sm:text-[9px] font-display font-bold tracking-[0.2em] uppercase bg-background/80 backdrop-blur-xl text-primary/80 border border-primary/15">
                        {product.category}
                      </span>
                      {product.price && (
                        <span className="px-2 py-1 rounded-full text-[8px] sm:text-[9px] font-bold bg-primary text-primary-foreground">
                          35% OFF
                        </span>
                      )}
                    </div>
                    {product.rating && (
                      <div className="absolute top-3 right-3 px-2 py-1 rounded-full text-[8px] sm:text-[9px] font-medium bg-background/80 backdrop-blur-xl text-foreground/80 border border-border/20">
                        ⭐ {product.rating} ({product.reviews})
                      </div>
                    )}
                  </div>

                  <div className="p-4 sm:p-6">
                    <h3 className="font-display font-bold text-sm sm:text-base mb-1.5 sm:mb-2 group-hover:text-primary transition-colors duration-300">{product.name}</h3>
                    <p className="text-muted-foreground text-xs sm:text-sm mb-4 sm:mb-5 leading-relaxed line-clamp-2">{product.note}</p>

                    {product.price && (
                      <div className="flex items-center gap-2 mb-4 sm:mb-5 flex-wrap">
                        <span className="font-display font-bold text-base sm:text-lg text-primary">{product.price}</span>
                        <span className="text-muted-foreground text-xs sm:text-sm line-through">{product.originalPrice}</span>
                        <span className="text-[8px] sm:text-[9px] text-muted-foreground tracking-wider">FREE SHIPPING</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      {product.code && (
                        <button
                          onClick={() => copyCode(product.code!)}
                          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-lg bg-primary/8 border border-primary/15 text-primary/80 text-[10px] sm:text-xs font-mono font-bold hover:bg-primary/15 transition-all group/code"
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
                        className="ml-auto flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg bg-primary text-primary-foreground text-[10px] sm:text-xs font-display font-semibold tracking-wide hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.02] transition-all duration-500"
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

export default ShopSection;