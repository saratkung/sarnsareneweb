// ============================================================
// SARNSARENE — formatting helpers.
// Currency is always THB for the storefront. Dates are stored as
// ISO internally and rendered in a Thai-friendly long form.
// ============================================================

import type { Money } from "./types";

const thb = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

/** 2490 -> "THB 2,490" */
export function formatTHB(amount: Money): string {
  return `THB ${thb.format(Math.round(amount))}`;
}

/** 2490 -> "฿2,490" — compact form for tight UI */
export function formatBaht(amount: Money): string {
  return `฿${thb.format(Math.round(amount))}`;
}

const longDate = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

/** ISO -> "27 Aug 2026" (uppercased at the call site where the brand wants it) */
export function formatDate(iso: string): string {
  return longDate.format(new Date(iso));
}
