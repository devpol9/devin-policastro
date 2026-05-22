import { Link } from "react-router-dom";
import { ArrowRight, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

const PlaybookBanner = () => (
  <section className="relative border-t border-border bg-background">
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14 sm:py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
      >
        <div className="md:col-span-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-px w-8 bg-accent" />
            <span className="text-foreground/60 text-[11px] font-display font-medium tracking-[0.22em]">
              Free download — The Playbook
            </span>
          </div>
          <h2 className="font-display font-bold leading-[0.95] tracking-[-0.03em] text-3xl sm:text-5xl md:text-6xl mb-4">
            11 lessons from building 7{" "}
            <span className="accent-headline italic font-light">NJ businesses.</span>
          </h2>
          <p className="text-foreground/70 text-base sm:text-lg max-w-2xl leading-relaxed">
            13-page PDF. No course, no upsell, no drip. Just what cost me real money to learn.
          </p>
        </div>
        <div className="md:col-span-4 flex md:justify-end">
          <Link
            to="/playbook"
            className="group inline-flex items-center gap-3 px-6 py-4 rounded-md bg-foreground text-background text-sm font-display font-semibold tracking-wide hover:bg-foreground/90 transition-all"
          >
            <BookOpen size={16} />
            Get the playbook
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </motion.div>
    </div>
  </section>
);

export default PlaybookBanner;
