import { motion } from "framer-motion";
import { ArrowUpRight, Copy, Check, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import SectionHeader from "@/components/SectionHeader";
import { trackEvent } from "@/lib/analytics";

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
  featured?: boolean;
}

const products: Product[] = [
  {
    name: "Strawberry Lemonade",
    note: "The OG flavor — 5-in-1 hydration+ mixer. Zero sugar, zero calories. 3x hydration vs sports drinks.",
    category: "2THIRTY",
    code: "DEV",
    price: "$11.67",
    originalPrice: "$12.97",
    rating: "4.9",
    reviews: "847",
    link: "https://drink2thirty.com/product/drink-mixer-pre-covery?flavor=strawberry-lemonade&quantity=6-pack",
    image: "/images/2thirty-strawberry.png",
    featured: true,
  },
  {
    name: "Limeade",
    note: "Clean, crisp daytime focus. NAC + L-Glutathione for liver support.",
    category: "2THIRTY",
    code: "DEV",
    price: "$11.67",
    originalPrice: "$12.97",
    rating: "4.9",
    reviews: "519",
    link: "https://drink2thirty.com/product/drink-mixer-pre-covery?flavor=limeade&quantity=6-pack",
    image: "/images/2thirty-limeade.png",
  },
  {
    name: "Red Raspberry",
    note: "Night mode flavor — pre-covery support with Milk Thistle and Ginseng Root.",
    category: "2THIRTY",
    code: "DEV",
    price: "$11.67",
    originalPrice: "$12.97",
    rating: "4.8",
    reviews: "632",
    link: "https://drink2thirty.com/product/drink-mixer-pre-covery?flavor=red-raspberry&quantity=6-pack",
    image: "/images/2thirty-raspberry.png",
  },
  {
    name: "Impact Zone Membership",
    note: "51,000 sq ft. No contracts. Cold plunges, infrared saunas, hot yoga, red light therapy. $139/mo.",
    category: "Fitness",
    link: "https://onlinejoin.abcfitness.com/signup/plan?club=30591",
    image: "/images/iz-machines-red.jpg",
    tourLink: "https://calendar.app.google/2MSzLtJVX7GZ93Zs9",
  },
  {
    name: "Fitrition",
    note: "Clean, macro-friendly meals delivered. Real food, real results.",
    category: "Nutrition",
    code: "DEVIN10",
    link: "https://fitritionmeals.com/collections/all",
    image: "/images/fitrition-plate.png",
  },
];

// Bento spans: featured row + 2 small + wide membership + nutrition
const spans = [
  "md:col-span-7", // featured strawberry
  "md:col-span-5", // limeade
  "md:col-span-5", // raspberry
  "md:col-span-7", // membership
  "md:col-span-12", // fitrition wide
];

const ShopSection = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Code copied: ${code}`);
    trackEvent("promo_code_copied", { code });
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <section id="shop" className="section-padding relative overflow-hidden">
      <div className="container-tight relative z-10">
        <SectionHeader
          numeral="04"
          eyebrow="Shop & Codes"
          title={<>Things I <span className="accent-headline">actually use</span></>}
          description="2THIRTY is my brand — 5-in-1 hydration+ mixer with zero sugar, zero calories. 4.9 stars. 7,000+ packs sold. Made in the USA."
        />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4">
          {products.map((product, i) => {
            const span = spans[i] ?? "md:col-span-6";
            const isFeatured = product.featured;
            const isWide = i === 4;

            return (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                className={span}
              >
                <div className={`group relative h-full overflow-hidden rounded-2xl sm:rounded-3xl bg-card border border-foreground/5 transition-all duration-500 hover:border-accent/40 ${isWide ? "flex flex-col md:flex-row" : ""}`}>
                  {/* Image */}
                  <div className={`relative overflow-hidden bg-background/40 ${
                    isFeatured ? "aspect-[16/10]" : isWide ? "md:w-1/2 aspect-[16/10] md:aspect-auto" : "aspect-[4/3]"
                  }`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className={`w-full h-full transition-transform duration-700 group-hover:scale-[1.04] ${
                        product.category === "Fitness" || product.category === "Nutrition" ? "object-cover" : "object-contain p-6"
                      }`}
                      loading="lazy"
                    />
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <span className="text-[10px] font-mono tracking-[0.22em] px-2.5 py-1 rounded-full bg-background/70 backdrop-blur-md text-foreground/80 border border-foreground/10">
                        {product.category}
                      </span>
                      {product.price && (
                        <span className="text-[10px] font-mono tracking-[0.18em] px-2 py-1 rounded-full bg-accent text-accent-foreground">
                          10% off
                        </span>
                      )}
                    </div>
                    {product.rating && (
                      <div className="absolute top-4 right-4 flex items-center gap-1 text-[10px] font-mono px-2 py-1 rounded-full bg-background/70 backdrop-blur-md text-foreground/80 border border-foreground/10">
                        <Star size={9} className="text-accent fill-accent" />
                        {product.rating} · {product.reviews}
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className={`flex flex-col flex-1 ${isFeatured ? "p-7 sm:p-9" : "p-5 sm:p-7"} ${isWide ? "md:w-1/2 md:p-9 justify-center" : ""}`}>
                    <span className="text-[10px] font-mono tracking-[0.22em] text-accent/70 mb-2">
                      {String(i + 1).padStart(2, "0")} / {product.category}
                    </span>
                    <h3 className={`font-display font-semibold tracking-tight text-foreground leading-tight mb-2 ${
                      isFeatured ? "text-2xl sm:text-3xl" : isWide ? "text-2xl sm:text-3xl" : "text-lg sm:text-xl"
                    }`}>
                      {product.name}
                    </h3>
                    <p className={`text-muted-foreground leading-relaxed ${isFeatured || isWide ? "text-sm sm:text-base mb-5" : "text-xs sm:text-sm mb-4"} ${!isFeatured && !isWide ? "line-clamp-2" : ""}`}>
                      {product.note}
                    </p>

                    {product.price && (
                      <div className="mb-4 flex items-baseline gap-2 flex-wrap">
                        <span className="font-display font-bold text-xl sm:text-2xl text-foreground">
                          {product.price}
                        </span>
                        <span className="text-muted-foreground text-xs line-through">{product.originalPrice}</span>
                        <span className="text-[10px] font-mono tracking-[0.18em] text-accent">with code</span>
                      </div>
                    )}

                    <div className="mt-auto flex items-center gap-2 flex-wrap">
                      {product.code && (
                        <button
                          onClick={() => copyCode(product.code!)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-full text-[11px] font-mono tracking-[0.1em] bg-background border border-foreground/10 text-foreground/80 hover:border-accent/40 hover:text-accent transition-all"
                        >
                          {copiedCode === product.code ? <Check size={12} className="text-accent" /> : <Copy size={12} />}
                          {copiedCode === product.code ? "Copied" : product.code}
                        </button>
                      )}
                      <a
                        href={product.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackEvent("shop_clicked", { product: product.name, url: product.link })}
                        className="ml-auto flex items-center gap-1.5 px-4 py-2 rounded-full text-[11px] font-display font-semibold tracking-wide bg-accent text-accent-foreground hover:gap-2.5 transition-all"
                      >
                        Shop
                        <ArrowUpRight size={12} />
                      </a>
                    </div>

                    {product.tourLink && (
                      <a
                        href={product.tourLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center justify-center gap-2 py-2 rounded-full text-[11px] font-mono tracking-[0.12em] border border-foreground/10 text-foreground/60 hover:border-accent/40 hover:text-accent transition-all"
                      >
                        Book a gym tour →
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ShopSection;
