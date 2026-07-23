"use client";

import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Plus, FolderOpen, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function DashboardPage() {
  const [projects] = useState<Array<{
    id: string;
    title: string;
    assetType: string;
    style: string;
    font: string;
    updatedAt: string;
    version: string;
  }>>([]);

  return (
    <div className="min-h-screen bg-vow-bg flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif font-bold text-3xl text-vow-dark">Client Projects</h1>
            <p className="text-xs text-vow-muted font-sans mt-1">
              Manage your active wedding identity assets, font previews, and vector exports.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/editor"
              className="w-10 h-10 bg-vow-dark hover:bg-black text-vow-paper rounded-full flex items-center justify-center transition-all shadow-sm group"
              title="Create New Project"
            >
              <Plus className="w-5 h-5 text-vow-champagne group-hover:scale-110 transition-transform" />
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
              Your client projects list is clean. Click below to start a new project.
            </p>
            <Link
              href="/editor"
              className="w-12 h-12 bg-vow-dark hover:bg-black text-vow-paper rounded-full mx-auto flex items-center justify-center transition-all shadow-md group"
              title="Create New Project"
            >
              <Plus className="w-6 h-6 text-vow-accent group-hover:scale-110 transition-transform" />
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
                  <p className="text-xs text-vow-muted font-mono">{p.font}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-vow-border flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-500">{p.version}</span>
                  <Link
                    href={`/editor/${p.id}`}
                    className="text-xs font-bold text-vow-dark hover:text-vow-accent flex items-center gap-1 uppercase tracking-wider transition-colors"
                  >
                    <span>Open</span>
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
