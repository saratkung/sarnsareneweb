import type { Metadata } from "next";
import { journeyMeta, journeyHero } from "@/lib/journey";
import { JourneyExperience } from "@/components/journey/JourneyExperience";

export const metadata: Metadata = {
  title: journeyMeta.title,
  description: journeyMeta.description,
  openGraph: {
    title: journeyMeta.title,
    description: journeyMeta.description,
    images: [journeyHero.image],
  },
};

// "The Journey" — a standalone, full-bleed brand film. It deliberately
// does NOT use the site-wide <Nav>/<Footer>; its own chrome lives in
// components/journey/JourneyChrome.tsx. Everything editable (copy,
// images, colours, motion) is in lib/journey.ts.
export default function JourneyPage() {
  return <JourneyExperience />;
}
