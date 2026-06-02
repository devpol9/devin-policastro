import { useState } from "react";
import { motion } from "framer-motion";
import { Dumbbell, Zap, Star, Target, Clock, MapPin, ArrowRight, ArrowUpRight, Play } from "lucide-react";
import ServiceInquiryDialog from "@/components/services/ServiceInquiryDialog";
import SectionHeader from "@/components/SectionHeader";

const images = [
  { src: "/images/iz-hero.jpg", alt: "Impact Zone Gym Floor", label: "The Floor" },
  { src: "/images/iz-machines.jpg", alt: "Impact Zone Machines", label: "100+ machines" },
  { src: "/images/iz-cold-plunge.jpg", alt: "Cold Plunge", label: "Cold plunge" },
  { src: "/images/iz-sauna.jpg", alt: "Infrared Sauna", label: "Infrared sauna" },
  { src: "/images/iz-turf.jpg", alt: "5K Sports Turf", label: "5K turf" },
  { src: "/images/iz-yoga.jpg", alt: "Hot Yoga", label: "Hot yoga" },
  { src: "/images/iz-basketball.jpg", alt: "Basketball Court", label: "Basketball" },
  { src: "/images/iz-redlight.jpg", alt: "Red Light Therapy", label: "Red light" },
  { src: "/images/iz-mezzanine.jpg", alt: "Mezzanine", label: "Mezzanine" },
  { src: "/images/iz-training.jpg", alt: "Training", label: "Training" },
];

const perks = [
  { icon: Dumbbell, text: "100+ machines & free weights" },
  { icon: Zap, text: "Cold plunges & infrared saunas" },
  { icon: Star, text: "Hot yoga & red light therapy" },
  { icon: Target, text: "Basketball court & 5K turf" },
  { icon: Clock, text: "Month-to-month, no commitment" },
  { icon: MapPin, text: "335 Chestnut St, Norwood NJ" },
];

const GallerySection = () => {
  const [trainingInquiryOpen, setTrainingInquiryOpen] = useState(false);

  // Featured + supporting grid
  const featured = images[0];
  const secondary = images[1];
  const rest = images.slice(2);

  return (
    <section className="relative overflow-hidden">
      <div className="px-5 sm:px-8 pt-16 sm:pt-24 pb-6 sm:pb-8 max-w-6xl mx-auto w-full">
        <SectionHeader
          numeral="02"
          eyebrow="The Gym"
          title={<>51,000 sq ft. <span className="accent-headline">No excuses.</span></>}
        />
      </div>

      {/* Asymmetric bento gallery */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pb-12 sm:pb-16">
        <div className="grid grid-cols-6 md:grid-cols-12 gap-2 sm:gap-4">
          {/* Featured */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="col-span-6 md:col-span-8 md:row-span-2 relative aspect-[5/4] md:aspect-auto md:min-h-[440px] rounded-2xl sm:rounded-3xl overflow-hidden bg-card border border-foreground/5 group"
          >
            <img src={featured.src} alt={featured.alt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            <div className="absolute top-5 left-5 right-5 flex items-start justify-between">
              <span className="text-[10px] sm:text-xs font-mono tracking-[0.22em] text-accent">
                01 / The Floor
              </span>
              <span className="text-[10px] sm:text-xs font-mono tracking-[0.22em] text-foreground/60 px-3 py-1.5 rounded-full bg-background/50 border border-foreground/10 backdrop-blur-sm">
                Norwood, NJ
              </span>
            </div>
            <div className="absolute bottom-5 sm:bottom-7 left-5 sm:left-7 right-5 sm:right-7">
              <h3 className="font-display font-semibold tracking-tight text-foreground text-2xl sm:text-5xl leading-[0.95] mb-2 sm:mb-3 max-w-md">
                The floor.
              </h3>
              <p className="text-muted-foreground text-sm sm:text-base max-w-md">
                Bergen County's largest training environment. Built for the people who actually show up.
              </p>
            </div>
          </motion.div>

          {/* Secondary tall */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="md:col-span-4 relative aspect-[4/5] md:aspect-auto md:min-h-[210px] rounded-2xl sm:rounded-3xl overflow-hidden bg-card border border-foreground/5 group"
          >
            <img src={secondary.src} alt={secondary.alt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <span className="text-[10px] font-mono tracking-[0.22em] text-accent/80 block mb-1">02</span>
              <p className="font-display font-semibold text-foreground text-lg sm:text-xl">{secondary.label}</p>
            </div>
          </motion.div>

          {/* Video tile */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="md:col-span-4 relative aspect-[4/5] md:aspect-auto md:min-h-[210px] rounded-2xl sm:rounded-3xl overflow-hidden bg-card border border-foreground/5 group"
          >
            <div className="absolute inset-0">
              <iframe
                src="https://player.vimeo.com/video/1171638387?badge=0&autopause=0&player_id=0&app_id=58479&background=1&muted=1&loop=1&autoplay=1"
                className="w-full h-full pointer-events-none"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                title="Dev Gym Tour"
                loading="lazy"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-background/20" />
            <a
              href="https://calendar.app.google/2MSzLtJVX7GZ93Zs9"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 flex flex-col justify-between p-4 sm:p-5"
            >
              <span className="text-[10px] font-mono tracking-[0.22em] text-accent self-start">03 / Tour</span>
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="font-display font-semibold text-foreground text-lg sm:text-xl mb-1">Take the tour</p>
                  <p className="text-foreground/60 text-[11px] sm:text-xs font-mono tracking-[0.14em]">Book a walkthrough</p>
                </div>
                <span className="w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Play size={14} fill="currentColor" />
                </span>
              </div>
            </a>
          </motion.div>

          {/* Supporting grid */}
          {rest.map((img, i) => (
            <motion.div
              key={img.src}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: 0.05 + i * 0.04, ease: [0.22, 1, 0.36, 1] }}
              className="md:col-span-3 relative aspect-square rounded-2xl overflow-hidden bg-card border border-foreground/5 group"
            >
              <img src={img.src} alt={img.alt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                <div>
                  <span className="text-[9px] font-mono tracking-[0.22em] text-accent/70 block mb-0.5">
                    {String(i + 4).padStart(2, "0")}
                  </span>
                  <p className="font-display font-semibold text-foreground text-xs sm:text-sm">{img.label}</p>
                </div>
                {img.label === "Training" && (
                  <button
                    onClick={() => setTrainingInquiryOpen(true)}
                    className="flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-mono tracking-[0.1em] bg-accent text-accent-foreground"
                  >
                    Inquire <ArrowRight size={9} />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Perks rail — tonal */}
      <div className="px-5 sm:px-8 pb-16 sm:pb-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-end justify-between mb-6 sm:mb-8 gap-6"
          >
            <h3 className="font-display font-semibold text-2xl sm:text-3xl tracking-tight leading-tight">
              Impact Zone. <span className="accent-headline">All under one roof.</span>
            </h3>
            <a
              href="https://impactzonenj.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 text-xs font-mono tracking-[0.18em] text-accent hover:gap-3 transition-all"
            >
              Visit impactzonenj.com <ArrowUpRight size={14} />
            </a>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px bg-foreground/10 rounded-2xl overflow-hidden border border-foreground/10">
            {perks.map((perk, i) => (
              <motion.div
                key={perk.text}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04, duration: 0.45 }}
                className="bg-card px-4 py-6 sm:py-8 flex flex-col gap-3 hover:bg-card/70 transition-colors"
              >
                <perk.icon size={18} className="text-accent" strokeWidth={1.5} />
                <span className="text-[11px] sm:text-xs font-display text-foreground/70 leading-snug">
                  {perk.text}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <ServiceInquiryDialog
        open={trainingInquiryOpen}
        onOpenChange={setTrainingInquiryOpen}
        title="Training Inquiry"
        subtitle="Tell us about your fitness goals and we'll match you with the right coach or program."
        color="24 38% 56%"
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
