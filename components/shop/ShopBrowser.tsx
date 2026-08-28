"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import type { Category, Collection, Product, ProductColor } from "@/lib/commerce/types";
import { filterAndSort, type CatalogFilter, type SortKey } from "@/lib/commerce/catalog/data";
import { Drawer } from "@/components/ui/Drawer";
import { ProductCard } from "@/components/shop/ProductCard";
import { FilterPanel, countActiveFilters } from "@/components/shop/FilterPanel";
import { cn } from "@/lib/cn";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

type Props = {
  products: Product[];
  categories: Category[];
  collections: Collection[];
  colors: ProductColor[];
  sizes: { id: string; name: string }[];
};

const EASE = [0.16, 1, 0.3, 1] as const;

export function ShopBrowser({ products, categories, collections, colors, sizes }: Props) {
  const params = useSearchParams();
  const [filter, setFilter] = useState<CatalogFilter>({
    collection: params.get("collection") ?? undefined,
    category: params.get("category") ?? undefined,
  });
  const [sort, setSort] = useState<SortKey>("featured");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const results = useMemo(
    () => filterAndSort(products, filter, sort),
    [products, filter, sort],
  );
  const activeCount = countActiveFilters(filter);

  const panel = (
    <FilterPanel
      filter={filter}
      onChange={setFilter}
      categories={categories}
      collections={collections}
      colors={colors}
      sizes={sizes}
    />
  );

  return (
    <div className="max-w-content mx-auto px-6 md:px-10 pb-24">
      {/* controls */}
      <div className="sticky top-16 md:top-[72px] z-30 -mx-6 md:-mx-10 bg-bg/95 backdrop-blur-sm border-b border-text-light/10">
        <div className="flex items-center justify-between px-6 md:px-10 h-14">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="flex items-center gap-2 text-[10px] tracking-widest2 uppercase text-text-light lg:hidden"
          >
            Filter
            {activeCount > 0 && (
              <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-text-light px-1 text-[9px] text-bg">
                {activeCount}
              </span>
            )}
          </button>
          <span className="hidden text-[10px] tracking-widest2 uppercase text-text-muted lg:block">
            {results.length} {results.length === 1 ? "piece" : "pieces"}
          </span>

          <label className="flex items-center gap-3 text-[10px] tracking-widest2 uppercase text-text-muted">
            Sort
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="bg-transparent text-text-light text-[11px] tracking-wide focus:outline-none cursor-pointer"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="flex gap-12 pt-10">
        {/* desktop filter rail */}
        <aside className="hidden w-52 shrink-0 lg:block">
          <div className="sticky top-32">
            {activeCount > 0 && (
              <button
                onClick={() => setFilter({})}
                className="mb-6 text-[10px] tracking-widest2 uppercase text-text-muted underline underline-offset-4 hover:text-text-light"
              >
                Clear all ({activeCount})
              </button>
            )}
            {panel}
          </div>
        </aside>

        {/* grid */}
        <div className="flex-1">
          {results.length === 0 ? (
            <div className="py-24 text-center">
              <p className="font-serif text-xl text-text-light">Nothing matches those filters</p>
              <button
                onClick={() => setFilter({})}
                className="mt-4 text-[10px] tracking-widest2 uppercase text-text-muted underline underline-offset-4 hover:text-text-light"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {results.map((product, i) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                  >
                    <ProductCard product={product} priority={i < 3} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      {/* mobile filter drawer */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Filter"
        side="left"
        footer={
          <div className="flex gap-3">
            <button
              onClick={() => setFilter({})}
              className={cn(
                "flex-1 h-11 border border-text-light/25 text-[10px] tracking-widest2 uppercase text-text-muted",
                activeCount === 0 && "opacity-40 pointer-events-none",
              )}
            >
              Clear all
            </button>
            <button
              onClick={() => setDrawerOpen(false)}
              className="flex-1 h-11 bg-text-light text-bg text-[10px] tracking-widest2 uppercase"
            >
              Show {results.length}
            </button>
          </div>
        }
      >
        <div className="px-6 py-8">{panel}</div>
      </Drawer>
    </div>
  );
}
