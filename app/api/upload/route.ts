import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

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
};

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Admin editing is disabled in production." }, { status: 403 });
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

  const filename = SLOT_TO_FILENAME[slot];
  const buffer = Buffer.from(await file.arrayBuffer());
  const dest = path.join(process.cwd(), "public", "images", filename);
  await writeFile(dest, buffer);

  return NextResponse.json({ ok: true, filename });
}
