"use client";

// Shared plumbing for Modal + Drawer: a portal, body-scroll lock,
// Escape-to-close, and a restrained motion vocabulary (fade + soft
// slide) consistent with the rest of the site.

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { usePalette } from "@/components/theme/palette";

export function Portal({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const palette = usePalette();
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  // `display: contents` keeps the wrapper out of layout (so position:fixed
  // children still anchor to the viewport) while its CSS custom properties
  // still cascade into them.
  return createPortal(
    <div className={palette || undefined} style={{ display: "contents" }}>
      {children}
    </div>,
    document.body,
  );
}

export function useLockBodyScroll(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [active]);
}

export function useEscape(active: boolean, onEscape: () => void) {
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onEscape();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, onEscape]);
}

/** Move focus into the panel on open, restore it on close. */
export function useFocusOnOpen(active: boolean) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!active) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    ref.current?.focus();
    return () => previouslyFocused?.focus?.();
  }, [active]);
  return ref;
}

export const OVERLAY_EASE = [0.16, 1, 0.3, 1] as const;
