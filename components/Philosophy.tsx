"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReduceMotion } from "@/components/useReduceMotion";
import { philosophy, hero } from "@/lib/content";
import { en } from "@/lib/translations";
import { useLanguage } from "@/components/LanguageContext";
import { StaggerGroup, StaggerItem, ChapterMark } from "@/components/Reveal";

const EASE = [0.16, 1, 0.3, 1] as const;

function Diamond({ className = "" }: { className?: string }) {
  return (
    <span
      className={`block w-1.5 h-1.5 rotate-45 border border-text-light/45 ${className}`}
    />
  );
}

export default function Philosophy() {
  const { lang } = useLanguage();
  const reduce = useReduceMotion();
  const stageRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ["start start", "end start"],
  });
  // A slow push into the weave, and a quiet lift-and-dissolve of the
  // statement as the chapter is left behind.
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.04, 1.14]);
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const textY = useTransform(scrollYProgress, [0, 0.6], [0, -70]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      id="philosophy"
      data-scroll-section
      data-mood="ivory"
      data-rail="01"
    >
      {/* ── The statement, centred over the material ── */}
      <div
        ref={stageRef}
        className="relative min-h-[88svh] flex items-center justify-center overflow-hidden"
      >
        <motion.div
          className="absolute inset-[-7%]"
          style={reduce ? undefined : { scale: imgScale, y: imgY }}
        >
          <Image
            src="/images/philosophy-bg.png"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>

        {/* emerge from the hero's dark; settle into ivory below */}
        <div className="absolute inset-x-0 top-0 h-[24vh] bg-gradient-to-b from-[#1F1E1B] via-[#1F1E1B]/25 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-[30vh] bg-gradient-to-b from-transparent to-bg" />
        <div className="absolute inset-0 bg-[#F5F2EB]/12" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(54% 52% at 50% 48%, rgba(245,242,235,0.66) 0%, rgba(245,242,235,0.2) 58%, rgba(245,242,235,0) 84%)",
          }}
        />

        <ChapterMark
          index={1}
          total={4}
          className="hidden md:flex absolute left-6 lg:left-10 top-1/2 -translate-y-1/2"
        />

        <motion.div
          style={reduce ? undefined : { y: textY, opacity: textOpacity }}
          className="relative z-10 text-center px-6 max-w-2xl mx-auto"
        >
          <motion.p
            initial={reduce ? undefined : { opacity: 0, y: 18 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 1, ease: EASE }}
            className="eyebrow mb-7"
          >
            Philosophy
          </motion.p>

          <motion.h2
            initial={reduce ? undefined : { opacity: 0, y: 26, filter: "blur(8px)" }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1.4, delay: 0.12, ease: EASE }}
            className="section-title text-[clamp(2.2rem,5.4vw,4rem)] text-text-light"
          >
            {philosophy.title}
          </motion.h2>

          <motion.div
            initial={reduce ? undefined : { opacity: 0 }}
            whileInView={reduce ? undefined : { opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1.2, delay: 0.4, ease: EASE }}
            className="mt-10 flex flex-col items-center gap-6"
          >
            <Diamond />
            <p className="text-[10px] tracking-[0.5em] uppercase text-text-light/70">
              {hero.title}
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* ── SARN / SARENE ── */}
      <div className="bg-bg pt-6 pb-28 md:pb-40">
        <StaggerGroup className="relative max-w-3xl mx-auto px-6 md:px-10 grid grid-cols-1 sm:grid-cols-2 gap-16 sm:gap-x-20">
          <span className="hidden sm:flex absolute inset-y-2 left-1/2 -translate-x-1/2 w-px flex-col items-center">
            <span className="flex-1 w-px bg-text-light/15" />
            <Diamond className="my-2 shrink-0" />
            <span className="flex-1 w-px bg-text-light/15" />
          </span>

          {philosophy.items.map((item, i) => (
            <StaggerItem
              key={item.title}
              className="flex flex-col items-center text-center gap-5"
            >
              <h3 className="font-serif font-light text-3xl tracking-[0.26em] text-text-light">
                {item.title}
              </h3>
              <span className="h-px w-10 bg-gold/60" />
              <p className="body-copy text-[14px] max-w-xs">
                {lang === "en"
                  ? en.philosophy.items[i]?.description ?? item.description
                  : item.description}
              </p>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
