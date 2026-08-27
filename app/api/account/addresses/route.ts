import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/session";
import { addAddress, listAddresses } from "@/lib/commerce/account/addresses";

export const dynamic = "force-dynamic";

const Schema = z.object({
  fullName: z.string().min(1).max(120),
  line1: z.string().min(1).max(300),
  district: z.string().min(1).max(120),
  province: z.string().min(1).max(120),
  postalCode: z.string().regex(/^\d{5}$/, "Postal code must be 5 digits"),
  isDefault: z.boolean().optional(),
});

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  return NextResponse.json({ addresses: await listAddresses(user.id) });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  const parsed = Schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Please complete every field (5-digit postal code)." }, { status: 400 });
  }
  const address = await addAddress(user.id, parsed.data);
  return NextResponse.json({ address }, { status: 201 });
}
