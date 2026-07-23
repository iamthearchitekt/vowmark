"use client";

import { useEditorStore, getFormatDimensions } from "@/lib/store/useEditorStore";
import { TypographyEngine } from "@/lib/typography/engine";
import { useState } from "react";
import { X, Download, FileCode, Image as ImageIcon, Check, AlertCircle } from "lucide-react";
import {
  compositeToBlob,
  downloadBlob,
  downloadSVG,
  PRINT_DIMS,
} from "@/lib/export/client-exporter";

type ExportFormat = "svg" | "transparent_png" | "png";

const FORMAT_OPTIONS: {
  id: ExportFormat;
  title: string;
  desc: string;
  tag: string;
  vectorOnly?: boolean;
}[] = [
  {
    id: "transparent_png",
    title: "Transparent PNG — 300 DPI",
    desc: "True alpha-channel PNG. Drop directly into Photoshop, Canva, or InDesign over any background.",
    tag: "Vector Workflow",
    vectorOnly: false,
  },
  {
    id: "svg",
    title: "True Vector SVG",
    desc: "Infinitely scalable vector paths. Perfect for invitation printing, laser engraving, and Illustrator/Affinity.",
    tag: "Best for Print",
  },
  {
    id: "png",
    title: "White Background PNG — 300 DPI",
    desc: "Solid white background PNG. Ideal for web previews and social media.",
    tag: "Standard",
  },
];

export function ExportModal({ onClose }: { onClose: () => void }) {
  // ── Store state ──────────────────────────────────────────────────────────────
  const studioMode          = useEditorStore((s) => s.studioMode);
  const canvasFormat        = useEditorStore((s) => s.canvasFormat);
  const typographyOptions   = useEditorStore((s) => s.typographyOptions);
  const textColor           = useEditorStore((s) => s.textColor || "#000000");
  const textLayerBlendMode  = useEditorStore((s) => s.textLayerBlendMode);
  const textLayerOpacity    = useEditorStore((s) => s.textLayerOpacity ?? 100);
  const backgroundPatternAssetUrl = useEditorStore((s) => s.backgroundPatternAssetUrl);
  const backgroundLayerOpacity   = useEditorStore((s) => s.backgroundLayerOpacity ?? 100);
  const layer1Visible             = useEditorStore((s) => s.layer1Visible ?? true);
  const textLogoAssetUrl    = useEditorStore((s) => s.textLogoAssetUrl);
  const aiGeneratedAssetUrl = useEditorStore((s) => s.aiGeneratedAssetUrl);
  const layer2Visible             = useEditorStore((s) => s.layer2Visible ?? true);
  const photoboothMode      = useEditorStore((s) => s.photoboothMode);
  const photoboothMode6x4   = useEditorStore((s) => s.photoboothMode6x4 || "mode1");
  const photoboothFlipH     = useEditorStore((s) => s.photoboothFlipH || false);
  const photoboothFlipV     = useEditorStore((s) => s.photoboothFlipV || false);
  const photoboothFrameUrl  = useEditorStore((s) => s.photoboothFrameUrl);

  const [isExporting, setIsExporting]       = useState(false);
  const [exportSuccess, setExportSuccess]   = useState(false);
  const [errorMsg, setErrorMsg]             = useState<string | null>(null);
  const [renderWithPhotoMockup, setRenderWithPhotoMockup] = useState<boolean>(true);

  // If a background layer is present AND visible, transparent PNG is not valid —
  // the background IS the design and must be included in the output.
  const hasBackground = Boolean(backgroundPatternAssetUrl && layer1Visible);

  // Derived effective format: clamp away from transparent_png when there's a background
  const [selectedFormat, setSelectedFormatRaw] = useState<ExportFormat>("transparent_png");
  const effectiveFormat: ExportFormat =
    hasBackground && selectedFormat === "transparent_png" ? "png" : selectedFormat;

  const setSelectedFormat = (f: ExportFormat) => {
    setSelectedFormatRaw(f);
    setExportSuccess(false);
    setErrorMsg(null);
  };

  // ── Resolve photobooth frame URL (same logic as ArtboardCanvas) ──────────────
  const activeFrameOverlayUrl = (() => {
    if (photoboothFrameUrl) return photoboothFrameUrl;
    if (canvasFormat === "2_x_6") return "/photobooth-2x6-frame.png";
    if (canvasFormat === "4_x_6") return "/photobooth-frames/frame-4x6-portrait.png";
    if (canvasFormat === "6_x_4") return `/photobooth-frames/frame-6x4-${photoboothMode6x4}.png`;
    return null;
  })();

  // ── Active Layer 2 asset URL ─────────────────────────────────────────────────
  const activeLayer2ImageUrl =
    textLogoAssetUrl ||
    (studioMode === "generative_ai" ? aiGeneratedAssetUrl : null);

  // ── Print dimensions ─────────────────────────────────────────────────────────
  const printDims = PRINT_DIMS[canvasFormat] ?? { width: 1800, height: 1800 };

  // ── Export handler ───────────────────────────────────────────────────────────
  const handleExport = async () => {
    setIsExporting(true);
    setExportSuccess(false);
    setErrorMsg(null);

    try {
      const resolvedFormat  = effectiveFormat;
      const slug            = canvasFormat.replace(/_/g, "");
      const isNonSquare     = canvasFormat !== "square";
      const makeTransparent = resolvedFormat === "transparent_png";

      // ── SVG Export (Pure Vector Path Output for Illustrator & Print) ───────
      if (resolvedFormat === "svg") {
        const dims = getFormatDimensions(canvasFormat);
        const { svg } = TypographyEngine.renderSvg({
          ...typographyOptions,
          colorMode: "custom",
          textColor,
          isTransparent: true,
          canvasWidth:  dims.width,
          canvasHeight: dims.height,
        });
        downloadSVG(svg, `vowmark-${slug}.svg`);
        setExportSuccess(true);
        return;
      }

      // ── PNG Export (client-side canvas composite) ─────────────────────────────
      // Resolve Layer 2
      let layer2: Parameters<typeof compositeToBlob>[0]["layer2"] = null;

      if (activeLayer2ImageUrl) {
        layer2 = {
          type:      "image",
          assetUrl:  activeLayer2ImageUrl,
          opacity:   textLayerOpacity,
          blendMode: textLayerBlendMode || "normal",
        };
      } else {
        // Vector mode: render SVG at print resolution and composite onto canvas
        const dims = getFormatDimensions(canvasFormat);
        const { svg } = TypographyEngine.renderSvg({
          ...typographyOptions,
          colorMode:   "custom",
          textColor,
          isTransparent: true,
          canvasWidth:  dims.width,
          canvasHeight: dims.height,
        });
        layer2 = {
          type:      "svg",
          svgString: svg,
          opacity:   textLayerOpacity,
          blendMode: textLayerBlendMode || "normal",
        };
      }

      const blob = await compositeToBlob({
        width:  printDims.width,
        height: printDims.height,
        makeTransparent,

        layer1: (backgroundPatternAssetUrl && layer1Visible)
          ? { assetUrl: backgroundPatternAssetUrl, opacity: backgroundLayerOpacity }
          : null,

        frameOverlay: isNonSquare && photoboothMode && renderWithPhotoMockup && activeFrameOverlayUrl
          ? { assetUrl: activeFrameOverlayUrl, flipH: photoboothFlipH, flipV: photoboothFlipV }
          : null,

        layer2: layer2Visible ? layer2 : null,
      });

      downloadBlob(blob, `vowmark-${slug}.png`);

      setExportSuccess(true);
    } catch (err: any) {
      console.error("[Export]", err);
      setErrorMsg(err?.message || "Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  // ── UI ───────────────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-vow-paper border border-vow-border rounded-xl w-full max-w-lg overflow-hidden shadow-2xl p-6 relative select-none">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-vow-muted hover:text-vow-dark"
          aria-label="Close export modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-5">
          <h2 className="font-serif font-bold text-xl text-vow-dark">Export</h2>
          <p className="text-xs text-vow-muted font-sans mt-1">
            All exports are generated locally in your browser — no upload required.
          </p>
          <div className="mt-2 flex items-center gap-2 text-[10px] font-mono text-vow-muted">
            <span className="px-1.5 py-0.5 bg-vow-surface border border-vow-border rounded uppercase tracking-wider">
              {canvasFormat.replace(/_/g, " ")}
            </span>
            <span>·</span>
            <span>{printDims.width} × {printDims.height} px</span>
            <span>·</span>
            <span>300 DPI</span>
          </div>
        </div>

        {/* Contextual callout */}
        {hasBackground ? (
          <div className="mb-4 flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
            <ImageIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Background layer active.</strong> Transparent PNG is unavailable — your background is part of the design and will be included in all exports.
            </span>
          </div>
        ) : studioMode !== "generative_ai" ? (
          <div className="mb-4 flex items-start gap-2 p-3 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-700">
            <FileCode className="w-4 h-4 flex-shrink-0 mt-0.5 text-vow-accent" />
            <span>
              <strong>Vector mode active.</strong> <em>Transparent PNG</em> exports your text &amp; monogram on a true alpha-channel background — ready to layer over any design.
            </span>
          </div>
        ) : null}

        {/* Format picker */}
        <div className="space-y-2.5 mb-4">
          {FORMAT_OPTIONS
            .filter((item) => !(hasBackground && item.id === "transparent_png"))
            .map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedFormat(item.id)}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                effectiveFormat === item.id
                  ? "border-vow-dark bg-stone-50 ring-1 ring-vow-dark"
                  : "border-vow-border bg-white hover:border-stone-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {item.id === "svg"
                    ? <FileCode className="w-4 h-4 text-vow-accent flex-shrink-0" />
                    : <ImageIcon className="w-4 h-4 text-vow-accent flex-shrink-0" />}
                  <span className="font-sans font-bold text-sm text-vow-dark">{item.title}</span>
                </div>
                <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                  item.id === "transparent_png" && studioMode !== "generative_ai"
                    ? "bg-vow-dark text-vow-paper border-vow-dark"
                    : "bg-vow-surface border-vow-border text-vow-muted"
                }`}>
                  {item.tag}
                </span>
              </div>
              <p className="text-xs text-vow-muted mt-1 leading-snug pl-6">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Photobooth Frame Overlay / Photo Mockup Checkbox Option */}
        {canvasFormat !== "square" && activeFrameOverlayUrl && (
          <div className="mb-4 p-3 bg-stone-50 border border-stone-200 rounded-lg flex items-center justify-between">
            <label className="flex items-center space-x-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={renderWithPhotoMockup}
                onChange={(e) => setRenderWithPhotoMockup(e.target.checked)}
                className="w-4 h-4 accent-vow-dark rounded border-vow-border cursor-pointer"
              />
              <div className="flex flex-col">
                <span className="text-xs font-sans font-bold text-vow-dark flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-vow-accent" />
                  <span>Render with Photobooth Photo Frame / Mockup ON</span>
                </span>
                <span className="text-[10px] font-sans text-vow-muted">
                  {renderWithPhotoMockup
                    ? "Includes photobooth frame overlay & photo box cutouts in the exported PNG."
                    : "Exports clean artwork composite without photo boxes overlay."}
                </span>
              </div>
            </label>
          </div>
        )}

        {/* Error message */}
        {errorMsg && (
          <div className="mb-4 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-vow-border">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-sans font-medium text-vow-muted hover:text-vow-dark"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="px-6 py-2 bg-vow-dark text-vow-paper hover:bg-black disabled:opacity-60 disabled:cursor-not-allowed rounded-md text-xs font-sans font-semibold uppercase tracking-wider transition-colors flex items-center space-x-2 shadow-sm cursor-pointer"
          >
            {exportSuccess
              ? <Check className="w-4 h-4 text-vow-champagne" />
              : <Download className="w-4 h-4 text-vow-champagne" />}
            <span>
              {isExporting ? "Exporting…" : exportSuccess ? "Downloaded!" : "Download File"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
