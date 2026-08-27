import { cn } from "@/lib/cn";
import type { StockState } from "@/lib/commerce/types";

const STOCK_LABEL: Record<StockState, string> = {
  IN_STOCK: "In Stock",
  LOW_STOCK: "Low Stock",
  SOLD_OUT: "Sold Out",
};

const STOCK_DOT: Record<StockState, string> = {
  IN_STOCK: "bg-[#6f8f6a]",
  LOW_STOCK: "bg-[#b98a3e]",
  SOLD_OUT: "bg-text-light/30",
};

export function StockBadge({
  state,
  className,
}: {
  state: StockState;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-[9px] tracking-widest2 uppercase text-text-muted",
        className,
      )}
    >
      <span className={cn("h-1 w-1 rounded-full", STOCK_DOT[state])} />
      {STOCK_LABEL[state]}
    </span>
  );
}

export function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 text-[9px] tracking-widest2 uppercase",
        "border border-text-light/20 text-text-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}
