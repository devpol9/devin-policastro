import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Download } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { seoPages } from "@/lib/seoData";
import FloatingNav from "@/components/FloatingNav";
import MobileBottomNav from "@/components/MobileBottomNav";
import Footer from "@/components/Footer";
import SectionHeader from "@/components/SectionHeader";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { trackEvent } from "@/lib/analytics";

const COLOR = "38 55% 58%";

const PLAYBOOK_URL =
  "https://vprroffyczhnalpwwltf.supabase.co/storage/v1/object/public/lead-magnets/nj-entrepreneur-playbook.pdf";

const chapters = [
  "Pick the boring offer first",
  "Charge more than feels comfortable",
  "Show up before you're ready",
  "Build the relationship before you need it",
  "One offer, one audience, one channel",
  "Content is the cheapest sales rep",
  "Cash flow > revenue",
  "Hire slow, fire fast, document",
  "The local moat is real",
  "Reinvest before you reward yourself",
  "Stay in the game",
];

const Playbook = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const playbookJsonLd = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: "The NJ Entrepreneur Playbook",
    author: { "@type": "Person", name: "Devin Policastro" },
    numberOfPages: 13,
    inLanguage: "en-US",
    bookFormat: "https://schema.org/EBook",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke("capture-lead-magnet", {
        body: { name: name.trim(), email: email.trim(), source: "playbook-page" },
      });
      if (error) throw error;
      trackEvent("lead_magnet_capture", { magnet: "nj-entrepreneur-playbook" });
      setDone(true);
      toast.success("Sent. Check your inbox.");
    } catch (err) {
      console.error(err);
      toast.error("Something broke. Try again or email me directly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden noise-overlay">
      <SEOHead {...seoPages["/playbook"]} canonicalPath="/playbook" jsonLd={[playbookJsonLd]} />
      <FloatingNav />

      <section className="section-padding pt-32 sm:pt-40">
        <div className="container-tight">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground md:hover:text-foreground transition-colors text-sm font-display mb-8"
          >
            <ArrowLeft size={16} />
            Back to home
          </Link>

          <SectionHeader
            as="h1"
            numeral="00"
            eyebrow="The Playbook"
            accentColor={COLOR}
            title={
              <>
                The NJ Entrepreneur{" "}
                <span className="italic font-light" style={{ color: `hsl(${COLOR})` }}>
                  Playbook.
                </span>
              </>
            }
            description="11 lessons from building 7 businesses in New Jersey. Cost me real money to learn. Free to you. No course, no upsell, no fluff."
          />

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 mt-12">
            {/* Left: chapter list */}
            <div className="lg:col-span-3">
              <div className="border border-border/40 rounded-lg p-6 sm:p-8 bg-card/40">
                <div className="flex items-center gap-2 mb-6 text-sm font-display text-muted-foreground">
                  <BookOpen size={16} style={{ color: `hsl(${COLOR})` }} />
                  What's inside
                </div>
                <ol className="space-y-3">
                  {chapters.map((c, i) => (
                    <li key={c} className="flex gap-4 items-start">
                      <span
                        className="text-xs font-display font-semibold tabular-nums pt-0.5"
                        style={{ color: `hsl(${COLOR})` }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-sm sm:text-base text-foreground/90 leading-relaxed">{c}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                {[
                  { k: "13", v: "pages" },
                  { k: "11", v: "lessons" },
                  { k: "7", v: "businesses behind it" },
                ].map((s) => (
                  <div key={s.v} className="border border-border/40 rounded-lg px-4 py-3">
                    <div className="text-xl font-display font-bold" style={{ color: `hsl(${COLOR})` }}>
                      {s.k}
                    </div>
                    <div className="text-muted-foreground text-xs">{s.v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: capture form */}
            <div className="lg:col-span-2">
              <div className="border border-border/40 rounded-lg p-6 sm:p-8 bg-card/40 sticky top-32">
                {!done ? (
                  <>
                    <h2 className="text-xl sm:text-2xl font-display font-bold mb-2 leading-tight">
                      Send it to my inbox
                    </h2>
                    <p className="text-sm text-muted-foreground mb-6">
                      Free PDF. One email. No drip sequence, no spam.
                    </p>
                    <form onSubmit={submit} className="space-y-4">
                      <div>
                        <label className="block text-[11px] font-display font-semibold tracking-[0.14em] text-foreground/85 mb-2">
                          Name
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          maxLength={120}
                          autoComplete="name"
                          className="w-full bg-background border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-display font-semibold tracking-[0.14em] text-foreground/85 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          maxLength={200}
                          autoComplete="email"
                          className="w-full bg-background border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors"
                          placeholder="you@example.com"

                        />
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md text-sm font-display font-semibold bg-foreground text-background md:hover:bg-foreground/90 transition-all disabled:opacity-60"
                      >
                        {loading ? "Sending…" : "Send me the playbook"}
                        {!loading && <ArrowRight size={14} />}
                      </button>
                      <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                        I'll never sell your email. Unsubscribe whenever.
                      </p>
                    </form>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <div
                      className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4"
                      style={{ background: `hsl(${COLOR} / 0.15)` }}
                    >
                      <CheckCircle2 size={26} style={{ color: `hsl(${COLOR})` }} />
                    </div>
                    <h3 className="text-xl font-display font-bold mb-2">It's in your inbox.</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Or grab it right here while you're at it.
                    </p>
                    <a
                      href={PLAYBOOK_URL}
                      target="_blank"
                      rel="noopener"
                      onClick={() => trackEvent("lead_magnet_download_direct", { magnet: "nj-entrepreneur-playbook" })}
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md text-sm font-display font-semibold bg-foreground text-background md:hover:bg-foreground/90 transition-all"
                    >
                      <Download size={14} />
                      Download the PDF
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bio block for trust + SEO */}
          <div className="mt-20 border-t border-border/40 pt-10">
            <p className="text-xs font-display uppercase tracking-wider mb-3" style={{ color: `hsl(${COLOR})` }}>
              About the author
            </p>
            <h2 className="text-2xl sm:text-3xl font-display font-bold mb-4">Why listen to me</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm sm:text-base text-foreground/80 leading-relaxed max-w-3xl">
              <p>
                I'm Devin Policastro — a NJ entrepreneur out of Norwood. Over the last decade I built Impact Zone
                Fitness (51,000 sq ft, no contracts), 2THIRTY hydration, Creative Vision manufacturing, Valence, and a
                content engine across Instagram, TikTok, and YouTube.
              </p>
              <p>
                Everything in this playbook came from real bills, real payroll, and real mistakes. If one chapter saves
                you a month of going the wrong direction, it earned its keep. Need help on a specific piece? Pick a
                service on the home page and we'll talk.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default Playbook;
