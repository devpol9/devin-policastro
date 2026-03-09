import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Copy, Check, Building2, Dumbbell, Instagram, ArrowUpRight, Video, Linkedin, Calendar, Sparkles, DollarSign, Users } from "lucide-react";
import { toast } from "sonner";

type LinkCategory = "websites" | "socials" | "impact-zone";

interface LinkItem {
  title: string;
  desc: string;
  url: string;
  icon: React.ElementType;
  category: LinkCategory;
  color: string;
}

const links: LinkItem[] = [
  // Websites
  { title: "2THIRTY", desc: "5-in-1 hydration+ mixer — zero sugar, zero calories. 35% off + free shipping.", url: "https://drink2thirty.com", icon: Building2, category: "websites", color: "195 90% 55%" },
  { title: "Impact Zone Fitness", desc: "Bergen County's premier 51,000 sq ft gym — Norwood NJ.", url: "https://impactzonenj.com", icon: Dumbbell, category: "websites", color: "38 90% 58%" },

  // Socials (combined personal + brand accounts)
  { title: "@devinpolicastro", desc: "Instagram — the daily grind, unfiltered.", url: "https://instagram.com/devinpolicastro", icon: Instagram, category: "socials", color: "340 80% 62%" },
  { title: "@impactzonenj", desc: "Instagram — 51,000 sq ft of world-class fitness.", url: "https://instagram.com/impactzonenj", icon: Instagram, category: "socials", color: "38 90% 58%" },
  { title: "@drink2thirty", desc: "Instagram — product drops, reviews, and hydration.", url: "https://instagram.com/drink2thirty", icon: Instagram, category: "socials", color: "195 90% 55%" },
  { title: "TikTok", desc: "Short-form content. Real talk, real results.", url: "https://tiktok.com/@devinpolicastro", icon: Video, category: "socials", color: "280 100% 70%" },
  { title: "YouTube", desc: "Long-form builds, vlogs, and business breakdowns.", url: "https://youtube.com/@devinpolicastro", icon: Video, category: "socials", color: "0 85% 60%" },
  { title: "LinkedIn", desc: "Entrepreneur, connector, fitness industry leader.", url: "https://linkedin.com/in/devin-policastro-10a196153/?skipRedirect=true", icon: Linkedin, category: "socials", color: "210 90% 58%" },

  // Impact Zone
  { title: "Book a Gym Tour", desc: "Schedule a walkthrough — 335 Chestnut St, Norwood NJ.", url: "https://calendar.app.google/2MSzLtJVX7GZ93Zs9", icon: Calendar, category: "impact-zone", color: "155 85% 55%" },
  { title: "Training Consultation", desc: "Let's talk goals, programming, and getting you started.", url: "https://calendar.app.google/2MSzLtJVX7GZ93Zs9", icon: Sparkles, category: "impact-zone", color: "265 85% 65%" },
  { title: "Join Impact Zone", desc: "No contracts. Month-to-month. Welcome bag included.", url: "https://onlinejoin.abcfitness.com/signup/plan?club=30591", icon: Users, category: "impact-zone", color: "18 90% 58%" },
  { title: "Coach Pricing", desc: "View personal training and coaching rates.", url: "https://impactzonenj.com/personal-training", icon: DollarSign, category: "impact-zone", color: "38 90% 58%" },
];

const categories: { key: LinkCategory; label: string }[] = [
  { key: "websites", label: "Websites" },
  { key: "socials", label: "Socials" },
  { key: "impact-zone", label: "Impact Zone" },
];

const LinkHubSection = () => {
  const [activeCategory, setActiveCategory] = useState<LinkCategory>("websites");
  const [copied, setCopied] = useState<string | null>(null);

  const filtered = links.filter((l) => l.category === activeCategory);

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
          className="mb-10 sm:mb-16"
        >
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 60 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="h-px bg-primary/60 mb-8 sm:mb-10"
          />
          <p className="text-primary/80 font-display text-[10px] tracking-[0.5em] uppercase mb-4 sm:mb-5">[ 03 — Link Hub ]</p>
          <h2 className="font-display font-extrabold text-3xl sm:text-6xl mb-4 tracking-[-0.02em]">
            Everything.
            <br />
            <span className="text-muted-foreground">One Tap.</span>
          </h2>
        </motion.div>

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
              className={`relative px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-display font-semibold tracking-[0.1em] uppercase transition-all duration-500 ${
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
                <div
                  className="group relative overflow-hidden rounded-lg transition-all duration-700"
                  style={{
                    background: `linear-gradient(145deg, hsl(225 20% 7% / 0.95) 0%, hsl(225 20% 5% / 0.8) 100%)`,
                    border: `1px solid hsl(${link.color} / 0.15)`,
                    boxShadow: `0 4px 24px hsl(225 30% 2% / 0.6), inset 0 1px 0 hsl(${link.color} / 0.06)`,
                  }}
                >
                  <div
                    className="absolute left-0 top-0 bottom-0 w-[2px] opacity-50 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `linear-gradient(180deg, transparent, hsl(${link.color}), transparent)` }}
                  />
                  <div
                    className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.1] transition-opacity duration-700"
                    style={{ background: `radial-gradient(ellipse at 0% 50%, hsl(${link.color}) 0%, transparent 60%)` }}
                  />
                  <div
                    className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ boxShadow: `inset 0 0 0 1px hsl(${link.color} / 0.3), 0 0 20px hsl(${link.color} / 0.08)` }}
                  />

                  <div className="relative z-10 p-3.5 sm:p-5 flex items-center gap-3 sm:gap-4">
                    <div
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-all duration-500"
                      style={{
                        background: `linear-gradient(135deg, hsl(${link.color} / 0.18) 0%, hsl(${link.color} / 0.06) 100%)`,
                        border: `1px solid hsl(${link.color} / 0.25)`,
                        boxShadow: `0 0 16px hsl(${link.color} / 0.12)`,
                      }}
                    >
                      <link.icon
                        size={16}
                        className="sm:w-[18px] sm:h-[18px]"
                        style={{ color: `hsl(${link.color})`, filter: `drop-shadow(0 0 4px hsl(${link.color} / 0.5))` }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3
                        className="font-display font-bold text-xs sm:text-sm transition-colors duration-300 leading-tight mb-0.5"
                        style={{ color: `hsl(${link.color} / 0.9)` }}
                      >
                        {link.title}
                      </h3>
                      <p className="text-muted-foreground text-[10px] sm:text-xs leading-relaxed">{link.desc}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); copyLink(link.url, link.title); }}
                        className="p-1.5 sm:p-2 rounded-lg transition-all duration-300"
                        style={{ color: `hsl(${link.color} / 0.4)` }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = `hsl(${link.color})`; e.currentTarget.style.background = `hsl(${link.color} / 0.1)`; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = `hsl(${link.color} / 0.4)`; e.currentTarget.style.background = `transparent`; }}
                      >
                        {copied === link.title ? <Check size={13} /> : <Copy size={13} />}
                      </button>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 sm:p-2 rounded-lg transition-all duration-500"
                        style={{
                          background: `hsl(${link.color} / 0.1)`,
                          color: `hsl(${link.color} / 0.7)`,
                          border: `1px solid hsl(${link.color} / 0.15)`,
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = `hsl(${link.color})`; e.currentTarget.style.color = `hsl(225 25% 3%)`; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = `hsl(${link.color} / 0.1)`; e.currentTarget.style.color = `hsl(${link.color} / 0.7)`; }}
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
