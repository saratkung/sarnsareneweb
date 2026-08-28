"use client";

// ============================================================
// SARNSARENE — /journey hero (100vh).
// Dark textile close-up with a slow scale + a scroll-linked
// fade/blur, and the title settling in line by line.
// Swap the image at lib/journey.ts → journeyHero.image
// ============================================================

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { journeyHero, journeyMotion } from "@/lib/journey";
import { useJourneyText } from "@/components/journey/primitives";

const { EASE, heroSettle } = journeyMotion;

export function JourneyHero({ id }: { id: string }) {
  const ref = useRef<HTMLElement>(null);
  const pick = useJourneyText();
  const reduce = useReducedMotion();

  // Drives the parallax / fade as the hero leaves the viewport.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const imgScale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1, 1.06]);
  const contentY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -60]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const blur = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 6]);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);

  const line = {
    hidden: { y: reduce ? 0 : "110%", opacity: reduce ? 0 : 1 },
    visible: (i: number) => ({
      y: "0%",
      opacity: 1,
      transition: { duration: reduce ? 0.5 : heroSettle, delay: 0.3 + i * 0.28, ease: EASE },
    }),
  };

  return (
    <section
      ref={ref}
      id={id}
      data-journey-section={id}
      className="relative flex h-[100svh] items-center justify-center overflow-hidden bg-[#0F0C0A] text-[#EDE4D6]"
    >
      {/* --- background --- */}
      <motion.div className="absolute inset-0" style={{ scale: imgScale, filter }}>
        <motion.div
          className="absolute inset-0"
          initial={{ scale: reduce ? 1 : 1.14, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            opacity: { duration: 1.4, ease: EASE },
            scale: { duration: reduce ? 0 : 3.2, ease: EASE },
          }}
        >
          <Image
            src={journeyHero.image}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/70" />
        <div className="absolute inset-0 bg-black/25" />
      </motion.div>

      {/* --- title --- */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 px-6 text-center"
      >
        <motion.h1
          initial="hidden"
          animate="visible"
          className="font-serif font-light uppercase leading-[1.25]"
        >
          <span className="block overflow-hidden text-[clamp(1.9rem,5.2vw,3.6rem)] tracking-[0.32em]">
            <motion.span custom={0} variants={line} className="block">
              {journeyHero.lineTop}
            </motion.span>
          </span>
          <span className="my-2 block overflow-hidden text-base italic tracking-[0.2em] opacity-70">
            <motion.span custom={1} variants={line} className="block">
              {journeyHero.lineMid}
            </motion.span>
          </span>
          <span className="block overflow-hidden text-[clamp(1.9rem,5.2vw,3.6rem)] tracking-[0.32em]">
            <motion.span custom={2} variants={line} className="block">
              {journeyHero.lineBottom}
            </motion.span>
          </span>
        </motion.h1>
      </motion.div>

      {/* --- scroll cue --- */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.6 }}
        style={{ opacity: contentOpacity }}
        className="absolute bottom-9 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3"
      >
        <span className="h-8 w-px bg-current/40" />
        <span className="text-[9px] tracking-[0.3em] text-current/70">
          {pick(journeyHero.scrollCue)}
        </span>
        <motion.span
          aria-hidden
          animate={reduce ? {} : { y: [0, 6, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="text-xs"
        >
          ↓
        </motion.span>
      </motion.div>
    </section>
  );
}
