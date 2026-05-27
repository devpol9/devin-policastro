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
          title="Everything. One tap."
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap gap-2 sm:gap-3 mb-8 sm:mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`relative px-5 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs font-mono transition-all duration-500 ${
                activeCategory === cat.key
                  ? "bg-foreground text-background"
                  : "bg-card border border-foreground/10 text-muted-foreground hover:text-foreground hover:border-accent/60"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 max-w-5xl">
          <AnimatePresence mode="popLayout">
            {filtered.map((link, i) => {
              const mod = i % 5;
              const span =
                mod === 0 ? "md:col-span-12"
                : mod === 1 ? "md:col-span-7"
                : mod === 2 ? "md:col-span-5"
                : "md:col-span-6";
              const isFeatured = mod === 0;
              const isTall = mod === 1 || mod === 2;
              const indexLabel = String(i + 1).padStart(2, "0");

              return (
                <motion.a
                  key={link.title}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    import("@/lib/analytics").then(({ trackEvent }) =>
                      trackEvent("link_clicked", { label: link.title, url: link.url, source: "link_hub" })
                    );
                  }}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.45, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                  aria-label={`Open ${link.title}`}
                  className={`group relative ${span} bg-card border border-foreground/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 transition-all duration-500 hover:border-accent/40 hover:bg-card/80 ${
                    isFeatured
                      ? "flex items-center justify-between gap-6"
                      : isTall
                      ? "flex flex-col justify-between min-h-[200px] sm:min-h-[220px]"
                      : "flex flex-col gap-5 sm:gap-6"
                  }`}
                >
                  {isFeatured ? (
                    <>
                      <div className="flex items-center gap-5 sm:gap-6 min-w-0">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-2xl bg-background border border-foreground/5 flex items-center justify-center text-accent group-hover:scale-105 transition-transform duration-500">
                          <link.icon size={28} strokeWidth={1.5} />
                        </div>
                        <div className="min-w-0">
                          <span className="block text-[10px] sm:text-xs text-muted-foreground mb-1 font-mono">
                            {indexLabel} / Featured
                          </span>
                          <h3 className="font-display text-xl sm:text-2xl font-semibold text-foreground tracking-tight truncate">
                            {link.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{link.desc}</p>
                        </div>
                      </div>
                      <ArrowUpRight
                        size={24}
                        className="shrink-0 text-muted-foreground group-hover:text-accent transition-colors"
                      />
                    </>
                  ) : isTall ? (
                    <>
                      <div className="flex justify-between items-start">
                        <div className="w-12 h-12 rounded-xl bg-background border border-foreground/5 flex items-center justify-center text-muted-foreground group-hover:text-accent transition-colors">
                          <link.icon size={22} strokeWidth={1.5} />
                        </div>
                        <ArrowUpRight
                          size={18}
                          className="text-muted-foreground group-hover:text-accent group-hover:translate-x-1 group-hover:-translate-y-1 transition-all"
                        />
                      </div>
                      <div className="mt-6">
                        <span className="block text-[10px] sm:text-xs text-muted-foreground mb-1 font-mono">
                          {indexLabel}
                        </span>
                        <h3 className="font-display text-lg sm:text-xl font-semibold text-foreground tracking-tight">
                          {link.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">{link.desc}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="w-10 h-10 rounded-lg bg-background border border-foreground/5 flex items-center justify-center text-muted-foreground group-hover:text-accent transition-colors shrink-0">
                            <link.icon size={18} strokeWidth={1.5} />
                          </div>
                          <h3 className="font-display text-base sm:text-lg font-medium text-foreground tracking-tight truncate">
                            {link.title}
                          </h3>
                        </div>
                        <ArrowUpRight
                          size={16}
                          className="shrink-0 text-muted-foreground group-hover:text-accent transition-colors"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">{link.desc}</p>
                    </>
                  )}
                </motion.a>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default LinkHubSection;
