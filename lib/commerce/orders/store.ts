// ============================================================
// SARNSARENE — order reads (Phase 4: Prisma).
//
// Thin query helpers returning the domain `Order` shape. Writes
// live in service.ts / admin.ts as explicit transactions.
// ============================================================

import { prisma } from "@/lib/db";
import { orderInclude, toOrder } from "./mappers";
import type { Order } from "./types";

export async function getOrderById(id: string): Promise<Order | null> {
  const row = await prisma.order.findUnique({ where: { id }, include: orderInclude });
  return row ? toOrder(row) : null;
}

export async function listOrdersByCustomer(ref: string): Promise<Order[]> {
  const rows = await prisma.order.findMany({
    where: { customerRef: ref },
    include: orderInclude,
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toOrder);
}

export async function listOrdersByUser(userId: string): Promise<Order[]> {
  const rows = await prisma.order.findMany({
    where: { userId },
    include: orderInclude,
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toOrder);
}

export async function listAllOrders(): Promise<Order[]> {
  const rows = await prisma.order.findMany({
    include: orderInclude,
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toOrder);
}
