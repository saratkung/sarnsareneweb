"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { brand, nav } from "@/lib/content";
import { th } from "@/lib/translations";
import { useLanguage } from "@/components/LanguageContext";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { lang, toggleLang } = useLanguage();
  const contactUs = lang === "th" ? th.nav.contactUs : "Contact Us";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 64);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Over the hero the bar is glass over charcoal → ivory ink is wrong.
  const solid = scrolled || menuOpen;
  const ink = solid ? "text-text-light" : "text-[#F5F2EB]";
  const inkSoft = solid ? "text-text-light/65" : "text-[#F5F2EB]/70";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-700 ${
        solid
          ? "bg-bg/90 backdrop-blur-md border-b border-text-light/10"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav
        className={`max-w-content mx-auto px-6 md:px-10 grid grid-cols-[1fr_auto_1fr] items-center transition-[height] duration-500 ${
          solid ? "h-16 md:h-[68px]" : "h-20 md:h-24"
        }`}
      >
        <a
          href="#contact"
          className={`justify-self-start hidden sm:block text-[10px] tracking-widest2 uppercase link-underline ${inkSoft} transition-colors duration-300`}
        >
          {contactUs}
        </a>

        <a
          href="#"
          className={`justify-self-center col-start-2 font-serif font-light uppercase leading-none transition-all duration-500 ${ink} ${
            solid
              ? "text-[13px] tracking-[0.18em] md:text-base md:tracking-[0.32em]"
              : "text-[14px] tracking-[0.2em] md:text-xl md:tracking-[0.42em]"
          }`}
        >
          {brand.name}
        </a>

        <div className="justify-self-end col-start-3 relative flex items-center gap-3.5 md:gap-5">
          <button
            type="button"
            onClick={toggleLang}
            aria-label="Switch language"
            className={`flex items-center text-[10px] tracking-widest2 font-sans transition-colors duration-300 ${inkSoft}`}
          >
            <span className={lang === "en" ? ink : ""}>EN</span>
            <span className="mx-1 opacity-40">/</span>
            <span className={lang === "th" ? ink : ""}>TH</span>
          </button>

          <button
            type="button"
            aria-label={menuOpen ? "ปิดเมนู" : "เปิดเมนู"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="flex flex-col items-end gap-[6px] p-2 -mr-2"
          >
            <span
              className={`h-px transition-all duration-300 ${
                solid ? "bg-text-light" : "bg-[#F5F2EB]"
              } ${menuOpen ? "w-5 translate-y-[3.5px] rotate-45" : "w-6"}`}
            />
            <span
              className={`h-px transition-all duration-300 ${
                solid ? "bg-text-light" : "bg-[#F5F2EB]"
              } ${menuOpen ? "w-5 -translate-y-[3.5px] -rotate-45" : "w-4"}`}
            />
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="absolute right-0 top-[calc(100%+20px)] min-w-[240px] bg-bg border border-text-light/10 shadow-[0_24px_60px_-20px_rgba(31,30,27,0.25)] py-3"
              >
                <ul className="flex flex-col">
                  {nav.links.map((link, i) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        className="block px-6 py-3 text-[11px] tracking-widest2 uppercase text-text-light/60 hover:text-text-light hover:bg-text-light/[0.04] transition-colors duration-300"
                      >
                        {lang === "th" ? th.nav.links[i] ?? link.label : link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
    </header>
  );
}
