import { NextResponse } from "next/server";
import { z } from "zod";
import { signIn, linkGuestOrders } from "@/lib/auth/accounts";
import { getCustomerRef } from "@/lib/commerce/orders/customer";
import { clientIp, rateLimit } from "@/lib/security/rate-limit";
import { crossOriginBlock } from "@/lib/security/request";

export const dynamic = "force-dynamic";

const Schema = z.object({
  email: z.string().email().max(200),
  password: z.string().min(1).max(200),
});

export async function POST(req: Request) {
  const blocked = crossOriginBlock(req);
  if (blocked) return blocked;

  const rl = rateLimit(`login:${clientIp(req)}`, { limit: 8, windowMs: 60_000 });
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many attempts. Please wait a minute." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } },
    );
  }

  const parsed = Schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter your email and password." }, { status: 400 });
  }

  const result = await signIn(parsed.data);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 401 });

  await linkGuestOrders(result.userId, {
    customerRef: (await getCustomerRef()) ?? undefined,
    email: parsed.data.email.trim().toLowerCase(),
  });
  return NextResponse.json({ ok: true, role: result.role });
}
