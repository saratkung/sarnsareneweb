import { NextResponse } from "next/server";
import { confirmPayment } from "@/lib/commerce/orders/service";
import { getOrderViewer } from "@/lib/commerce/orders/customer";

export const dynamic = "force-dynamic";

// Stands in for the payment-gateway webhook (PromptPay) or an admin's
// manual "payment received" (bank transfer).
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const result = await confirmPayment(id, await getOrderViewer());
  if (!result.ok) {
    const status = result.error.code === "NOT_FOUND" ? 404 : 402;
    return NextResponse.json({ error: result.error }, { status });
  }
  return NextResponse.json({ order: result.order });
}
