"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReduceMotion } from "@/components/useReduceMotion";
import { brand, hero } from "@/lib/content";
import { en } from "@/lib/translations";
import { useLanguage } from "@/components/LanguageContext";
import { useMouseParallax } from "@/components/useMouseParallax";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  const { lang } = useLanguage();
  const subtitle = lang === "en" ? en.hero.subtitle : hero.subtitle;
  const reduce = useReduceMotion();
  const ref = useRef<HTMLElement>(null);
  const { x: mx, y: my } = useMouseParallax(12);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  // The camera pulls slowly back from the textile.
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const wordmarkY = useTransform(scrollYProgress, [0, 0.6], [0, -70]);
  const wordmarkScale = useTransform(scrollYProgress, [0, 0.6], [1, 0.92]);
  const wordmarkOpacity = useTransform(scrollYProgress, [0, 0.42], [1, 0]);
  const serenityOpacity = useTransform(scrollYProgress, [0.05, 0.5], [1, 0]);

  return (
    <section
      ref={ref}
      data-scroll-section
      data-mood="dark"
      className="relative h-[100svh] min-h-[600px] flex items-center justify-center overflow-hidden"
    >
      {/* scroll parallax + pull-back */}
      <motion.div
        className="absolute inset-[-6%]"
        style={reduce ? undefined : { y: imageY, scale: imageScale }}
      >
        {/* pointer drift */}
        <motion.div
          className="absolute inset-[-3%]"
          style={reduce ? undefined : { x: mx, y: my }}
        >
          {/* slow settle-in on load */}
          <motion.div
            className="absolute inset-0"
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.05 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            transition={{
              opacity: { duration: 1.9, ease: EASE },
              scale: { duration: 14, ease: "easeOut" },
            }}
          >
            <Image
              src={hero.image}
              alt="SARNSARENE — hand-woven Thai textile, close"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Charcoal veil. Brightest light in the weave sits dead centre —
          where the wordmark sits — so a wide, soft radial bloom pools
          shadow behind the type while the fibre stays legible at the edges. */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1F1E1B]/45 via-[#1F1E1B]/15 to-[#1F1E1B]/80" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 55% at 50% 46%, rgba(31,30,27,0.62) 0%, rgba(31,30,27,0.32) 45%, rgba(31,30,27,0) 78%)",
          }}
        />
        <div
          className="absolute inset-0 bg-[#1F1E1B]"
          style={{ opacity: "var(--hero-overlay-opacity)" }}
        />
      </div>

      <motion.div
        style={reduce ? undefined : { y: wordmarkY }}
        className="relative z-10 w-full max-w-content mx-auto px-6 md:px-10 text-center"
      >
        <motion.h1
          style={reduce ? undefined : { scale: wordmarkScale, opacity: wordmarkOpacity }}
        >
          <motion.span
            initial={{ opacity: 0, y: 26, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.7, delay: 0.5, ease: EASE }}
            className="display block text-[#F5F2EB] uppercase text-[clamp(2.6rem,9vw,7rem)] tracking-[0.16em] md:tracking-[0.22em]"
          >
            {brand.name}
          </motion.span>
        </motion.h1>

        <motion.p
          style={reduce ? undefined : { opacity: serenityOpacity }}
          className="mt-6"
        >
          <motion.span
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.3, delay: 1.15, ease: EASE }}
            className="block text-[11px] md:text-[13px] tracking-[0.5em] uppercase text-[#F5F2EB]/70"
          >
            {hero.title}
          </motion.span>
        </motion.p>

        <motion.p
          style={reduce ? undefined : { opacity: serenityOpacity }}
          className="mt-8 max-w-sm mx-auto"
        >
          <motion.span
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.3, delay: 1.45, ease: EASE }}
            className="block text-[14px] md:text-[15px] leading-relaxed font-light text-[#F5F2EB]/60"
          >
            {subtitle}
          </motion.span>
        </motion.p>
      </motion.div>

      <motion.div
        style={reduce ? undefined : { opacity: serenityOpacity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 2, ease: EASE }}
          className="flex flex-col items-center gap-4"
        >
          <span className="text-[9px] tracking-[0.4em] uppercase text-[#F5F2EB]/50">
            Scroll
          </span>
          <span className="relative block h-12 w-px overflow-hidden bg-[#F5F2EB]/15">
            <span className="scroll-line absolute inset-0 block bg-[#F5F2EB]/70" />
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}
