import { motion } from "framer-motion";
import { ArrowLeft, Instagram, ArrowRight } from "lucide-react";
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

// Placeholder reel IDs — replace with actual reel URLs/IDs for live embeds
const reelIds = [
  "C_placeholder1",
  "C_placeholder2",
  "C_placeholder3",
  "C_placeholder4",
  "C_placeholder5",
  "C_placeholder6",
  "C_placeholder7",
  "C_placeholder8",
  "C_placeholder9",
];

const Content = () => {
  const [inquiryOpen, setInquiryOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden noise-overlay">
      <CustomCursor />
      <MouseSpotlight />
      <FloatingNav />

      <section className="section-padding pt-32 sm:pt-40">
        <div className="container-tight">
          <Link
            to="/"
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
              Latest
              <br />
              <span className="text-muted-foreground">Content.</span>
            </h1>
            <div className="flex flex-wrap items-center gap-4">
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

          {/* Instagram Reels Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-12">
            {reelIds.map((reelId, i) => (
              <motion.div
                key={reelId}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="aspect-[9/16] rounded-lg overflow-hidden relative group"
                style={{
                  background: `linear-gradient(145deg, hsl(225 20% 7% / 0.95) 0%, hsl(225 20% 5% / 0.8) 100%)`,
                  border: `1px solid hsl(${COLOR} / 0.15)`,
                }}
              >
                <iframe
                  src={`https://www.instagram.com/reel/${reelId}/embed/`}
                  className="w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                  title={`Instagram Reel ${i + 1}`}
                />
                {/* Fallback overlay for blocked embeds */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-card/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <Instagram size={32} className="mb-2" style={{ color: `hsl(${COLOR})` }} />
                  <p className="text-xs text-muted-foreground font-display">View on Instagram</p>
                </div>
              </motion.div>
            ))}
          </div>

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
