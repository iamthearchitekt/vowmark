"use client";

import { useEditorStore } from "@/lib/store/useEditorStore";
import { CURATED_FONTS, FontRecord } from "@/lib/typography/fonts-db";
import { useState, useEffect } from "react";
import { Upload, Sliders, Type, FileText, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

export function LeftControlPanel() {
  const studioMode = useEditorStore((state) => state.studioMode);
  const setStudioMode = useEditorStore((state) => state.setStudioMode);

  // Dynamic font options list (fetches registered persistent fonts from /api/fonts)
  const [fontsList, setFontsList] = useState<FontRecord[]>(CURATED_FONTS);

  useEffect(() => {
    fetch("/api/fonts")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setFontsList(data);
        }
      })
      .catch((err) => console.warn("Failed to load dynamic fonts list:", err));
  }, []);

  // Subscribe to scalar primitive values
  const primaryText = useEditorStore((state) => state.typographyOptions.primaryText);
  const secondaryText = useEditorStore((state) => state.typographyOptions.secondaryText);
  const dateText = useEditorStore((state) => state.typographyOptions.dateText);
  const fontFamily = useEditorStore((state) => state.typographyOptions.fontFamily);
  const fontSize = useEditorStore((state) => state.typographyOptions.fontSize);
  const letterSpacing = useEditorStore((state) => state.typographyOptions.letterSpacing);
  const ampersandScale = useEditorStore((state) => state.typographyOptions.ampersandScale);
  const layout = useEditorStore((state) => state.typographyOptions.layout);

  const setBrief = useEditorStore((state) => state.setBrief);
  const setTypographyOptions = useEditorStore((state) => state.setTypographyOptions);

  const isGenerativeAi = studioMode === "generative_ai";
  const [manualCollapsed, setManualCollapsed] = useState(false);

  // In AI mode, panel is automatically collapsed to the left side
  const isCollapsed = isGenerativeAi || manualCollapsed;

  if (isCollapsed) {
    return (
      <div className="relative z-20 flex flex-col items-center bg-vow-paper border-r border-vow-border w-12 h-full py-4 space-y-4 text-xs font-sans transition-all duration-300 select-none">
        {/* Expand / Vector Mode Toggle Button */}
        <button
          type="button"
          onClick={() => {
            if (isGenerativeAi) {
              setStudioMode("deterministic_vector");
            }
            setManualCollapsed(false);
          }}
          title={isGenerativeAi ? "Switch to Vector Mode to open Left Panel" : "Expand Left Control Panel"}
          className="w-8 h-8 rounded-lg bg-vow-dark text-vow-paper flex items-center justify-center hover:bg-black transition-transform hover:scale-105 shadow-sm group"
        >
          <ChevronRight className="w-4 h-4 text-vow-accent group-hover:translate-x-0.5 transition-transform" />
        </button>

        <div className="flex-1 flex flex-col items-center justify-center space-y-6 text-vow-muted">
          <span className="[writing-mode:vertical-lr] rotate-180 font-bold uppercase tracking-widest text-[10px] text-vow-charcoal flex items-center gap-2">
            {isGenerativeAi ? (
              <>
                <Sparkles className="w-3 h-3 text-vow-accent rotate-90" /> Generative AI Mode
              </>
            ) : (
              "Vector Controls Collapsed"
            )}
          </span>
        </div>
      </div>
    );
  }

  return (
    <aside className="relative w-96 bg-vow-paper border-r border-vow-border flex flex-col h-full overflow-hidden text-xs font-sans select-none z-20 transition-all duration-300">
      {/* Consolidated Panel Header with Collapse Button */}
      <div className="p-4 border-b border-vow-border bg-vow-surface flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sliders className="w-4 h-4 text-vow-dark" />
          <h3 className="font-bold text-vow-dark uppercase tracking-wider text-xs">
            Studio Design Controls
          </h3>
        </div>

        <button
          type="button"
          onClick={() => setManualCollapsed(true)}
          title="Collapse Left Control Panel"
          className="p-1 rounded text-vow-muted hover:text-vow-dark hover:bg-slate-200 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Single Consolidated Scrollable Panel */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* SECTION 1: CONTENT & IDENTITY */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 pb-2 border-b border-vow-border text-vow-dark font-bold text-xs uppercase tracking-wider">
            <FileText className="w-3.5 h-3.5 text-vow-accent" />
            <span>Content &amp; Identity</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-sans font-semibold text-vow-charcoal uppercase tracking-wider mb-1">
                Partner One Name
              </label>
              <input
                type="text"
                value={primaryText || ""}
                onChange={(e) => {
                  setBrief({ primaryText: e.target.value });
                  setTypographyOptions({ primaryText: e.target.value });
                }}
                className="w-full bg-white border border-vow-border rounded-md px-3 py-2 text-xs focus:ring-1 focus:ring-vow-dark focus:outline-none font-medium"
                placeholder="Enter Partner 1 Name"
              />
            </div>

            <div>
              <label className="block text-[11px] font-sans font-semibold text-vow-charcoal uppercase tracking-wider mb-1">
                Partner Two Name
              </label>
              <input
                type="text"
                value={secondaryText || ""}
                onChange={(e) => {
                  setBrief({ secondaryText: e.target.value });
                  setTypographyOptions({ secondaryText: e.target.value });
                }}
                className="w-full bg-white border border-vow-border rounded-md px-3 py-2 text-xs focus:ring-1 focus:ring-vow-dark focus:outline-none font-medium"
                placeholder="Enter Partner 2 Name"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-sans font-semibold text-vow-charcoal uppercase tracking-wider mb-1">
              Wedding Date / Location
            </label>
            <input
              type="text"
              value={dateText || ""}
              onChange={(e) => {
                setBrief({ date: e.target.value });
                setTypographyOptions({ dateText: e.target.value });
              }}
              className="w-full bg-white border border-vow-border rounded-md px-3 py-2 text-xs focus:ring-1 focus:ring-vow-dark focus:outline-none font-medium"
              placeholder="e.g. OCTOBER 24, 2026"
            />
          </div>

          <div>
            <label className="block text-[11px] font-sans font-semibold text-vow-charcoal uppercase tracking-wider mb-1">
              Layout Structure
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "stacked", label: "Stacked Names" },
                { id: "horizontal", label: "Horizontal Line" },
                { id: "interlocking", label: "Interlocking" },
                { id: "circular", label: "Circular Monogram" },
              ].map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => {
                    setBrief({ layout: l.id as any });
                    setTypographyOptions({ layout: l.id as any });
                  }}
                  className={`py-2 px-3 rounded border text-left font-sans text-xs transition-colors font-semibold ${
                    layout === l.id
                      ? "bg-vow-dark text-vow-paper border-vow-dark shadow-2xs"
                      : "bg-white border-vow-border text-vow-charcoal hover:bg-slate-50"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 2: TYPOGRAPHY & STYLING */}
        <div className="space-y-4 pt-4 border-t border-vow-border">
          <div className="flex items-center space-x-2 pb-2 border-b border-vow-border text-vow-dark font-bold text-xs uppercase tracking-wider">
            <Type className="w-3.5 h-3.5 text-vow-accent" />
            <span>Typography &amp; Styling</span>
          </div>

          <div>
            <label className="block text-[11px] font-sans font-semibold text-vow-charcoal uppercase tracking-wider mb-1.5">
              Typeface Selection ({fontsList.length} Available)
            </label>
            <select
              value={fontFamily}
              onChange={(e) => setTypographyOptions({ fontFamily: e.target.value })}
              className="w-full bg-white border border-vow-border rounded-md px-3 py-2 text-xs font-sans font-bold focus:ring-1 focus:ring-vow-dark focus:outline-none"
            >
              {fontsList.map((f) => (
                <option key={f.id} value={f.familyName}>
                  {f.familyName} ({f.classification}) {f.provider === "custom" ? "• Custom" : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-sans font-semibold text-vow-charcoal uppercase tracking-wider mb-1">
              Font Size: {fontSize}px
            </label>
            <input
              type="range"
              min="32"
              max="120"
              value={fontSize}
              onChange={(e) => setTypographyOptions({ fontSize: Number(e.target.value) })}
              className="w-full accent-vow-dark"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] font-sans font-semibold text-vow-charcoal uppercase tracking-wider">
                Letter Spacing (Tracking): {letterSpacing}px
              </label>
              {letterSpacing === -1 && (
                <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">
                  Connected Default (-1px)
                </span>
              )}
            </div>
            <input
              type="range"
              min="-6"
              max="24"
              value={letterSpacing}
              onChange={(e) => setTypographyOptions({ letterSpacing: Number(e.target.value) })}
              className="w-full accent-vow-dark"
            />
            <p className="text-[10px] text-vow-muted mt-0.5">
              Set to -1px for perfect cursive &amp; script letter connection.
            </p>
          </div>

          <div>
            <label className="block text-[11px] font-sans font-semibold text-vow-charcoal uppercase tracking-wider mb-1">
              Ampersand Scale: {Math.round((ampersandScale || 0.6) * 100)}%
            </label>
            <input
              type="range"
              min="30"
              max="100"
              value={(ampersandScale || 0.6) * 100}
              onChange={(e) => setTypographyOptions({ ampersandScale: Number(e.target.value) / 100 })}
              className="w-full accent-vow-dark"
            />
          </div>
        </div>

        {/* SECTION 3: REFERENCE ASSETS */}
        <div className="space-y-4 pt-4 border-t border-vow-border">
          <div className="border-2 border-dashed border-vow-border rounded-lg p-6 text-center bg-white hover:bg-slate-50 transition-colors cursor-pointer">
            <Upload className="w-6 h-6 text-vow-muted mx-auto mb-2" />
            <p className="font-sans font-medium text-xs text-vow-dark">Drop reference images here</p>
            <p className="text-[10px] text-vow-muted mt-0.5">Classify as Layout, Typography, or Ornament</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
