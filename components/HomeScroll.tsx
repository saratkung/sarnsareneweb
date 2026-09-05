"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useReduceMotion } from "@/components/useReduceMotion";
import { useLenis } from "lenis/react";

type Mood = "dark" | "ivory" | "sand";

const MOOD_BG: Record<Mood, string> = {
  dark: "#1F1E1B",
  ivory: "#F5F2EB",
  sand: "#EFEBE1",
};

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The homepage's connective tissue:
 *  - a fixed backdrop that slowly cross-fades between the page's three
 *    moods (dark / ivory / sand) as sections cross the viewport centre,
 *    so section-to-section colour changes read as one continuous shift;
 *  - the minimal 01–05 progress rail on the right.
 *
 * Both are driven by one rAF-throttled measurement of every
 * [data-scroll-section] against the viewport centre.
 */
export default function HomeScroll() {
  const reduce = useReduceMotion();
  const lenis = useLenis();
  const [mood, setMood] = useState<Mood>("dark");
  const [rail, setRail] = useState<{ items: string[]; activeId: string | null }>({
    items: [],
    activeId: null,
  });
  const [atFoot, setAtFoot] = useState(false);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-scroll-section]"),
    );
    if (!sections.length) return;

    const railEls = sections.filter((el) => el.dataset.rail);
    setRail((r) => ({ ...r, items: railEls.map((el) => el.id) }));

    const measure = () => {
      frame.current = null;
      const vh = window.innerHeight;
      // The section filling the most of the viewport wins — a short band
      // (Material, the quote's sticky frame) can't hijack the mood from
      // the chapter it sits inside until it genuinely dominates the screen.
      let bestMood: { el: HTMLElement; area: number } | null = null;
      let bestRail: { el: HTMLElement; area: number } | null = null;
      for (const el of sections) {
        const rect = el.getBoundingClientRect();
        const visible = Math.max(0, Math.min(rect.bottom, vh) - Math.max(rect.top, 0));
        if (visible <= 0) continue;
        if (!bestMood || visible > bestMood.area) bestMood = { el, area: visible };
        if (el.dataset.rail && (!bestRail || visible > bestRail.area))
          bestRail = { el, area: visible };
      }
      if (bestMood) setMood((bestMood.el.dataset.mood as Mood) || "ivory");
      if (bestRail) {
        const id = bestRail.el.id;
        setRail((r) => (r.activeId === id ? r : { ...r, activeId: id }));
      }

      // The rail retires the moment the closing footer begins to show.
      const foot = document.getElementById("contact");
      if (foot) {
        const top = foot.getBoundingClientRect().top;
        setAtFoot(top < vh * 0.82);
      }
    };

    const onScroll = () => {
      if (frame.current == null) frame.current = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame.current != null) cancelAnimationFrame(frame.current);
    };
  }, []);

  const onDark = mood === "dark";

  const goTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (lenis && !reduce) lenis.scrollTo(el, { offset: -1, duration: 1.6 });
    else el.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <>
      <motion.div
        aria-hidden
        className="fixed inset-0 z-0"
        initial={false}
        animate={{ backgroundColor: MOOD_BG[mood] }}
        transition={{ duration: reduce ? 0 : 1.3, ease: EASE }}
      />

      {rail.items.length > 0 && (
        <motion.nav
          aria-label="Sections"
          className="fixed right-6 lg:right-9 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center"
          initial={false}
          animate={{ opacity: atFoot ? 0 : 1 }}
          transition={{ duration: reduce ? 0 : 0.6, ease: EASE }}
          style={{ pointerEvents: atFoot ? "none" : "auto" }}
        >
          {rail.items.map((id, i) => {
            const active = rail.activeId === id;
            return (
              <div key={id} className="flex flex-col items-center">
                {i > 0 && (
                  <span
                    className="w-px h-9 transition-colors duration-700"
                    style={{
                      backgroundColor: onDark
                        ? "rgba(245,242,235,0.22)"
                        : "rgba(31,30,27,0.18)",
                    }}
                  />
                )}
                <button
                  type="button"
                  onClick={() => goTo(id)}
                  aria-current={active ? "true" : undefined}
                  className="py-1.5 text-[10px] tracking-[0.28em] tabular-nums transition-all duration-700"
                  style={{
                    color: onDark ? "#F5F2EB" : "#1F1E1B",
                    opacity: active ? 1 : 0.34,
                    transform: active ? "scale(1)" : "scale(0.86)",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </button>
              </div>
            );
          })}
        </motion.nav>
      )}
    </>
  );
}
