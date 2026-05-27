import { Instagram, Youtube, Mail, MapPin, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

const socialLinks = [
  { href: "https://instagram.com/devinpolicastro", icon: Instagram, label: "Instagram" },
  { href: "https://tiktok.com/@devinpolicastro", icon: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-[14px] h-[14px]">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.71a8.2 8.2 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.14z"/>
    </svg>
  ), label: "TikTok" },
  { href: "https://youtube.com/@devinpolicastro", icon: Youtube, label: "YouTube" },
  { href: "mailto:devinpolicastro@gmail.com", icon: Mail, label: "Email" },
];

const ventures = [
  { label: "Impact Zone", href: "https://impactzonenj.com", meta: "Norwood NJ" },
  { label: "2THIRTY", href: "https://drink2thirty.com", meta: "Hydration+" },
  { label: "Creative Vision", href: null, meta: "Manufacturing" },
  { label: "Valence", href: null, meta: "Gym OS · soon" },
];

const Footer = () => (
  <footer className="relative border-t border-foreground/10 mb-24 md:mb-0 overflow-hidden bg-background">
    <div className="max-w-6xl mx-auto px-5 sm:px-8 relative z-10">
      {/* Header rail */}
      <div className="pt-16 sm:pt-20 pb-10 sm:pb-14 flex items-center justify-between text-[10px] sm:text-xs font-mono tracking-[0.22em]">
        <span className="text-accent">[ 07 / End of feed ]</span>
        <span className="text-foreground/40 hidden sm:inline">© {new Date().getFullYear()}</span>
      </div>

      {/* Asymmetric columns */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 pb-12">
        {/* Wordmark */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="md:col-span-7"
        >
          <h2 className="font-display font-bold leading-[0.82] tracking-[-0.05em] text-[clamp(3rem,11vw,8rem)] text-foreground">
            Devin
            <br />
            <span className="accent-headline">Policastro.</span>
          </h2>
          <p className="mt-6 sm:mt-8 text-foreground/60 text-sm sm:text-base font-display max-w-md leading-relaxed">
            Entrepreneur. Builder. Connector. From Norwood, NJ — building everywhere.
          </p>
        </motion.div>

        {/* Right rail */}
        <div className="md:col-span-5 grid grid-cols-2 gap-8 md:gap-6 md:pt-4">
          <div>
            <p className="text-[10px] font-mono tracking-[0.22em] text-accent/70 mb-5">— Ventures</p>
            <ul className="space-y-3.5">
              {ventures.map((v) => (
                <li key={v.label}>
                  {v.href ? (
                    <a
                      href={v.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-baseline justify-between gap-3 text-foreground/80 hover:text-accent transition-colors"
                    >
                      <span className="font-display text-sm sm:text-base">{v.label}</span>
                      <span className="text-[10px] font-mono tracking-[0.14em] text-foreground/30 group-hover:text-accent/60 transition-colors">
                        {v.meta}
                      </span>
                    </a>
                  ) : (
                    <div className="flex items-baseline justify-between gap-3 text-foreground/40">
                      <span className="font-display text-sm sm:text-base">{v.label}</span>
                      <span className="text-[10px] font-mono tracking-[0.14em] text-foreground/30">{v.meta}</span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[10px] font-mono tracking-[0.22em] text-accent/70 mb-5">— HQ</p>
            <div className="flex items-start gap-2 text-foreground/70 text-sm font-display leading-relaxed mb-6">
              <MapPin size={13} className="mt-1 shrink-0 text-accent" strokeWidth={1.5} />
              <span>335 Chestnut St<br />Norwood, NJ 07648</span>
            </div>
            <a
              href="mailto:devinpolicastro@gmail.com"
              className="inline-flex items-center gap-1.5 text-foreground/70 hover:text-accent text-sm font-display transition-colors"
            >
              devinpolicastro@gmail.com
              <ArrowUpRight size={12} />
            </a>
          </div>
        </div>
      </div>

      {/* Social + bottom bar */}
      <div className="border-t border-foreground/10 pt-8 pb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              className="w-10 h-10 rounded-full border border-foreground/10 flex items-center justify-center text-foreground/60 hover:text-accent-foreground hover:bg-accent hover:border-accent transition-all duration-300"
            >
              <link.icon size={15} />
            </a>
          ))}
        </div>

        <div className="flex items-center gap-6 text-[10px] sm:text-[11px] font-mono tracking-[0.18em] text-foreground/40">
          <span>© {new Date().getFullYear()} Devin Policastro</span>
          <span className="hidden sm:inline">·</span>
          <span>Made in Norwood, NJ</span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
