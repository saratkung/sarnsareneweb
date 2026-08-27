// ============================================================
// SARNSARENE — session auth (Phase 4).
//
// Opaque random token in an httpOnly cookie; only its SHA-256
// (salted with AUTH_SECRET) is stored in the Session table. Used
// for both customers and admins — role gates access.
// ============================================================

import { cache } from "react";
import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

const COOKIE = "sarnsarene_session";
const TTL_DAYS = 30;
const SECRET = process.env.AUTH_SECRET || "sarnsarene-dev-secret";

export type SessionUser = {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  role: "CUSTOMER" | "ADMIN";
};

function hashToken(token: string): string {
  return createHash("sha256").update(`${SECRET}:${token}`).digest("hex");
}

export async function createSession(userId: string): Promise<void> {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + TTL_DAYS * 24 * 60 * 60 * 1000);
  await prisma.session.create({ data: { userId, tokenHash: hashToken(token), expiresAt } });
  const store = await cookies();
  store.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
    secure: process.env.NODE_ENV === "production",
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (token) {
    await prisma.session.deleteMany({ where: { tokenHash: hashToken(token) } });
  }
  store.delete(COOKIE);
}

// Deduped per request — layout + page + nested components share one lookup.
export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: true },
  });
  if (!session || session.expiresAt < new Date()) {
    if (session) await prisma.session.deleteMany({ where: { id: session.id } });
    return null;
  }
  const u = session.user;
  return {
    id: u.id,
    email: u.email,
    name: u.name,
    phone: u.phone,
    role: u.role === "ADMIN" ? "ADMIN" : "CUSTOMER",
  };
});

export async function isAdmin(): Promise<boolean> {
  return (await getCurrentUser())?.role === "ADMIN";
}

/** Redirect to a login screen unless a user is signed in. */
export async function requireUser(next = "/account"): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect(`/account/login?next=${encodeURIComponent(next)}`);
  return user;
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/admin/login");
  return user;
}
