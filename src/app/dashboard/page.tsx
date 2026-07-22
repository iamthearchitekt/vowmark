"use client";

import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Plus, FolderOpen, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function DashboardPage() {
  // Empty projects list by default (no fake example projects)
  const [projects, setProjects] = useState<Array<{
    id: string;
    title: string;
    assetType: string;
    style: string;
    font: string;
    updatedAt: string;
    version: string;
  }>>([]);

  const handleCreateSampleProject = () => {
    setProjects([
      {
        id: "proj_claude_alexa",
        title: "Claude & Alexa Wedding Identity",
        assetType: "Couple Logo",
        style: "Editorial Luxury",
        font: "Cormorant Garamond",
        updatedAt: "Just now",
        version: "v1 (Initial Mark)",
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-vow-bg flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif font-bold text-3xl text-vow-dark">Design Studio Projects</h1>
            <p className="text-xs text-vow-muted font-sans mt-1">
              Manage your active wedding identity assets, font previews, and vector exports.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {projects.length === 0 && (
              <button
                type="button"
                onClick={handleCreateSampleProject}
                className="px-4 py-2 bg-white border border-vow-border text-vow-dark hover:bg-slate-50 rounded-full text-xs font-bold uppercase tracking-wider transition-colors shadow-2xs"
              >
                + Add Claude &amp; Alexa Project
              </button>
            )}

            <Link
              href="/"
              className="px-5 py-2.5 bg-vow-dark hover:bg-black text-vow-paper rounded-full text-xs font-semibold uppercase tracking-wider transition-colors flex items-center space-x-2 shadow-sm"
            >
              <Plus className="w-4 h-4 text-vow-champagne" />
              <span>New Wedding Project</span>
            </Link>
          </div>
        </div>

        {/* Empty State when no projects */}
        {projects.length === 0 ? (
          <div className="bg-vow-paper border-2 border-dashed border-vow-border rounded-xl p-16 text-center max-w-lg mx-auto my-12">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-vow-muted mx-auto mb-4 flex items-center justify-center">
              <FolderOpen className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-vow-dark mb-1">No Client Projects Yet</h3>
            <p className="text-xs text-vow-muted mb-6">
              Your client projects list is clean. Start a new project or create one for <strong>Claude &amp; Alexa</strong>.
            </p>
            <Link
              href="/"
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-vow-dark text-white rounded-md text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors"
            >
              <Plus className="w-4 h-4 text-vow-accent" />
              <span>Start Blank Studio Project</span>
            </Link>
          </div>
        ) : (
          /* Project Grid */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map((p) => (
              <div
                key={p.id}
                className="bg-vow-paper border border-vow-border rounded-xl p-6 shadow-sm hover:shadow-md hover:border-stone-400 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono uppercase bg-vow-surface px-2.5 py-0.5 rounded border border-vow-border text-vow-muted">
                      {p.assetType}
                    </span>
                    <span className="text-[10px] text-vow-muted font-mono">{p.updatedAt}</span>
                  </div>

                  <h3 className="font-serif font-bold text-lg text-vow-dark mb-1">{p.title}</h3>
                  <p className="text-xs text-vow-muted font-sans">
                    Style: <strong className="text-vow-dark">{p.style}</strong> • Font:{" "}
                    <strong className="text-vow-dark">{p.font}</strong>
                  </p>
                </div>

                <div className="my-6 p-6 border border-stone-200/60 rounded-lg bg-white text-center shadow-inner relative overflow-hidden">
                  <p className="font-serif text-2xl text-vow-dark tracking-wide">
                    Claude &amp; Alexa
                  </p>
                  <p className="text-[9px] text-vow-muted uppercase tracking-widest mt-1">10.24.2026</p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-vow-border">
                  <span className="text-[10px] font-mono text-vow-muted">{p.version}</span>
                  <Link
                    href="/"
                    className="text-xs font-sans font-bold text-vow-dark hover:text-vow-accent uppercase tracking-wider flex items-center space-x-1"
                  >
                    <span>Open Studio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
