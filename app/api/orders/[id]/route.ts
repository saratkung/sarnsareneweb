import { NextResponse } from "next/server";
import { getOrderForViewer } from "@/lib/commerce/orders/service";
import { getOrderViewer } from "@/lib/commerce/orders/customer";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const order = await getOrderForViewer(id, await getOrderViewer());
  if (!order) {
    return NextResponse.json(
      { error: { code: "NOT_FOUND", message: "Order not found." } },
      { status: 404 },
    );
  }
  return NextResponse.json({ order });
}
