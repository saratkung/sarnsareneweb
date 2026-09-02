"use client";

import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { useReduceMotion } from "@/components/useReduceMotion";
import { useRef, type ReactNode } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

export function fadeUpVariant(delay = 0): Variants {
  return {
    hidden: { opacity: 0, y: 36 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.9, delay, ease: EASE },
    },
  };
}

/** Editorial text reveal — rises, sharpens, settles. */
export function blurUpVariant(delay = 0): Variants {
  return {
    hidden: { opacity: 0, y: 30, filter: "blur(6px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 1.1, delay, ease: EASE },
    },
  };
}

export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
  blur = false,
}: {
  children?: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "span";
  blur?: boolean;
}) {
  const MotionTag = as === "span" ? motion.span : motion.div;
  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      variants={blur ? blurUpVariant(delay) : fadeUpVariant(delay)}
    >
      {children}
    </MotionTag>
  );
}

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.16, delayChildren: 0.05 },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 34, filter: "blur(5px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1, ease: EASE },
  },
};

export function StaggerGroup({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={staggerContainer}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={className} variants={staggerItem}>
      {children}
    </motion.div>
  );
}

// ------------------------------------------------------------------
// Scroll-driven cinema primitives.
// ------------------------------------------------------------------

/**
 * A masked image, wholly scroll-driven: a clip-path curtain wipes open
 * as the frame enters, the picture settles from a soft, slightly zoomed
 * state to sharp, then drifts with a slow parallax while the frame holds
 * it. No `whileInView` — every value is tied to the frame's own scroll
 * progress, so it behaves identically under Lenis, fast scrolls, and
 * programmatic jumps.
 *
 * The caller's `className` MUST carry a positioning + sizing context —
 * either `relative aspect-[x/y]` (or an explicit height), or
 * `absolute inset-0` inside a sized `relative` parent.
 */
export function CurtainImage({
  children,
  className = "",
  direction = "up",
  parallax = 60,
  scale = 1.07,
}: {
  children: ReactNode;
  className?: string;
  /** Edge the curtain opens from ("center-*" part from the middle outward). */
  direction?: "up" | "down" | "left" | "right" | "center-x" | "center-y";
  /** Pixels of vertical drift across the full scroll pass. */
  parallax?: number;
  /** Scale the image enters at, before it settles to 1. */
  scale?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReduceMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Curtain wipe: fully closed until the frame is a little way in, open
  // by the time it nears centre.
  const pct = useTransform(scrollYProgress, [0.02, 0.34], ["100%", "0%"]);
  const half = useTransform(scrollYProgress, [0.02, 0.4], ["50%", "0%"]);
  const clipUp = useMotionTemplate`inset(${pct} 0% 0% 0%)`;
  const clipDown = useMotionTemplate`inset(0% 0% ${pct} 0%)`;
  const clipLeft = useMotionTemplate`inset(0% 0% 0% ${pct})`;
  const clipRight = useMotionTemplate`inset(0% ${pct} 0% 0%)`;
  const clipCenterX = useMotionTemplate`inset(0% ${half} 0% ${half})`;
  const clipCenterY = useMotionTemplate`inset(${half} 0% ${half} 0%)`;
  const clip = {
    up: clipUp,
    down: clipDown,
    left: clipLeft,
    right: clipRight,
    "center-x": clipCenterX,
    "center-y": clipCenterY,
  }[direction];

  // Settle-in: enter slightly zoomed + soft, resolve sharp; then a gentle
  // continuous vertical drift for the rest of the pass.
  const zoom = useTransform(scrollYProgress, [0, 0.4], [scale, 1]);
  const blurPx = useTransform(scrollYProgress, [0, 0.32], [6, 0]);
  const blur = useMotionTemplate`blur(${blurPx}px)`;
  const y = useTransform(scrollYProgress, [0, 1], [-parallax / 2, parallax / 2]);

  // Reduced motion: a plain, settled subtree — no MotionValues bound to
  // the DOM at all, so nothing can get stuck mid-reveal.
  if (reduce) {
    return (
      <div className={`overflow-hidden ${className}`}>
        <div className="absolute inset-0">{children}</div>
      </div>
    );
  }

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        style={{ clipPath: clip, WebkitClipPath: clip }}
        className="absolute inset-0"
      >
        <motion.div style={{ y }} className="absolute inset-[-8%]">
          <motion.div
            style={{ scale: zoom, filter: blur }}
            className="absolute inset-0"
          >
            {children}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

/** Slow vertical parallax for any block (text, marks, loose imagery). */
export function Parallax({
  children,
  className = "",
  distance = 40,
}: {
  children: ReactNode;
  className?: string;
  distance?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReduceMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={reduce ? undefined : { y }}>{children}</motion.div>
    </div>
  );
}

/**
 * The editorial chapter index — "01 / — / 04". Vertical, quiet, sits in
 * the margin of a section so the page reads like a bound folio.
 */
export function ChapterMark({
  index,
  total,
  className = "",
}: {
  index: number;
  total: number;
  className?: string;
}) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <div
      className={`flex flex-col items-start gap-2 text-[11px] tracking-[0.3em] text-text-light/45 tabular-nums ${className}`}
    >
      <span className="text-text-light/80">{pad(index)}</span>
      <span className="h-8 w-px bg-text-light/25" />
      <span>{pad(total)}</span>
    </div>
  );
}
