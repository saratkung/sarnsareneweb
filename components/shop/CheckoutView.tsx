"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type {
  CheckoutDraft,
  DeliveryMethodId,
  PaymentMethodId,
} from "@/lib/commerce/types";
import {
  DELIVERY_METHODS,
  EMPTY_CHECKOUT_DRAFT,
  PAYMENT_METHODS,
  validateCheckout,
  hasErrors,
  type CheckoutErrors,
} from "@/lib/commerce/checkout";
import { formatTHB } from "@/lib/commerce/format";
import { useCart } from "@/components/cart/CartContext";
import { TextField } from "@/components/ui/Field";
import { Button, ButtonLink } from "@/components/ui/Button";
import { OrderSummary } from "@/components/shop/OrderSummary";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/cn";

const NO_ERRORS: CheckoutErrors = { contact: {}, shipping: {} };

export function CheckoutView({
  defaults = EMPTY_CHECKOUT_DRAFT,
}: {
  defaults?: CheckoutDraft;
}) {
  const router = useRouter();
  const { lines, hydrated, totalsFor, clear } = useCart();

  const [draft, setDraft] = useState<CheckoutDraft>(defaults);
  const [errors, setErrors] = useState<CheckoutErrors>(NO_ERRORS);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // One idempotency key per checkout attempt — survives retries and
  // double-clicks, so the server never creates a duplicate order.
  const idempotencyKey = useRef<string>("");
  if (!idempotencyKey.current) {
    idempotencyKey.current =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `idem-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }

  const totals = useMemo(
    () => totalsFor(draft.delivery),
    [totalsFor, draft.delivery],
  );

  // re-validate live once the shopper has tried to submit
  useEffect(() => {
    if (submitAttempted) setErrors(validateCheckout(draft));
  }, [draft, submitAttempted]);

  function patchContact<K extends keyof CheckoutDraft["contact"]>(
    key: K,
    value: string,
  ) {
    setDraft((d) => ({ ...d, contact: { ...d.contact, [key]: value } }));
  }
  function patchShipping<K extends keyof CheckoutDraft["shipping"]>(
    key: K,
    value: string,
  ) {
    setDraft((d) => ({ ...d, shipping: { ...d.shipping, [key]: value } }));
  }

  async function handlePlaceOrder() {
    if (processing) return; // guard against double submit
    setSubmitAttempted(true);
    setSubmitError(null);
    const next = validateCheckout(draft);
    setErrors(next);
    if (hasErrors(next)) {
      document
        .querySelector('[data-invalid="true"]')
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setProcessing(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": idempotencyKey.current,
        },
        body: JSON.stringify({
          items: lines.map((l) => ({
            productId: l.productId,
            variantId: l.variantId,
            quantity: l.quantity,
          })),
          contact: draft.contact,
          shippingAddress: draft.shipping,
          delivery: draft.delivery,
          payment: draft.payment,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setProcessing(false);
        setSubmitError(
          data?.error?.message ?? "We couldn't place your order. Please try again.",
        );
        return;
      }

      setPlaced(true);
      clear();
      router.push(`/order-success?order=${encodeURIComponent(data.order.id)}`);
    } catch {
      setProcessing(false);
      setSubmitError("Network error. Please check your connection and try again.");
    }
  }

  if (!hydrated) {
    return (
      <div className="max-w-content mx-auto px-6 md:px-10 py-16">
        <Skeleton className="h-8 w-40" />
        <div className="mt-10 grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <Skeleton className="h-[520px] w-full" />
          <Skeleton className="h-72 w-full" />
        </div>
      </div>
    );
  }

  if (placed) {
    return (
      <div className="max-w-content mx-auto flex min-h-[55vh] flex-col items-center justify-center px-6 text-center">
        <p className="font-serif text-2xl text-text-light">Confirming your order…</p>
        <p className="mt-4 text-[12px] tracking-widest2 uppercase text-text-muted">One moment</p>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="max-w-content mx-auto flex min-h-[55vh] flex-col items-center justify-center px-6 text-center">
        <p className="font-serif text-2xl text-text-light">Your bag is empty</p>
        <p className="mt-4 max-w-sm text-[13px] leading-relaxed font-light text-text-muted">
          There is nothing to check out yet.
        </p>
        <ButtonLink href="/shop" className="mt-10">
          Continue Shopping
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="max-w-content mx-auto px-6 md:px-10 py-14">
      <header className="mb-12">
        <p className="eyebrow mb-3">Checkout</p>
        <h1 className="font-serif font-light text-[clamp(1.8rem,4vw,2.4rem)] tracking-[0.04em] text-text-light">
          Checkout
        </h1>
      </header>

      <div className="grid gap-14 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
        {/* form */}
        <div className="space-y-14">
          <Section title="Contact">
            <div className="grid gap-6 sm:grid-cols-2">
              <div data-invalid={errors.contact.email ? "true" : undefined}>
                <TextField
                  label="Email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  value={draft.contact.email}
                  onChange={(e) => patchContact("email", e.target.value)}
                  error={errors.contact.email}
                />
              </div>
              <div data-invalid={errors.contact.phone ? "true" : undefined}>
                <TextField
                  label="Phone"
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  value={draft.contact.phone}
                  onChange={(e) => patchContact("phone", e.target.value)}
                  error={errors.contact.phone}
                />
              </div>
            </div>
          </Section>

          <Section title="Shipping Address">
            <div className="grid gap-6">
              <div data-invalid={errors.shipping.fullName ? "true" : undefined}>
                <TextField
                  label="Full Name"
                  autoComplete="name"
                  value={draft.shipping.fullName}
                  onChange={(e) => patchShipping("fullName", e.target.value)}
                  error={errors.shipping.fullName}
                />
              </div>
              <div data-invalid={errors.shipping.address ? "true" : undefined}>
                <TextField
                  label="Address"
                  autoComplete="street-address"
                  value={draft.shipping.address}
                  onChange={(e) => patchShipping("address", e.target.value)}
                  error={errors.shipping.address}
                />
              </div>
              <div className="grid gap-6 sm:grid-cols-3">
                <div data-invalid={errors.shipping.district ? "true" : undefined}>
                  <TextField
                    label="District"
                    value={draft.shipping.district}
                    onChange={(e) => patchShipping("district", e.target.value)}
                    error={errors.shipping.district}
                  />
                </div>
                <div data-invalid={errors.shipping.province ? "true" : undefined}>
                  <TextField
                    label="Province"
                    value={draft.shipping.province}
                    onChange={(e) => patchShipping("province", e.target.value)}
                    error={errors.shipping.province}
                  />
                </div>
                <div data-invalid={errors.shipping.postalCode ? "true" : undefined}>
                  <TextField
                    label="Postal Code"
                    inputMode="numeric"
                    autoComplete="postal-code"
                    value={draft.shipping.postalCode}
                    onChange={(e) => patchShipping("postalCode", e.target.value)}
                    error={errors.shipping.postalCode}
                  />
                </div>
              </div>
            </div>
          </Section>

          <Section title="Delivery">
            <div className="space-y-3">
              {DELIVERY_METHODS.map((m) => (
                <ChoiceRow
                  key={m.id}
                  selected={draft.delivery === m.id}
                  onSelect={() => setDraft((d) => ({ ...d, delivery: m.id as DeliveryMethodId }))}
                  title={m.name}
                  description={`${m.description} · ${m.etaDays}`}
                  trailing={
                    m.id === "standard" && totals.subtotal >= 5000
                      ? "Complimentary"
                      : formatTHB(m.price)
                  }
                />
              ))}
            </div>
          </Section>

          <Section title="Payment">
            <div className="space-y-3">
              {PAYMENT_METHODS.map((m) => (
                <ChoiceRow
                  key={m.id}
                  selected={draft.payment === m.id}
                  onSelect={() => setDraft((d) => ({ ...d, payment: m.id as PaymentMethodId }))}
                  title={m.name}
                  description={m.description}
                />
              ))}
            </div>
            <p className="mt-4 text-[11px] leading-relaxed text-text-muted">
              Payment is processed on the next step. Your card details are never stored by
              SARNSARENE.
            </p>
          </Section>
        </div>

        {/* summary */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <OrderSummary lines={lines} totals={totals} showItems />
          <Button
            fullWidth
            size="lg"
            className="mt-5"
            onClick={handlePlaceOrder}
            disabled={processing}
          >
            {processing ? "Placing your order…" : "Place Order"}
          </Button>

          {submitError && (
            <p
              role="alert"
              className="mt-4 border border-[#9d5c4d]/40 bg-[#9d5c4d]/[0.06] px-4 py-3 text-[12px] leading-relaxed text-[#9d5c4d]"
            >
              {submitError}
            </p>
          )}

          <p className="mt-4 text-center text-[11px] leading-relaxed text-text-muted">
            By placing your order you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-6 text-[11px] tracking-widest2 uppercase text-text-light">{title}</h2>
      {children}
    </section>
  );
}

function ChoiceRow({
  selected,
  onSelect,
  title,
  description,
  trailing,
}: {
  selected: boolean;
  onSelect: () => void;
  title: string;
  description: string;
  trailing?: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "flex w-full items-center gap-4 border p-4 text-left transition-colors",
        selected ? "border-text-light bg-text-light/[0.03]" : "border-text-light/20 hover:border-text-light/40",
      )}
    >
      <span
        className={cn(
          "relative h-4 w-4 shrink-0 rounded-full border transition-colors",
          selected ? "border-text-light" : "border-text-light/30",
        )}
      >
        {selected && (
          <span className="absolute inset-1 rounded-full bg-text-light" />
        )}
      </span>
      <span className="flex-1">
        <span className="block text-[13px] text-text-light">{title}</span>
        <span className="block text-[11px] text-text-muted">{description}</span>
      </span>
      {trailing && (
        <span className="shrink-0 text-[12px] tabular-nums text-text-light">{trailing}</span>
      )}
    </button>
  );
}
