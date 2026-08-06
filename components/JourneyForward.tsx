"use client";

import Image from "next/image";
import { journeyForward } from "@/lib/content";
import { en } from "@/lib/translations";
import { useLanguage } from "@/components/LanguageContext";
import { Reveal } from "@/components/Reveal";

export default function JourneyForward() {
  const { lang } = useLanguage();
  const description = lang === "en" ? en.journeyForward.description : journeyForward.description;

  return (
    <section className="relative py-40 md:py-56 overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={journeyForward.image}
          alt={journeyForward.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-bg" style={{ opacity: "var(--journey-overlay-opacity)" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-bg/60" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-6 md:px-10 text-center">
        <Reveal className="mb-5">
          <p className="eyebrow">{journeyForward.eyebrow}</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="font-serif font-light uppercase tracking-[0.04em] text-text-light text-[clamp(1.8rem,4.4vw,3rem)] leading-tight mb-8">
            {journeyForward.title}
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="text-text-muted text-[15px] leading-[1.9] font-light">
            {description}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
