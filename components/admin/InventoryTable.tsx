"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/commerce/types";
import { LOW_STOCK_THRESHOLD } from "@/lib/commerce/types";
import { cn } from "@/lib/cn";

type Row = {
  productId: string;
  productName: string;
  variantId: string;
  colorName: string;
  sizeName: string;
  original: number;
};

export function InventoryTable({ products }: { products: Product[] }) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const rows = useMemo<Row[]>(
    () =>
      products.flatMap((p) =>
        p.variants.map((v) => ({
          productId: p.id,
          productName: p.name,
          variantId: v.id,
          colorName: p.colors.find((c) => c.id === v.colorId)?.name ?? v.colorId,
          sizeName: p.sizes.find((s) => s.id === v.sizeId)?.name ?? v.sizeId,
          original: v.stock,
        })),
      ),
    [products],
  );

  const [edits, setEdits] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  const dirty = rows.filter((r) => {
    const e = edits[r.variantId];
    return e !== undefined && Number(e) !== r.original;
  });

  async function saveAll() {
    if (dirty.length === 0) return;
    setBusy(true);
    setNote(null);
    const byProduct = new Map<string, { variantId: string; stock: number }[]>();
    for (const r of dirty) {
      const arr = byProduct.get(r.productId) ?? [];
      arr.push({ variantId: r.variantId, stock: Number(edits[r.variantId]) || 0 });
      byProduct.set(r.productId, arr);
    }
    try {
      for (const [productId, patches] of byProduct) {
        const res = await fetch(`/api/admin/products/${productId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ kind: "variants", patches }),
        });
        if (!res.ok) throw new Error();
      }
      setEdits({});
      setNote(`Updated ${dirty.length} ${dirty.length === 1 ? "variant" : "variants"}.`);
      startTransition(() => router.refresh());
    } catch {
      setNote("Something went wrong saving. Please retry.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        <button
          className="inline-flex h-9 items-center px-4 text-[10px] tracking-widest2 uppercase bg-text-light text-bg disabled:opacity-40"
          onClick={saveAll}
          disabled={busy || dirty.length === 0}
        >
          {busy ? "Saving…" : dirty.length ? `Save ${dirty.length} change${dirty.length === 1 ? "" : "s"}` : "No changes"}
        </button>
        {note && <span className="text-[11px] text-text-muted">{note}</span>}
      </div>

      <div className="overflow-x-auto border border-text-light/10 bg-bg">
        <table className="w-full min-w-[560px] text-left text-[12px]">
          <thead>
            <tr className="border-b border-text-light/15 text-[9px] tracking-widest2 uppercase text-text-muted">
              <th className="px-5 py-2.5 font-normal">Product</th>
              <th className="py-2.5 pr-4 font-normal">Variant</th>
              <th className="py-2.5 pr-4 font-normal text-right">On hand</th>
              <th className="py-2.5 pr-5 font-normal text-right">New</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-text-light/10">
            {rows.map((r) => {
              const value = edits[r.variantId] ?? String(r.original);
              const n = Number(value);
              const state =
                n <= 0 ? "text-[#9d5c4d]" : n <= LOW_STOCK_THRESHOLD ? "text-[#b98a3e]" : "text-text-light";
              const changed = edits[r.variantId] !== undefined && n !== r.original;
              return (
                <tr key={r.variantId} className={cn(changed && "bg-gold/[0.06]")}>
                  <td className="px-5 py-2">
                    <Link
                      href={`/admin/products/${r.productId}`}
                      className="text-text-light hover:text-gold"
                    >
                      {r.productName}
                    </Link>
                  </td>
                  <td className="py-2 pr-4 text-text-muted">
                    {r.colorName}
                    {r.sizeName !== "One Size" && ` / ${r.sizeName}`}
                  </td>
                  <td className={cn("py-2 pr-4 text-right tabular-nums", state)}>{r.original}</td>
                  <td className="py-2 pr-5 text-right">
                    <input
                      className="h-8 w-16 border-b border-text-light/20 bg-transparent text-right text-[12px] tabular-nums focus:border-text-light focus:outline-none"
                      inputMode="numeric"
                      value={value}
                      onChange={(e) =>
                        setEdits((prev) => ({ ...prev, [r.variantId]: e.target.value }))
                      }
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
