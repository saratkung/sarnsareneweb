"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { Product } from "@/lib/commerce/types";
import {
  findVariant,
  variantPrice,
  variantStockState,
} from "@/lib/commerce/types";
import { categories, collections } from "@/lib/commerce/catalog/data";
import { formatTHB } from "@/lib/commerce/format";
import { Accordion } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { StockBadge } from "@/components/ui/Badge";
import { ProductGallery } from "@/components/shop/ProductGallery";
import { SizeGuideModal } from "@/components/shop/SizeGuideModal";
import { useCart } from "@/components/cart/CartContext";
import { cn } from "@/lib/cn";

const EASE = [0.16, 1, 0.3, 1] as const;

export function ProductDetail({ product }: { product: Product }) {
  const { addItem } = useCart();

  const [colorId, setColorId] = useState(product.colors[0].id);
  const firstInStockSize = useMemo(() => {
    const withStock = product.sizes.find(
      (s) => (findVariant(product, product.colors[0].id, s.id)?.stock ?? 0) > 0,
    );
    return (withStock ?? product.sizes[0]).id;
  }, [product]);
  const [sizeId, setSizeId] = useState(firstInStockSize);
  const [qty, setQty] = useState(1);
  const [guideOpen, setGuideOpen] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const activeColor = product.colors.find((c) => c.id === colorId) ?? product.colors[0];
  const activeSize = product.sizes.find((s) => s.id === sizeId) ?? product.sizes[0];
  const variant = findVariant(product, colorId, sizeId);
  const stock = variant?.stock ?? 0;
  const price = variantPrice(product, variant);
  const canAdd = stock > 0 && product.status !== "ARCHIVED";

  const category = categories.find((c) => c.slug === product.categorySlug);
  const collection = collections.find((c) => c.slug === product.collectionSlug);

  function sizeStock(id: string) {
    return findVariant(product, colorId, id)?.stock ?? 0;
  }

  function handleColor(nextColor: string) {
    setColorId(nextColor);
    // if the current size is sold out in the new colour, move to one that isn't
    if ((findVariant(product, nextColor, sizeId)?.stock ?? 0) === 0) {
      const alt = product.sizes.find(
        (s) => (findVariant(product, nextColor, s.id)?.stock ?? 0) > 0,
      );
      if (alt) setSizeId(alt.id);
    }
    setQty(1);
  }

  function handleAdd() {
    if (!variant || !canAdd) return;
    addItem({
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      variantId: variant.id,
      colorId: activeColor.id,
      colorName: activeColor.name,
      sizeId: activeSize.id,
      sizeName: activeSize.name,
      image: activeColor.images[0],
      unitPrice: price,
      maxQuantity: variant.stock,
      quantity: qty,
    });
    setJustAdded(true);
    setQty(1);
    window.setTimeout(() => setJustAdded(false), 1800);
  }

  const singleSize = product.sizes.length === 1 && product.sizes[0].name === "One Size";

  return (
    <>
      <div className="max-w-content mx-auto grid gap-10 px-6 pb-28 md:grid-cols-[1.15fr_1fr] md:gap-16 md:px-10 md:pb-24 lg:gap-24">
        <div className="md:sticky md:top-28 md:self-start">
          <ProductGallery images={activeColor.images} alt={`${product.name} — ${activeColor.name}`} />
        </div>

        <div className="pt-2">
          <p className="text-[10px] tracking-widest2 uppercase text-text-muted">
            {collection?.name ?? category?.name}
          </p>
          <h1 className="mt-3 font-serif font-light text-[clamp(1.7rem,3.5vw,2.4rem)] leading-tight text-text-light">
            {product.name}
          </h1>
          <p className="mt-4 text-[16px] tabular-nums text-text-light">{formatTHB(price)}</p>

          <div className="mt-6 space-y-3">
            {product.story.map((p, i) => (
              <p key={i} className="text-[13.5px] leading-relaxed font-light text-text-muted">
                {p}
              </p>
            ))}
          </div>

          <div className="mt-8 h-px bg-text-light/12" />

          {/* colour */}
          <div className="mt-8">
            <div className="flex items-baseline justify-between">
              <span className="text-[10px] tracking-widest2 uppercase text-text-light">
                Colour
              </span>
              <span className="text-[11px] text-text-muted">{activeColor.name}</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              {product.colors.map((c) => (
                <button
                  key={c.id}
                  aria-label={c.name}
                  aria-pressed={c.id === colorId}
                  onClick={() => handleColor(c.id)}
                  className={cn(
                    "h-9 w-9 rounded-full border transition-all",
                    c.id === colorId
                      ? "border-text-light ring-1 ring-text-light ring-offset-2 ring-offset-bg"
                      : "border-text-light/25 hover:border-text-light/60",
                  )}
                  style={{ backgroundColor: c.swatch }}
                />
              ))}
            </div>
          </div>

          {/* size */}
          {!singleSize && (
            <div className="mt-8">
              <div className="flex items-baseline justify-between">
                <span className="text-[10px] tracking-widest2 uppercase text-text-light">Size</span>
                <button
                  onClick={() => setGuideOpen(true)}
                  className="text-[10px] tracking-widest2 uppercase text-text-muted underline underline-offset-4 hover:text-text-light"
                >
                  Size Guide
                </button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {product.sizes.map((s) => {
                  const soldOut = sizeStock(s.id) === 0;
                  const selected = s.id === sizeId;
                  return (
                    <button
                      key={s.id}
                      disabled={soldOut}
                      aria-pressed={selected}
                      onClick={() => {
                        setSizeId(s.id);
                        setQty(1);
                      }}
                      className={cn(
                        "min-w-[3.5rem] px-3 py-2 text-[12px] tracking-wide border transition-colors",
                        selected && "border-text-light bg-text-light text-bg",
                        !selected && !soldOut && "border-text-light/25 text-text-light hover:border-text-light",
                        soldOut &&
                          "border-text-light/15 text-text-light/30 line-through cursor-not-allowed",
                      )}
                      title={s.note}
                    >
                      {s.name}
                    </button>
                  );
                })}
              </div>
              {activeSize.note && (
                <p className="mt-2.5 text-[11px] text-text-muted">{activeSize.note}</p>
              )}
            </div>
          )}

          {/* quantity + add */}
          <div className="mt-8">
            <span className="text-[10px] tracking-widest2 uppercase text-text-light">Quantity</span>
            <div className="mt-4 flex items-center gap-4">
              <QuantityStepper
                value={qty}
                onChange={setQty}
                min={1}
                max={Math.max(1, stock)}
              />
              {canAdd ? (
                <StockBadge state={variantStockState(stock)} />
              ) : (
                <span className="text-[9px] tracking-widest2 uppercase text-text-muted">
                  Sold Out
                </span>
              )}
            </div>
          </div>

          <div className="mt-6 hidden md:block">
            <Button fullWidth size="lg" onClick={handleAdd} disabled={!canAdd}>
              <motion.span key={justAdded ? "added" : "add"} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
                {!canAdd ? "Sold Out" : justAdded ? "Added to Bag" : "Add to Bag"}
              </motion.span>
            </Button>
          </div>

          {/* accordion */}
          <Accordion
            className="mt-12"
            items={product.details.map((d) => ({
              title: d.title,
              content: d.body.map((para, i) => <p key={i}>{para}</p>),
            }))}
          />
        </div>
      </div>

      {/* sticky mobile add-to-bag */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-text-light/10 bg-bg/95 px-4 py-3 backdrop-blur-sm md:hidden">
        <div className="flex items-center gap-3">
          <div className="shrink-0">
            <p className="text-[9px] tracking-widest2 uppercase text-text-muted">
              {activeColor.name}
              {!singleSize && ` · ${activeSize.name}`}
            </p>
            <p className="text-[14px] tabular-nums text-text-light">{formatTHB(price)}</p>
          </div>
          <Button className="flex-1" onClick={handleAdd} disabled={!canAdd}>
            {!canAdd ? "Sold Out" : justAdded ? "Added" : "Add to Bag"}
          </Button>
        </div>
      </div>

      <SizeGuideModal
        open={guideOpen}
        onClose={() => setGuideOpen(false)}
        kind={product.categorySlug === "pouches" ? "pouch" : "tote"}
      />
    </>
  );
}
