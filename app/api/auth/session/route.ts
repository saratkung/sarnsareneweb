import { NextResponse } from "next/server";
import { destroySession, getCurrentUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  return NextResponse.json({
    user: user ? { email: user.email, name: user.name, role: user.role } : null,
  });
}

export async function DELETE() {
  await destroySession();
  return NextResponse.json({ ok: true });
}
