// ============================================================
// SARNSARENE — order domain types (Phase 2).
//
// The Order shape is deliberately the full record the spec asks
// for (§9) and maps 1:1 to the Phase 4 database tables
// (ORDERS / ORDER_ITEMS / PAYMENTS / SHIPMENTS / ADDRESSES).
// Nothing here imports React or Next — it is pure domain.
// ============================================================

import type {
  CheckoutAddress,
  DeliveryMethodId,
  Money,
  PaymentMethodId,
} from "@/lib/commerce/types";

export type OrderStatus =
  | "PENDING_PAYMENT"
  | "PAID"
  | "PREPARING"
  | "SHIPPED"
  | "DELIVERED"
  | "COMPLETED"
  | "CANCELLED"
  | "REFUNDED";

export type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "REFUNDED";

/** A purchased line — a full snapshot, immune to later catalog edits. */
export type OrderItem = {
  productId: string;
  productSlug: string;
  productName: string;
  variantId: string;
  colorName: string;
  sizeName: string;
  image: string;
  unitPrice: Money;
  quantity: number;
  /** unitPrice * quantity, stored so totals never drift */
  lineTotal: Money;
};

export type OrderPayment = {
  method: PaymentMethodId;
  status: PaymentStatus;
  /** provider charge/intent id (mock reference in Phase 2) */
  reference: string;
  /** e.g. a PromptPay payload or bank-transfer instructions, provider-shaped */
  instructions?: string;
  amount: Money;
  paidAt?: string;
  refundedAt?: string;
};

export type OrderShipment = {
  method: DeliveryMethodId;
  carrier?: string;
  trackingNumber?: string;
  shippedAt?: string;
  deliveredAt?: string;
  /** provider tracking URL, when a tracking number exists */
  trackingUrl?: string;
};

/** One entry in the order's audit/status history — drives the timeline. */
export type OrderEvent = {
  at: string; // ISO
  status: OrderStatus;
  note?: string;
  /** "system" in Phase 2; an admin id in Phase 3 */
  by: string;
};

export type OrderCustomer = {
  /** opaque browser-scoped id; also linked to `userId` once the customer signs in */
  ref: string;
  /** set when the order belongs to a registered account */
  userId: string | null;
  email: string;
  phone: string;
  name: string;
};

export type Order = {
  id: string; // SR-YYMMDD-NNN
  status: OrderStatus;
  customer: OrderCustomer;
  items: OrderItem[];
  shippingAddress: CheckoutAddress;
  payment: OrderPayment;
  shipment: OrderShipment;
  subtotal: Money;
  shippingTotal: Money;
  total: Money;
  events: OrderEvent[];
  createdAt: string;
  updatedAt: string;
};

// ---- Request shapes -------------------------------------------------------

export type CreateOrderItemInput = {
  productId: string;
  variantId: string;
  quantity: number;
};

export type CreateOrderInput = {
  items: CreateOrderItemInput[];
  contact: { email: string; phone: string };
  shippingAddress: CheckoutAddress;
  delivery: DeliveryMethodId;
  payment: PaymentMethodId;
};

export type CreateOrderResult =
  | { ok: true; order: Order; deduped: boolean }
  | { ok: false; error: OrderError };

export type OrderError =
  | { code: "EMPTY_CART"; message: string }
  | { code: "VALIDATION"; message: string }
  | { code: "OUT_OF_STOCK"; message: string; variantId: string; available: number }
  | { code: "PRODUCT_UNAVAILABLE"; message: string; productId: string }
  | { code: "PRICE_CHANGED"; message: string; variantId: string }
  | { code: "PAYMENT_FAILED"; message: string }
  | { code: "NOT_FOUND"; message: string }
  | { code: "INTERNAL"; message: string };
