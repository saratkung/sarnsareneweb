// ============================================================
// SARNSARENE — catalog accessors (server, Phase 4: Prisma).
//
// The ONLY surface the app uses to read or mutate products.
// Reads/writes hit the database via lib/db. Client components
// import static data (categories / collections / filterAndSort)
// from "@/lib/commerce/catalog/data" — this module is server-only.
// ============================================================

import { prisma } from "@/lib/db";
import type { Product, ProductColor, ProductStatus } from "./types";
import {
  filterAndSort,
  isVisible,
  priceBoundsOf,
  collectColors,
  collectSizes,
  type CatalogFilter,
  type SortKey,
} from "./catalog/data";
import { productInclude, toProduct } from "./catalog/mappers";
import { reserveWithTx, releaseWithTx, type StockLine, type ReserveResult } from "./catalog/inventory";

export { categories, collections, filterAndSort } from "./catalog/data";
export type { CatalogFilter, SortKey } from "./catalog/data";
export type { StockLine, ReserveResult } from "./catalog/inventory";

const VISIBLE = ["ACTIVE", "SOLD_OUT"];

// ---- storefront reads --------------------------------------------------

export async function allProducts(): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { status: { in: VISIBLE } },
    include: productInclude,
    orderBy: { featuredRank: "asc" },
  });
  return rows.map(toProduct);
}

export async function listProducts(
  opts: { filter?: CatalogFilter; sort?: SortKey } = {},
): Promise<Product[]> {
  const all = await allProducts();
  return filterAndSort(all, opts.filter ?? {}, opts.sort ?? "featured");
}

export async function getProduct(idOrSlug: string): Promise<Product | null> {
  const row = await prisma.product.findFirst({
    where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }], status: { in: VISIBLE } },
    include: productInclude,
  });
  return row ? toProduct(row) : null;
}

export async function getRelatedProducts(product: Product, limit = 3): Promise<Product[]> {
  const all = await allProducts();
  const related = all.filter(
    (p) => p.id !== product.id && p.collectionSlug === product.collectionSlug,
  );
  const fill = all.filter((p) => p.id !== product.id && !related.includes(p));
  return [...related, ...fill].slice(0, limit);
}

export async function priceBounds(): Promise<{ min: number; max: number }> {
  return priceBoundsOf(await allProducts());
}

export async function allColors(): Promise<ProductColor[]> {
  return collectColors(await allProducts());
}

export async function allSizes(): Promise<{ id: string; name: string }[]> {
  return collectSizes(await allProducts());
}

// ---- inventory --------------------------------------------------------

type Located = { product: Product; variant: Product["variants"][number] };

export async function getVariantById(variantId: string): Promise<Located | null> {
  const v = await prisma.productVariant.findUnique({
    where: { id: variantId },
    include: { product: { include: productInclude } },
  });
  if (!v) return null;
  const product = toProduct(v.product);
  const variant = product.variants.find((x) => x.id === variantId);
  return variant ? { product, variant } : null;
}

export function reserveStock(lines: StockLine[], orderId?: string): Promise<ReserveResult> {
  return prisma.$transaction((tx) => reserveWithTx(tx, lines, orderId));
}

export function releaseStock(lines: StockLine[], orderId?: string): Promise<void> {
  return prisma.$transaction((tx) => releaseWithTx(tx, lines, orderId));
}

// ---- admin reads / writes -------------------------------------------

export async function adminListProducts(): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    include: productInclude,
    orderBy: { featuredRank: "asc" },
  });
  return rows.map(toProduct);
}

export async function adminGetProduct(id: string): Promise<Product | null> {
  const row = await prisma.product.findUnique({ where: { id }, include: productInclude });
  return row ? toProduct(row) : null;
}

export type ProductCorePatch = Partial<
  Pick<
    Product,
    | "name"
    | "shortDescription"
    | "price"
    | "status"
    | "categorySlug"
    | "collectionSlug"
    | "featuredRank"
  >
> & { story?: string[] };

export async function updateProductCore(
  id: string,
  patch: ProductCorePatch,
): Promise<Product | null> {
  const exists = await prisma.product.findUnique({ where: { id }, select: { id: true } });
  if (!exists) return null;
  await prisma.product.update({
    where: { id },
    data: {
      ...(patch.name !== undefined && { name: patch.name.trim() }),
      ...(patch.shortDescription !== undefined && { shortDescription: patch.shortDescription.trim() }),
      ...(patch.price !== undefined && { price: Math.max(0, Math.round(patch.price)) }),
      ...(patch.status !== undefined && { status: patch.status }),
      ...(patch.categorySlug !== undefined && { categorySlug: patch.categorySlug }),
      ...(patch.collectionSlug !== undefined && { collectionSlug: patch.collectionSlug }),
      ...(patch.featuredRank !== undefined && { featuredRank: patch.featuredRank }),
      ...(patch.story !== undefined && {
        story: patch.story.map((s) => s.trim()).filter(Boolean),
      }),
    },
  });
  return adminGetProduct(id);
}

export type VariantStockPatch = { variantId: string; stock: number; price?: number | null };

export async function updateVariants(
  productId: string,
  patches: VariantStockPatch[],
): Promise<Product | null> {
  await prisma.$transaction(async (tx) => {
    for (const p of patches) {
      const v = await tx.productVariant.findFirst({
        where: { id: p.variantId, productId },
        select: { id: true, stock: true },
      });
      if (!v) continue;
      const nextStock = Math.max(0, Math.round(p.stock));
      const delta = nextStock - v.stock;
      await tx.productVariant.update({
        where: { id: p.variantId },
        data: {
          stock: nextStock,
          price:
            p.price === null
              ? null
              : typeof p.price === "number"
                ? Math.max(0, Math.round(p.price))
                : undefined,
        },
      });
      if (delta !== 0) {
        await tx.inventoryLog.create({
          data: { variantId: p.variantId, delta, reason: "admin_adjust" },
        });
      }
    }
    // reconcile status
    const product = await tx.product.findUnique({
      where: { id: productId },
      include: { variants: { select: { stock: true } } },
    });
    if (product) {
      const total = product.variants.reduce((s, v) => s + v.stock, 0);
      if (total === 0 && product.status === "ACTIVE") {
        await tx.product.update({ where: { id: productId }, data: { status: "SOLD_OUT" } });
      } else if (total > 0 && product.status === "SOLD_OUT") {
        await tx.product.update({ where: { id: productId }, data: { status: "ACTIVE" } });
      }
    }
  });
  return adminGetProduct(productId);
}

export async function setColorImages(
  productId: string,
  colorId: string,
  images: string[],
): Promise<Product | null> {
  const color = await prisma.productColor.findFirst({
    where: { productId, colorKey: colorId },
    select: { id: true },
  });
  if (!color) return null;
  // only same-origin paths or http(s) URLs — never javascript:/data: etc.
  const cleaned = images
    .map((s) => s.trim())
    .filter((s) => /^(\/[^\s]*|https?:\/\/[^\s]+)$/i.test(s));
  if (cleaned.length) {
    await prisma.productColor.update({ where: { id: color.id }, data: { images: cleaned } });
  }
  return adminGetProduct(productId);
}

export type CreateProductInput = {
  name: string;
  price: number;
  categorySlug: string;
  collectionSlug: string;
  shortDescription: string;
  status: ProductStatus;
};

const SLUG_RE = /[^a-z0-9]+/g;

export async function createProduct(input: CreateProductInput): Promise<Product> {
  const base =
    input.name.toLowerCase().trim().replace(SLUG_RE, "-").replace(/^-|-$/g, "") || "product";
  let slug = base;
  let n = 2;
  while (await prisma.product.findFirst({ where: { OR: [{ slug }, { id: slug }] } })) {
    slug = `${base}-${n++}`;
  }

  const count = await prisma.product.count();
  await prisma.product.create({
    data: {
      id: slug,
      slug,
      name: input.name.trim(),
      categorySlug: input.categorySlug,
      collectionSlug: input.collectionSlug,
      status: input.status,
      price: Math.max(0, Math.round(input.price)),
      shortDescription: input.shortDescription.trim(),
      story: [],
      details: [],
      featuredRank: count + 1,
      colors: {
        create: [
          { colorKey: "onyx-black", name: "Onyx Black", swatch: "#2B2B2B", images: ["/images/product-1.jpg"], position: 0 },
        ],
      },
      sizes: { create: [{ sizeKey: "one-size", name: "One Size", position: 0 }] },
    },
  });

  const created = await prisma.product.findUniqueOrThrow({
    where: { id: slug },
    include: { colors: true, sizes: true },
  });
  await prisma.productVariant.create({
    data: {
      id: `${slug}--onyx-black--one-size`,
      productId: slug,
      colorId: created.colors[0].id,
      sizeId: created.sizes[0].id,
      sku: `SR-${slug}-ONYX-BLACK-ONE-SIZE`.toUpperCase().replace(/[^A-Z0-9-]/g, ""),
      stock: 0,
    },
  });

  return adminGetProduct(slug) as Promise<Product>;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const exists = await prisma.product.findUnique({ where: { id }, select: { id: true } });
  if (!exists) return false;
  await prisma.product.delete({ where: { id } }); // cascades to colors/sizes/variants
  return true;
}

export type LowStockRow = {
  productId: string;
  productName: string;
  variantId: string;
  colorName: string;
  sizeName: string;
  stock: number;
};

export async function lowStockVariants(threshold = 4): Promise<LowStockRow[]> {
  const variants = await prisma.productVariant.findMany({
    where: { stock: { lte: threshold }, product: { status: { not: "ARCHIVED" } } },
    include: { product: { select: { id: true, name: true } }, color: true, size: true },
    orderBy: { stock: "asc" },
  });
  return variants.map((v) => ({
    productId: v.product.id,
    productName: v.product.name,
    variantId: v.id,
    colorName: v.color.name,
    sizeName: v.size.name,
    stock: v.stock,
  }));
}

// re-export for callers that used the old helper name
export { isVisible };
