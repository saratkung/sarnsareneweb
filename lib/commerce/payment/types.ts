// ============================================================
// SARNSARENE — payment abstraction (§8).
//
// The checkout and order service speak ONLY to PaymentProvider.
// Phase 2 ships MockPaymentProvider; Phase 4 drops in a real
// gateway (Omise / 2C2P / Stripe) implementing the same
// interface, with zero changes to checkout or order creation.
// ============================================================

import type { Money, PaymentMethodId } from "@/lib/commerce/types";

export type ChargeStatus = "pending" | "paid" | "failed";

export type ChargeRequest = {
  orderId: string;
  method: PaymentMethodId;
  amount: Money;
  currency: "THB";
  customerEmail: string;
};

export type Charge = {
  /** provider-side id for this charge/intent */
  reference: string;
  status: ChargeStatus;
  /**
   * Method-specific payload the customer needs in order to pay:
   * a PromptPay QR string, bank-transfer instructions, a 3-DS
   * redirect URL, etc. Opaque to the rest of the app.
   */
  instructions?: string;
  failureReason?: string;
};

export type RefundResult =
  | { ok: true; refundedAt: string }
  | { ok: false; reason: string };

export interface PaymentProvider {
  readonly id: string;
  /** Create a charge for an order. Never throws for expected failures. */
  createCharge(req: ChargeRequest): Promise<Charge>;
  /** Poll current status (stands in for a gateway webhook in Phase 2). */
  getCharge(reference: string): Promise<Charge>;
  /**
   * Mark a pending charge as settled. In production this is driven by a
   * webhook; in Phase 2 the customer / a dev control calls it.
   */
  confirmCharge(reference: string): Promise<Charge>;
  refund(reference: string, amount: Money): Promise<RefundResult>;
}
