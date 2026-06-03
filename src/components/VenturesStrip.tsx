import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

interface Venture {
  name: string;
  blurb: string;
  to?: string;
  href?: string;
  status?: string;
}

const ventures: Venture[] = [
  {
    name: "Impact Zone",
    blurb: "51,000 sq ft training facility — Norwood, NJ.",
    to: "/impact-zone",
  },
  {
    name: "2THIRTY",
    blurb: "Custom stick packs. 7,000+ sold.",
    href: "https://2thirtynutrition.com",
  },
  {
    name: "Creative Vision",
    blurb: "Manufacturing — concept to shelf.",
    to: "/manufacturing",
  },
  {
    name: "Valence",
    blurb: "Gym operating system. Coming soon.",
    status: "Soon",
  },
];

const VenturesStrip = () => {
  return (
    <section id="ventures" className="section-padding relative border-t border-foreground/5">
      <div className="container-tight">
        <div className="flex items-end justify-between mb-8 sm:mb-10">
          <div>
            <span className="font-mono text-[10px] text-accent tracking-tighter block mb-2">
              [ 06 / What I'm building ]
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-black tracking-tight leading-[0.9]">
              The ventures.
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {ventures.map((v, i) => {
            const Inner = (
              <div className="group h-full p-4 sm:p-6 rounded-2xl bg-card border border-foreground/5 md:hover:border-accent/30 md:hover:bg-card/80 transition-all duration-500 flex flex-col gap-3 sm:gap-6 min-h-[110px] sm:min-h-[160px]">
                <div className="flex items-start justify-between">
                  <span className="font-mono text-[10px] text-foreground/40 tabular-nums">
                    0{i + 1}
                  </span>
                  {v.status ? (
                    <span className="font-mono text-[10px] text-accent border border-accent/30 px-2 py-0.5 rounded-full">
                      {v.status}
                    </span>
                  ) : (
                    <ArrowUpRight
                      size={16}
                      className="text-foreground/40 group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                    />
                  )}
                </div>
                <div className="mt-auto">
                  <p className="font-display font-bold text-lg sm:text-xl text-foreground tracking-tight">
                    {v.name}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
                    {v.blurb}
                  </p>
                </div>
              </div>
            );

            const motionWrap = (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                {Inner}
              </motion.div>
            );

            if (v.to) {
              return (
                <Link key={v.name} to={v.to} className="block">
                  {motionWrap}
                </Link>
              );
            }
            if (v.href) {
              return (
                <a
                  key={v.name}
                  href={v.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  {motionWrap}
                </a>
              );
            }
            return <div key={v.name}>{motionWrap}</div>;
          })}
        </div>
      </div>
    </section>
  );
};

export default VenturesStrip;
