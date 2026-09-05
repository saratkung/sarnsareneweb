"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useReduceMotion } from "@/components/useReduceMotion";

type Mood = "dark" | "ivory" | "sand";

const MOOD_BG: Record<Mood, string> = {
  dark: "#1F1E1B",
  ivory: "#F5F2EB",
  sand: "#EFEBE1",
};

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The homepage's connective tissue: a fixed backdrop that slowly
 * cross-fades between the page's three moods (dark / ivory / sand) as
 * sections cross the viewport centre, so section-to-section colour
 * changes read as one continuous shift.
 *
 * Driven by one rAF-throttled measurement of every [data-scroll-section]
 * against the viewport — the section covering the most of the screen
 * sets the mood.
 */
export default function HomeScroll() {
  const reduce = useReduceMotion();
  const [mood, setMood] = useState<Mood>("dark");
  const frame = useRef<number | null>(null);

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-scroll-section]"),
    );
    if (!sections.length) return;

    const measure = () => {
      frame.current = null;
      const vh = window.innerHeight;
      // The section filling the most of the viewport wins — a short band
      // can't hijack the mood from the chapter it sits inside until it
      // genuinely dominates the screen.
      let best: { el: HTMLElement; area: number } | null = null;
      for (const el of sections) {
        const rect = el.getBoundingClientRect();
        const visible = Math.max(0, Math.min(rect.bottom, vh) - Math.max(rect.top, 0));
        if (visible <= 0) continue;
        if (!best || visible > best.area) best = { el, area: visible };
      }
      if (best) setMood((best.el.dataset.mood as Mood) || "ivory");
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

  return (
    <motion.div
      aria-hidden
      className="fixed inset-0 z-0"
      initial={false}
      animate={{ backgroundColor: MOOD_BG[mood] }}
      transition={{ duration: reduce ? 0 : 1.3, ease: EASE }}
    />
  );
}
