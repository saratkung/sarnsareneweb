// SARNSARENE order id: SR-YYMMDD-NNN  (NNN = per-day sequence, 1-based)

function pad(n: number, width: number): string {
  return String(n).padStart(width, "0");
}

/** The YYMMDD portion for a given date (defaults to now). */
export function orderDateKey(date = new Date()): string {
  const yy = pad(date.getFullYear() % 100, 2);
  const mm = pad(date.getMonth() + 1, 2);
  const dd = pad(date.getDate(), 2);
  return `${yy}${mm}${dd}`;
}

export function formatOrderId(dateKey: string, sequence: number): string {
  return `SR-${dateKey}-${pad(sequence, 3)}`;
}

/** e.g. "SR-260827-004" -> { dateKey: "260827", sequence: 4 } */
export function parseOrderId(
  id: string,
): { dateKey: string; sequence: number } | null {
  const m = /^SR-(\d{6})-(\d{3,})$/.exec(id.trim());
  if (!m) return null;
  return { dateKey: m[1], sequence: Number(m[2]) };
}
