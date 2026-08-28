import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import raw from "@/lib/journey.content.json";
import { isAdmin } from "@/lib/commerce/admin/auth";
import { crossOriginBlock } from "@/lib/security/request";

// GET  → current /journey content (for the admin editor to load).
// POST → overwrite lib/journey.content.json. Dev-only, admin-only,
//        same-origin-only — the file is committed + redeployed to
//        publish, exactly like /api/content and /api/theme.

const s = (v: unknown) => String(v ?? "");
const bi = (v: any) => ({ th: s(v?.th), en: s(v?.en) });

/**
 * Rebuild the file from a fixed schema so a broken or hostile payload
 * can never write malformed / unexpected JSON. Structural fields
 * (id / index / layout) always come from the shipped defaults.
 */
function buildJourneyJson(d: any) {
  const def = raw as any;
  const dc = def.content;
  const c = d?.content ?? {};

  const chapter = (key: string) => {
    const x = c[key] ?? {};
    const b = dc[key];
    return {
      image: s(x.image ?? b.image),
      imageAlt: bi(x.imageAlt ?? b.imageAlt),
      heading: bi(x.heading ?? b.heading),
      body: bi(x.body ?? b.body),
    };
  };

  return {
    _comment: def._comment,
    meta: {
      title: s(d?.meta?.title ?? def.meta.title),
      description: s(d?.meta?.description ?? def.meta.description),
      brand: s(d?.meta?.brand ?? def.meta.brand),
      sideLabel: s(d?.meta?.sideLabel ?? def.meta.sideLabel),
      backLabel: bi(d?.meta?.backLabel ?? def.meta.backLabel),
      backHref: s(d?.meta?.backHref ?? def.meta.backHref),
    },
    hero: {
      image: s(d?.hero?.image ?? def.hero.image),
      lineTop: s(d?.hero?.lineTop ?? def.hero.lineTop),
      lineMid: s(d?.hero?.lineMid ?? def.hero.lineMid),
      lineBottom: s(d?.hero?.lineBottom ?? def.hero.lineBottom),
      scrollCue: bi(d?.hero?.scrollCue ?? def.hero.scrollCue),
    },
    menu: {
      label: bi(d?.menu?.label ?? def.menu.label),
      siteLinks: def.menu.siteLinks.map((b: any, i: number) => {
        const inc = d?.menu?.siteLinks?.[i] ?? {};
        return { label: bi(inc.label ?? b.label), href: s(inc.href ?? b.href) };
      }),
    },
    intro: {
      bg: s(d?.intro?.bg ?? def.intro.bg),
      ink: s(d?.intro?.ink ?? def.intro.ink),
      accent: s(d?.intro?.accent ?? def.intro.accent),
      body: bi(d?.intro?.body ?? def.intro.body),
    },
    sections: def.sections.map((base: any, i: number) => {
      const inc = d?.sections?.[i] ?? {};
      return {
        id: base.id,
        index: base.index,
        layout: base.layout,
        kicker: bi(inc.kicker ?? base.kicker),
        bg: s(inc.bg ?? base.bg),
        ink: s(inc.ink ?? base.ink),
        accent: s(inc.accent ?? base.accent),
      };
    }),
    content: {
      listening: chapter("listening"),
      source: chapter("source"),
      voice: chapter("voice"),
      firstpiece: chapter("firstpiece"),
    },
    closing: {
      bg: s(d?.closing?.bg ?? def.closing.bg),
      ink: s(d?.closing?.ink ?? def.closing.ink),
      accent: s(d?.closing?.accent ?? def.closing.accent),
      lines: bi(d?.closing?.lines ?? def.closing.lines),
      body: bi(d?.closing?.body ?? def.closing.body),
      wordmark: s(d?.closing?.wordmark ?? def.closing.wordmark),
      tagline: bi(d?.closing?.tagline ?? def.closing.tagline),
      cta: {
        label: bi(d?.closing?.cta?.label ?? def.closing.cta.label),
        href: s(d?.closing?.cta?.href ?? def.closing.cta.href),
      },
    },
  };
}

export async function GET() {
  return NextResponse.json(raw);
}

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Admin editing is disabled in production." },
      { status: 403 },
    );
  }
  const blocked = crossOriginBlock(req);
  if (blocked) return blocked;
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const data = await req.json();
  const json = JSON.stringify(buildJourneyJson(data), null, 2) + "\n";
  const dest = path.join(process.cwd(), "lib", "journey.content.json");
  await writeFile(dest, json, "utf8");

  return NextResponse.json({ ok: true });
}
