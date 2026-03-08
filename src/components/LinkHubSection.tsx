import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Copy, Check, Building2, Dumbbell, ShoppingBag, Instagram, Users, ArrowUpRight, Video, Linkedin, Music } from "lucide-react";
import { toast } from "sonner";

type LinkCategory = "all" | "business" | "fitness" | "shop" | "social" | "collabs";

interface LinkItem {
  title: string;
  desc: string;
  url: string;
  icon: React.ElementType;
  category: LinkCategory;
}

const links: LinkItem[] = [
  { title: "2THIRTY", desc: "5-in-1 hydration+ mixer — zero sugar, zero calories.", url: "https://drink2thirty.com", icon: Building2, category: "business" },
  { title: "Impact Zone Fitness", desc: "Bergen County's premier 51,000 sq ft gym — Norwood NJ.", url: "https://impactzonenj.com", icon: Dumbbell, category: "business" },
  { title: "2THIRTY on Amazon", desc: "Shop on Amazon — Strawberry Lemonade, Limeade, Red Raspberry.", url: "https://www.amazon.com/2THIRTY-Hydration-Precovery-Electrolyte-Raspberry/dp/B0DCW71LH8", icon: ShoppingBag, category: "shop" },
  { title: "2THIRTY Shop", desc: "35% off + free shipping on all orders.", url: "https://drink2thirty.com/shop", icon: ShoppingBag, category: "shop" },
  { title: "2THIRTY Subscribe & Save", desc: "Save 20% on every order. $10.38/pack delivered.", url: "https://drink2thirty.com/subscribe", icon: Building2, category: "shop" },
  { title: "Instagram — @devinpolicastro", desc: "The daily grind, unfiltered.", url: "https://instagram.com/devinpolicastro", icon: Instagram, category: "social" },
  { title: "TikTok — @devinpolicastro", desc: "Short-form content. Real talk, real results.", url: "https://tiktok.com/@devinpolicastro", icon: Video, category: "social" },
  { title: "YouTube — @devinpolicastro", desc: "Long-form builds, vlogs, and business breakdowns.", url: "https://youtube.com/@devinpolicastro", icon: Video, category: "social" },
  { title: "LinkedIn", desc: "Connect for business opportunities.", url: "https://linkedin.com/in/devin-policastro-10a196153/?skipRedirect=true", icon: Linkedin, category: "social" },
  { title: "Instagram — @impactzonenj", desc: "Member highlights, events, classes, community.", url: "https://instagram.com/impactzonenj", icon: Instagram, category: "social" },
  { title: "Instagram — @drink2thirty", desc: "Product drops, reviews, and hydration tips.", url: "https://instagram.com/drink2thirty", icon: Instagram, category: "social" },
  { title: "Popl Digital Card", desc: "Save my contact info and connect instantly.", url: "https://poplme.co/fFOVmkEx", icon: Users, category: "social" },
  { title: "Book a Gym Tour", desc: "Schedule a tour — 335 Chestnut St, Norwood NJ.", url: "https://calendar.app.google/2MSzLtJVX7GZ93Zs9", icon: Dumbbell, category: "fitness" },
  { title: "Join Impact Zone", desc: "No contracts. $139/mo. Welcome bag included.", url: "https://onlinejoin.abcfitness.com/signup/plan?club=30591", icon: Dumbbell, category: "fitness" },
];

const categories: { key: LinkCategory; label: string }[] = [
  { key: "all", label: "All" },
  { key: "business", label: "Businesses" },
  { key: "fitness", label: "Fitness" },
  { key: "shop", label: "Shop" },
  { key: "social", label: "Social" },
];

const LinkHubSection = () => {
  const [activeCategory, setActiveCategory] = useState<LinkCategory>("all");
  const [copied, setCopied] = useState<string | null>(null);

  const filtered = activeCategory === "all" ? links : links.filter((l) => l.category === activeCategory);

  const copyLink = (url: string, title: string) => {
    navigator.clipboard.writeText(url);
    setCopied(title);
    toast.success(`Link copied: ${title}`);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <section id="links" className="section-padding relative">
      <div className="container-tight">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 60 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="h-px bg-primary/60 mb-10"
          />
          <p className="text-primary/80 font-display text-[10px] tracking-[0.5em] uppercase mb-5">[ 03 — Link Hub ]</p>
          <h2 className="font-display font-extrabold text-4xl sm:text-6xl mb-4 tracking-[-0.02em]">
            Everything.
            <br />
            <span className="text-muted-foreground">One Tap.</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap gap-2 mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`relative px-5 py-2 rounded-full text-xs font-display font-semibold tracking-[0.1em] uppercase transition-all duration-500 ${
                activeCategory === cat.key
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "bg-card/60 text-muted-foreground hover:text-foreground hover:bg-card border border-border/20"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </motion.div>

        <div className="grid gap-2.5 max-w-3xl overflow-hidden">
          <AnimatePresence mode="popLayout">
            {filtered.map((link, i) => (
              <motion.div
                key={link.title}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4, delay: i * 0.03 }}
              >
                <div className="glass-card group relative overflow-hidden hover:border-primary/20 transition-all duration-700">
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-primary/3 to-transparent" />

                  <div className="relative z-10 p-4 sm:p-5 flex items-center gap-3 sm:gap-4">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary/8 flex items-center justify-center shrink-0 group-hover:bg-primary/15 group-hover:scale-105 transition-all duration-500">
                      <link.icon size={16} className="text-primary/70 group-hover:text-primary transition-colors duration-500" />
                    </div>
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <h3 className="font-display font-semibold text-sm group-hover:text-primary transition-colors duration-300 truncate">{link.title}</h3>
                      <p className="text-muted-foreground text-xs truncate">{link.desc}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); copyLink(link.url, link.title); }}
                        className="p-2 rounded-lg hover:bg-card transition-colors text-muted-foreground hover:text-foreground"
                      >
                        {copied === link.title ? <Check size={13} className="text-primary" /> : <Copy size={13} />}
                      </button>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-primary/8 text-primary/70 hover:bg-primary hover:text-primary-foreground transition-all duration-500"
                      >
                        <ArrowUpRight size={13} />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default LinkHubSection;