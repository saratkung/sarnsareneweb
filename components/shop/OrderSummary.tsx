import type { CartLine, CartTotals } from "@/lib/commerce/types";
import { formatTHB } from "@/lib/commerce/format";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/commerce/checkout";
import { cn } from "@/lib/cn";

type Props = {
  lines: CartLine[];
  totals: CartTotals;
  /** show the itemised product list above the totals */
  showItems?: boolean;
  /** copy under the shipping row when it hasn't been chosen yet */
  shippingNote?: string;
  className?: string;
};

export function OrderSummary({
  lines,
  totals,
  showItems = false,
  shippingNote,
  className,
}: Props) {
  const remainingForFreeShipping = FREE_SHIPPING_THRESHOLD - totals.subtotal;

  return (
    <div className={cn("bg-bg-secondary/60 p-6 md:p-8", className)}>
      <h2 className="text-[11px] tracking-widest2 uppercase text-text-light mb-6">
        Order Summary
      </h2>

      {showItems && (
        <ul className="mb-6 space-y-4 border-b border-text-light/10 pb-6">
          {lines.map((line) => (
            <li key={line.key} className="flex justify-between gap-4 text-[12px]">
              <span className="text-text-muted">
                {line.productName}
                <span className="block text-[10px] tracking-widest2 uppercase">
                  {line.colorName}
                  {line.sizeName !== "One Size" && ` · ${line.sizeName}`} · Qty {line.quantity}
                </span>
              </span>
              <span className="shrink-0 tabular-nums text-text-light">
                {formatTHB(line.unitPrice * line.quantity)}
              </span>
            </li>
          ))}
        </ul>
      )}

      <dl className="space-y-3 text-[13px]">
        <div className="flex justify-between">
          <dt className="text-text-muted">Subtotal</dt>
          <dd className="tabular-nums text-text-light">{formatTHB(totals.subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-text-muted">Shipping</dt>
          <dd className="tabular-nums text-text-light">
            {shippingNote
              ? shippingNote
              : totals.shipping === 0
                ? "Complimentary"
                : formatTHB(totals.shipping)}
          </dd>
        </div>
      </dl>

      {remainingForFreeShipping > 0 && (
        <p className="mt-4 text-[11px] leading-relaxed text-text-muted">
          Add {formatTHB(remainingForFreeShipping)} for complimentary standard shipping.
        </p>
      )}

      <div className="mt-6 flex items-baseline justify-between border-t border-text-light/15 pt-5">
        <span className="text-[11px] tracking-widest2 uppercase text-text-light">Total</span>
        <span className="font-serif text-xl tabular-nums text-text-light">
          {formatTHB(totals.total)}
        </span>
      </div>
    </div>
  );
}
