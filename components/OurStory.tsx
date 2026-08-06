"use client";

import Image from "next/image";
import { ourStory } from "@/lib/content";
import { en } from "@/lib/translations";
import { useLanguage } from "@/components/LanguageContext";
import { Reveal } from "@/components/Reveal";

export default function OurStory() {
  const { lang } = useLanguage();
  const bannerSubtitle = lang === "en" ? en.ourStory.bannerSubtitle : ourStory.bannerSubtitle;
  const paragraphs = lang === "en" ? en.ourStory.paragraphs : ourStory.paragraphs;

  return (
    <section id="story" className="bg-bg">
      <div className="relative min-h-[320px] md:min-h-[420px] flex items-center overflow-hidden">
        <Image
          src={ourStory.bannerImage}
          alt=""
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-bg/70" />

        <Reveal className="relative z-10 text-center max-w-2xl mx-auto px-6 md:px-10 py-16">
          <p className="eyebrow mb-4">{ourStory.eyebrow}</p>
          <h2 className="font-serif font-normal uppercase tracking-[0.06em] text-[28px] md:text-[36px] leading-snug text-text-light mb-5">
            {ourStory.title}
          </h2>
          <p className="text-text-muted text-[14px] md:text-[15px] leading-relaxed font-light max-w-lg mx-auto">
            {bannerSubtitle}
          </p>
        </Reveal>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2">
        <Reveal className="bg-white px-6 md:px-16 py-16 md:py-24 flex flex-col justify-center order-2 md:order-1">
          <h3 className="font-serif text-xl md:text-2xl text-[#2B2B2B] mb-6">{ourStory.rootHeading}</h3>
          <div className="space-y-5 max-w-md">
            {paragraphs.map((p, i) => (
              <p key={i} className="text-[#2B2B2B]/70 text-[14px] leading-[1.9] font-light">
                {p}
              </p>
            ))}
          </div>
        </Reveal>

        <div className="relative min-h-[360px] md:min-h-[600px] order-1 md:order-2">
          <Image
            src={ourStory.image}
            alt="SARNSARENE brand origins"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
