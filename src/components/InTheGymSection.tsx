import { motion } from "framer-motion";
import SectionHeader from "@/components/SectionHeader";
import img1 from "@/assets/devin/devin-1.jpg.asset.json";
import img2 from "@/assets/devin/devin-2.jpg.asset.json";
import img3 from "@/assets/devin/devin-3.jpg.asset.json";
import img4 from "@/assets/devin/devin-4.jpg.asset.json";
import img5 from "@/assets/devin/devin-5.jpg.asset.json";

const shots = [
  { src: img5.url, alt: "Devin training — dumbbell curls", label: "Reps", num: "01" },
  { src: img2.url, alt: "Devin training — hammer curls", label: "Pump", num: "02" },
  { src: img3.url, alt: "Devin walking through Impact Zone", label: "Walk-in", num: "03" },
  { src: img4.url, alt: "Devin training — cable pulldown", label: "Cable", num: "04" },
  { src: img1.url, alt: "Devin in 2THIRTY tee on the gym floor", label: "Floor", num: "05" },
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

      {/* Mobile: horizontal snap rail. Desktop: bento. */}
      <div className="md:hidden pl-5 pr-5 pb-12">
        <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory -mx-5 px-5 pb-2 scrollbar-none">
          {shots.map((s, i) => (
            <motion.div
              key={s.src}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.04 }}
              className="snap-start shrink-0 w-[78%] aspect-[4/5] rounded-2xl overflow-hidden bg-card border border-foreground/5 relative"
            >
              <img src={s.src} alt={s.alt} loading="lazy" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                <span className="font-display font-semibold text-foreground text-sm">{s.label}</span>
                <span className="text-[10px] font-mono tracking-[0.22em] text-accent">{s.num}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="hidden md:block max-w-6xl mx-auto px-5 sm:px-8 pb-16">
        <div className="grid grid-cols-12 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="col-span-7 row-span-2 relative aspect-[4/5] rounded-3xl overflow-hidden bg-card border border-foreground/5 group"
          >
            <img src={shots[0].src} alt={shots[0].alt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/15 to-transparent" />
            <div className="absolute top-5 left-5 right-5 flex items-start justify-between">
              <span className="text-[10px] font-mono tracking-[0.22em] text-accent">01 / Reps</span>
              <span className="text-[10px] font-mono tracking-[0.22em] text-foreground/60 px-3 py-1.5 rounded-full bg-background/50 border border-foreground/10 backdrop-blur-sm">
                Norwood, NJ
              </span>
            </div>
            <div className="absolute bottom-7 left-7 right-7">
              <h3 className="font-display font-semibold tracking-tight text-foreground text-4xl leading-[0.95] mb-2">
                On the floor.
              </h3>
              <p className="text-muted-foreground text-sm max-w-sm">
                Show up. Out-work the room. Repeat.
              </p>
            </div>
          </motion.div>

          {shots.slice(1).map((s, i) => (
            <motion.div
              key={s.src}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: 0.05 + i * 0.05 }}
              className="col-span-5 lg:col-span-5 relative aspect-[5/4] rounded-2xl overflow-hidden bg-card border border-foreground/5 group"
            >
              <img src={s.src} alt={s.alt} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                <span className="font-display font-semibold text-foreground text-sm">{s.label}</span>
                <span className="text-[10px] font-mono tracking-[0.22em] text-accent">{s.num}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InTheGymSection;
