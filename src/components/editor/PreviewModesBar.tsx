"use client";

import { useEditorStore, CanvasFormat } from "@/lib/store/useEditorStore";
import { Download, ZoomIn, ZoomOut, Sparkles, Type, Blend } from "lucide-react";
import { useState, useEffect } from "react";
import { ExportModal } from "./ExportModal";
import { VersionHistoryModal } from "./VersionHistoryModal";

export function PreviewModesBar() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const studioMode = useEditorStore((state) => state.studioMode);
  const canvasFormat = useEditorStore((state) => state.canvasFormat);
  const zoomLevel = useEditorStore((state) => state.zoomLevel);
  const textLayerBlendMode = useEditorStore((state) => state.textLayerBlendMode);

  const setStudioMode = useEditorStore((state) => state.setStudioMode);
  const setCanvasFormat = useEditorStore((state) => state.setCanvasFormat);
  const setZoomLevel = useEditorStore((state) => state.setZoomLevel);
  const setTextLayerBlendMode = useEditorStore((state) => state.setTextLayerBlendMode);

  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  if (!mounted) {
    return (
      <div className="h-14 bg-vow-paper border-b border-vow-border px-6 flex items-center justify-between text-xs font-sans">
        <span className="text-slate-400">Loading Studio Modes...</span>
      </div>
    );
  }

  return (
    <>
      <div className="h-14 bg-vow-paper border-b border-vow-border px-6 flex items-center justify-between text-xs font-sans select-none z-30">
        {/* Studio Mode Selector (OpenAI gpt-image-2 AI Mode vs Vector Mode) */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => setStudioMode("generative_ai")}
              className={`px-3 py-1.5 rounded-md font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                studioMode === "generative_ai"
                  ? "bg-vow-dark text-white shadow-sm ring-1 ring-vow-accent"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-vow-accent" />
              <span>Generative AI Mode (gpt-image-2)</span>
            </button>

            <button
              type="button"
              onClick={() => setStudioMode("deterministic_vector")}
              className={`px-3 py-1.5 rounded-md font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                studioMode === "deterministic_vector"
                  ? "bg-vow-dark text-white shadow-sm ring-1 ring-vow-accent"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Type className="w-3.5 h-3.5 text-vow-accent" />
              <span>Vector Mode</span>
            </button>
          </div>

          {/* Layer 2 Blend Mode Selector (Normal | Multiply | Overlay) */}
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <span className="text-[10px] font-mono text-slate-500 font-bold px-1.5 uppercase flex items-center gap-1">
              <Blend className="w-3 h-3 text-vow-accent" />
              Blend:
            </span>
            {(["normal", "multiply", "overlay"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setTextLayerBlendMode(mode)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all cursor-pointer ${
                  textLayerBlendMode === mode
                    ? "bg-vow-dark text-white shadow-2xs font-black"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Format Selector Modes */}
          <div className="flex items-center space-x-1.5">
            {[
              { id: "2_x_6", label: "2 x 6 Strip" },
              { id: "4_x_6", label: "4 x 6 Vertical" },
              { id: "6_x_4", label: "6 x 4 Landscape" },
              { id: "square", label: "Basic Square Mode" },
            ].map((fmt) => {
              const isActive = canvasFormat === fmt.id;
              return (
                <button
                  key={fmt.id}
                  type="button"
                  onClick={() => setCanvasFormat(fmt.id as CanvasFormat)}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-stone-800 text-white shadow-2xs"
                      : "bg-vow-surface border border-vow-border text-vow-charcoal hover:bg-slate-200"
                  }`}
                >
                  {fmt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Zoom & Action Controls */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 bg-vow-surface px-2.5 py-1 rounded-md border border-vow-border">
            <button
              type="button"
              onClick={() => setZoomLevel(Math.max(40, zoomLevel - 10))}
              className="hover:text-vow-dark p-0.5 cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[11px] min-w-[2.5rem] text-center font-bold">{zoomLevel}%</span>
            <button
              type="button"
              onClick={() => setZoomLevel(Math.min(200, zoomLevel + 10))}
              className="hover:text-vow-dark p-0.5 cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <div className="h-3 w-px bg-slate-300 mx-1" />
            {[100, 150, 200].map((z) => (
              <button
                key={z}
                type="button"
                onClick={() => setZoomLevel(z)}
                className={`px-1.5 py-0.5 text-[10px] font-mono rounded font-bold transition-colors cursor-pointer ${
                  zoomLevel === z ? "bg-vow-dark text-white" : "hover:bg-slate-200 text-slate-600"
                }`}
              >
                {z}%
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setIsExportOpen(true)}
            className="flex items-center space-x-1.5 px-4 py-1.5 bg-vow-dark text-vow-paper hover:bg-black rounded-md font-bold uppercase tracking-wider text-[11px] transition-colors shadow-sm cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-vow-champagne" />
            <span>Batch Export</span>
          </button>
        </div>
      </div>

      {isExportOpen && <ExportModal onClose={() => setIsExportOpen(false)} />}
      {isHistoryOpen && <VersionHistoryModal onClose={() => setIsHistoryOpen(false)} />}
    </>
  );
}
