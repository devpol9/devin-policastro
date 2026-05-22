const SITE_URL = "https://devinpolicastro.com";

export const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Devin Policastro",
  url: SITE_URL,
  image: `${SITE_URL}/images/devin-profile.jpg`,
  jobTitle: "Entrepreneur & Founder",
  description:
    "Devin Policastro is an entrepreneur and founder based in Norwood, NJ. He built Impact Zone Fitness, 2THIRTY hydration, Creative Vision manufacturing, and Valence — connecting brands, people, and revenue.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "335 Chestnut St",
    addressLocality: "Norwood",
    addressRegion: "NJ",
    postalCode: "07648",
    addressCountry: "US",
  },
  sameAs: [
    "https://instagram.com/devinpolicastro",
    "https://tiktok.com/@devinpolicastro",
    "https://youtube.com/@devinpolicastro",
    "https://linkedin.com/in/devin-policastro-10a196153/",
  ],
  knowsAbout: [
    "Fitness Industry",
    "Brand Development",
    "Hydration & Supplements",
    "Consulting",
    "Automotive Customization",
    "Content Creation",
    "Manufacturing",
    "Networking",
    "Business Financing",
  ],
  brand: [
    {
      "@type": "Organization",
      name: "Impact Zone Fitness",
      url: "https://impactzonenj.com",
      description:
        "51,000 sq ft world-class fitness facility in Norwood, NJ. 100+ machines, cold plunges, infrared saunas, hot yoga, red light therapy, basketball court, and sports turf.",
      address: {
        "@type": "PostalAddress",
        streetAddress: "335 Chestnut St",
        addressLocality: "Norwood",
        addressRegion: "NJ",
        postalCode: "07648",
        addressCountry: "US",
      },
    },
    {
      "@type": "Organization",
      name: "2THIRTY",
      url: "https://drink2thirty.com",
      description:
        "5-in-1 hydration+ mixer — zero sugar, zero calories. NAC, L-Glutathione, Milk Thistle, Ginseng Root. 4.9 stars from 3,500+ reviews.",
    },
    {
      "@type": "Organization",
      name: "Creative Vision",
      description:
        "Custom manufacturing — apparel, fitness equipment, supplements, and branded products from concept to delivery.",
    },
    {
      "@type": "Organization",
      name: "Valence",
      description:
        "Strategic business services, financing solutions, and growth advisory.",
    },
  ],
};

export const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "HealthClub",
  name: "Impact Zone Fitness",
  image: `${SITE_URL}/images/iz-hero.jpg`,
  url: "https://impactzonenj.com",
  telephone: "",
  address: {
    "@type": "PostalAddress",
    streetAddress: "335 Chestnut St",
    addressLocality: "Norwood",
    addressRegion: "NJ",
    postalCode: "07648",
    addressCountry: "US",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 40.9884,
    longitude: -73.9621,
  },
  description:
    "Bergen County's premier 51,000 sq ft fitness facility. 100+ machines, cold plunges, infrared saunas, hot yoga, red light therapy, basketball court, sports turf. No contracts.",
  founder: {
    "@type": "Person",
    name: "Devin Policastro",
  },
  areaServed: {
    "@type": "GeoCircle",
    geoMidpoint: {
      "@type": "GeoCoordinates",
      latitude: 40.9884,
      longitude: -73.9621,
    },
    geoRadius: "30000",
  },
};

export const seoPages: Record<string, { title: string; description: string }> = {
  "/": {
    title: "Devin Policastro — Builder, Connector, NJ Entrepreneur",
    description:
      "I build brands, connect people, and turn handshakes into revenue. Impact Zone, 2THIRTY, Creative Vision, Valence — all out of Norwood, NJ.",
  },
  "/consulting": {
    title: "NJ Brand & Revenue Consulting | Devin Policastro",
    description:
      "Brand, revenue, and content consulting from a NJ founder who's actually built it — 2THIRTY, Impact Zone, Creative Vision. Bergen County & remote.",
  },
  "/manufacturing": {
    title: "NJ Product Manufacturing — Apparel, Supplements, Gym Gear | Creative Vision",
    description:
      "Custom apparel, supplements, beverages, and fitness equipment from concept to shelf. Private label, white label, and Amazon-ready production.",
  },
  "/content": {
    title: "Content & Brand Collabs — IG, TikTok, YouTube | Devin Policastro",
    description:
      "Sponsored content, UGC, and brand partnerships across Instagram, TikTok, and YouTube. NJ-based creator, real buyers, real engagement.",
  },
  "/automotive": {
    title: "NJ Car Wraps, PPF, Tuning & Custom Builds | Devin Policastro",
    description:
      "Vinyl wraps, full-body PPF, ceramic, tinting, tuning, powder coat, and custom builds. Bergen County & tri-state — vetted shops, no markup.",
  },
  "/financing": {
    title: "NJ Business Financing — SBA, MCA, Equipment, Credit | Devin Policastro",
    description:
      "Get connected to vetted lenders for SBA, MCA, equipment, real estate, and startup capital. NJ founders, e-com, gyms, contractors. Free intro.",
  },
  "/networking": {
    title: "NJ Paid Introductions & Partnership Brokering | Devin Policastro",
    description:
      "Warm intros to NJ contractors, suppliers, investors, attorneys, marketers, and operators. Bergen County to the tri-state. The right room, fast.",
  },
  "/fitness": {
    title: "Personal Training & Coaching | Impact Zone Fitness Norwood NJ",
    description:
      "Personal training, lifestyle coaching, nutrition, and competition prep at Impact Zone Norwood, NJ — 51,000 sq ft, no contracts. Remote too.",
  },
};
