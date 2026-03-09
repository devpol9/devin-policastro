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
  tourLink?: string;
  color: string;
  glowColor: string;
}

const products: Product[] = [
  {
    name: "Strawberry Lemonade",
    note: "The OG flavor — 5-in-1 hydration+ mixer. Zero sugar, zero calories. 3x hydration vs sports drinks.",
    category: "2THIRTY",
    code: "DEV",
    price: "$17.99",
    originalPrice: "$19.99",
    rating: "4.9",
    reviews: "847",
    link: "https://drink2thirty.com/product/drink-mixer-pre-covery?flavor=strawberry-lemonade&quantity=6-pack",
    image: "/images/2thirty-strawberry.png",
    color: "45 95% 55%",
    glowColor: "45 95% 55%",
  },
  {
    name: "Limeade",
    note: "Clean, crisp, and my go-to for daytime focus. NAC + L-Glutathione for liver support.",
    category: "2THIRTY",
    code: "DEV",
    price: "$17.99",
    originalPrice: "$19.99",
    rating: "4.9",
    reviews: "519",
    link: "https://drink2thirty.com/product/drink-mixer-pre-covery?flavor=limeade&quantity=6-pack",
    image: "/images/2thirty-limeade.png",
    color: "130 70% 50%",
    glowColor: "130 70% 50%",
  },
  {
    name: "Red Raspberry",
    note: "Night mode flavor — pre-covery support with adaptogens like Milk Thistle and Ginseng Root.",
    category: "2THIRTY",
    code: "DEV",
    price: "$17.99",
    originalPrice: "$19.99",
    rating: "4.8",
    reviews: "632",
    link: "https://drink2thirty.com/product/drink-mixer-pre-covery?flavor=red-raspberry&quantity=6-pack",
    image: "/images/2thirty-raspberry.png",
    color: "340 75% 55%",
    glowColor: "340 75% 55%",
  },
  {
    name: "Impact Zone Membership",
    note: "51,000 sq ft. No contracts. Cold plunges, infrared saunas, hot yoga, red light therapy. $139/mo.",
    category: "Fitness",
    link: "https://onlinejoin.abcfitness.com/signup/plan?club=30591",
    image: "/images/iz-machines-red.jpg",
    tourLink: "https://calendar.app.google/2MSzLtJVX7GZ93Zs9",
    color: "38 90% 58%",
    glowColor: "38 90% 58%",
  },
  {
    name: "Fitrition",
    note: "Clean, macro-friendly meals delivered. Real food, real results. Fuel your training the right way.",
    category: "Nutrition",
    code: "DEVIN10",
    link: "https://fitrition.com",
    image: "/images/fitrition-plate.png",
    color: "120 60% 50%",
    glowColor: "120 60% 50%",
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
          <p className="text-primary/80 font-display text-[10px] tracking-[0.5em] uppercase mb-4 sm:mb-5">[ 04 — Shop & Codes ]</p>
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

        {/* Product cards */}
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
                <div
                  className="overflow-hidden group h-full transition-all duration-700 rounded-lg relative"
                  style={{
                    background: `linear-gradient(145deg, hsl(225 20% 7% / 0.95) 0%, hsl(225 20% 5% / 0.8) 100%)`,
                    border: `1px solid hsl(${product.color} / 0.3)`,
                    boxShadow: `0 4px 30px hsl(${product.glowColor} / 0.1), inset 0 1px 0 hsl(${product.color} / 0.12)`,
                  }}
                >
                  {/* Top accent */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[2px] opacity-70 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `linear-gradient(90deg, transparent 5%, hsl(${product.color}) 50%, transparent 95%)` }}
                  />
                  {/* Ambient glow */}
                  <div
                    className="absolute inset-0 opacity-[0.06] group-hover:opacity-[0.18] transition-opacity duration-700"
                    style={{ background: `radial-gradient(ellipse at 50% 0%, hsl(${product.glowColor}) 0%, transparent 70%)` }}
                  />
                  {/* Hover border glow */}
                  <div
                    className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ boxShadow: `inset 0 0 0 1px hsl(${product.color} / 0.5), 0 0 40px hsl(${product.glowColor} / 0.15)` }}
                  />

                  <div className="relative z-10">
                    <div className="aspect-[4/3] overflow-hidden relative bg-card/30">
                      <img
                        src={product.image}
                        alt={product.name}
                        className={`w-full h-full ${product.category === "Fitness" || product.category === "Nutrition" ? "object-cover" : "object-contain p-4"} group-hover:scale-105 transition-transform duration-700`}
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[hsl(225_20%_5%)] via-transparent to-transparent opacity-70" />
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span
                          className="px-2.5 sm:px-3 py-1 rounded-full text-[8px] sm:text-[9px] font-display font-bold tracking-[0.2em] uppercase backdrop-blur-xl"
                          style={{
                            color: `hsl(${product.color})`,
                            background: `hsl(${product.color} / 0.2)`,
                            border: `1px solid hsl(${product.color} / 0.8)`,
                            boxShadow: `0 0 10px hsl(${product.color} / 0.25), inset 0 0 6px hsl(${product.color} / 0.1)`,
                            textShadow: `0 0 8px hsl(${product.color} / 0.5)`,
                          }}
                        >
                          {product.category}
                        </span>
                        {product.price && (
                          <span
                            className="px-2 py-1 rounded-full text-[8px] sm:text-[9px] font-bold"
                            style={{
                              background: `hsl(${product.color})`,
                              color: `hsl(225 25% 3%)`,
                              boxShadow: `0 0 12px hsl(${product.color} / 0.4)`,
                            }}
                          >
                            10% OFF
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
                      <h3
                        className="font-display font-bold text-sm sm:text-base mb-1.5 sm:mb-2 transition-colors duration-300"
                        style={{ color: `hsl(${product.color})` }}
                      >
                        {product.name}
                      </h3>
                      <p className="text-muted-foreground text-xs sm:text-sm mb-4 sm:mb-5 leading-relaxed line-clamp-2">{product.note}</p>

                      {product.price && (
                        <div className="flex items-center gap-2 mb-4 sm:mb-5 flex-wrap">
                          <span className="font-display font-bold text-base sm:text-lg" style={{ color: `hsl(${product.color})` }}>{product.price}</span>
                          <span className="text-muted-foreground text-xs sm:text-sm line-through">{product.originalPrice}</span>
                          <span className="text-[8px] sm:text-[9px] text-muted-foreground tracking-wider">FREE SHIPPING</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        {product.code && (
                          <button
                            onClick={() => copyCode(product.code!)}
                            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-lg text-[10px] sm:text-xs font-mono font-bold transition-all group/code"
                            style={{
                              background: `hsl(${product.color} / 0.12)`,
                              border: `1px solid hsl(${product.color} / 0.3)`,
                              color: `hsl(${product.color})`,
                            }}
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
                          className="ml-auto flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-[10px] sm:text-xs font-display font-semibold tracking-wide hover:scale-[1.02] transition-all duration-500"
                          style={{ background: `hsl(${product.color})`, color: `hsl(225 25% 3%)` }}
                        >
                          <ExternalLink size={12} />
                          Shop
                        </a>
                      </div>

                      {product.tourLink && (
                        <a
                          href={product.tourLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 mt-3 sm:mt-4 py-2 rounded-lg text-[10px] sm:text-xs font-display font-semibold tracking-wider uppercase transition-all duration-500"
                          style={{
                            border: `1px solid hsl(${product.color} / 0.3)`,
                            color: `hsl(${product.color} / 0.8)`,
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = `hsl(${product.color} / 0.15)`; e.currentTarget.style.color = `hsl(${product.color})`; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = `transparent`; e.currentTarget.style.color = `hsl(${product.color} / 0.8)`; }}
                        >
                          📍 Book a Gym Tour
                        </a>
                      )}
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
