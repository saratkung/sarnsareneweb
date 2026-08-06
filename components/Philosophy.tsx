"use client";

import { philosophy } from "@/lib/content";
import { en } from "@/lib/translations";
import { useLanguage } from "@/components/LanguageContext";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/Reveal";

function Diamond({ className = "" }: { className?: string }) {
  return <span className={`block w-1.5 h-1.5 rotate-45 border border-text-light/50 ${className}`} />;
}

export default function Philosophy() {
  const { lang } = useLanguage();

  return (
    <section id="philosophy" className="bg-bg py-24 md:py-32">
      <div className="max-w-content mx-auto px-6 md:px-10">
        <Reveal className="flex flex-col items-center text-center max-w-xl mx-auto mb-16 md:mb-20">
          <p className="eyebrow mb-4">{philosophy.eyebrow}</p>
          <h2 className="font-serif font-normal text-[28px] md:text-[32px] leading-snug text-text-light mb-6">
            {philosophy.title}
          </h2>
          <Diamond />
        </Reveal>

        <StaggerGroup className="relative grid grid-cols-1 sm:grid-cols-2 gap-14 max-w-3xl mx-auto">
          <span className="hidden sm:flex absolute inset-y-0 left-1/2 -translate-x-1/2 w-px flex-col items-center">
            <span className="flex-1 w-px bg-text-light/20" />
            <Diamond className="my-1 shrink-0" />
            <span className="flex-1 w-px bg-text-light/20" />
          </span>

          {philosophy.items.map((item, i) => (
            <StaggerItem
              key={item.title}
              className="flex flex-col items-center text-center gap-4 px-2"
            >
              <h3 className="font-serif text-2xl tracking-[0.2em] text-text-light">
                {item.title}
              </h3>
              <Diamond />
              <p className="text-text-muted text-[14px] leading-relaxed font-light max-w-xs">
                {lang === "en" ? en.philosophy.items[i]?.description ?? item.description : item.description}
              </p>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
