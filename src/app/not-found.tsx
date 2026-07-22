"use client";

import Link from "next/link";
import { Header } from "@/components/layout/Header";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-vow-bg flex flex-col font-sans">
      <Header />
      <main className="flex-1 flex flex-col justify-center items-center p-8 text-center">
        <h1 className="font-serif font-bold text-4xl text-vow-dark">404 — Page Not Found</h1>
        <p className="text-xs text-vow-muted font-sans mt-2">
          The requested creator tool route does not exist.
        </p>
        <Link
          href="/"
          className="mt-6 px-6 py-2.5 bg-vow-dark text-vow-paper rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-black"
        >
          Return to Creator Studio
        </Link>
      </main>
    </div>
  );
}
