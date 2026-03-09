import Marquee from "@/components/effects/Marquee";

const words = [
  "ENTREPRENEUR",
  "2THIRTY",
  "IMPACT ZONE",
  "MANUFACTURING",
  "VALENCE",
  "FITNESS",
  "HYDRATION",
  "PRE-COVERY",
  "NORWOOD NJ",
  "BERGEN COUNTY",
  "ZERO SUGAR",
  "5-IN-1 MIXER",
  "51K SQ FT",
  "NO CONTRACTS",
  "RELENTLESS",
];

const MarqueeStrip = () => (
  <section id="marquee" className="py-8 border-y border-border/10 overflow-hidden">
    <Marquee speed={20}>
      {words.map((word, i) => (
        <span key={i} className="font-display font-extrabold text-xl sm:text-3xl tracking-[-0.02em] mx-6 sm:mx-10">
          <span className="text-foreground/[0.06]">{word}</span>
          <span className="text-primary/30 mx-6 sm:mx-10 text-xs">◆</span>
        </span>
      ))}
    </Marquee>
  </section>
);

export default MarqueeStrip;