"use client";

import { ErrorBoundaryView } from "@/components/system/ErrorBoundaryView";

export default function ShopError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="palette-shop bg-bg">
      <ErrorBoundaryView error={error} reset={reset} home="/shop" homeLabel="Back to Shop" />
    </div>
  );
}
