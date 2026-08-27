// ============================================================
// SARNSARENE — admin auth facade (Phase 4).
//
// Thin wrappers over the shared session layer. Admin = a User row
// with role "ADMIN" (seeded by `npm run db:seed`). Kept as a
// separate module so admin routes/pages import a stable surface.
// ============================================================

import { signIn } from "@/lib/auth/accounts";
import { destroySession, getCurrentUser, isAdmin, requireAdmin } from "@/lib/auth/session";

export { isAdmin, requireAdmin };

export async function currentAdminEmail(): Promise<string> {
  return (await getCurrentUser())?.email ?? "admin";
}

export async function signInAdmin(email: string, password: string): Promise<boolean> {
  const res = await signIn({ email, password, requireRole: "ADMIN" });
  return res.ok;
}

export async function signOutAdmin(): Promise<void> {
  await destroySession();
}

/** Kept for call sites that log an audit actor before we look up the email. */
export const ADMIN_ACTOR = "admin";
