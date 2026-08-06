import type { ReactNode } from "react";
import { theme, hexToRgbTriplet, type SectionKey } from "@/lib/theme";

export default function SectionTheme({ name, children }: { name: SectionKey; children: ReactNode }) {
  const override = theme.sections[name];

  const vars = {
    "--color-bg": hexToRgbTriplet(override.bg),
    "--color-text-light": hexToRgbTriplet(override.textLight),
    "--color-gold": hexToRgbTriplet(override.gold),
  } as React.CSSProperties;

  return <div style={vars}>{children}</div>;
}
