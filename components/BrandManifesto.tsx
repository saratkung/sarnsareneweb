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
import { brandManifesto } from "@/lib/content";
import { en } from "@/lib/translations";
import { useLanguage } from "@/components/LanguageContext";
import { Reveal } from "@/components/Reveal";

const EASE = [0.16, 1, 0.3, 1] as const;

function Diamond() {
  return (
    <span className="block w-2 h-2 rotate-45 border border-text-light/45 shrink-0" />
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
  // The cloth settles up from the foot of the page.
  const linenY = useTransform(scrollYProgress, [0, 1], ["14%", "-6%"]);
  const linenOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const linenBlurPx = useTransform(scrollYProgress, [0, 0.32], [8, 0]);
  const linenBlur = useMotionTemplate`blur(${linenBlurPx}px)`;

  return (
    <section
      ref={ref}
      id="manifesto"
      data-scroll-section
      data-mood="ivory"
      data-rail="04"
      className="relative bg-bg overflow-hidden pt-24 md:pt-32 pb-[24vh] md:pb-[26vh]"
    >
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
          <Reveal className="hidden md:flex flex-col items-center gap-4 pt-1 text-[11px] tracking-[0.3em] tabular-nums text-text-light/45">
            <span className="text-text-light/80">04</span>
            <span className="flex-1 w-px bg-text-light/20 my-1 min-h-[8rem]" />
            <Diamond />
            <span className="flex-1 w-px bg-text-light/20 my-1 min-h-[8rem]" />
            <span>04</span>
          </Reveal>

          {/* the statement */}
          <Reveal blur className="md:pr-6">
            <p className="eyebrow mb-6">{brandManifesto.eyebrow}</p>
            <h2
              className={`display text-[clamp(2.4rem,6vw,4.6rem)] text-text-light ${
                lang === "th" ? "!font-normal leading-[1.12]" : ""
              }`}
            >
              {title}
            </h2>
            <motion.span
              initial={reduce ? undefined : { scaleX: 0 }}
              whileInView={reduce ? undefined : { scaleX: 1 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 1.2, delay: 0.25, ease: EASE }}
              className="mt-9 block h-px w-16 origin-left bg-gold/70"
            />
          </Reveal>

          {/* the three beliefs */}
          <div className="md:pt-1">
            {paragraphs.map((p, i) => (
              <Reveal
                key={i}
                blur
                delay={i * 0.12}
                className={
                  i > 0 ? "mt-9 pt-9 border-t border-text-light/12" : ""
                }
              >
                <div className="grid grid-cols-[auto_1fr] gap-x-5 md:gap-x-7">
                  <span className="font-serif text-gold text-lg leading-none pt-1 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <span className="block h-px w-8 bg-text-light/20 mb-4" />
                    <p className="body-copy text-[14px] md:text-[15px]">{p}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
