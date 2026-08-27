// ============================================================
// SARNSARENE — crafting animation master timeline.
// One 17s loop; all stages read from these boundaries.
// ============================================================

export type StageKey =
  | "material"
  | "cutting"
  | "stitching"
  | "assembly"
  | "quality"
  | "packing"
  | "ready";

export type Stage = {
  key: StageKey;
  index: number;
  label: string; // "03 / STITCHING"
  caption: string;
  start: number; // seconds
  end: number;
};

export const LOOP_SECONDS = 17;

export const STAGES: Stage[] = [
  { key: "material", label: "01 / MATERIAL", caption: "Selected with intention.", start: 0, end: 2.5 },
  { key: "cutting", label: "02 / CUTTING", caption: "Shaped with precision.", start: 2.5, end: 5 },
  { key: "stitching", label: "03 / STITCHING", caption: "Every line, considered.", start: 5, end: 8 },
  { key: "assembly", label: "04 / ASSEMBLY", caption: "Taking its final form.", start: 8, end: 10.5 },
  { key: "quality", label: "05 / QUALITY CHECK", caption: "Checking every detail.", start: 10.5, end: 12.5 },
  { key: "packing", label: "06 / PACKING", caption: "Prepared with care.", start: 12.5, end: 15 },
  { key: "ready", label: "07 / READY", caption: "Almost on its way to you.", start: 15, end: LOOP_SECONDS },
].map((s, index) => ({ ...s, index })) as Stage[];

export function stageAt(clock: number): Stage {
  const t = ((clock % LOOP_SECONDS) + LOOP_SECONDS) % LOOP_SECONDS;
  return STAGES.find((s) => t >= s.start && t < s.end) ?? STAGES[STAGES.length - 1];
}

/** Local progress 0..1 within whichever stage `clock` falls in. */
export function localProgress(clock: number): number {
  const s = stageAt(clock);
  const t = ((clock % LOOP_SECONDS) + LOOP_SECONDS) % LOOP_SECONDS;
  return clamp01((t - s.start) / (s.end - s.start));
}

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** Cubic ease-in-out — the house motion curve for this animation. */
export const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

// Palette (kept literal so the SVG reads identically on any surface).
export const INK = "#2B2B2B";
export const INK_SOFT = "rgba(43,43,43,0.55)";
export const INK_FAINT = "rgba(43,43,43,0.14)";
export const PAPER = "#F3EEE4";
export const LINEN = "#E8DFCE";
export const BRASS = "#9A7B4F";
export const BRASS_SOFT = "rgba(154,123,79,0.4)";
