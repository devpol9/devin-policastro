import { Instagram, Youtube, Mail, MapPin } from "lucide-react";
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
  { label: "Impact Zone", href: "https://impactzonenj.com" },
  { label: "2THIRTY", href: "https://drink2thirty.com" },
  { label: "Creative Vision", href: null },
  { label: "Valence", href: null },
];

const Footer = () => (
  <footer className="relative border-t border-border mb-24 md:mb-0 overflow-hidden bg-background">
    <div className="max-w-6xl mx-auto px-5 sm:px-8 relative z-10">
      {/* Massive wordmark */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="pt-16 sm:pt-24 pb-10 sm:pb-14"
      >
        <div className="flex items-center gap-3 mb-6 sm:mb-10">
          <span className="h-px w-8 bg-accent" />
          <span className="text-foreground/60 text-[10px] sm:text-xs font-display font-medium tracking-[0.22em]">
            — End of feed
          </span>
        </div>
        <h2 className="font-display font-black leading-[0.82] tracking-[-0.05em] text-[clamp(3rem,12vw,9rem)] text-foreground">
          Devin
          <br />
          <span className="accent-headline">Policastro.</span>
        </h2>
      </motion.div>

      {/* Columns */}
      <div className="pb-12 sm:pb-16 grid grid-cols-2 sm:grid-cols-4 gap-8 border-t border-border pt-10 sm:pt-14">
        <div className="col-span-2 sm:col-span-1">
          <p className="text-foreground/40 text-[10px] font-display font-semibold tracking-[0.18em] mb-4">— Tagline</p>
          <p className="text-foreground/80 text-sm font-display leading-relaxed max-w-[260px]">
            Entrepreneur. Builder. Norwood, NJ.
          </p>
        </div>

        <div>
          <p className="text-foreground/40 text-[10px] font-display font-semibold tracking-[0.18em] mb-4">— Ventures</p>
          <ul className="space-y-2.5">
            {ventures.map((v) => (
              <li key={v.label}>
                {v.href ? (
                  <a
                    href={v.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground/70 hover:text-accent text-sm font-display transition-colors"
                  >
                    {v.label}
                  </a>
                ) : (
                  <span className="text-foreground/30 text-sm font-display">{v.label}</span>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-foreground/40 text-[10px] font-display font-semibold tracking-[0.18em] mb-4">— HQ</p>
          <div className="flex items-start gap-2 text-foreground/70 text-sm font-display leading-relaxed">
            <MapPin size={14} className="mt-1 shrink-0 text-accent" />
            <span>335 Chestnut St<br />Norwood, NJ 07648</span>
          </div>
        </div>

        <div>
          <p className="text-foreground/40 text-[10px] font-display font-semibold tracking-[0.18em] mb-4">— Follow</p>
          <div className="flex items-center gap-2 flex-wrap">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-foreground/60 hover:text-accent-foreground hover:bg-accent hover:border-accent transition-all duration-300"
              >
                <link.icon size={15} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border py-6 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-foreground/40 text-[11px] font-display tracking-wide">
          © {new Date().getFullYear()} Devin Policastro. All rights reserved.
        </p>
        <p className="text-foreground/40 text-[11px] font-display tracking-[0.18em]">
          Made in Norwood, NJ.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
