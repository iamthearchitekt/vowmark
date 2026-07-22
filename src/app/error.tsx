"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("VOWMARK Error boundary caught:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center bg-white rounded-xl border border-slate-200 font-sans">
      <h3 className="font-bold text-lg text-slate-900">Studio Render Notice</h3>
      <p className="text-xs text-slate-500 mt-1 max-w-sm">
        {error?.message || "An unexpected error occurred while rendering the artboard."}
      </p>
      <button
        onClick={() => reset()}
        type="button"
        className="mt-4 px-5 py-2 bg-slate-900 text-white rounded-md text-xs font-semibold uppercase tracking-wider hover:bg-black transition-colors"
      >
        Reload Studio
      </button>
    </div>
  );
}
