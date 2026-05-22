import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getServiceContent, type ServiceSlug } from "@/lib/serviceContent";

interface Props {
  slug: ServiceSlug;
}

const ServiceDeep = ({ slug }: Props) => {
  const c = getServiceContent(slug);
  const color = c.color;

  return (
    <section className="mt-4 mb-16 sm:mb-20">
      {/* Long-form intro */}
      <div className="max-w-3xl mb-12 sm:mb-16">
        <div className="flex items-center gap-2.5 mb-4">
          <span className="font-mono text-[10px] text-foreground/50 tracking-tight">[ Overview ]</span>
          <span className="h-px w-5" style={{ background: `hsl(${color})` }} />
        </div>
        <h2 className="font-display font-extrabold text-2xl sm:text-3xl mb-5 tracking-[-0.02em]">
          Why work with me on{" "}
          <span className="italic font-light" style={{ color: `hsl(${color})` }}>
            {c.shortName.toLowerCase()}
          </span>
          .
        </h2>
        <div className="space-y-4">
          {c.intro.map((p, i) => (
            <p key={i} className="text-muted-foreground text-sm sm:text-base leading-[1.75]">
              {p}
            </p>
          ))}
        </div>
      </div>

      {/* Case studies */}
      {c.caseStudies.length > 0 && (
        <div className="mb-12 sm:mb-16">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="font-mono text-[10px] text-foreground/50 tracking-tight">[ Proof ]</span>
            <span className="h-px w-5" style={{ background: `hsl(${color})` }} />
          </div>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl mb-6 tracking-[-0.02em]">
            Real work.
          </h2>
          <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
            {c.caseStudies.map((cs, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative overflow-hidden rounded-lg p-5 sm:p-6"
                style={{
                  background: `linear-gradient(145deg, hsl(36 30% 99% / 0.95) 0%, hsl(33 20% 95% / 0.8) 100%)`,
                  border: `1px solid hsl(${color} / 0.15)`,
                }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-[2px]"
                  style={{ background: `linear-gradient(90deg, transparent, hsl(${color}), transparent)` }}
                />
                {cs.meta && (
                  <p
                    className="text-[10px] font-display font-semibold tracking-[0.08em] mb-2 lowercase"
                    style={{ color: `hsl(${color})` }}
                  >
                    {cs.meta}
                  </p>
                )}
                <h3 className="font-display font-bold text-base sm:text-lg mb-2 tracking-[-0.01em]">
                  {cs.title}
                </h3>
                <p className="text-muted-foreground text-xs sm:text-sm leading-[1.65]">{cs.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* FAQ */}
      <div>
        <div className="flex items-center gap-2.5 mb-4">
          <span className="font-mono text-[10px] text-foreground/50 tracking-tight">[ FAQ ]</span>
          <span className="h-px w-5" style={{ background: `hsl(${color})` }} />
        </div>
        <h2 className="font-display font-extrabold text-2xl sm:text-3xl mb-6 tracking-[-0.02em]">
          Common questions.
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {c.faqs.map((f, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="border-b"
              style={{ borderColor: `hsl(${color} / 0.15)` }}
            >
              <AccordionTrigger className="text-left font-display font-semibold text-sm sm:text-base hover:no-underline py-4">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm leading-[1.7] pb-4">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default ServiceDeep;
