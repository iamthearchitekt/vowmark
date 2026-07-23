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

const FORMAT_OPTIONS: { id: ExportFormat; title: string; desc: string; tag: string }[] = [
  {
    id: "svg",
    title: "True Vector SVG",
    desc: "Infinitely scalable vector file. Perfect for invitation printing, laser engraving, and Illustrator/Affinity workflows.",
    tag: "Best for Print",
  },
  {
    id: "transparent_png",
    title: "Transparent PNG — 300 DPI",
    desc: "Isolated asset on a transparent background, ready to drop into Photoshop, Canva, or InDesign.",
    tag: "Photoshop Ready",
  },
  {
    id: "png",
    title: "White Background PNG — 300 DPI",
    desc: "Standard PNG on a solid white background. Ideal for web previews and social media.",
    tag: "Standard",
  },
];

export function ExportModal({ onClose }: { onClose: () => void }) {
  // ── Store state ──────────────────────────────────────────────────────────────
  const studioMode          = useEditorStore((s) => s.studioMode);
  const canvasFormat        = useEditorStore((s) => s.canvasFormat);
  const typographyOptions   = useEditorStore((s) => s.typographyOptions);
  const textColor           = useEditorStore((s) => s.textColor || "#0F172A");
  const textLayerBlendMode  = useEditorStore((s) => s.textLayerBlendMode);
  const textLayerOpacity    = useEditorStore((s) => s.textLayerOpacity ?? 100);
  const backgroundPatternAssetUrl = useEditorStore((s) => s.backgroundPatternAssetUrl);
  const backgroundLayerOpacity   = useEditorStore((s) => s.backgroundLayerOpacity ?? 100);
  const textLogoAssetUrl    = useEditorStore((s) => s.textLogoAssetUrl);
  const aiGeneratedAssetUrl = useEditorStore((s) => s.aiGeneratedAssetUrl);
  const photoboothMode      = useEditorStore((s) => s.photoboothMode);
  const photoboothMode6x4   = useEditorStore((s) => s.photoboothMode6x4 || "mode1");
  const photoboothFlipH     = useEditorStore((s) => s.photoboothFlipH || false);
  const photoboothFlipV     = useEditorStore((s) => s.photoboothFlipV || false);
  const photoboothFrameUrl  = useEditorStore((s) => s.photoboothFrameUrl);

  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>("transparent_png");
  const [isExporting, setIsExporting]       = useState(false);
  const [exportSuccess, setExportSuccess]   = useState(false);
  const [errorMsg, setErrorMsg]             = useState<string | null>(null);

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
      const isNonSquare    = canvasFormat !== "square";
      const makeTransparent = selectedFormat === "transparent_png";
      const slug           = canvasFormat.replace(/_/g, "");

      // ── SVG Export ───────────────────────────────────────────────────────────
      if (selectedFormat === "svg") {
        if (activeLayer2ImageUrl && studioMode === "generative_ai") {
          // AI image: wrap in an SVG container at correct dimensions
          const { width, height } = printDims;
          const svgWrap = [
            `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"`,
            `  width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`,
            `  <image href="${activeLayer2ImageUrl}"`,
            `    x="0" y="0" width="${width}" height="${height}"`,
            `    preserveAspectRatio="xMidYMid meet"/>`,
            `</svg>`,
          ].join("\n");
          downloadSVG(svgWrap, `vowmark-${slug}.svg`);
        } else {
          // Vector typography mode: render SVG at print resolution
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
        }
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

        layer1: backgroundPatternAssetUrl
          ? { assetUrl: backgroundPatternAssetUrl, opacity: backgroundLayerOpacity }
          : null,

        frameOverlay: isNonSquare && photoboothMode && activeFrameOverlayUrl
          ? { assetUrl: activeFrameOverlayUrl, flipH: photoboothFlipH, flipV: photoboothFlipV }
          : null,

        layer2,
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
        <div className="mb-6">
          <h2 className="font-serif font-bold text-xl text-vow-dark">Export Asset</h2>
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

        {/* Format picker */}
        <div className="space-y-3 mb-6">
          {FORMAT_OPTIONS.map((item) => (
            <div
              key={item.id}
              onClick={() => { setSelectedFormat(item.id); setExportSuccess(false); setErrorMsg(null); }}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                selectedFormat === item.id
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
                <span className="text-[10px] font-mono uppercase bg-vow-surface px-2 py-0.5 rounded border border-vow-border text-vow-muted">
                  {item.tag}
                </span>
              </div>
              <p className="text-xs text-vow-muted mt-1 leading-snug pl-6">{item.desc}</p>
            </div>
          ))}
        </div>

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
