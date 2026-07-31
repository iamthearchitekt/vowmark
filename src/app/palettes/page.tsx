"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { CURATED_PALETTES, WeddingPaletteRecord } from "@/lib/color/palettes-db";
import { extractPaletteFromImage, ExtractedColor } from "@/lib/color/palette-extractor";
import { useEditorStore } from "@/lib/store/useEditorStore";
import { useState, useRef } from "react";
import { Upload, Copy, Check, Palette, Sparkles, ArrowRight, RefreshCw, MessageSquare } from "lucide-react";

export default function SmartPalettePage() {
  const router = useRouter();
  const setTextColor = useEditorStore((state) => state.setTextColor);
  const setAiPrompt = useEditorStore((state) => state.setAiPrompt);

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

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

  const handleSendColorToChat = (hex: string, label: string = "Color") => {
    setTextColor(hex);
    setAiPrompt(`Apply hex color ${hex} (${label}) to typography and design`);
    router.push("/");
  };

  const handleSendPaletteToChat = (palette: WeddingPaletteRecord) => {
    const swatchesText = palette.swatches.map((s) => `${s.name} (${s.hex})`).join(", ");
    setTextColor(palette.swatches[0].hex);
    setAiPrompt(`Apply ${palette.name} palette to design: ${swatchesText}`);
    router.push("/");
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

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 space-y-10">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-vow-border pb-6 gap-4">
          <div>
            <div className="flex items-center space-x-2 text-vow-accent text-xs font-semibold uppercase tracking-widest mb-1">
              <Palette className="w-4 h-4" />
              <span>Smart Palette</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-serif text-vow-dark font-bold tracking-tight">
              Color Palettes & Image Extractor
            </h1>
          </div>

          <Link
            href="/"
            className="inline-flex items-center space-x-2 bg-vow-dark text-vow-paper px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-black transition-all shadow-2xs group shrink-0"
          >
            <span>Studio Workbench</span>
            <ArrowRight className="w-3.5 h-3.5 text-vow-accent group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* ── 1. IMAGE PALETTE EXTRACTOR ───────────────────────── */}
        <section className="bg-vow-paper border border-vow-border rounded-2xl p-6 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-vow-border pb-3">
            <div className="flex items-center space-x-2.5">
              <Sparkles className="w-4 h-4 text-vow-accent" />
              <h2 className="text-base font-serif text-vow-dark font-bold">
                Image Palette Extractor
              </h2>
            </div>

            {previewImageUrl && (
              <button
                type="button"
                onClick={handleClearImage}
                className="text-xs text-stone-500 hover:text-stone-800 flex items-center space-x-1.5 px-3 py-1 rounded-lg border border-stone-200 hover:bg-stone-50 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Clear Image</span>
              </button>
            )}
          </div>

          {!previewImageUrl ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-stone-300 hover:border-vow-accent bg-stone-50/50 hover:bg-amber-50/20 rounded-xl p-8 text-center cursor-pointer transition-all space-y-3 group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="w-12 h-12 bg-white border border-stone-200 group-hover:border-vow-accent rounded-full flex items-center justify-center mx-auto shadow-2xs group-hover:scale-105 transition-transform">
                <Upload className="w-5 h-5 text-stone-400 group-hover:text-vow-accent transition-colors" />
              </div>
              <p className="text-xs font-bold text-vow-dark">
                Upload or drag & drop reference image
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Image Preview */}
              <div className="md:col-span-4 flex flex-col items-center">
                <div className="relative rounded-xl overflow-hidden border border-vow-border shadow-2xs max-h-48 w-full flex items-center justify-center bg-stone-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewImageUrl}
                    alt="Uploaded Reference"
                    className="max-h-48 w-auto object-contain"
                  />
                </div>
                <p className="text-[10px] text-stone-400 mt-1.5 truncate max-w-full font-mono">
                  {extractedFileName}
                </p>
              </div>

              {/* Extracted Swatches */}
              <div className="md:col-span-8 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    Extracted Hex Palette
                  </h3>
                  {isAnalyzing && (
                    <span className="text-xs text-vow-accent font-semibold animate-pulse">
                      Analyzing...
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
                      title={`${c.label}: ${c.hex} — Click to copy`}
                      onClick={() => handleCopyHex(c.hex)}
                    />
                  ))}
                </div>

                {/* Individual Swatch Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 pt-1">
                  {extractedColors.map((c, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-stone-200 rounded-xl p-2.5 flex flex-col justify-between space-y-2 hover:border-vow-accent transition-colors shadow-2xs group"
                    >
                      <div className="space-y-1.5">
                        <div
                          className="h-10 w-full rounded-lg border border-black/10 shadow-2xs"
                          style={{ backgroundColor: c.hex }}
                        />
                        <p className="text-xs font-mono font-bold text-stone-700 group-hover:text-vow-accent transition-colors">
                          {c.hex}
                        </p>
                      </div>

                      <div className="flex items-center space-x-1 pt-1 border-t border-stone-100">
                        <button
                          type="button"
                          onClick={() => handleCopyHex(c.hex)}
                          className="flex-1 text-[10px] font-semibold py-1 px-1 rounded border border-stone-200 hover:bg-stone-50 text-stone-600 flex items-center justify-center space-x-1 transition-colors cursor-pointer"
                          title="Copy Hex Code to Clipboard for Photoshop"
                        >
                          {copiedHex === c.hex ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3 text-stone-400" />
                          )}
                          <span>{copiedHex === c.hex ? "Copied" : "Copy"}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSendColorToChat(c.hex, c.label)}
                          className="text-[10px] font-bold py-1 px-2 rounded bg-vow-dark text-vow-paper hover:bg-black transition-colors cursor-pointer flex items-center space-x-0.5"
                          title="Send Hex info directly to Studio AI Chat prompt"
                        >
                          <MessageSquare className="w-3 h-3 text-vow-accent" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ── 2. CURATED WEDDING PALETTES ─────────────────────────── */}
        <section className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-vow-border pb-3">
            <h2 className="text-lg font-serif text-vow-dark font-bold">
              Wedding Color Palettes
            </h2>

            {/* Category Filter Chips */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: "all", label: "All" },
                { id: "traditional", label: "Traditional" },
                { id: "floral", label: "Floral" },
                { id: "coastal", label: "Coastal" },
                { id: "editorial", label: "Editorial" },
                { id: "autumn", label: "Autumn" },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`text-xs px-3 py-1 rounded-lg border transition-all cursor-pointer ${
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPalettes.map((palette) => (
              <div
                key={palette.id}
                className="bg-vow-paper border border-vow-border rounded-2xl p-5 shadow-2xs hover:border-vow-accent transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Card Header */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-serif font-bold text-vow-dark">
                      {palette.name}
                    </h3>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-vow-accent bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                      {palette.categoryLabel}
                    </span>
                  </div>

                  {/* Combined Palette Bar */}
                  <div className="h-7 w-full rounded-lg overflow-hidden flex border border-stone-200 shadow-2xs">
                    {palette.swatches.map((swatch, idx) => (
                      <div
                        key={idx}
                        className="h-full flex-1 transition-transform hover:scale-105 cursor-pointer relative"
                        style={{ backgroundColor: swatch.hex }}
                        onClick={() => handleCopyHex(swatch.hex)}
                        title={`${swatch.name} (${swatch.hex}) — Click to copy`}
                      />
                    ))}
                  </div>

                  {/* Individual Swatches */}
                  <div className="grid grid-cols-5 gap-2 pt-1">
                    {palette.swatches.map((swatch, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col items-center text-center space-y-1 group cursor-pointer"
                        onClick={() => handleCopyHex(swatch.hex)}
                      >
                        <div
                          className="w-full h-9 rounded-lg border border-black/10 shadow-2xs group-hover:scale-105 transition-transform flex items-center justify-center"
                          style={{ backgroundColor: swatch.hex }}
                        >
                          {copiedHex === swatch.hex && (
                            <span className="bg-black/80 text-white text-[9px] px-1 rounded font-sans font-bold">
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

                {/* Bottom Action */}
                <div className="flex items-center justify-between pt-3 border-t border-vow-border">
                  <div className="flex flex-wrap gap-1">
                    {palette.weddingTags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[10px] bg-stone-100 text-stone-500 px-2 py-0.5 rounded font-mono"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSendPaletteToChat(palette)}
                    className="text-xs font-bold bg-vow-dark text-vow-paper hover:bg-black px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-colors cursor-pointer shrink-0 shadow-2xs"
                    title="Pass full palette hex info to Studio AI Chat prompt"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-vow-accent" />
                    <span>Send Palette to Studio AI</span>
                    <ArrowRight className="w-3 h-3 text-stone-300" />
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
