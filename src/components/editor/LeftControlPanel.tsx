"use client";

import { useEditorStore } from "@/lib/store/useEditorStore";
import { resolveFontConfig } from "@/lib/typography/font-resolver";
import { Layout, Type, Upload, Sliders, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

export function LeftControlPanel() {
  const [mounted, setMounted] = useState(false);
  const [fontsList, setFontsList] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    fetch("/api/fonts")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setFontsList(data);
        }
      })
      .catch((err) => console.warn("Failed to load fonts for left panel:", err));
  }, []);

  const studioMode = useEditorStore((state) => state.studioMode);
  const setStudioMode = useEditorStore((state) => state.setStudioMode);

  // Subscribe to scalar primitive values
  const primaryText = useEditorStore((state) => state.typographyOptions.primaryText);
  const secondaryText = useEditorStore((state) => state.typographyOptions.secondaryText);
  const dateText = useEditorStore((state) => state.typographyOptions.dateText);
  const dateFontFamily = useEditorStore((state) => state.typographyOptions.dateFontFamily);
  const hashtagText = useEditorStore((state) => state.typographyOptions.hashtagText);
  const hashtagFontFamily = useEditorStore((state) => state.typographyOptions.hashtagFontFamily);
  const fontFamily = useEditorStore((state) => state.typographyOptions.fontFamily);
  const fontSize = useEditorStore((state) => state.typographyOptions.fontSize);
  const primaryFontSize = useEditorStore(
    (state) => state.typographyOptions.primaryFontSize || state.typographyOptions.fontSize || 150
  );
  const secondaryFontSize = useEditorStore(
    (state) => state.typographyOptions.secondaryFontSize || primaryFontSize
  );
  const dateFontSize = useEditorStore((state) => state.typographyOptions.dateFontSize || 42);
  const hashtagFontSize = useEditorStore((state) => state.typographyOptions.hashtagFontSize || 36);
  const letterSpacing = useEditorStore((state) => state.typographyOptions.letterSpacing);
  const nameGap = useEditorStore((state) => state.typographyOptions.nameGap);
  const ampersandScale = useEditorStore((state) => state.typographyOptions.ampersandScale);
  const ampersandText = useEditorStore((state) => state.typographyOptions.ampersandText);
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
          className="p-2 bg-vow-dark text-vow-paper rounded-lg hover:bg-black transition-all shadow-sm group"
          title="Open Vector Typography Controls"
        >
          <ChevronRight className="w-4 h-4 text-vow-accent group-hover:scale-110 transition-transform" />
        </button>
      </div>
    );
  }

  if (!mounted) {
    return (
      <aside className="w-[400px] bg-vow-paper border-r border-vow-border h-full p-6 text-xs font-sans select-none z-20">
        <div className="text-slate-400">Loading Control Panel...</div>
      </aside>
    );
  }

  return (
    <aside className="w-[400px] bg-vow-paper border-r border-vow-border h-full flex flex-col select-none z-20 overflow-hidden font-sans">
      {/* Panel Header */}
      <div className="p-4 border-b border-vow-border flex items-center justify-between bg-white">
        <div className="flex items-center space-x-2">
          <Sliders className="w-4 h-4 text-vow-accent" />
          <h3 className="font-bold text-xs text-vow-dark uppercase tracking-wider">Vector Creator Studio</h3>
        </div>
        <button
          type="button"
          onClick={() => setManualCollapsed(true)}
          className="p-1 text-vow-muted hover:text-vow-dark rounded hover:bg-slate-100 transition-colors"
          title="Collapse Panel"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* SECTION 1: CONTENT & IDENTITY */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 pb-2 border-b border-vow-border text-vow-dark font-bold text-xs uppercase tracking-wider">
            <Layout className="w-3.5 h-3.5 text-vow-accent" />
            <span>Content &amp; Identity</span>
          </div>

          {/* Input 1 & 2 Text Fields + Single Shared Font Size Slider */}
          <div className="p-3 bg-white border border-vow-border rounded-xl space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-sans font-semibold text-vow-charcoal uppercase tracking-wider mb-1">
                  Input 1
                </label>
                <input
                  type="text"
                  value={primaryText || ""}
                  onChange={(e) => {
                    setBrief({ primaryText: e.target.value });
                    setTypographyOptions({ primaryText: e.target.value });
                  }}
                  className="w-full bg-slate-50 border border-vow-border rounded-md px-3 py-1.5 text-xs focus:ring-1 focus:ring-vow-dark focus:outline-none font-medium"
                  placeholder="Enter Input 1"
                />
              </div>

              <div>
                <label className="block text-[11px] font-sans font-semibold text-vow-charcoal uppercase tracking-wider mb-1">
                  Input 2
                </label>
                <input
                  type="text"
                  value={secondaryText || ""}
                  onChange={(e) => {
                    setBrief({ secondaryText: e.target.value });
                    setTypographyOptions({ secondaryText: e.target.value });
                  }}
                  className="w-full bg-slate-50 border border-vow-border rounded-md px-3 py-1.5 text-xs focus:ring-1 focus:ring-vow-dark focus:outline-none font-medium"
                  placeholder="Enter Input 2"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-sans font-semibold text-vow-charcoal uppercase tracking-wider">
                  Inputs Font Size
                </label>
                <div className="flex items-center space-x-1">
                  <input
                    type="number"
                    min="12"
                    max="400"
                    value={primaryFontSize}
                    onChange={(e) => {
                      const val = Math.max(12, Math.min(400, Number(e.target.value) || 12));
                      setTypographyOptions({ primaryFontSize: val, secondaryFontSize: val, fontSize: val });
                    }}
                    className="w-14 bg-slate-50 border border-vow-border rounded px-1 py-0.5 text-right font-mono text-[11px] font-bold focus:ring-1 focus:ring-vow-dark focus:outline-none"
                  />
                  <span className="text-[10px] text-vow-muted font-bold">px</span>
                </div>
              </div>
              <input
                type="range"
                min="12"
                max="300"
                value={primaryFontSize}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setTypographyOptions({ primaryFontSize: val, secondaryFontSize: val, fontSize: val });
                }}
                className="w-full accent-vow-dark cursor-pointer mb-2"
              />

              <div>
                <label className="block text-[11px] font-sans font-semibold text-vow-charcoal uppercase tracking-wider mb-1">
                  Inputs Typeface Selection ({fontsList.length} Available)
                </label>
                <select
                  value={fontFamily}
                  onChange={(e) => setTypographyOptions({ fontFamily: e.target.value })}
                  className="w-full bg-slate-50 border border-vow-border rounded-md px-3 py-1.5 text-xs font-sans font-bold focus:ring-1 focus:ring-vow-dark focus:outline-none"
                >
                  {fontsList.map((f) => (
                    <option key={f.id} value={f.familyName}>
                      {f.familyName} ({f.classification}) {f.provider === "custom" ? "• Custom" : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Date / Location with typeface & font size slider */}
          <div className="p-3 bg-white border border-vow-border rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-[11px] font-sans font-semibold text-vow-charcoal uppercase tracking-wider">
                Date / Location
              </label>
              <div className="flex items-center space-x-1">
                <input
                  type="number"
                  min="10"
                  max="200"
                  value={dateFontSize}
                  onChange={(e) => {
                    const val = Math.max(10, Math.min(200, Number(e.target.value) || 10));
                    setTypographyOptions({ dateFontSize: val });
                  }}
                  className="w-14 bg-slate-50 border border-vow-border rounded px-1 py-0.5 text-right font-mono text-[11px] font-bold focus:ring-1 focus:ring-vow-dark focus:outline-none"
                />
                <span className="text-[10px] text-vow-muted font-bold">px</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={dateText || ""}
                onChange={(e) => {
                  setBrief({ date: e.target.value });
                  setTypographyOptions({ dateText: e.target.value });
                }}
                className="w-full bg-slate-50 border border-vow-border rounded-md px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-vow-dark focus:outline-none font-medium"
                placeholder="e.g. OCTOBER 24, 2026"
              />
              <select
                value={dateFontFamily || fontFamily}
                onChange={(e) => setTypographyOptions({ dateFontFamily: e.target.value })}
                className="w-full bg-slate-50 border border-vow-border rounded-md px-2 py-1.5 text-xs font-sans font-bold focus:ring-1 focus:ring-vow-dark focus:outline-none"
              >
                {fontsList.map((f) => (
                  <option key={f.id} value={f.familyName}>
                    {f.familyName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex justify-between text-[10px] text-vow-muted font-mono mb-0.5">
                <span>Font Size</span>
                <span>{dateFontSize}px</span>
              </div>
              <input
                type="range"
                min="10"
                max="200"
                value={dateFontSize}
                onChange={(e) => setTypographyOptions({ dateFontSize: Number(e.target.value) })}
                className="w-full accent-vow-dark cursor-pointer"
              />
            </div>
          </div>

          {/* Hashtag with typeface & font size slider */}
          <div className="p-3 bg-white border border-vow-border rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-[11px] font-sans font-semibold text-vow-charcoal uppercase tracking-wider">
                Hashtag
              </label>
              <div className="flex items-center space-x-1">
                <input
                  type="number"
                  min="10"
                  max="200"
                  value={hashtagFontSize}
                  onChange={(e) => {
                    const val = Math.max(10, Math.min(200, Number(e.target.value) || 10));
                    setTypographyOptions({ hashtagFontSize: val });
                  }}
                  className="w-14 bg-slate-50 border border-vow-border rounded px-1 py-0.5 text-right font-mono text-[11px] font-bold focus:ring-1 focus:ring-vow-dark focus:outline-none"
                />
                <span className="text-[10px] text-vow-muted font-bold">px</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={hashtagText || ""}
                onChange={(e) => setTypographyOptions({ hashtagText: e.target.value })}
                className="w-full bg-slate-50 border border-vow-border rounded-md px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-vow-dark focus:outline-none font-medium"
                placeholder="e.g. #EventHashtag"
              />
              <select
                value={hashtagFontFamily || fontFamily}
                onChange={(e) => setTypographyOptions({ hashtagFontFamily: e.target.value })}
                className="w-full bg-slate-50 border border-vow-border rounded-md px-2 py-1.5 text-xs font-sans font-bold focus:ring-1 focus:ring-vow-dark focus:outline-none"
              >
                {fontsList.map((f) => (
                  <option key={f.id} value={f.familyName}>
                    {f.familyName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex justify-between text-[10px] text-vow-muted font-mono mb-0.5">
                <span>Font Size</span>
                <span>{hashtagFontSize}px</span>
              </div>
              <input
                type="range"
                min="10"
                max="200"
                value={hashtagFontSize}
                onChange={(e) => setTypographyOptions({ hashtagFontSize: Number(e.target.value) })}
                className="w-full accent-vow-dark cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-sans font-semibold text-vow-charcoal uppercase tracking-wider mb-1">
              Layout Structure
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "stacked", label: "Stacked" },
                { id: "horizontal", label: "Horizontal" },
                { id: "interlocking", label: "Interlocking" },
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

          {layout === "stacked" && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-sans font-semibold text-vow-charcoal uppercase tracking-wider">
                  Partner Names Vertical Gap
                </label>
                <div className="flex items-center space-x-1">
                  <input
                    type="number"
                    min="30"
                    max="350"
                    value={nameGap !== undefined ? nameGap : 120}
                    onChange={(e) => setTypographyOptions({ nameGap: Number(e.target.value) || 30 })}
                    className="w-16 bg-white border border-vow-border rounded px-1.5 py-0.5 text-right font-mono text-xs font-bold focus:ring-1 focus:ring-vow-dark focus:outline-none"
                  />
                  <span className="text-[10px] text-vow-muted font-bold">px</span>
                </div>
              </div>
              <input
                type="range"
                min="30"
                max="350"
                value={nameGap !== undefined ? nameGap : 120}
                onChange={(e) => setTypographyOptions({ nameGap: Number(e.target.value) })}
                className="w-full accent-vow-dark cursor-pointer"
              />
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-2 bg-slate-50 p-2.5 rounded-lg border border-vow-border">
              <label className="flex items-center space-x-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={ampersandText === ""}
                  onChange={(e) => {
                    setTypographyOptions({ ampersandText: e.target.checked ? "" : "&" });
                  }}
                  className="w-4 h-4 accent-vow-dark rounded border-vow-border cursor-pointer"
                />
                <span className="text-xs font-sans font-bold text-vow-dark">Hide ampersand (&amp;)</span>
              </label>
            </div>

            {ampersandText !== "" && (
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
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
