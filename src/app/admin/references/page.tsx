"use client";

import { Header } from "@/components/layout/Header";
import { ShieldCheck, Plus, Upload, FileText } from "lucide-react";
import { useState } from "react";

export default function AdminReferencesPage() {
  const [references, setReferences] = useState([
    {
      id: "ref_1",
      title: "Chateau de Chantilly Heraldic Crest",
      source: "Licensed French Archival Collection",
      license: "Public Domain / CC0",
      assetType: "Wedding Crest",
      style: "European Estate",
      formality: "High Formal",
      status: "Verified & Active",
    },
    {
      id: "ref_2",
      title: "Vogue Paris 1920 Didone Typography Specimen",
      source: "Licensed Typography Archive",
      license: "Commercial Licensed",
      assetType: "Couple Wordmark",
      style: "Editorial Luxury",
      formality: "Editorial",
      status: "Verified & Active",
    },
  ]);

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
            <h1 className="font-serif font-bold text-3xl text-vow-dark">Design Reference Library</h1>
            <p className="text-xs text-vow-muted font-sans mt-1">
              Curate and record license verification for design reference imagery.
            </p>
          </div>

          <button className="px-5 py-2.5 bg-vow-dark hover:bg-black text-vow-paper rounded-full text-xs font-semibold uppercase tracking-wider transition-colors flex items-center space-x-2 shadow-sm">
            <Plus className="w-4 h-4 text-vow-champagne" />
            <span>Add Licensed Reference</span>
          </button>
        </div>

        <div className="bg-vow-paper border border-vow-border rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-vow-surface border-b border-vow-border font-mono text-[11px] text-vow-muted uppercase">
                <th className="p-4">Title &amp; Source</th>
                <th className="p-4">License Type</th>
                <th className="p-4">Asset Type</th>
                <th className="p-4">Wedding Style</th>
                <th className="p-4">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-vow-border">
              {references.map((r) => (
                <tr key={r.id} className="hover:bg-stone-50">
                  <td className="p-4">
                    <p className="font-serif font-bold text-sm text-vow-dark">{r.title}</p>
                    <p className="text-[10px] text-vow-muted font-sans">{r.source}</p>
                  </td>
                  <td className="p-4 font-mono text-[11px] text-vow-charcoal">{r.license}</td>
                  <td className="p-4">{r.assetType}</td>
                  <td className="p-4">{r.style}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-[10px] font-mono">
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
