// ============================================================
// SARNSARENE — English translations of the Thai body copy in
// lib/content.ts. The brand name and short English brand-style
// titles/labels (eyebrows, headings like "Our Roots") stay the
// same in both languages by design — only the longer Thai prose
// is translated here. Thai stays the default (content.ts as-is);
// this file is the EN override, applied when lang === "en".
// ============================================================

export const en = {
  hero: {
    subtitle: "A touch of refined serenity.",
  },
  philosophy: {
    items: [
      {
        description:
          "Rooted in the Thai word for \"weave\" — the art of connecting people and culture, giving rise to lasting value.",
      },
      {
        description: "Rooted in the Latin serēnus — pure calm, clarity, and steadiness from within.",
      },
    ],
  },
  ourStory: {
    bannerSubtitle: "From a name born of weaving, to the philosophy of serenity SARNSARENE has held since the beginning.",
    paragraphs: [
      "The name SARNSARENE comes from \"Sarn\" — the Thai word for weaving threads into cloth — and \"Serene\", a state of quiet stillness. Together, these two meanings form the heart of the brand: weaving calm into every piece.",
      "We exist to change the way people see Thai weaving materials — moving them beyond the familiar image of tradition or souvenir, into something people can genuinely live with: used daily, worn with pride, and felt as a quiet form of everyday luxury.",
      "Every piece passes through the hands of Thai artisans whose craft has been passed down through generations, before being elevated with a structure and design built for the rhythm of modern city life.",
    ],
  },
  easternInspiration: {
    sections: [
      {
        description:
          "From the ancient loom to fabric both strong and beautiful — we source quality Thai weaving materials and redesign them for the pace of modern life.",
      },
      {
        description:
          "A teardrop brass clasp, the SARNSARENE name finely engraved, and hand-shaped handles — details that speak to the care taken at every step.",
      },
    ],
  },
  signatureExperience: {
    cards: [
      { description: "A signature woven texture unique to the brand, combining durability with a touch as soft as silk." },
      { description: "Finely gold-plated hardware and hooks, built to withstand everyday use." },
      { description: "A generously roomy silhouette, balancing everyday capacity with an elegantly clean line." },
    ],
  },
  highlightQuote: {
    quote:
      "We believe in the power of weaving — taking the smallest threads and turning them into something strong and beautiful, just as we weave intention into every piece.",
  },
  brandManifesto: {
    title: "Quiet Luxury, Never Loud",
    paragraphs: [
      "We believe true luxury doesn't need to raise its voice. In a world that moves fast, we choose to slow down — valuing detail, material, and craftsmanship over spectacle.",
      "We believe Thai craftsmanship and contemporary design are not opposites. The finest weaving is often the oldest — simply retold through care, design, and respect for traditional wisdom.",
      "This is our promise: to create with honesty, design without compromise, and preserve the value of Thai craftsmanship in every piece we pass on to you.",
    ],
  },
  featuredCollection: {
    products: [
      { description: "A shimmering gold hue, signature to the brand." },
      { description: "Sleek and elegant, pairing effortlessly with any outfit." },
      { description: "A tone that reflects the true identity of SARNSARENE." },
      { description: "Soft on the eye and gentle in feel, suited for everyday wear." },
      { description: "Understated, yet never without style." },
    ],
  },
  journeyForward: {
    description:
      "We continue moving forward with the same intention — elevating Thai weaving materials into contemporary products that are practical, durable, and quietly luxurious, carrying Thai craftsmanship toward international recognition.",
  },
  sustainability: {
    description:
      "Every decision we make is weighed against its impact on the artisans who create our weaves, and the value of the Thai wisdom we are committed to preserving.",
  },
  newsletter: {
    subtitle: "Subscribe to be the first to see new collections, behind-the-scenes craft stories, and exclusive launches from SARNSARENE.",
  },
  footer: {
    tagline: "Contemporary Thai weaving, quietly luxurious.\nBangkok, Thailand",
  },
};

// Thai overrides for the handful of fields that are English by
// default in content.ts (the nav bar chrome only — every other
// section's Thai copy already lives directly in content.ts).
export const th = {
  nav: {
    contactUs: "ติดต่อเรา",
    shop: "ร้านค้า",
    links: ["ความหมายของชื่อ", "ปรัชญาและเรื่องราวแบรนด์"],
  },
};
