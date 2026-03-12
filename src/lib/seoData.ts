const SITE_URL = "https://brand-hq-hub.lovable.app";

export const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Devin Policastro",
  url: SITE_URL,
  jobTitle: "Entrepreneur & Founder",
  description: "Entrepreneur, connector, and builder. Founder of Impact Zone NJ and 2THIRTY.",
  sameAs: [
    "https://instagram.com/devinpolicastro",
    "https://tiktok.com/@devinpolicastro",
    "https://youtube.com/@devinpolicastro",
    "https://linkedin.com/in/devin-policastro-10a196153/",
  ],
  knowsAbout: [
    "Fitness Industry",
    "Brand Development",
    "Consulting",
    "Automotive Customization",
    "Content Creation",
    "Networking",
  ],
  brand: [
    {
      "@type": "Organization",
      name: "Impact Zone NJ",
      url: "https://impactzonenj.com",
      description: "51,000 sq ft world-class fitness facility in New Jersey.",
    },
    {
      "@type": "Organization",
      name: "2THIRTY",
      url: "https://drink2thirty.com",
      description: "5-in-1 hydration+ mixer — zero sugar, zero calories.",
    },
  ],
};

export const seoPages: Record<string, { title: string; description: string }> = {
  "/": {
    title: "Devin Policastro — Entrepreneur, Connector, Builder",
    description: "I build brands, connect people, and turn every handshake into a revenue stream. Founder of Impact Zone NJ & 2THIRTY.",
  },
  "/consulting": {
    title: "Consulting — Devin Policastro",
    description: "Brand strategy, business consulting, and growth advisory from Devin Policastro. Scale your brand with real-world expertise.",
  },
  "/manufacturing": {
    title: "Manufacturing — Creative Vision by Devin Policastro",
    description: "Custom apparel, accessories, supplements, gym equipment, and ecom products. From concept to shelf — build your next brand.",
  },
  "/content": {
    title: "Content Creation — Devin Policastro",
    description: "Instagram reels, short-form video, and social media content creation. Build your brand's digital presence.",
  },
  "/automotive": {
    title: "Automotive & Custom Builds — Devin Policastro",
    description: "Vinyl wraps, PPF, ceramic coating, window tinting, tuning, and full custom builds. Premium automotive services — I'll connect you.",
  },
  "/financing": {
    title: "Financing — Devin Policastro",
    description: "Business financing solutions and capital access. Fund your next venture with the right structure.",
  },
  "/networking": {
    title: "Networking — Devin Policastro",
    description: "Strategic networking and relationship-driven growth. Connect with the right people to scale your business.",
  },
  "/fitness": {
    title: "Fitness & Training — Devin Policastro",
    description: "Personal training, lifestyle coaching, nutrition advice, and workout programming at Impact Zone NJ.",
  },
};
