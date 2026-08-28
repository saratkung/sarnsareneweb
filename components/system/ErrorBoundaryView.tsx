"use client";

import { useEffect } from "react";
import { SystemMessage, MessageLink } from "./Message";

export function ErrorBoundaryView({
  error,
  reset,
  home = "/",
  homeLabel = "Back to Home",
}: {
  error: Error & { digest?: string };
  reset: () => void;
  home?: string;
  homeLabel?: string;
}) {
  useEffect(() => {
    // In production this is where an error reporter (Sentry etc.) would hook in.
    console.error(error);
  }, [error]);

  return (
    <SystemMessage
      eyebrow="Something went wrong"
      title="This page didn't load"
      body="An unexpected error occurred. You can try again, or head back and pick up where you left off."
      actions={
        <>
          <button
            onClick={reset}
            className="inline-flex h-11 items-center justify-center border border-text-light bg-text-light px-7 text-[10.5px] tracking-[0.25em] uppercase text-bg transition-colors duration-300 hover:bg-transparent hover:text-text-light"
          >
            Try Again
          </button>
          <MessageLink href={home} variant="secondary">
            {homeLabel}
          </MessageLink>
        </>
      }
    />
  );
}
