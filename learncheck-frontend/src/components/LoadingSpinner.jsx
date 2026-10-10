import React from "react";

/**
 * LoadingSpinner — Reusable loading indicator component.
 * Extracted to avoid duplicating spinner markup across the app.
 */
export default function LoadingSpinner({ message = "Memuat Kuis..." }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-[var(--bg-primary)]">
      <div
        className="
          animate-spin rounded-full h-12 w-12
          border-4 border-[var(--text-primary)]/20
          border-t-[var(--blue-primary)]
        "
        role="status"
        aria-label="loading"
      ></div>
      <p className="mt-4 font-body text-[var(--text-primary)]">{message}</p>
    </div>
  );
}
