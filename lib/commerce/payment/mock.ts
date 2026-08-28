// ============================================================
// SARNSARENE — MockPaymentProvider (Phase 2).
//
// Behaviour by method:
//   card          -> settles immediately ("paid")
//   promptpay     -> "pending" + a fake QR payload; settled by
//                    confirmCharge() (stands in for the bank webhook)
//   bank_transfer -> "pending" + transfer instructions; settled by
//                    confirmCharge() (stands in for admin confirmation)
//
// A charge reference starting "mock_fail_" always fails — handy
// for exercising the payment-failed path.
// ============================================================

import type {
  Charge,
  ChargeRequest,
  PaymentProvider,
  RefundResult,
} from "./types";

function ref(prefix: string): string {
  return `${prefix}_${Math.abs(hashNow())}${Math.random().toString(36).slice(2, 8)}`;
}

// Date.now is fine on the server; only Workflow scripts forbid it.
function hashNow(): number {
  return Date.now() ^ (Date.now() >>> 3);
}

function promptPayPayload(orderId: string, amount: number): string {
  // Not a real EMVCo string — a readable stand-in the UI can show.
  return `PROMPTPAY|merchant=SARNSARENE|order=${orderId}|amount=${amount}.00|ref=${orderId}`;
}

function bankInstructions(orderId: string, amount: number): string {
  return [
    "Kasikorn Bank · SARNSARENE Co., Ltd. · 123-4-56789-0",
    `Amount: THB ${amount.toLocaleString("en-US")}`,
    `Reference: ${orderId}`,
    "Your order is confirmed once we verify the transfer (within 24 hours).",
  ].join("\n");
}

export class MockPaymentProvider implements PaymentProvider {
  readonly id = "mock";
  private charges = new Map<string, Charge>();

  async createCharge(req: ChargeRequest): Promise<Charge> {
    await tick();

    if (req.method === "card") {
      const charge: Charge = { reference: ref("mock_card"), status: "paid" };
      this.charges.set(charge.reference, charge);
      return charge;
    }

    if (req.method === "promptpay") {
      const charge: Charge = {
        reference: ref("mock_ppay"),
        status: "pending",
        instructions: promptPayPayload(req.orderId, req.amount),
      };
      this.charges.set(charge.reference, charge);
      return charge;
    }

    // bank_transfer
    const charge: Charge = {
      reference: ref("mock_bank"),
      status: "pending",
      instructions: bankInstructions(req.orderId, req.amount),
    };
    this.charges.set(charge.reference, charge);
    return charge;
  }

  async getCharge(reference: string): Promise<Charge> {
    await tick();
    return this.charges.get(reference) ?? this.synthesize(reference);
  }

  async confirmCharge(reference: string): Promise<Charge> {
    await tick();
    if (reference.startsWith("mock_fail_")) {
      return { reference, status: "failed", failureReason: "Payment declined" };
    }
    const existing = this.charges.get(reference) ?? this.synthesize(reference);
    const settled: Charge = { ...existing, status: "paid" };
    this.charges.set(reference, settled);
    return settled;
  }

  async refund(reference: string, _amount: number): Promise<RefundResult> {
    await tick();
    const existing = this.charges.get(reference);
    if (existing) this.charges.set(reference, { ...existing, status: "failed" });
    return { ok: true, refundedAt: new Date().toISOString() };
  }

  /** Recreate a plausible charge when the in-memory map was lost (dev restart). */
  private synthesize(reference: string): Charge {
    const charge: Charge = {
      reference,
      status: reference.startsWith("mock_card") ? "paid" : "pending",
    };
    this.charges.set(reference, charge);
    return charge;
  }
}

function tick(): Promise<void> {
  return new Promise((r) => setTimeout(r, 250));
}
