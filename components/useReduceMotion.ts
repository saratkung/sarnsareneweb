"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * `useReducedMotion`, made safe for SSR: framer reads the media query only
 * on the client, so the server (always "no preference") and the first
 * client render would otherwise disagree and trip a hydration mismatch
 * wherever `reduce` decides what gets rendered. This reports `false` until
 * after mount, then the real value — the swap happens post-hydration.
 */
export function useReduceMotion(): boolean {
  const raw = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? raw ?? false : false;
}
