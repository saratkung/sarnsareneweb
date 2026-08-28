import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdmin, signInAdmin, signOutAdmin, currentAdminEmail } from "@/lib/commerce/admin/auth";
import { logAudit } from "@/lib/commerce/audit";
import { clientIp, rateLimit } from "@/lib/security/rate-limit";
import { crossOriginBlock } from "@/lib/security/request";

export const dynamic = "force-dynamic";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function GET() {
  return NextResponse.json({ admin: await isAdmin() });
}

export async function POST(req: Request) {
  const blocked = crossOriginBlock(req);
  if (blocked) return blocked;

  const rl = rateLimit(`admin-login:${clientIp(req)}`, { limit: 6, windowMs: 60_000 });
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many attempts. Please wait a minute." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } },
    );
  }

  const parsed = LoginSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter your email and password." }, { status: 400 });
  }

  const ok = await signInAdmin(parsed.data.email, parsed.data.password);
  if (!ok) {
    return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });
  }
  await logAudit({
    actor: await currentAdminEmail(),
    action: "auth.login",
    targetType: "auth",
    targetId: "admin",
    summary: "Admin signed in",
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  await signOutAdmin();
  return NextResponse.json({ ok: true });
}
