"use client";

// ============================================================
// SARNSARENE — /journey orchestrator.
// Owns the "which chapter am I in" state (one IntersectionObserver
// over every [data-journey-section]), exposes smooth in-page
// navigation, and paints the page background the colour of the
// chapter in view. Everything visual lives in the child files.
// ============================================================

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";
import { journeySections, journeyIntro, journeyClosing } from "@/lib/journey";
import { JourneyChrome } from "@/components/journey/JourneyChrome";
import { JourneyHero } from "@/components/journey/JourneyHero";
import { JourneyChapters } from "@/components/journey/JourneySections";

const HERO_ID = "journey-hero";
const FIRST = journeySections[0];
const LAST = journeySections[journeySections.length - 1];

// backdrop colour + chrome ink for every scroll position, including
// the un-numbered hero / intro / closing bands.
const BACKDROPS: Record<string, { bg: string; ink: string }> = {
  [HERO_ID]: { bg: "#0F0C0A", ink: "#EDE4D6" },
  intro: { bg: journeyIntro.bg, ink: journeyIntro.ink },
  closing: { bg: journeyClosing.bg, ink: journeyClosing.ink },
  ...Object.fromEntries(journeySections.map((s) => [s.id, { bg: s.bg, ink: s.ink }])),
};

// which progress-nav dot lights up for each band
const NAV_FOR: Record<string, string> = {
  [HERO_ID]: FIRST.id,
  intro: FIRST.id,
  closing: LAST.id,
};

export function JourneyExperience() {
  const [activeId, setActiveId] = useState(FIRST.id);
  const rootRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // Top scroll-progress hairline.
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });

  // ---- active chapter ----
  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-journey-section]"),
    );
    if (!nodes.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const id = (e.target as HTMLElement).dataset.journeySection;
          if (id) setActiveId(id);
        }
      },
      // Only the section crossing the middle ~14% band counts as active.
      { rootMargin: "-43% 0px -43% 0px", threshold: 0 },
    );

    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  // ---- smooth in-page nav ----
  const navigate = useCallback(
    (id: string) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.scrollIntoView({
        behavior: reduce ? "auto" : "smooth",
        block: "start",
      });
    },
    [reduce],
  );

  // ---- colour + progress-nav follow the band in view ----
  const backdrop = BACKDROPS[activeId] ?? BACKDROPS[FIRST.id];
  const navActiveId = NAV_FOR[activeId] ?? activeId;

  useEffect(() => {
    // Keep the browser chrome / overscroll colour in step.
    const prev = document.body.style.backgroundColor;
    document.body.style.backgroundColor = backdrop.bg;
    return () => {
      document.body.style.backgroundColor = prev;
    };
  }, [backdrop.bg]);

  return (
    <div
      ref={rootRef}
      data-journey-root
      style={{ backgroundColor: backdrop.bg }}
      className="relative transition-colors duration-700"
    >
      {/* scroll progress */}
      <motion.div
        aria-hidden
        style={{ scaleX: progress, color: backdrop.ink }}
        className="fixed inset-x-0 top-0 z-[55] h-px origin-left bg-current/50"
      />

      <JourneyChrome activeId={navActiveId} ink={backdrop.ink} onNavigate={navigate} />

      <main>
        <JourneyHero id={HERO_ID} />
        <JourneyChapters />
      </main>
    </div>
  );
}
