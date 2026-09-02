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
import { easternInspiration } from "@/lib/content";
import { en } from "@/lib/translations";
import { useLanguage } from "@/components/LanguageContext";
import { Reveal, ChapterMark } from "@/components/Reveal";

const EASE = [0.16, 1, 0.3, 1] as const;

function Rule({ className = "" }: { className?: string }) {
  const reduce = useReduceMotion();
  return (
    <motion.span
      initial={reduce ? undefined : { scaleX: 0 }}
      whileInView={reduce ? undefined : { scaleX: 1 }}
      viewport={{ once: true, amount: 0.8 }}
      transition={{ duration: 1.2, delay: 0.15, ease: EASE }}
      className={`block h-px w-14 origin-left bg-text-light/30 ${className}`}
    />
  );
}

/**
 * A strand of the chapter — text laid straight on the material, its
 * reveal wholly scroll-driven so it drifts in and sharpens rather than
 * snapping.
 */
function Item({
  index,
  title,
  description,
}: {
  index: number;
  title: string;
  description: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReduceMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [56, -56]);
  const opacity = useTransform(scrollYProgress, [0.06, 0.3], [0, 1]);
  const blurPx = useTransform(scrollYProgress, [0.06, 0.34], [7, 0]);
  const blur = useMotionTemplate`blur(${blurPx}px)`;

  return (
    <motion.div
      ref={ref}
      style={{
        y: reduce ? 0 : y,
        opacity: reduce ? 1 : opacity,
        filter: reduce ? "none" : blur,
      }}
      className="relative w-full md:max-w-md"
    >
      <span className="caption text-text-light/45">
        {String(index).padStart(2, "0")}
      </span>
      <h3 className="section-title text-[clamp(1.6rem,2.8vw,2.15rem)] text-text-light mt-4 mb-6">
        {title}
      </h3>
      <Rule />
      <p className="body-copy text-[14px] mt-6">{description}</p>
    </motion.div>
  );
}

export default function EasternInspiration() {
  const { lang } = useLanguage();
  const reduce = useReduceMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  // One slow breath across the chapter — the material surfaces, holds,
  // then settles down into the dark.
  const bgY = useTransform(scrollYProgress, [0, 1], ["-6%", "7%"]);
  const bgScale = useTransform(scrollYProgress, [0, 0.55], [1.09, 1]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.22], [0, 0.82]);
  const bgBlurPx = useTransform(scrollYProgress, [0, 0.26], [12, 0]);
  const bgBlur = useMotionTemplate`blur(${bgBlurPx}px)`;

  const item = (i: 0 | 1) => ({
    index: i + 1,
    title: easternInspiration.sections[i].title.trim(),
    description:
      lang === "en"
        ? en.easternInspiration.sections[i]?.description ??
          easternInspiration.sections[i].description
        : easternInspiration.sections[i].description,
  });

  return (
    <section
      ref={sectionRef}
      id="craft"
      data-scroll-section
      data-mood="ivory"
      data-rail="03"
      className="relative overflow-hidden"
    >
      {/* The material, held behind the whole chapter. */}
      <motion.div
        className="absolute inset-[-8%]"
        style={{ y: reduce ? 0 : bgY, scale: reduce ? 1 : bgScale }}
      >
        <motion.div
          className="absolute inset-0"
          style={{
            opacity: reduce ? 0.82 : bgOpacity,
            filter: reduce ? "none" : bgBlur,
          }}
        >
          <Image
            src="/images/natural-moss.png"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
      </motion.div>

      {/* Ivory holds the type areas and dissolves the seams into the
          neighbouring sections — the material stays visible in between. */}
      <div className="absolute inset-0 bg-bg/18" />
      <div className="absolute inset-x-0 top-0 h-[34vh] bg-gradient-to-b from-bg via-bg/58 to-transparent" />
      {/* the right two-thirds dissolve to ivory — the strands sit straight
          on that wash, no panel, and melt back into the moss toward centre */}
      <div className="absolute inset-y-0 right-0 w-full md:w-[64%] bg-gradient-to-l from-bg via-bg/68 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[28vh] bg-gradient-to-b from-transparent to-[#1F1E1B]" />

      <div className="relative max-w-content mx-auto px-6 md:px-10 pt-24 md:pt-28 pb-24 md:pb-32">
        <div className="grid grid-cols-[auto_1fr] gap-x-6 md:gap-x-10 max-w-2xl">
          <Reveal className="pt-1">
            <ChapterMark index={3} total={4} />
          </Reveal>
          <Reveal blur>
            <p className="eyebrow mb-5 max-w-xs">{easternInspiration.eyebrow}</p>
            <h2 className="section-title text-[clamp(1.9rem,4.4vw,3.2rem)] text-text-light">
              {easternInspiration.title}
            </h2>
            <span className="mt-6 block">
              <Rule />
            </span>
          </Reveal>
        </div>

        {/* the strands sit high, just under the heading, stacked on the
            right-hand ivory wash */}
        <div className="mt-[3vh] md:mt-6 flex md:justify-end">
          <Item {...item(0)} />
        </div>

        <div className="mt-12 md:mt-16 flex md:justify-end">
          <Item {...item(1)} />
        </div>
      </div>
    </section>
  );
}
