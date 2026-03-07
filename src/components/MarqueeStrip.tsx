import Marquee from "@/components/effects/Marquee";

const words = [
  "ENTREPRENEUR",
  "2THIRTY",
  "IMPACT ZONE",
  "IMPACTFUL BRANDS",
  "SBS",
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
  <section id="marquee" className="py-6 border-y border-border/20 overflow-hidden">
    <Marquee speed={25}>
      {words.map((word, i) => (
        <span key={i} className="font-display font-bold text-2xl sm:text-4xl tracking-tight mx-6 sm:mx-10">
          <span className="text-foreground/10">{word}</span>
          <span className="text-primary mx-6 sm:mx-10 text-lg">✦</span>
        </span>
      ))}
    </Marquee>
  </section>
);

export default MarqueeStrip;
