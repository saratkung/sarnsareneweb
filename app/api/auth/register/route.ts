import { NextResponse } from "next/server";
import { z } from "zod";
import { registerCustomer, linkGuestOrders } from "@/lib/auth/accounts";
import { getCustomerRef } from "@/lib/commerce/orders/customer";
import { clientIp, rateLimit } from "@/lib/security/rate-limit";
import { crossOriginBlock } from "@/lib/security/request";

export const dynamic = "force-dynamic";

const Schema = z.object({
  email: z.string().email().max(200),
  password: z.string().min(8).max(200),
  name: z.string().max(120).optional(),
});

export async function POST(req: Request) {
  const blocked = crossOriginBlock(req);
  if (blocked) return blocked;

  const rl = rateLimit(`register:${clientIp(req)}`, { limit: 4, windowMs: 60_000 });
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many attempts. Please wait a minute." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } },
    );
  }

  const parsed = Schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Enter a valid email and a password of at least 8 characters." },
      { status: 400 },
    );
  }

  const result = await registerCustomer(parsed.data);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 409 });

  await linkGuestOrders(result.userId, {
    customerRef: (await getCustomerRef()) ?? undefined,
    email: parsed.data.email.trim().toLowerCase(),
  });
  return NextResponse.json({ ok: true });
}
