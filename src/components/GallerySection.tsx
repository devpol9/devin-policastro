import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const GallerySection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" ? window.innerWidth < 768 : false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

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

  useEffect(() => {
    if (isMobile || !containerRef.current || !scrollRef.current) return;

    const scrollWidth = scrollRef.current.scrollWidth - containerRef.current.clientWidth;

    const tween = gsap.to(scrollRef.current, {
      x: -scrollWidth,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 20%",
        end: () => `+=${scrollWidth}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
      },
    });

    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [isMobile]);

  return (
    <section className="relative overflow-hidden" ref={containerRef}>
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

      {/* Desktop: GSAP horizontal scroll */}
      {!isMobile && (
        <div ref={scrollRef} className="flex gap-4 px-5 sm:px-8 pb-20 pt-10 will-change-transform">
          {images.map((img, i) => (
            <div
              key={i}
              className="relative min-w-[400px] lg:min-w-[500px] aspect-[4/3] rounded-xl overflow-hidden group shrink-0"
            >
              <img src={img.src} alt={img.alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4">
                <span className="font-display font-bold text-sm tracking-[0.15em] uppercase text-foreground/90">{img.label}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mobile: scrollable row */}
      {isMobile && (
        <div className="flex gap-3 px-5 pb-16 pt-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
          {images.map((img, i) => (
            <div
              key={i}
              className="relative min-w-[260px] aspect-[4/3] rounded-xl overflow-hidden group shrink-0 snap-center"
            >
              <img src={img.src} alt={img.alt} className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3">
                <span className="font-display font-bold text-xs tracking-[0.15em] uppercase text-foreground/90">{img.label}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default GallerySection;