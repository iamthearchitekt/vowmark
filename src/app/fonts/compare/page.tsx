"use client";

import { Header } from "@/components/layout/Header";
import { CURATED_FONTS } from "@/lib/typography/fonts-db";
import { useState } from "react";

export default function FontComparisonPage() {
  const [primaryText, setPrimaryText] = useState("Erick");
  const [secondaryText, setSecondaryText] = useState("Emily");

  return (
    <div className="min-h-screen bg-vow-bg flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto p-8">
        <div className="mb-8">
          <h1 className="font-serif font-bold text-3xl text-vow-dark">Side-by-Side Font Comparison</h1>
          <p className="text-xs text-vow-muted font-sans mt-1">
            Compare exact couple names and monogram initials across licensed serif and script typefaces.
          </p>
        </div>

        {/* Dynamic Name Inputs */}
        <div className="grid grid-cols-2 gap-4 bg-vow-paper p-6 rounded-xl border border-vow-border mb-8">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Partner One</label>
            <input
              type="text"
              value={primaryText}
              onChange={(e) => setPrimaryText(e.target.value)}
              className="w-full bg-white border border-vow-border rounded-md px-3 py-2 text-xs font-serif"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Partner Two</label>
            <input
              type="text"
              value={secondaryText}
              onChange={(e) => setSecondaryText(e.target.value)}
              className="w-full bg-white border border-vow-border rounded-md px-3 py-2 text-xs font-serif"
            />
          </div>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CURATED_FONTS.slice(0, 4).map((font) => (
            <div key={font.id} className="bg-vow-paper border border-vow-border rounded-xl p-8 shadow-sm">
              <div className="flex items-center justify-between border-b border-vow-border pb-4 mb-6">
                <div>
                  <h3 className="font-serif font-bold text-xl text-vow-dark">{font.familyName}</h3>
                  <span className="text-[10px] font-mono text-vow-muted uppercase">{font.classification}</span>
                </div>
                <span className="text-xs font-bold text-vow-accent bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                  92% Match Score
                </span>
              </div>

              <div className="text-center py-8 bg-white rounded-lg border border-stone-200">
                <p className="text-4xl text-vow-dark" style={{ fontFamily: font.familyName }}>
                  {primaryText} &amp; {secondaryText}
                </p>
                <p className="text-xs text-vow-muted mt-3 tracking-widest uppercase">OCTOBER 24, 2026</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
