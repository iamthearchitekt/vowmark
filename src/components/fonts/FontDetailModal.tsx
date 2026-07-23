"use client";

import { FontRecord } from "@/lib/typography/fonts-db";
import { resolveFontConfig } from "@/lib/typography/font-resolver";
import { useEditorStore } from "@/lib/store/useEditorStore";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { X, ArrowRight, Type, Sliders, Sun, Moon } from "lucide-react";

interface FontDetailModalProps {
  font: FontRecord;
  initialPreviewText?: string;
  onClose: () => void;
}

export function FontDetailModal({
  font,
  initialPreviewText = "Claude & Alexa",
  onClose,
}: FontDetailModalProps) {
  const router = useRouter();
  const setTypographyOptions = useEditorStore((state) => state.setTypographyOptions);

  const [previewText, setPreviewText] = useState(initialPreviewText || "Claude & Alexa");
  const [fontSize, setFontSize] = useState<number>(64);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isItalic, setIsItalic] = useState<boolean>(false);
  const [letterSpacing, setLetterSpacing] = useState<number>(4);

  const fontConfig = resolveFontConfig(font.familyName, font.classification);

  // Dynamically load Google Web Font stylesheet if needed
  useEffect(() => {
    if (fontConfig.googleFontUrl) {
      const linkId = `modal-font-link-${fontConfig.webFontName.replace(/\s+/g, "-").toLowerCase()}`;
      if (!document.getElementById(linkId)) {
        const link = document.createElement("link");
        link.id = linkId;
        link.rel = "stylesheet";
        link.href = fontConfig.googleFontUrl;
        document.head.appendChild(link);
      }
    }
  }, [fontConfig.googleFontUrl, fontConfig.webFontName]);

  const handleUseInStudio = () => {
    setTypographyOptions({ fontFamily: font.familyName });
    router.push("/editor");
  };

  const SAMPLE_PRESETS = [
    "Claude & Alexa",
    "Mr. & Mrs. Sterling",
    "October 24, 2026",
    "#SterlingWedding2026",
    "The Monogram Collection",
  ];

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 font-sans select-none overflow-y-auto">
      <div className="bg-vow-paper border border-vow-border rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-vow-border bg-white flex items-center justify-between z-10">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-vow-dark text-vow-paper flex items-center justify-center font-bold text-sm">
              <Type className="w-5 h-5 text-vow-champagne" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-serif font-bold text-2xl text-vow-dark">{font.familyName}</h2>
                <span className="text-[10px] font-mono uppercase bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-vow-charcoal font-semibold">
                  {font.classification}
                </span>
              </div>
              <p className="text-xs text-vow-muted">
                {font.subclassification.replace(/_/g, " ")} • {font.provider} font engine
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-vow-muted hover:text-vow-dark rounded-full hover:bg-slate-100 transition-colors"
            title="Close Specimen Preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Custom Tester Controls Topbar */}
        <div className="bg-slate-50 border-b border-vow-border p-4 px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1 w-full relative">
            <label className="block text-[10px] font-bold text-vow-muted uppercase tracking-wider mb-1">
              Test Preview Text (Type to preview live)
            </label>
            <input
              type="text"
              value={previewText}
              onChange={(e) => setPreviewText(e.target.value)}
              placeholder="Type your custom text here..."
              className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2 text-sm font-semibold text-vow-dark focus:ring-2 focus:ring-vow-accent focus:outline-none shadow-2xs"
            />
          </div>

          <div className="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-end">
            {/* Font Size Slider */}
            <div className="flex items-center space-x-2">
              <Sliders className="w-3.5 h-3.5 text-vow-muted" />
              <span className="text-xs font-mono font-bold text-vow-muted w-10">{fontSize}px</span>
              <input
                type="range"
                min={24}
                max={120}
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-24 accent-vow-dark cursor-pointer"
              />
            </div>

            {/* Letter Spacing Slider */}
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-bold text-vow-muted">Gap: {letterSpacing}px</span>
              <input
                type="range"
                min={0}
                max={20}
                value={letterSpacing}
                onChange={(e) => setLetterSpacing(Number(e.target.value))}
                className="w-20 accent-vow-dark cursor-pointer"
              />
            </div>

            {/* Dark Mode & Style Toggles */}
            <div className="flex items-center space-x-1.5 bg-white p-1 rounded-lg border border-slate-200 shadow-2xs">
              <button
                type="button"
                onClick={() => setIsItalic(!isItalic)}
                className={`px-2.5 py-1 text-xs font-serif font-bold italic rounded transition-colors ${
                  isItalic ? "bg-vow-dark text-white" : "text-slate-600 hover:bg-slate-100"
                }`}
                title="Toggle Italic"
              >
                I
              </button>
              <div className="w-px h-4 bg-slate-200" />
              <button
                type="button"
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-1.5 rounded transition-colors ${
                  isDarkMode ? "bg-slate-900 text-amber-300" : "text-slate-600 hover:bg-slate-100"
                }`}
                title="Toggle Dark Background"
              >
                {isDarkMode ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Main Specimen Display Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Preset Quick Chips */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1">
            <span className="text-[11px] font-mono text-vow-muted font-bold whitespace-nowrap">Presets:</span>
            {SAMPLE_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setPreviewText(preset)}
                className="px-3 py-1 rounded-full text-xs font-sans bg-white border border-vow-border hover:bg-slate-100 text-vow-dark whitespace-nowrap transition-colors shadow-2xs"
              >
                {preset}
              </button>
            ))}
          </div>

          {/* Large Specimen Box */}
          <div
            className={`p-10 rounded-2xl border transition-all duration-300 flex items-center justify-center text-center min-h-[220px] shadow-inner overflow-hidden ${
              isDarkMode
                ? "bg-slate-950 border-slate-800 text-white"
                : "bg-white border-vow-border text-vow-dark"
            }`}
          >
            <p
              style={{
                fontFamily: fontConfig.cssFontFamily,
                fontSize: `${fontSize}px`,
                fontStyle: isItalic ? "italic" : "normal",
                letterSpacing: `${letterSpacing}px`,
                lineHeight: 1.25,
              }}
              className="break-words max-w-full"
            >
              {previewText || "Claude & Alexa"}
            </p>
          </div>

          {/* Character Specimen Grid */}
          <div className="bg-white p-6 border border-vow-border rounded-xl space-y-4">
            <h4 className="font-mono text-xs font-bold text-vow-muted uppercase tracking-wider">
              Character Specimen &amp; Glyph Map
            </h4>

            {/* Uppercase */}
            <div>
              <span className="block text-[10px] font-mono text-vow-muted uppercase font-bold mb-1">
                Uppercase (A–Z)
              </span>
              <p
                style={{ fontFamily: fontConfig.cssFontFamily }}
                className="text-lg tracking-widest text-vow-dark leading-relaxed break-words"
              >
                A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
              </p>
            </div>

            {/* Lowercase */}
            <div>
              <span className="block text-[10px] font-mono text-vow-muted uppercase font-bold mb-1">
                Lowercase (a–z)
              </span>
              <p
                style={{ fontFamily: fontConfig.cssFontFamily }}
                className="text-lg tracking-widest text-vow-dark leading-relaxed break-words"
              >
                a b c d e f g h i j k l m n o p q r s t u v w x y z
              </p>
            </div>

            {/* Numerals & Symbols */}
            <div>
              <span className="block text-[10px] font-mono text-vow-muted uppercase font-bold mb-1">
                Numerals &amp; Symbols
              </span>
              <p
                style={{ fontFamily: fontConfig.cssFontFamily }}
                className="text-lg tracking-widest text-vow-dark leading-relaxed break-words"
              >
                0 1 2 3 4 5 6 7 8 9 &amp; . , ! ? # @ — ♥
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-white border-t border-vow-border flex items-center justify-between">
          <p className="text-xs text-vow-muted italic hidden sm:block">
            {font.description || "High-fashion luxury wedding typography asset."}
          </p>

          <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-vow-border rounded-xl text-xs font-bold uppercase tracking-wider text-vow-muted hover:bg-slate-50 transition-colors"
            >
              Close
            </button>

            <button
              type="button"
              onClick={handleUseInStudio}
              className="px-6 py-2.5 bg-vow-dark hover:bg-black text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition-colors shadow-sm"
            >
              <span>Use Font in Studio</span>
              <ArrowRight className="w-4 h-4 text-vow-champagne" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
