"use client";

import Image from "next/image";
import Link from "next/link";
import type { CartLine } from "@/lib/commerce/types";
import { formatTHB } from "@/lib/commerce/format";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { useCart } from "@/components/cart/CartContext";
import { cn } from "@/lib/cn";

type Props = {
  line: CartLine;
  /** compact = drawer, roomy = /cart page */
  variant?: "compact" | "roomy";
  onNavigate?: () => void;
};

export function CartLineItem({ line, variant = "compact", onNavigate }: Props) {
  const { updateQuantity, removeItem } = useCart();
  const roomy = variant === "roomy";

  return (
    <div className="flex gap-4 py-5">
      <Link
        href={`/product/${line.productSlug}`}
        onClick={onNavigate}
        className={cn(
          "relative shrink-0 overflow-hidden bg-bg-secondary",
          roomy ? "h-32 w-24" : "h-24 w-[72px]",
        )}
      >
        <Image
          src={line.image}
          alt={line.productName}
          fill
          sizes="120px"
          className="object-cover"
        />
      </Link>

      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link
              href={`/product/${line.productSlug}`}
              onClick={onNavigate}
              className="font-serif text-[15px] text-text-light hover:text-gold transition-colors"
            >
              {line.productName}
            </Link>
            <p className="mt-1 text-[10px] tracking-widest2 uppercase text-text-muted">
              {line.colorName}
              {line.sizeName !== "One Size" && ` · ${line.sizeName}`}
            </p>
          </div>
          <p className="shrink-0 text-[13px] tabular-nums text-text-light">
            {formatTHB(line.unitPrice * line.quantity)}
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between pt-3">
          <QuantityStepper
            size="sm"
            value={line.quantity}
            min={1}
            max={line.maxQuantity}
            onChange={(q) => updateQuantity(line.key, q)}
            ariaLabel={`Quantity for ${line.productName}`}
          />
          <button
            type="button"
            onClick={() => removeItem(line.key)}
            className="text-[9px] tracking-widest2 uppercase text-text-muted underline-offset-4 hover:text-text-light hover:underline transition-colors"
          >
            Remove
          </button>
        </div>

        {line.quantity >= line.maxQuantity && (
          <p className="mt-2 text-[10px] tracking-wide text-[#b98a3e]">
            Only {line.maxQuantity} available
          </p>
        )}
      </div>
    </div>
  );
}
