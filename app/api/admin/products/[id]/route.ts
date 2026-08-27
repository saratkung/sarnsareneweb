import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdmin, currentAdminEmail } from "@/lib/commerce/admin/auth";
import {
  deleteProduct,
  setColorImages,
  updateProductCore,
  updateVariants,
} from "@/lib/commerce/catalog";
import { CATEGORY_SLUGS, COLLECTION_SLUGS, PRODUCT_STATUSES } from "@/lib/commerce/catalog/data";
import { logAudit } from "@/lib/commerce/audit";
import { crossOriginBlock } from "@/lib/security/request";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

function revalidateStorefront(slug?: string) {
  revalidatePath("/shop");
  if (slug) revalidatePath(`/product/${slug}`);
}

const Body = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("core"),
    patch: z.object({
      name: z.string().min(1).max(120).optional(),
      shortDescription: z.string().max(300).optional(),
      price: z.number().int().min(0).max(10_000_000).optional(),
      status: z.enum(PRODUCT_STATUSES).optional(),
      categorySlug: z.enum(CATEGORY_SLUGS).optional(),
      collectionSlug: z.enum(COLLECTION_SLUGS).optional(),
      featuredRank: z.number().int().optional(),
      story: z.array(z.string().max(2000)).max(20).optional(),
    }),
  }),
  z.object({
    kind: z.literal("variants"),
    patches: z
      .array(
        z.object({
          variantId: z.string().min(1),
          stock: z.number().int().min(0).max(1_000_000),
          price: z.number().int().min(0).max(10_000_000).nullable().optional(),
        }),
      )
      .max(100),
  }),
  z.object({
    kind: z.literal("images"),
    colorId: z.string().min(1),
    images: z.array(z.string().max(500)).max(12),
  }),
]);

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const blocked = crossOriginBlock(req);
  if (blocked) return blocked;
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const { id } = await params;
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid update." }, { status: 400 });
  }
  const body = parsed.data;

  let product = null;
  let summary = "";
  if (body.kind === "core") {
    product = await updateProductCore(id, body.patch);
    summary = `Updated details for "${product?.name ?? id}"`;
  } else if (body.kind === "variants") {
    product = await updateVariants(id, body.patches);
    summary = `Updated stock/pricing for "${product?.name ?? id}"`;
  } else {
    product = await setColorImages(id, body.colorId, body.images);
    summary = `Updated images for "${product?.name ?? id}"`;
  }

  if (!product) return NextResponse.json({ error: "Product not found." }, { status: 404 });

  await logAudit({
    actor: await currentAdminEmail(),
    action: `product.update.${body.kind}`,
    targetType: body.kind === "variants" ? "inventory" : "product",
    targetId: id,
    summary,
  });
  revalidateStorefront(product.slug);
  return NextResponse.json({ product });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const blocked = crossOriginBlock(req);
  if (blocked) return blocked;
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const { id } = await params;
  const ok = await deleteProduct(id);
  if (!ok) return NextResponse.json({ error: "Product not found." }, { status: 404 });

  await logAudit({
    actor: await currentAdminEmail(),
    action: "product.delete",
    targetType: "product",
    targetId: id,
    summary: `Deleted product ${id}`,
  });
  revalidateStorefront();
  return NextResponse.json({ ok: true });
}
