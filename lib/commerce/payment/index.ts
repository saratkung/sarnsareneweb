// The one place the app resolves its payment provider (§8).
// Switch by env — checkout / order code never changes.

import type { PaymentProvider } from "./types";
import { MockPaymentProvider } from "./mock";
import { GatewayProvider } from "./gateway";

let provider: PaymentProvider | null = null;

export function getPaymentProvider(): PaymentProvider {
  if (!provider) {
    const which = (process.env.PAYMENT_PROVIDER || "mock").toLowerCase();
    provider = which === "mock" ? new MockPaymentProvider() : new GatewayProvider(which);
  }
  return provider;
}

export type { PaymentProvider, Charge, ChargeRequest, ChargeStatus } from "./types";
