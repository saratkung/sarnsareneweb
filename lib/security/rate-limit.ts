// ============================================================
// SARNSARENE — in-process rate limiter (Phase 5).
//
// Fixed-window counter keyed by IP + bucket name. This protects a
// single instance; a multi-instance deployment should back this
// with Redis / Upstash (same `rateLimit()` signature).
// ============================================================

type Entry = { count: number; resetAt: number };

const store = new Map<string, Entry>();
let lastSweep = 0;

function sweep(now: number) {
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [key, entry] of store) {
    if (entry.resetAt <= now) store.delete(key);
  }
}

export type RateResult = { ok: boolean; remaining: number; retryAfter: number };

export function rateLimit(
  key: string,
  opts: { limit: number; windowMs: number },
): RateResult {
  const now = Date.now();
  sweep(now);

  const entry = store.get(key);
  if (!entry || entry.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + opts.windowMs });
    return { ok: true, remaining: opts.limit - 1, retryAfter: 0 };
  }

  entry.count += 1;
  if (entry.count > opts.limit) {
    return {
      ok: false,
      remaining: 0,
      retryAfter: Math.ceil((entry.resetAt - now) / 1000),
    };
  }
  return { ok: true, remaining: opts.limit - entry.count, retryAfter: 0 };
}

/** Best-effort client IP from proxy headers. */
export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "local";
}
