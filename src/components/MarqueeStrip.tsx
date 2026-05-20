import Marquee from "@/components/effects/Marquee";

const words = [
  { text: "Entrepreneur", italic: false },
  { text: "2THIRTY", italic: false },
  { text: "Impact Zone", italic: true },
  { text: "Manufacturing", italic: false },
  { text: "Valence", italic: true },
  { text: "Hydration", italic: false },
  { text: "Norwood NJ", italic: false },
  { text: "Builder", italic: true },
];

const MarqueeStrip = () => (
  <section id="marquee" className="py-10 sm:py-14 border-y border-border bg-secondary/30 overflow-hidden opacity-60">
    <Marquee speed={32}>
      {words.map((w, i) => (
        <span key={i} className="inline-flex items-center">
          <span
            className={`font-display ${w.italic ? "accent-headline" : "font-semibold text-foreground/70"} text-2xl sm:text-4xl lg:text-5xl tracking-[-0.02em] mx-6 sm:mx-10`}
          >
            {w.text}
          </span>
          <span className="mx-4 sm:mx-6 text-accent/30 text-xs">✦</span>
        </span>
      ))}
    </Marquee>
  </section>
);

export default MarqueeStrip;
