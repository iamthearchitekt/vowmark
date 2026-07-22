"use client";

import Link from "next/link";
import { SITE_CONFIG } from "@/config/site";

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-vow-paper border-b border-vow-border px-6 py-3.5 flex items-center justify-between font-sans">
      <div className="flex items-center space-x-8">
        <Link href="/" className="flex items-center space-x-4 group">
          {/* Updated VOWMARK Logo Image */}
          <div className="h-11 flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/vowmark-logo.png"
              alt="VOWMARK Logo"
              className="h-10 w-auto min-w-[216px] max-w-[290px] object-contain group-hover:scale-105 transition-transform"
            />
          </div>
        </Link>

        <nav className="hidden md:flex items-center space-x-6 text-xs uppercase tracking-wider font-semibold text-vow-charcoal">
          <Link href="/" className="hover:text-vow-accent transition-colors text-vow-dark font-bold">
            Studio Workbench
          </Link>
          <Link href="/dashboard" className="hover:text-vow-accent transition-colors">
            Client Projects
          </Link>
          <Link href="/fonts" className="hover:text-vow-accent transition-colors">
            Fonts Library
          </Link>
        </nav>
      </div>
    </header>
  );
}
