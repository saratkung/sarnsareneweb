// ============================================================
// SARNSARENE — order status machine + timeline model.
// One place defines which transitions are legal and how the
// journey is drawn, so the customer timeline and the Phase 3
// admin actions can never disagree.
// ============================================================

import type { OrderStatus } from "./types";

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING_PAYMENT: "Pending Payment",
  PAID: "Payment Confirmed",
  PREPARING: "Preparing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
};

/** Allowed forward transitions. CANCELLED/REFUNDED handled separately. */
const TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING_PAYMENT: ["PAID", "CANCELLED"],
  PAID: ["PREPARING", "CANCELLED", "REFUNDED"],
  PREPARING: ["SHIPPED", "CANCELLED", "REFUNDED"],
  SHIPPED: ["DELIVERED", "REFUNDED"],
  DELIVERED: ["COMPLETED", "REFUNDED"],
  COMPLETED: ["REFUNDED"],
  CANCELLED: [],
  REFUNDED: [],
};

export function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  return TRANSITIONS[from]?.includes(to) ?? false;
}

export function nextStatus(from: OrderStatus): OrderStatus | null {
  const forward: Partial<Record<OrderStatus, OrderStatus>> = {
    PENDING_PAYMENT: "PAID",
    PAID: "PREPARING",
    PREPARING: "SHIPPED",
    SHIPPED: "DELIVERED",
    DELIVERED: "COMPLETED",
  };
  return forward[from] ?? null;
}

// ---- Timeline (customer-facing) -----------------------------------------

export type TimelineStepKey = "received" | "paid" | "preparing" | "shipped" | "delivered";

export const TIMELINE_STEPS: { key: TimelineStepKey; label: string; status: OrderStatus }[] = [
  { key: "received", label: "Order Received", status: "PENDING_PAYMENT" },
  { key: "paid", label: "Payment Confirmed", status: "PAID" },
  { key: "preparing", label: "Preparing", status: "PREPARING" },
  { key: "shipped", label: "Shipped", status: "SHIPPED" },
  { key: "delivered", label: "Delivered", status: "DELIVERED" },
];

const STATUS_RANK: Record<OrderStatus, number> = {
  PENDING_PAYMENT: 0,
  PAID: 1,
  PREPARING: 2,
  SHIPPED: 3,
  DELIVERED: 4,
  COMPLETED: 5,
  CANCELLED: -1,
  REFUNDED: -1,
};

export type TimelineState = "done" | "current" | "upcoming";

/** How each step should render for an order in the given status. */
export function timelineState(step: TimelineStepKey, status: OrderStatus): TimelineState {
  const stepRank = TIMELINE_STEPS.findIndex((s) => s.key === step);
  const orderRank = STATUS_RANK[status];
  if (status === "COMPLETED") return "done";
  if (orderRank < 0) return stepRank === 0 ? "done" : "upcoming"; // cancelled/refunded
  if (stepRank < orderRank) return "done";
  if (stepRank === orderRank) return "current";
  return "upcoming";
}

export function isTerminated(status: OrderStatus): boolean {
  return status === "CANCELLED" || status === "REFUNDED";
}

export function isTrackable(status: OrderStatus): boolean {
  return status === "SHIPPED" || status === "DELIVERED" || status === "COMPLETED";
}

export function isPayable(status: OrderStatus): boolean {
  return status === "PENDING_PAYMENT";
}
