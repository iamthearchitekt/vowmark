"use client";

import Link from "next/link";
import { SITE_CONFIG } from "@/config/site";
import { useEditorStore } from "@/lib/store/useEditorStore";
import { RotateCcw } from "lucide-react";

export function Header() {
  const resetFields = useEditorStore((state) => state.resetFields);

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

      <div className="flex items-center space-x-3">
        <button
          type="button"
          onClick={resetFields}
          className="text-[11px] font-sans font-medium text-slate-500 hover:text-slate-800 flex items-center space-x-1.5 px-2.5 py-1 rounded border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors shadow-2xs"
          title="Reset all form fields & artboard to initial state"
        >
          <RotateCcw className="w-3 h-3 text-slate-400" />
          <span>Reset Fields</span>
        </button>
      </div>
    </header>
  );
}
