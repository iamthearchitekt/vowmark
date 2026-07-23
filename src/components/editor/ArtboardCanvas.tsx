"use client";

import { useEditorStore, getFormatDimensions } from "@/lib/store/useEditorStore";
import { TypographyEngine } from "@/lib/typography/engine";
import { resolveFontConfig } from "@/lib/typography/font-resolver";
import { useEffect, useState, useMemo } from "react";
import {
  Sparkles,
  Camera,
  Image as ImageIcon,
  Layers,
  ArrowUpDown,
  MoveHorizontal,
  Maximize2,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
} from "lucide-react";

export function ArtboardCanvas() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Subscribe to studio mode, 2-layer composition state, and photobooth state
  const studioMode = useEditorStore((state) => state.studioMode);
  const backgroundPatternAssetUrl = useEditorStore((state) => state.backgroundPatternAssetUrl);
  const textLogoAssetUrl = useEditorStore((state) => state.textLogoAssetUrl);
  const textLayerBlendMode = useEditorStore((state) => state.textLayerBlendMode);
  const aiGeneratedAssetUrl = useEditorStore((state) => state.aiGeneratedAssetUrl);

  const photoboothMode = useEditorStore((state) => state.photoboothMode);
  const photoboothMode6x4 = useEditorStore((state) => state.photoboothMode6x4 || "mode1");
  const photoboothFlipH = useEditorStore((state) => state.photoboothFlipH || false);
  const photoboothFlipV = useEditorStore((state) => state.photoboothFlipV || false);
  const photoboothFrameUrl = useEditorStore((state) => state.photoboothFrameUrl);
  const photoboothOffsetX = useEditorStore((state) => state.photoboothOffsetX || 0);
  const photoboothOffsetY = useEditorStore((state) => state.photoboothOffsetY || 0);
  const photoboothScale = useEditorStore((state) => state.photoboothScale || 100);

  const setPhotoboothMode6x4 = useEditorStore((state) => state.setPhotoboothMode6x4);
  const setPhotoboothFlipH = useEditorStore((state) => state.setPhotoboothFlipH);
  const setPhotoboothFlipV = useEditorStore((state) => state.setPhotoboothFlipV);
  const setPhotoboothOffsetX = useEditorStore((state) => state.setPhotoboothOffsetX);
  const setPhotoboothOffsetY = useEditorStore((state) => state.setPhotoboothOffsetY);
  const setPhotoboothScale = useEditorStore((state) => state.setPhotoboothScale);

  // Primitive scalar selectors for Vector mode
  const primaryText = useEditorStore((state) => state.typographyOptions.primaryText);
  const secondaryText = useEditorStore((state) => state.typographyOptions.secondaryText);
  const ampersandText = useEditorStore((state) => state.typographyOptions.ampersandText);
  const dateText = useEditorStore((state) => state.typographyOptions.dateText);
  const dateFontFamily = useEditorStore((state) => state.typographyOptions.dateFontFamily);
  const dateFontSize = useEditorStore((state) => state.typographyOptions.dateFontSize);
  const hashtagText = useEditorStore((state) => state.typographyOptions.hashtagText);
  const hashtagFontFamily = useEditorStore((state) => state.typographyOptions.hashtagFontFamily);
  const hashtagFontSize = useEditorStore((state) => state.typographyOptions.hashtagFontSize);
  const fontFamily = useEditorStore((state) => state.typographyOptions.fontFamily);
  const fontSize = useEditorStore((state) => state.typographyOptions.fontSize);
  const primaryFontSize = useEditorStore((state) => state.typographyOptions.primaryFontSize);
  const secondaryFontSize = useEditorStore((state) => state.typographyOptions.secondaryFontSize);
  const letterSpacing = useEditorStore((state) => state.typographyOptions.letterSpacing);
  const nameGap = useEditorStore((state) => state.typographyOptions.nameGap);
  const ampersandScale = useEditorStore((state) => state.typographyOptions.ampersandScale);
  const layout = useEditorStore((state) => state.typographyOptions.layout);

  const canvasFormat = useEditorStore((state) => state.canvasFormat);
  const ornamentUrl = useEditorStore((state) => state.ornamentUrl);
  const zoomLevel = useEditorStore((state) => state.zoomLevel);

  const dimensions = useMemo(() => getFormatDimensions(canvasFormat), [canvasFormat]);

  // Dynamically load Google Web Fonts when selected
  useEffect(() => {
    const fontsToLoad = [fontFamily, dateFontFamily, hashtagFontFamily].filter(Boolean) as string[];
    fontsToLoad.forEach((fontName) => {
      const config = resolveFontConfig(fontName);
      if (config.googleFontUrl) {
        const linkId = `font-link-${config.webFontName.replace(/\s+/g, "-").toLowerCase()}`;
        if (!document.getElementById(linkId)) {
          const link = document.createElement("link");
          link.id = linkId;
          link.rel = "stylesheet";
          link.href = config.googleFontUrl;
          document.head.appendChild(link);
        }
      }
    });
  }, [fontFamily, dateFontFamily, hashtagFontFamily]);

  // Vector SVG typography engine output
  const renderedVectorSvg = useMemo(() => {
    return TypographyEngine.renderSvg({
      primaryText,
      secondaryText,
      ampersandText,
      dateText,
      dateFontFamily,
      dateFontSize,
      hashtagText,
      hashtagFontFamily,
      hashtagFontSize,
      fontFamily,
      fontSize,
      primaryFontSize,
      secondaryFontSize,
      letterSpacing,
      nameGap,
      ampersandScale,
      layout,
      colorMode: "black_on_white",
      isTransparent: true,
      canvasWidth: dimensions.width,
      canvasHeight: dimensions.height,
    }).svg;
  }, [
    primaryText,
    secondaryText,
    ampersandText,
    dateText,
    dateFontFamily,
    dateFontSize,
    hashtagText,
    hashtagFontFamily,
    hashtagFontSize,
    fontFamily,
    fontSize,
    primaryFontSize,
    secondaryFontSize,
    letterSpacing,
    nameGap,
    ampersandScale,
    layout,
    dimensions.width,
    dimensions.height,
  ]);

  if (!mounted) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-100/90 font-sans">
        <div className="w-[500px] h-[500px] bg-white border border-slate-200 rounded flex items-center justify-center text-xs text-slate-400">
          Loading Creator Studio Canvas...
        </div>
      </div>
    );
  }

  // Always pure flat white background container
  const bgClass = "bg-white border border-slate-300 shadow-xl";

  // Scaled High-Res Studio Display Dimensions for 2x6, 4x6, 6x4, and Square
  let widthPx = 650;
  let heightPx = 650;

  if (canvasFormat === "2_x_6") {
    widthPx = 280;
    heightPx = 840;
  } else if (canvasFormat === "4_x_6") {
    widthPx = 480;
    heightPx = 720;
  } else if (canvasFormat === "6_x_4") {
    widthPx = 720;
    heightPx = 480;
  } else if (canvasFormat === "square") {
    widthPx = 650;
    heightPx = 650;
  }

  // Determine active text/logo artwork URL (Layer 2)
  const activeLogoAsset = textLogoAssetUrl || (studioMode === "generative_ai" ? aiGeneratedAssetUrl : null);

  const is2x6Format = canvasFormat === "2_x_6";
  const is6x4Format = canvasFormat === "6_x_4";
  const isNonSquare = canvasFormat !== "square";

  // Active Frame Overlay URL Resolution
  let activeFrameOverlayUrl = photoboothFrameUrl;
  if (!activeFrameOverlayUrl) {
    if (canvasFormat === "2_x_6") {
      activeFrameOverlayUrl = "/photobooth-2x6-frame.png";
    } else if (canvasFormat === "4_x_6") {
      activeFrameOverlayUrl = "/photobooth-frames/frame-4x6-portrait.png";
    } else if (canvasFormat === "6_x_4") {
      activeFrameOverlayUrl = `/photobooth-frames/frame-6x4-${photoboothMode6x4}.png`;
    }
  }

  return (
    <div className="relative flex-1 flex flex-col items-center justify-center p-8 bg-slate-100/90 overflow-hidden select-none font-sans">
      {/* Visual Canvas Container */}
      <div
        className={`relative rounded transition-all duration-200 overflow-hidden ${bgClass}`}
        style={{
          width: `${widthPx}px`,
          height: `${heightPx}px`,
          transform: `scale(${zoomLevel / 100})`,
        }}
      >
        {/* ======================================================== */}
        {/* LAYER 1 (BOTTOM): BACKGROUND & PATTERN LAYER */}
        {/* ======================================================== */}
        {backgroundPatternAssetUrl && (
          <div className="absolute inset-0 z-0 pointer-events-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={backgroundPatternAssetUrl}
              alt="Layer 1 Background & Pattern"
              className="w-full h-full object-cover transition-opacity duration-300"
            />
          </div>
        )}

        {/* ======================================================== */}
        {/* PHOTOBOOTH STRIP & FRAME OVERLAY (2x6, 4x6, 6x4 Formats) */}
        {/* ======================================================== */}
        {isNonSquare && photoboothMode && activeFrameOverlayUrl && (
          <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeFrameOverlayUrl}
              alt="Photobooth Frame Overlay"
              className="absolute inset-0 w-full h-full object-contain z-10 transition-transform duration-200"
              style={{
                transform: `${photoboothFlipH ? "scaleX(-1)" : ""} ${photoboothFlipV ? "scaleY(-1)" : ""}`.trim() || undefined,
              }}
            />
          </div>
        )}

        {/* ======================================================== */}
        {/* LAYER 2 (TOP): TEXT & MONOGRAM LOGO LAYER WITH BLEND MODES */}
        {/* Anchored consistently whether Photo Mock is ON or OFF */}
        {/* ======================================================== */}
        <div
          className={`absolute z-20 flex items-center justify-center transition-all ${
            is2x6Format
              ? "bottom-0 left-0 right-0 h-[30%] p-4"
              : "inset-0 p-6 w-full h-full"
          }`}
          style={{
            transform:
              isNonSquare
                ? `translate(${photoboothOffsetX}px, ${photoboothOffsetY}px) scale(${photoboothScale / 100})`
                : undefined,
            mixBlendMode: textLayerBlendMode,
          }}
        >
          {studioMode === "generative_ai" && activeLogoAsset ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={activeLogoAsset}
              alt="Layer 2 AI Text & Monogram Logo Artwork"
              className="w-full h-full object-contain filter contrast-125 transition-opacity duration-300"
            />
          ) : (
            /* Deterministic Vector Mode Typography Overlay (Can overlay on top of AI backgrounds!) */
            <>
              {ornamentUrl && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-85">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={ornamentUrl}
                    alt="Ornament Layer"
                    className="w-full h-full object-contain filter contrast-125"
                  />
                </div>
              )}

              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-auto w-full h-full"
                dangerouslySetInnerHTML={{ __html: renderedVectorSvg }}
              />
            </>
          )}
        </div>

        {/* Safe Area Guide */}
        <div className="absolute inset-3 border border-dashed border-slate-300/40 pointer-events-none z-30" />
      </div>

      {/* Sleek Floating Glassmorphism Transform & Frame Control Pill (Non-Square Formats) */}
      {isNonSquare && (
        <div className="absolute bottom-6 z-40 bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xl rounded-full px-5 py-2 flex items-center space-x-3.5 text-xs font-sans animate-fadeIn">
          {/* 6x4 Mode Selector (1 Box vs 3 Boxes) */}
          {is6x4Format && photoboothMode && (
            <>
              <div className="flex items-center space-x-1 bg-slate-100 p-0.5 rounded-full border border-slate-200">
                <button
                  type="button"
                  onClick={() => setPhotoboothMode6x4("mode1")}
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase transition-all ${
                    photoboothMode6x4 === "mode1"
                      ? "bg-vow-dark text-white shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                  title="Single Box photo frame layout"
                >
                  1 Box
                </button>
                <button
                  type="button"
                  onClick={() => setPhotoboothMode6x4("mode2")}
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase transition-all ${
                    photoboothMode6x4 === "mode2"
                      ? "bg-vow-dark text-white shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                  title="3 Boxes photo frame layout"
                >
                  3 Boxes
                </button>
              </div>

              <div className="h-3.5 w-px bg-slate-200" />
            </>
          )}

          {/* Horizontal / Vertical Flip Controls */}
          {photoboothMode && (
            <>
              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  onClick={() => setPhotoboothFlipH(!photoboothFlipH)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 transition-all border ${
                    photoboothFlipH
                      ? "bg-vow-dark text-white border-vow-dark shadow-2xs"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                  title="Flip photo frame horizontally"
                >
                  <FlipHorizontal className="w-3 h-3 text-vow-accent" />
                  <span>Flip H</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPhotoboothFlipV(!photoboothFlipV)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 transition-all border ${
                    photoboothFlipV
                      ? "bg-vow-dark text-white border-vow-dark shadow-2xs"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                  title="Flip photo frame vertically"
                >
                  <FlipVertical className="w-3 h-3 text-vow-accent" />
                  <span>Flip V</span>
                </button>
              </div>

              <div className="h-3.5 w-px bg-slate-200" />
            </>
          )}

          {/* Horizontal X-Position Slider with Micro Steppers & Editable Number Box */}
          <div className="flex items-center space-x-1.5">
            <MoveHorizontal className="w-3.5 h-3.5 text-vow-accent flex-shrink-0" />
            <span className="text-[10px] font-bold text-vow-dark uppercase tracking-wider">X:</span>
            <button
              type="button"
              onClick={() => setPhotoboothOffsetX(photoboothOffsetX - 2)}
              className="w-4 h-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded flex items-center justify-center text-[11px] leading-none"
              title="Nudge left (-2px)"
            >
              -
            </button>
            <input
              type="range"
              min="-400"
              max="400"
              step="1"
              value={photoboothOffsetX}
              onChange={(e) => setPhotoboothOffsetX(Number(e.target.value))}
              className="w-24 accent-vow-dark cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              title="Adjust horizontal X position"
            />
            <button
              type="button"
              onClick={() => setPhotoboothOffsetX(photoboothOffsetX + 2)}
              className="w-4 h-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded flex items-center justify-center text-[11px] leading-none"
              title="Nudge right (+2px)"
            >
              +
            </button>
            <input
              type="number"
              min="-400"
              max="400"
              value={photoboothOffsetX}
              onChange={(e) => setPhotoboothOffsetX(Number(e.target.value) || 0)}
              className="w-12 bg-slate-100 border border-slate-200 rounded px-1 py-0.5 text-right font-mono text-[10px] font-bold text-vow-accent focus:outline-none"
              title="Type exact X position"
            />
          </div>

          <div className="h-3.5 w-px bg-slate-200" />

          {/* Vertical Y-Position Slider with Micro Steppers & Editable Number Box */}
          <div className="flex items-center space-x-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-vow-accent flex-shrink-0" />
            <span className="text-[10px] font-bold text-vow-dark uppercase tracking-wider">Y:</span>
            <button
              type="button"
              onClick={() => setPhotoboothOffsetY(photoboothOffsetY - 2)}
              className="w-4 h-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded flex items-center justify-center text-[11px] leading-none"
              title="Nudge up (-2px)"
            >
              -
            </button>
            <input
              type="range"
              min="-400"
              max="400"
              step="1"
              value={photoboothOffsetY}
              onChange={(e) => setPhotoboothOffsetY(Number(e.target.value))}
              className="w-24 accent-vow-dark cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              title="Adjust vertical Y position"
            />
            <button
              type="button"
              onClick={() => setPhotoboothOffsetY(photoboothOffsetY + 2)}
              className="w-4 h-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded flex items-center justify-center text-[11px] leading-none"
              title="Nudge down (+2px)"
            >
              +
            </button>
            <input
              type="number"
              min="-400"
              max="400"
              value={photoboothOffsetY}
              onChange={(e) => setPhotoboothOffsetY(Number(e.target.value) || 0)}
              className="w-12 bg-slate-100 border border-slate-200 rounded px-1 py-0.5 text-right font-mono text-[10px] font-bold text-vow-accent focus:outline-none"
              title="Type exact Y position"
            />
          </div>

          <div className="h-3.5 w-px bg-slate-200" />

          {/* Scale Slider */}
          <div className="flex items-center space-x-1.5">
            <Maximize2 className="w-3.5 h-3.5 text-vow-accent flex-shrink-0" />
            <span className="text-[10px] font-bold text-vow-dark uppercase tracking-wider">Size:</span>
            <input
              type="range"
              min="40"
              max="160"
              step="1"
              value={photoboothScale}
              onChange={(e) => setPhotoboothScale(Number(e.target.value))}
              className="w-16 accent-vow-dark cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              title="Adjust scale percentage"
            />
            <span className="font-mono text-[10px] font-bold text-vow-accent min-w-[28px] text-right">
              {photoboothScale}%
            </span>
          </div>

          {/* Quick Reset Transform */}
          {(photoboothOffsetX !== 0 || photoboothOffsetY !== 0 || photoboothScale !== 100 || photoboothFlipH || photoboothFlipV) && (
            <>
              <div className="h-3.5 w-px bg-slate-200" />
              <button
                type="button"
                onClick={() => {
                  setPhotoboothOffsetX(0);
                  setPhotoboothOffsetY(0);
                  setPhotoboothScale(100);
                  setPhotoboothFlipH(false);
                  setPhotoboothFlipV(false);
                }}
                className="text-[10px] font-mono font-bold text-slate-400 hover:text-slate-700 uppercase flex items-center gap-1"
                title="Reset X, Y, scale, and flips to default"
              >
                <RotateCcw className="w-2.5 h-2.5" />
                <span>Reset</span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
