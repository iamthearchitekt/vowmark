"use client";

import { useEditorStore, getFormatDimensions } from "@/lib/store/useEditorStore";
import { TypographyEngine } from "@/lib/typography/engine";
import { resolveFontConfig } from "@/lib/typography/font-resolver";
import { useEffect, useState, useMemo } from "react";
import {
  ArrowUpDown,
  MoveHorizontal,
  Maximize2,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
  Save,
  Check,
} from "lucide-react";

export function ArtboardCanvas() {
  const [mounted, setMounted] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveProject = () => {
    const state = useEditorStore.getState();
    const pId = state.projectId || `proj_${Date.now()}`;
    const pTitle =
      state.typographyOptions.primaryText && state.typographyOptions.secondaryText
        ? `${state.typographyOptions.primaryText} & ${state.typographyOptions.secondaryText}`
        : state.projectTitle || "Wedding Mark Project";

    const projectData = {
      id: pId,
      title: pTitle,
      assetType: state.brief.assetType || "couple_logo",
      style: state.brief.weddingStyle || "editorial_luxury",
      font: state.typographyOptions.fontFamily || "Cormorant Garamond",
      primaryText: state.typographyOptions.primaryText,
      secondaryText: state.typographyOptions.secondaryText,
      dateText: state.typographyOptions.dateText,
      hashtagText: state.typographyOptions.hashtagText,
      canvasFormat: state.canvasFormat,
      backgroundPatternAssetUrl: state.backgroundPatternAssetUrl,
      backgroundSuite: state.backgroundSuite,
      textLogoAssetUrl: state.textLogoAssetUrl,
      textColor: state.textColor,
      photoboothMode: state.photoboothMode,
      brief: state.brief,
      typographyOptions: state.typographyOptions,
      updatedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      savedAtIso: new Date().toISOString(),
      version: "v1.0 (Saved)",
    };

    try {
      localStorage.setItem(`vowmark_project_${pId}`, JSON.stringify(projectData));
      localStorage.setItem("vowmark_latest_project", JSON.stringify(projectData));

      const existingRaw = localStorage.getItem("vowmark_client_projects");
      let projectsList: any[] = existingRaw ? JSON.parse(existingRaw) : [];

      const existingIdx = projectsList.findIndex((p: any) => p.id === pId);
      if (existingIdx >= 0) {
        projectsList[existingIdx] = projectData;
      } else {
        projectsList.unshift(projectData);
      }
      localStorage.setItem("vowmark_client_projects", JSON.stringify(projectsList));
      window.dispatchEvent(new CustomEvent("vowmark_project_saved", { detail: projectData }));
    } catch (e) {
      console.warn("Save error:", e);
    }

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // Subscribe to studio mode, 2-layer composition state, color, and photobooth state
  const studioMode = useEditorStore((state) => state.studioMode);
  const backgroundPatternAssetUrl = useEditorStore((state) => state.backgroundPatternAssetUrl);
  const backgroundLayerOpacity = useEditorStore((state) => state.backgroundLayerOpacity ?? 100);
  const layer1Visible = useEditorStore((state) => state.layer1Visible ?? true);
  const textLogoAssetUrl = useEditorStore((state) => state.textLogoAssetUrl);
  const textLayerBlendMode = useEditorStore((state) => state.textLayerBlendMode);
  const textLayerOpacity = useEditorStore((state) => state.textLayerOpacity ?? 100);
  const layer2Visible = useEditorStore((state) => state.layer2Visible ?? true);
  const textColor = useEditorStore((state) => state.textColor || "#000000");
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
  const hashtagLetterSpacing = useEditorStore((state) => state.typographyOptions.hashtagLetterSpacing);
  const fontFamily = useEditorStore((state) => state.typographyOptions.fontFamily);
  const fontSize = useEditorStore((state) => state.typographyOptions.fontSize);
  const primaryFontSize = useEditorStore((state) => state.typographyOptions.primaryFontSize);
  const secondaryFontSize = useEditorStore((state) => state.typographyOptions.secondaryFontSize);
  const letterSpacing = useEditorStore((state) => state.typographyOptions.letterSpacing);
  const dateLetterSpacing = useEditorStore((state) => state.typographyOptions.dateLetterSpacing);
  const nameGap = useEditorStore((state) => state.typographyOptions.nameGap);
  const ampersandScale = useEditorStore((state) => state.typographyOptions.ampersandScale);
  const layout = useEditorStore((state) => state.typographyOptions.layout);
  const hidePrimarySecondary = useEditorStore((state) => state.typographyOptions.hidePrimarySecondary);

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
      dateLetterSpacing,
      hashtagText,
      hashtagFontFamily,
      hashtagFontSize,
      hashtagLetterSpacing,
      hidePrimarySecondary,
      fontFamily,
      fontSize,
      primaryFontSize,
      secondaryFontSize,
      letterSpacing,
      nameGap,
      ampersandScale,
      layout,
      colorMode: "custom",
      textColor: textColor,
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
    dateLetterSpacing,
    hashtagText,
    hashtagFontFamily,
    hashtagFontSize,
    hashtagLetterSpacing,
    hidePrimarySecondary,
    fontFamily,
    fontSize,
    primaryFontSize,
    secondaryFontSize,
    letterSpacing,
    nameGap,
    ampersandScale,
    layout,
    textColor,
    dimensions.width,
    dimensions.height,
  ]);

  if (!mounted) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-stone-100/90 font-sans">
        <div className="w-[500px] h-[500px] bg-white border border-stone-200 rounded flex items-center justify-center text-xs text-stone-400">
          Loading Creator Studio Canvas...
        </div>
      </div>
    );
  }

  // Always pure flat white background container
  const bgClass = "bg-white border border-stone-300 shadow-xl";

  // Standard Canvas Dimensions for 2x6, 4x6, 6x4, and Square
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
    <div className="relative flex-1 flex flex-col items-center justify-start pt-16 pb-24 bg-stone-100/90 overflow-y-auto overflow-x-hidden select-none font-sans">
      {/* Sleek Floating Glassmorphism Transform & Frame Control Pill (Top of Work Window) */}
      <div className="absolute top-3 z-40 bg-white/95 backdrop-blur-md border border-stone-200/90 shadow-xl rounded-full px-4 py-1.5 flex items-center space-x-3 text-xs font-sans animate-fadeIn">
          {/* Quick Save Project Button in Floating Bar */}
          <button
            type="button"
            onClick={handleSaveProject}
            className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 transition-all shadow-xs cursor-pointer ${
              isSaved
                ? "bg-emerald-600 text-white"
                : "bg-vow-accent text-vow-dark hover:bg-amber-400 border border-vow-accent"
            }`}
            title="Save project design to Client Projects"
          >
            {isSaved ? (
              <>
                <Check className="w-3 h-3 text-white" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-3 h-3 text-vow-dark" />
                <span>Save Project</span>
              </>
            )}
          </button>

          <div className="h-3.5 w-px bg-stone-200" />
          {/* 6x4 Mode Selector — mode1 = 3 Boxes, mode2 = 1 Box */}
          {is6x4Format && photoboothMode && (
            <>
              <div className="flex items-center space-x-1 bg-stone-100 p-0.5 rounded-full border border-stone-200">
                <button
                  type="button"
                  onClick={() => setPhotoboothMode6x4("mode1")}
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase transition-all ${
                    photoboothMode6x4 === "mode1"
                      ? "bg-vow-dark text-white shadow-2xs"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                  title="3 Boxes photo frame layout"
                >
                  3 Boxes
                </button>
                <button
                  type="button"
                  onClick={() => setPhotoboothMode6x4("mode2")}
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase transition-all ${
                    photoboothMode6x4 === "mode2"
                      ? "bg-vow-dark text-white shadow-2xs"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                  title="1 Box photo frame layout"
                >
                  1 Box
                </button>
              </div>

              <div className="h-3.5 w-px bg-stone-200" />
            </>
          )}

          {/* Flip H/V — only shown for 6x4 3-box mode (mode1); 1-box and 2x6 don't need it */}
          {photoboothMode && !is2x6Format && !(is6x4Format && photoboothMode6x4 === "mode2") && (
            <>
              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  onClick={() => setPhotoboothFlipH(!photoboothFlipH)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 transition-all border ${
                    photoboothFlipH
                      ? "bg-vow-dark text-white border-vow-dark shadow-2xs"
                      : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
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
                      : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
                  }`}
                  title="Flip photo frame vertically"
                >
                  <FlipVertical className="w-3 h-3 text-vow-accent" />
                  <span>Flip V</span>
                </button>
              </div>

              <div className="h-3.5 w-px bg-stone-200" />
            </>
          )}

          {/* Horizontal X-Position Slider — hidden for 2x6 (not needed) */}
          {!is2x6Format && (
            <>
              <div className="flex items-center space-x-1.5">
                <MoveHorizontal className="w-3.5 h-3.5 text-vow-accent flex-shrink-0" />
                <span className="text-[10px] font-bold text-vow-dark uppercase tracking-wider">X:</span>
                <button
                  type="button"
                  onClick={() => setPhotoboothOffsetX(photoboothOffsetX - 2)}
                  className="w-4 h-4 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded flex items-center justify-center text-[11px] leading-none cursor-pointer"
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
                  className="w-24 accent-vow-dark cursor-pointer h-1.5 bg-stone-200 rounded-lg"
                  title="Adjust horizontal X position"
                />
                <button
                  type="button"
                  onClick={() => setPhotoboothOffsetX(photoboothOffsetX + 2)}
                  className="w-4 h-4 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded flex items-center justify-center text-[11px] leading-none cursor-pointer"
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
                  className="w-12 bg-stone-100 border border-stone-200 rounded px-1 py-0.5 text-right font-mono text-[10px] font-bold text-vow-accent focus:outline-none"
                  title="Type exact X position"
                />
              </div>

              <div className="h-3.5 w-px bg-stone-200" />
            </>
          )}

          {/* Vertical Y-Position Slider */}
          <div className="flex items-center space-x-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-vow-accent flex-shrink-0" />
            <span className="text-[10px] font-bold text-vow-dark uppercase tracking-wider">Y:</span>
            <button
              type="button"
              onClick={() => setPhotoboothOffsetY(photoboothOffsetY - 2)}
              className="w-4 h-4 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded flex items-center justify-center text-[11px] leading-none cursor-pointer"
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
              className="w-24 accent-vow-dark cursor-pointer h-1.5 bg-stone-200 rounded-lg"
              title="Adjust vertical Y position"
            />
            <button
              type="button"
              onClick={() => setPhotoboothOffsetY(photoboothOffsetY + 2)}
              className="w-4 h-4 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded flex items-center justify-center text-[11px] leading-none cursor-pointer"
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
              className="w-12 bg-stone-100 border border-stone-200 rounded px-1 py-0.5 text-right font-mono text-[10px] font-bold text-vow-accent focus:outline-none"
              title="Type exact Y position"
            />
          </div>

          <div className="h-3.5 w-px bg-stone-200" />

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
              className="w-16 accent-vow-dark cursor-pointer h-1.5 bg-stone-200 rounded-lg"
              title="Adjust scale percentage"
            />
            <span className="font-mono text-[10px] font-bold text-vow-accent min-w-[28px] text-right">
              {photoboothScale}%
            </span>
          </div>

          {/* Quick Reset Transform */}
          {(photoboothOffsetX !== 0 || photoboothOffsetY !== 0 || photoboothScale !== 100 || photoboothFlipH || photoboothFlipV) && (
            <>
              <div className="h-3.5 w-px bg-stone-200" />
              <button
                type="button"
                onClick={() => {
                  setPhotoboothOffsetX(0);
                  setPhotoboothOffsetY(0);
                  setPhotoboothScale(100);
                  setPhotoboothFlipH(false);
                  setPhotoboothFlipV(false);
                }}
                className="text-[10px] font-mono font-bold text-stone-400 hover:text-stone-700 uppercase flex items-center gap-1 cursor-pointer"
                title="Reset X, Y, scale, and flips to default"
              >
                <RotateCcw className="w-2.5 h-2.5" />
                <span>Reset</span>
              </button>
            </>
          )}
        </div>

      {/* Visual Canvas Container */}
      <div
        className={`relative rounded transition-all duration-200 overflow-hidden ${bgClass}`}
        style={{
          width: `${widthPx}px`,
          height: `${heightPx}px`,
          transform: `scale(${zoomLevel / 100})`,
          transformOrigin: "top center",
          flexShrink: 0,
        }}
      >
        {/* ======================================================== */}
        {/* LAYER 1 (BOTTOM): BACKGROUND & PATTERN LAYER WITH OPACITY */}
        {/* ======================================================== */}
        {backgroundPatternAssetUrl && layer1Visible && (
          <div
            className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-300"
            style={{ opacity: backgroundLayerOpacity / 100 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={backgroundPatternAssetUrl}
              alt="Layer 1 Background & Pattern"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* ======================================================== */}
        {/* PHOTOBOOTH STRIP & FRAME OVERLAY (2x6, 4x6, 6x4 Formats) */}
        {/* ======================================================== */}
        {isNonSquare && photoboothMode && activeFrameOverlayUrl && (
          <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeFrameOverlayUrl}
              alt="Photobooth Frame Overlay"
              className="absolute inset-0 w-full h-full object-fill z-10"
              style={is2x6Format ? undefined : {
                transform: `${photoboothFlipH ? "scaleX(-1)" : ""} ${photoboothFlipV ? "scaleY(-1)" : ""}`.trim() || undefined,
              }}
            />
          </div>
        )}

        {/* LAYER 2 (TOP): TEXT & MONOGRAM LOGO LAYER WITH BLEND MODES & OPACITY */}
        {layer2Visible && (
          <div
            className="absolute z-20 flex items-center justify-center transition-all inset-0 p-6 w-full h-full"
            style={{
              transform:
                photoboothOffsetX !== 0 || photoboothOffsetY !== 0 || photoboothScale !== 100
                  ? `translate(${photoboothOffsetX}px, ${photoboothOffsetY}px) scale(${photoboothScale / 100})`
                  : undefined,
              mixBlendMode: textLayerBlendMode,
              opacity: textLayerOpacity / 100,
            }}
          >
            {activeLogoAsset && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={activeLogoAsset}
                alt="Layer 2 AI Text & Monogram Logo Artwork"
                className="w-full h-full object-contain filter contrast-125 transition-opacity duration-300 pointer-events-none z-10"
              />
            )}

            {(!activeLogoAsset || hidePrimarySecondary || dateText || hashtagText) && (
              <>
                {ornamentUrl && !activeLogoAsset && (
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
                  className="absolute inset-0 flex items-center justify-center pointer-events-auto w-full h-full z-20"
                  dangerouslySetInnerHTML={{ __html: renderedVectorSvg }}
                />
              </>
            )}
          </div>
        )}

        {/* Safe Area Guide */}
        <div className="absolute inset-3 border border-dashed border-stone-300/40 pointer-events-none z-30" />
      </div>
    </div>
  );
}
