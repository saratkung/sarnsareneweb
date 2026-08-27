"use client";

// ============================================================
// SARNSARENE — order status hero visual.
//
// PREPARING → the full Crafting Process Animation.
// Every other status → a still finished piece with adapted copy.
//
// This is presentation only. The real order status always comes
// from the backend (`order.status`); the animation never advances
// or implies fulfilment progress on its own.
// ============================================================

import type { OrderStatus } from "@/lib/commerce/orders/types";
import { CraftingProcessAnimation } from "@/components/shop/crafting/CraftingProcessAnimation";
import { StaticFinishedBag } from "@/components/shop/crafting/stages";

const COPY: Record<OrderStatus, { heading: string; sub: string }> = {
  PENDING_PAYMENT: {
    heading: "Awaiting Payment",
    sub: "We'll begin preparing your order once payment is confirmed.",
  },
  PAID: {
    heading: "Order Received",
    sub: "Your order is in the queue for our atelier.",
  },
  PREPARING: {
    heading: "Preparing Your Order",
    sub: "Your pieces are being prepared with care.",
  },
  SHIPPED: {
    heading: "On Its Way",
    sub: "Your order has left our atelier and is heading to you.",
  },
  DELIVERED: {
    heading: "Arrived",
    sub: "Your order has been delivered. We hope it brings a little calm.",
  },
  COMPLETED: {
    heading: "Arrived",
    sub: "Thank you for choosing SARNSARENE.",
  },
  CANCELLED: {
    heading: "Order Cancelled",
    sub: "This order has been cancelled. Reach us any time if you have questions.",
  },
  REFUNDED: {
    heading: "Order Refunded",
    sub: "This order has been refunded in full.",
  },
};

export function OrderStatusVisual({ status }: { status: OrderStatus }) {
  const { heading, sub } = COPY[status];
  const isCrafting = status === "PREPARING";
  const terminal = status === "CANCELLED" || status === "REFUNDED";

  return (
    <section className="border border-text-light/10 bg-bg-secondary/25 px-6 py-9 text-center">
      <p className="text-[10px] tracking-[0.3em] uppercase text-text-light/55">
        {isCrafting ? "In the Atelier" : "Order Status"}
      </p>
      <h2 className="mt-3 font-serif font-light text-[clamp(1.35rem,3.4vw,1.85rem)] tracking-[0.06em] text-text-light">
        {heading}
      </h2>
      <p className="mx-auto mt-2 max-w-xs text-[12px] leading-relaxed font-light text-text-muted">
        {sub}
      </p>

      <div className="mt-8">
        {isCrafting ? (
          <CraftingProcessAnimation />
        ) : terminal ? (
          <div className="mx-auto w-full opacity-40" style={{ maxWidth: 300 }}>
            <StaticFinishedBag />
          </div>
        ) : (
          <div className="mx-auto w-full" style={{ maxWidth: 320 }}>
            <StaticFinishedBag />
          </div>
        )}
      </div>

      {isCrafting && (
        <p className="mt-8 text-[9px] tracking-[0.32em] uppercase text-text-light/45">
          Crafted with care · Prepared for your journey
        </p>
      )}
    </section>
  );
}
