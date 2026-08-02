"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { hero } from "@/lib/content";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  return (
    <section className="relative min-h-[92vh] md:min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={hero.image}
          alt="SARNSARENE — the signature woven tote"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/50 to-bg/20" />
        <div className="absolute inset-0 bg-bg/30" />
      </div>

      <div className="relative z-10 max-w-content w-full mx-auto px-6 md:px-10">
        <div className="max-w-xl">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
            className="eyebrow mb-6"
          >
            {hero.eyebrow}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: EASE }}
            className="font-serif font-light uppercase text-text-light text-[clamp(2.4rem,6vw,4.6rem)] leading-[1.15] tracking-[0.04em] mb-6"
          >
            {hero.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.65, ease: EASE }}
            className="text-text-muted text-[15px] leading-relaxed max-w-md mb-10 font-light"
          >
            {hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9, ease: EASE }}
            className="flex flex-wrap items-center gap-6"
          >
            <a
              href={hero.ctaPrimary.href}
              className="inline-flex items-center px-8 py-3.5 bg-gold text-bg text-[11px] tracking-widest2 uppercase transition-colors duration-300 hover:bg-beige"
            >
              {hero.ctaPrimary.label}
            </a>
            <a
              href={hero.ctaSecondary.href}
              className="inline-flex items-center text-[11px] tracking-widest2 uppercase text-text-light border-b border-text-light/50 pb-1 transition-colors duration-300 hover:border-gold hover:text-gold"
            >
              {hero.ctaSecondary.label}
            </a>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.4 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3"
      >
        <span className="text-[9px] tracking-widest2 uppercase text-text-muted">
          Scroll
        </span>
        <span className="w-px h-10 bg-gold/70 animate-pulse" />
      </motion.div>
    </section>
  );
}
