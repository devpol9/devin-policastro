import { motion } from "framer-motion";
import SEOHead from "@/components/SEOHead";
import { seoPages } from "@/lib/seoData";
import { ArrowLeft, Instagram, ArrowRight, Youtube, Video, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import FloatingNav from "@/components/FloatingNav";
import MobileBottomNav from "@/components/MobileBottomNav";
import Footer from "@/components/Footer";
import ServiceInquiryDialog from "@/components/services/ServiceInquiryDialog";
import SectionHeader from "@/components/SectionHeader";
import ServiceDeep from "@/components/services/ServiceDeep";
import RelatedServices from "@/components/services/RelatedServices";
import { getFAQSchema, getServiceSchema } from "@/lib/serviceContent";
import { useState } from "react";

const COLOR = "24 38% 56%";

const INSTAGRAM_USERNAME = "devinpolicastro";

const platforms = [
  {
    name: "Instagram",
    handle: "@devinpolicastro",
    url: "https://instagram.com/devinpolicastro",
    icon: Instagram,
    desc: "The daily grind — gym, business, builds, and real talk. No filter.",
    color: "24 38% 56%",
  },
  {
    name: "TikTok",
    handle: "@devinpolicastro",
    url: "https://tiktok.com/@devinpolicastro",
    icon: Video,
    desc: "Short-form content. Business tips, fitness clips, and behind the scenes.",
    color: "24 38% 56%",
  },
  {
    name: "YouTube",
    handle: "@devinpolicastro",
    url: "https://youtube.com/@devinpolicastro",
    icon: Youtube,
    desc: "Long-form builds, vlogs, business breakdowns, and full gym tours.",
    color: "24 38% 56%",
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
      <SEOHead {...seoPages["/content"]} canonicalPath="/content" jsonLd={[getServiceSchema("content"), getFAQSchema("content")]} />
      <FloatingNav />

      <section className="section-padding pt-32 sm:pt-40">
        <div className="container-tight">
          <Link
            to="/#services"
            className="inline-flex items-center gap-2 text-muted-foreground md:hover:text-foreground transition-colors text-sm font-display mb-8"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>

          <SectionHeader
            as="h1"
            numeral="03"
            eyebrow="Content"
            accentColor={COLOR}
            title={<>Real content. <span className="italic font-light" style={{ color: `hsl(${COLOR})` }}>No filter.</span></>}
            description="Documenting the grind on Instagram, TikTok, and YouTube. Business, fitness, car culture, and everything I'm building — unfiltered."
          />
          <div className="mb-10 sm:mb-16">
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={`https://instagram.com/${INSTAGRAM_USERNAME}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-display font-semibold transition-all duration-300"
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
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-display font-semibold transition-all duration-300"
                style={{
                  background: `hsl(${COLOR})`,
                  color: `hsl(36 30% 98%)`,
                }}
              >
                Collab Inquiry
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

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
                  className="group relative overflow-hidden rounded-lg transition-all duration-500 block bg-card"
                  style={{
                    border: `1px solid hsl(${platform.color} / 0.25)`,
                  }}
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-[2px]"
                    style={{ background: `linear-gradient(90deg, transparent, hsl(${platform.color}), transparent)` }}
                  />
                  <div className="relative z-10 p-5 sm:p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
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
                    <div className="flex items-center gap-1.5 text-[10px] font-display font-semibold tracking-[0.06em]" style={{ color: `hsl(${platform.color})` }}>
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
                  className="p-4 rounded-lg transition-all duration-300 bg-card"
                  style={{
                    border: `1px solid hsl(${COLOR} / 0.2)`,
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

          <ServiceDeep slug="content" />
          <RelatedServices current="content" />
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
