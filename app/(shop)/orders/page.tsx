import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getOrderViewer } from "@/lib/commerce/orders/customer";
import { listOrdersForViewer } from "@/lib/commerce/orders/service";
import { formatDate, formatTHB } from "@/lib/commerce/format";
import { ButtonLink } from "@/components/ui/Button";
import { OrderStatusBadge } from "@/components/shop/OrderStatusBadge";

export const metadata: Metadata = { title: "My Orders — SARNSARENE" };
export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const orders = await listOrdersForViewer(await getOrderViewer());

  return (
    <div className="max-w-3xl mx-auto px-6 md:px-10 py-16 min-h-[60vh]">
      <header className="mb-12">
        <p className="eyebrow mb-3">Account</p>
        <h1 className="font-serif font-light text-[clamp(1.8rem,4vw,2.6rem)] tracking-[0.04em] text-text-light">
          My Orders
        </h1>
      </header>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="font-serif text-xl text-text-light">No orders yet</p>
          <p className="mt-4 max-w-sm text-[13px] leading-relaxed font-light text-text-muted">
            When you place an order it will appear here, with its full journey from our
            atelier to your door.
          </p>
          <ButtonLink href="/shop" className="mt-10">
            Continue Shopping
          </ButtonLink>
        </div>
      ) : (
        <ul className="divide-y divide-text-light/10 border-y border-text-light/10">
          {orders.map((order) => (
            <li key={order.id}>
              <Link
                href={`/orders/${order.id}`}
                className="group flex items-center gap-5 py-6 transition-colors hover:bg-text-light/[0.02]"
              >
                <div className="flex -space-x-3">
                  {order.items.slice(0, 3).map((item, i) => (
                    <div
                      key={item.variantId}
                      className="relative h-16 w-12 overflow-hidden border border-bg bg-bg-secondary"
                      style={{ zIndex: 3 - i }}
                    >
                      <Image
                        src={item.image}
                        alt=""
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-serif text-[15px] text-text-light">#{order.id}</span>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <p className="mt-1 truncate text-[12px] text-text-muted">
                    {order.items.map((i) => i.productName).join(", ")}
                  </p>
                  <p className="mt-1 text-[10px] tracking-widest2 uppercase text-text-muted">
                    {formatDate(order.createdAt)} · {order.items.length}{" "}
                    {order.items.length === 1 ? "item" : "items"}
                  </p>
                </div>

                <span className="shrink-0 text-[13px] tabular-nums text-text-light">
                  {formatTHB(order.total)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
