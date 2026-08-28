"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { brand, nav } from "@/lib/content";
import { th } from "@/lib/translations";
import { useLanguage } from "@/components/LanguageContext";

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { lang, toggleLang } = useLanguage();
  const contactUs = lang === "th" ? th.nav.contactUs : "Contact Us";
  // NOTE: the /shop nav link is temporarily hidden — restore the <Link href="/shop">
  // in the left cluster and the hamburger menu when the storefront goes public.

  return (
    <header className="sticky top-0 z-50 w-full bg-bg border-b border-text-light/8 transition-colors duration-500">
      <nav className="max-w-content mx-auto px-6 md:px-10 h-16 md:h-[72px] grid grid-cols-[1fr_auto_1fr] items-center">
        <a
          href="#contact"
          className="justify-self-start text-[10px] tracking-widest2 uppercase text-text-light/75 hover:text-text-light transition-colors duration-300"
        >
          {contactUs}
        </a>
        <a
          href="#"
          className="justify-self-center font-serif text-lg tracking-[0.3em] uppercase text-text-light"
        >
          {brand.name}
        </a>

        <div className="justify-self-end relative flex items-center gap-4">
          <button
            type="button"
            onClick={toggleLang}
            aria-label="Switch language"
            className="flex items-center text-[10px] tracking-widest2 font-sans text-text-light/75 hover:text-text-light transition-colors duration-300"
          >
            <span className={lang === "en" ? "text-text-light" : ""}>EN</span>
            <span className="mx-1 text-text-light/40">/</span>
            <span className={lang === "th" ? "text-text-light" : ""}>TH</span>
          </button>

          <button
            type="button"
            aria-label={menuOpen ? "ปิดเมนู" : "เปิดเมนู"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="flex flex-col items-end gap-[5px] p-2 -mr-2"
          >
            <span
              className={`h-px bg-text-light transition-all duration-300 ${
                menuOpen ? "w-5 translate-y-[3px] rotate-45" : "w-6"
              }`}
            />
            <span
              className={`h-px bg-text-light transition-all duration-300 ${
                menuOpen ? "w-5 -translate-y-[3px] -rotate-45" : "w-4"
              }`}
            />
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="absolute right-0 top-[calc(100%+16px)] min-w-[200px] bg-bg border border-beige/15 rounded-lg shadow-xl py-2"
              >
                <ul className="flex flex-col">
                  {nav.links.map((link, i) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        className="block px-5 py-2.5 text-[11px] tracking-widest2 uppercase text-text-muted hover:text-gold hover:bg-text-light/5 transition-colors duration-200"
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
