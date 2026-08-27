import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/session";
import { deleteAddress, setDefaultAddress } from "@/lib/commerce/account/addresses";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const { id } = await params;

  const parsed = z
    .object({ isDefault: z.literal(true) })
    .safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }
  const ok = await setDefaultAddress(user.id, id);
  return ok
    ? NextResponse.json({ ok: true })
    : NextResponse.json({ error: "Address not found." }, { status: 404 });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const { id } = await params;
  const ok = await deleteAddress(user.id, id);
  return ok
    ? NextResponse.json({ ok: true })
    : NextResponse.json({ error: "Address not found." }, { status: 404 });
}
