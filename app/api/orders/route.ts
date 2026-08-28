import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createOrder, listOrdersForViewer } from "@/lib/commerce/orders/service";
import { ensureCustomerRef, getOrderViewer } from "@/lib/commerce/orders/customer";
import { getCurrentUser } from "@/lib/auth/session";
import { clientIp, rateLimit } from "@/lib/security/rate-limit";
import { crossOriginBlock } from "@/lib/security/request";
import type { OrderError } from "@/lib/commerce/orders/types";

export const dynamic = "force-dynamic";

const CreateOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1).max(80),
        variantId: z.string().min(1).max(120),
        quantity: z.number().int().min(1).max(99),
      }),
    )
    .min(1)
    .max(50),
  contact: z.object({
    email: z.string().max(200),
    phone: z.string().max(40),
  }),
  shippingAddress: z.object({
    fullName: z.string().min(1).max(120),
    address: z.string().min(1).max(300),
    district: z.string().min(1).max(120),
    province: z.string().min(1).max(120),
    postalCode: z.string().min(1).max(10),
  }),
  delivery: z.enum(["standard", "express"]),
  payment: z.enum(["promptpay", "card", "bank_transfer"]),
});

function statusFor(code: OrderError["code"]): number {
  switch (code) {
    case "EMPTY_CART":
    case "VALIDATION":
      return 400;
    case "PAYMENT_FAILED":
      return 402;
    case "NOT_FOUND":
      return 404;
    case "OUT_OF_STOCK":
    case "PRODUCT_UNAVAILABLE":
    case "PRICE_CHANGED":
      return 409;
    default:
      return 500;
  }
}

export async function GET() {
  const viewer = await getOrderViewer();
  const orders = await listOrdersForViewer(viewer);
  return NextResponse.json({ orders });
}

export async function POST(req: NextRequest) {
  const blocked = crossOriginBlock(req);
  if (blocked) return blocked;

  const rl = rateLimit(`order:${clientIp(req)}`, { limit: 20, windowMs: 60_000 });
  if (!rl.ok) {
    return NextResponse.json(
      { error: { code: "VALIDATION", message: "Too many requests. Please wait a moment." } },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } },
    );
  }

  const parsed = CreateOrderSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: "VALIDATION", message: "Missing or invalid checkout details." } },
      { status: 400 },
    );
  }

  const [customerRef, user] = await Promise.all([ensureCustomerRef(), getCurrentUser()]);
  const idempotencyKey =
    req.headers.get("idempotency-key") ?? req.headers.get("Idempotency-Key") ?? undefined;

  const result = await createOrder(parsed.data, {
    customerRef,
    userId: user?.id,
    idempotencyKey,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: statusFor(result.error.code) });
  }
  return NextResponse.json(
    { order: result.order, deduped: result.deduped },
    { status: result.deduped ? 200 : 201 },
  );
}
