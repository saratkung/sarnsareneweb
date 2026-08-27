"use client";

import { motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

export function ConfirmedMark() {
  return (
    <motion.svg
      width="44"
      height="44"
      viewBox="0 0 44 44"
      className="mx-auto mb-8"
      initial="hidden"
      animate="visible"
    >
      <motion.circle
        cx="22"
        cy="22"
        r="20"
        fill="none"
        stroke="rgb(var(--color-gold))"
        strokeWidth="1"
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          visible: { pathLength: 1, opacity: 1, transition: { duration: 0.7, ease: EASE } },
        }}
      />
      <motion.path
        d="M14 22.5l5.5 5.5L31 16"
        fill="none"
        stroke="rgb(var(--color-text-light))"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={{
          hidden: { pathLength: 0 },
          visible: { pathLength: 1, transition: { duration: 0.5, delay: 0.5, ease: EASE } },
        }}
      />
    </motion.svg>
  );
}
