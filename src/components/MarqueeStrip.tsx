import Marquee from "@/components/effects/Marquee";

const words = [
  "Entrepreneur",
  "2THIRTY",
  "Impact Zone",
  "Manufacturing",
  "Valence",
  "Hydration",
  "Norwood NJ",
  "Builder",
];

const MarqueeStrip = () => (
  <section id="marquee" className="py-10 border-y border-border bg-secondary/40 overflow-hidden">
    <Marquee speed={25}>
      {words.map((word, i) => (
        <span
          key={i}
          className="font-display font-medium text-2xl sm:text-4xl tracking-[-0.01em] mx-8 sm:mx-12 text-foreground/70"
        >
          {word}
          <span className="mx-8 sm:mx-12 text-accent/60 text-base align-middle">●</span>
        </span>
      ))}
    </Marquee>
  </section>
);

export default MarqueeStrip;
