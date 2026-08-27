// ============================================================
// SARNSARENE — catalog seed data + pure helpers.
//
// Client-safe: NO node/fs imports. The storefront's client
// components import `categories`, `collections` and
// `filterAndSort` from here. Persistence + server accessors live
// in ../catalog.ts (which seeds itself from SEED_PRODUCTS on
// first run) and ./store.ts.
//
// Imagery reuses the existing brand assets in /public/images.
// ============================================================

import type {
  Category,
  Collection,
  Product,
  ProductColor,
  ProductVariant,
} from "@/lib/commerce/types";

export const CATEGORY_SLUGS = ["totes", "pouches", "accessories"] as const;
export const COLLECTION_SLUGS = ["signature", "everyday", "atelier"] as const;
export const PRODUCT_STATUSES = ["ACTIVE", "DRAFT", "SOLD_OUT", "ARCHIVED"] as const;

export const categories: Category[] = [
  { slug: "totes", name: "Totes" },
  { slug: "pouches", name: "Pouches" },
  { slug: "accessories", name: "Accessories" },
];

export const collections: Collection[] = [
  { slug: "signature", name: "The Signature Line" },
  { slug: "everyday", name: "Everyday" },
  { slug: "atelier", name: "Atelier Small Goods" },
];

// Shared detail shots layered after each colour's hero image.
const DETAIL_SHOTS = ["/images/story.jpg", "/images/eastern-1.jpg", "/images/eastern-2.jpg"];

function color(id: string, name: string, swatch: string, hero: string): ProductColor {
  return { id, name, swatch, images: [hero, ...DETAIL_SHOTS] };
}

const COLORS = {
  champagne: color("champagne-gold", "Champagne Gold", "#C9A86A", "/images/product-4.jpg"),
  onyx: color("onyx-black", "Onyx Black", "#2B2B2B", "/images/product-1.jpg"),
  sand: color("warm-sand", "Warm Sand", "#BC9A7A", "/images/product-2.jpg"),
  ivory: color("ivory-cream", "Ivory Cream", "#EDE4D3", "/images/product-3.jpg"),
  grey: color("dove-grey", "Dove Grey", "#A9A69F", "/images/product-5-grey.jpg"),
};

function grid(
  productId: string,
  colorIds: string[],
  sizeIds: string[],
  stockFor: (colorId: string, sizeId: string) => number,
): ProductVariant[] {
  const out: ProductVariant[] = [];
  for (const colorId of colorIds) {
    for (const sizeId of sizeIds) {
      out.push({
        id: `${productId}--${colorId}--${sizeId}`,
        colorId,
        sizeId,
        sku: `SR-${productId}-${colorId}-${sizeId}`.toUpperCase().replace(/[^A-Z0-9-]/g, ""),
        stock: Math.max(0, stockFor(colorId, sizeId)),
      });
    }
  }
  return out;
}

const TOTE_SIZES = [
  { id: "compact", name: "Compact", note: "26 × 22 × 11 cm — daily essentials" },
  { id: "regular", name: "Regular", note: "34 × 28 × 13 cm — the everyday carry" },
  { id: "weekender", name: "Weekender", note: "42 × 34 × 16 cm — travel & overnight" },
];

const POUCH_SIZES = [
  { id: "small", name: "Small", note: "16 × 11 cm" },
  { id: "medium", name: "Medium", note: "22 × 15 cm" },
];

const ONE_SIZE = [{ id: "one-size", name: "One Size" }];

const SHARED_DETAILS = [
  {
    title: "Materials",
    body: [
      "Hand-woven Thai lamphun cotton over a structured recycled base, finished with vegetable-tanned leather trim and gold-plated brass hardware.",
      "Every panel is woven on a traditional loom in small batches, so the grain of each piece is quietly unique.",
    ],
  },
  {
    title: "Fit & Size",
    body: [
      "Choose by how you carry: Compact for daily essentials, Regular for the everyday carry, Weekender for travel.",
      "Open the size guide for full measurements and volume.",
    ],
  },
  {
    title: "Care",
    body: [
      "Wipe gently with a soft, dry cloth. Keep away from prolonged direct sun and standing water.",
      "Store upright, loosely filled, in the provided dust bag.",
    ],
  },
  {
    title: "Shipping & Returns",
    body: [
      "Complimentary shipping within Thailand, 2–5 business days. Express delivery available at checkout.",
      "Unworn pieces may be returned within 14 days of delivery. Made-to-order colourways are final sale.",
    ],
  },
];

export const SEED_PRODUCTS: Product[] = [
  {
    id: "signature-tote",
    slug: "signature-tote",
    name: "The Signature Tote",
    categorySlug: "totes",
    collectionSlug: "signature",
    status: "ACTIVE",
    price: 12500,
    shortDescription: "The house silhouette — hand-woven, gold-finished, built to be lived with.",
    story: [
      "The piece SARNSARENE was founded on: a woven tote that carries the calm of a hand-loom into the rhythm of the city.",
      "Its structure holds its shape through years of daily use; its weave softens, quietly, into something that is only yours.",
    ],
    colors: [COLORS.champagne, COLORS.onyx, COLORS.sand],
    sizes: TOTE_SIZES,
    variants: grid(
      "signature-tote",
      ["champagne-gold", "onyx-black", "warm-sand"],
      ["compact", "regular", "weekender"],
      (c, s) => {
        if (c === "champagne-gold" && s === "weekender") return 2;
        if (c === "warm-sand" && s === "compact") return 0;
        return s === "regular" ? 18 : 9;
      },
    ),
    details: SHARED_DETAILS,
    featuredRank: 1,
    createdAt: "2026-02-01T00:00:00.000Z",
  },
  {
    id: "everyday-tote",
    slug: "everyday-tote",
    name: "The Everyday Tote",
    categorySlug: "totes",
    collectionSlug: "everyday",
    status: "ACTIVE",
    price: 8900,
    shortDescription: "A lighter, unlined weave for the days that ask for less.",
    story: [
      "The Signature weave, opened up: unlined, softer in the hand, and a little more forgiving of a full day.",
      "It folds flat when empty and stands when full — made for moving between places without ceremony.",
    ],
    colors: [COLORS.ivory, COLORS.grey, COLORS.sand],
    sizes: TOTE_SIZES.filter((s) => s.id !== "compact"),
    variants: grid(
      "everyday-tote",
      ["ivory-cream", "dove-grey", "warm-sand"],
      ["regular", "weekender"],
      (c, s) => (c === "dove-grey" && s === "weekender" ? 3 : s === "regular" ? 22 : 12),
    ),
    details: SHARED_DETAILS,
    featuredRank: 2,
    createdAt: "2026-03-12T00:00:00.000Z",
  },
  {
    id: "woven-pouch",
    slug: "woven-pouch",
    name: "The Woven Pouch",
    categorySlug: "pouches",
    collectionSlug: "atelier",
    status: "ACTIVE",
    price: 3200,
    shortDescription: "The tote's weave at desk scale — for the small things that scatter.",
    story: [
      "A zip pouch cut from the same hand-loomed cloth as the totes, sized to hold what otherwise gets lost.",
      "Slip it inside a Signature Tote, or carry it alone on the quietest days.",
    ],
    colors: [COLORS.champagne, COLORS.sand, COLORS.ivory],
    sizes: POUCH_SIZES,
    variants: grid(
      "woven-pouch",
      ["champagne-gold", "warm-sand", "ivory-cream"],
      ["small", "medium"],
      (c) => (c === "champagne-gold" ? 4 : 26),
    ),
    details: [
      SHARED_DETAILS[0],
      {
        title: "Fit & Size",
        body: [
          "Small holds cards, cables and keys. Medium fits a passport and a phone.",
          "See the size guide for exact measurements.",
        ],
      },
      SHARED_DETAILS[2],
      SHARED_DETAILS[3],
    ],
    featuredRank: 3,
    createdAt: "2026-04-02T00:00:00.000Z",
  },
  {
    id: "compact-tote",
    slug: "compact-tote",
    name: "The Compact Tote",
    categorySlug: "totes",
    collectionSlug: "everyday",
    status: "ACTIVE",
    price: 6900,
    shortDescription: "The smallest of the totes — a phone, a book, a day.",
    story: [
      "Pared back to the essentials: a short-handled weave that sits close to the body.",
      "For the errands and the evenings that do not need more than this.",
    ],
    colors: [COLORS.onyx, COLORS.grey],
    sizes: TOTE_SIZES.filter((s) => s.id !== "weekender"),
    variants: grid(
      "compact-tote",
      ["onyx-black", "dove-grey"],
      ["compact", "regular"],
      (c, s) => (c === "dove-grey" && s === "compact" ? 1 : 14),
    ),
    details: SHARED_DETAILS,
    featuredRank: 4,
    createdAt: "2026-05-20T00:00:00.000Z",
  },
  {
    id: "card-holder",
    slug: "card-holder",
    name: "The Woven Card Holder",
    categorySlug: "accessories",
    collectionSlug: "atelier",
    status: "ACTIVE",
    price: 1900,
    shortDescription: "Four cards, folded leather, a single woven panel.",
    story: [
      "The last off-cuts of each weaving run, given a second life as a slim card holder.",
      "Because the smallest object you carry every day is worth the same care as the largest.",
    ],
    colors: [COLORS.onyx, COLORS.sand],
    sizes: ONE_SIZE,
    variants: grid("card-holder", ["onyx-black", "warm-sand"], ["one-size"], (c) =>
      c === "onyx-black" ? 3 : 2,
    ),
    details: [
      {
        title: "Materials",
        body: ["Hand-woven cotton panel, vegetable-tanned leather, four card slots and a centre pocket."],
      },
      SHARED_DETAILS[2],
      SHARED_DETAILS[3],
    ],
    featuredRank: 5,
    createdAt: "2026-06-08T00:00:00.000Z",
  },
  {
    id: "atelier-clutch",
    slug: "atelier-clutch",
    name: "The Atelier Clutch",
    categorySlug: "pouches",
    collectionSlug: "signature",
    status: "SOLD_OUT",
    price: 5400,
    shortDescription: "An evening weave with a folded gold clasp — currently between runs.",
    story: [
      "A slim clutch finished with the teardrop brass clasp from the Signature line.",
      "Made in single small runs; the next weaving is on the loom now.",
    ],
    colors: [COLORS.champagne, COLORS.onyx],
    sizes: ONE_SIZE,
    variants: grid("atelier-clutch", ["champagne-gold", "onyx-black"], ["one-size"], () => 0),
    details: SHARED_DETAILS,
    featuredRank: 6,
    createdAt: "2026-06-30T00:00:00.000Z",
  },
];

// ---- pure helpers -------------------------------------------------------

export type SortKey = "featured" | "newest" | "price-asc" | "price-desc";

export type CatalogFilter = {
  category?: string;
  collection?: string;
  colorId?: string;
  sizeId?: string;
  minPrice?: number;
  maxPrice?: number;
};

/** Storefront-visible = live to shoppers (ACTIVE or SOLD_OUT, never DRAFT/ARCHIVED). */
export function isVisible(p: Product): boolean {
  return p.status === "ACTIVE" || p.status === "SOLD_OUT";
}

/**
 * Pure filter + sort. Exported so the client storefront can re-run it
 * locally as the shopper changes controls, without another round trip.
 */
export function filterAndSort(
  products: Product[],
  filter: CatalogFilter = {},
  sort: SortKey = "featured",
): Product[] {
  let items = products.filter(isVisible);

  if (filter.category) items = items.filter((p) => p.categorySlug === filter.category);
  if (filter.collection) items = items.filter((p) => p.collectionSlug === filter.collection);
  if (filter.colorId) items = items.filter((p) => p.colors.some((c) => c.id === filter.colorId));
  if (filter.sizeId) items = items.filter((p) => p.sizes.some((s) => s.id === filter.sizeId));
  if (typeof filter.minPrice === "number") items = items.filter((p) => p.price >= filter.minPrice!);
  if (typeof filter.maxPrice === "number") items = items.filter((p) => p.price <= filter.maxPrice!);

  const sorted = [...items];
  switch (sort) {
    case "newest":
      sorted.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
      break;
    case "price-asc":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      sorted.sort((a, b) => b.price - a.price);
      break;
    default:
      sorted.sort((a, b) => (a.featuredRank ?? 999) - (b.featuredRank ?? 999));
  }
  return sorted;
}

export function collectColors(products: Product[]): ProductColor[] {
  const seen = new Map<string, ProductColor>();
  for (const p of products.filter(isVisible)) {
    for (const c of p.colors) if (!seen.has(c.id)) seen.set(c.id, c);
  }
  return [...seen.values()];
}

export function collectSizes(products: Product[]): { id: string; name: string }[] {
  const seen = new Map<string, string>();
  for (const p of products.filter(isVisible)) {
    for (const s of p.sizes) if (!seen.has(s.id)) seen.set(s.id, s.name);
  }
  return [...seen.entries()].map(([id, name]) => ({ id, name }));
}

export function priceBoundsOf(products: Product[]): { min: number; max: number } {
  const prices = products.filter(isVisible).map((p) => p.price);
  return prices.length
    ? { min: Math.min(...prices), max: Math.max(...prices) }
    : { min: 0, max: 0 };
}
