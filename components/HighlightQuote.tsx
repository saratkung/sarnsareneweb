"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "framer-motion";
import { useReduceMotion } from "@/components/useReduceMotion";
import { highlightQuote } from "@/lib/content";
import { en } from "@/lib/translations";
import { useLanguage } from "@/components/LanguageContext";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function HighlightQuote() {
  const { lang } = useLanguage();
  const quote = lang === "en" ? en.highlightQuote.quote : highlightQuote.quote;
  const reduce = useReduceMotion();
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // The weave surfaces from the black, holds long, then recedes.
  const bgOpacity = useTransform(scrollYProgress, [0, 0.12, 0.9, 1], [0, 1, 1, 0.12]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.1, 1]);
  const bgY = useTransform(scrollYProgress, [0, 1], ["-4%", "5%"]);

  // The words are drawn in, top to bottom, like thread pulled through.
  const clipPct = useTransform(scrollYProgress, [0.06, 0.3], ["100%", "0%"]);
  const clip = useMotionTemplate`inset(0% 0% ${clipPct} 0%)`;
  const quoteBlurPx = useTransform(scrollYProgress, [0.06, 0.32], [6, 0]);
  const quoteBlur = useMotionTemplate`blur(${quoteBlurPx}px)`;
  const quoteY = useTransform(scrollYProgress, [0, 0.4], [24, 0]);

  const marksOpacity = useTransform(scrollYProgress, [0.12, 0.34], [0, 1]);
  const attribOpacity = useTransform(scrollYProgress, [0.28, 0.5, 0.92, 1], [0, 1, 1, 0]);
  const attribY = useTransform(scrollYProgress, [0.28, 0.5], [16, 0]);

  // The whole scene holds through the pin, then lifts away at the very end.
  const sceneOpacity = useTransform(scrollYProgress, [0.88, 1], [1, 0]);
  const sceneY = useTransform(scrollYProgress, [0.7, 1], [0, -54]);

  return (
    <section
      ref={ref}
      data-scroll-section
      data-mood="dark"
      className="relative h-[240vh] bg-[#1F1E1B]"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* the woven fibre, held in the dark */}
        <motion.div
          className="absolute inset-[-5%]"
          style={{ y: reduce ? 0 : bgY, scale: reduce ? 1 : bgScale }}
        >
          <motion.div
            className="absolute inset-0"
            style={{ opacity: reduce ? 0.9 : bgOpacity }}
          >
            <Image
              src="/images/weave-hero.png"
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>
        </motion.div>

        {/* pool the dark toward the centre so the fibre still reads at the edges */}
        <div className="absolute inset-0 bg-[#1F1E1B]/50" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(58% 60% at 50% 50%, rgba(31,30,27,0.72) 0%, rgba(31,30,27,0.4) 55%, rgba(31,30,27,0.15) 100%)",
          }}
        />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#1F1E1B] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#1F1E1B] to-transparent" />

        <motion.div
          style={{
            opacity: reduce ? 1 : sceneOpacity,
            y: reduce ? 0 : sceneY,
          }}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center"
        >
          <motion.div
            style={{ opacity: reduce ? 1 : marksOpacity }}
            className="flex flex-col items-center gap-4 mb-7"
          >
            <span className="h-px w-10 bg-text-light/30" />
            <span className="caption text-text-light/45">Philosophy</span>
            <span
              aria-hidden
              className="font-serif text-gold text-4xl md:text-5xl leading-none select-none"
            >
              &ldquo;
            </span>
          </motion.div>

          <motion.blockquote
            style={{
              clipPath: reduce ? "inset(0% 0% 0% 0%)" : clip,
              WebkitClipPath: reduce ? "inset(0% 0% 0% 0%)" : clip,
              filter: reduce ? "none" : quoteBlur,
              y: reduce ? 0 : quoteY,
            }}
            className="font-serif font-light text-text-light text-[clamp(1.3rem,2.9vw,2.1rem)] leading-[1.62] w-full max-w-[min(88vw,37rem)] text-balance"
          >
            {quote}
            <span aria-hidden className="font-serif text-gold align-baseline ml-1">
              &rdquo;
            </span>
          </motion.blockquote>
        </motion.div>

        <motion.p
          style={{
            opacity: reduce ? 1 : attribOpacity,
            y: reduce ? 0 : attribY,
          }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3 text-[10px] tracking-[0.42em] uppercase text-text-light/50"
        >
          <span className="h-px w-6 bg-text-light/30" />
          {highlightQuote.attribution.replace(/^—\s*/, "")}
        </motion.p>
      </div>
    </section>
  );
}
