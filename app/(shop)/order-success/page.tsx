import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getOrderViewer } from "@/lib/commerce/orders/customer";
import { getOrderForViewer } from "@/lib/commerce/orders/service";
import { PAYMENT_METHODS } from "@/lib/commerce/checkout";
import { formatDate } from "@/lib/commerce/format";
import { isPayable } from "@/lib/commerce/orders/status";
import { ButtonLink } from "@/components/ui/Button";
import { ConfirmedMark } from "@/components/shop/ConfirmedMark";
import { OrderStatusBadge } from "@/components/shop/OrderStatusBadge";
import { OrderItems, OrderTotals, AddressBlock } from "@/components/shop/OrderItems";

export const metadata: Metadata = { title: "Order Confirmed — SARNSARENE" };

type Search = { searchParams: Promise<{ order?: string }> };

export default async function OrderSuccessPage({ searchParams }: Search) {
  const { order: orderId } = await searchParams;
  if (!orderId) redirect("/shop");

  const order = await getOrderForViewer(orderId, await getOrderViewer());
  if (!order) redirect("/shop");

  const paymentLabel =
    PAYMENT_METHODS.find((m) => m.id === order.payment.method)?.name ?? order.payment.method;
  const awaitingPayment = isPayable(order.status);

  return (
    <div className="max-w-2xl mx-auto px-6 md:px-10 py-16 md:py-24">
      <div className="text-center">
        <ConfirmedMark />
        <p className="eyebrow mb-3">{awaitingPayment ? "Order Received" : "Order Confirmed"}</p>
        <h1 className="font-serif font-light text-[clamp(1.8rem,4vw,2.6rem)] tracking-[0.04em] text-text-light">
          Thank you for choosing SARNSARENE.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-[13px] leading-relaxed font-light text-text-muted">
          {awaitingPayment
            ? "Your order is reserved. Complete payment to begin its journey — details are in your order."
            : "Your order is confirmed. We are preparing it with care and will let you know when it ships."}
        </p>
        <p className="mt-6 font-serif text-lg tracking-[0.15em] text-text-light">#{order.id}</p>
        <p className="mt-1 text-[10px] tracking-widest2 uppercase text-text-muted">
          {formatDate(order.createdAt)}
        </p>
      </div>

      <div className="mt-12 bg-bg-secondary/50 p-6 md:p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-[11px] tracking-widest2 uppercase text-text-light">Order Summary</h2>
          <OrderStatusBadge status={order.status} />
        </div>

        <div className="mt-6">
          <OrderItems order={order} />
        </div>

        <div className="mt-6 grid gap-8 sm:grid-cols-2">
          <div>
            <p className="text-[10px] tracking-widest2 uppercase text-text-muted mb-3">Payment</p>
            <p className="text-[12.5px] text-text-light">
              {paymentLabel}
              <span className="ml-2 text-[10px] tracking-widest2 uppercase text-text-muted">
                {order.payment.status}
              </span>
            </p>
          </div>
          <div>
            <p className="text-[10px] tracking-widest2 uppercase text-text-muted mb-3">Ship To</p>
            <AddressBlock order={order} />
          </div>
        </div>

        <div className="mt-8 border-t border-text-light/10 pt-6">
          <OrderTotals order={order} />
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <ButtonLink href={`/orders/${order.id}`} variant="primary">
          View Order
        </ButtonLink>
        <ButtonLink href="/shop" variant="secondary">
          Continue Shopping
        </ButtonLink>
      </div>
    </div>
  );
}
