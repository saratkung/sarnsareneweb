"use client";

import Image from "next/image";
import { easternInspiration } from "@/lib/content";
import { en } from "@/lib/translations";
import { useLanguage } from "@/components/LanguageContext";
import { Reveal } from "@/components/Reveal";

export default function EasternInspiration() {
  const { lang } = useLanguage();

  return (
    <section className="bg-bg py-24 md:py-32">
      <div className="max-w-content mx-auto px-6 md:px-10">
        <Reveal className="text-center max-w-xl mx-auto mb-16 md:mb-20">
          <p className="eyebrow mb-4">{easternInspiration.eyebrow}</p>
          <h2 className="font-serif font-normal text-[28px] md:text-[32px] leading-snug text-text-light">
            {easternInspiration.title}
          </h2>
        </Reveal>

        <div className="flex flex-col gap-20 md:gap-28">
          {easternInspiration.sections.map((sec, i) => (
            <div
              key={sec.title}
              className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center"
            >
              <Reveal
                className={`relative aspect-[4/3] overflow-hidden ${
                  sec.reverse ? "md:order-2" : "md:order-1"
                }`}
              >
                <Image
                  src={sec.image}
                  alt={sec.title}
                  fill
                  className="object-cover"
                />
              </Reveal>
              <Reveal
                delay={0.15}
                className={sec.reverse ? "md:order-1" : "md:order-2"}
              >
                <h3 className="font-serif font-normal text-2xl text-text-light mb-5">
                  {sec.title}
                </h3>
                <p className="text-text-muted text-[14px] leading-[1.9] font-light max-w-md">
                  {lang === "en" ? en.easternInspiration.sections[i]?.description ?? sec.description : sec.description}
                </p>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
