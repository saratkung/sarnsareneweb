"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

export function fadeUpVariant(delay = 0): Variants {
  return {
    hidden: { opacity: 0, y: 36 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, delay, ease: EASE },
    },
  };
}

export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children?: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "span";
}) {
  const MotionTag = as === "span" ? motion.span : motion.div;
  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeUpVariant(delay)}
    >
      {children}
    </MotionTag>
  );
}

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.14, delayChildren: 0.05 },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE },
  },
};

export function StaggerGroup({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={staggerContainer}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={className} variants={staggerItem}>
      {children}
    </motion.div>
  );
}
