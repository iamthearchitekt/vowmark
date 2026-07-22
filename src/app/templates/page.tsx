"use client";

import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { SEEDED_PROMPT_TEMPLATES } from "@/lib/design/prompt-templates";
import { Sparkles, ArrowRight } from "lucide-react";

export default function TemplatesPage() {
  return (
    <div className="min-h-screen bg-vow-bg flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto p-8">
        <div className="mb-8">
          <h1 className="font-serif font-bold text-3xl text-vow-dark">Seeded Template Library</h1>
          <p className="text-xs text-vow-muted font-sans mt-1">
            Curated wedding design starting points combining vector typography and botanical artwork.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SEEDED_PROMPT_TEMPLATES.map((tmpl) => (
            <div key={tmpl.id} className="bg-vow-paper border border-vow-border rounded-xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono uppercase bg-vow-surface px-2.5 py-0.5 rounded border border-vow-border text-vow-muted">
                    {tmpl.assetType.replace(/_/g, " ")}
                  </span>
                  <span className="text-[10px] font-sans text-vow-accent font-semibold">{tmpl.weddingStyle.replace(/_/g, " ")}</span>
                </div>

                <h3 className="font-serif font-bold text-lg text-vow-dark mb-2">{tmpl.name}</h3>
                <p className="text-xs text-vow-muted font-sans leading-relaxed line-clamp-3 mb-4">
                  {tmpl.basePrompt}
                </p>
              </div>

              <Link
                href="/editor/proj_erick_emily"
                className="w-full py-2.5 bg-vow-dark hover:bg-black text-vow-paper rounded-md text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center space-x-2"
              >
                <span>Use Template</span>
                <ArrowRight className="w-3.5 h-3.5 text-vow-champagne" />
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
