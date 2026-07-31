"use client";

import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { CURATED_PALETTES, WeddingPaletteRecord, SwatchColor } from "@/lib/color/palettes-db";
import { extractPaletteFromImage, ExtractedColor } from "@/lib/color/palette-extractor";
import { useEditorStore } from "@/lib/store/useEditorStore";
import { useState, useRef } from "react";
import { Upload, Copy, Check, Palette, Sparkles, Image as ImageIcon, ArrowRight, RefreshCw } from "lucide-react";

export default function SmartPalettePage() {
  const setTextColor = useEditorStore((state) => state.setTextColor);

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [appliedHex, setAppliedHex] = useState<string | null>(null);

  // Image analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [extractedColors, setExtractedColors] = useState<ExtractedColor[]>([]);
  const [extractedFileName, setExtractedFileName] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const handleApplyToStudio = (hex: string) => {
    setTextColor(hex);
    setAppliedHex(hex);
    setTimeout(() => setAppliedHex(null), 2500);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    setExtractedFileName(file.name);

    const objectUrl = URL.createObjectURL(file);
    setPreviewImageUrl(objectUrl);

    try {
      const colors = await extractPaletteFromImage(file, 5);
      setExtractedColors(colors);
    } catch (err) {
      console.warn("Failed to extract color palette from image:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClearImage = () => {
    setPreviewImageUrl(null);
    setExtractedColors([]);
    setExtractedFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const filteredPalettes =
    selectedCategory === "all"
      ? CURATED_PALETTES
      : CURATED_PALETTES.filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-vow-bg text-vow-dark flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10 space-y-12">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-vow-border pb-8 gap-6">
          <div>
            <div className="flex items-center space-x-2 text-vow-accent text-xs font-semibold uppercase tracking-widest mb-2">
              <Palette className="w-4 h-4" />
              <span>Smart Palette Studio</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif text-vow-dark tracking-tight">
              Curated Wedding Color Palettes & Image Extractor
            </h1>
            <p className="text-stone-500 text-sm mt-2 max-w-2xl">
              Explore curated traditional and botanical wedding palettes, or upload any reference photo or moodboard to instantly extract dominant hex colors for your stationery identity.
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex items-center space-x-2 bg-vow-dark text-vow-paper px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-black transition-all shadow-sm self-start md:self-auto shrink-0 group"
          >
            <span>Open Studio Workbench</span>
            <ArrowRight className="w-4 h-4 text-vow-accent group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* ── 1. UPLOAD REFERENCE IMAGE & EXTRACTOR ───────────────────────── */}
        <section className="bg-vow-paper border border-vow-border rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-vow-border pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-amber-50 text-vow-accent rounded-xl border border-amber-100">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-serif text-vow-dark font-semibold">
                  Analyze Reference Image Palette
                </h2>
                <p className="text-xs text-stone-500">
                  Upload an invitation photo, floral moodboard, or venue picture to automatically extract its color palette with hex codes.
                </p>
              </div>
            </div>

            {previewImageUrl && (
              <button
                type="button"
                onClick={handleClearImage}
                className="text-xs text-stone-500 hover:text-stone-800 flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Clear Image</span>
              </button>
            )}
          </div>

          {!previewImageUrl ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-stone-300 hover:border-vow-accent bg-stone-50/50 hover:bg-amber-50/20 rounded-xl p-10 text-center cursor-pointer transition-all space-y-4 group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="w-14 h-14 bg-white border border-stone-200 group-hover:border-vow-accent rounded-full flex items-center justify-center mx-auto shadow-2xs group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6 text-stone-400 group-hover:text-vow-accent transition-colors" />
              </div>
              <div>
                <p className="text-sm font-semibold text-vow-dark">
                  Click to upload or drag & drop reference image
                </p>
                <p className="text-xs text-stone-400 mt-1">
                  Supports JPG, PNG, WEBP — extracts dominant tones & hex codes instantly
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* Image Preview */}
              <div className="md:col-span-4 flex flex-col items-center">
                <div className="relative rounded-xl overflow-hidden border border-vow-border shadow-sm max-h-56 w-full flex items-center justify-center bg-stone-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewImageUrl}
                    alt="Uploaded Reference"
                    className="max-h-56 w-auto object-contain"
                  />
                </div>
                <p className="text-[11px] text-stone-400 mt-2 truncate max-w-full">
                  {extractedFileName}
                </p>
              </div>

              {/* Extracted Swatches */}
              <div className="md:col-span-8 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                    Extracted Palette ({extractedColors.length} Tones)
                  </h3>
                  {isAnalyzing && (
                    <span className="text-xs text-vow-accent font-medium animate-pulse">
                      Analyzing pixels...
                    </span>
                  )}
                </div>

                {/* Combined Color Bar */}
                <div className="h-6 w-full rounded-lg overflow-hidden flex shadow-2xs border border-stone-200">
                  {extractedColors.map((c, idx) => (
                    <div
                      key={idx}
                      className="h-full flex-1 transition-all hover:opacity-90 cursor-pointer"
                      style={{ backgroundColor: c.hex }}
                      title={`${c.label}: ${c.hex}`}
                      onClick={() => handleCopyHex(c.hex)}
                    />
                  ))}
                </div>

                {/* Individual Swatch Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-2">
                  {extractedColors.map((c, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-stone-200 rounded-xl p-3 flex flex-col justify-between space-y-3 hover:border-vow-accent transition-colors shadow-2xs group"
                    >
                      <div className="space-y-2">
                        <div
                          className="h-12 w-full rounded-lg border border-black/10 shadow-2xs"
                          style={{ backgroundColor: c.hex }}
                        />
                        <div>
                          <p className="text-[11px] font-semibold text-vow-dark truncate">
                            {c.label}
                          </p>
                          <p className="text-xs font-mono text-stone-500 group-hover:text-vow-accent transition-colors">
                            {c.hex}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 pt-1 border-t border-stone-100">
                        <button
                          type="button"
                          onClick={() => handleCopyHex(c.hex)}
                          className="flex-1 text-[10px] font-semibold py-1 px-1.5 rounded border border-stone-200 hover:bg-stone-50 text-stone-600 flex items-center justify-center space-x-1 transition-colors"
                          title="Copy Hex Code"
                        >
                          {copiedHex === c.hex ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3 text-stone-400" />
                          )}
                          <span>{copiedHex === c.hex ? "Copied!" : "Copy"}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleApplyToStudio(c.hex)}
                          className="text-[10px] font-bold py-1 px-2 rounded bg-vow-dark text-vow-paper hover:bg-black transition-colors"
                          title="Apply this color to Studio Workbench"
                        >
                          {appliedHex === c.hex ? "✓" : "Use"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ── 2. CURATED WEDDING PALETTES LIBRARY ─────────────────────────── */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-vow-border pb-4">
            <h2 className="text-xl font-serif text-vow-dark font-semibold">
              Curated Wedding Identity Palettes
            </h2>

            {/* Category Filter Chips */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: "all", label: "All Palettes" },
                { id: "traditional", label: "Traditional & Black Tie" },
                { id: "floral", label: "Floral & Botanical" },
                { id: "editorial", label: "Editorial & Modern" },
                { id: "coastal", label: "Coastal & Destination" },
                { id: "autumn", label: "Autumn & Terracotta" },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? "bg-vow-dark text-vow-paper border-vow-dark font-semibold shadow-2xs"
                      : "bg-vow-paper text-stone-600 border-stone-200 hover:border-stone-400"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Palette Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredPalettes.map((palette) => (
              <div
                key={palette.id}
                className="bg-vow-paper border border-vow-border rounded-2xl p-6 shadow-sm hover:border-vow-accent transition-all flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  {/* Card Top Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-vow-accent bg-amber-50 px-2.5 py-1 rounded-md border border-amber-100">
                        {palette.categoryLabel}
                      </span>
                      <h3 className="text-xl font-serif font-bold text-vow-dark mt-2">
                        {palette.name}
                      </h3>
                    </div>
                  </div>

                  <p className="text-xs text-stone-500 leading-relaxed">
                    {palette.description}
                  </p>

                  {/* Combined Palette Bar Preview */}
                  <div className="h-7 w-full rounded-xl overflow-hidden flex border border-stone-200 shadow-2xs">
                    {palette.swatches.map((swatch, idx) => (
                      <div
                        key={idx}
                        className="h-full flex-1 transition-transform hover:scale-105 cursor-pointer relative group"
                        style={{ backgroundColor: swatch.hex }}
                        onClick={() => handleCopyHex(swatch.hex)}
                        title={`${swatch.name} (${swatch.hex}) — Click to copy`}
                      />
                    ))}
                  </div>

                  {/* Individual Swatch Details Grid */}
                  <div className="grid grid-cols-5 gap-2 pt-2">
                    {palette.swatches.map((swatch, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col items-center text-center space-y-1.5 group cursor-pointer"
                        onClick={() => handleCopyHex(swatch.hex)}
                      >
                        <div
                          className="w-full h-10 rounded-lg border border-black/10 shadow-2xs group-hover:scale-105 transition-transform relative flex items-center justify-center"
                          style={{ backgroundColor: swatch.hex }}
                        >
                          {copiedHex === swatch.hex && (
                            <span className="bg-black/80 text-white text-[9px] px-1 py-0.5 rounded font-sans font-bold">
                              ✓
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] font-semibold text-vow-dark truncate w-full">
                          {swatch.name}
                        </span>
                        <span className="text-[10px] font-mono text-stone-400 group-hover:text-vow-accent transition-colors">
                          {swatch.hex}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Quick Deploy Action */}
                <div className="flex items-center justify-between pt-4 border-t border-vow-border">
                  <div className="flex flex-wrap gap-1">
                    {palette.weddingTags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[10px] bg-stone-100 text-stone-500 px-2 py-0.5 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleApplyToStudio(palette.swatches[0].hex)}
                    className="text-xs font-semibold text-vow-dark hover:text-vow-accent flex items-center space-x-1 transition-colors shrink-0"
                  >
                    <span>Use Primary ({palette.swatches[0].hex})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
