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
  <section id="marquee" className="py-12 sm:py-16 border-y border-border bg-secondary/40 overflow-hidden">
    <Marquee speed={28}>
      {words.map((w, i) => (
        <span key={i} className="inline-flex items-center">
          <span
            className={`font-display ${w.italic ? "accent-headline" : "font-bold text-foreground"} text-3xl sm:text-5xl lg:text-6xl tracking-[-0.025em] mx-6 sm:mx-10`}
          >
            {w.text}
          </span>
          <span className="mx-4 sm:mx-6 text-accent/50 text-xs">✦</span>
        </span>
      ))}
    </Marquee>
  </section>
);

export default MarqueeStrip;
