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

// ------------------------------------------------------------
// Quiet Luxury palette — linen + paper + natural fibre + stone.
//   Warm Ivory   #F5F2EB   primary ground
//   Soft Sand    #E8E1D5   secondary ground
//   Natural Beige#D4C7B5   tactile mid-tone
//   Deep Charcoal#1F1E1B   primary ink
//   Muted Taupe  #756D63   secondary ink (handled via text-muted token)
//   Bronze       #8C7A5E   restrained accent — never metallic gold
// The one dark beat in the page (hero backdrop + the pinned
// quote) inverts to charcoal ground / ivory ink.
// ------------------------------------------------------------
export const theme = {
  colors: {
    bg: "#F5F2EB",
    bgSecondary: "#E8E1D5",
    beige: "#D4C7B5",
    gold: "#8C7A5E",
    textLight: "#1F1E1B",
  },
  sections: {
    nav: { bg: "#F5F2EB", textLight: "#1F1E1B", gold: "#8C7A5E" },
    announcement: { bg: "#1F1E1B", textLight: "#F5F2EB", gold: "#C9BAA3" },
    hero: { bg: "#1F1E1B", textLight: "#F5F2EB", gold: "#C9BAA3" },
    philosophy: { bg: "#F5F2EB", textLight: "#1F1E1B", gold: "#8C7A5E" },
    ourStory: { bg: "#EFEBE1", textLight: "#1F1E1B", gold: "#8C7A5E" },
    eastern: { bg: "#F5F2EB", textLight: "#1F1E1B", gold: "#8C7A5E" },
    signature: { bg: "#EFEBE1", textLight: "#1F1E1B", gold: "#8C7A5E" },
    quote: { bg: "#1F1E1B", textLight: "#F5F2EB", gold: "#C9BAA3" },
    manifesto: { bg: "#F5F2EB", textLight: "#1F1E1B", gold: "#8C7A5E" },
    collection: { bg: "#EFEBE1", textLight: "#1F1E1B", gold: "#8C7A5E" },
    journey: { bg: "#F5F2EB", textLight: "#1F1E1B", gold: "#8C7A5E" },
    services: { bg: "#F5F2EB", textLight: "#1F1E1B", gold: "#8C7A5E" },
    sustainability: { bg: "#EFEBE1", textLight: "#1F1E1B", gold: "#8C7A5E" },
    newsletter: { bg: "#E8E1D5", textLight: "#1F1E1B", gold: "#8C7A5E" },
    footer: { bg: "#E8E1D5", textLight: "#1F1E1B", gold: "#8C7A5E" },
  } as Record<SectionKey, SectionOverride>,
  heroOverlayOpacity: 0.28,
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
