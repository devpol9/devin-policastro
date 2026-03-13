const SITE_URL = "https://devin-policastro.lovable.app";

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
    title: "Devin Policastro — Entrepreneur & Founder | Norwood, NJ",
    description:
      "Devin Policastro is an entrepreneur and founder based in Norwood, NJ. Impact Zone Fitness, 2THIRTY hydration, Creative Vision, Valence — building brands and connecting people.",
  },
  "/consulting": {
    title: "Business Consulting — Devin Policastro",
    description:
      "Brand strategy, growth advisory, and business consulting from Devin Policastro. Real-world experience scaling fitness, CPG, and service businesses.",
  },
  "/manufacturing": {
    title: "Custom Manufacturing — Creative Vision by Devin Policastro",
    description:
      "Custom apparel, fitness equipment, supplements, and branded products. From concept to shelf — Creative Vision handles manufacturing end to end.",
  },
  "/content": {
    title: "Content Creation — Devin Policastro",
    description:
      "Short-form video, social media content, and brand storytelling. Build your digital presence with proven content strategies.",
  },
  "/automotive": {
    title: "Automotive Services — Devin Policastro",
    description:
      "Vinyl wraps, PPF, ceramic coating, window tinting, tuning, and full custom builds. Premium automotive services in NJ.",
  },
  "/financing": {
    title: "Business Financing — Devin Policastro",
    description:
      "Business financing solutions and capital access. Structure your next venture with the right funding and terms.",
  },
  "/networking": {
    title: "Strategic Networking — Devin Policastro",
    description:
      "Relationship-driven growth and strategic introductions. Connect with the right people to move your business forward.",
  },
  "/fitness": {
    title: "Fitness & Training — Impact Zone NJ | Devin Policastro",
    description:
      "Personal training, group programs, and lifestyle coaching at Impact Zone Fitness in Norwood, NJ. 51,000 sq ft, 100+ machines, no contracts.",
  },
};
