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
import { brand, footer } from "@/lib/content";
import { en } from "@/lib/translations";
import { useLanguage } from "@/components/LanguageContext";

const EASE = [0.16, 1, 0.3, 1] as const;

const socialLinks: Record<string, string> = {
  Instagram: "https://www.instagram.com/sarnsarene.official/",
  Facebook: "https://www.facebook.com/share/1HZ8AJyBuV/?mibextid=wwXIfr",
};

function Diamond() {
  return (
    <span className="block w-2 h-2 rotate-45 border border-text-light/40" />
  );
}

export default function Footer() {
  const { lang } = useLanguage();
  const reduce = useReduceMotion();
  const tagline = lang === "en" ? en.footer.tagline : footer.tagline;
  const follow = footer.columns.find((c) => c.title === "Follow Us");

  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });
  // The still life settles into view; the wordmark rises and sharpens.
  const bgOpacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.08, 1]);
  const bgY = useTransform(scrollYProgress, [0, 1], ["-4%", "3%"]);

  const markRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: mp } = useScroll({
    target: markRef,
    offset: ["start 0.95", "start 0.45"],
  });
  const markOpacity = useTransform(mp, [0, 0.9], [0, 1]);
  const markY = useTransform(mp, [0, 1], [40, 0]);
  const markBlurPx = useTransform(mp, [0, 0.85], [7, 0]);
  const markBlur = useMotionTemplate`blur(${markBlurPx}px)`;
  const ruleScale = useTransform(mp, [0.4, 1], [0, 1]);
  const lineScale = useTransform(mp, [0.5, 1], [0, 1]);

  return (
    <footer
      ref={ref}
      id="contact"
      className="relative bg-bg overflow-hidden"
    >
      {/* the still life, held behind the closing word */}
      <motion.div
        aria-hidden
        className="absolute inset-[-5%]"
        style={{
          opacity: reduce ? 1 : bgOpacity,
          scale: reduce ? 1 : bgScale,
          y: reduce ? 0 : bgY,
        }}
      >
        <Image
          src="/images/roots-linen.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
      </motion.div>
      {/* a whisper of ivory — keep it calm, let the type hold */}
      <div className="absolute inset-0 bg-bg/40" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(56% 46% at 50% 45%, rgba(245,242,235,0.58) 0%, rgba(245,242,235,0.14) 55%, rgba(245,242,235,0) 82%)",
        }}
      />
      {/* melt in from the manifesto above; settle at the very foot */}
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-bg to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg via-bg/55 to-transparent" />

      <div className="relative z-10 min-h-[86vh] flex flex-col">
        <motion.div
          ref={markRef}
          style={{
            opacity: reduce ? 1 : markOpacity,
            y: reduce ? 0 : markY,
            filter: reduce ? "none" : markBlur,
          }}
          className="flex-1 flex flex-col items-center justify-center text-center px-6"
        >
          <span className="mb-10">
            <Diamond />
          </span>
          <p className="font-serif font-light uppercase text-text-light text-[clamp(1.7rem,4vw,2.9rem)] tracking-[0.34em] md:tracking-[0.44em] pl-[0.34em] md:pl-[0.44em]">
            {brand.name}
          </p>
          <motion.span
            style={{ scaleX: reduce ? 1 : ruleScale }}
            className="mt-8 block h-px w-14 origin-center bg-gold/70"
          />
          <p className="mt-8 body-copy text-[12px] leading-[2] whitespace-pre-line">
            {tagline}
          </p>
        </motion.div>

        {/* the quiet business at the foot */}
        <div className="px-6 md:px-10 pb-9">
          <motion.span
            style={{ scaleX: reduce ? 1 : lineScale }}
            className="block h-px w-full origin-center bg-text-light/15 mb-7"
          />
          <div className="max-w-content mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[9.5px] tracking-[0.3em] uppercase text-text-light/45">
            <div className="flex items-center gap-5">
              {follow?.items.map((item) => (
                <a
                  key={item}
                  href={socialLinks[item] ?? "#"}
                  target={socialLinks[item] ? "_blank" : undefined}
                  rel={socialLinks[item] ? "noopener noreferrer" : undefined}
                  className="hover:text-text-light transition-colors duration-300"
                >
                  {item}
                </a>
              ))}
            </div>
            <span className="order-first sm:order-none">{footer.copyright}</span>
            <span>{footer.legal}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
