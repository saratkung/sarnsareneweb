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

export default function HighlightQuote() {
  const { lang } = useLanguage();
  const raw = lang === "en" ? en.highlightQuote.quote : highlightQuote.quote;
  // Bind the Thai repetition mark ("ๆ") to the word before it so it is
  // never stranded at the start of a line.
  const quote = raw.replace(/ ๆ/g, " ๆ");
  const attribution = highlightQuote.attribution.replace(/^—\s*/, "");
  const reduce = useReduceMotion();
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // One slow, quiet breath: the words rise and sharpen, hold at rest for
  // most of the pin, then lift away. Nothing wipes or snaps.
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.24, 0.82, 1],
    [0, 1, 1, 0],
  );
  const y = useTransform(scrollYProgress, [0, 0.32, 0.75, 1], [56, 0, 0, -56]);
  const blurPx = useTransform(scrollYProgress, [0, 0.28], [8, 0]);
  const blur = useMotionTemplate`blur(${blurPx}px)`;

  // A hairline that draws down as the quote settles.
  const lineScale = useTransform(scrollYProgress, [0.06, 0.3], [0, 1]);

  // The faint weave, barely there, drifting.
  const bgY = useTransform(scrollYProgress, [0, 1], ["-3%", "4%"]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.3, 0.85, 1], [0, 0.16, 0.16, 0.04]);

  return (
    <section
      ref={ref}
      data-scroll-section
      data-mood="dark"
      className="relative h-[180vh] bg-[#1F1E1B]"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div
          aria-hidden
          className="absolute inset-[-4%]"
          style={{ y: reduce ? 0 : bgY, opacity: reduce ? 0.12 : bgOpacity }}
        >
          <Image
            src="/images/weave-hero.png"
            alt=""
            fill
            sizes="100vw"
            className="object-cover blur-[2px]"
          />
        </motion.div>
        {/* a soft breath of shadow at the centre, deep black at the seams */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(70% 68% at 50% 50%, rgba(31,30,27,0.35) 0%, rgba(31,30,27,0.78) 78%, #1F1E1B 100%)",
          }}
        />

        <motion.div
          style={{
            opacity: reduce ? 1 : opacity,
            y: reduce ? 0 : y,
            filter: reduce ? "none" : blur,
          }}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center"
        >
          <motion.span
            aria-hidden
            style={{ scaleY: reduce ? 1 : lineScale }}
            className="block h-14 w-px origin-top bg-text-light/25 mb-12 md:mb-16"
          />

          <blockquote className="font-serif font-light italic text-text-light text-[clamp(1.45rem,3vw,2.35rem)] leading-[1.66] w-full max-w-[min(90vw,38rem)] text-balance">
            &ldquo;{quote}&rdquo;
          </blockquote>

          <p className="mt-12 md:mt-16 text-[10px] tracking-[0.44em] uppercase text-text-light/40">
            {attribution}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
