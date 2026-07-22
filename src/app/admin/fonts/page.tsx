"use client";

import { Header } from "@/components/layout/Header";
import { CURATED_FONTS, FontRecord } from "@/lib/typography/fonts-db";
import { ShieldCheck, Upload, CheckCircle2, X, Layers } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface UploadItem {
  fileName: string;
  familyName: string;
  classification: "serif" | "sans" | "script" | "decorative";
}

export default function AdminFontsPage() {
  const [fontsList, setFontsList] = useState<FontRecord[]>(CURATED_FONTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingUploads, setPendingUploads] = useState<UploadItem[]>([]);
  const [globalCommercialApproved, setGlobalCommercialApproved] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch registered persistent fonts on mount
  useEffect(() => {
    fetch("/api/fonts")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setFontsList(data);
        }
      })
      .catch((err) => console.warn("Failed to load fonts from API:", err));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const items: UploadItem[] = Array.from(files).map((file) => {
        const baseName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
        const formattedName = baseName.charAt(0).toUpperCase() + baseName.slice(1);
        return {
          fileName: file.name,
          familyName: formattedName,
          classification: "serif",
        };
      });

      setPendingUploads(items);
      setIsModalOpen(true);
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleItemChange = (index: number, key: keyof UploadItem, val: string) => {
    const updated = [...pendingUploads];
    updated[index] = { ...updated[index], [key]: val };
    setPendingUploads(updated);
  };

  const handleRemoveItem = (index: number) => {
    const updated = pendingUploads.filter((_, i) => i !== index);
    setPendingUploads(updated);
    if (updated.length === 0) setIsModalOpen(false);
  };

  const handleSaveAllFonts = async () => {
    if (pendingUploads.length === 0) return;

    const payload = pendingUploads.map((item) => ({
      familyName: item.familyName.trim(),
      classification: item.classification,
      commercialApproved: globalCommercialApproved,
      fontFileName: item.fileName,
    }));

    try {
      const res = await fetch("/api/fonts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Re-fetch all fonts to ensure complete sync
      const updatedRes = await fetch("/api/fonts");
      const updatedData = await updatedRes.json();
      if (Array.isArray(updatedData)) {
        setFontsList(updatedData);
      }
    } catch (err) {
      console.error("Failed to register bulk fonts:", err);
    }

    setIsModalOpen(false);
    setPendingUploads([]);
  };

  return (
    <div className="min-h-screen bg-vow-bg flex flex-col font-sans">
      <Header />

      {/* Hidden File Input with Multiple Selection Enabled */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".otf,.ttf,.woff,.woff2"
        multiple
        className="hidden"
      />

      <main className="flex-1 max-w-6xl w-full mx-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center space-x-2 text-vow-accent text-xs font-mono mb-1 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Management Suite</span>
            </div>
            <h1 className="font-serif font-bold text-3xl text-vow-dark">Font Curation &amp; Licensing Rights</h1>
            <p className="text-xs text-vow-muted font-sans mt-1">
              Select multiple licensed commercial font files (.otf, .ttf) to upload in batch.
            </p>
          </div>

          <button
            type="button"
            onClick={handleUploadClick}
            className="px-5 py-2.5 bg-vow-dark hover:bg-black text-vow-paper rounded-full text-xs font-semibold uppercase tracking-wider transition-colors flex items-center space-x-2 shadow-sm cursor-pointer"
          >
            <Upload className="w-4 h-4 text-vow-champagne" />
            <span>Upload Font Files (Bulk)</span>
          </button>
        </div>

        <div className="bg-vow-paper border border-vow-border rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-vow-surface border-b border-vow-border font-mono text-[11px] text-vow-muted uppercase">
                <th className="p-4">Font Family</th>
                <th className="p-4">Provider</th>
                <th className="p-4">Classification</th>
                <th className="p-4">Commercial Use</th>
                <th className="p-4">Export Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-vow-border">
              {fontsList.map((f) => (
                <tr key={f.id} className="hover:bg-stone-50">
                  <td className="p-4 font-serif font-bold text-sm text-vow-dark">{f.familyName}</td>
                  <td className="p-4 font-mono text-[11px] uppercase text-vow-muted">{f.provider}</td>
                  <td className="p-4 font-mono text-[11px] text-vow-muted">{f.classification}</td>
                  <td className="p-4 font-mono text-emerald-800">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      {f.licensing.commercialApproved ? "Approved (Commercial)" : "Personal Use"}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-[10px] font-mono">
                      SVG Path Export Allowed
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Bulk Font Batch Registration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans select-none">
          <div className="bg-vow-paper border border-vow-border rounded-xl p-6 max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-vow-muted hover:text-vow-dark"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-2 text-vow-accent text-xs font-mono mb-1 uppercase font-bold">
              <Layers className="w-4 h-4" />
              <span>Bulk Font Registration ({pendingUploads.length} Files Selected)</span>
            </div>
            <h3 className="font-serif font-bold text-xl text-vow-dark mb-1">Batch Register Typefaces</h3>
            <p className="text-xs text-vow-muted mb-4">Review and adjust details for all selected font files before registering into your studio library.</p>

            <div className="flex-1 overflow-y-auto pr-1 space-y-3 my-2">
              {pendingUploads.map((item, idx) => (
                <div key={idx} className="p-3 bg-white border border-vow-border rounded-lg flex items-center justify-between space-x-4">
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-vow-muted uppercase tracking-wider mb-0.5">
                        Font Family Name ({item.fileName})
                      </label>
                      <input
                        type="text"
                        value={item.familyName}
                        onChange={(e) => handleItemChange(idx, "familyName", e.target.value)}
                        className="w-full bg-slate-50 border border-vow-border rounded px-2.5 py-1.5 text-xs font-bold text-vow-dark focus:ring-1 focus:ring-vow-dark focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-vow-muted uppercase tracking-wider mb-0.5">
                        Classification
                      </label>
                      <select
                        value={item.classification}
                        onChange={(e) => handleItemChange(idx, "classification", e.target.value)}
                        className="w-full bg-slate-50 border border-vow-border rounded px-2.5 py-1.5 text-xs font-bold text-vow-dark focus:ring-1 focus:ring-vow-dark focus:outline-none"
                      >
                        <option value="serif">Serif (Didone / Roman Inscription)</option>
                        <option value="sans">Sans-Serif (Modern Architectural)</option>
                        <option value="script">Script (Calligraphic)</option>
                        <option value="decorative">Decorative (Luxury Monogram)</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                    title="Remove from batch"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-vow-border mt-3">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="globalCommApproved"
                  checked={globalCommercialApproved}
                  onChange={(e) => setGlobalCommercialApproved(e.target.checked)}
                  className="accent-vow-dark w-4 h-4"
                />
                <label htmlFor="globalCommApproved" className="text-xs text-vow-dark font-semibold cursor-pointer">
                  Approve All {pendingUploads.length} Fonts for Commercial Client Work
                </label>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-vow-border rounded-md text-xs font-bold uppercase tracking-wider text-vow-muted hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveAllFonts}
                  className="px-5 py-2 bg-vow-dark text-white rounded-md text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors"
                >
                  Register All ({pendingUploads.length} Fonts)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
