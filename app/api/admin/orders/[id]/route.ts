import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdmin, currentAdminEmail } from "@/lib/commerce/admin/auth";
import { applyOrderAction } from "@/lib/commerce/orders/admin";
import { crossOriginBlock } from "@/lib/security/request";

export const dynamic = "force-dynamic";

const ActionSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("confirm_payment") }),
  z.object({ type: z.literal("start_preparing") }),
  z.object({
    type: z.literal("mark_shipped"),
    carrier: z.string().min(1).max(80),
    trackingNumber: z.string().min(1).max(80),
  }),
  z.object({ type: z.literal("mark_delivered") }),
  z.object({ type: z.literal("mark_completed") }),
  z.object({ type: z.literal("cancel"), reason: z.string().min(1).max(500) }),
  z.object({ type: z.literal("refund"), reason: z.string().min(1).max(500) }),
]);

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const blocked = crossOriginBlock(req);
  if (blocked) return blocked;
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  const parsed = z
    .object({ action: ActionSchema })
    .safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  }

  const result = await applyOrderAction(id, parsed.data.action, await currentAdminEmail());
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 409 });
  }
  return NextResponse.json({ order: result.order });
}
