// ============================================================
// SARNSARENE — request guards for state-changing API routes (§21).
//
// httpOnly + SameSite=Lax cookies already block most CSRF; this
// adds a same-origin check as defence in depth for POST/PATCH/
// DELETE handlers.
// ============================================================

import { NextResponse } from "next/server";

/**
 * True when the request clearly originates from our own site.
 * Trusts `Sec-Fetch-Site` (modern browsers) and falls back to
 * comparing the `Origin` header against the request host.
 */
export function isSameOrigin(req: Request): boolean {
  const secFetchSite = req.headers.get("sec-fetch-site");
  if (secFetchSite) return secFetchSite === "same-origin" || secFetchSite === "none";

  const origin = req.headers.get("origin");
  if (!origin) return true; // non-browser client (curl, server-to-server)

  try {
    const originHost = new URL(origin).host;
    const host = req.headers.get("host");
    return !!host && originHost === host;
  } catch {
    return false;
  }
}

/** Returns a 403 response if the request is cross-origin, else null. */
export function crossOriginBlock(req: Request): NextResponse | null {
  return isSameOrigin(req)
    ? null
    : NextResponse.json({ error: "Cross-origin request blocked." }, { status: 403 });
}
