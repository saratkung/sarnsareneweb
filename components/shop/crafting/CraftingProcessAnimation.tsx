"use client";

// ============================================================
// SARNSARENE — Crafting Process Animation.
//
// A plain state machine: a timer advances `stageIndex` through
// the seven stages and loops. Each stage plays its own one-shot
// mount animation (see stages.tsx). Pauses off-screen / when the
// tab is hidden; honours prefers-reduced-motion.
//
// Purely experiential — never reads or writes the real order
// status.
// ============================================================

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { STAGES } from "./timeline";
import {
  AssemblyStage,
  CraftDefs,
  CuttingStage,
  MaterialStage,
  PackingStage,
  QualityCheckStage,
  ReadyStage,
  StaticFinishedBag,
  StitchingStage,
} from "./stages";
import { ProcessIndicator } from "./ProcessIndicator";

const EASE = [0.22, 1, 0.36, 1] as const;

function StageScene({ index, d }: { index: number; d: number }) {
  switch (STAGES[index].key) {
    case "material":
      return <MaterialStage d={d} />;
    case "cutting":
      return <CuttingStage d={d} />;
    case "stitching":
      return <StitchingStage d={d} />;
    case "assembly":
      return <AssemblyStage d={d} />;
    case "quality":
      return <QualityCheckStage d={d} />;
    case "packing":
      return <PackingStage d={d} />;
    default:
      return <ReadyStage d={d} />;
  }
}

export function CraftingProcessAnimation() {
  const reduce = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [running, setRunning] = useState(true);

  // advance through the stages on a timer
  useEffect(() => {
    if (reduce || !running) return;
    const stage = STAGES[index];
    const ms = (stage.end - stage.start) * 1000;
    const id = window.setTimeout(
      () => setIndex((i) => (i + 1) % STAGES.length),
      ms,
    );
    return () => window.clearTimeout(id);
  }, [index, reduce, running]);

  // pause off-screen
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => setRunning(entry.isIntersecting),
      { threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // pause on hidden tab
  useEffect(() => {
    const onVis = () => setRunning(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const stage = STAGES[index];
  const durationS = stage.end - stage.start;

  if (reduce) {
    return (
      <div className="mx-auto w-full" style={{ maxWidth: 340 }}>
        <StaticFinishedBag />
        <div className="mt-4 text-center">
          <p className="font-serif text-[15px] tracking-[0.12em] text-text-light">
            Crafted with care
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-text-muted">
            Your pieces are being prepared by hand.
          </p>
        </div>
        <ProcessIndicator active={2} animate={false} />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="mx-auto w-full" style={{ maxWidth: 340 }}>
      {/* dynamic stage caption */}
      <div className="relative h-12 text-center">
        <AnimatePresence initial={false}>
          <motion.div
            key={stage.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="absolute inset-0"
          >
            <p className="font-serif text-[15px] tracking-[0.16em] text-text-light">
              {stage.label}
            </p>
            <p className="mt-1 font-serif text-[12px] italic font-light text-text-muted">
              {stage.caption}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* the craft scene */}
      <svg
        viewBox="0 0 300 230"
        className="w-full overflow-visible"
        role="img"
        aria-label={`Crafting stage ${index + 1} of 7: ${stage.label}`}
      >
        <CraftDefs />
        <AnimatePresence initial={false}>
          <motion.g
            key={stage.key}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <StageScene index={index} d={durationS} />
          </motion.g>
        </AnimatePresence>
      </svg>

      <ProcessIndicator active={index} />
    </div>
  );
}
