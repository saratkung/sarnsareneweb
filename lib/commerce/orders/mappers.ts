// Maps Prisma rows -> the domain `Order` shape used across the UI.

import type { Prisma } from "@prisma/client";
import type {
  CheckoutAddress,
  DeliveryMethodId,
  PaymentMethodId,
} from "@/lib/commerce/types";
import type { Order, OrderStatus, PaymentStatus } from "./types";

export const orderInclude = {
  items: true,
  payment: true,
  shipment: true,
  events: { orderBy: { at: "asc" } },
} satisfies Prisma.OrderInclude;

type PrismaOrder = Prisma.OrderGetPayload<{ include: typeof orderInclude }>;

const iso = (d: Date | null | undefined) => (d ? d.toISOString() : undefined);

export function toOrder(row: PrismaOrder): Order {
  const addr = row.shipAddress as CheckoutAddress;
  return {
    id: row.id,
    status: row.status as OrderStatus,
    customer: {
      ref: row.customerRef,
      userId: row.userId ?? null,
      email: row.email,
      phone: row.phone,
      name: row.name,
    },
    items: row.items.map((i) => ({
      productId: i.productId,
      productSlug: i.productSlug,
      productName: i.productName,
      variantId: i.variantId,
      colorName: i.colorName,
      sizeName: i.sizeName,
      image: i.image,
      unitPrice: i.unitPrice,
      quantity: i.quantity,
      lineTotal: i.lineTotal,
    })),
    shippingAddress: addr,
    payment: {
      method: (row.payment?.method ?? "promptpay") as PaymentMethodId,
      status: (row.payment?.status ?? "PENDING") as PaymentStatus,
      reference: row.payment?.reference ?? "",
      instructions: row.payment?.instructions ?? undefined,
      amount: row.payment?.amount ?? row.total,
      paidAt: iso(row.payment?.paidAt),
      refundedAt: iso(row.payment?.refundedAt),
    },
    shipment: {
      method: (row.shipment?.method ?? "standard") as DeliveryMethodId,
      carrier: row.shipment?.carrier ?? undefined,
      trackingNumber: row.shipment?.trackingNumber ?? undefined,
      trackingUrl: row.shipment?.trackingUrl ?? undefined,
      shippedAt: iso(row.shipment?.shippedAt),
      deliveredAt: iso(row.shipment?.deliveredAt),
    },
    subtotal: row.subtotal,
    shippingTotal: row.shippingTotal,
    total: row.total,
    events: row.events.map((e) => ({
      at: e.at.toISOString(),
      status: e.status as OrderStatus,
      note: e.note ?? undefined,
      by: e.by,
    })),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}
