"use client";

// ============================================================
// SARNSARENE — /journey fixed chrome.
// Top bar (wordmark + language + MENU), the rotated edge label,
// the right-hand vertical progress navigation, and the overlay
// menu. All of it is position:fixed and sits above the chapters.
//
// `ink` is the text colour of the chapter currently in view — the
// whole chrome cross-fades to it as you scroll.
// ============================================================

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  journeyMeta,
  journeyMenu,
  journeySections,
  journeyMotion,
} from "@/lib/journey";
import { useLanguage } from "@/components/LanguageContext";
import { useJourneyText } from "@/components/journey/primitives";

const { EASE } = journeyMotion;

/** True once the pointer / scroll / keyboard has been quiet for `ms`. */
function useIdle(ms = 2600) {
  const [idle, setIdle] = useState(false);
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const wake = () => {
      setIdle(false);
      clearTimeout(t);
      t = setTimeout(() => setIdle(true), ms);
    };
    wake();
    const events = ["pointermove", "scroll", "keydown", "touchstart"] as const;
    events.forEach((e) => window.addEventListener(e, wake, { passive: true }));
    return () => {
      clearTimeout(t);
      events.forEach((e) => window.removeEventListener(e, wake));
    };
  }, [ms]);
  return idle;
}

export function JourneyChrome({
  activeId,
  ink,
  onNavigate,
}: {
  activeId: string;
  ink: string;
  onNavigate: (id: string) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { lang, toggleLang } = useLanguage();
  const pick = useJourneyText();
  const reduce = useReducedMotion();
  const idle = useIdle();

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const dim = idle && !menuOpen;

  return (
    <div
      data-journey-chrome
      style={{ color: ink }}
      className="transition-colors duration-700"
    >
      {/* ---- Top bar ---- */}
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-5 py-5 md:px-10 md:py-7">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between">
          <Link
            href="/"
            className="pointer-events-auto font-serif text-sm tracking-[0.34em] opacity-90 transition-opacity hover:opacity-100 md:text-base"
          >
            {journeyMeta.brand}
          </Link>

          <div className="pointer-events-auto flex items-center gap-5 md:gap-7">
            <button
              type="button"
              onClick={toggleLang}
              aria-label="Switch language"
              className="text-[10px] tracking-[0.25em] opacity-60 transition-opacity hover:opacity-100"
            >
              <span className={lang === "th" ? "underline underline-offset-4" : ""}>
                TH
              </span>
              <span className="mx-1 opacity-50">/</span>
              <span className={lang === "en" ? "underline underline-offset-4" : ""}>
                EN
              </span>
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="flex items-center gap-2.5 text-[10px] tracking-[0.25em] opacity-80 transition-opacity hover:opacity-100"
            >
              <span className="hidden sm:inline">MENU</span>
              <span className="relative block h-3 w-4">
                <span
                  className={`absolute left-0 block h-px w-4 bg-current transition-all duration-300 ${
                    menuOpen ? "top-1.5 rotate-45" : "top-0.5"
                  }`}
                />
                <span
                  className={`absolute left-0 block h-px w-4 bg-current transition-all duration-300 ${
                    menuOpen ? "top-1.5 -rotate-45" : "top-[9px]"
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ---- Vertical edge label (desktop) ---- */}
      <motion.span
        aria-hidden
        animate={{ opacity: dim ? 0.18 : 0.45 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="fixed left-4 top-1/2 z-40 hidden -translate-y-1/2 rotate-180 text-[10px] tracking-[0.4em] [writing-mode:vertical-rl] xl:block"
      >
        {journeyMeta.sideLabel}
      </motion.span>

      {/* ---- Vertical progress nav (desktop) ---- */}
      <motion.nav
        aria-label="Chapters"
        animate={{ opacity: dim ? 0.4 : 1 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 md:block"
      >
        <ul className="flex flex-col items-end gap-5">
          {journeySections.map((s) => {
            const active = activeId === s.id;
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => onNavigate(s.id)}
                  className="group flex items-center gap-3"
                  aria-current={active ? "true" : undefined}
                >
                  <span
                    className={`text-[10px] tracking-[0.2em] transition-all duration-500 ${
                      active
                        ? "opacity-100"
                        : "opacity-0 -translate-x-1 group-hover:opacity-60 group-hover:translate-x-0"
                    }`}
                  >
                    {pick(s.kicker)}
                  </span>
                  <span className="relative flex h-4 w-4 items-center justify-center">
                    <span
                      className={`block rounded-full bg-current transition-all duration-500 ${
                        active ? "h-1 w-1" : "h-[3px] w-[3px] opacity-40"
                      }`}
                    />
                    <span
                      className={`absolute inset-0 rounded-full border border-current transition-all duration-500 ${
                        active ? "scale-100 opacity-70" : "scale-50 opacity-0"
                      }`}
                    />
                  </span>
                  <span
                    className={`w-5 text-right text-[10px] tabular-nums tracking-widest transition-opacity duration-500 ${
                      active ? "opacity-100" : "opacity-35"
                    }`}
                  >
                    {s.index}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </motion.nav>

      {/* ---- Progress nav (mobile — thin segmented bar) ---- */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex gap-1 px-5 pb-4 md:hidden">
        {journeySections.map((s) => (
          <button
            key={s.id}
            type="button"
            aria-label={pick(s.kicker)}
            onClick={() => onNavigate(s.id)}
            className="flex-1 py-2"
          >
            <span
              className={`block h-px w-full transition-all duration-500 ${
                activeId === s.id ? "bg-current" : "bg-current/25"
              }`}
            />
          </button>
        ))}
      </div>

      {/* ---- Overlay menu ---- */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0.2 : 0.6, ease: EASE }}
            className="fixed inset-0 z-[60] flex flex-col bg-[#171310] text-[#E7DCCC]"
          >
            <div className="flex items-center justify-between px-5 py-5 md:px-10 md:py-7">
              <span className="font-serif text-sm tracking-[0.34em] md:text-base">
                {journeyMeta.brand}
              </span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="text-[10px] tracking-[0.25em] opacity-70 transition-opacity hover:opacity-100"
              >
                CLOSE ✕
              </button>
            </div>

            <nav className="flex flex-1 flex-col justify-center gap-1 px-6 md:px-16">
              {journeySections.map((s, i) => (
                <motion.button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onNavigate(s.id);
                  }}
                  initial={{ opacity: 0, y: reduce ? 0 : 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: reduce ? 0 : 0.1 + i * 0.06,
                    ease: EASE,
                  }}
                  className="group flex items-baseline gap-5 py-3 text-left"
                >
                  <span className="text-[10px] tabular-nums tracking-widest opacity-40">
                    {s.index}
                  </span>
                  <span className="font-serif text-2xl tracking-wide opacity-80 transition-opacity group-hover:opacity-100 md:text-4xl">
                    {pick(s.kicker)}
                  </span>
                </motion.button>
              ))}
            </nav>

            <div className="flex flex-wrap gap-x-8 gap-y-2 px-6 pb-10 md:px-16">
              {journeyMenu.siteLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-[10px] tracking-[0.25em] opacity-60 transition-opacity hover:opacity-100"
                >
                  {pick(l.label)} <span aria-hidden>→</span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
