"use client";

// Catches errors in the root layout itself. Must ship its own <html>/<body>.

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#2B2B2B",
          color: "#FEF5E1",
          fontFamily: "Georgia, serif",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        <div>
          <p style={{ letterSpacing: "0.3em", fontSize: 10, textTransform: "uppercase", opacity: 0.5 }}>
            SARNSARENE
          </p>
          <h1 style={{ fontWeight: 300, fontSize: "1.8rem", letterSpacing: "0.04em", margin: "1rem 0" }}>
            Something went wrong
          </h1>
          <button
            onClick={reset}
            style={{
              marginTop: "1rem",
              padding: "0.7rem 1.8rem",
              background: "#FEF5E1",
              color: "#2B2B2B",
              border: "none",
              letterSpacing: "0.25em",
              fontSize: 10,
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
