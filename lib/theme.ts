// ============================================================
// SARNSARENE — single source of truth for the site's color
// tokens and a few global visual knobs (overlay darkness,
// image brightness). Edited from /admin, read by layout.tsx
// (which turns it into CSS variables) and tailwind.config.ts
// (which points every color utility at those variables).
//
// Every section always has its own bg / heading+body ink /
// accent color — see `sections`. There is no on/off switch:
// each section simply renders whatever three colors are set
// here, so picking a color in /admin always has a visible
// effect, for every section, every time.
// ============================================================

export const SECTION_KEYS = [
  "nav",
  "announcement",
  "hero",
  "philosophy",
  "ourStory",
  "eastern",
  "signature",
  "quote",
  "manifesto",
  "collection",
  "journey",
  "services",
  "sustainability",
  "newsletter",
  "footer",
] as const;

export type SectionKey = (typeof SECTION_KEYS)[number];

export type SectionOverride = {
  bg: string;
  textLight: string;
  gold: string;
};

export const theme = {
  colors: {
    bg: "#2B2B2B",
    bgSecondary: "#343434",
    beige: "#BC9A7A",
    gold: "#CDA364",
    textLight: "#FEF5E1",
  },
  sections: {
    nav: { bg: "#ffffff", textLight: "#2B2B2B", gold: "#f9f8f5" },
    announcement: { bg: "#ffffff", textLight: "#2B2B2B", gold: "#ffffff" },
    hero: { bg: "#2B2B2B", textLight: "#FEF5E1", gold: "#CDA364" },
    philosophy: { bg: "#fcfcfc", textLight: "#2B2B2B", gold: "#fafafa" },
    ourStory: { bg: "#2e2e2e", textLight: "#FEF5E1", gold: "#CDA364" },
    eastern: { bg: "#ffffff", textLight: "#000000", gold: "#CDA364" },
    signature: { bg: "#ffffff", textLight: "#000000", gold: "#CDA364" },
    quote: { bg: "#ffffff", textLight: "#2B2B2B", gold: "#CDA364" },
    manifesto: { bg: "#ffffff", textLight: "#000000", gold: "#CDA364" },
    collection: { bg: "#ffffff", textLight: "#000000", gold: "#CDA364" },
    journey: { bg: "#ffffff", textLight: "#000000", gold: "#CDA364" },
    services: { bg: "#ffffff", textLight: "#2B2B2B", gold: "#CDA364" },
    sustainability: { bg: "#ffffff", textLight: "#000000", gold: "#CDA364" },
    newsletter: { bg: "#ffffff", textLight: "#2B2B2B", gold: "#CDA364" },
    footer: { bg: "#ffffff", textLight: "#000000", gold: "#CDA364" },
  } as Record<SectionKey, SectionOverride>,
  heroOverlayOpacity: 0.3,
  journeyOverlayOpacity: 0.8,
  imageBrightness: 1,
};

export type Theme = typeof theme;

export function hexToRgbTriplet(hex: string): string {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `${r} ${g} ${b}`;
}
