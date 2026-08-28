"use client";

// ============================================================
// SARNSARENE — /journey chapters 01–06.
// Each chapter is a <section> that reports itself to the progress
// nav via IntersectionObserver (see JourneyExperience.tsx, which
// keys off [data-journey-section]).
//
// Copy + images + colours: lib/journey.ts
// Motion primitives: components/journey/primitives.tsx
// ============================================================

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  journeySections,
  journeyContent,
  journeyMotion,
  type JourneySection,
} from "@/lib/journey";
import {
  Arrow,
  AnimatedLink,
  FadeIn,
  JourneyIcon,
  ParallaxImage,
  ProcessLine,
  TextReveal,
  useJourneyText,
} from "@/components/journey/primitives";

const { EASE } = journeyMotion;

const byId = Object.fromEntries(journeySections.map((s) => [s.id, s])) as Record<
  string,
  JourneySection
>;

// ---- Shared chapter shell -----------------------------------------

function Shell({
  section,
  children,
  className = "",
}: {
  section: JourneySection;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={section.id}
      data-journey-section={section.id}
      style={{ backgroundColor: section.bg, color: section.ink }}
      className={`relative w-full overflow-hidden transition-colors duration-700 ${className}`}
    >
      {children}
    </section>
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

// ---- 01 · THE BEGINNING ------------------------------------------

function Beginning() {
  const s = byId.beginning;
  const c = journeyContent.beginning;
  const pick = useJourneyText();
  return (
    <Shell section={s} className="min-h-[95vh]">
      <div className="mx-auto grid max-w-[1600px] items-center gap-y-12 px-6 py-28 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-x-16 md:px-16 md:py-36 lg:px-24">
        <div className="max-w-lg">
          <Kicker section={s} />
          <TextReveal
            text={pick(c.heading)}
            as="h2"
            className="font-serif text-[clamp(1.8rem,4vw,3rem)] font-light leading-[1.3]"
          />
          <FadeIn delay={0.3} className="mt-8 max-w-md">
            <p className="text-[13px] leading-loose opacity-70">{pick(c.body)}</p>
          </FadeIn>
        </div>

        <ParallaxImage
          src={c.image}
          alt={pick(c.imageAlt)}
          sizes="(max-width: 768px) 100vw, 55vw"
          className="aspect-[4/3] w-full md:aspect-[3/2]"
        />
      </div>
    </Shell>
  );
}

// ---- 02 · THE INSPIRATION ---------------------------------------

function Inspiration() {
  const s = byId.inspiration;
  const c = journeyContent.inspiration;
  const pick = useJourneyText();
  return (
    <Shell section={s} className="min-h-screen">
      <div className="absolute inset-0">
        <ParallaxImage
          src={c.image}
          alt={pick(c.imageAlt)}
          sizes="100vw"
          strength={90}
          className="h-full w-full"
          imgClassName="opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1c1814]/95 via-[#1c1814]/55 to-transparent" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-[1600px] items-center px-6 py-28 md:px-16 md:py-36 lg:px-24">
        <div className="max-w-xl">
          <Kicker section={s} />
          <TextReveal
            text={pick(c.heading)}
            as="h2"
            className="font-serif text-[clamp(1.8rem,4vw,3rem)] font-light leading-[1.3]"
          />
          <FadeIn delay={0.3} className="mt-8 max-w-md">
            <p className="text-[13px] leading-loose opacity-75">{pick(c.body)}</p>
          </FadeIn>
        </div>
      </div>
    </Shell>
  );
}

// ---- 03 · THE PHILOSOPHY --------------------------------------

function Philosophy() {
  const s = byId.philosophy;
  const c = journeyContent.philosophy;
  const pick = useJourneyText();
  const reduce = useReducedMotion();
  return (
    <Shell section={s} className="min-h-[95vh]">
      <div className="mx-auto grid max-w-[1600px] items-center gap-y-14 px-6 py-28 md:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] md:gap-x-16 md:px-16 md:py-36 lg:px-24">
        <div className="max-w-lg">
          <Kicker section={s} />
          <TextReveal
            text={pick(c.heading)}
            as="h2"
            className="font-serif text-[clamp(2.4rem,6vw,4.4rem)] font-light uppercase leading-[1.05] tracking-[0.04em]"
            stagger={0.16}
          />
          <FadeIn delay={0.35} className="mt-8 max-w-sm">
            <p className="text-[13px] leading-loose opacity-70">{pick(c.body)}</p>
          </FadeIn>

          <div className="mt-14 flex gap-10 sm:gap-16">
            {c.pillars.map((p, i) => (
              <motion.div
                key={p.icon}
                initial={{ opacity: 0, y: reduce ? 0 : 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.8, delay: 0.2 + i * 0.18, ease: EASE }}
                className="flex flex-col items-center gap-3"
              >
                <JourneyIcon name={p.icon} className="h-9 w-9 opacity-80" />
                <span className="text-[9px] tracking-[0.25em] opacity-70">
                  {pick(p.label)}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        <ParallaxImage
          src={c.image}
          alt={pick(c.imageAlt)}
          sizes="(max-width: 768px) 100vw, 42vw"
          className="aspect-[4/5] w-full"
        />
      </div>
    </Shell>
  );
}

// ---- 04 · THE MAKING ----------------------------------------

function Making() {
  const s = byId.making;
  const c = journeyContent.making;
  const pick = useJourneyText();
  return (
    <Shell section={s} className="min-h-screen">
      <div className="mx-auto max-w-[1600px] px-6 py-28 md:px-16 md:py-36 lg:px-24">
        <div className="grid items-center gap-y-12 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-x-16">
          <div className="max-w-md">
            <Kicker section={s} />
            <TextReveal
              text={pick(c.heading)}
              as="h2"
              className="font-serif text-[clamp(1.8rem,4vw,3rem)] font-light leading-[1.3]"
            />
            <FadeIn delay={0.3} className="mt-8">
              <p className="text-[13px] leading-loose opacity-70">{pick(c.body)}</p>
            </FadeIn>
          </div>

          <ParallaxImage
            src={c.image}
            alt={pick(c.imageAlt)}
            sizes="(max-width: 768px) 100vw, 55vw"
            className="aspect-[3/2] w-full"
          />
        </div>

        <div className="mt-20 md:mt-28">
          <ProcessLine steps={c.steps} pick={pick} accent={s.accent} />
        </div>
      </div>
    </Shell>
  );
}

// ---- 05 · THE FIRST COLLECTION ----------------------------

function Collection() {
  const s = byId.collection;
  const c = journeyContent.collection;
  const pick = useJourneyText();
  const reduce = useReducedMotion();
  return (
    <Shell section={s} className="min-h-[95vh]">
      <div className="mx-auto grid max-w-[1600px] items-center gap-y-14 px-6 py-28 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-x-16 md:px-16 md:py-36 lg:px-24">
        <div className="max-w-lg">
          <Kicker section={s} />
          <TextReveal
            text={pick(c.heading)}
            as="h2"
            className="font-serif text-[clamp(1.8rem,4vw,3rem)] font-light leading-[1.3]"
          />
          <FadeIn delay={0.3} className="mt-8 max-w-sm">
            <p className="text-[13px] leading-loose opacity-70">{pick(c.body)}</p>
          </FadeIn>

          <FadeIn delay={0.4} className="mt-10 flex items-center gap-5">
            {c.palette.map((p) => (
              <div key={p.swatch} className="flex flex-col items-center gap-2">
                <span
                  className="h-6 w-6 rounded-full ring-1 ring-black/10"
                  style={{ backgroundColor: p.swatch }}
                />
                <span className="text-[8px] tracking-[0.18em] opacity-60">
                  {pick(p.label)}
                </span>
              </div>
            ))}
          </FadeIn>

          <FadeIn delay={0.5} className="mt-12">
            <Link
              href={c.cta.href}
              className="group inline-flex items-center gap-3 border-b pb-1 text-[10px] tracking-[0.28em]"
              style={{ borderColor: s.accent }}
            >
              <AnimatedLink>{pick(c.cta.label)}</AnimatedLink>
              <Arrow />
            </Link>
          </FadeIn>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: reduce ? 1 : 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.4, ease: EASE }}
          className="aspect-[4/3] w-full"
        >
          <ParallaxImage
            src={c.image}
            alt={pick(c.imageAlt)}
            sizes="(max-width: 768px) 100vw, 55vw"
            strength={40}
            className="h-full w-full"
          />
        </motion.div>
      </div>
    </Shell>
  );
}

// ---- 06 · THE JOURNEY CONTINUES --------------------------

function Continues() {
  const s = byId.continues;
  const c = journeyContent.continues;
  const pick = useJourneyText();
  const reduce = useReducedMotion();
  return (
    <Shell section={s} className="min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 py-32 text-center">
        <FadeIn y={0} className="mb-10 flex items-center gap-4">
          <span className="text-[11px] tabular-nums tracking-[0.2em] opacity-70">
            {s.index}
          </span>
          <span className="h-px w-10" style={{ backgroundColor: s.accent }} />
          <span className="text-[10px] uppercase tracking-[0.32em] opacity-70">
            {pick(s.kicker)}
          </span>
        </FadeIn>

        <TextReveal
          text={pick(c.heading)}
          as="h2"
          className="font-serif text-[clamp(1.6rem,3.4vw,2.6rem)] font-light leading-[1.5]"
          stagger={0.18}
        />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: reduce ? 0.5 : 2, delay: 0.8, ease: EASE }}
          className="mt-16"
        >
          <p className="font-serif text-2xl uppercase tracking-[0.4em] md:text-3xl">
            {c.wordmark}
          </p>
          <p className="mt-4 text-[10px] tracking-[0.34em] opacity-60">
            {pick(c.tagline)}
          </p>
        </motion.div>

        <FadeIn delay={1.1} className="mt-16">
          <Link
            href={c.cta.href}
            className="group inline-flex flex-col items-center gap-3 text-[10px] tracking-[0.28em] opacity-80 transition-opacity hover:opacity-100"
          >
            <AnimatedLink>{pick(c.cta.label)}</AnimatedLink>
            <motion.span
              aria-hidden
              animate={reduce ? {} : { y: [0, 5, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            >
              ↓
            </motion.span>
          </Link>
        </FadeIn>
      </div>
    </Shell>
  );
}

export function JourneyChapters() {
  return (
    <>
      <Beginning />
      <Inspiration />
      <Philosophy />
      <Making />
      <Collection />
      <Continues />
    </>
  );
}
