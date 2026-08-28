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
 * (id / index / layout, pillar icons) are taken from the payload only
 * where they are constrained, else from the shipped defaults.
 */
function buildJourneyJson(d: any) {
  const def = raw as any;
  const LAYOUTS = new Set(["split", "full-bleed", "centered"]);
  const ICONS = new Set(["harmony", "balance", "serenity"]);

  const sections = def.sections.map((base: any, i: number) => {
    const inc = d?.sections?.[i] ?? {};
    return {
      id: base.id,
      index: base.index,
      layout: LAYOUTS.has(inc.layout) ? inc.layout : base.layout,
      kicker: bi(inc.kicker ?? base.kicker),
      bg: s(inc.bg ?? base.bg),
      ink: s(inc.ink ?? base.ink),
      accent: s(inc.accent ?? base.accent),
    };
  });

  const c = d?.content ?? {};
  const dc = def.content;
  const simple = (key: string) => {
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
    sections,
    content: {
      beginning: simple("beginning"),
      inspiration: simple("inspiration"),
      philosophy: {
        ...simple("philosophy"),
        pillars: dc.philosophy.pillars.map((b: any, i: number) => {
          const inc = c?.philosophy?.pillars?.[i] ?? {};
          return {
            icon: ICONS.has(inc.icon) ? inc.icon : b.icon,
            label: bi(inc.label ?? b.label),
          };
        }),
      },
      making: {
        ...simple("making"),
        steps: dc.making.steps.map((b: any, i: number) => ({
          label: bi(c?.making?.steps?.[i]?.label ?? b.label),
        })),
      },
      collection: {
        ...simple("collection"),
        palette: dc.collection.palette.map((b: any, i: number) => {
          const inc = c?.collection?.palette?.[i] ?? {};
          return { label: bi(inc.label ?? b.label), swatch: s(inc.swatch ?? b.swatch) };
        }),
        cta: {
          label: bi(c?.collection?.cta?.label ?? dc.collection.cta.label),
          href: s(c?.collection?.cta?.href ?? dc.collection.cta.href),
        },
      },
      continues: {
        heading: bi(c?.continues?.heading ?? dc.continues.heading),
        wordmark: s(c?.continues?.wordmark ?? dc.continues.wordmark),
        tagline: bi(c?.continues?.tagline ?? dc.continues.tagline),
        cta: {
          label: bi(c?.continues?.cta?.label ?? dc.continues.cta.label),
          href: s(c?.continues?.cta?.href ?? dc.continues.cta.href),
        },
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
