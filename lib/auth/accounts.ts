// ============================================================
// SARNSARENE — account creation / sign-in (Phase 4).
// Customer + admin both flow through here.
// ============================================================

import { prisma } from "@/lib/db";
import { hashPassword, verifyPassword } from "./password";
import { createSession } from "./session";

export type AuthResult =
  | { ok: true; userId: string; role: "CUSTOMER" | "ADMIN" }
  | { ok: false; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function registerCustomer(input: {
  email: string;
  password: string;
  name?: string;
}): Promise<AuthResult> {
  const email = input.email.trim().toLowerCase();
  if (!EMAIL_RE.test(email)) return { ok: false, error: "Enter a valid email." };
  if (input.password.length < 8) {
    return { ok: false, error: "Password must be at least 8 characters." };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { ok: false, error: "An account with that email already exists." };

  const user = await prisma.user.create({
    data: {
      email,
      name: input.name?.trim() || null,
      role: "CUSTOMER",
      passwordHash: await hashPassword(input.password),
    },
  });
  await createSession(user.id);
  return { ok: true, userId: user.id, role: "CUSTOMER" };
}

export async function signIn(input: {
  email: string;
  password: string;
  requireRole?: "ADMIN";
}): Promise<AuthResult> {
  const email = input.email.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.passwordHash) return { ok: false, error: "Incorrect email or password." };

  const valid = await verifyPassword(input.password, user.passwordHash);
  if (!valid) return { ok: false, error: "Incorrect email or password." };

  if (input.requireRole && user.role !== input.requireRole) {
    return { ok: false, error: "This account is not authorised." };
  }

  await createSession(user.id);
  return { ok: true, userId: user.id, role: user.role === "ADMIN" ? "ADMIN" : "CUSTOMER" };
}

/**
 * Attach any guest orders (placed before sign-in with the same browser
 * ref or the same email) to the now-authenticated user.
 */
export async function linkGuestOrders(userId: string, opts: { customerRef?: string; email: string }) {
  const conditions: { customerRef?: string; email?: string }[] = [{ email: opts.email }];
  if (opts.customerRef) conditions.push({ customerRef: opts.customerRef });
  await prisma.order.updateMany({
    where: { userId: null, OR: conditions },
    data: { userId },
  });
}
