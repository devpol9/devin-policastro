import { motion } from "framer-motion";
import { Dumbbell, Droplets, Sparkles, Briefcase, Car, Video } from "lucide-react";

const verticals = [
  { icon: Dumbbell, title: "Fitness", desc: "Impact Zone NJ — 51,000 sq ft of Bergen County's biggest gym.", link: "#" },
  { icon: Droplets, title: "Hydration", desc: "2THIRTY — Functional hydration mixers. Clean, effective, no BS.", link: "https://drink2thirty.com" },
  { icon: Sparkles, title: "Lifestyle", desc: "Living loud. Cars, travel, culture, and the hustle behind it all.", link: "#" },
  { icon: Briefcase, title: "Business", desc: "Building brands, closing deals, and connecting the dots others can't see.", link: "#" },
  { icon: Car, title: "Automotive", desc: "Builds, mods, and the car culture that fuels me.", link: "#" },
  { icon: Video, title: "Content", desc: "Documenting the grind across IG, TikTok, and YouTube.", link: "#" },
];

const AboutSection = () => (
  <section id="about" className="section-padding">
    <div className="container-tight">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <p className="text-primary font-display text-sm tracking-[0.25em] uppercase mb-3">My World</p>
        <h2 className="font-display font-bold text-3xl sm:text-5xl mb-6">
          I Don't Pick One Lane.
          <br />
          <span className="text-muted-foreground">I Build the Highway.</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Entrepreneur from Jersey. Multiple businesses, multiple verticals, one mission: 
          build things that matter and connect people who move the needle.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {verticals.map((v, i) => (
          <motion.a
            key={v.title}
            href={v.link}
            target={v.link.startsWith("http") ? "_blank" : undefined}
            rel={v.link.startsWith("http") ? "noopener noreferrer" : undefined}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="glass-card-hover p-5 sm:p-6 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
              <v.icon size={20} className="text-primary" />
            </div>
            <h3 className="font-display font-semibold text-base sm:text-lg mb-1">{v.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>
          </motion.a>
        ))}
      </div>
    </div>
  </section>
);

export default AboutSection;
