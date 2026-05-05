import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Building2, Dumbbell, Instagram, ArrowUpRight, Video, Linkedin, Calendar, Sparkles, DollarSign, Users, type LucideIcon } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";

type LinkCategory = "socials" | "2thirty" | "impact-zone";

interface LinkItem {
  title: string;
  desc: string;
  url: string;
  icon: LucideIcon;
  category: LinkCategory;
  color: string;
}

const links: LinkItem[] = [
  // Socials
  { title: "@devinpolicastro", desc: "Instagram — the daily grind, unfiltered.", url: "https://instagram.com/devinpolicastro", icon: Instagram, category: "socials", color: "350 22% 55%" },
  { title: "@impactzonenj", desc: "Instagram — 51,000 sq ft of world-class fitness.", url: "https://instagram.com/impactzonenj", icon: Instagram, category: "socials", color: "24 32% 52%" },
  { title: "@drink2thirty", desc: "Instagram — product drops, reviews, and hydration.", url: "https://instagram.com/drink2thirty", icon: Instagram, category: "socials", color: "200 22% 50%" },
  { title: "TikTok", desc: "Short-form content. Real talk, real results.", url: "https://tiktok.com/@devinpolicastro", icon: Video, category: "socials", color: "270 18% 55%" },
  { title: "YouTube", desc: "Long-form builds, vlogs, and business breakdowns.", url: "https://youtube.com/@devinpolicastro", icon: Video, category: "socials", color: "12 45% 48%" },
  { title: "LinkedIn", desc: "Entrepreneur, connector, fitness industry leader.", url: "https://linkedin.com/in/devin-policastro-10a196153/?skipRedirect=true", icon: Linkedin, category: "socials", color: "210 22% 50%" },

  // 2THIRTY
  { title: "What is 2THIRTY?", desc: "5-in-1 hydration+ mixer — zero sugar, zero calories.", url: "https://www.drink2thirty.com/how-it-works", icon: Building2, category: "2thirty", color: "200 22% 50%" },
  { title: "Shop 2THIRTY", desc: "35% off + free shipping. Try all three flavors.", url: "https://www.drink2thirty.com/shop", icon: ExternalLink, category: "2thirty", color: "200 22% 50%" },
  { title: "Subscribe & Save", desc: "Never run out. Auto-ship monthly at a discount.", url: "https://www.drink2thirty.com/subscribe", icon: Sparkles, category: "2thirty", color: "200 22% 50%" },

  // Impact Zone
  { title: "Book a Gym Tour", desc: "Schedule a walkthrough — 335 Chestnut St, Norwood NJ.", url: "https://calendar.app.google/2MSzLtJVX7GZ93Zs9", icon: Calendar, category: "impact-zone", color: "140 18% 45%" },
  { title: "Training Consultation", desc: "Let's talk goals, programming, and getting you started.", url: "https://calendar.app.google/2MSzLtJVX7GZ93Zs9", icon: Sparkles, category: "impact-zone", color: "270 16% 50%" },
  { title: "Join Impact Zone", desc: "No contracts. Month-to-month. Welcome bag included.", url: "https://onlinejoin.abcfitness.com/signup/plan?club=30591", icon: Users, category: "impact-zone", color: "18 38% 50%" },
  { title: "Coach Pricing", desc: "View personal training and coaching rates.", url: "https://impactzonenj.com/personal-training", icon: DollarSign, category: "impact-zone", color: "24 32% 52%" },
];

const categories: { key: LinkCategory; label: string }[] = [
  { key: "socials", label: "Socials" },
  { key: "2thirty", label: "2THIRTY" },
  { key: "impact-zone", label: "Impact Zone" },
];

const LinkHubSection = () => {
  const [activeCategory, setActiveCategory] = useState<LinkCategory>("socials");
  const filtered = links.filter((l) => l.category === activeCategory);

  return (
    <section id="links" className="section-padding relative">
      <div className="container-tight">
        <SectionHeader
          numeral="03"
          eyebrow="Link Hub"
          title={<>Everything. <span className="italic font-light text-accent">One tap.</span></>}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap gap-1.5 sm:gap-2 mb-8 sm:mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`relative px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-display font-semibold tracking-[0.1em]  transition-all duration-500 ${
                activeCategory === cat.key
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "bg-card/60 text-muted-foreground hover:text-foreground hover:bg-card border border-border/20"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </motion.div>

        <div className="grid gap-2.5 sm:gap-3 max-w-3xl overflow-hidden">
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
                <div className="group relative overflow-hidden rounded-lg bg-card border border-border/60 transition-all duration-500 hover:border-accent/40 hover:shadow-[0_4px_20px_-8px_hsl(30_20%_30%/0.15)]">
                  <div className="relative z-10 p-3.5 sm:p-5 flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg flex items-center justify-center shrink-0 bg-secondary border border-border/60 transition-colors duration-500 group-hover:bg-accent/10 group-hover:border-accent/30">
                      <link.icon size={16} className="text-foreground/70 group-hover:text-accent transition-colors duration-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-semibold text-sm sm:text-base leading-tight tracking-[-0.01em] text-foreground mb-0.5">
                        {link.title}
                      </h3>
                      <p className="text-muted-foreground text-[10px] sm:text-xs leading-relaxed line-clamp-1">{link.desc}</p>
                    </div>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg shrink-0 text-foreground/40 hover:text-accent hover:bg-accent/5 transition-all duration-300"
                      aria-label={`Open ${link.title}`}
                    >
                      <ArrowUpRight size={14} />
                    </a>
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
