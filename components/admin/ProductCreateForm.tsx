"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ProductStatus } from "@/lib/commerce/types";
import { categories, collections } from "@/lib/commerce/catalog/data";

const input =
  "w-full h-10 bg-transparent border-b border-text-light/20 text-[13px] focus:border-text-light focus:outline-none";
const label = "block text-[10px] tracking-widest2 uppercase text-text-muted mb-1.5";

export function ProductCreateForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    price: "",
    shortDescription: "",
    categorySlug: categories[0].slug,
    collectionSlug: collections[0].slug,
    status: "DRAFT" as ProductStatus,
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, price: Number(form.price) || 0 }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Could not create product.");
        setBusy(false);
        return;
      }
      router.push(`/admin/products/${data.product.id}`);
    } catch {
      setError("Network error.");
      setBusy(false);
    }
  }

  return (
    <div className="max-w-xl space-y-4 border border-text-light/10 bg-bg p-6">
      <div>
        <span className={label}>Name</span>
        <input
          className={input}
          autoFocus
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>
      <div>
        <span className={label}>Short description</span>
        <input
          className={input}
          value={form.shortDescription}
          onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <span className={label}>Price (THB)</span>
          <input
            className={input}
            inputMode="numeric"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
        </div>
        <div>
          <span className={label}>Status</span>
          <select
            className={input}
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as ProductStatus })}
          >
            {(["DRAFT", "ACTIVE"] as ProductStatus[]).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <span className={label}>Category</span>
          <select
            className={input}
            value={form.categorySlug}
            onChange={(e) => setForm({ ...form, categorySlug: e.target.value })}
          >
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <span className={label}>Collection</span>
          <select
            className={input}
            value={form.collectionSlug}
            onChange={(e) => setForm({ ...form, collectionSlug: e.target.value })}
          >
            {collections.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="text-[11px] leading-relaxed text-text-muted">
        Created with one Onyx Black / One Size variant at 0 stock. Add colours, sizes, images
        and inventory on the next screen.
      </p>

      {error && <p className="text-[11px] text-[#9d5c4d]">{error}</p>}

      <button
        className="inline-flex h-10 items-center px-6 text-[10px] tracking-widest2 uppercase bg-text-light text-bg disabled:opacity-40"
        onClick={submit}
        disabled={busy || !form.name.trim() || !form.price.trim()}
      >
        {busy ? "Creating…" : "Create Product"}
      </button>
    </div>
  );
}
