import { motion } from "framer-motion";
import SectionHeader from "@/components/SectionHeader";
import img1 from "@/assets/devin/devin-1.jpg.asset.json";
import img2 from "@/assets/devin/devin-2.jpg.asset.json";
import img3 from "@/assets/devin/devin-3.jpg.asset.json";
import img4 from "@/assets/devin/devin-4.jpg.asset.json";
import img5 from "@/assets/devin/devin-5.jpg.asset.json";

const shots = [
  { src: img5.url, alt: "Devin training — dumbbell curls" },
  { src: img2.url, alt: "Devin training — hammer curls" },
  { src: img3.url, alt: "Devin walking through Impact Zone" },
  { src: img4.url, alt: "Devin training — cable pulldown" },
  { src: img1.url, alt: "Devin in 2THIRTY tee on the gym floor" },
];

const InTheGymSection = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="px-5 sm:px-8 pt-12 sm:pt-20 pb-6 sm:pb-8 max-w-6xl mx-auto w-full">
        <SectionHeader
          numeral="03"
          eyebrow="In the gym"
          title={<>Do the work. <span className="accent-headline">Every day.</span></>}
          description="Not just a brand — the floor is home. Training out of Impact Zone, Norwood NJ."
        />
      </div>

      {/* Mobile: asymmetric scattered stack */}
      <div className="md:hidden px-5 pb-12">
        <div className="grid grid-cols-6 gap-2.5">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.55 }}
            className="col-span-4 aspect-[3/4] rounded-2xl overflow-hidden bg-card border border-foreground/5"
          >
            <img src={shots[0].src} alt={shots[0].alt} className="w-full h-full object-cover" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.55, delay: 0.05 }}
            className="col-span-2 aspect-[3/4] rounded-2xl overflow-hidden bg-card border border-foreground/5 mt-8"
          >
            <img src={shots[1].src} alt={shots[1].alt} className="w-full h-full object-cover" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.55, delay: 0.1 }}
            className="col-span-3 aspect-square rounded-2xl overflow-hidden bg-card border border-foreground/5 -mt-4"
          >
            <img src={shots[2].src} alt={shots[2].alt} className="w-full h-full object-cover" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.55, delay: 0.15 }}
            className="col-span-3 aspect-square rounded-2xl overflow-hidden bg-card border border-foreground/5 mt-6"
          >
            <img src={shots[3].src} alt={shots[3].alt} className="w-full h-full object-cover" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.55, delay: 0.2 }}
            className="col-span-6 aspect-[16/10] rounded-2xl overflow-hidden bg-card border border-foreground/5"
          >
            <img src={shots[4].src} alt={shots[4].alt} className="w-full h-full object-cover" />
          </motion.div>
        </div>
      </div>

      {/* Desktop: scattered asymmetric collage, no labels */}
      <div className="hidden md:block max-w-6xl mx-auto px-5 sm:px-8 pb-16">
        <div className="grid grid-cols-12 grid-rows-6 gap-4 auto-rows-fr min-h-[640px]">
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6 }}
            className="col-span-5 row-span-6 rounded-3xl overflow-hidden bg-card border border-foreground/5 group"
          >
            <img src={shots[0].src} alt={shots[0].alt} className="w-full h-full object-cover md:group-hover:scale-[1.03] transition-transform duration-700" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.55, delay: 0.05 }}
            className="col-span-4 row-span-3 rounded-2xl overflow-hidden bg-card border border-foreground/5 group mt-6"
          >
            <img src={shots[1].src} alt={shots[1].alt} loading="lazy" className="w-full h-full object-cover md:group-hover:scale-[1.05] transition-transform duration-700" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.55, delay: 0.1 }}
            className="col-span-3 row-span-4 rounded-2xl overflow-hidden bg-card border border-foreground/5 group"
          >
            <img src={shots[2].src} alt={shots[2].alt} loading="lazy" className="w-full h-full object-cover md:group-hover:scale-[1.05] transition-transform duration-700" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.55, delay: 0.15 }}
            className="col-span-4 row-span-3 rounded-2xl overflow-hidden bg-card border border-foreground/5 group"
          >
            <img src={shots[3].src} alt={shots[3].alt} loading="lazy" className="w-full h-full object-cover md:group-hover:scale-[1.05] transition-transform duration-700" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.55, delay: 0.2 }}
            className="col-span-3 row-span-2 rounded-2xl overflow-hidden bg-card border border-foreground/5 group mt-4"
          >
            <img src={shots[4].src} alt={shots[4].alt} loading="lazy" className="w-full h-full object-cover md:group-hover:scale-[1.05] transition-transform duration-700" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default InTheGymSection;
