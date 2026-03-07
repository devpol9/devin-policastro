import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Copy, Check, Building2, Dumbbell, ShoppingBag, Instagram, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  { title: "2THIRTY", desc: "Functional hydration mixers — clean energy, real ingredients.", url: "https://drink2thirty.com", icon: Building2, category: "business" },
  { title: "Impact Zone NJ", desc: "Bergen County's biggest gym. 51,000 sq ft of serious training.", url: "#", icon: Dumbbell, category: "business" },
  { title: "Amazon Storefront", desc: "Everything I use — supplements, gear, tech, car mods.", url: "#", icon: ShoppingBag, category: "shop" },
  { title: "Instagram", desc: "@devonpolycastro — the daily grind, unfiltered.", url: "https://instagram.com", icon: Instagram, category: "social" },
  { title: "TikTok", desc: "Short-form content. Real talk, real results.", url: "https://tiktok.com", icon: Instagram, category: "social" },
  { title: "YouTube", desc: "Long-form builds, vlogs, and business breakdowns.", url: "https://youtube.com", icon: Instagram, category: "social" },
  { title: "My Supplement Stack", desc: "The exact supplements I take daily — no fluff.", url: "#", icon: Dumbbell, category: "fitness" },
  { title: "Workout Program", desc: "Train like I do. Programs that actually work.", url: "#", icon: Dumbbell, category: "fitness" },
  { title: "Partner Brands", desc: "Companies I work with and believe in.", url: "#", icon: Users, category: "collabs" },
];

const categories: { key: LinkCategory; label: string }[] = [
  { key: "all", label: "All" },
  { key: "business", label: "My Businesses" },
  { key: "fitness", label: "Fitness & Wellness" },
  { key: "shop", label: "Shop My Stuff" },
  { key: "social", label: "Social Media" },
  { key: "collabs", label: "Collabs & Partners" },
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
    <section id="links" className="section-padding">
      <div className="container-tight">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p className="text-primary font-display text-sm tracking-[0.25em] uppercase mb-3">Link Hub</p>
          <h2 className="font-display font-bold text-3xl sm:text-5xl mb-4">
            Everything. <span className="text-muted-foreground">One Tap.</span>
          </h2>
        </motion.div>

        {/* Category filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === cat.key
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Links grid */}
        <div className="grid gap-3 max-w-2xl mx-auto">
          <AnimatePresence mode="popLayout">
            {filtered.map((link) => (
              <motion.div
                key={link.title}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="glass-card-hover p-4 flex items-center gap-4"
              >
                <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <link.icon size={20} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-semibold text-sm sm:text-base">{link.title}</h3>
                  <p className="text-muted-foreground text-xs sm:text-sm truncate">{link.desc}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => copyLink(link.url, link.title)}
                    className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                  >
                    {copied === link.title ? <Check size={16} className="text-primary" /> : <Copy size={16} />}
                  </button>
                  <Button variant="glow" size="sm" asChild>
                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink size={14} />
                      Open
                    </a>
                  </Button>
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
