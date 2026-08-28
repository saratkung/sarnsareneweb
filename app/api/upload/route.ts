import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { isAdmin } from "@/lib/commerce/admin/auth";
import { crossOriginBlock } from "@/lib/security/request";

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024; // 8 MB
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

// Server-side allowlist — the client only ever sends a slot id, never a
// path, so there is no way to write outside public/images.
const SLOT_TO_FILENAME: Record<string, string> = {
  hero: "hero.jpg",
  story: "story.jpg",
  "story-banner": "story-banner.jpg",
  "eastern-1": "eastern-1.jpg",
  "eastern-2": "eastern-2.jpg",
  "product-1": "product-1.jpg",
  "product-2": "product-2.jpg",
  "product-3": "product-3.jpg",
  "product-4": "product-4.jpg",
  "product-5-grey": "product-5-grey.jpg",
  journey: "journey.jpg",
  sustainability: "sustainability.jpg",
  // /journey page imagery (kept under public/images/journey/).
  "journey-hero": "journey/journey-hero.webp",
  "journey-listening": "journey/listening.webp",
  "journey-source": "journey/source.webp",
  "journey-voice": "journey/voice.webp",
  "journey-firstpiece": "journey/firstpiece.webp",
};

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Admin editing is disabled in production." }, { status: 403 });
  }
  const blocked = crossOriginBlock(req);
  if (blocked) return blocked;
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const form = await req.formData();
  const slot = form.get("slot");
  const file = form.get("file");

  if (typeof slot !== "string" || !(slot in SLOT_TO_FILENAME)) {
    return NextResponse.json({ error: "Unknown slot." }, { status: 400 });
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file." }, { status: 400 });
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: "Only JPEG, PNG or WebP images." }, { status: 400 });
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: "Image must be 8 MB or smaller." }, { status: 413 });
  }

  const filename = SLOT_TO_FILENAME[slot];
  const buffer = Buffer.from(await file.arrayBuffer());
  const dest = path.join(process.cwd(), "public", "images", filename);
  await writeFile(dest, buffer);

  return NextResponse.json({ ok: true, filename });
}
