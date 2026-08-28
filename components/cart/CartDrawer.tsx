"use client";

import { Drawer } from "@/components/ui/Drawer";
import { ButtonLink } from "@/components/ui/Button";
import { formatTHB } from "@/lib/commerce/format";
import { useCart } from "@/components/cart/CartContext";
import { CartLineItem } from "@/components/cart/CartLineItem";

export function CartDrawer() {
  const { isOpen, closeBag, lines, totals } = useCart();
  const empty = lines.length === 0;

  return (
    <Drawer
      open={isOpen}
      onClose={closeBag}
      title={empty ? "Your Bag" : `Your Bag — ${totals.itemCount}`}
      footer={
        empty ? undefined : (
          <div className="space-y-4">
            <div className="flex items-baseline justify-between">
              <span className="text-[11px] tracking-widest2 uppercase text-text-muted">
                Subtotal
              </span>
              <span className="font-serif text-lg tabular-nums text-text-light">
                {formatTHB(totals.subtotal)}
              </span>
            </div>
            <p className="text-[11px] text-text-muted">
              Shipping &amp; taxes calculated at checkout.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <ButtonLink href="/cart" variant="secondary" onClick={closeBag}>
                View Bag
              </ButtonLink>
              <ButtonLink href="/checkout" variant="primary" onClick={closeBag}>
                Checkout
              </ButtonLink>
            </div>
          </div>
        )
      }
    >
      {empty ? (
        <div className="flex h-full flex-col items-center justify-center px-6 py-16 text-center">
          <p className="font-serif text-xl text-text-light">Your bag is empty</p>
          <p className="mt-3 max-w-[240px] text-[12px] leading-relaxed text-text-muted">
            Every piece is hand-woven in small batches. Take your time.
          </p>
          <ButtonLink className="mt-8" href="/shop" onClick={closeBag} variant="secondary">
            Continue Shopping
          </ButtonLink>
        </div>
      ) : (
        <div className="divide-y divide-text-light/10 px-6">
          {lines.map((line) => (
            <CartLineItem key={line.key} line={line} onNavigate={closeBag} />
          ))}
        </div>
      )}
    </Drawer>
  );
}
