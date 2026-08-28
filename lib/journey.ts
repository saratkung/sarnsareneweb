// ============================================================
// SARNSARENE — "The Journey" page.
//
// All EDITABLE content — every word, image path, chapter colour —
// lives in `lib/journey.content.json` and is edited from the admin
// UI at /admin/journey (dev only; commit + redeploy to publish) or
// by hand in that file.
//
// This file is the typed loader + the bits that are NOT content:
//   • section `id` / `index` / `layout` — structural, drives code
//   • journeyMotion                     — animation timing / easing
//
//   { th, en }  — Thai shows by default; English on the EN toggle.
//   body text   — split paragraphs with a blank line.
//   image       — files in /public; replace the file at the same
//                 path (keep the aspect ratio) to swap a photo.
// ============================================================

import raw from "./journey.content.json";

type Bilingual = { th: string; en: string };

export type JourneySection = {
  id: string;
  index: string; // "01" … "04"
  layout: "split" | "full-bleed";
  kicker: Bilingual;
  bg: string; // section background
  ink: string; // text colour
  accent: string; // hairline / number / underline
};

type Chapter = {
  image: string;
  imageAlt: Bilingual;
  heading: Bilingual;
  body: Bilingual;
};

export type JourneyContent = {
  listening: Chapter;
  source: Chapter;
  voice: Chapter;
  firstpiece: Chapter;
};

export const journeyMeta = raw.meta as {
  title: string;
  description: string;
  brand: string;
  sideLabel: string;
  backLabel: Bilingual;
  backHref: string;
};

export const journeyHero = raw.hero as {
  image: string;
  lineTop: string;
  lineMid: string;
  lineBottom: string;
  scrollCue: Bilingual;
};

export const journeyMenu = raw.menu as {
  label: Bilingual;
  siteLinks: { label: Bilingual; href: string }[];
};

export const journeyIntro = raw.intro as {
  bg: string;
  ink: string;
  accent: string;
  body: Bilingual;
};

export const journeySections = raw.sections as JourneySection[];

export const journeyContent = raw.content as unknown as JourneyContent;

export const journeyClosing = raw.closing as {
  bg: string;
  ink: string;
  accent: string;
  lines: Bilingual;
  body: Bilingual;
  wordmark: string;
  tagline: Bilingual;
  cta: { label: Bilingual; href: string };
};

// ---- Motion tuning (not content) -----------------------------------
// One place to slow the whole page down or speed it up. Durations in
// seconds; EASE is an ease-out cubic-bezier (cinematic).
export const journeyMotion = {
  EASE: [0.22, 1, 0.36, 1] as const,
  reveal: 1.1,
  transition: 1.4,
  heroSettle: 1.6,
};
