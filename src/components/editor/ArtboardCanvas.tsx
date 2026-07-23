"use client";

import { useEditorStore, getFormatDimensions } from "@/lib/store/useEditorStore";
import { TypographyEngine } from "@/lib/typography/engine";
import { resolveFontConfig } from "@/lib/typography/font-resolver";
import { useEffect, useState, useMemo } from "react";
import { Sparkles, Type } from "lucide-react";

export function ArtboardCanvas() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Subscribe to studio mode and AI generated asset state
  const studioMode = useEditorStore((state) => state.studioMode);
  const aiGeneratedAssetUrl = useEditorStore((state) => state.aiGeneratedAssetUrl);

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

  // Always pure flat white background
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

  return (
    <div className="relative flex-1 flex flex-col items-center justify-center p-8 bg-slate-100/90 overflow-hidden select-none font-sans">
      {/* Visual Canvas Container */}
      <div
        className={`relative rounded transition-all duration-200 flex items-center justify-center overflow-hidden ${bgClass}`}
        style={{
          width: `${widthPx}px`,
          height: `${heightPx}px`,
          transform: `scale(${zoomLevel / 100})`,
        }}
      >
        {/* MODE 1: Generative AI Mode Canvas Display (OpenAI DALL-E 3) */}
        {studioMode === "generative_ai" ? (
          <div className="absolute inset-0 flex items-center justify-center p-8 w-full h-full">
            {aiGeneratedAssetUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={aiGeneratedAssetUrl}
                alt="AI Generated DALL-E 3 Wedding Logo"
                className="w-full h-full object-contain filter contrast-125 transition-opacity duration-300"
              />
            ) : (
              /* Clean Blank Canvas Display */
              <div className="text-center text-vow-muted p-8 flex flex-col items-center justify-center space-y-3 border-2 border-dashed border-slate-200/80 rounded-xl max-w-xs bg-white">
                <div className="w-10 h-10 rounded-full bg-slate-100 text-vow-accent flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-xs text-vow-dark uppercase tracking-wider">
                  Studio Artboard
                </h4>
                <p className="text-[11px] leading-relaxed text-slate-500 font-sans">
                  Type in the AI Design Assistant to generate DALL·E 3 logo artwork from scratch.
                </p>
              </div>
            )}
          </div>
        ) : (
          /* MODE 2: Deterministic Vector Mode Canvas Display */
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

        {/* Safe Area Guide */}
        <div className="absolute inset-4 border border-dashed border-slate-300/40 pointer-events-none" />
      </div>
    </div>
  );
}
