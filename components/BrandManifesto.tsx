"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useMotionTemplate, useScroll, useTransform } from "framer-motion";
import { useReduceMotion } from "@/components/useReduceMotion";
import { brandManifesto } from "@/lib/content";
import { en } from "@/lib/translations";
import { useLanguage } from "@/components/LanguageContext";

function Diamond() {
  return (
    <span className="block w-2 h-2 rotate-45 border border-text-light/45 shrink-0" />
  );
}

/** A belief, revealed by its own scroll pass — a slow fade, rise and
 *  focus-pull, so the three arrive one after another without a snap. */
function Belief({
  index,
  text,
  divider,
}: {
  index: number;
  text: string;
  divider: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReduceMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.92", "start 0.42"],
  });
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [26, 0]);
  const blurPx = useTransform(scrollYProgress, [0, 1], [5, 0]);
  const blur = useMotionTemplate`blur(${blurPx}px)`;

  return (
    <motion.div
      ref={ref}
      style={{
        opacity: reduce ? 1 : opacity,
        y: reduce ? 0 : y,
        filter: reduce ? "none" : blur,
      }}
      className={divider ? "mt-10 pt-10 border-t border-text-light/12" : ""}
    >
      <div className="grid grid-cols-[auto_1fr] gap-x-5 md:gap-x-7">
        <span className="font-serif text-gold text-lg leading-none pt-1 tabular-nums">
          {String(index).padStart(2, "0")}
        </span>
        <div>
          <span className="block h-px w-8 bg-text-light/20 mb-4" />
          <p className="body-copy text-[14px] md:text-[15px]">{text}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function BrandManifesto() {
  const { lang } = useLanguage();
  const reduce = useReduceMotion();
  const title = lang === "en" ? en.brandManifesto.title : brandManifesto.title;
  const paragraphs =
    lang === "en" ? en.brandManifesto.paragraphs : brandManifesto.paragraphs;

  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // The cloth settles up from the foot of the page — slow, barely there.
  const linenY = useTransform(scrollYProgress, [0, 1], ["12%", "-5%"]);
  const linenOpacity = useTransform(scrollYProgress, [0.02, 0.34], [0, 1]);
  const linenBlurPx = useTransform(scrollYProgress, [0.02, 0.36], [9, 0]);
  const linenBlur = useMotionTemplate`blur(${linenBlurPx}px)`;

  // The statement rises and sharpens as the chapter comes to rest.
  const headRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: hp } = useScroll({
    target: headRef,
    offset: ["start 0.95", "start 0.35"],
  });
  const headOpacity = useTransform(hp, [0, 0.9], [0, 1]);
  const headY = useTransform(hp, [0, 1], [40, 0]);
  const headBlurPx = useTransform(hp, [0, 0.8], [6, 0]);
  const headBlur = useMotionTemplate`blur(${headBlurPx}px)`;
  const ruleScale = useTransform(hp, [0.45, 1], [0, 1]);

  return (
    <section
      ref={ref}
      id="manifesto"
      data-scroll-section
      data-mood="ivory"
      data-rail="04"
      className="relative bg-bg overflow-hidden pt-28 md:pt-40 pb-[24vh] md:pb-[26vh]"
    >
      {/* emerge from the dark of the quote above */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[15vh] bg-gradient-to-b from-[#1F1E1B] via-[#1F1E1B]/20 to-transparent"
      />

      {/* the cloth, drifting up along the foot of the section */}
      <motion.div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[40vh] md:h-[46vh]"
        style={{
          y: reduce ? 0 : linenY,
          opacity: reduce ? 0.95 : linenOpacity,
          filter: reduce ? "none" : linenBlur,
        }}
      >
        <Image
          src="/images/manifesto-linen.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-bottom"
        />
        <div className="absolute inset-x-0 top-0 h-3/4 bg-gradient-to-b from-bg via-bg/72 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#E8E1D5] to-transparent" />
      </motion.div>

      <div className="relative z-10 max-w-content mx-auto px-6 md:px-10">
        <div className="grid md:grid-cols-[auto_1.05fr_1fr] gap-y-12 md:gap-x-14 lg:gap-x-20">
          {/* chapter index — number, drawn line, diamond, number */}
          <motion.div
            style={{ opacity: reduce ? 1 : headOpacity }}
            className="hidden md:flex flex-col items-center gap-4 pt-1 text-[11px] tracking-[0.3em] tabular-nums text-text-light/45"
          >
            <span className="text-text-light/80">04</span>
            <span className="flex-1 w-px bg-text-light/20 my-1 min-h-[8rem]" />
            <Diamond />
            <span className="flex-1 w-px bg-text-light/20 my-1 min-h-[8rem]" />
            <span>04</span>
          </motion.div>

          {/* the statement */}
          <motion.div
            ref={headRef}
            style={{
              opacity: reduce ? 1 : headOpacity,
              y: reduce ? 0 : headY,
              filter: reduce ? "none" : headBlur,
            }}
            className="md:pr-6"
          >
            <p className="eyebrow mb-6">{brandManifesto.eyebrow}</p>
            <h2
              className={`display text-[clamp(2.4rem,6vw,4.6rem)] text-text-light ${
                lang === "th" ? "!font-normal leading-[1.12]" : ""
              }`}
            >
              {title}
            </h2>
            <motion.span
              style={{ scaleX: reduce ? 1 : ruleScale }}
              className="mt-9 block h-px w-16 origin-left bg-gold/70"
            />
          </motion.div>

          {/* the three beliefs */}
          <div className="md:pt-1">
            {paragraphs.map((p, i) => (
              <Belief key={i} index={i + 1} text={p} divider={i > 0} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
