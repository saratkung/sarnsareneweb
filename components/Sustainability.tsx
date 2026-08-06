"use client";

import Image from "next/image";
import { sustainability } from "@/lib/content";
import { en } from "@/lib/translations";
import { useLanguage } from "@/components/LanguageContext";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/Reveal";

export default function Sustainability() {
  const { lang } = useLanguage();
  const description = lang === "en" ? en.sustainability.description : sustainability.description;

  return (
    <section className="bg-bg py-24 md:py-32">
      <div className="max-w-content mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-14 md:gap-20 items-center">
        <Reveal>
          <p className="eyebrow mb-4">{sustainability.eyebrow}</p>
          <h2 className="font-serif font-normal text-[28px] md:text-[32px] leading-snug text-text-light mb-6">
            {sustainability.title}
          </h2>
          <p className="text-text-muted text-[14px] leading-[1.9] font-light max-w-md mb-10">
            {description}
          </p>

          <StaggerGroup className="grid grid-cols-2 gap-y-5 gap-x-6 mb-10 max-w-md">
            {sustainability.bullets.map((bullet) => (
              <StaggerItem
                key={bullet}
                className="flex items-center gap-3 text-[12.5px] text-text-light"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                {bullet}
              </StaggerItem>
            ))}
          </StaggerGroup>

          <a
            href={sustainability.cta.href}
            className="inline-flex items-center px-6 py-2.5 text-[11px] tracking-widest2 uppercase text-text-muted border border-gold rounded-full hover:bg-gold hover:text-[#2B2B2B] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20 transition-all duration-300"
          >
            {sustainability.cta.label}
          </a>
        </Reveal>

        <Reveal delay={0.15} className="relative aspect-[4/5] overflow-hidden rounded-xl shadow-2xl shadow-black/30">
          <Image
            src={sustainability.image}
            alt="SARNSARENE — woven with care"
            fill
            className="object-cover"
          />
        </Reveal>
      </div>
    </section>
  );
}
