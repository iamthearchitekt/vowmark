"use client";

import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { CURATED_FONTS, FontRecord } from "@/lib/typography/fonts-db";
import { FontSpecimenCard } from "@/components/fonts/FontSpecimenCard";
import { FontDetailModal } from "@/components/fonts/FontDetailModal";
import { FontTagEditorModal } from "@/components/fonts/FontTagEditorModal";
import { useState, useEffect, useRef } from "react";
import { Upload, Layers, X, Type, Tag } from "lucide-react";

interface UploadItem {
  fileName: string;
  familyName: string;
  classification: "serif" | "sans" | "script" | "decorative";
}

const LOCAL_STORAGE_TAGS_KEY = "vowmark_font_tags_overrides_v1";

export default function FontsDiscoveryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [customPreviewText, setCustomPreviewText] = useState<string>("Claude & Alexa");
  const [selectedFontForModal, setSelectedFontForModal] = useState<FontRecord | null>(null);
  const [fontForTagEditing, setFontForTagEditing] = useState<FontRecord | null>(null);
  const [allFontsList, setAllFontsList] = useState<FontRecord[]>(CURATED_FONTS);

  // Bulk font upload modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingUploads, setPendingUploads] = useState<UploadItem[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load custom font tag overrides from localStorage & API
  useEffect(() => {
    fetch("/api/fonts")
      .then((res) => res.json())
      .then((data) => {
        let baseList: FontRecord[] = Array.isArray(data) && data.length > 0 ? data : CURATED_FONTS;

        // Apply local storage tag overrides if available
        try {
          const stored = localStorage.getItem(LOCAL_STORAGE_TAGS_KEY);
          if (stored) {
            const overrides = JSON.parse(stored);
            baseList = baseList.map((f) => {
              if (overrides[f.id]) {
                return {
                  ...f,
                  weddingTags: overrides[f.id].weddingTags || f.weddingTags,
                  subclassification: overrides[f.id].subclassification || f.subclassification,
                };
              }
              return f;
            });
          }
        } catch (err) {
          console.warn("Failed to load local tag overrides:", err);
        }

        setAllFontsList(baseList);
      })
      .catch((err) => console.warn("Failed to load dynamic fonts for discovery page:", err));
  }, []);

  // Preload Google Fonts for all registered fonts that have a googleFontUrl
  useEffect(() => {
    allFontsList
      .filter((f) => f.provider === "google" && f.googleFontUrl)
      .forEach((f) => {
        const linkId = `font-preload-${f.id}`;
        if (!document.getElementById(linkId)) {
          const link = document.createElement("link");
          link.id = linkId;
          link.rel = "stylesheet";
          link.href = f.googleFontUrl!;
          document.head.appendChild(link);
        }
      });
  }, [allFontsList]);

  // Remove font from library
  const handleRemoveFont = async (fontToRemove: FontRecord) => {
    if (!confirm(`Are you sure you want to remove ${fontToRemove.familyName} from your fonts library?`)) {
      return;
    }

    setAllFontsList((prev) => prev.filter((f) => f.id !== fontToRemove.id));

    try {
      await fetch(`/api/fonts?id=${fontToRemove.id}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.warn("Failed to delete font on server:", err);
    }
  };

  // Save tag edits
  const handleSaveFontTags = (fontId: string, updatedTags: string[], subclassification?: string) => {
    const updatedList = allFontsList.map((f) => {
      if (f.id === fontId) {
        return {
          ...f,
          weddingTags: updatedTags,
          subclassification: subclassification || f.subclassification,
        };
      }
      return f;
    });

    setAllFontsList(updatedList);

    // Save to localStorage
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_TAGS_KEY);
      const overrides = stored ? JSON.parse(stored) : {};
      overrides[fontId] = {
        weddingTags: updatedTags,
        subclassification,
      };
      localStorage.setItem(LOCAL_STORAGE_TAGS_KEY, JSON.stringify(overrides));
    } catch (err) {
      console.warn("Failed to persist tag overrides to localStorage:", err);
    }
  };

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

  // Collect all unique tags across the library for filter chips
  const allUniqueTags = Array.from(
    new Set([
      "all",
      "serif",
      "sans",
      "script",
      "decorative",
      ...allFontsList.flatMap((f) => f.weddingTags || []),
    ])
  );

  const filteredFonts = allFontsList.filter((f) => {
    if (selectedCategory === "all") return true;
    const catLower = selectedCategory.toLowerCase();
    const matchesClassification = f.classification.toLowerCase() === catLower;
    const matchesTag = f.weddingTags?.some((t) => t.toLowerCase() === catLower);
    const matchesSubclass = f.subclassification.toLowerCase().includes(catLower);
    return matchesClassification || matchesTag || matchesSubclass;
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
          <div>
            <h1 className="font-serif font-bold text-3xl text-vow-dark">Fonts Library</h1>
            <p className="text-xs text-vow-muted font-sans mt-1">
              Browse, test custom previews, and manage your studio fonts library.
            </p>
          </div>

          <button
            type="button"
            onClick={handleUploadClick}
            className="px-5 py-2.5 bg-vow-dark hover:bg-black text-vow-paper rounded-full text-xs font-semibold uppercase tracking-wider transition-colors flex items-center space-x-2 shadow-sm cursor-pointer"
          >
            <Upload className="w-4 h-4 text-vow-champagne" />
            <span>Upload Font Files</span>
          </button>
        </div>

        {/* Combined Control Toolbar: Category & Tag Filter Chips + Custom Preview Text Input */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-vow-paper p-4 rounded-xl border border-vow-border mb-8 shadow-2xs">
          {/* Category & Tag Filter Chips */}
          <div className="flex items-center space-x-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-thin">
            {allUniqueTags.slice(0, 10).map((tagOrCat) => (
              <button
                key={tagOrCat}
                type="button"
                onClick={() => setSelectedCategory(tagOrCat)}
                className={`px-3 py-1.5 rounded-full text-xs font-sans capitalize transition-colors whitespace-nowrap ${
                  selectedCategory.toLowerCase() === tagOrCat.toLowerCase()
                    ? "bg-vow-dark text-vow-paper font-bold shadow-2xs"
                    : "bg-vow-surface border border-vow-border text-vow-charcoal hover:bg-stone-200"
                }`}
              >
                {tagOrCat}
              </button>
            ))}
          </div>

          {/* Custom Live Preview Text Input */}
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
              onEditTags={(targetFont) => setFontForTagEditing(targetFont)}
              onRemoveFont={(targetFont) => handleRemoveFont(targetFont)}
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

      {/* Interactive Font Tag Editor Modal */}
      {fontForTagEditing && (
        <FontTagEditorModal
          font={fontForTagEditing}
          isOpen={!!fontForTagEditing}
          onClose={() => setFontForTagEditing(null)}
          onSaveTags={handleSaveFontTags}
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
              Review and adjust details for all selected font files before registering into your studio library.
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
                        className="w-full bg-slate-50 border border-vow-border rounded px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-vow-dark"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-vow-muted uppercase tracking-wider mb-0.5">
                        Classification
                      </label>
                      <select
                        value={item.classification}
                        onChange={(e) =>
                          handleItemChange(idx, "classification", e.target.value as any)
                        }
                        className="w-full bg-slate-50 border border-vow-border rounded px-2 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-vow-dark"
                      >
                        <option value="serif">Serif</option>
                        <option value="sans">Sans-Serif</option>
                        <option value="script">Script / Calligraphy</option>
                        <option value="decorative">Decorative</option>
                      </select>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(idx)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded"
                    title="Remove from upload batch"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-vow-border flex items-center justify-end space-x-2 mt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-white border border-vow-border text-vow-dark rounded-md text-xs font-bold uppercase tracking-wider hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveAllFonts}
                className="px-5 py-2 bg-vow-dark text-white rounded-md text-xs font-bold uppercase tracking-wider hover:bg-black"
              >
                Register All Fonts
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
