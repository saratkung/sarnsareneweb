"use client";

import { brand, footer } from "@/lib/content";
import { en } from "@/lib/translations";
import { useLanguage } from "@/components/LanguageContext";
import { Reveal } from "@/components/Reveal";

const socialMonograms: Record<string, string> = {
  Instagram: "IG",
  Facebook: "FB",
  Pinterest: "P",
  TikTok: "TT",
};

const socialLinks: Record<string, string> = {
  Instagram: "https://www.instagram.com/sarnsarene.official/",
  Facebook: "https://www.facebook.com/profile.php?id=61592800792558",
};

export default function Footer() {
  const { lang } = useLanguage();
  const tagline = lang === "en" ? en.footer.tagline : footer.tagline;
  const followColumn = footer.columns.find((c) => c.title === "Follow Us");
  const otherColumns = footer.columns.filter((c) => c.title !== "Follow Us");

  return (
    <footer id="contact" className="bg-bg pt-28 md:pt-40 pb-12">
      <div className="max-w-content mx-auto px-6 md:px-10">
        <Reveal className="text-center mb-20 md:mb-28">
          <p className="display text-[clamp(2rem,7vw,4.5rem)] tracking-[0.22em] uppercase text-text-light">
            {brand.name}
          </p>
          <p className="mt-6 body-copy text-[12px] whitespace-pre-line">
            {tagline}
          </p>
        </Reveal>

        <div className="hairline mb-14" />

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-12 mb-20">
          {otherColumns.map((col) => (
            <div key={col.title}>
              <h4 className="caption mb-6">{col.title}</h4>
              <ul className="space-y-3">
                {col.items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-[12px] text-text-light/60 hover:text-text-light transition-colors duration-300 link-underline"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {followColumn && (
            <div>
              <h4 className="caption mb-6">{followColumn.title}</h4>
              <ul className="flex flex-wrap gap-3">
                {followColumn.items.map((item) => (
                  <li key={item}>
                    <a
                      href={socialLinks[item] ?? "#"}
                      target={socialLinks[item] ? "_blank" : undefined}
                      rel={socialLinks[item] ? "noopener noreferrer" : undefined}
                      aria-label={item}
                      title={item}
                      className="flex items-center justify-center w-9 h-9 rounded-full border border-text-light/15 text-[9px] tracking-wide text-text-light/60 hover:border-gold hover:text-gold transition-colors duration-300"
                    >
                      {socialMonograms[item] ?? item.slice(0, 2).toUpperCase()}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="hairline mb-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] tracking-[0.2em] uppercase text-text-light/45">
          <span>{footer.copyright}</span>
          <span>{footer.legal}</span>
        </div>
      </div>
    </footer>
  );
}
