"use client";

import { createContext, useContext, type ReactNode } from "react";

/**
 * The palette class (`palette-shop` / `palette-admin`) in effect for the
 * current subtree. Portalled overlays read it so they re-skin correctly
 * even though they render outside the layout that set the palette.
 */
const PaletteContext = createContext<string>("");

export function PaletteProvider({
  value,
  children,
}: {
  value: string;
  children: ReactNode;
}) {
  return <PaletteContext.Provider value={value}>{children}</PaletteContext.Provider>;
}

export function usePalette(): string {
  return useContext(PaletteContext);
}
