"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Product, ProductStatus } from "@/lib/commerce/types";
import { categories, collections } from "@/lib/commerce/catalog/data";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/cn";

const STATUSES: ProductStatus[] = ["ACTIVE", "DRAFT", "SOLD_OUT", "ARCHIVED"];

const input =
  "w-full h-10 bg-transparent border-b border-text-light/20 text-[13px] focus:border-text-light focus:outline-none";
const label = "block text-[10px] tracking-widest2 uppercase text-text-muted mb-1.5";
const saveBtn =
  "inline-flex h-9 items-center px-4 text-[10px] tracking-widest2 uppercase bg-text-light text-bg transition-opacity disabled:opacity-40";

function Panel({
  title,
  children,
  onSave,
  saving,
  savedNote,
  error,
}: {
  title: string;
  children: React.ReactNode;
  onSave?: () => void;
  saving?: boolean;
  savedNote?: string | null;
  error?: string | null;
}) {
  return (
    <section className="border border-text-light/10 bg-bg">
      <div className="border-b border-text-light/10 px-5 py-3">
        <h2 className="text-[10px] tracking-widest2 uppercase text-text-muted">{title}</h2>
      </div>
      <div className="space-y-4 p-5">{children}</div>
      {onSave && (
        <div className="flex items-center gap-3 border-t border-text-light/10 px-5 py-3">
          <button className={saveBtn} onClick={onSave} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </button>
          {savedNote && <span className="text-[11px] text-[#6f8f6a]">{savedNote}</span>}
          {error && <span className="text-[11px] text-[#9d5c4d]">{error}</span>}
        </div>
      )}
    </section>
  );
}

export function ProductEditForm({ product }: { product: Product }) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  // ---- core ----
  const [core, setCore] = useState({
    name: product.name,
    shortDescription: product.shortDescription,
    price: String(product.price),
    status: product.status,
    categorySlug: product.categorySlug,
    collectionSlug: product.collectionSlug,
    story: product.story.join("\n"),
  });
  const [coreState, setCoreState] = useState<{ saving: boolean; ok: string | null; err: string | null }>({
    saving: false,
    ok: null,
    err: null,
  });

  // ---- variants ----
  const [variants, setVariants] = useState(
    product.variants.map((v) => ({
      id: v.id,
      colorName: product.colors.find((c) => c.id === v.colorId)?.name ?? v.colorId,
      sizeName: product.sizes.find((s) => s.id === v.sizeId)?.name ?? v.sizeId,
      stock: String(v.stock),
      price: v.price != null ? String(v.price) : "",
    })),
  );
  const [varState, setVarState] = useState<{ saving: boolean; ok: string | null; err: string | null }>({
    saving: false,
    ok: null,
    err: null,
  });

  // ---- images ----
  const [images, setImages] = useState(
    Object.fromEntries(product.colors.map((c) => [c.id, c.images.join("\n")])),
  );
  const [imgState, setImgState] = useState<{ saving: string | null; ok: string | null; err: string | null }>({
    saving: null,
    ok: null,
    err: null,
  });

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function patch(body: unknown) {
    const res = await fetch(`/api/admin/products/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error ?? "Save failed.");
    startTransition(() => router.refresh());
  }

  async function saveCore() {
    setCoreState({ saving: true, ok: null, err: null });
    try {
      await patch({
        kind: "core",
        patch: {
          name: core.name,
          shortDescription: core.shortDescription,
          price: Number(core.price) || 0,
          status: core.status,
          categorySlug: core.categorySlug,
          collectionSlug: core.collectionSlug,
          story: core.story.split("\n").map((s) => s.trim()).filter(Boolean),
        },
      });
      setCoreState({ saving: false, ok: "Saved", err: null });
    } catch (e) {
      setCoreState({ saving: false, ok: null, err: (e as Error).message });
    }
  }

  async function saveVariants() {
    setVarState({ saving: true, ok: null, err: null });
    try {
      await patch({
        kind: "variants",
        patches: variants.map((v) => ({
          variantId: v.id,
          stock: Number(v.stock) || 0,
          price: v.price.trim() === "" ? null : Number(v.price) || 0,
        })),
      });
      setVarState({ saving: false, ok: "Saved", err: null });
    } catch (e) {
      setVarState({ saving: false, ok: null, err: (e as Error).message });
    }
  }

  async function saveImages(colorId: string) {
    setImgState({ saving: colorId, ok: null, err: null });
    try {
      await patch({
        kind: "images",
        colorId,
        images: (images[colorId] ?? "").split("\n").map((s) => s.trim()).filter(Boolean),
      });
      setImgState({ saving: null, ok: colorId, err: null });
    } catch (e) {
      setImgState({ saving: null, ok: null, err: (e as Error).message });
    }
  }

  async function doDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      router.push("/admin/products");
    } catch {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <Panel
        title="Details"
        onSave={saveCore}
        saving={coreState.saving}
        savedNote={coreState.ok}
        error={coreState.err}
      >
        <div>
          <span className={label}>Name</span>
          <input
            className={input}
            value={core.name}
            onChange={(e) => setCore({ ...core, name: e.target.value })}
          />
        </div>
        <div>
          <span className={label}>Short description</span>
          <input
            className={input}
            value={core.shortDescription}
            onChange={(e) => setCore({ ...core, shortDescription: e.target.value })}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <span className={label}>Price (THB)</span>
            <input
              className={input}
              inputMode="numeric"
              value={core.price}
              onChange={(e) => setCore({ ...core, price: e.target.value })}
            />
          </div>
          <div>
            <span className={label}>Status</span>
            <select
              className={input}
              value={core.status}
              onChange={(e) => setCore({ ...core, status: e.target.value as ProductStatus })}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>
          <div>
            <span className={label}>Category</span>
            <select
              className={input}
              value={core.categorySlug}
              onChange={(e) => setCore({ ...core, categorySlug: e.target.value })}
            >
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <span className={label}>Collection</span>
            <select
              className={input}
              value={core.collectionSlug}
              onChange={(e) => setCore({ ...core, collectionSlug: e.target.value })}
            >
              {collections.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <span className={label}>Product story (one paragraph per line)</span>
          <textarea
            className="w-full border border-text-light/20 bg-transparent p-3 text-[13px] leading-relaxed focus:border-text-light focus:outline-none"
            rows={4}
            value={core.story}
            onChange={(e) => setCore({ ...core, story: e.target.value })}
          />
        </div>
      </Panel>

      <Panel
        title="Variants & Inventory"
        onSave={saveVariants}
        saving={varState.saving}
        savedNote={varState.ok}
        error={varState.err}
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[440px] text-left text-[12px]">
            <thead>
              <tr className="border-b border-text-light/15 text-[9px] tracking-widest2 uppercase text-text-muted">
                <th className="py-2 pr-4 font-normal">Colour</th>
                <th className="py-2 pr-4 font-normal">Size</th>
                <th className="py-2 pr-4 font-normal">Stock</th>
                <th className="py-2 font-normal">Price override</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-text-light/10">
              {variants.map((v, i) => (
                <tr key={v.id}>
                  <td className="py-2 pr-4 text-text-light">{v.colorName}</td>
                  <td className="py-2 pr-4 text-text-muted">{v.sizeName}</td>
                  <td className="py-2 pr-4">
                    <input
                      className="h-8 w-16 border-b border-text-light/20 bg-transparent text-[12px] tabular-nums focus:border-text-light focus:outline-none"
                      inputMode="numeric"
                      value={v.stock}
                      onChange={(e) => {
                        const next = [...variants];
                        next[i] = { ...v, stock: e.target.value };
                        setVariants(next);
                      }}
                    />
                  </td>
                  <td className="py-2">
                    <input
                      className="h-8 w-24 border-b border-text-light/20 bg-transparent text-[12px] tabular-nums focus:border-text-light focus:outline-none"
                      inputMode="numeric"
                      placeholder="—"
                      value={v.price}
                      onChange={(e) => {
                        const next = [...variants];
                        next[i] = { ...v, price: e.target.value };
                        setVariants(next);
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[11px] text-text-muted">
          Setting total stock to 0 flips the product to SOLD OUT automatically; adding stock
          back flips it to ACTIVE.
        </p>
      </Panel>

      <section className="border border-text-light/10 bg-bg">
        <div className="border-b border-text-light/10 px-5 py-3">
          <h2 className="text-[10px] tracking-widest2 uppercase text-text-muted">Images</h2>
        </div>
        <div className="space-y-5 p-5">
          {product.colors.map((c) => (
            <div key={c.id}>
              <div className="mb-1.5 flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full border border-text-light/20"
                  style={{ backgroundColor: c.swatch }}
                />
                <span className={cn(label, "mb-0")}>{c.name} — one URL per line</span>
              </div>
              <textarea
                className="w-full border border-text-light/20 bg-transparent p-3 font-mono text-[11px] leading-relaxed focus:border-text-light focus:outline-none"
                rows={3}
                value={images[c.id] ?? ""}
                onChange={(e) => setImages({ ...images, [c.id]: e.target.value })}
              />
              <div className="mt-2 flex items-center gap-3">
                <button
                  className={saveBtn}
                  onClick={() => saveImages(c.id)}
                  disabled={imgState.saving === c.id}
                >
                  {imgState.saving === c.id ? "Saving…" : "Save"}
                </button>
                {imgState.ok === c.id && <span className="text-[11px] text-[#6f8f6a]">Saved</span>}
              </div>
            </div>
          ))}
          {imgState.err && <p className="text-[11px] text-[#9d5c4d]">{imgState.err}</p>}
        </div>
      </section>

      <section className="border border-[#9d5c4d]/30 bg-bg">
        <div className="border-b border-[#9d5c4d]/20 px-5 py-3">
          <h2 className="text-[10px] tracking-widest2 uppercase text-[#9d5c4d]">Danger Zone</h2>
        </div>
        <div className="flex items-center justify-between gap-4 p-5">
          <p className="text-[12px] text-text-muted">
            Delete this product. Past orders keep their own snapshot.
          </p>
          <button
            className="inline-flex h-9 items-center px-4 text-[10px] tracking-widest2 uppercase border border-[#9d5c4d]/50 text-[#9d5c4d] hover:bg-[#9d5c4d]/[0.06]"
            onClick={() => setDeleteOpen(true)}
          >
            Delete
          </button>
        </div>
      </section>

      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)} title="Delete Product">
        <p className="text-[13px] leading-relaxed text-text-muted">
          Delete <span className="text-text-light">{product.name}</span>? This cannot be undone.
        </p>
        <div className="mt-6 flex gap-3">
          <button
            className="inline-flex h-10 items-center px-5 text-[10px] tracking-widest2 uppercase border border-text-light/25"
            onClick={() => setDeleteOpen(false)}
            disabled={deleting}
          >
            Keep
          </button>
          <button
            className="inline-flex h-10 items-center px-5 text-[10px] tracking-widest2 uppercase bg-[#9d5c4d] text-white"
            onClick={doDelete}
            disabled={deleting}
          >
            {deleting ? "Deleting…" : "Delete Product"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
