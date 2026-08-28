import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { adminGetOrder } from "@/lib/commerce/orders/admin";
import { listAuditFor } from "@/lib/commerce/audit";
import { PAYMENT_METHODS } from "@/lib/commerce/checkout";
import { formatDate } from "@/lib/commerce/format";
import { OrderStatusBadge } from "@/components/shop/OrderStatusBadge";
import { OrderTimeline } from "@/components/shop/OrderTimeline";
import { OrderItems, OrderTotals, AddressBlock } from "@/components/shop/OrderItems";
import { OrderActions } from "@/components/admin/OrderActions";
import { Card } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  return { title: `Order #${id} — SARNSARENE Admin` };
}

export default async function AdminOrderDetail({ params }: Params) {
  const { id } = await params;
  const order = await adminGetOrder(id);
  if (!order) notFound();

  const audit = await listAuditFor("order", id, 12);
  const paymentLabel =
    PAYMENT_METHODS.find((m) => m.id === order.payment.method)?.name ?? order.payment.method;

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/admin/orders"
        className="text-[10px] tracking-widest2 uppercase text-text-muted hover:text-text-light"
      >
        ← Orders
      </Link>

      <header className="mt-4 flex flex-wrap items-start justify-between gap-4 border-b border-text-light/10 pb-6">
        <div>
          <h1 className="font-serif text-2xl text-text-light">#{order.id}</h1>
          <p className="mt-1 text-[11px] tracking-widest2 uppercase text-text-muted">
            {formatDate(order.createdAt)} · {order.customer.name} · {order.customer.email}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </header>

      <div className="mt-8">
        <Card title="Actions">
          <OrderActions order={order} />
        </Card>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-[1fr_1.4fr]">
        <div className="space-y-6">
          <Card title="Progress">
            <OrderTimeline order={order} />
          </Card>
          <Card title="Payment">
            <p className="text-[13px] text-text-light">{paymentLabel}</p>
            <p className="mt-1 text-[10px] tracking-widest2 uppercase text-text-muted">
              {order.payment.status} · ref {order.payment.reference || "—"}
            </p>
          </Card>
          <Card title="Shipping Address">
            <AddressBlock order={order} />
          </Card>
          {order.shipment.trackingNumber && (
            <Card title="Shipment">
              <p className="text-[12px] text-text-muted">
                {order.shipment.carrier} · {order.shipment.trackingNumber}
              </p>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card title="Items">
            <OrderItems order={order} />
            <div className="mt-5">
              <OrderTotals order={order} />
            </div>
          </Card>

          <Card title="History">
            {order.events.length === 0 ? (
              <p className="text-[12px] text-text-muted">No events.</p>
            ) : (
              <ul className="space-y-2.5">
                {[...order.events].reverse().map((e, i) => (
                  <li key={i} className="text-[11px] leading-relaxed text-text-muted">
                    <span className="text-text-light">{e.status}</span>
                    {e.note && ` — ${e.note}`}
                    <br />
                    {formatDate(e.at)} · {e.by}
                  </li>
                ))}
              </ul>
            )}
          </Card>

          {audit.length > 0 && (
            <Card title="Audit Log">
              <ul className="space-y-2">
                {audit.map((e) => (
                  <li key={e.id} className="text-[11px] text-text-muted">
                    {e.summary} · {formatDate(e.at)}
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
