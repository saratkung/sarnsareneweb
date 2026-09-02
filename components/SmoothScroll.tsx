"use client";

import { type ReactNode } from "react";
import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";
import { useReduceMotion } from "@/components/useReduceMotion";

/**
 * Site-wide smooth scroll. Lenis drives the window scroll position on a
 * single rAF loop, so every framer-motion `useScroll` on the page reads
 * from one eased source — the whole homepage moves like one camera.
 *
 * Disabled entirely for `prefers-reduced-motion`, and kept off touch
 * (native momentum already feels right on phones, and the brief asks
 * for mobile to be calmer, not re-timed).
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  const reduce = useReduceMotion();
  if (reduce) return <>{children}</>;

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.085,
        duration: 1.4,
        smoothWheel: true,
        wheelMultiplier: 0.9,
        syncTouch: false,
        touchMultiplier: 1.5,
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
      }}
    >
      {children}
    </ReactLenis>
  );
}
