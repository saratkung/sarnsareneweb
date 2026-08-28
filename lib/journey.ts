// ============================================================
// SARNSARENE — "The Journey" page.
// Single source of truth for every word, image path and section
// colour on /journey. Edit values here only.
//
//   • .th / .en   — Thai is shown by default; English when the
//                   language toggle (top-right) is set to EN.
//   • image       — files live in /public. Swap the file at the
//                   same path (keep the aspect ratio) to change
//                   a photo — no code change needed.
//   • bg / ink / accent
//                 — the colour skin for that chapter. `bg` is the
//                   section background, `ink` the text colour,
//                   `accent` the hairline / number / underline.
//
// Placeholder imagery currently lives in /images/journey/*.webp
// (warm-toned fills with a label). Drop real photography in at
// the same paths to go live.
// ============================================================

export const journeyMeta = {
  // Browser tab + share card.
  title: "The Journey — SARNSARENE",
  description:
    "A journey toward serenity — the story of SARNSARENE, told as a quiet fashion film.",
  // Shown top-left and in the share card.
  brand: "SARNSARENE",
  // Small rotated text pinned to the left edge on desktop.
  sideLabel: "A JOURNEY TOWARD SERENITY",
  // "← back to the main site" control, top-left next to the wordmark.
  backLabel: { th: "หน้าหลัก", en: "HOME" },
  backHref: "/",
};

export const journeyHero = {
  image: "/images/journey/journey-hero.webp", // dark textile close-up, landscape
  // Rendered as three stacked lines.
  lineTop: "THE JOURNEY",
  lineMid: "of",
  lineBottom: "SARNSARENE",
  scrollCue: { th: "SCROLL TO BEGIN", en: "SCROLL TO BEGIN" },
};

// The overlay menu (MENU ☰, top-right). Section links scroll within
// the page; the last two links leave for the main site.
export const journeyMenu = {
  label: { th: "เมนู", en: "MENU" },
  siteLinks: [
    { label: { th: "กลับสู่หน้าหลัก", en: "BACK TO HOME" }, href: "/" },
    { label: { th: "ชอป", en: "SHOP" }, href: "/shop" },
  ],
};

export type JourneySection = {
  id: string; // anchor + progress-nav key
  index: string; // "01" … "06"
  kicker: { th: string; en: string }; // "THE BEGINNING"
  // Visual skin — see file header.
  bg: string;
  ink: string;
  accent: string;
  // Layout hint consumed by JourneySections.tsx.
  layout: "split" | "full-bleed" | "centered";
};

// Order here == order on the page == order in the progress nav.
export const journeySections: JourneySection[] = [
  { id: "beginning",   index: "01", kicker: { th: "THE BEGINNING",         en: "THE BEGINNING" },         bg: "#F2EDE3", ink: "#2C261F", accent: "#8C7B63", layout: "split" },
  { id: "inspiration", index: "02", kicker: { th: "THE INSPIRATION",       en: "THE INSPIRATION" },       bg: "#241F1B", ink: "#EDE4D6", accent: "#B79A6F", layout: "full-bleed" },
  { id: "philosophy",  index: "03", kicker: { th: "THE PHILOSOPHY",        en: "THE PHILOSOPHY" },        bg: "#EFE9DD", ink: "#2C261F", accent: "#8C7B63", layout: "split" },
  { id: "making",      index: "04", kicker: { th: "THE MAKING",            en: "THE MAKING" },            bg: "#171310", ink: "#E7DCCC", accent: "#B79A6F", layout: "full-bleed" },
  { id: "collection",  index: "05", kicker: { th: "THE FIRST COLLECTION",  en: "THE FIRST COLLECTION" },  bg: "#F1EBDF", ink: "#2C261F", accent: "#8C7B63", layout: "split" },
  { id: "continues",   index: "06", kicker: { th: "THE JOURNEY CONTINUES", en: "THE JOURNEY CONTINUES" }, bg: "#F5F0E6", ink: "#2C261F", accent: "#8C7B63", layout: "centered" },
];

// ---- Per-section copy -------------------------------------------------
// Keyed by section id. Headings that contain "\n" break across lines and
// reveal one line at a time.

export const journeyContent = {
  beginning: {
    image: "/images/journey/beginning.webp", // landscape — mist, mountains, a lone figure, lots of negative space
    imageAlt: { th: "ภูมิทัศน์ที่มีภูเขา หมอก และคนยืนอยู่เพียงลำพัง", en: "A misty mountain landscape with a single figure" },
    heading: {
      th: "เมื่อชีวิตเคลื่อนเร็วขึ้น\nเราจึงเริ่มมองหาความสงบ",
      en: "As life moves faster,\nwe begin to look for stillness",
    },
    body: {
      th: "การเดินทางของ SARNSARENE เริ่มต้นจากความเชื่อที่ว่า ความสงบและความสมดุลสามารถเยียวยาวิถีชีวิตที่เร่งรีบได้",
      en: "The journey of SARNSARENE began with a belief — that calm and balance can heal a life lived in a hurry.",
    },
  },

  inspiration: {
    image: "/images/journey/inspiration.webp", // full-width — textile / loom / Thai weaving
    imageAlt: { th: "กี่ทอผ้าและงานทอมือแบบไทย", en: "A traditional Thai loom and hand-weaving" },
    heading: {
      th: "แรงบันดาลใจจากเส้นใย\nงานฝีมือ และวัฒนธรรมไทย",
      en: "Drawn from thread,\ncraft, and Thai culture",
    },
    body: {
      th: "ทุกลวดลาย ทุกเส้นสาย ล้วนซ่อนเรื่องราวของอดีต ภูมิปัญญา และความประณีตที่ส่งต่อจากรุ่นสู่รุ่น",
      en: "Every pattern, every line holds a story — of the past, of wisdom, of a care passed down through generations.",
    },
  },

  philosophy: {
    image: "/images/journey/philosophy.webp", // right side — flowing cream / beige fabric
    imageAlt: { th: "ผ้าสีครีมพลิ้วไหว", en: "Flowing cream-coloured fabric" },
    heading: { th: "HARMONIOUS\nHEALING", en: "HARMONIOUS\nHEALING" },
    body: {
      th: "การเยียวยาวิถีชีวิตที่เร่งรีบ ด้วยความสมดุล ความเรียบง่าย และความเงียบสงบ",
      en: "Healing a hurried life through balance, simplicity, and quiet.",
    },
    // Three minimal, thin-line marks. `icon` maps to JourneyIcon in primitives.tsx.
    pillars: [
      { icon: "harmony" as const, label: { th: "HARMONY", en: "HARMONY" } },
      { icon: "balance" as const, label: { th: "BALANCE", en: "BALANCE" } },
      { icon: "serenity" as const, label: { th: "SERENITY", en: "SERENITY" } },
    ],
  },

  making: {
    image: "/images/journey/making.webp", // close-up — artisan hands, leather / textile craft
    imageAlt: { th: "มือช่างฝีมือกำลังประกอบกระเป๋า", en: "An artisan's hands shaping a bag" },
    heading: {
      th: "จากความตั้งใจ\nสู่ทุกขั้นตอนที่ประณีต",
      en: "From intention\nto every considered step",
    },
    body: {
      th: "ใส่ใจในทุกรายละเอียด คัดสรรวัสดุคุณภาพ และสร้างสรรค์อย่างพิถีพิถันเพื่อให้แต่ละชิ้นมีความหมาย",
      en: "Attentive to every detail, chosen materials, made with care — so each piece carries meaning.",
    },
    // The horizontal process line. Each step reveals as the line draws left → right.
    steps: [
      { label: { th: "SELECT\nMATERIALS", en: "SELECT\nMATERIALS" } },
      { label: { th: "HANDCRAFTED\nWITH CARE", en: "HANDCRAFTED\nWITH CARE" } },
      { label: { th: "TIME &\nPRECISION", en: "TIME &\nPRECISION" } },
      { label: { th: "SHAPED\nWITH PURPOSE", en: "SHAPED\nWITH PURPOSE" } },
      { label: { th: "FINISHED\nBEAUTIFULLY", en: "FINISHED\nBEAUTIFULLY" } },
    ],
  },

  collection: {
    image: "/images/journey/collection.webp", // luxury editorial product photography
    imageAlt: { th: "กระเป๋า SARNSARENE คอลเลกชันแรก", en: "The first SARNSARENE collection" },
    heading: {
      th: "คอลเลกชันแรก\nที่เกิดจากความตั้งใจทั้งหมด",
      en: "The first collection,\nborn of every intention",
    },
    body: {
      th: "ทุกชิ้นคือผลลัพธ์ของการเดินทาง ที่ผสานความประณีตเข้ากับความหมาย",
      en: "Each piece is the result of the journey — craft woven together with meaning.",
    },
    // Colour chips shown under the copy.
    palette: [
      { label: { th: "Ivory", en: "Ivory" }, swatch: "#EFE7D8" },
      { label: { th: "Sand", en: "Sand" }, swatch: "#D8C6A9" },
      { label: { th: "Warm Beige", en: "Warm Beige" }, swatch: "#C2A882" },
      { label: { th: "Brown", en: "Brown" }, swatch: "#6E5844" },
    ],
    cta: { label: { th: "EXPLORE COLLECTION", en: "EXPLORE COLLECTION" }, href: "/shop" },
  },

  continues: {
    heading: {
      th: "เราเชื่อว่าการเดินทางนี้\nจะยังคงพาเราและคุณไปสู่ความสงบ...\nด้วยกัน",
      en: "We believe this journey\nwill keep leading us, and you,\ntoward serenity — together",
    },
    wordmark: "SARNSARENE",
    tagline: { th: "A QUIETER WAY OF LIVING", en: "A QUIETER WAY OF LIVING" },
    cta: { label: { th: "CONTINUE EXPLORING", en: "CONTINUE EXPLORING" }, href: "/" },
  },
} as const;

// ---- Motion tuning ---------------------------------------------------
// One place to slow the whole page down or speed it up. Durations are
// in seconds; EASE is a cubic-bezier (ease-out, cinematic).
export const journeyMotion = {
  EASE: [0.22, 1, 0.36, 1] as const,
  reveal: 1.1, // text / image reveal
  transition: 1.4, // between-chapter feel
  heroSettle: 1.6,
};
