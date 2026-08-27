// ============================================================
// SARNSARENE — Commerce domain types.
//
// These are the shapes the storefront, cart and checkout speak
// in. They are intentionally close to what a database schema
// would hold (Phase 4: Prisma), so moving from the mock catalog
// to a real API later is a matter of swapping the data source,
// not rewriting the UI.
// ============================================================

export type Money = number; // integer THB, no decimals — Thai baht storefront

export type ProductStatus = "ACTIVE" | "DRAFT" | "SOLD_OUT" | "ARCHIVED";

export type Category = {
  slug: string;
  name: string;
};

export type Collection = {
  slug: string;
  name: string;
};

/** A selectable colour for a product, with the gallery it maps to. */
export type ProductColor = {
  /** stable id used in URLs and cart lines, e.g. "champagne-gold" */
  id: string;
  name: string;
  /** swatch fill — hex or css colour */
  swatch: string;
  /** ordered image paths shown when this colour is active */
  images: string[];
};

export type ProductSize = {
  /** stable id, e.g. "regular" */
  id: string;
  name: string;
  /** short helper shown in the size list / guide */
  note?: string;
};

/**
 * One buyable unit: a (colour, size) pair with its own stock.
 * `id` is globally unique and is what a cart line / order item
 * ultimately references.
 */
export type ProductVariant = {
  id: string;
  colorId: string;
  sizeId: string;
  sku: string;
  /** units on hand; 0 = sold out. Never allowed below 0. */
  stock: number;
  /** optional per-variant price override; falls back to product.price */
  price?: Money;
};

export type ProductAccordionSection = {
  title: string;
  /** paragraphs of plain text */
  body: string[];
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  categorySlug: string;
  collectionSlug: string;
  status: ProductStatus;
  /** base price in THB; a variant may override */
  price: Money;
  /** one-line description for cards */
  shortDescription: string;
  /** the "product story" — a short evocative paragraph or two */
  story: string[];
  colors: ProductColor[];
  sizes: ProductSize[];
  variants: ProductVariant[];
  /** Materials / Fit & Size / Care / Shipping & Returns */
  details: ProductAccordionSection[];
  /** surfaced first in listings when sorting by "featured" */
  featuredRank?: number;
  createdAt: string; // ISO
};

// ---- Derived / view helpers -------------------------------------------------

export type StockState = "IN_STOCK" | "LOW_STOCK" | "SOLD_OUT";

export const LOW_STOCK_THRESHOLD = 4;

export function variantStockState(stock: number): StockState {
  if (stock <= 0) return "SOLD_OUT";
  if (stock <= LOW_STOCK_THRESHOLD) return "LOW_STOCK";
  return "IN_STOCK";
}

/** Aggregate stock state across every variant of a product. */
export function productStockState(product: Product): StockState {
  const total = product.variants.reduce((sum, v) => sum + Math.max(0, v.stock), 0);
  if (total <= 0) return "SOLD_OUT";
  if (total <= LOW_STOCK_THRESHOLD) return "LOW_STOCK";
  return "IN_STOCK";
}

export function findVariant(
  product: Product,
  colorId: string,
  sizeId: string,
): ProductVariant | undefined {
  return product.variants.find((v) => v.colorId === colorId && v.sizeId === sizeId);
}

export function variantPrice(product: Product, variant: ProductVariant | undefined): Money {
  return variant?.price ?? product.price;
}

// ---- Cart -----------------------------------------------------------------

/**
 * A line in the shopping bag. Stores enough denormalised data to
 * render the bag without re-fetching the catalog, plus the ids
 * needed to re-validate price and stock at checkout.
 */
export type CartLine = {
  /** `${productId}:${variantId}` — stable key; adding the same variant merges quantity */
  key: string;
  productId: string;
  productSlug: string;
  productName: string;
  variantId: string;
  colorId: string;
  colorName: string;
  sizeId: string;
  sizeName: string;
  image: string;
  /** unit price captured at add time (THB) */
  unitPrice: Money;
  quantity: number;
  /** stock on hand for this variant at add time — caps the stepper in the bag */
  maxQuantity: number;
};

export type CartTotals = {
  subtotal: Money;
  shipping: Money;
  total: Money;
  itemCount: number;
};

// ---- Checkout (Phase 1: shapes only, no submission) ----------------------

export type DeliveryMethodId = "standard" | "express";

export type DeliveryMethod = {
  id: DeliveryMethodId;
  name: string;
  description: string;
  price: Money;
  etaDays: string;
};

export type PaymentMethodId = "promptpay" | "card" | "bank_transfer";

export type CheckoutContact = {
  email: string;
  phone: string;
};

export type CheckoutAddress = {
  fullName: string;
  address: string;
  district: string;
  province: string;
  postalCode: string;
};

export type CheckoutDraft = {
  contact: CheckoutContact;
  shipping: CheckoutAddress;
  delivery: DeliveryMethodId;
  payment: PaymentMethodId;
};
