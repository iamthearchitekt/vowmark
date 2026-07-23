"use client";

import Link from "next/link";
import { SITE_CONFIG } from "@/config/site";
import { useEditorStore } from "@/lib/store/useEditorStore";
import { RotateCcw, Camera } from "lucide-react";

export function Header() {
  const resetFields = useEditorStore((state) => state.resetFields);
  const photoboothMode = useEditorStore((state) => state.photoboothMode);
  const setPhotoboothMode = useEditorStore((state) => state.setPhotoboothMode);

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
        {/* Universal Toggle Photo Mock Switch */}
        <button
          type="button"
          onClick={() => setPhotoboothMode(!photoboothMode)}
          className={`text-[11px] font-sans font-bold flex items-center space-x-1.5 px-3 py-1 rounded border transition-all shadow-2xs ${
            photoboothMode
              ? "bg-vow-dark text-white border-vow-dark ring-1 ring-vow-accent"
              : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50"
          }`}
          title="Toggle Universal Photo Mock Frame Overlay"
        >
          <Camera className={`w-3.5 h-3.5 ${photoboothMode ? "text-vow-accent" : "text-stone-400"}`} />
          <span>Photo Mock: {photoboothMode ? "ON" : "OFF"}</span>
        </button>

        <button
          type="button"
          onClick={resetFields}
          className="text-[11px] font-sans font-medium text-stone-500 hover:text-stone-800 flex items-center space-x-1.5 px-2.5 py-1 rounded border border-stone-200 hover:border-stone-300 hover:bg-stone-50 transition-colors shadow-2xs"
          title="Reset all form fields & artboard to initial state"
        >
          <RotateCcw className="w-3 h-3 text-stone-400" />
          <span>Reset Fields</span>
        </button>
      </div>
    </header>
  );
}
