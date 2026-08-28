"use client";

import { ErrorBoundaryView } from "@/components/system/ErrorBoundaryView";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="palette-admin bg-bg">
      <ErrorBoundaryView error={error} reset={reset} home="/admin" homeLabel="Dashboard" />
    </div>
  );
}
