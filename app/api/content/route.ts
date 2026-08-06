import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import * as content from "@/lib/content";

function j(v: unknown) {
  return JSON.stringify(String(v ?? ""));
}

function generateContentTs(d: any) {
  return `// ============================================================
// SARNSARENE — single source of truth for all landing page copy
// and image paths. Edit values here; every section reads from
// this file, so there is only ever one place to change text
// or swap an image.
// ============================================================

export const brand = {
  name: ${j(d.brand.name)},
  legalName: ${j(d.brand.legalName)},
};

export const announcement = {
  message: ${j(d.announcement.message)},
};

export const nav = {
  links: [
    { label: ${j(d.nav.links[0].label)}, href: ${j(d.nav.links[0].href)} },
    { label: ${j(d.nav.links[1].label)}, href: ${j(d.nav.links[1].href)} },
  ],
};

export const hero = {
  eyebrow: ${j(d.hero.eyebrow)},
  title: ${j(d.hero.title)},
  subtitle: ${j(d.hero.subtitle)},
  ctaPrimary: { label: ${j(d.hero.ctaPrimary.label)}, href: ${j(d.hero.ctaPrimary.href)} },
  ctaSecondary: { label: ${j(d.hero.ctaSecondary.label)}, href: ${j(d.hero.ctaSecondary.href)} },
  image: ${j(d.hero.image)},
};

export const philosophy = {
  eyebrow: ${j(d.philosophy.eyebrow)},
  title: ${j(d.philosophy.title)},
  items: [
    { icon: "weave" as const, title: ${j(d.philosophy.items[0].title)}, description: ${j(d.philosophy.items[0].description)} },
    { icon: "drop" as const, title: ${j(d.philosophy.items[1].title)}, description: ${j(d.philosophy.items[1].description)} },
  ],
};

export const ourStory = {
  eyebrow: ${j(d.ourStory.eyebrow)},
  title: ${j(d.ourStory.title)},
  rootHeading: ${j(d.ourStory.rootHeading)},
  bannerSubtitle: ${j(d.ourStory.bannerSubtitle)},
  paragraphs: [
    ${j(d.ourStory.paragraphs[0])},
    ${j(d.ourStory.paragraphs[1])},
    ${j(d.ourStory.paragraphs[2])},
  ],
  image: ${j(d.ourStory.image)},
  bannerImage: ${j(d.ourStory.bannerImage)},
};

export const easternInspiration = {
  eyebrow: ${j(d.easternInspiration.eyebrow)},
  title: ${j(d.easternInspiration.title)},
  sections: [
    { title: ${j(d.easternInspiration.sections[0].title)}, description: ${j(d.easternInspiration.sections[0].description)}, image: ${j(d.easternInspiration.sections[0].image)}, reverse: false },
    { title: ${j(d.easternInspiration.sections[1].title)}, description: ${j(d.easternInspiration.sections[1].description)}, image: ${j(d.easternInspiration.sections[1].image)}, reverse: true },
  ],
};

export const signatureExperience = {
  eyebrow: ${j(d.signatureExperience.eyebrow)},
  title: ${j(d.signatureExperience.title)},
  cards: [
    { title: ${j(d.signatureExperience.cards[0].title)}, description: ${j(d.signatureExperience.cards[0].description)} },
    { title: ${j(d.signatureExperience.cards[1].title)}, description: ${j(d.signatureExperience.cards[1].description)} },
    { title: ${j(d.signatureExperience.cards[2].title)}, description: ${j(d.signatureExperience.cards[2].description)} },
  ],
};

export const highlightQuote = {
  quote: ${j(d.highlightQuote.quote)},
  attribution: ${j(d.highlightQuote.attribution)},
};

export const brandManifesto = {
  eyebrow: ${j(d.brandManifesto.eyebrow)},
  title: ${j(d.brandManifesto.title)},
  paragraphs: [
    ${j(d.brandManifesto.paragraphs[0])},
    ${j(d.brandManifesto.paragraphs[1])},
    ${j(d.brandManifesto.paragraphs[2])},
  ],
};

export const featuredCollection = {
  eyebrow: ${j(d.featuredCollection.eyebrow)},
  title: ${j(d.featuredCollection.title)},
  viewAll: ${j(d.featuredCollection.viewAll)},
  products: [
    { name: ${j(d.featuredCollection.products[0].name)}, description: ${j(d.featuredCollection.products[0].description)}, detail: ${j(d.featuredCollection.products[0].detail)}, image: ${j(d.featuredCollection.products[0].image)} },
    { name: ${j(d.featuredCollection.products[1].name)}, description: ${j(d.featuredCollection.products[1].description)}, detail: ${j(d.featuredCollection.products[1].detail)}, image: ${j(d.featuredCollection.products[1].image)} },
    { name: ${j(d.featuredCollection.products[2].name)}, description: ${j(d.featuredCollection.products[2].description)}, detail: ${j(d.featuredCollection.products[2].detail)}, image: ${j(d.featuredCollection.products[2].image)} },
    { name: ${j(d.featuredCollection.products[3].name)}, description: ${j(d.featuredCollection.products[3].description)}, detail: ${j(d.featuredCollection.products[3].detail)}, image: ${j(d.featuredCollection.products[3].image)} },
    { name: ${j(d.featuredCollection.products[4].name)}, description: ${j(d.featuredCollection.products[4].description)}, detail: ${j(d.featuredCollection.products[4].detail)}, image: ${j(d.featuredCollection.products[4].image)} },
  ],
};

export const journeyForward = {
  eyebrow: ${j(d.journeyForward.eyebrow)},
  title: ${j(d.journeyForward.title)},
  description: ${j(d.journeyForward.description)},
  image: ${j(d.journeyForward.image)},
};

export const complimentaryServices = {
  items: [
    { icon: "box" as const, label: ${j(d.complimentaryServices.items[0].label)} },
    { icon: "gift" as const, label: ${j(d.complimentaryServices.items[1].label)} },
    { icon: "chat" as const, label: ${j(d.complimentaryServices.items[2].label)} },
    { icon: "globe" as const, label: ${j(d.complimentaryServices.items[3].label)} },
  ],
};

export const sustainability = {
  eyebrow: ${j(d.sustainability.eyebrow)},
  title: ${j(d.sustainability.title)},
  description: ${j(d.sustainability.description)},
  bullets: [${j(d.sustainability.bullets[0])}, ${j(d.sustainability.bullets[1])}, ${j(d.sustainability.bullets[2])}, ${j(d.sustainability.bullets[3])}],
  cta: { label: ${j(d.sustainability.cta.label)}, href: ${j(d.sustainability.cta.href)} },
  image: ${j(d.sustainability.image)},
};

export const newsletter = {
  title: ${j(d.newsletter.title)},
  subtitle: ${j(d.newsletter.subtitle)},
  placeholder: ${j(d.newsletter.placeholder)},
  button: ${j(d.newsletter.button)},
};

export const footer = {
  tagline: ${j(d.footer.tagline)},
  columns: [
    { title: ${j(d.footer.columns[0].title)}, items: [${j(d.footer.columns[0].items[0])}, ${j(d.footer.columns[0].items[1])}, ${j(d.footer.columns[0].items[2])}, ${j(d.footer.columns[0].items[3])}] },
  ],
  copyright: ${j(d.footer.copyright)},
  legal: ${j(d.footer.legal)},
};
`;
}

export async function GET() {
  return NextResponse.json(content);
}

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Admin editing is disabled in production." }, { status: 403 });
  }

  const data = await req.json();
  const code = generateContentTs(data);
  const dest = path.join(process.cwd(), "lib", "content.ts");
  await writeFile(dest, code, "utf8");

  return NextResponse.json({ ok: true });
}
