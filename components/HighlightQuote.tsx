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

        {/* hold the left in shadow for the type; let the fibre read on the right */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1F1E1B] via-[#1F1E1B]/78 to-[#1F1E1B]/35" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1F1E1B]/70 via-transparent to-[#1F1E1B]/85" />

        <motion.div
          style={{
            opacity: reduce ? 1 : sceneOpacity,
            y: reduce ? 0 : sceneY,
          }}
          className="relative z-10 h-full max-w-content mx-auto px-6 md:px-10 flex flex-col justify-center"
        >
          <div className="grid md:grid-cols-[auto_1fr] gap-x-6 md:gap-x-12 items-start max-w-4xl">
            <div className="hidden md:flex flex-col items-start gap-3 pt-2">
              <span className="h-px w-8 bg-text-light/35" />
              <span className="caption text-text-light/50">Philosophy</span>
            </div>

            <div className="relative">
              <motion.span
                aria-hidden
                style={{ opacity: reduce ? 1 : marksOpacity }}
                className="absolute -left-1 -top-6 md:-top-8 font-serif text-gold text-5xl md:text-7xl leading-none select-none"
              >
                &ldquo;
              </motion.span>

              <motion.blockquote
                style={{
                  clipPath: reduce ? "inset(0% 0% 0% 0%)" : clip,
                  WebkitClipPath: reduce ? "inset(0% 0% 0% 0%)" : clip,
                  filter: reduce ? "none" : quoteBlur,
                  y: reduce ? 0 : quoteY,
                }}
                className="font-serif font-light text-text-light text-[clamp(1.4rem,3.2vw,2.4rem)] leading-[1.62] max-w-3xl"
              >
                {quote}
                <span
                  aria-hidden
                  className="font-serif text-gold align-baseline ml-1"
                >
                  &rdquo;
                </span>
              </motion.blockquote>
            </div>
          </div>
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
