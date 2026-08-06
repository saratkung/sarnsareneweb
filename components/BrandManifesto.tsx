"use client";

import { brandManifesto } from "@/lib/content";
import { en } from "@/lib/translations";
import { useLanguage } from "@/components/LanguageContext";
import { Reveal } from "@/components/Reveal";

export default function BrandManifesto() {
  const { lang } = useLanguage();
  const title = lang === "en" ? en.brandManifesto.title : brandManifesto.title;
  const paragraphs = lang === "en" ? en.brandManifesto.paragraphs : brandManifesto.paragraphs;

  return (
    <section className="bg-bg py-24 md:py-32">
      <div className="max-w-content mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-[1fr,1.4fr] gap-12 md:gap-20">
          <Reveal>
            <p className="eyebrow mb-4">{brandManifesto.eyebrow}</p>
            <h2 className="font-serif font-normal text-[28px] md:text-[34px] leading-snug text-text-light md:sticky md:top-32">
              {title}
            </h2>
          </Reveal>
          <div className="space-y-8">
            {paragraphs.map((p, i) => (
              <Reveal key={i} delay={i * 0.12}>
                <p className="text-text-muted text-[15px] md:text-[16px] leading-[1.9] font-light max-w-2xl">
                  {p}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
