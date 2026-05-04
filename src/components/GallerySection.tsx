import { useState } from "react";
import { motion } from "framer-motion";
import { Dumbbell, Zap, Star, Target, Clock, MapPin, ArrowRight } from "lucide-react";
import ServiceInquiryDialog from "@/components/services/ServiceInquiryDialog";

const images = [
  { src: "/images/iz-hero.jpg", alt: "Impact Zone Gym Floor", label: "The Floor" },
  { src: "/images/iz-machines.jpg", alt: "Impact Zone Machines", label: "100+ Machines" },
  { src: "/images/iz-cold-plunge.jpg", alt: "Cold Plunge", label: "Cold Plunge" },
  { src: "/images/iz-sauna.jpg", alt: "Infrared Sauna", label: "Infrared Sauna" },
  { src: "/images/iz-turf.jpg", alt: "5K Sports Turf", label: "5K Turf" },
  { src: "/images/iz-yoga.jpg", alt: "Hot Yoga", label: "Hot Yoga" },
  { src: "/images/iz-basketball.jpg", alt: "Basketball Court", label: "Basketball" },
  { src: "/images/iz-redlight.jpg", alt: "Red Light Therapy", label: "Red Light" },
  { src: "/images/iz-mezzanine.jpg", alt: "Mezzanine", label: "Mezzanine" },
  { src: "/images/iz-training.jpg", alt: "Training", label: "Training" },
];

const perks = [
  { icon: Dumbbell, text: "100+ Machines & Free Weights", color: "24 32% 52%" },
  { icon: Zap, text: "Cold Plunges & Infrared Saunas", color: "200 22% 50%" },
  { icon: Star, text: "Hot Yoga & Red Light Therapy", color: "350 22% 55%" },
  { icon: Target, text: "Basketball Court & 5K Turf", color: "140 18% 45%" },
  { icon: Clock, text: "Month-to-Month, No Commitment", color: "270 16% 50%" },
  { icon: MapPin, text: "335 Chestnut St, Norwood NJ", color: "18 38% 50%" },
];

const GallerySection = () => {
  const [trainingInquiryOpen, setTrainingInquiryOpen] = useState(false);

  return (
    <section className="relative overflow-hidden">
      <div className="px-5 sm:px-8 pt-16 sm:pt-20 pb-6 sm:pb-8">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: 60 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="h-px bg-primary/60 mb-10"
        />
        <p className="text-primary/80 font-display text-[10px] tracking-[0.5em] uppercase mb-5">[ 02 — The Gym ]</p>
        <h2 className="font-display font-extrabold text-3xl sm:text-6xl lg:text-7xl leading-[0.88] tracking-[-0.02em]">
          51,000 Sq Ft.
          <br />
          <span className="text-muted-foreground">No Excuses.</span>
        </h2>
      </div>

      <p className="px-5 sm:px-8 text-[10px] sm:text-xs text-muted-foreground/70 font-display tracking-[0.2em] uppercase">Scroll sideways to explore the gym</p>

      <div className="touch-carousel flex gap-3 sm:gap-4 lg:gap-5 px-5 sm:px-8 pb-10 sm:pb-14 pt-6 sm:pt-10 overflow-x-auto overflow-y-hidden snap-x snap-mandatory" style={{ WebkitOverflowScrolling: 'touch' }}>
        {images.map((img, i) => (
          <div
            key={i}
            className="relative w-[82vw] sm:w-[68vw] lg:w-[44vw] xl:w-[36vw] max-w-[620px] aspect-[4/3] rounded-xl overflow-hidden shrink-0 snap-start group"
          >
            <img src={img.src} alt={img.alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 flex items-end justify-between">
              <span className="font-display font-bold text-xs sm:text-sm tracking-[0.15em] uppercase text-foreground/90">{img.label}</span>
              {img.label === "Training" && (
                <button
                  onClick={() => setTrainingInquiryOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-display font-semibold tracking-wider uppercase transition-all duration-300 hover:scale-[1.03]"
                  style={{
                    background: `hsl(0 75% 55% / 0.85)`,
                    color: `hsl(0 0% 100%)`,
                    backdropFilter: 'blur(8px)',
                    border: `1px solid hsl(0 75% 55% / 0.5)`,
                  }}
                >
                  Inquire
                  <ArrowRight size={11} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Gym Tour Video */}
      <div className="px-5 sm:px-8 pb-10 sm:pb-14">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="font-display font-bold text-sm sm:text-base mb-3 sm:mb-4 tracking-wide" style={{ color: `hsl(24 32% 52% / 0.8)` }}>
              🎬 Take the Tour
            </h3>
            <div className="relative w-full rounded-xl overflow-hidden" style={{ paddingBottom: '56.25%', border: '1px solid hsl(24 32% 52% / 0.15)' }}>
              <iframe
                src="https://player.vimeo.com/video/1171638387?badge=0&autopause=0&player_id=0&app_id=58479"
                className="absolute inset-0 w-full h-full"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                title="Dev Gym Tour"
                loading="lazy"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Impact Zone Facility Perks */}
      <div className="px-5 sm:px-8 pb-16 sm:pb-20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="font-display font-extrabold text-xl sm:text-3xl mb-2 tracking-[-0.02em]">
              Impact Zone. <span className="gradient-text">All Under One Roof.</span>
            </h3>
            <p className="text-muted-foreground text-xs sm:text-sm mb-6 sm:mb-8">51,000 sq ft. Month-to-month. No commitment.</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {perks.map((perk, i) => (
                <motion.div
                  key={perk.text}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.5 }}
                  className="flex flex-col items-center gap-2.5 py-5 sm:py-6 px-3 rounded-lg text-center group transition-all duration-500"
                  style={{
                    background: `linear-gradient(145deg, hsl(225 20% 7% / 0.95) 0%, hsl(225 20% 5% / 0.8) 100%)`,
                    border: `1px solid hsl(${perk.color} / 0.4)`,
                    boxShadow: `0 0 12px hsl(${perk.color} / 0.1), inset 0 1px 0 hsl(${perk.color} / 0.15)`,
                  }}
                >
                  <perk.icon size={20} style={{ color: `hsl(${perk.color})`, filter: `drop-shadow(0 0 8px hsl(${perk.color} / 0.5))` }} className="group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-[10px] sm:text-xs font-display font-medium tracking-wide leading-tight transition-colors duration-300" style={{ color: `hsl(${perk.color} / 0.85)` }}>
                    {perk.text}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      <ServiceInquiryDialog
        open={trainingInquiryOpen}
        onOpenChange={setTrainingInquiryOpen}
        title="Training Inquiry"
        subtitle="Tell us about your fitness goals and we'll match you with the right coach or program."
        color="0 75% 55%"
        emailSubject="Training Inquiry"
        fields={[
          { key: "goals", label: "What are your fitness goals?", placeholder: "Weight loss, muscle gain, athletic performance, rehab...", type: "textarea", rows: 3, required: true },
          { key: "experience", label: "Training experience", placeholder: "Beginner, intermediate, advanced, former athlete...", type: "input", required: true },
          { key: "schedule", label: "Preferred schedule", placeholder: "Mornings, evenings, weekends, 3x/week...", type: "input" },
          { key: "type", label: "What type of training?", placeholder: "1-on-1, small group, online coaching, program only...", type: "input" },
        ]}
      />
    </section>
  );
};

export default GallerySection;
