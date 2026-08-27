"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Order } from "@/lib/commerce/orders/types";
import { PAYMENT_METHODS } from "@/lib/commerce/checkout";
import { formatDate } from "@/lib/commerce/format";
import { isPayable, isTrackable } from "@/lib/commerce/orders/status";
import { Button, ButtonLink } from "@/components/ui/Button";
import { OrderStatusBadge } from "@/components/shop/OrderStatusBadge";
import { OrderStatusVisual } from "@/components/shop/OrderStatusVisual";
import { OrderTimeline } from "@/components/shop/OrderTimeline";
import { OrderItems, OrderTotals, AddressBlock } from "@/components/shop/OrderItems";
import { useToast } from "@/components/ui/Toast";

const sectionTitle = "text-[10px] tracking-widest2 uppercase text-text-muted mb-4";

export function OrderDetailView({ order }: { order: Order }) {
  const router = useRouter();
  const { notify } = useToast();
  const [pending, startTransition] = useTransition();
  const [busy, setBusy] = useState(false);

  const paymentLabel =
    PAYMENT_METHODS.find((m) => m.id === order.payment.method)?.name ?? order.payment.method;

  async function confirmPayment() {
    setBusy(true);
    try {
      const res = await fetch(`/api/orders/${order.id}/confirm-payment`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        notify(data?.error?.message ?? "Something went wrong.");
        return;
      }
      startTransition(() => router.refresh());
      notify("Payment confirmed.");
    } catch {
      notify("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-6 md:px-10 py-14">
      <ButtonLink href="/orders" variant="ghost" className="mb-8 text-[10px]">
        ← All Orders
      </ButtonLink>

      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-text-light/10 pb-8">
        <div>
          <p className="eyebrow mb-2">Order</p>
          <h1 className="font-serif font-light text-[clamp(1.6rem,3.5vw,2.2rem)] tracking-[0.04em] text-text-light">
            #{order.id}
          </h1>
          <p className="mt-2 text-[11px] tracking-widest2 uppercase text-text-muted">
            Placed {formatDate(order.createdAt)}
          </p>
        </div>
        <OrderStatusBadge status={order.status} className="mt-2" />
      </header>

      <div className="pt-10">
        <OrderStatusVisual status={order.status} />
      </div>

      <div className="grid gap-14 md:grid-cols-[1fr_1.3fr] md:gap-12 pt-12">
        <div>
          <p className={sectionTitle}>Progress</p>
          <OrderTimeline order={order} />

          {isTrackable(order.status) && order.shipment.trackingNumber && (
            <div className="mt-8 border-t border-text-light/10 pt-6">
              <p className={sectionTitle}>Tracking</p>
              <p className="text-[12px] text-text-muted">
                {order.shipment.carrier} · {order.shipment.trackingNumber}
              </p>
              {order.shipment.trackingUrl && (
                <ButtonLink
                  href={order.shipment.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="secondary"
                  className="mt-4"
                >
                  Track Package
                </ButtonLink>
              )}
            </div>
          )}
        </div>

        <div className="space-y-10">
          {/* payment */}
          <section>
            <p className={sectionTitle}>Payment</p>
            <p className="text-[13px] text-text-light">
              {paymentLabel}
              <span className="ml-2 text-[10px] tracking-widest2 uppercase text-text-muted">
                {order.payment.status}
              </span>
            </p>
            {isPayable(order.status) && order.payment.instructions && (
              <div className="mt-4 bg-bg-secondary/60 p-4">
                <p className="text-[10px] tracking-widest2 uppercase text-text-muted mb-2">
                  How to pay
                </p>
                <pre className="whitespace-pre-wrap break-words font-sans text-[11.5px] leading-relaxed text-text-muted">
                  {order.payment.instructions}
                </pre>
              </div>
            )}
            {isPayable(order.status) && (
              <Button
                className="mt-4"
                variant="primary"
                disabled={busy || pending}
                onClick={confirmPayment}
              >
                {busy ? "Confirming…" : "I've Completed Payment"}
              </Button>
            )}
          </section>

          {/* items */}
          <section>
            <p className={sectionTitle}>Items</p>
            <OrderItems order={order} />
            <div className="mt-6">
              <OrderTotals order={order} />
            </div>
          </section>

          {/* address */}
          <section>
            <p className={sectionTitle}>Shipping Address</p>
            <AddressBlock order={order} />
          </section>
        </div>
      </div>
    </div>
  );
}
