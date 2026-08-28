"use client";

import type { Category, Collection, ProductColor } from "@/lib/commerce/types";
import type { CatalogFilter } from "@/lib/commerce/catalog/data";
import { formatTHB } from "@/lib/commerce/format";
import { cn } from "@/lib/cn";

export type PriceBracket = { label: string; min?: number; max?: number };

export const PRICE_BRACKETS: PriceBracket[] = [
  { label: "Under THB 3,000", max: 2999 },
  { label: "THB 3,000 – 7,000", min: 3000, max: 7000 },
  { label: "THB 7,000 & above", min: 7001 },
];

type Props = {
  filter: CatalogFilter;
  onChange: (next: CatalogFilter) => void;
  categories: Category[];
  collections: Collection[];
  colors: ProductColor[];
  sizes: { id: string; name: string }[];
};

const groupLabel = "text-[10px] tracking-widest2 uppercase text-text-light mb-4";
const rowBtn =
  "block w-full text-left text-[13px] py-1.5 text-text-muted hover:text-text-light transition-colors";

export function FilterPanel({
  filter,
  onChange,
  categories,
  collections,
  colors,
  sizes,
}: Props) {
  const set = (patch: Partial<CatalogFilter>) => onChange({ ...filter, ...patch });

  const activeBracket = PRICE_BRACKETS.findIndex(
    (b) => b.min === filter.minPrice && b.max === filter.maxPrice,
  );

  return (
    <div className="space-y-10">
      <section>
        <p className={groupLabel}>Category</p>
        <button
          className={cn(rowBtn, !filter.category && "text-text-light")}
          onClick={() => set({ category: undefined })}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c.slug}
            className={cn(rowBtn, filter.category === c.slug && "text-text-light")}
            onClick={() => set({ category: c.slug })}
          >
            {c.name}
          </button>
        ))}
      </section>

      <section>
        <p className={groupLabel}>Collection</p>
        <button
          className={cn(rowBtn, !filter.collection && "text-text-light")}
          onClick={() => set({ collection: undefined })}
        >
          All
        </button>
        {collections.map((c) => (
          <button
            key={c.slug}
            className={cn(rowBtn, filter.collection === c.slug && "text-text-light")}
            onClick={() => set({ collection: c.slug })}
          >
            {c.name}
          </button>
        ))}
      </section>

      <section>
        <p className={groupLabel}>Colour</p>
        <div className="flex flex-wrap gap-3">
          {colors.map((c) => {
            const active = filter.colorId === c.id;
            return (
              <button
                key={c.id}
                title={c.name}
                aria-pressed={active}
                onClick={() => set({ colorId: active ? undefined : c.id })}
                className={cn(
                  "h-7 w-7 rounded-full border transition-all",
                  active
                    ? "border-text-light ring-1 ring-text-light ring-offset-2 ring-offset-bg"
                    : "border-text-light/25 hover:border-text-light/60",
                )}
                style={{ backgroundColor: c.swatch }}
              />
            );
          })}
        </div>
      </section>

      <section>
        <p className={groupLabel}>Size</p>
        <div className="flex flex-wrap gap-2">
          {sizes.map((s) => {
            const active = filter.sizeId === s.id;
            return (
              <button
                key={s.id}
                aria-pressed={active}
                onClick={() => set({ sizeId: active ? undefined : s.id })}
                className={cn(
                  "px-3 py-1.5 text-[11px] tracking-wide border transition-colors",
                  active
                    ? "border-text-light bg-text-light text-bg"
                    : "border-text-light/25 text-text-muted hover:border-text-light",
                )}
              >
                {s.name}
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <p className={groupLabel}>Price</p>
        <button
          className={cn(rowBtn, activeBracket === -1 && "text-text-light")}
          onClick={() => set({ minPrice: undefined, maxPrice: undefined })}
        >
          Any price
        </button>
        {PRICE_BRACKETS.map((b, i) => (
          <button
            key={b.label}
            className={cn(rowBtn, activeBracket === i && "text-text-light")}
            onClick={() => set({ minPrice: b.min, maxPrice: b.max })}
          >
            {b.label}
          </button>
        ))}
      </section>
    </div>
  );
}

export function countActiveFilters(filter: CatalogFilter): number {
  let n = 0;
  if (filter.category) n++;
  if (filter.collection) n++;
  if (filter.colorId) n++;
  if (filter.sizeId) n++;
  if (filter.minPrice !== undefined || filter.maxPrice !== undefined) n++;
  return n;
}

// re-exported so callers don't need a separate format import for chips
export { formatTHB };
