import Link from "next/link";
import { adminListOrders, type AdminOrderFilter } from "@/lib/commerce/orders/admin";
import type { OrderStatus } from "@/lib/commerce/orders/types";
import { formatTHB, formatDate } from "@/lib/commerce/format";
import { OrderStatusBadge } from "@/components/shop/OrderStatusBadge";
import { PageHeader, Card, EmptyRow } from "@/components/admin/ui";
import { cn } from "@/lib/cn";

export const dynamic = "force-dynamic";

const FILTERS: { key: AdminOrderFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "PENDING_PAYMENT", label: "Pending Payment" },
  { key: "PAID", label: "Paid" },
  { key: "PREPARING", label: "Preparing" },
  { key: "SHIPPED", label: "Shipped" },
  { key: "DELIVERED", label: "Delivered" },
  { key: "COMPLETED", label: "Completed" },
  { key: "CANCELLED", label: "Cancelled" },
  { key: "REFUNDED", label: "Refunded" },
];

function normalise(v: string | undefined): AdminOrderFilter {
  if (!v) return "all";
  return (FILTERS.find((f) => f.key === v)?.key ?? "all") as AdminOrderFilter;
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const active = normalise(status);
  const orders = await adminListOrders(active);

  return (
    <div>
      <PageHeader title="Orders" description={`${orders.length} ${orders.length === 1 ? "order" : "orders"}`} />

      <div className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Link
            key={f.key}
            href={f.key === "all" ? "/admin/orders" : `/admin/orders?status=${f.key}`}
            className={cn(
              "px-3 py-1.5 text-[10px] tracking-widest2 uppercase border transition-colors",
              active === f.key
                ? "border-text-light bg-text-light text-bg"
                : "border-text-light/20 text-text-muted hover:border-text-light",
            )}
          >
            {f.label}
          </Link>
        ))}
      </div>

      <Card className="overflow-x-auto">
        {orders.length === 0 ? (
          <EmptyRow>No orders in this view</EmptyRow>
        ) : (
          <table className="w-full min-w-[640px] text-left text-[12px]">
            <thead>
              <tr className="border-b border-text-light/15 text-[9px] tracking-widest2 uppercase text-text-muted">
                <th className="py-2 pr-4 font-normal">Order</th>
                <th className="py-2 pr-4 font-normal">Customer</th>
                <th className="py-2 pr-4 font-normal">Date</th>
                <th className="py-2 pr-4 font-normal">Payment</th>
                <th className="py-2 pr-4 font-normal text-right">Amount</th>
                <th className="py-2 font-normal">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-text-light/10">
              {orders.map((o) => (
                <tr key={o.id} className="group">
                  <td className="py-3 pr-4">
                    <Link
                      href={`/admin/orders/${o.id}`}
                      className="font-serif text-[13px] text-text-light group-hover:text-gold"
                    >
                      #{o.id}
                    </Link>
                  </td>
                  <td className="py-3 pr-4 text-text-muted">{o.customer.name}</td>
                  <td className="py-3 pr-4 tabular-nums text-text-muted">
                    {formatDate(o.createdAt)}
                  </td>
                  <td className="py-3 pr-4 text-[10px] tracking-widest2 uppercase text-text-muted">
                    {o.payment.method.replace("_", " ")} · {o.payment.status}
                  </td>
                  <td className="py-3 pr-4 text-right tabular-nums text-text-light">
                    {formatTHB(o.total)}
                  </td>
                  <td className="py-3">
                    <OrderStatusBadge status={o.status as OrderStatus} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
