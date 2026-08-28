// Maps Prisma rows -> the domain `Product` shape the UI already speaks.
// Keeping this boundary means every storefront/admin component built in
// Phases 1–3 keeps working unchanged now that the data comes from a DB.

import type { Prisma } from "@prisma/client";
import type {
  Product,
  ProductAccordionSection,
  ProductStatus,
} from "@/lib/commerce/types";

export const productInclude = {
  colors: { orderBy: { position: "asc" } },
  sizes: { orderBy: { position: "asc" } },
  variants: true,
} satisfies Prisma.ProductInclude;

type PrismaProductWithRelations = Prisma.ProductGetPayload<{ include: typeof productInclude }>;

export function toProduct(row: PrismaProductWithRelations): Product {
  const colorKeyById = new Map(row.colors.map((c) => [c.id, c.colorKey]));
  const sizeKeyById = new Map(row.sizes.map((s) => [s.id, s.sizeKey]));

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    categorySlug: row.categorySlug,
    collectionSlug: row.collectionSlug,
    status: row.status as ProductStatus,
    price: row.price,
    shortDescription: row.shortDescription,
    story: (row.story as string[]) ?? [],
    colors: row.colors.map((c) => ({
      id: c.colorKey,
      name: c.name,
      swatch: c.swatch,
      images: (c.images as string[]) ?? [],
    })),
    sizes: row.sizes.map((s) => ({
      id: s.sizeKey,
      name: s.name,
      note: s.note ?? undefined,
    })),
    variants: row.variants.map((v) => ({
      id: v.id,
      colorId: colorKeyById.get(v.colorId) ?? v.colorId,
      sizeId: sizeKeyById.get(v.sizeId) ?? v.sizeId,
      sku: v.sku,
      stock: v.stock,
      price: v.price ?? undefined,
    })),
    details: (row.details as ProductAccordionSection[]) ?? [],
    featuredRank: row.featuredRank ?? undefined,
    createdAt: row.createdAt.toISOString(),
  };
}
