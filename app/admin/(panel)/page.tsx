import Link from "next/link";
import { dashboardStats, adminListOrders } from "@/lib/commerce/orders/admin";
import { lowStockVariants } from "@/lib/commerce/catalog";
import { listAudit } from "@/lib/commerce/audit";
import { formatTHB, formatDate } from "@/lib/commerce/format";
import { OrderStatusBadge } from "@/components/shop/OrderStatusBadge";
import { PageHeader, StatCard, Card, EmptyRow } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [stats, recent, lowStock, audit] = await Promise.all([
    dashboardStats(),
    adminListOrders("all"),
    lowStockVariants(4),
    listAudit(8),
  ]);

  const recentOrders = recent.slice(0, 6);

  return (
    <div>
      <PageHeader title="Dashboard" description={`Today · ${formatDate(new Date().toISOString())}`} />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Orders Today" value={stats.todayOrders} href="/admin/orders" />
        <StatCard label="Revenue Today" value={formatTHB(stats.todayRevenue)} />
        <StatCard
          label="Pending Payment"
          value={stats.pendingPayment}
          href="/admin/orders?status=PENDING_PAYMENT"
        />
        <StatCard label="To Ship" value={stats.toShip} href="/admin/orders?status=PAID" />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Open Orders" value={stats.openOrders} />
        <StatCard label="Revenue · All Time" value={formatTHB(stats.revenueAllTime)} />
        <StatCard
          label="Low Stock"
          value={lowStock.length}
          href="/admin/inventory"
          hint={lowStock.length ? "needs attention" : "all healthy"}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card
          title="Recent Orders"
          action={
            <Link
              href="/admin/orders"
              className="text-[10px] tracking-widest2 uppercase text-text-muted hover:text-text-light"
            >
              All →
            </Link>
          }
        >
          {recentOrders.length === 0 ? (
            <EmptyRow>No orders yet</EmptyRow>
          ) : (
            <ul className="divide-y divide-text-light/10">
              {recentOrders.map((o) => (
                <li key={o.id}>
                  <Link
                    href={`/admin/orders/${o.id}`}
                    className="flex items-center justify-between gap-3 py-3 transition-colors hover:text-gold"
                  >
                    <span className="min-w-0">
                      <span className="font-serif text-[14px] text-text-light">#{o.id}</span>
                      <span className="ml-2 text-[11px] text-text-muted">{o.customer.name}</span>
                    </span>
                    <span className="flex shrink-0 items-center gap-3">
                      <span className="text-[12px] tabular-nums text-text-light">
                        {formatTHB(o.total)}
                      </span>
                      <OrderStatusBadge status={o.status} />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <div className="space-y-6">
          <Card title="Low Stock">
            {lowStock.length === 0 ? (
              <EmptyRow>Everything is well stocked</EmptyRow>
            ) : (
              <ul className="divide-y divide-text-light/10">
                {lowStock.slice(0, 6).map((row) => (
                  <li key={row.variantId} className="flex items-center justify-between py-2.5">
                    <Link
                      href={`/admin/products/${row.productId}`}
                      className="min-w-0 truncate text-[12px] text-text-light hover:text-gold"
                    >
                      {row.productName}
                      <span className="ml-1.5 text-text-muted">
                        {row.colorName}
                        {row.sizeName !== "One Size" && ` / ${row.sizeName}`}
                      </span>
                    </Link>
                    <span
                      className={`shrink-0 text-[12px] tabular-nums ${
                        row.stock === 0 ? "text-[#9d5c4d]" : "text-[#b98a3e]"
                      }`}
                    >
                      {row.stock}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card title="Activity">
            {audit.length === 0 ? (
              <EmptyRow>No activity yet</EmptyRow>
            ) : (
              <ul className="space-y-2.5">
                {audit.map((e) => (
                  <li key={e.id} className="text-[11px] leading-relaxed text-text-muted">
                    <span className="text-text-light">{e.summary}</span>
                    <br />
                    {formatDate(e.at)} · {e.actor}
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
