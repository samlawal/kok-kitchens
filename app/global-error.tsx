"use client";

// Catches errors thrown in the root layout itself. It replaces <html>/<body>,
// and globals.css may not have loaded, so styling is inline and self-contained.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fafaf9",
          color: "#1c1917",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          padding: "24px",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: "28rem" }}>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, margin: "0 0 12px" }}>
            Something went wrong
          </h1>
          <p style={{ color: "#78716c", lineHeight: 1.6, margin: "0 0 24px" }}>
            Sorry — the page failed to load. Please try again, or reach us on
            WhatsApp and we&apos;ll help.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={reset}
              style={{
                background: "#ea580c",
                color: "#fff",
                border: "none",
                borderRadius: "9999px",
                padding: "12px 24px",
                fontSize: "0.875rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Try again
            </button>
            <a
              href="https://wa.me/447447982712"
              style={{
                border: "1px solid #15803d",
                color: "#15803d",
                borderRadius: "9999px",
                padding: "12px 24px",
                fontSize: "0.875rem",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              WhatsApp us
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
