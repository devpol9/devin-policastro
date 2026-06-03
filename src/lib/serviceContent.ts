// Deep content for service pages — longform intro, case studies, FAQs, related links.
// Used to render visible SEO sections and to generate FAQPage + Service JSON-LD.

import type { LucideIcon } from "lucide-react";
import { Briefcase, Factory, Video, Car, CreditCard, Handshake, Dumbbell } from "lucide-react";

export type ServiceSlug =
  | "consulting"
  | "manufacturing"
  | "content"
  | "automotive"
  | "financing"
  | "networking"
  | "fitness";

export interface FAQ {
  q: string;
  a: string;
}

export interface CaseStudy {
  title: string;
  body: string;
  meta?: string;
}

export interface RelatedLink {
  slug: ServiceSlug;
  label: string;
  blurb: string;
  icon: LucideIcon;
  color: string;
}

export interface ServiceDeepContent {
  slug: ServiceSlug;
  path: string;
  name: string;          // public service name for schema
  shortName: string;     // for related cards
  color: string;         // accent HSL
  icon: LucideIcon;
  intro: string[];       // 2-3 paragraphs of real talk
  caseStudies: CaseStudy[];
  faqs: FAQ[];
  related: ServiceSlug[]; // slugs to cross-link
  serviceType: string;   // for schema.org Service
  areaServed: string;    // "Norwood, NJ", etc.
}

const REGISTRY: Record<ServiceSlug, Omit<ServiceDeepContent, "related"> & { related: ServiceSlug[] }> = {
  consulting: {
    slug: "consulting",
    path: "/consulting",
    name: "Brand & Revenue Consulting",
    shortName: "Consulting",
    color: "270 16% 50%",
    icon: Briefcase,
    serviceType: "Business Consulting",
    areaServed: "New Jersey & Tri-State",
    intro: [
      "Most brand consultants have never built a brand. I have. Impact Zone Fitness — 51,000 sq ft, profitable, zero debt. 2THIRTY hydration — 4.9 stars, 3,500+ reviews, in retail. Creative Vision — manufacturing real product for real founders. When you work with me you get an operator, not a deck-builder.",
      "I help NJ founders, creators, and product brands get unstuck. Usually that means one of three things: your positioning is fuzzy and nobody can repeat what you do, your offer is priced wrong for the market you're chasing, or your content isn't tied to revenue. I'll tell you which one in 30 minutes.",
      "If you want a 90-day plan from someone who's actually shipped — Bergen County, the tri-state, or remote — let's talk.",
    ],
    caseStudies: [
      {
        title: "2THIRTY hydration — from idea to retail",
        body: "Built positioning, packaging, and launch strategy for a zero-sugar 5-in-1 hydration mixer. Now 3,500+ reviews, 4.9 stars, stocked at Impact Zone and partner gyms across NJ.",
        meta: "DTC + wholesale",
      },
      {
        title: "Impact Zone — Bergen County's largest gym",
        body: "Designed the membership model, content engine, and partner network that fills 51,000 sq ft without long-term contracts. Profitable from year one.",
        meta: "Brick & mortar",
      },
    ],
    faqs: [
      { q: "How much does a consulting engagement cost?", a: "Brand Clarity Calls are $150 for 30 minutes. Full engagements start at $500 and scale based on scope. I'll quote flat-fee whenever possible — no hourly games." },
      { q: "Do you work outside New Jersey?", a: "Yes. Most of my consulting work is remote. In-person sessions are easy in Bergen County and the NYC metro; everywhere else is Zoom." },
      { q: "What kinds of businesses do you work with?", a: "Fitness facilities, supplement / beverage CPG, creator brands, service businesses, and early-stage founders trying to find product-market fit. If you sell something and want to sell more of it, we can probably work together." },
      { q: "Do you take equity instead of fees?", a: "Occasionally — only for ventures where I can be hands-on and the upside is real. Default is paid engagement." },
      { q: "How fast can we start?", a: "Brand Clarity Calls usually inside 7 days. Full engagements typically kick off within 2 weeks." },
      { q: "Will you sign an NDA?", a: "Yes. Send it over with your inquiry." },
    ],
    related: ["manufacturing", "content", "financing"],
  },

  manufacturing: {
    slug: "manufacturing",
    path: "/manufacturing",
    name: "Creative Vision Manufacturing",
    shortName: "Manufacturing",
    color: "270 16% 48%",
    icon: Factory,
    serviceType: "Product Manufacturing",
    areaServed: "United States",
    intro: [
      "Creative Vision is the manufacturing arm — apparel, accessories, gym equipment, supplements, beverages, and ecom-ready product. We took 2THIRTY from napkin sketch to retail-shelf SKU; we can do the same for you.",
      "Most product founders get burned because they hire a designer, then a sourcing agent, then a fulfillment company, then a label compliance lawyer, and nobody owns the timeline. We run the whole thing under one roof. You talk to one person, not five.",
      "Whether it's 500 hoodies for a launch or 50,000 units of a private-label supplement, you get real MOQs, honest lead times, and product you'd actually be proud to sell.",
    ],
    caseStudies: [
      {
        title: "2THIRTY — full-stack CPG build",
        body: "Formulation, FDA-compliant labeling, custom stick packs, fulfillment, Amazon FBA setup. Now a 4.9-star DTC brand with wholesale across NJ.",
        meta: "Supplement / beverage",
      },
      {
        title: "Impact Zone branded gear",
        body: "Custom apparel, jump ropes, mini bands, and recovery accessories — designed, manufactured, and dropped on the member base with a single PO.",
        meta: "Apparel + accessories",
      },
    ],
    faqs: [
      { q: "What's the minimum order quantity?", a: "Apparel typically starts at 100–300 units. Supplements and beverages are usually 1,000–5,000. Custom gym gear varies — ask and I'll give you a real number." },
      { q: "How long does production take?", a: "Apparel: 4–8 weeks. Supplements: 8–14 weeks including stability testing. Custom hardgoods: 6–12 weeks. Lead times start the day artwork and POs are approved, not the day you ask." },
      { q: "Can you handle private label and white label?", a: "Yes. Private label (your formula, your brand) and white label (our spec, your brand) are both available. White label is the fastest path to market." },
      { q: "Do you handle Amazon FBA and DTC fulfillment?", a: "Yes — we can ship directly to FBA, to a 3PL of your choice, or fulfill ourselves on smaller runs." },
      { q: "Will you help with packaging and label compliance?", a: "Yes. Supplement Facts panels, FDA disclaimers, prop-65, allergen statements — handled in-house." },
      { q: "Can I see samples before placing a bulk order?", a: "Always. Sample fees are usually credited toward your first production run." },
    ],
    related: ["consulting", "financing", "content"],
  },

  content: {
    slug: "content",
    path: "/content",
    name: "Content Collabs & Brand Partnerships",
    shortName: "Content",
    color: "350 22% 55%",
    icon: Video,
    serviceType: "Influencer & Content Marketing",
    areaServed: "United States",
    intro: [
      "I post real content across Instagram, TikTok, and YouTube about business, fitness, car culture, and what I'm actually building. The audience is buyers — founders, gym owners, lifters, car enthusiasts, and operators — not vanity followers.",
      "When a brand fits, we make content that actually converts. Product reviews, sponsored reels, UGC packs, event coverage, and full campaign builds. Everything is filmed and edited at a level that matches Impact Zone and 2THIRTY production — no shaky iPhone trash.",
      "If your product solves a real problem and you want it in front of an engaged NJ / tri-state audience that buys, let's collab.",
    ],
    caseStudies: [
      {
        title: "2THIRTY — own-brand content engine",
        body: "Daily short-form content drove 3,500+ reviews and consistent DTC reorders without paid acquisition spend.",
        meta: "Own brand",
      },
      {
        title: "Impact Zone tours & member stories",
        body: "Facility tours and member transformations drove top-of-funnel for the largest gym in Bergen County. Zero paid boost.",
        meta: "Local services",
      },
    ],
    faqs: [
      { q: "What does a brand collab cost?", a: "Sponsored posts start at $250. Full campaigns (multiple posts + UGC + usage rights) are quoted based on deliverables and exclusivity." },
      { q: "Do you give usage rights and whitelisting?", a: "Yes. Usage rights, whitelisting, and dark-post permissions are all available — priced into the deliverable." },
      { q: "What kinds of brands do you work with?", a: "Fitness, supplements, automotive, men's lifestyle, NJ local services, and SaaS tools built for founders or operators. If it lines up with what I actually use, the content lands harder." },
      { q: "Will you take product-only deals?", a: "Only for products I'd genuinely use and only when there's a clear partnership path beyond the first post." },
      { q: "How fast can content go live?", a: "Typically 7–14 days from concept lock to publish. Rush turnaround available." },
      { q: "Can I see audience demographics?", a: "Yes — share your inquiry and I'll send the latest deck." },
    ],
    related: ["consulting", "networking", "manufacturing"],
  },

  automotive: {
    slug: "automotive",
    path: "/automotive",
    name: "Automotive Wraps, PPF, Tuning & Custom Builds",
    shortName: "Automotive",
    color: "12 45% 48%",
    icon: Car,
    serviceType: "Automotive Customization",
    areaServed: "New Jersey & Tri-State",
    intro: [
      "Cars have been part of my life forever. Over the years I've built relationships with the best wrap, PPF, ceramic, tune, and custom-build shops in the tri-state. If you want it done right and you don't want to roll the dice on Yelp, talk to me.",
      "Tell me what car you're driving and what you want done — wrap, full-body PPF, ceramic, tinting, tune, powder coat, interior, or a full ground-up build — and I'll connect you to the shop that actually does it best for that work, at a fair price.",
      "No markup, no middleman games. The shops take care of you because I send them real business. You get the relationship, the trust, and the price you'd never get cold-walking in.",
    ],
    caseStudies: [
      {
        title: "BMW M-series full-body PPF + ceramic",
        body: "Connected the owner to a top-tier installer for full XPEL PPF and ceramic. Saved 4 weeks of lead time and ~15% vs cold-calling.",
        meta: "Protection package",
      },
      {
        title: "Audi RS color-change wrap + tune",
        body: "Coordinated wrap, ECU tune, and downpipe install across two shops on a single timeline. Picked up complete in 3 weeks.",
        meta: "Full transformation",
      },
    ],
    faqs: [
      { q: "Do you actually do the work or do you connect me to a shop?", a: "I connect you to vetted shops in NJ and the tri-state. They do the work — I make sure you're priced right and treated right." },
      { q: "Do you charge for the introduction?", a: "No. The shops take care of me because I send them real customers. You pay the shop directly, at their normal price (often better)." },
      { q: "What car brands and shops do you work with?", a: "BMW, Audi, Mercedes, Porsche, Tesla, exotics, and trucks. Shops cover wrap, PPF, ceramic, tinting, tuning, powder coat, interiors, and full builds." },
      { q: "How long does a typical wrap or PPF job take?", a: "Vinyl wrap: 3–7 days. Full-body PPF: 1–2 weeks. Tinting: same day. Full custom builds run weeks to months depending on scope." },
      { q: "Where are the shops located?", a: "Mostly Bergen County, North Jersey, and the NYC metro. A few specialty shops in Long Island and PA for unique work." },
      { q: "Can you handle a full custom build?", a: "Yes — wheels, suspension, body, interior, tune, all coordinated under one project timeline." },
    ],
    related: ["networking", "financing", "consulting"],
  },

  financing: {
    slug: "financing",
    path: "/financing",
    name: "Business Financing & Capital Access",
    shortName: "Financing",
    color: "210 22% 50%",
    icon: CreditCard,
    serviceType: "Financial Services",
    areaServed: "United States",
    intro: [
      "Getting funded is half the battle for most founders. I work with vetted lenders, credit specialists, and capital partners who actually fund deals — not the 47 brokers spamming your inbox.",
      "Whether you need an SBA loan, a line of credit, MCA, equipment financing, real estate capital, startup funding, or credit repair to qualify in the first place, I'll connect you to the right person for your situation. Free intro. They take care of me, you get a real shot at closing.",
      "Most clients are NJ-based businesses, gym owners, e-commerce brands, and contractors. If you've been turned down before, that doesn't mean no — it means you talked to the wrong person.",
    ],
    caseStudies: [
      {
        title: "Gym owner — equipment financing in 9 days",
        body: "Connected a Bergen County gym to an equipment lender for a $180K refresh. Approved and funded in 9 business days.",
        meta: "Equipment financing",
      },
      {
        title: "E-commerce brand — revenue-based line of credit",
        body: "Routed a DTC brand to a revenue-based lender after a bank decline. $250K line opened in under 3 weeks.",
        meta: "Working capital",
      },
    ],
    faqs: [
      { q: "Do you charge a fee for the introduction?", a: "No. The lender or specialist takes care of me on their side. You pay them their normal rates — there's no markup." },
      { q: "What credit score do I need?", a: "We have partners for every band. Bank-grade products want 680+. Revenue-based, MCA, and equipment financing fund well below that. Credit repair partners are available if you need to rebuild first." },
      { q: "How fast can a deal close?", a: "MCA and revenue-based: 3–10 business days. Equipment: 1–3 weeks. SBA / bank: 30–60 days. Real estate: 30–90 days." },
      { q: "What loan amounts do partners do?", a: "$10K up to multi-million on commercial deals. Most engagements land between $25K and $500K." },
      { q: "What industries do you fund?", a: "Gyms and wellness, e-commerce / CPG, restaurants, contractors, real estate investors, medical, and most service businesses." },
      { q: "Will applying hurt my credit?", a: "Most partners run soft pulls for qualification. Hard pulls only happen after you accept terms in writing." },
    ],
    related: ["consulting", "manufacturing", "networking"],
  },

  networking: {
    slug: "networking",
    path: "/networking",
    name: "Paid Introductions & Networking",
    shortName: "Networking",
    color: "140 18% 42%",
    icon: Handshake,
    serviceType: "Professional Networking",
    areaServed: "New Jersey & Tri-State",
    intro: [
      "I've spent years building real relationships across Bergen County, the tri-state, and beyond. Contractors, suppliers, manufacturers, investors, attorneys, marketers, operators — if you need someone for the job, I probably know two of them.",
      "This is the most-requested service for a reason: a real warm intro from someone they already trust beats 100 cold emails. You pay a small fee, you get a direct connection, and you skip 6 months of LinkedIn dead-ends.",
      "Tell me who you're trying to reach and why. I'll either make the intro or tell you straight up if it's not a fit.",
    ],
    caseStudies: [
      {
        title: "Founder → angel investor intro",
        body: "Connected a NJ founder to an active angel after a 5-minute call. Closed a $75K check 6 weeks later.",
        meta: "Capital intro",
      },
      {
        title: "Brand → influencer roster",
        body: "Routed a regional CPG brand to three vetted creators in their niche. Campaign ran 30 days with 4x ROAS.",
        meta: "Marketing partnerships",
      },
    ],
    faqs: [
      { q: "How much does an intro cost?", a: "$100 for a standard intro. $250–$500 for higher-value (investors, senior operators, brokered partnerships). Multi-intro packages available." },
      { q: "What happens if the intro doesn't pan out?", a: "I'll make a replacement intro at no additional cost. If the right person doesn't exist in my network, I'll refund." },
      { q: "Who can you introduce me to?", a: "Contractors, suppliers, manufacturers, lenders, attorneys, marketers, designers, developers, gym operators, CPG founders, automotive specialists, influencers, and angel investors — mostly NJ and tri-state, some national." },
      { q: "How fast do intros happen?", a: "Most intros go out within 48 hours of payment and brief approval." },
      { q: "Is the intro warm or just an email forward?", a: "Warm. I've spoken to or worked with the person already. They know you're coming and why." },
      { q: "Do you broker full partnerships?", a: "Yes — brokering is its own service ($250–$1K) and includes scoping the deal, not just the intro." },
    ],
    related: ["consulting", "financing", "automotive"],
  },

  fitness: {
    slug: "fitness",
    path: "/fitness",
    name: "Personal Training & Lifestyle Coaching",
    shortName: "Fitness",
    color: "24 32% 52%",
    icon: Dumbbell,
    serviceType: "Personal Training",
    areaServed: "Norwood, NJ & Bergen County",
    intro: [
      "Impact Zone Fitness is 51,000 sq ft in Norwood, NJ — 100+ machines, cold plunge, infrared sauna, hot yoga, red light, basketball court, and sports turf. Everything you need to train hard, recover faster, and actually stick with it. No long-term contracts.",
      "Beyond the gym, I run lifestyle coaching for people who want a real plan: training, nutrition, sleep, stress, supplements. In-person at Impact Zone or remote anywhere — pick what fits.",
      "If you're starting from zero, plateaued, or prepping for a competition, the program is built around your goal — not a generic template.",
    ],
    caseStudies: [
      {
        title: "Bergen County member — 60 lb cut",
        body: "Lifestyle coaching + structured programming + recovery protocols. 60 lbs down over 9 months, sustained 12 months later.",
        meta: "Weight loss",
      },
      {
        title: "Bodybuilding prep — first show top-5",
        body: "16-week prep program with weekly check-ins, macro adjustments, and posing. First-show top-5 finish.",
        meta: "Competition prep",
      },
    ],
    faqs: [
      { q: "Where do you train?", a: "Impact Zone Fitness, 335 Chestnut St, Norwood, NJ — Bergen County. Remote coaching available worldwide." },
      { q: "Do I need an Impact Zone membership?", a: "For in-person training, yes — and there are no long-term contracts. Remote coaching has no facility requirement." },
      { q: "What does training cost?", a: "Personal training and lifestyle coaching are quoted based on frequency and scope. Send an inquiry and I'll match you to the right coach and pricing." },
      { q: "Do you do nutrition and macros?", a: "Yes. Custom macro targets, meal timing, supplement guidance, and weekly adjustments — included in coaching." },
      { q: "What if I'm a total beginner?", a: "Beginner is the best place to start. Programs are scaled to your current ability and progressed every week." },
      { q: "Do you handle competition prep?", a: "Yes — bodybuilding, physique, and athletic-performance prep, with weekly check-ins and posing guidance." },
    ],
    related: ["consulting", "content", "networking"],
  },
};

export const getServiceContent = (slug: ServiceSlug): ServiceDeepContent => REGISTRY[slug];

export const getFAQSchema = (slug: ServiceSlug) => {
  const c = REGISTRY[slug];
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: c.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
};

export const getServiceSchema = (slug: ServiceSlug) => {
  const c = REGISTRY[slug];
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: c.name,
    serviceType: c.serviceType,
    url: `https://devinpolicastro.com${c.path}`,
    areaServed: c.areaServed,
    provider: {
      "@type": "Person",
      name: "Devin Policastro",
      url: "https://devinpolicastro.com",
    },
  };
};

export const getRelated = (slug: ServiceSlug): RelatedLink[] =>
  REGISTRY[slug].related.map((s) => ({
    slug: s,
    label: REGISTRY[s].shortName,
    blurb: REGISTRY[s].intro[0].split(". ")[0] + ".",
    icon: REGISTRY[s].icon,
    color: REGISTRY[s].color,
  }));
