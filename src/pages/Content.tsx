import { motion } from "framer-motion";
import SEOHead from "@/components/SEOHead";
import { seoPages } from "@/lib/seoData";
import { ArrowLeft, Instagram, ArrowRight, Youtube, Video, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import FloatingNav from "@/components/FloatingNav";
import MobileBottomNav from "@/components/MobileBottomNav";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/effects/CustomCursor";
import MouseSpotlight from "@/components/effects/MouseSpotlight";
import ServiceInquiryDialog from "@/components/services/ServiceInquiryDialog";
import { useState } from "react";

const COLOR = "340 80% 62%";

const INSTAGRAM_USERNAME = "devinpolicastro";

const platforms = [
  {
    name: "Instagram",
    handle: "@devinpolicastro",
    url: "https://instagram.com/devinpolicastro",
    icon: Instagram,
    desc: "The daily grind — gym, business, builds, and real talk. No filter.",
    color: "340 80% 62%",
  },
  {
    name: "TikTok",
    handle: "@devinpolicastro",
    url: "https://tiktok.com/@devinpolicastro",
    icon: Video,
    desc: "Short-form content. Business tips, fitness clips, and behind the scenes.",
    color: "280 100% 70%",
  },
  {
    name: "YouTube",
    handle: "@devinpolicastro",
    url: "https://youtube.com/@devinpolicastro",
    icon: Youtube,
    desc: "Long-form builds, vlogs, business breakdowns, and full gym tours.",
    color: "0 85% 60%",
  },
];

const contentTypes = [
  { label: "Product Reviews", desc: "Authentic reviews of supplements, gear, and gym equipment." },
  { label: "Business Breakdowns", desc: "How I built 2THIRTY, Impact Zone, and everything in between." },
  { label: "Day in the Life", desc: "Real footage of running multiple businesses and training." },
  { label: "Gym Content", desc: "Workouts, facility tours, and the Impact Zone community." },
  { label: "Car Builds", desc: "Custom builds, mods, and the automotive culture I'm into." },
  { label: "Collabs & Features", desc: "Working with brands and creators who align with the vision." },
];

const Content = () => {
  const [inquiryOpen, setInquiryOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden noise-overlay">
      <SEOHead {...seoPages["/content"]} canonicalPath="/content" />
      <CustomCursor />
      <MouseSpotlight />
      <FloatingNav />

      <section className="section-padding pt-32 sm:pt-40">
        <div className="container-tight">
          <Link
            to="/#services"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-display mb-8"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 sm:mb-16"
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 60 }}
              transition={{ duration: 1 }}
              className="h-px mb-8 sm:mb-10"
              style={{ background: `hsl(${COLOR} / 0.6)` }}
            />
            <p className="font-display text-[10px] tracking-[0.5em] uppercase mb-4 sm:mb-5" style={{ color: `hsl(${COLOR})` }}>
              [ Content ]
            </p>
            <h1 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl leading-[0.88] mb-6 sm:mb-8 tracking-[-0.02em]">
              Real Content.
              <br />
              <span className="text-muted-foreground">No Filter.</span>
            </h1>
            <p className="text-muted-foreground max-w-xl text-sm sm:text-base leading-[1.8] mb-6">
              Documenting the grind on Instagram, TikTok, and YouTube.
              Business, fitness, car culture, and everything I'm building — unfiltered.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={`https://instagram.com/${INSTAGRAM_USERNAME}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-display font-semibold transition-all duration-300 hover:scale-[1.02]"
                style={{
                  background: `hsl(${COLOR} / 0.15)`,
                  border: `1px solid hsl(${COLOR} / 0.3)`,
                  color: `hsl(${COLOR})`,
                }}
              >
                <Instagram size={16} />
                @{INSTAGRAM_USERNAME}
              </a>
              <button
                onClick={() => setInquiryOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-display font-semibold transition-all duration-300 hover:scale-[1.02]"
                style={{
                  background: `hsl(${COLOR})`,
                  color: `hsl(225 25% 3%)`,
                }}
              >
                Collab Inquiry
                <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>

          {/* Platforms */}
          <div className="grid sm:grid-cols-3 gap-3 sm:gap-4 mb-12 sm:mb-16">
            {platforms.map((platform, i) => {
              const Icon = platform.icon;
              return (
                <motion.a
                  key={platform.name}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                  className="group relative overflow-hidden rounded-lg transition-all duration-500 block"
                  style={{
                    background: `linear-gradient(145deg, hsl(225 20% 7% / 0.95) 0%, hsl(225 20% 5% / 0.8) 100%)`,
                    border: `1px solid hsl(${platform.color} / 0.15)`,
                  }}
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-[2px] opacity-50 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `linear-gradient(90deg, transparent, hsl(${platform.color}), transparent)` }}
                  />
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-[0.1] transition-opacity duration-700"
                    style={{ background: `radial-gradient(ellipse at 50% 0%, hsl(${platform.color}) 0%, transparent 70%)` }}
                  />
                  <div className="relative z-10 p-5 sm:p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-500"
                        style={{
                          background: `hsl(${platform.color} / 0.15)`,
                          border: `1px solid hsl(${platform.color} / 0.25)`,
                        }}
                      >
                        <Icon size={18} style={{ color: `hsl(${platform.color})` }} />
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-sm" style={{ color: `hsl(${platform.color})` }}>
                          {platform.name}
                        </h3>
                        <p className="text-muted-foreground/60 text-[10px] font-display">{platform.handle}</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-xs leading-relaxed mb-3">{platform.desc}</p>
                    <div className="flex items-center gap-1.5 text-[10px] font-display font-semibold tracking-wider uppercase opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-500" style={{ color: `hsl(${platform.color})` }}>
                      <span>Follow</span>
                      <ExternalLink size={10} />
                    </div>
                  </div>
                </motion.a>
              );
            })}
          </div>

          {/* Content Types */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <h2 className="font-display font-extrabold text-xl sm:text-3xl mb-6 tracking-[-0.02em]">
              What I Post.
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {contentTypes.map((type, i) => (
                <motion.div
                  key={type.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.05 }}
                  className="p-4 rounded-lg transition-all duration-300"
                  style={{
                    background: `linear-gradient(145deg, hsl(225 20% 7% / 0.95) 0%, hsl(225 20% 5% / 0.8) 100%)`,
                    border: `1px solid hsl(${COLOR} / 0.1)`,
                  }}
                >
                  <h3 className="font-display font-bold text-xs sm:text-sm mb-1" style={{ color: `hsl(${COLOR} / 0.9)` }}>
                    {type.label}
                  </h3>
                  <p className="text-muted-foreground/60 text-[10px] sm:text-xs leading-relaxed">{type.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="text-center">
            <a
              href={`https://instagram.com/${INSTAGRAM_USERNAME}/reels/`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-display font-semibold transition-colors"
              style={{ color: `hsl(${COLOR})` }}
            >
              View All Reels on Instagram
              <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </section>

      <Footer />
      <MobileBottomNav />

      <ServiceInquiryDialog
        open={inquiryOpen}
        onOpenChange={setInquiryOpen}
        title="Content Collab Inquiry"
        subtitle="Let's create content that converts. Tell me about your brand and what you're looking for."
        color={COLOR}
        emailSubject="Content / Collab Inquiry"
        fields={[
          { key: "brand", label: "Your brand / company", placeholder: "Brand name and what you do", type: "input", required: true },
          { key: "platform", label: "Platform & audience size", placeholder: "Instagram 50K, TikTok 100K...", type: "input", required: true },
          { key: "collab-type", label: "What kind of content?", placeholder: "Product review, sponsored reel, UGC, event coverage...", type: "textarea", rows: 2 },
          { key: "budget", label: "Budget range", placeholder: "$250-$500, $500-$1K, $1K+...", type: "input" },
          { key: "links", label: "Links to your brand / content", placeholder: "Instagram, website, TikTok...", type: "input" },
        ]}
      />
    </div>
  );
};

export default Content;
