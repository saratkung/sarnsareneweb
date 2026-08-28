// ============================================================
// SARNSARENE — admin order operations (§16–17) + dashboard (§15).
//
// Every mutation goes through the status machine, writes an
// OrderEvent (by: admin email), and appends an audit entry.
// Cancel / refund release reserved stock and call the payment
// provider — all inside one transaction.
// ============================================================

import { prisma } from "@/lib/db";
import { getPaymentProvider } from "@/lib/commerce/payment";
import { releaseWithTx } from "@/lib/commerce/catalog/inventory";
import { logAudit } from "@/lib/commerce/audit";
import { canTransition } from "./status";
import { getOrderById, listAllOrders } from "./store";
import { orderInclude, toOrder } from "./mappers";
import type { Order, OrderStatus } from "./types";

export type AdminOrderAction =
  | { type: "confirm_payment" }
  | { type: "start_preparing" }
  | { type: "mark_shipped"; carrier: string; trackingNumber: string }
  | { type: "mark_delivered" }
  | { type: "mark_completed" }
  | { type: "cancel"; reason: string }
  | { type: "refund"; reason: string };

export type AdminActionResult =
  | { ok: true; order: Order }
  | { ok: false; error: string };

const TARGET: Record<AdminOrderAction["type"], OrderStatus> = {
  confirm_payment: "PAID",
  start_preparing: "PREPARING",
  mark_shipped: "SHIPPED",
  mark_delivered: "DELIVERED",
  mark_completed: "COMPLETED",
  cancel: "CANCELLED",
  refund: "REFUNDED",
};

export async function applyOrderAction(
  orderId: string,
  action: AdminOrderAction,
  actor: string,
): Promise<AdminActionResult> {
  const order = await getOrderById(orderId);
  if (!order) return { ok: false, error: "Order not found." };

  const to = TARGET[action.type];
  if (order.status === to) return { ok: true, order };
  if (!canTransition(order.status, to)) {
    return { ok: false, error: `Cannot move a ${order.status} order to ${to}.` };
  }

  if (action.type === "mark_shipped" && (!action.carrier.trim() || !action.trackingNumber.trim())) {
    return { ok: false, error: "Carrier and tracking number are required." };
  }
  if ((action.type === "cancel" || action.type === "refund") && !action.reason.trim()) {
    return { ok: false, error: "A reason is required." };
  }

  // external calls before the DB transaction
  if (action.type === "refund" && order.payment.status === "PAID") {
    await getPaymentProvider().refund(order.payment.reference, order.total);
  }
  if (action.type === "confirm_payment" && order.payment.status !== "PAID") {
    await getPaymentProvider().confirmCharge(order.payment.reference);
  }

  const from = order.status;
  const releasesStock =
    (action.type === "cancel" || action.type === "refund") && order.status !== "PENDING_PAYMENT";
  const stockLines = order.items.map((i) => ({ variantId: i.variantId, quantity: i.quantity }));

  const updated = await prisma.$transaction(async (tx) => {
    if (releasesStock) await releaseWithTx(tx, stockLines, orderId);

    await tx.order.update({ where: { id: orderId }, data: { status: to } });

    if (action.type === "confirm_payment") {
      await tx.payment.update({
        where: { orderId },
        data: { status: "PAID", paidAt: new Date() },
      });
    }
    if (action.type === "refund") {
      await tx.payment.update({
        where: { orderId },
        data: { status: "REFUNDED", refundedAt: new Date() },
      });
    }
    if (action.type === "mark_shipped") {
      await tx.shipment.update({
        where: { orderId },
        data: {
          carrier: action.carrier.trim(),
          trackingNumber: action.trackingNumber.trim(),
          trackingUrl: `https://track.thailandpost.co.th/?trackNumber=${encodeURIComponent(
            action.trackingNumber.trim(),
          )}`,
          shippedAt: new Date(),
        },
      });
    }
    if (action.type === "mark_delivered") {
      await tx.shipment.update({ where: { orderId }, data: { deliveredAt: new Date() } });
    }

    await tx.orderEvent.create({
      data: {
        orderId,
        status: to,
        by: actor,
        note:
          action.type === "cancel" || action.type === "refund" ? action.reason.trim() : null,
      },
    });

    return tx.order.findUniqueOrThrow({ where: { id: orderId }, include: orderInclude });
  });

  await logAudit({
    actor,
    action: `order.${action.type}`,
    targetType: "order",
    targetId: orderId,
    summary: `${orderId}: ${from} → ${to}`,
  });

  return { ok: true, order: toOrder(updated) };
}

// ---- lists + dashboard ------------------------------------------------

export type AdminOrderFilter = "all" | OrderStatus;

export async function adminListOrders(filter: AdminOrderFilter = "all"): Promise<Order[]> {
  const all = await listAllOrders();
  return filter === "all" ? all : all.filter((o) => o.status === filter);
}

export function adminGetOrder(orderId: string): Promise<Order | null> {
  return getOrderById(orderId);
}

export type DashboardStats = {
  todayOrders: number;
  todayRevenue: number;
  pendingPayment: number;
  toShip: number;
  openOrders: number;
  revenueAllTime: number;
};

export async function dashboardStats(): Promise<DashboardStats> {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const [todayOrders, todayPaid, pendingPayment, toShip, openOrders, paidOrders] =
    await Promise.all([
      prisma.order.count({ where: { createdAt: { gte: startOfDay } } }),
      prisma.order.findMany({
        where: {
          createdAt: { gte: startOfDay },
          payment: { status: "PAID" },
          status: { not: "CANCELLED" },
        },
        select: { total: true },
      }),
      prisma.order.count({ where: { status: "PENDING_PAYMENT" } }),
      prisma.order.count({ where: { status: { in: ["PAID", "PREPARING"] } } }),
      prisma.order.count({
        where: { status: { notIn: ["COMPLETED", "CANCELLED", "REFUNDED"] } },
      }),
      prisma.order.findMany({
        where: { payment: { status: "PAID" }, status: { not: "REFUNDED" } },
        select: { total: true },
      }),
    ]);

  return {
    todayOrders,
    todayRevenue: todayPaid.reduce((s, o) => s + o.total, 0),
    pendingPayment,
    toShip,
    openOrders,
    revenueAllTime: paidOrders.reduce((s, o) => s + o.total, 0),
  };
}
