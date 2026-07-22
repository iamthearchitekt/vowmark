"use client";

import { Header } from "@/components/layout/Header";
import { SEEDED_PROMPT_TEMPLATES } from "@/lib/design/prompt-templates";
import { ShieldCheck, Plus, Terminal } from "lucide-react";

export default function AdminPromptsPage() {
  return (
    <div className="min-h-screen bg-vow-bg flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center space-x-2 text-vow-accent text-xs font-mono mb-1 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Management Suite</span>
            </div>
            <h1 className="font-serif font-bold text-3xl text-vow-dark">Prompt Engineering &amp; Negative Constraints</h1>
            <p className="text-xs text-vow-muted font-sans mt-1">
              Configure system prompt templates, negative keyword filters, and output schemas.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {SEEDED_PROMPT_TEMPLATES.slice(0, 4).map((tmpl) => (
            <div key={tmpl.id} className="p-6 bg-vow-paper border border-vow-border rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-serif font-bold text-base text-vow-dark">{tmpl.name}</h3>
                <span className="text-[10px] font-mono bg-vow-surface px-2.5 py-0.5 rounded border border-vow-border text-vow-muted uppercase">
                  {tmpl.assetType}
                </span>
              </div>
              <p className="font-mono text-xs text-stone-700 bg-stone-50 p-3 rounded border border-vow-border mb-3">
                {tmpl.basePrompt}
              </p>
              <div className="text-[11px] font-mono text-stone-500">
                <strong>Negative Constraints:</strong> {tmpl.negativePrompt.join(", ")}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
