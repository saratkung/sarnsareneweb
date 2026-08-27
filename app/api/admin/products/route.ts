import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdmin, currentAdminEmail } from "@/lib/commerce/admin/auth";
import { createProduct } from "@/lib/commerce/catalog";
import { CATEGORY_SLUGS, COLLECTION_SLUGS, PRODUCT_STATUSES } from "@/lib/commerce/catalog/data";
import { logAudit } from "@/lib/commerce/audit";
import { crossOriginBlock } from "@/lib/security/request";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

const CreateSchema = z.object({
  name: z.string().min(1).max(120),
  price: z.number().int().min(0).max(10_000_000),
  categorySlug: z.enum(CATEGORY_SLUGS),
  collectionSlug: z.enum(COLLECTION_SLUGS),
  shortDescription: z.string().max(300).default(""),
  status: z.enum(PRODUCT_STATUSES).default("DRAFT"),
});

export async function POST(req: Request) {
  const blocked = crossOriginBlock(req);
  if (blocked) return blocked;
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const parsed = CreateSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Name, price, category and collection are required." }, { status: 400 });
  }

  const product = await createProduct(parsed.data);
  await logAudit({
    actor: await currentAdminEmail(),
    action: "product.create",
    targetType: "product",
    targetId: product.id,
    summary: `Created product "${product.name}"`,
  });
  revalidatePath("/shop");
  return NextResponse.json({ product }, { status: 201 });
}
