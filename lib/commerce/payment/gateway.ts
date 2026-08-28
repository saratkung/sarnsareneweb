// ============================================================
// SARNSARENE — real payment gateway adapter (skeleton).
//
// A worked example of how a production provider (Omise / 2C2P /
// Stripe) plugs into the same PaymentProvider interface. It reads
// its keys from the environment and, until they are present,
// fails closed. Filling in the four methods is the ONLY work
// needed to go live — checkout and order creation don't change.
// ============================================================

import type {
  Charge,
  ChargeRequest,
  PaymentProvider,
  RefundResult,
} from "./types";

export class GatewayProvider implements PaymentProvider {
  readonly id: string;
  private readonly secretKey: string | undefined;
  private readonly publicKey: string | undefined;

  constructor(id = "omise") {
    this.id = id;
    this.secretKey = process.env.PAYMENT_SECRET_KEY;
    this.publicKey = process.env.PAYMENT_PUBLIC_KEY;
  }

  private assertConfigured() {
    if (!this.secretKey) {
      throw new Error(
        `Payment provider "${this.id}" is selected but PAYMENT_SECRET_KEY is not set.`,
      );
    }
  }

  async createCharge(_req: ChargeRequest): Promise<Charge> {
    this.assertConfigured();
    // TODO: POST to the gateway. Map:
    //   card          -> create a charge from the tokenised card         -> "paid"
    //   promptpay     -> create a "source", return the QR svg/url        -> "pending"
    //   bank_transfer -> return the merchant account + reference          -> "pending"
    // Return { reference: gateway.id, status, instructions? }.
    throw new Error("GatewayProvider.createCharge not implemented");
  }

  async getCharge(_reference: string): Promise<Charge> {
    this.assertConfigured();
    // TODO: GET the charge, map gateway status -> ChargeStatus.
    throw new Error("GatewayProvider.getCharge not implemented");
  }

  async confirmCharge(reference: string): Promise<Charge> {
    // Production settlement is webhook-driven — this is normally a no-op
    // that just reflects current state.
    return this.getCharge(reference);
  }

  async refund(_reference: string, _amount: number): Promise<RefundResult> {
    this.assertConfigured();
    // TODO: POST a refund; return { ok: true, refundedAt } or { ok: false, reason }.
    throw new Error("GatewayProvider.refund not implemented");
  }
}
