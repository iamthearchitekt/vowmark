"use client";

import { useEditorStore, CanvasFormat } from "@/lib/store/useEditorStore";
import { Download, ZoomIn, ZoomOut, Sparkles, Type, Camera, Sliders, ArrowUpDown } from "lucide-react";
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

  // Photobooth state & setters
  const photoboothMode = useEditorStore((state) => state.photoboothMode);
  const photoboothOffsetY = useEditorStore((state) => state.photoboothOffsetY || 0);
  const photoboothScale = useEditorStore((state) => state.photoboothScale || 100);

  const setStudioMode = useEditorStore((state) => state.setStudioMode);
  const setCanvasFormat = useEditorStore((state) => state.setCanvasFormat);
  const setZoomLevel = useEditorStore((state) => state.setZoomLevel);
  const setPhotoboothMode = useEditorStore((state) => state.setPhotoboothMode);
  const setPhotoboothOffsetY = useEditorStore((state) => state.setPhotoboothOffsetY);
  const setPhotoboothScale = useEditorStore((state) => state.setPhotoboothScale);

  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  if (!mounted) {
    return (
      <div className="h-14 bg-vow-paper border-b border-vow-border px-6 flex items-center justify-between text-xs font-sans">
        <span className="text-slate-400">Loading Studio Modes...</span>
      </div>
    );
  }

  const is2x6Format = canvasFormat === "2_x_6";

  return (
    <>
      <div className="h-14 bg-vow-paper border-b border-vow-border px-6 flex items-center justify-between text-xs font-sans select-none z-30">
        {/* Studio Mode Selector (OpenAI gpt-image-2 AI Mode vs Vector Mode) */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => setStudioMode("generative_ai")}
              className={`px-3 py-1.5 rounded-md font-bold text-xs transition-all flex items-center gap-1.5 ${
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
              className={`px-3 py-1.5 rounded-md font-bold text-xs transition-all flex items-center gap-1.5 ${
                studioMode === "deterministic_vector"
                  ? "bg-vow-dark text-white shadow-sm ring-1 ring-vow-accent"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Type className="w-3.5 h-3.5 text-vow-accent" />
              <span>Vector Mode</span>
            </button>
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
                  className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                    isActive
                      ? "bg-stone-800 text-white shadow-2xs"
                      : "bg-vow-surface border border-vow-border text-vow-charcoal hover:bg-slate-200"
                  }`}
                >
                  {fmt.label}
                </button>
              ))}
          </div>
        </div>

        {/* SPECIAL 2x6 PHOTOBOOTH STRIP CONTROL TOOLBAR */}
        {is2x6Format && (
          <div className="flex items-center space-x-3 bg-slate-900 text-white px-3.5 py-1 rounded-lg shadow-sm border border-slate-800 animate-fadeIn">
            {/* Toggle Photobooth Frame ON/OFF */}
            <button
              type="button"
              onClick={() => setPhotoboothMode(!photoboothMode)}
              className={`px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1.5 transition-all ${
                photoboothMode
                  ? "bg-vow-accent text-vow-dark font-extrabold shadow-sm"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
              title="Toggle Photobooth 3-Slot Strip Frame Overlay"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Photobooth Frame: {photoboothMode ? "ON" : "OFF"}</span>
            </button>

            {photoboothMode && (
              <>
                <div className="h-4 w-px bg-slate-700" />

                {/* Vertical Y-Offset Position Adjustment */}
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono text-slate-300 font-bold flex items-center gap-1">
                    <ArrowUpDown className="w-3 h-3 text-vow-accent" />
                    Vertical Pos:
                  </span>
                  <input
                    type="range"
                    min="-120"
                    max="120"
                    value={photoboothOffsetY}
                    onChange={(e) => setPhotoboothOffsetY(Number(e.target.value))}
                    className="w-20 accent-vow-accent cursor-pointer"
                    title="Adjust vertical position of logo/text in photobooth zone"
                  />
                  <span className="font-mono text-[10px] text-vow-accent w-8 font-bold">
                    {photoboothOffsetY > 0 ? `+${photoboothOffsetY}` : photoboothOffsetY}px
                  </span>
                </div>

                <div className="h-4 w-px bg-slate-700" />

                {/* Logo Scale Adjustment */}
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono text-slate-300 font-bold">Logo Size:</span>
                  <input
                    type="range"
                    min="40"
                    max="160"
                    value={photoboothScale}
                    onChange={(e) => setPhotoboothScale(Number(e.target.value))}
                    className="w-16 accent-vow-accent cursor-pointer"
                    title="Adjust scale of logo/text in photobooth zone"
                  />
                  <span className="font-mono text-[10px] text-vow-accent w-8 font-bold">
                    {photoboothScale}%
                  </span>
                </div>
              </>
            )}
          </div>
        )}

        {/* Zoom & Action Controls */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 bg-vow-surface px-2.5 py-1 rounded-md border border-vow-border">
            <button
              type="button"
              onClick={() => setZoomLevel(Math.max(40, zoomLevel - 10))}
              className="hover:text-vow-dark p-0.5"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[11px] min-w-[2.5rem] text-center font-bold">{zoomLevel}%</span>
            <button
              type="button"
              onClick={() => setZoomLevel(Math.min(200, zoomLevel + 10))}
              className="hover:text-vow-dark p-0.5"
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
                className={`px-1.5 py-0.5 text-[10px] font-mono rounded font-bold transition-colors ${
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
            className="flex items-center space-x-1.5 px-4 py-1.5 bg-vow-dark text-vow-paper hover:bg-black rounded-md font-bold uppercase tracking-wider text-[11px] transition-colors shadow-sm"
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
