"use client";

// ============================================================
// SARNSARENE — /journey body: an opening statement, four numbered
// chapters (01–04), and a closing reflection.
//
// Each chapter reports itself to the progress nav via
// IntersectionObserver (JourneyExperience.tsx keys off
// [data-journey-section]).
//
// Copy + images + colours: lib/journey.content.json
// Motion primitives: components/journey/primitives.tsx
// ============================================================

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  journeySections,
  journeyContent,
  journeyIntro,
  journeyClosing,
  journeyMotion,
  type JourneySection,
} from "@/lib/journey";
import {
  Arrow,
  AnimatedLink,
  FadeIn,
  ParallaxImage,
  TextReveal,
  useJourneyText,
} from "@/components/journey/primitives";

const { EASE } = journeyMotion;

// Split body copy into paragraphs on blank lines.
function paras(text: string) {
  return text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
}

function Body({ text, className = "" }: { text: string; className?: string }) {
  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {paras(text).map((p, i) => (
        <FadeIn key={i} delay={0.3 + i * 0.12} y={16} amount={0.5}>
          <p className="text-[13px] leading-loose opacity-70">{p}</p>
        </FadeIn>
      ))}
    </div>
  );
}

function Kicker({ section }: { section: JourneySection }) {
  const pick = useJourneyText();
  return (
    <FadeIn y={0} className="mb-8 flex items-center gap-4 md:mb-10">
      <span className="text-[11px] tabular-nums tracking-[0.2em] opacity-70">
        {section.index}
      </span>
      <span className="h-px w-10" style={{ backgroundColor: section.accent }} />
      <span className="text-[10px] uppercase tracking-[0.32em] opacity-70">
        {pick(section.kicker)}
      </span>
    </FadeIn>
  );
}

// ---- Opening statement (between hero and 01) ---------------------

function Intro() {
  const pick = useJourneyText();
  const c = journeyIntro;
  return (
    <section
      id="intro"
      data-journey-section="intro"
      style={{ backgroundColor: c.bg, color: c.ink }}
      className="relative w-full overflow-hidden transition-colors duration-700"
    >
      <div className="mx-auto max-w-2xl px-6 py-28 text-center md:py-40">
        <FadeIn y={0} className="mb-10 flex justify-center">
          <span className="h-10 w-px" style={{ backgroundColor: c.accent }} />
        </FadeIn>
        <div className="flex flex-col gap-6">
          {paras(pick(c.body)).map((p, i) => (
            <TextReveal
              key={i}
              text={p}
              as="p"
              className="font-serif text-[clamp(1.15rem,2.2vw,1.6rem)] font-light leading-[1.7]"
              delay={i * 0.15}
              stagger={0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ---- A numbered chapter (01–04) --------------------------------

function Chapter({ index }: { index: number }) {
  const s = journeySections[index];
  const c = journeyContent[s.id as keyof typeof journeyContent];
  const pick = useJourneyText();
  const reduce = useReducedMotion();

  const heading = (
    <TextReveal
      text={pick(c.heading)}
      as="h2"
      className="font-serif text-[clamp(1.7rem,3.6vw,2.8rem)] font-light leading-[1.35]"
    />
  );

  if (s.layout === "full-bleed") {
    return (
      <section
        id={s.id}
        data-journey-section={s.id}
        style={{ backgroundColor: s.bg, color: s.ink }}
        className="relative min-h-screen w-full overflow-hidden transition-colors duration-700"
      >
        <div className="absolute inset-0">
          <ParallaxImage
            src={c.image}
            alt={pick(c.imageAlt)}
            sizes="100vw"
            strength={90}
            className="h-full w-full"
            imgClassName="opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#14110e]/95 via-[#14110e]/55 to-transparent" />
        </div>

        <div className="relative mx-auto flex min-h-screen max-w-[1600px] items-center px-6 py-28 md:px-16 md:py-36 lg:px-24">
          <div className="max-w-xl">
            <Kicker section={s} />
            {heading}
            <Body text={pick(c.body)} className="mt-8 max-w-lg" />
          </div>
        </div>
      </section>
    );
  }

  // split — editorial two-column
  const imageFirst = index % 2 === 1;
  return (
    <section
      id={s.id}
      data-journey-section={s.id}
      style={{ backgroundColor: s.bg, color: s.ink }}
      className="relative min-h-[95vh] w-full overflow-hidden transition-colors duration-700"
    >
      <div
        className={`mx-auto grid max-w-[1600px] items-center gap-y-12 px-6 py-28 md:gap-x-16 md:px-16 md:py-36 lg:px-24 ${
          imageFirst
            ? "md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]"
            : "md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
        }`}
      >
        <div className={`max-w-lg ${imageFirst ? "md:order-2" : ""}`}>
          <Kicker section={s} />
          {heading}
          <Body text={pick(c.body)} className="mt-8 max-w-md" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: reduce ? 1 : 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.4, ease: EASE }}
          className={`aspect-[4/3] w-full md:aspect-[3/2] ${imageFirst ? "md:order-1" : ""}`}
        >
          <ParallaxImage
            src={c.image}
            alt={pick(c.imageAlt)}
            sizes="(max-width: 768px) 100vw, 55vw"
            strength={50}
            className="h-full w-full"
          />
        </motion.div>
      </div>
    </section>
  );
}

// ---- Closing reflection --------------------------------------

function Closing() {
  const pick = useJourneyText();
  const c = journeyClosing;
  const reduce = useReducedMotion();
  return (
    <section
      id="closing"
      data-journey-section="closing"
      style={{ backgroundColor: c.bg, color: c.ink }}
      className="relative min-h-screen w-full overflow-hidden transition-colors duration-700"
    >
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 py-32 text-center">
        <FadeIn y={0} className="mb-10 flex items-center gap-4">
          <span className="h-px w-10" style={{ backgroundColor: c.accent }} />
          <span className="text-[10px] uppercase tracking-[0.32em] opacity-70">
            THE JOURNEY CONTINUES
          </span>
          <span className="h-px w-10" style={{ backgroundColor: c.accent }} />
        </FadeIn>

        <TextReveal
          text={pick(c.lines)}
          as="h2"
          className="font-serif text-[clamp(1.4rem,3vw,2.2rem)] font-light leading-[1.6]"
          stagger={0.16}
        />

        <Body text={pick(c.body)} className="mt-12 max-w-xl [&_p]:text-center" />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: reduce ? 0.5 : 2, delay: 0.6, ease: EASE }}
          className="mt-16"
        >
          <p className="font-serif text-2xl uppercase tracking-[0.4em] md:text-3xl">
            {c.wordmark}
          </p>
          <p className="mt-4 text-[10px] tracking-[0.34em] opacity-60">
            {pick(c.tagline)}
          </p>
        </motion.div>

        <FadeIn delay={0.9} className="mt-16">
          <Link
            href={c.cta.href}
            className="group inline-flex flex-col items-center gap-3 text-[10px] tracking-[0.28em] opacity-80 transition-opacity hover:opacity-100"
          >
            <AnimatedLink>{pick(c.cta.label)}</AnimatedLink>
            <Arrow />
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}

export function JourneyChapters() {
  return (
    <>
      <Intro />
      {journeySections.map((_, i) => (
        <Chapter key={i} index={i} />
      ))}
      <Closing />
    </>
  );
}
