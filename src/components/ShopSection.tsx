import { motion } from "framer-motion";
import { ExternalLink, Copy, Check, Tag, Sparkles, Dumbbell, Zap, Star, Target, Clock, MapPin } from "lucide-react";
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
}

interface PromoCode {
  brand: string;
  code: string;
  discount: string;
  shopUrl: string;
  color: string;
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
    color: "0 85% 60%",
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
    color: "155 85% 55%",
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
    color: "280 100% 70%",
  },
  {
    name: "Impact Zone Membership",
    note: "51,000 sq ft. No contracts. Cold plunges, infrared saunas, hot yoga, red light therapy. $139/mo.",
    category: "Fitness",
    link: "https://onlinejoin.abcfitness.com/signup/plan?club=30591",
    image: "/images/iz-machines-red.jpg",
    tourLink: "https://calendar.app.google/2MSzLtJVX7GZ93Zs9",
    color: "38 90% 58%",
  },
  {
    name: "Fitrition",
    note: "Clean, macro-friendly meals delivered. Real food, real results. Fuel your training the right way.",
    category: "Nutrition",
    code: "DEVIN10",
    link: "https://fitrition.com",
    image: "/images/fitrition-plate.png",
    color: "120 60% 50%",
  },
];

const promoCodes: PromoCode[] = [
  { brand: "2THIRTY", code: "DEV", discount: "35% Off + Free Shipping", shopUrl: "https://drink2thirty.com/shop", color: "195 90% 55%" },
  { brand: "Fitrition", code: "DEVIN10", discount: "10% Off", shopUrl: "https://fitrition.com", color: "120 60% 50%" },
];

const ShopSection = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [ripple, setRipple] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const copyCode = (code: string, label?: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setRipple(code);
    toast.success(`Code copied: ${code}`);
    setTimeout(() => setCopiedCode(null), 2000);
    setTimeout(() => setRipple(null), 600);
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-12 sm:mb-16">
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
                    border: `1px solid hsl(${product.color} / 0.15)`,
                    boxShadow: `0 4px 24px hsl(225 30% 2% / 0.6), inset 0 1px 0 hsl(${product.color} / 0.06)`,
                  }}
                >
                  {/* Top accent */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[2px] opacity-50 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `linear-gradient(90deg, transparent, hsl(${product.color}), transparent)` }}
                  />
                  {/* Ambient glow */}
                  <div
                    className="absolute inset-0 opacity-[0.04] group-hover:opacity-[0.12] transition-opacity duration-700"
                    style={{ background: `radial-gradient(ellipse at 50% 0%, hsl(${product.color}) 0%, transparent 70%)` }}
                  />
                  {/* Hover border glow */}
                  <div
                    className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ boxShadow: `inset 0 0 0 1px hsl(${product.color} / 0.3), 0 0 20px hsl(${product.color} / 0.08)` }}
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
                            background: `hsl(${product.color} / 0.12)`,
                            border: `1px solid hsl(${product.color} / 0.25)`,
                          }}
                        >
                          {product.category}
                        </span>
                        {product.price && (
                          <span
                            className="px-2 py-1 rounded-full text-[8px] sm:text-[9px] font-bold"
                            style={{ background: `hsl(${product.color})`, color: `hsl(225 25% 3%)` }}
                          >
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
                      <h3
                        className="font-display font-bold text-sm sm:text-base mb-1.5 sm:mb-2 transition-colors duration-300"
                        style={{ color: `hsl(${product.color} / 0.9)` }}
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
                              background: `hsl(${product.color} / 0.08)`,
                              border: `1px solid hsl(${product.color} / 0.2)`,
                              color: `hsl(${product.color} / 0.8)`,
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
                            border: `1px solid hsl(${product.color} / 0.2)`,
                            color: `hsl(${product.color} / 0.7)`,
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = `hsl(${product.color} / 0.1)`; e.currentTarget.style.color = `hsl(${product.color})`; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = `transparent`; e.currentTarget.style.color = `hsl(${product.color} / 0.7)`; }}
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

        {/* Promo Codes */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 sm:mb-10"
        >
          <h3 className="font-display font-extrabold text-xl sm:text-3xl mb-2 tracking-[-0.02em]">
            My Codes. <span className="gradient-text">Your Savings.</span>
          </h3>
          <p className="text-muted-foreground text-xs sm:text-sm">One tap to copy. Active across every brand I partner with.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {promoCodes.map((promo, i) => (
            <motion.div
              key={promo.code + promo.brand}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
            >
              <TiltCard intensity={6}>
                <div
                  className="p-4 sm:p-6 relative overflow-hidden transition-all duration-700 group rounded-lg"
                  style={{
                    background: `linear-gradient(145deg, hsl(225 20% 7% / 0.95) 0%, hsl(225 20% 5% / 0.8) 100%)`,
                    border: `1px solid hsl(${promo.color} / 0.15)`,
                    boxShadow: `0 4px 24px hsl(225 30% 2% / 0.6), inset 0 1px 0 hsl(${promo.color} / 0.06)`,
                  }}
                >
                  {/* Top accent */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[2px] opacity-50 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `linear-gradient(90deg, transparent, hsl(${promo.color}), transparent)` }}
                  />
                  <div
                    className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.1] transition-opacity duration-700"
                    style={{ background: `radial-gradient(ellipse at 50% 0%, hsl(${promo.color}) 0%, transparent 70%)` }}
                  />

                  {ripple === promo.code && (
                    <div className="absolute inset-0 z-0">
                      <div className="absolute inset-0 animate-fade-in rounded-lg" style={{ background: `hsl(${promo.color} / 0.08)` }} />
                    </div>
                  )}

                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4 sm:mb-5">
                      <div>
                        <h3
                          className="font-display font-bold text-sm sm:text-base transition-colors duration-300"
                          style={{ color: `hsl(${promo.color} / 0.9)` }}
                        >
                          {promo.brand}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-1">
                          <Sparkles size={11} style={{ color: `hsl(${promo.color} / 0.7)` }} />
                          <p className="text-xs sm:text-sm font-medium" style={{ color: `hsl(${promo.color} / 0.8)` }}>{promo.discount}</p>
                        </div>
                      </div>
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-500 shrink-0"
                        style={{
                          background: `linear-gradient(135deg, hsl(${promo.color} / 0.18) 0%, hsl(${promo.color} / 0.06) 100%)`,
                          border: `1px solid hsl(${promo.color} / 0.25)`,
                        }}
                      >
                        <Tag size={14} style={{ color: `hsl(${promo.color} / 0.7)` }} />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyCode(promo.code, promo.brand)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg font-mono text-[10px] sm:text-xs font-bold tracking-[0.15em] transition-all group/copy relative overflow-hidden"
                        style={{
                          background: `hsl(${promo.color} / 0.06)`,
                          border: `1px solid hsl(${promo.color} / 0.15)`,
                          color: `hsl(${promo.color} / 0.8)`,
                        }}
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          {copiedCode === promo.code ? (
                            <>
                              <Check size={13} style={{ color: `hsl(${promo.color})` }} />
                              <span style={{ color: `hsl(${promo.color})` }}>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy size={13} className="group-hover/copy:scale-110 transition-transform" />
                              {promo.code}
                            </>
                          )}
                        </span>
                      </button>
                      <a
                        href={promo.shopUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg font-display font-semibold text-[10px] sm:text-xs tracking-wide hover:scale-[1.02] transition-all duration-500 flex items-center gap-1.5 shrink-0"
                        style={{ background: `hsl(${promo.color})`, color: `hsl(225 25% 3%)` }}
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

        {/* Impact Zone Facility Perks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-12 sm:mt-16"
        >
          <h3 className="font-display font-extrabold text-xl sm:text-3xl mb-2 tracking-[-0.02em]">
            Impact Zone. <span className="gradient-text">All Under One Roof.</span>
          </h3>
          <p className="text-muted-foreground text-xs sm:text-sm mb-6 sm:mb-8">51,000 sq ft. Month-to-month. No commitment.</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { icon: Dumbbell, text: "100+ Machines & Free Weights", color: "38 90% 58%" },
              { icon: Zap, text: "Cold Plunges & Infrared Saunas", color: "195 90% 55%" },
              { icon: Star, text: "Hot Yoga & Red Light Therapy", color: "340 80% 62%" },
              { icon: Target, text: "Basketball Court & 5K Turf", color: "155 85% 55%" },
              { icon: Clock, text: "Month-to-Month, No Commitment", color: "265 80% 65%" },
              { icon: MapPin, text: "335 Chestnut St, Norwood NJ", color: "18 90% 58%" },
            ].map((perk, i) => (
              <motion.div
                key={perk.text}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
                className="flex flex-col items-center gap-2.5 py-5 sm:py-6 px-3 rounded-lg text-center group transition-all duration-500"
                style={{
                  background: `linear-gradient(145deg, hsl(225 20% 7% / 0.95) 0%, hsl(225 20% 5% / 0.8) 100%)`,
                  border: `1px solid hsl(${perk.color} / 0.12)`,
                }}
              >
                <perk.icon size={20} style={{ color: `hsl(${perk.color} / 0.6)`, filter: `drop-shadow(0 0 4px hsl(${perk.color} / 0.3))` }} className="group-hover:scale-110 transition-transform duration-300" />
                <span className="text-muted-foreground text-[10px] sm:text-xs font-display font-medium tracking-wide leading-tight group-hover:text-foreground/70 transition-colors duration-300">
                  {perk.text}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ShopSection;
