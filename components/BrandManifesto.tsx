"use client";

import { brandManifesto } from "@/lib/content";
import { en } from "@/lib/translations";
import { useLanguage } from "@/components/LanguageContext";
import { Reveal, ChapterMark } from "@/components/Reveal";

export default function BrandManifesto() {
  const { lang } = useLanguage();
  const title = lang === "en" ? en.brandManifesto.title : brandManifesto.title;
  const paragraphs =
    lang === "en" ? en.brandManifesto.paragraphs : brandManifesto.paragraphs;

  return (
    <section
      id="manifesto"
      data-scroll-section
      data-mood="ivory"
      data-rail="04"
      className="py-28 md:py-48"
    >
      <div className="max-w-content mx-auto px-6 md:px-10">
        <div className="grid md:grid-cols-[auto_1fr] gap-y-12 md:gap-x-20">
          <Reveal className="md:pt-2">
            <ChapterMark index={4} total={4} />
          </Reveal>

          <div className="grid md:grid-cols-[0.95fr_1.05fr] gap-y-12 md:gap-x-20">
            <Reveal blur>
              <p className="eyebrow mb-6">{brandManifesto.eyebrow}</p>
              <h2 className="display text-[clamp(2rem,4.6vw,3.4rem)] text-text-light md:sticky md:top-32">
                {title}
              </h2>
            </Reveal>

            <div className="space-y-10 md:pt-2">
              {paragraphs.map((p, i) => (
                <Reveal key={i} blur delay={i * 0.1}>
                  <p className="body-copy text-[15px] md:text-[16px] max-w-2xl">
                    {p}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
