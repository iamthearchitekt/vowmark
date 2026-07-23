"use client";

import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { CURATED_FONTS, FontRecord } from "@/lib/typography/fonts-db";
import { FontSpecimenCard } from "@/components/fonts/FontSpecimenCard";
import { FontDetailModal } from "@/components/fonts/FontDetailModal";
import { useState, useEffect, useRef } from "react";
import { Upload, Layers, X, Type } from "lucide-react";

interface UploadItem {
  fileName: string;
  familyName: string;
  classification: "serif" | "sans" | "script" | "decorative";
}

export default function FontsDiscoveryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [customPreviewText, setCustomPreviewText] = useState<string>("Claude & Alexa");
  const [selectedFontForModal, setSelectedFontForModal] = useState<FontRecord | null>(null);
  const [allFontsList, setAllFontsList] = useState<FontRecord[]>(CURATED_FONTS);

  // Bulk font upload modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingUploads, setPendingUploads] = useState<UploadItem[]>([]);
  const [globalCommercialApproved, setGlobalCommercialApproved] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/fonts")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setAllFontsList(data);
        }
      })
      .catch((err) => console.warn("Failed to load dynamic fonts for discovery page:", err));
  }, []);

  // Preload Google Fonts for all registered fonts
  useEffect(() => {
    const googleFontNames = allFontsList
      .filter((f) => f.provider === "google")
      .map((f) => f.familyName);

    if (googleFontNames.length > 0) {
      const linkId = "global-fonts-discovery-preload";
      if (!document.getElementById(linkId)) {
        const link = document.createElement("link");
        link.id = linkId;
        link.rel = "stylesheet";
        link.href =
          "https://fonts.googleapis.com/css2?family=Alex+Brush&family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900&family=Cinzel:wght@400..900&family=Cormorant+Garamond:ital,wght@0,300..700;1,300..700&family=Inter:wght@300..800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap";
        document.head.appendChild(link);
      }
    }
  }, [allFontsList]);

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
      await fetch("/api/fonts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Re-fetch all fonts to update specimen cards immediately
      const updatedRes = await fetch("/api/fonts");
      const updatedData = await updatedRes.json();
      if (Array.isArray(updatedData)) {
        setAllFontsList(updatedData);
      }
    } catch (err) {
      console.error("Failed to register bulk fonts:", err);
    }

    setIsModalOpen(false);
    setPendingUploads([]);
  };

  const filteredFonts = allFontsList.filter((f) => {
    return (
      selectedCategory === "all" ||
      f.classification.toLowerCase() === selectedCategory.toLowerCase()
    );
  });

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
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-serif font-bold text-3xl text-vow-dark">Fonts Library</h1>

          <button
            type="button"
            onClick={handleUploadClick}
            className="px-5 py-2.5 bg-vow-dark hover:bg-black text-vow-paper rounded-full text-xs font-semibold uppercase tracking-wider transition-colors flex items-center space-x-2 shadow-sm cursor-pointer"
          >
            <Upload className="w-4 h-4 text-vow-champagne" />
            <span>Upload Font Files</span>
          </button>
        </div>

        {/* Combined Control Toolbar: Category Filter & Dafont-Style Live Custom Preview Text Input */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-vow-paper p-4 rounded-xl border border-vow-border mb-8 shadow-2xs">
          {/* Category Filter Buttons */}
          <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {["all", "serif", "sans", "script", "decorative"].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-sans capitalize transition-colors whitespace-nowrap ${
                  selectedCategory === cat
                    ? "bg-vow-dark text-vow-paper font-medium"
                    : "bg-vow-surface border border-vow-border text-vow-charcoal hover:bg-stone-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Dafont-Style Custom Live Preview Text Input */}
          <div className="relative w-full sm:w-80">
            <Type className="w-4 h-4 text-vow-accent absolute left-3 top-2.5" />
            <input
              type="text"
              value={customPreviewText}
              onChange={(e) => setCustomPreviewText(e.target.value)}
              placeholder="Type custom preview text (e.g. Claude & Alexa)..."
              className="w-full bg-white border border-vow-border rounded-full pl-9 pr-4 py-2 text-xs font-semibold text-vow-dark focus:ring-1 focus:ring-vow-dark focus:outline-none shadow-2xs"
            />
          </div>
        </div>

        {/* Font Specimen Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredFonts.map((font) => (
            <FontSpecimenCard
              key={font.id}
              font={font}
              primaryText={customPreviewText || "Claude & Alexa"}
              secondaryText=""
              onSelect={() => setSelectedFontForModal(font)}
            />
          ))}
        </div>
      </main>

      {/* Font Specimen Detail Modal */}
      {selectedFontForModal && (
        <FontDetailModal
          font={selectedFontForModal}
          initialPreviewText={customPreviewText || "Claude & Alexa"}
          onClose={() => setSelectedFontForModal(null)}
        />
      )}

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
            <h3 className="font-serif font-bold text-xl text-vow-dark mb-1">
              Batch Register Typefaces
            </h3>
            <p className="text-xs text-vow-muted mb-4">
              Review and adjust details for all selected font files before registering into your
              studio library.
            </p>

            <div className="flex-1 overflow-y-auto pr-1 space-y-3 my-2">
              {pendingUploads.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-white border border-vow-border rounded-lg flex items-center justify-between space-x-4"
                >
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
                <label
                  htmlFor="globalCommApproved"
                  className="text-xs text-vow-dark font-semibold cursor-pointer"
                >
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
