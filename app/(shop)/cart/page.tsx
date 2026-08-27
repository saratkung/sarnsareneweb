"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useCart } from "@/components/cart/CartContext";
import { CartLineItem } from "@/components/cart/CartLineItem";
import { OrderSummary } from "@/components/shop/OrderSummary";
import { ButtonLink } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";

export default function CartPage() {
  const { lines, totals, hydrated } = useCart();

  return (
    <div className="max-w-content mx-auto px-6 md:px-10 py-16 min-h-[60vh]">
      <header className="mb-12">
        <p className="eyebrow mb-3">Your Bag</p>
        <h1 className="font-serif font-light text-[clamp(1.8rem,4vw,2.6rem)] tracking-[0.04em] text-text-light">
          {hydrated && lines.length > 0 ? `${totals.itemCount} ${totals.itemCount === 1 ? "Item" : "Items"}` : "Shopping Bag"}
        </h1>
      </header>

      {!hydrated ? (
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-6">
            {[0, 1].map((i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-32 w-24" />
                <div className="flex-1 space-y-3 py-2">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              </div>
            ))}
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      ) : lines.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center justify-center py-24 text-center"
        >
          <p className="font-serif text-2xl text-text-light">Your bag is empty</p>
          <p className="mt-4 max-w-sm text-[13px] leading-relaxed font-light text-text-muted">
            Nothing has been added yet. Our pieces are woven in small batches — when
            something speaks to you, it is worth keeping.
          </p>
          <ButtonLink href="/shop" className="mt-10" variant="primary">
            Continue Shopping
          </ButtonLink>
        </motion.div>
      ) : (
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <div className="divide-y divide-text-light/10 border-y border-text-light/10">
              {lines.map((line) => (
                <CartLineItem key={line.key} line={line} variant="roomy" />
              ))}
            </div>
            <Link
              href="/shop"
              className="mt-8 inline-block text-[10px] tracking-widest2 uppercase text-text-muted underline underline-offset-4 hover:text-text-light transition-colors"
            >
              Continue Shopping
            </Link>
          </div>

          <div className="lg:sticky lg:top-28 lg:self-start">
            <OrderSummary
              lines={lines}
              totals={totals}
              shippingNote="Calculated at checkout"
            />
            <ButtonLink href="/checkout" fullWidth size="lg" className="mt-5">
              Checkout
            </ButtonLink>
            <p className="mt-4 text-center text-[11px] text-text-muted">
              Complimentary shipping on standard delivery over THB 5,000.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
