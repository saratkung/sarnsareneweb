// ============================================================
// SARNSARENE — inventory operations (§19).
//
// The `*WithTx` helpers run inside a caller-supplied transaction
// so order creation can reserve stock and write the order in one
// atomic unit. `reserveStock` / `releaseStock` in catalog.ts wrap
// these in their own transaction for standalone admin use.
// ============================================================

import type { Prisma } from "@prisma/client";

export type StockLine = { variantId: string; quantity: number };

export type ReserveResult =
  | { ok: true }
  | { ok: false; variantId: string; available: number; productId?: string };

type Tx = Prisma.TransactionClient;

/** Recompute a product's headline status from its total stock. */
async function reconcileStatus(tx: Tx, productId: string) {
  const product = await tx.product.findUnique({
    where: { id: productId },
    include: { variants: { select: { stock: true } } },
  });
  if (!product) return;
  const total = product.variants.reduce((s, v) => s + v.stock, 0);
  if (total <= 0 && product.status === "ACTIVE") {
    await tx.product.update({ where: { id: productId }, data: { status: "SOLD_OUT" } });
  } else if (total > 0 && product.status === "SOLD_OUT") {
    await tx.product.update({ where: { id: productId }, data: { status: "ACTIVE" } });
  }
}

export async function reserveWithTx(
  tx: Tx,
  lines: StockLine[],
  orderId?: string,
): Promise<ReserveResult> {
  // validate every line first, for a precise error
  for (const line of lines) {
    const v = await tx.productVariant.findUnique({
      where: { id: line.variantId },
      include: { product: { select: { id: true, status: true } } },
    });
    if (!v) return { ok: false, variantId: line.variantId, available: 0 };
    if (v.product.status === "ARCHIVED" || v.product.status === "DRAFT") {
      return { ok: false, variantId: line.variantId, available: 0, productId: v.product.id };
    }
    if (v.stock < line.quantity) {
      return {
        ok: false,
        variantId: line.variantId,
        available: v.stock,
        productId: v.product.id,
      };
    }
  }

  const touched = new Set<string>();
  for (const line of lines) {
    // conditional decrement — the real guard against oversell / negatives
    const res = await tx.productVariant.updateMany({
      where: { id: line.variantId, stock: { gte: line.quantity } },
      data: { stock: { decrement: line.quantity } },
    });
    if (res.count === 0) {
      return { ok: false, variantId: line.variantId, available: 0 };
    }
    await tx.inventoryLog.create({
      data: { variantId: line.variantId, delta: -line.quantity, reason: "order_reserve", orderId },
    });
    const v = await tx.productVariant.findUnique({
      where: { id: line.variantId },
      select: { productId: true },
    });
    if (v) touched.add(v.productId);
  }
  for (const productId of touched) await reconcileStatus(tx, productId);
  return { ok: true };
}

export async function releaseWithTx(
  tx: Tx,
  lines: StockLine[],
  orderId?: string,
): Promise<void> {
  const touched = new Set<string>();
  for (const line of lines) {
    const v = await tx.productVariant.findUnique({
      where: { id: line.variantId },
      select: { productId: true },
    });
    if (!v) continue;
    await tx.productVariant.update({
      where: { id: line.variantId },
      data: { stock: { increment: line.quantity } },
    });
    await tx.inventoryLog.create({
      data: { variantId: line.variantId, delta: line.quantity, reason: "order_release", orderId },
    });
    touched.add(v.productId);
  }
  for (const productId of touched) await reconcileStatus(tx, productId);
}
