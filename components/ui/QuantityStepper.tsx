"use client";

import { cn } from "@/lib/cn";

type Props = {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
  ariaLabel?: string;
};

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  size = "md",
  ariaLabel = "Quantity",
}: Props) {
  const dim = size === "sm" ? "h-8 w-8 text-[13px]" : "h-11 w-11 text-[15px]";
  const clamp = (n: number) => Math.max(min, Math.min(max, n));

  return (
    <div
      className="inline-flex items-center border border-text-light/20"
      role="group"
      aria-label={ariaLabel}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={value <= min}
        onClick={() => onChange(clamp(value - 1))}
        className={cn(
          dim,
          "flex items-center justify-center text-text-light transition-colors duration-200",
          "hover:bg-text-light/5 disabled:opacity-30 disabled:pointer-events-none",
        )}
      >
        &minus;
      </button>
      <span
        className={cn(
          size === "sm" ? "w-8 text-[12px]" : "w-10 text-[13px]",
          "text-center tabular-nums text-text-light",
        )}
        aria-live="polite"
      >
        {value}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={value >= max}
        onClick={() => onChange(clamp(value + 1))}
        className={cn(
          dim,
          "flex items-center justify-center text-text-light transition-colors duration-200",
          "hover:bg-text-light/5 disabled:opacity-30 disabled:pointer-events-none",
        )}
      >
        +
      </button>
    </div>
  );
}
