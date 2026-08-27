"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/commerce/types";
import { productStockState } from "@/lib/commerce/types";
import { formatTHB } from "@/lib/commerce/format";
import { StockBadge } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";

export function ProductCard({ product, priority }: { product: Product; priority?: boolean }) {
  const [hovered, setHovered] = useState(false);
  const primary = product.colors[0]?.images[0];
  const secondary = product.colors[0]?.images[1] ?? product.colors[1]?.images[0] ?? primary;
  const stock = productStockState(product);
  const soldOut = stock === "SOLD_OUT";

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-bg-secondary">
        <Image
          src={primary}
          alt={product.name}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 33vw, 50vw"
          className={cn(
            "object-cover transition-opacity duration-700 ease-out",
            hovered ? "opacity-0" : "opacity-100",
          )}
        />
        <Image
          src={secondary}
          alt=""
          fill
          aria-hidden
          sizes="(min-width: 1024px) 33vw, 50vw"
          className={cn(
            "object-cover transition-transform duration-[1200ms] ease-out",
            hovered ? "scale-105 opacity-100" : "scale-100 opacity-0",
          )}
        />
        {soldOut && (
          <span className="absolute left-4 top-4 bg-bg/90 px-2.5 py-1 text-[9px] tracking-widest2 uppercase text-text-muted">
            Sold Out
          </span>
        )}
      </div>

      <div className="mt-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-serif text-[16px] leading-snug text-text-light">{product.name}</h3>
          <span className="shrink-0 text-[13px] tabular-nums text-text-light">
            {formatTHB(product.price)}
          </span>
        </div>
        <p className="mt-1.5 text-[12px] leading-relaxed font-light text-text-muted line-clamp-2">
          {product.shortDescription}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {product.colors.map((c) => (
              <span
                key={c.id}
                title={c.name}
                className="h-3 w-3 rounded-full border border-text-light/20"
                style={{ backgroundColor: c.swatch }}
              />
            ))}
          </div>
          {!soldOut && <StockBadge state={stock} />}
        </div>
      </div>
    </Link>
  );
}
