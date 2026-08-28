// ============================================================
// SARNSARENE — order viewer identity.
//
// A guest is tracked by the httpOnly `sarnsarene_customer` cookie.
// A signed-in customer is also matched by userId, so their orders
// follow them across devices once linked (see lib/auth/accounts).
// ============================================================

import { cookies } from "next/headers";
import { getCurrentUser } from "@/lib/auth/session";

export const CUSTOMER_COOKIE = "sarnsarene_customer";
const ONE_YEAR = 60 * 60 * 24 * 365;

export async function getCustomerRef(): Promise<string | null> {
  const store = await cookies();
  return store.get(CUSTOMER_COOKIE)?.value ?? null;
}

/** Read the guest ref, creating one if absent (Route Handler / Server Action only). */
export async function ensureCustomerRef(): Promise<string> {
  const store = await cookies();
  const existing = store.get(CUSTOMER_COOKIE)?.value;
  if (existing) return existing;

  const ref = `cus_${crypto.randomUUID()}`;
  store.set(CUSTOMER_COOKIE, ref, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: ONE_YEAR,
    secure: process.env.NODE_ENV === "production",
  });
  return ref;
}

export type OrderViewer = { customerRef: string | null; userId: string | null };

export async function getOrderViewer(): Promise<OrderViewer> {
  const [ref, user] = await Promise.all([getCustomerRef(), getCurrentUser()]);
  return { customerRef: ref, userId: user?.id ?? null };
}
