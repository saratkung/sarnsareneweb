"use client";

// ============================================================
// SARNSARENE — /journey shared building blocks.
// Motion primitives (all transform/opacity only, all honour
// prefers-reduced-motion) plus the thin-line iconography.
// Tuning lives in lib/journey.ts → journeyMotion.
// ============================================================

import { useRef, type ReactNode } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { journeyMotion } from "@/lib/journey";
import { useLanguage } from "@/components/LanguageContext";

const { EASE, reveal } = journeyMotion;

/** Pick the copy for the active language from a { th, en } pair. */
export function useJourneyText() {
  const { lang } = useLanguage();
  return function pick(pair: { th: string; en: string }) {
    return lang === "en" ? pair.en : pair.th;
  };
}

// ---- Text reveal ----------------------------------------------------
// Splits on "\n" and lifts each line out from behind a mask.

export function TextReveal({
  text,
  as: Tag = "div",
  className,
  lineClassName,
  delay = 0,
  stagger = 0.12,
}: {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "div";
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
}) {
  const reduce = useReducedMotion();
  const lines = text.split("\n");
  const MotionTag = motion[Tag];

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.6 }}
    >
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden">
          <motion.span
            className={`block ${lineClassName ?? ""}`}
            variants={{
              hidden: { y: reduce ? 0 : "110%", opacity: reduce ? 0 : 1 },
              visible: {
                y: "0%",
                opacity: 1,
                transition: {
                  duration: reduce ? 0.4 : reveal,
                  delay: delay + i * stagger,
                  ease: EASE,
                },
              },
            }}
          >
            {line || " "}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}

// ---- Fade / lift ---------------------------------------------------

export function FadeIn({
  children,
  className,
  delay = 0,
  y = 24,
  amount = 0.4,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  amount?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: reduce ? 0.4 : reveal, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

// ---- Parallax image ----------------------------------------------
// A scroll-linked vertical drift + a settle-in scale. `priority`
// preloads (use it for the hero only).

export function ParallaxImage({
  src,
  alt,
  className,
  imgClassName,
  priority = false,
  sizes = "100vw",
  strength = 60,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  sizes?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? [0, 0] : [-strength, strength],
  );

  return (
    <div ref={ref} className={`relative overflow-hidden ${className ?? ""}`}>
      <motion.div
        className="absolute inset-0"
        style={{ y }}
        initial={{ scale: reduce ? 1 : 1.12, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{
          opacity: { duration: 1, ease: EASE },
          scale: { duration: reduce ? 0 : 1.8, ease: EASE },
        }}
      >
        {/* extra height so the parallax drift never reveals an edge */}
        <div className="absolute inset-x-0 -inset-y-[12%]">
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            sizes={sizes}
            className={`object-cover ${imgClassName ?? ""}`}
          />
        </div>
      </motion.div>
    </div>
  );
}

// ---- Arrow ---------------------------------------------------------
// Nudges 6px on hover/focus of the nearest `.group`.

export function Arrow({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`inline-block transition-transform duration-500 ease-out group-hover:translate-x-1.5 group-focus-visible:translate-x-1.5 ${className ?? ""}`}
    >
      →
    </span>
  );
}

// ---- Underline link ----------------------------------------------
// A hairline that wipes in from the left on hover.

export function AnimatedLink({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={`relative inline-block ${className ?? ""}`}>
      {children}
      <span className="pointer-events-none absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-current transition-transform duration-500 ease-out group-hover:origin-left group-hover:scale-x-100" />
    </span>
  );
}

// ---- Thin-line iconography --------------------------------------
// Minimal marks for the Philosophy pillars. strokeWidth stays 1.

export function JourneyIcon({
  name,
  className,
}: {
  name: "harmony" | "balance" | "serenity";
  className?: string;
}) {
  const common = {
    viewBox: "0 0 40 40",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1,
    strokeLinecap: "round" as const,
    className,
  };
  if (name === "harmony") {
    return (
      <svg {...common}>
        <circle cx="15" cy="20" r="9" />
        <circle cx="25" cy="20" r="9" />
      </svg>
    );
  }
  if (name === "balance") {
    return (
      <svg {...common}>
        <path d="M20 8v24" />
        <path d="M8 15h24" />
        <path d="M8 15c0 4 2.6 6 6 6s6-2 6-6" />
        <path d="M20 15c0 4 2.6 6 6 6s6-2 6-6" />
      </svg>
    );
  }
  // serenity — still water
  return (
    <svg {...common}>
      <path d="M6 15c3.5 0 3.5 3 7 3s3.5-3 7-3 3.5 3 7 3 3.5-3 7-3" />
      <path d="M6 22c3.5 0 3.5 3 7 3s3.5-3 7-3 3.5 3 7 3 3.5-3 7-3" />
    </svg>
  );
}

// ---- Process line (Section 04) ---------------------------------
// A horizontal hairline that draws left→right on scroll; each node
// "activates" as the line passes it.

export function ProcessLine({
  steps,
  pick,
  accent,
}: {
  steps: readonly { label: { th: string; en: string } }[];
  pick: (p: { th: string; en: string }) => string;
  accent: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "start 0.3"],
  });
  const scaleX = useTransform(scrollYProgress, [0, 1], [reduce ? 1 : 0, 1]);

  return (
    <div ref={ref} className="relative">
      {/* track */}
      <div className="absolute left-0 right-0 top-[10px] h-px bg-current/15" />
      <motion.div
        className="absolute left-0 right-0 top-[10px] h-px origin-left"
        style={{ scaleX, background: accent }}
      />
      <ol className="relative grid grid-cols-2 gap-y-8 sm:grid-cols-3 md:grid-cols-5">
        {steps.map((s, i) => (
          <li key={i} className="flex flex-col items-center px-2 text-center">
            <motion.span
              className="mb-4 block h-[5px] w-[5px] rounded-full"
              initial={{ backgroundColor: "rgba(0,0,0,0)", scale: 0.8 }}
              whileInView={{ backgroundColor: accent, scale: 1 }}
              viewport={{ once: true, amount: 1 }}
              transition={{
                duration: 0.5,
                delay: reduce ? 0 : 0.15 + i * 0.16,
                ease: EASE,
              }}
              style={{ boxShadow: `0 0 0 1px ${accent}` }}
            />
            <FadeIn delay={reduce ? 0 : 0.2 + i * 0.16} y={12} amount={0.8}>
              <span className="whitespace-pre-line text-[10px] uppercase leading-relaxed tracking-[0.2em] opacity-80">
                {pick(s.label)}
              </span>
            </FadeIn>
          </li>
        ))}
      </ol>
    </div>
  );
}
