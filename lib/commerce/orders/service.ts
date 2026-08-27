// ============================================================
// SARNSARENE — order service (Phase 4: Prisma).
//
// The application boundary for order creation + payment. Route
// handlers and Server Components call these; nothing else touches
// the database. Order creation is transactional: idempotency
// claim + stock reservation + order write happen atomically, and
// the payment-provider call happens outside the transaction.
// ============================================================

import { prisma } from "@/lib/db";
import type { CheckoutDraft } from "@/lib/commerce/types";
import { shippingCost, validateCheckout, hasErrors } from "@/lib/commerce/checkout";
import { getVariantById } from "@/lib/commerce/catalog";
import { reserveWithTx, releaseWithTx } from "@/lib/commerce/catalog/inventory";
import { variantPrice } from "@/lib/commerce/types";
import { getPaymentProvider } from "@/lib/commerce/payment";
import { formatOrderId, orderDateKey } from "./id";
import { orderInclude, toOrder } from "./mappers";
import { getOrderById, listOrdersByCustomer, listOrdersByUser } from "./store";
import type { OrderViewer } from "./customer";
import type {
  CreateOrderInput,
  CreateOrderResult,
  Order,
  OrderItem,
} from "./types";

export { getOrderById } from "./store";

type CreateOpts = { customerRef: string; userId?: string; idempotencyKey?: string };

class DedupSignal extends Error {
  constructor(public order: Order) {
    super("dedup");
  }
}
class StockError extends Error {
  constructor(
    public variantId: string,
    public available: number,
  ) {
    super("stock");
  }
}

export async function createOrder(
  input: CreateOrderInput,
  opts: CreateOpts,
): Promise<CreateOrderResult> {
  // 1. fast idempotency path (no writes)
  if (opts.idempotencyKey) {
    const hit = await prisma.idempotencyKey.findUnique({
      where: { key: opts.idempotencyKey },
      include: { order: { include: orderInclude } },
    });
    if (hit?.order && hit.order.status !== "CANCELLED") {
      if (hit.order.customerRef !== opts.customerRef) {
        return { ok: false, error: { code: "VALIDATION", message: "Key already used." } };
      }
      return { ok: true, order: toOrder(hit.order), deduped: true };
    }
  }

  // 2. shape validation
  if (!input.items?.length) {
    return { ok: false, error: { code: "EMPTY_CART", message: "Your bag is empty." } };
  }
  const draft: CheckoutDraft = {
    contact: input.contact,
    shipping: input.shippingAddress,
    delivery: input.delivery,
    payment: input.payment,
  };
  if (hasErrors(validateCheckout(draft))) {
    return { ok: false, error: { code: "VALIDATION", message: "Please check your details." } };
  }

  // 3. resolve items with server-side prices
  const items: OrderItem[] = [];
  for (const line of input.items) {
    const qty = Math.max(1, Math.floor(line.quantity));
    const found = await getVariantById(line.variantId);
    if (!found || found.product.id !== line.productId) {
      return {
        ok: false,
        error: {
          code: "PRODUCT_UNAVAILABLE",
          message: "An item in your bag is no longer available.",
          productId: line.productId,
        },
      };
    }
    if (found.product.status === "ARCHIVED" || found.product.status === "DRAFT") {
      return {
        ok: false,
        error: {
          code: "PRODUCT_UNAVAILABLE",
          message: `${found.product.name} is no longer available.`,
          productId: found.product.id,
        },
      };
    }
    const unitPrice = variantPrice(found.product, found.variant);
    const color = found.product.colors.find((c) => c.id === found.variant.colorId);
    const size = found.product.sizes.find((s) => s.id === found.variant.sizeId);
    items.push({
      productId: found.product.id,
      productSlug: found.product.slug,
      productName: found.product.name,
      variantId: found.variant.id,
      colorName: color?.name ?? "—",
      sizeName: size?.name ?? "One Size",
      image: color?.images[0] ?? found.product.colors[0].images[0],
      unitPrice,
      quantity: qty,
      lineTotal: unitPrice * qty,
    });
  }

  // 4. totals
  const subtotal = items.reduce((s, i) => s + i.lineTotal, 0);
  const shippingTotal = shippingCost(subtotal, input.delivery);
  const total = subtotal + shippingTotal;
  const stockLines = items.map((i) => ({ variantId: i.variantId, quantity: i.quantity }));
  const now = new Date();
  const dateKey = orderDateKey(now);

  // 5. transactional: claim key + reserve stock + write order
  let order: Order;
  try {
    order = await prisma.$transaction(
      async (tx) => {
      if (opts.idempotencyKey) {
        const claimed = await tx.idempotencyKey.findUnique({
          where: { key: opts.idempotencyKey },
          include: { order: { include: orderInclude } },
        });
        if (claimed?.order && claimed.order.status !== "CANCELLED") {
          throw new DedupSignal(toOrder(claimed.order));
        }
      }

      const seq =
        (await tx.order.count({ where: { id: { startsWith: `SR-${dateKey}-` } } })) + 1;
      const id = formatOrderId(dateKey, seq);

      const reservation = await reserveWithTx(tx, stockLines, id);
      if (!reservation.ok) {
        throw new StockError(reservation.variantId, reservation.available);
      }

      const created = await tx.order.create({
        data: {
          id,
          userId: opts.userId ?? null,
          customerRef: opts.customerRef,
          email: input.contact.email.trim(),
          phone: input.contact.phone.trim(),
          name: input.shippingAddress.fullName.trim(),
          status: "PENDING_PAYMENT",
          subtotal,
          shippingTotal,
          total,
          shipAddress: input.shippingAddress,
          items: { create: items.map((i) => ({ ...i })) },
          payment: {
            create: { method: input.payment, status: "PENDING", amount: total },
          },
          shipment: { create: { method: input.delivery } },
          events: {
            create: { status: "PENDING_PAYMENT", by: "system", note: "Order received" },
          },
        },
        include: orderInclude,
      });

      if (opts.idempotencyKey) {
        await tx.idempotencyKey.create({ data: { key: opts.idempotencyKey, orderId: id } });
      }
      return toOrder(created);
      },
      { timeout: 15000, maxWait: 10000 },
    );
  } catch (e) {
    if (e instanceof DedupSignal) return { ok: true, order: e.order, deduped: true };
    if (e instanceof StockError) {
      const item = items.find((i) => i.variantId === e.variantId);
      return {
        ok: false,
        error: {
          code: "OUT_OF_STOCK",
          message: `${item?.productName ?? "An item"} — only ${e.available} left.`,
          variantId: e.variantId,
          available: e.available,
        },
      };
    }
    return { ok: false, error: { code: "INTERNAL", message: "Could not create your order." } };
  }

  // 6. charge (outside the transaction — it does network I/O)
  const charge = await getPaymentProvider().createCharge({
    orderId: order.id,
    method: input.payment,
    amount: total,
    currency: "THB",
    customerEmail: order.customer.email,
  });

  if (charge.status === "failed") {
    await prisma.$transaction(async (tx) => {
      await releaseWithTx(tx, stockLines, order.id);
      await tx.order.update({ where: { id: order.id }, data: { status: "CANCELLED" } });
      await tx.payment.update({
        where: { orderId: order.id },
        data: { status: "FAILED", reference: charge.reference },
      });
      await tx.orderEvent.create({
        data: {
          orderId: order.id,
          status: "CANCELLED",
          by: "system",
          note: charge.failureReason ?? "Payment failed",
        },
      });
      if (opts.idempotencyKey) {
        await tx.idempotencyKey.deleteMany({ where: { key: opts.idempotencyKey } });
      }
    });
    return {
      ok: false,
      error: { code: "PAYMENT_FAILED", message: charge.failureReason ?? "Payment failed." },
    };
  }

  // 7. record charge outcome
  const paid = charge.status === "paid";
  const final = await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: { orderId: order.id },
      data: {
        reference: charge.reference,
        instructions: charge.instructions ?? null,
        ...(paid && { status: "PAID", paidAt: new Date() }),
      },
    });
    if (paid) {
      await tx.order.update({ where: { id: order.id }, data: { status: "PAID" } });
      await tx.orderEvent.create({
        data: { orderId: order.id, status: "PAID", by: "system", note: "Payment confirmed" },
      });
    }
    return tx.order.findUniqueOrThrow({ where: { id: order.id }, include: orderInclude });
  });

  return { ok: true, order: toOrder(final), deduped: false };
}

// ---- viewer access control ------------------------------------------

function ownsOrder(order: Order, viewer: OrderViewer): boolean {
  if (viewer.customerRef && order.customer.ref === viewer.customerRef) return true;
  if (viewer.userId && order.customer.userId === viewer.userId) return true;
  return false;
}

// ---- payment confirmation (customer-driven / webhook stand-in) ---------

export async function confirmPayment(
  orderId: string,
  viewer: OrderViewer,
): Promise<CreateOrderResult> {
  const order = await getOrderById(orderId);
  if (!order || !ownsOrder(order, viewer)) {
    return { ok: false, error: { code: "NOT_FOUND", message: "Order not found." } };
  }
  if (order.status !== "PENDING_PAYMENT") {
    return { ok: true, order, deduped: true };
  }

  const charge = await getPaymentProvider().confirmCharge(order.payment.reference);
  if (charge.status !== "paid") {
    return { ok: false, error: { code: "PAYMENT_FAILED", message: "Payment not yet received." } };
  }

  const updated = await prisma.$transaction(async (tx) => {
    await tx.order.update({ where: { id: orderId }, data: { status: "PAID" } });
    await tx.payment.update({
      where: { orderId },
      data: { status: "PAID", paidAt: new Date() },
    });
    await tx.orderEvent.create({
      data: { orderId, status: "PAID", by: "system", note: "Payment confirmed" },
    });
    return tx.order.findUniqueOrThrow({ where: { id: orderId }, include: orderInclude });
  });
  return { ok: true, order: toOrder(updated), deduped: false };
}

// ---- reads -----------------------------------------------------------

export async function listOrdersForViewer(viewer: OrderViewer): Promise<Order[]> {
  const byRef = viewer.customerRef ? await listOrdersByCustomer(viewer.customerRef) : [];
  const byUser = viewer.userId ? await listOrdersByUser(viewer.userId) : [];
  const seen = new Set<string>();
  return [...byUser, ...byRef]
    .filter((o) => (seen.has(o.id) ? false : (seen.add(o.id), true)))
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

export async function getOrderForViewer(
  orderId: string,
  viewer: OrderViewer,
): Promise<Order | null> {
  const order = await getOrderById(orderId);
  if (!order || !ownsOrder(order, viewer)) return null;
  return order;
}
