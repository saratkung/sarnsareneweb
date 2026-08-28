// ============================================================
// SARNSARENE — checkout constants + client-side validation.
//
// Phase 1 is UI only: nothing is submitted. But the shapes,
// shipping rules and validation live here so Phase 2 (order
// creation) and Phase 4 (payment gateway) plug in without the
// checkout screen changing.
// ============================================================

import type {
  CartLine,
  CartTotals,
  CheckoutDraft,
  DeliveryMethod,
  DeliveryMethodId,
  Money,
  PaymentMethodId,
} from "./types";

// ---- Shipping -----------------------------------------------------------

/** Orders at or above this subtotal ship standard for free. */
export const FREE_SHIPPING_THRESHOLD: Money = 5000;

export const DELIVERY_METHODS: DeliveryMethod[] = [
  {
    id: "standard",
    name: "Standard Delivery",
    description: "Thailand · tracked",
    price: 120,
    etaDays: "2–5 business days",
  },
  {
    id: "express",
    name: "Express Delivery",
    description: "Thailand · next-day where available",
    price: 350,
    etaDays: "1–2 business days",
  },
];

export const PAYMENT_METHODS: { id: PaymentMethodId; name: string; description: string }[] = [
  { id: "promptpay", name: "PromptPay", description: "Scan to pay with any Thai banking app" },
  { id: "card", name: "Credit / Debit Card", description: "Visa, Mastercard, JCB" },
  { id: "bank_transfer", name: "Bank Transfer", description: "Manual transfer · confirmed within 24h" },
];

export function getDeliveryMethod(id: DeliveryMethodId): DeliveryMethod {
  return DELIVERY_METHODS.find((m) => m.id === id) ?? DELIVERY_METHODS[0];
}

export function shippingCost(subtotal: Money, delivery: DeliveryMethodId): Money {
  const method = getDeliveryMethod(delivery);
  if (delivery === "standard" && subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
  return method.price;
}

// ---- Totals -----------------------------------------------------------

export function cartSubtotal(lines: CartLine[]): Money {
  return lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);
}

export function cartItemCount(lines: CartLine[]): number {
  return lines.reduce((sum, l) => sum + l.quantity, 0);
}

export function computeTotals(
  lines: CartLine[],
  delivery: DeliveryMethodId = "standard",
): CartTotals {
  const subtotal = cartSubtotal(lines);
  const shipping = lines.length === 0 ? 0 : shippingCost(subtotal, delivery);
  return {
    subtotal,
    shipping,
    total: subtotal + shipping,
    itemCount: cartItemCount(lines),
  };
}

// ---- Validation -----------------------------------------------------------

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

export type CheckoutErrors = {
  contact: FieldErrors<CheckoutDraft["contact"]>;
  shipping: FieldErrors<CheckoutDraft["shipping"]>;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Thai mobile: 9–10 digits, optionally +66 / leading 0, spaces or dashes allowed
const PHONE_RE = /^(\+?66|0)?[\s-]?\d{1,2}[\s-]?\d{3}[\s-]?\d{3,4}$/;
const POSTCODE_RE = /^\d{5}$/;

function required(value: string, message = "Required"): string | undefined {
  return value.trim().length === 0 ? message : undefined;
}

export function validateCheckout(draft: CheckoutDraft): CheckoutErrors {
  const contact: CheckoutErrors["contact"] = {};
  const shipping: CheckoutErrors["shipping"] = {};

  if (required(draft.contact.email)) contact.email = "Enter your email";
  else if (!EMAIL_RE.test(draft.contact.email.trim())) contact.email = "Enter a valid email";

  if (required(draft.contact.phone)) contact.phone = "Enter a phone number";
  else if (!PHONE_RE.test(draft.contact.phone.trim())) contact.phone = "Enter a valid phone number";

  shipping.fullName = required(draft.shipping.fullName, "Enter the recipient's name");
  shipping.address = required(draft.shipping.address, "Enter a street address");
  shipping.district = required(draft.shipping.district, "Enter a district");
  shipping.province = required(draft.shipping.province, "Enter a province");

  if (required(draft.shipping.postalCode)) shipping.postalCode = "Enter a postal code";
  else if (!POSTCODE_RE.test(draft.shipping.postalCode.trim()))
    shipping.postalCode = "Postal code must be 5 digits";

  // strip undefined keys so `hasErrors` is a simple check
  for (const obj of [contact, shipping] as Record<string, string | undefined>[]) {
    for (const k of Object.keys(obj)) if (obj[k] === undefined) delete obj[k];
  }

  return { contact, shipping };
}

export function hasErrors(errors: CheckoutErrors): boolean {
  return Object.keys(errors.contact).length > 0 || Object.keys(errors.shipping).length > 0;
}

export const EMPTY_CHECKOUT_DRAFT: CheckoutDraft = {
  contact: { email: "", phone: "" },
  shipping: { fullName: "", address: "", district: "", province: "", postalCode: "" },
  delivery: "standard",
  payment: "promptpay",
};
