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
import { ourStory } from "@/lib/content";
import { en } from "@/lib/translations";
import { useLanguage } from "@/components/LanguageContext";
import { Reveal, CurtainImage, ChapterMark } from "@/components/Reveal";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function OurStory() {
  const { lang } = useLanguage();
  const bannerSubtitle =
    lang === "en" ? en.ourStory.bannerSubtitle : ourStory.bannerSubtitle;
  const paragraphs = lang === "en" ? en.ourStory.paragraphs : ourStory.paragraphs;

  const bannerRef = useRef<HTMLDivElement>(null);
  const reduce = useReduceMotion();
  const { scrollYProgress } = useScroll({
    target: bannerRef,
    offset: ["start start", "end start"],
  });
  // The title holds like a card, then lifts and dissolves as the view
  // is left behind.
  const titleY = useTransform(scrollYProgress, [0, 0.7], [0, -90]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const veil = useTransform(scrollYProgress, [0.15, 0.8], [0, 0.4]);

  // Roots — one continuous ivory field; the linen simply surfaces within it.
  const rootsRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: rp } = useScroll({
    target: rootsRef,
    offset: ["start end", "end start"],
  });
  const linenOpacity = useTransform(rp, [0, 0.32], [0, 1]);
  const linenScale = useTransform(rp, [0, 0.6], [1.12, 1]);
  const linenY = useTransform(rp, [0, 1], ["-6%", "8%"]);
  const linenBlurPx = useTransform(rp, [0, 0.34], [10, 0]);
  const linenBlur = useMotionTemplate`blur(${linenBlurPx}px)`;
  const rootsTextY = useTransform(rp, [0, 1], [40, -40]);

  return (
    <section
      id="story"
      data-scroll-section
      data-mood="ivory"
      data-rail="02"
    >
      {/* Full-bleed banner — sheer curtains part on a distant view. */}
      <div
        ref={bannerRef}
        className="relative h-[82vh] min-h-[480px] flex items-center justify-center overflow-hidden"
      >
        <CurtainImage
          direction="center-x"
          parallax={110}
          scale={1.05}
          className="absolute inset-0"
        >
          <Image
            src={ourStory.bannerImage}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
        </CurtainImage>

        {/* The photo is bright and airy — a whisper of a wash, and a pool
            of light behind the type so the charcoal heading holds. */}
        <div className="absolute inset-0 bg-[#F5F2EB]/8" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(50% 48% at 50% 50%, rgba(245,242,235,0.6) 0%, rgba(245,242,235,0.16) 58%, rgba(245,242,235,0) 82%)",
          }}
        />
        {/* Deepening veil as the section is scrolled past. */}
        <motion.div
          className="absolute inset-0 bg-[#F5F2EB]"
          style={reduce ? { opacity: 0 } : { opacity: veil }}
        />
        {/* Melt into the ivory of the Roots block below. */}
        <div className="absolute inset-x-0 bottom-0 h-[26vh] bg-gradient-to-b from-transparent to-bg" />

        <ChapterMark
          index={2}
          total={4}
          className="hidden md:flex absolute left-6 lg:left-10 top-1/2 -translate-y-1/2 z-10"
        />

        <motion.div
          style={reduce ? undefined : { y: titleY, opacity: titleOpacity }}
          className="relative z-10 text-center max-w-2xl mx-auto px-6 md:px-10"
        >
          <motion.p
            initial={reduce ? undefined : { opacity: 0, y: 14 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 1, ease: EASE }}
            className="caption mb-6 text-[#1F1E1B]/55"
          >
            Chapter 02
          </motion.p>
          <motion.h2
            initial={reduce ? undefined : { opacity: 0, y: 26, filter: "blur(8px)" }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1.4, delay: 0.12, ease: EASE }}
            className="section-title uppercase tracking-[0.08em] text-[clamp(2rem,5.5vw,3.6rem)] text-[#1F1E1B]"
          >
            {ourStory.title}
          </motion.h2>
          {bannerSubtitle ? (
            <motion.p
              initial={reduce ? undefined : { opacity: 0, y: 16 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 1.2, delay: 0.34, ease: EASE }}
              className="mt-6 body-copy text-[14px] md:text-[15px] text-[#1F1E1B]/70 max-w-lg mx-auto"
            >
              {bannerSubtitle}
            </motion.p>
          ) : null}
        </motion.div>
      </div>

      {/* Roots — one continuous ivory field. The linen surfaces on the
          right and dissolves left into the ground the text sits on; no
          seam, no column. */}
      <div ref={rootsRef} className="relative bg-bg overflow-hidden">
        {/* the material, surfacing softly (fade + focus-pull + settle) */}
        <motion.div
          className="absolute inset-[-6%]"
          style={{ y: reduce ? 0 : linenY, scale: reduce ? 1 : linenScale }}
        >
          <motion.div
            className="absolute inset-0"
            style={{
              opacity: reduce ? 0.92 : linenOpacity,
              filter: reduce ? "none" : linenBlur,
            }}
          >
            <Image
              src={ourStory.image}
              alt=""
              fill
              sizes="100vw"
              className="object-cover object-right"
            />
          </motion.div>
        </motion.div>

        {/* ivory dissolving left→right: solid where the text lives, clear
            over the fabric */}
        <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/80 to-bg/25 md:to-transparent" />
        {/* melt into the sections above and below */}
        <div className="absolute inset-x-0 top-0 h-40 md:h-56 bg-gradient-to-b from-bg to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 md:h-56 bg-gradient-to-t from-bg to-transparent" />

        <div className="relative max-w-content mx-auto px-6 md:px-10 py-28 md:py-52 flex">
          <motion.div
            style={reduce ? undefined : { y: rootsTextY }}
            className="w-full md:max-w-xl grid grid-cols-[auto_1fr] gap-x-6 md:gap-x-10"
          >
            <Reveal className="pt-1">
              <ChapterMark index={2} total={4} />
            </Reveal>

            <div>
              <Reveal blur>
                <p className="eyebrow mb-6">Our Roots</p>
                <h3 className="section-title text-[clamp(2rem,3.6vw,2.8rem)] text-text-light">
                  {ourStory.rootHeading}
                </h3>
                <motion.span
                  initial={reduce ? undefined : { scaleX: 0 }}
                  whileInView={reduce ? undefined : { scaleX: 1 }}
                  viewport={{ once: true, amount: 0.8 }}
                  transition={{ duration: 1.1, delay: 0.2, ease: EASE }}
                  className="mt-7 block h-px w-14 origin-left bg-text-light/30"
                />
              </Reveal>

              <div className="mt-10 space-y-7">
                {paragraphs.map((p, i) => (
                  <Reveal key={i} blur delay={i * 0.1}>
                    <p className="body-copy text-[14px] md:text-[14.5px] max-w-md">
                      {p}
                    </p>
                  </Reveal>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
