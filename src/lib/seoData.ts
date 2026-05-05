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
    title: "Consulting — Brand Strategy & Growth | Devin Policastro",
    description:
      "Real-world brand strategy and growth advisory from someone who's actually built it. Fitness, CPG, services — no agency markup.",
  },
  "/manufacturing": {
    title: "Manufacturing — Concept to Shelf | Creative Vision",
    description:
      "Custom apparel, fitness equipment, supplements, and branded products. Idea to delivery, end to end.",
  },
  "/content": {
    title: "Content — Short-Form Video & Storytelling | Devin Policastro",
    description:
      "Short-form video, social content, and brand storytelling that actually moves the needle. Built by an operator, not an agency.",
  },
  "/automotive": {
    title: "Automotive — Wraps, PPF, Tuning, Builds | Devin Policastro",
    description:
      "Vinyl wraps, PPF, ceramic coating, tinting, tuning, and full custom builds. Premium work, NJ.",
  },
  "/financing": {
    title: "Financing — Capital & Deal Structure | Devin Policastro",
    description:
      "Business financing and capital access. Structure your next venture with the right funding, the right terms.",
  },
  "/networking": {
    title: "Networking — The Right Intros, On Purpose | Devin Policastro",
    description:
      "Relationship-driven growth and strategic introductions. The right room beats a thousand cold emails.",
  },
  "/fitness": {
    title: "Fitness — Training & Coaching | Impact Zone NJ",
    description:
      "Personal training, group programs, and lifestyle coaching at Impact Zone Fitness in Norwood, NJ. 51,000 sq ft, no contracts.",
  },
};
