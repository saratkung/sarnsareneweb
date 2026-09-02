"use client";

import { useEffect } from "react";
import { useMotionValue, useSpring } from "framer-motion";
import { useReduceMotion } from "@/components/useReduceMotion";

/**
 * Barely-there pointer parallax for a single hero-weight image.
 * The image drifts at most `max` px and always lags well behind the
 * cursor, so it reads as depth, never as a gimmick. Off for touch and
 * reduced-motion.
 */
export function useMouseParallax(max = 10) {
  const reduce = useReduceMotion();
  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);
  const x = useSpring(mvX, { stiffness: 40, damping: 18, mass: 1 });
  const y = useSpring(mvY, { stiffness: 40, damping: 18, mass: 1 });

  useEffect(() => {
    if (reduce) return;
    if (window.matchMedia("(hover: none)").matches) return;

    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      mvX.set(nx * max);
      mvY.set(ny * max);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [max, mvX, mvY, reduce]);

  return { x, y };
}
