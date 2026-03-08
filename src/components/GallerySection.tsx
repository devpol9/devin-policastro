import { motion } from "framer-motion";

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

const GallerySection = () => {
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

      <div className="flex gap-3 sm:gap-4 px-5 sm:px-8 pb-16 sm:pb-20 pt-6 sm:pt-10 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
        {images.map((img, i) => (
          <div
            key={i}
            className="relative min-w-[260px] sm:min-w-[420px] lg:min-w-[520px] aspect-[4/3] rounded-xl overflow-hidden shrink-0 snap-center group"
          >
            <img src={img.src} alt={img.alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4">
              <span className="font-display font-bold text-xs sm:text-sm tracking-[0.15em] uppercase text-foreground/90">{img.label}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default GallerySection;
