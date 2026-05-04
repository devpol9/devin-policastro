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
  <footer className="relative border-t border-border/10 mb-24 md:mb-0 overflow-hidden">
    {/* Ambient glow */}
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center_bottom,hsl(var(--primary)/0.04)_0%,transparent_60%)] pointer-events-none" />

    <div className="max-w-6xl mx-auto px-5 sm:px-8 relative z-10">
      {/* Main footer content */}
      <div className="py-10 sm:py-16 grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12">
        {/* Brand column */}
        <div className="sm:col-span-1">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display font-extrabold text-xl tracking-tight mb-3"
          >
            <span className="text-foreground/90">DEVIN</span>
            <span className="text-primary ml-1.5">P.</span>
          </motion.p>
          <p className="text-muted-foreground/60 text-xs leading-relaxed max-w-[220px] mb-5">
            Entrepreneur. Builder. Norwood, NJ.
          </p>
          <div className="flex items-center gap-1.5">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="w-9 h-9 rounded-lg bg-card/60 border border-border/15 flex items-center justify-center text-muted-foreground/50 hover:text-primary hover:border-primary/30 hover:bg-primary/8 transition-all duration-300"
              >
                <link.icon size={14} />
              </a>
            ))}
          </div>
        </div>

        {/* Ventures column */}
        <div>
          <p className="text-[9px] font-display font-bold tracking-[0.4em]  text-muted-foreground/40 mb-4">Ventures</p>
          <ul className="space-y-2">
            {ventures.map((v) => (
              <li key={v.label}>
                {v.href ? (
                  <a
                    href={v.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground/60 hover:text-primary text-xs font-display font-medium tracking-wide transition-colors duration-300"
                  >
                    {v.label}
                  </a>
                ) : (
                  <span className="text-muted-foreground/30 text-xs font-display font-medium tracking-wide">
                    {v.label}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Location column */}
        <div>
          <p className="text-[9px] font-display font-bold tracking-[0.4em]  text-muted-foreground/40 mb-4">HQ</p>
          <div className="flex items-start gap-2 text-muted-foreground/50 text-xs leading-relaxed">
            <MapPin size={13} className="mt-0.5 shrink-0 text-primary/40" />
            <span>335 Chestnut St<br />Norwood, NJ 07648</span>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border/8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-muted-foreground/30 text-[10px] font-display tracking-wide">
          © {new Date().getFullYear()} Devin Policastro. All rights reserved.
        </p>
        <p className="text-muted-foreground/20 text-[10px] font-display tracking-wide">
          Norwood, NJ.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
