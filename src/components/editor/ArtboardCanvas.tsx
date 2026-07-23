"use client";

import { useEditorStore, getFormatDimensions } from "@/lib/store/useEditorStore";
import { TypographyEngine } from "@/lib/typography/engine";
import { resolveFontConfig } from "@/lib/typography/font-resolver";
import { useEffect, useState, useMemo } from "react";
import { Sparkles, Camera, Image as ImageIcon, Layers } from "lucide-react";

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
  const photoboothFrameUrl = useEditorStore((state) => state.photoboothFrameUrl);
  const photoboothOffsetY = useEditorStore((state) => state.photoboothOffsetY || 0);
  const photoboothScale = useEditorStore((state) => state.photoboothScale || 100);

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
  const isNonSquare = canvasFormat !== "square";
  const activeFrameOverlayUrl = photoboothFrameUrl || "/photobooth-2x6-frame.png";

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
        {/* PHOTOBOOTH STRIP FRAME OVERLAY (2 x 6 Format Only) */}
        {/* ======================================================== */}
        {is2x6Format && photoboothMode && (
          <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeFrameOverlayUrl}
              alt="2x6 Photobooth Strip Frame"
              className="absolute inset-0 w-full h-full object-contain z-10"
            />
          </div>
        )}

        {/* ======================================================== */}
        {/* LAYER 2 (TOP): TEXT & MONOGRAM LOGO LAYER WITH BLEND MODES */}
        {/* ======================================================== */}
        <div
          className={`absolute z-20 flex items-center justify-center transition-all ${
            is2x6Format && photoboothMode
              ? "bottom-0 left-0 right-0 h-[30%] p-4"
              : "inset-0 p-6 w-full h-full"
          }`}
          style={{
            transform:
              isNonSquare
                ? `translateY(${photoboothOffsetY}px) scale(${photoboothScale / 100})`
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
    </div>
  );
}
