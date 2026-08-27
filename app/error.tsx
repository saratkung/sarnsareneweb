"use client";

import { ErrorBoundaryView } from "@/components/system/ErrorBoundaryView";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorBoundaryView error={error} reset={reset} home="/" homeLabel="Back to Home" />;
}
