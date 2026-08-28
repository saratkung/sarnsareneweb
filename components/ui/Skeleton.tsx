import { cn } from "@/lib/cn";

/** A single shimmering placeholder block. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "block animate-pulse bg-text-light/8",
        className,
      )}
    />
  );
}

/** Product-card-shaped placeholder, matched to ProductCard's proportions. */
export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[4/5] bg-text-light/8" />
      <div className="mt-5 space-y-2">
        <div className="h-3 w-2/3 bg-text-light/8" />
        <div className="h-2.5 w-full bg-text-light/6" />
        <div className="h-3 w-1/4 bg-text-light/8 mt-3" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
