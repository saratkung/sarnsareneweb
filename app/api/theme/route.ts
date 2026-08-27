import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import * as theme from "@/lib/theme";
import { isAdmin } from "@/lib/commerce/admin/auth";
import { crossOriginBlock } from "@/lib/security/request";

function j(v: unknown) {
  return JSON.stringify(String(v ?? ""));
}

function generateThemeTs(d: typeof theme.theme) {
  const sectionEntries = theme.SECTION_KEYS.map((key) => {
    const s = d.sections[key] ?? { bg: "#FEF5E1", textLight: "#2B2B2B", gold: "#CDA364" };
    return `    ${key}: { bg: ${j(s.bg)}, textLight: ${j(s.textLight)}, gold: ${j(s.gold)} },`;
  }).join("\n");

  return `// ============================================================
// SARNSARENE — single source of truth for the site's color
// tokens and a few global visual knobs (overlay darkness,
// image brightness). Edited from /admin, read by layout.tsx
// (which turns it into CSS variables) and tailwind.config.ts
// (which points every color utility at those variables).
//
// Every section always has its own bg / heading+body ink /
// accent color — see \`sections\`. There is no on/off switch:
// each section simply renders whatever three colors are set
// here, so picking a color in /admin always has a visible
// effect, for every section, every time.
// ============================================================

export const SECTION_KEYS = [
  "nav",
  "announcement",
  "hero",
  "philosophy",
  "ourStory",
  "eastern",
  "signature",
  "quote",
  "manifesto",
  "collection",
  "journey",
  "services",
  "sustainability",
  "newsletter",
  "footer",
] as const;

export type SectionKey = (typeof SECTION_KEYS)[number];

export type SectionOverride = {
  bg: string;
  textLight: string;
  gold: string;
};

export const theme = {
  colors: {
    bg: ${j(d.colors.bg)},
    bgSecondary: ${j(d.colors.bgSecondary)},
    beige: ${j(d.colors.beige)},
    gold: ${j(d.colors.gold)},
    textLight: ${j(d.colors.textLight)},
  },
  sections: {
${sectionEntries}
  } as Record<SectionKey, SectionOverride>,
  heroOverlayOpacity: ${d.heroOverlayOpacity},
  journeyOverlayOpacity: ${d.journeyOverlayOpacity},
  imageBrightness: ${d.imageBrightness},
};

export type Theme = typeof theme;

export function hexToRgbTriplet(hex: string): string {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return \`\${r} \${g} \${b}\`;
}
`;
}

export async function GET() {
  return NextResponse.json(theme.theme);
}

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Admin editing is disabled in production." }, { status: 403 });
  }
  const blocked = crossOriginBlock(req);
  if (blocked) return blocked;
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const data = await req.json();
  const code = generateThemeTs(data);
  const dest = path.join(process.cwd(), "lib", "theme.ts");
  await writeFile(dest, code, "utf8");

  return NextResponse.json({ ok: true });
}
