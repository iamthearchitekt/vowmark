"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-900 text-white font-sans flex flex-col items-center justify-center min-h-screen p-8 text-center">
        <h2 className="text-2xl font-bold mb-2">VOWMARK Studio Error</h2>
        <p className="text-sm text-slate-400 mb-6 max-w-md">
          {error?.message || "A global error occurred in the design studio."}
        </p>
        <button
          onClick={() => reset()}
          className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-full text-xs font-semibold uppercase tracking-wider transition-colors"
        >
          Reset Studio Session
        </button>
      </body>
    </html>
  );
}
