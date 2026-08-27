import Image from "next/image";
import Link from "next/link";
import type { Order } from "@/lib/commerce/orders/types";
import { formatTHB } from "@/lib/commerce/format";

export function OrderItems({ order }: { order: Order }) {
  return (
    <ul className="divide-y divide-text-light/10 border-y border-text-light/10">
      {order.items.map((item) => (
        <li key={item.variantId} className="flex gap-4 py-5">
          <div className="relative h-24 w-[72px] shrink-0 overflow-hidden bg-bg-secondary">
            <Image
              src={item.image}
              alt={item.productName}
              fill
              sizes="80px"
              className="object-cover"
            />
          </div>
          <div className="flex flex-1 flex-col">
            <div className="flex items-start justify-between gap-3">
              <Link
                href={`/product/${item.productSlug}`}
                className="font-serif text-[15px] text-text-light hover:text-gold transition-colors"
              >
                {item.productName}
              </Link>
              <span className="shrink-0 text-[13px] tabular-nums text-text-light">
                {formatTHB(item.lineTotal)}
              </span>
            </div>
            <p className="mt-1 text-[10px] tracking-widest2 uppercase text-text-muted">
              {item.colorName}
              {item.sizeName !== "One Size" && ` · ${item.sizeName}`}
            </p>
            <p className="mt-auto pt-3 text-[11px] text-text-muted">
              Qty {item.quantity} · {formatTHB(item.unitPrice)} each
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function OrderTotals({ order }: { order: Order }) {
  return (
    <dl className="space-y-2.5 text-[13px]">
      <div className="flex justify-between">
        <dt className="text-text-muted">Subtotal</dt>
        <dd className="tabular-nums text-text-light">{formatTHB(order.subtotal)}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-text-muted">Shipping</dt>
        <dd className="tabular-nums text-text-light">
          {order.shippingTotal === 0 ? "Complimentary" : formatTHB(order.shippingTotal)}
        </dd>
      </div>
      <div className="flex items-baseline justify-between border-t border-text-light/15 pt-3">
        <dt className="text-[11px] tracking-widest2 uppercase text-text-light">Total</dt>
        <dd className="font-serif text-lg tabular-nums text-text-light">
          {formatTHB(order.total)}
        </dd>
      </div>
    </dl>
  );
}

export function AddressBlock({ order }: { order: Order }) {
  const a = order.shippingAddress;
  return (
    <address className="not-italic text-[12.5px] leading-relaxed text-text-muted">
      <span className="block text-text-light">{a.fullName}</span>
      {a.address}
      <br />
      {a.district}, {a.province} {a.postalCode}
      <br />
      {order.customer.phone}
    </address>
  );
}
