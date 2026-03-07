import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Copy, Check, Building2, Dumbbell, ShoppingBag, Instagram, Users, ArrowUpRight } from "lucide-react";
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
  { title: "2THIRTY", desc: "5-in-1 hydration+ mixer — zero sugar, zero calories. Hydration, energy, focus, recovery & immunity.", url: "https://drink2thirty.com", icon: Building2, category: "business" },
  { title: "Impact Zone Fitness", desc: "Bergen County's premier 51,000 sq ft gym — 335 Chestnut St, Norwood NJ.", url: "https://impactzonenj.com", icon: Dumbbell, category: "business" },
  { title: "2THIRTY on Amazon", desc: "Shop 2THIRTY on Amazon — Strawberry Lemonade, Limeade, Red Raspberry. Prime eligible.", url: "https://www.amazon.com/2THIRTY-Hydration-Precovery-Electrolyte-Raspberry/dp/B0DCW71LH8", icon: ShoppingBag, category: "shop" },
  { title: "Amazon Storefront", desc: "Everything I use — supplements, gear, tech, car mods. Curated picks.", url: "#", icon: ShoppingBag, category: "shop" },
  { title: "Instagram", desc: "@devinpolicastro — the daily grind, unfiltered.", url: "https://instagram.com/devinpolicastro", icon: Instagram, category: "social" },
  { title: "TikTok", desc: "Short-form content. Real talk, real results.", url: "https://tiktok.com/@devinpolicastro", icon: Instagram, category: "social" },
  { title: "YouTube", desc: "Long-form builds, vlogs, and business breakdowns.", url: "https://youtube.com/@devinpolicastro", icon: Instagram, category: "social" },
  { title: "Impact Zone Instagram", desc: "Follow the gym — @impactzonenj. Member highlights, events, classes.", url: "https://instagram.com/impactzonenj", icon: Instagram, category: "social" },
  { title: "Book a Gym Tour", desc: "Schedule a tour of Impact Zone with Devin directly.", url: "https://calendar.app.google/2MSzLtJVX7GZ93Zs9", icon: Dumbbell, category: "fitness" },
  { title: "Join Impact Zone", desc: "No contracts. No commitment. Just results. $139/mo.", url: "https://onlinejoin.abcfitness.com/signup/plan?club=30591", icon: Dumbbell, category: "fitness" },
  { title: "2THIRTY Subscribe & Save", desc: "Subscribe and save 20% on every 2THIRTY order. Never run out.", url: "https://drink2thirty.com/subscribe", icon: Building2, category: "shop" },
  { title: "Partner Brands", desc: "Companies I work with and believe in.", url: "#", icon: Users, category: "collabs" },
];

const categories: { key: LinkCategory; label: string }[] = [
  { key: "all", label: "All" },
  { key: "business", label: "My Businesses" },
  { key: "fitness", label: "Fitness" },
  { key: "shop", label: "Shop" },
  { key: "social", label: "Social" },
  { key: "collabs", label: "Collabs" },
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
          className="mb-14"
        >
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="h-px bg-primary mb-8"
          />
          <p className="text-primary font-display text-xs tracking-[0.4em] uppercase mb-4">[ 03 — Link Hub ]</p>
          <h2 className="font-display font-bold text-4xl sm:text-6xl mb-4">
            Everything.
            <br />
            <span className="text-muted-foreground">One Tap.</span>
          </h2>
        </motion.div>

        {/* Category pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap gap-2 mb-10"
        >
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`relative px-5 py-2.5 rounded-full text-sm font-display font-medium tracking-wide transition-all duration-300 overflow-hidden ${
                activeCategory === cat.key
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* Links */}
        <div className="grid gap-3 max-w-3xl">
          <AnimatePresence mode="popLayout">
            {filtered.map((link, i) => (
              <motion.div
                key={link.title}
                layout
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <div className="glass-card group relative overflow-hidden border border-border/20 hover:border-primary/30 transition-all duration-500">
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-primary/5 to-transparent" />

                  <div className="relative z-10 p-5 flex items-center gap-5">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                      <link.icon size={22} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-semibold text-base group-hover:text-primary transition-colors">{link.title}</h3>
                      <p className="text-muted-foreground text-sm truncate">{link.desc}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); copyLink(link.url, link.title); }}
                        className="p-2.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                      >
                        {copied === link.title ? <Check size={16} className="text-primary" /> : <Copy size={16} />}
                      </button>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                      >
                        <ArrowUpRight size={16} />
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
