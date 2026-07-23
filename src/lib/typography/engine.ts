import { resolveFontConfig } from "./font-resolver";

export interface TypographyOptions {
  primaryText: string;
  secondaryText?: string;
  ampersandText?: string;
  dateText?: string;
  dateFontFamily?: string;
  dateFontSize?: number;
  dateLetterSpacing?: number;
  hashtagText?: string;
  hashtagFontFamily?: string;
  hashtagFontSize?: number;
  hashtagLetterSpacing?: number;
  locationText?: string;
  fontFamily: string;
  fontSize: number; // e.g. 150
  primaryFontSize?: number;
  secondaryFontSize?: number;
  fontWeight?: number | string;
  isItalic?: boolean;
  textTransform?: "uppercase" | "lowercase" | "titlecase" | "none";
  letterSpacing?: number; // in px or em
  lineHeight?: number; // relative e.g. 1.2
  nameGap?: number; // Gap between partner names in stacked mode (in px)
  layout: "stacked" | "horizontal" | "interlocking" | "crest";
  ampersandScale?: number; // relative, e.g. 0.6
  ampersandOffsetY?: number; // in px
  initialOverlap?: number; // in px for monogram
  colorMode: "black_on_white" | "white_on_black" | "champagne_on_paper" | "custom";
  textColor?: string;
  backgroundColor?: string;
  isTransparent?: boolean;
  canvasWidth?: number;
  canvasHeight?: number;
}

export interface RenderedSvgOutput {
  svg: string;
  width: number;
  height: number;
  viewBox: string;
  isVector: true;
}

export class TypographyEngine {
  static renderSvg(options: TypographyOptions): RenderedSvgOutput {
    const width = options.canvasWidth || 1200;
    const height = options.canvasHeight || 1200;
    const centerX = width / 2;

    // 2x6 Photo Strip (600x1800): text naturally anchors in bottom 18% footer badge
    const is2x6 = width === 600 && height === 1800;
    const centerY = is2x6 ? height * 0.85 : height / 2;

    // Proportional width scale factor relative to standard 1200px reference canvas
    const scaleFactor = Math.min(width / 1200, is2x6 ? 0.75 : 1.5);

    let fill = options.textColor || "#000000";
    let bgFill = "transparent"; // Default to transparent so no giant white rect box is drawn

    if (options.colorMode === "black_on_white") {
      fill = "#000000";
    } else if (options.colorMode === "white_on_black") {
      fill = "#FFFFFF";
    } else if (options.colorMode === "champagne_on_paper") {
      fill = "#C9A251";
    }

    // Only draw solid background rect if explicitly requested and isTransparent is false
    if (options.isTransparent === false && options.backgroundColor) {
      bgFill = options.backgroundColor;
    }

    const transformText = (txt: string) => {
      if (!txt) return "";
      if (options.textTransform === "uppercase") return txt.toUpperCase();
      if (options.textTransform === "lowercase") return txt.toLowerCase();
      if (options.textTransform === "titlecase")
        return txt.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.substring(1).toLowerCase());
      return txt;
    };

    // Clean placeholders if fields are empty
    const rawPrimary = options.primaryText ? options.primaryText.trim() : "";
    const rawSecondary = options.secondaryText ? options.secondaryText.trim() : "";

    const pText = transformText(rawPrimary || "INPUT 1");
    const sText = transformText(rawSecondary || "INPUT 2");
    const isPlaceholder = !rawPrimary && !rawSecondary;
    const textOpacity = isPlaceholder ? 0.35 : 1;

    const ampText = options.ampersandText !== undefined ? options.ampersandText : "&";
    const dateStr = transformText(options.dateText || "");
    const font = options.fontFamily || "Cormorant Garamond";
    const dateFont = options.dateFontFamily || font;
    const hashtagFont = options.hashtagFontFamily || font;
    const hashtagStr = transformText(options.hashtagText || "");

    const defaultSize = Math.round((options.fontSize || 150) * scaleFactor);
    const pFontSize = options.primaryFontSize !== undefined ? Math.round(options.primaryFontSize * scaleFactor) : defaultSize;
    const sFontSize = options.secondaryFontSize !== undefined ? Math.round(options.secondaryFontSize * scaleFactor) : pFontSize;
    const dFontSize = options.dateFontSize !== undefined ? Math.round(options.dateFontSize * scaleFactor) : Math.round(pFontSize * 0.28);
    const hFontSize = options.hashtagFontSize !== undefined ? Math.round(options.hashtagFontSize * scaleFactor) : Math.round(pFontSize * 0.24);

    const dLetterSpacing = Math.round((options.dateLetterSpacing !== undefined ? options.dateLetterSpacing : 4) * scaleFactor);
    const hLetterSpacing = Math.round((options.hashtagLetterSpacing !== undefined ? options.hashtagLetterSpacing : 4) * scaleFactor);
    const letterSpacing = Math.round((options.letterSpacing || 6) * scaleFactor);
    const ampScale = options.ampersandScale || 0.6;
    const ampFontSize = Math.round(pFontSize * ampScale);
    const isItalic = options.isItalic ? "italic" : "normal";
    const fontWeight = options.fontWeight || 400;

    const mainFontConfig = resolveFontConfig(font);
    const dateFontConfig = resolveFontConfig(dateFont);
    const hashtagFontConfig = resolveFontConfig(hashtagFont);

    // Collect all web font URLs to embed into SVG <defs><style>
    const fontUrls = Array.from(
      new Set(
        [mainFontConfig.googleFontUrl, dateFontConfig.googleFontUrl, hashtagFontConfig.googleFontUrl].filter(
          Boolean
        ) as string[]
      )
    );

    const fontImportTag = fontUrls.length > 0
      ? `<defs>\n    <style type="text/css"><![CDATA[\n      ${fontUrls.map((u) => `@import url('${u}');`).join("\n      ")}\n    ]]></style>\n  </defs>`
      : "";

    let elementsSvg = "";

    if (options.layout === "stacked") {
      const defaultGap = pFontSize * (options.lineHeight || 1.15) * 0.7;
      const gapY = options.nameGap !== undefined ? options.nameGap : defaultGap;
      const topY = centerY - gapY;
      const ampY = centerY + 8 + (options.ampersandOffsetY || 0);
      const botY = centerY + gapY;

      const ampTag = ampText
        ? `<text x="${centerX}" y="${ampY}" font-family="${mainFontConfig.cssFontFamily}" font-size="${ampFontSize}" font-weight="${fontWeight}" font-style="${isItalic}" fill="${fill}" opacity="${textOpacity}" text-anchor="middle" dominant-baseline="middle">${escapeXml(ampText)}</text>`
        : "";

      elementsSvg = `
        <text x="${centerX}" y="${topY}" font-family="${mainFontConfig.cssFontFamily}" font-size="${pFontSize}" font-weight="${fontWeight}" font-style="${isItalic}" letter-spacing="${letterSpacing}" fill="${fill}" opacity="${textOpacity}" text-anchor="middle" dominant-baseline="middle">${escapeXml(pText)}</text>
        ${ampTag}
        <text x="${centerX}" y="${botY}" font-family="${mainFontConfig.cssFontFamily}" font-size="${sFontSize}" font-weight="${fontWeight}" font-style="${isItalic}" letter-spacing="${letterSpacing}" fill="${fill}" opacity="${textOpacity}" text-anchor="middle" dominant-baseline="middle">${escapeXml(sText)}</text>
      `;

      if (dateStr) {
        const dateY = botY + sFontSize * 0.9;
        elementsSvg += `
          <text x="${centerX}" y="${dateY}" font-family="${dateFontConfig.cssFontFamily}" font-size="${dFontSize}" font-weight="400" letter-spacing="${dLetterSpacing}" fill="${fill}" text-anchor="middle" opacity="0.85">${escapeXml(dateStr)}</text>
        `;
      }

      if (hashtagStr) {
        const hashtagY = botY + sFontSize * (dateStr ? 1.35 : 0.9);
        elementsSvg += `
          <text x="${centerX}" y="${hashtagY}" font-family="${hashtagFontConfig.cssFontFamily}" font-size="${hFontSize}" font-weight="400" letter-spacing="${hLetterSpacing}" fill="${fill}" text-anchor="middle" opacity="0.8">${escapeXml(hashtagStr)}</text>
        `;
      }
    } else if (options.layout === "horizontal") {
      if (ampText) {
        elementsSvg = `
          <text x="${centerX}" y="${centerY}" font-family="${mainFontConfig.cssFontFamily}" font-weight="${fontWeight}" font-style="${isItalic}" letter-spacing="${letterSpacing}" fill="${fill}" opacity="${textOpacity}" text-anchor="middle" dominant-baseline="middle">
            <tspan font-size="${pFontSize}">${escapeXml(pText)}</tspan>
            <tspan font-size="${ampFontSize}">  ${escapeXml(ampText)}  </tspan>
            <tspan font-size="${sFontSize}">${escapeXml(sText)}</tspan>
          </text>
        `;
      } else {
        const horizontalText = `${pText}   ${sText}`;
        elementsSvg = `
          <text x="${centerX}" y="${centerY}" font-family="${mainFontConfig.cssFontFamily}" font-size="${pFontSize}" font-weight="${fontWeight}" font-style="${isItalic}" letter-spacing="${letterSpacing}" fill="${fill}" opacity="${textOpacity}" text-anchor="middle" dominant-baseline="middle">${escapeXml(horizontalText)}</text>
        `;
      }

      if (dateStr) {
        elementsSvg += `
          <text x="${centerX}" y="${centerY + pFontSize * 0.8}" font-family="${dateFontConfig.cssFontFamily}" font-size="${dFontSize}" letter-spacing="${dLetterSpacing}" fill="${fill}" text-anchor="middle" opacity="0.85">${escapeXml(dateStr)}</text>
        `;
      }
      if (hashtagStr) {
        const hashtagY = centerY + pFontSize * (dateStr ? 1.25 : 0.8);
        elementsSvg += `
          <text x="${centerX}" y="${hashtagY}" font-family="${hashtagFontConfig.cssFontFamily}" font-size="${hFontSize}" letter-spacing="${hLetterSpacing}" fill="${fill}" text-anchor="middle" opacity="0.8">${escapeXml(hashtagStr)}</text>
        `;
      }
    } else if (options.layout === "interlocking") {
      const init1 = rawPrimary ? pText.charAt(0) : "P1";
      const init2 = rawSecondary ? sText.charAt(0) : "P2";
      const monoSize = pFontSize * 2.2;
      const offset = options.initialOverlap || 45;
      const interlockingAmpSize = monoSize * 0.66 * ampScale;

      const ampTag = ampText
        ? `<text x="${centerX}" y="${centerY + 15}" font-family="${mainFontConfig.cssFontFamily}" font-size="${interlockingAmpSize}" font-weight="300" font-style="italic" fill="${fill}" opacity="${textOpacity}" text-anchor="middle" dominant-baseline="middle">${escapeXml(ampText)}</text>`
        : "";

      elementsSvg = `
        <text x="${centerX - offset}" y="${centerY + 10}" font-family="${mainFontConfig.cssFontFamily}" font-size="${monoSize}" font-weight="${fontWeight}" font-style="${isItalic}" fill="${fill}" opacity="${textOpacity}" text-anchor="middle" dominant-baseline="middle">${escapeXml(init1)}</text>
        <text x="${centerX + offset}" y="${centerY + 10}" font-family="${mainFontConfig.cssFontFamily}" font-size="${monoSize}" font-weight="${fontWeight}" font-style="${isItalic}" fill="${fill}" opacity="${textOpacity}" text-anchor="middle" dominant-baseline="middle">${escapeXml(init2)}</text>
        ${ampTag}
      `;

      elementsSvg = `
        <text x="${centerX - offset}" y="${centerY + 10}" font-family="${mainFontConfig.cssFontFamily}" font-size="${monoSize}" font-weight="${fontWeight}" font-style="${isItalic}" fill="${fill}" opacity="${textOpacity}" text-anchor="middle" dominant-baseline="middle">${escapeXml(init1)}</text>
        <text x="${centerX + offset}" y="${centerY + 10}" font-family="${mainFontConfig.cssFontFamily}" font-size="${monoSize}" font-weight="${fontWeight}" font-style="${isItalic}" fill="${fill}" opacity="${textOpacity}" text-anchor="middle" dominant-baseline="middle">${escapeXml(init2)}</text>
        ${ampTag}
      `;
      if (dateStr) {
        elementsSvg += `
          <text x="${centerX}" y="${centerY + monoSize * 0.65}" font-family="${dateFontConfig.cssFontFamily}" font-size="${dFontSize}" letter-spacing="${dLetterSpacing}" fill="${fill}" text-anchor="middle" opacity="0.85">${escapeXml(dateStr)}</text>
        `;
      }
      if (hashtagStr) {
        const hashtagY = centerY + monoSize * (dateStr ? 0.82 : 0.65);
        elementsSvg += `
          <text x="${centerX}" y="${hashtagY}" font-family="${hashtagFontConfig.cssFontFamily}" font-size="${hFontSize}" letter-spacing="${hLetterSpacing}" fill="${fill}" text-anchor="middle" opacity="0.8">${escapeXml(hashtagStr)}</text>
        `;
      }
    } else {
      const comboText = ampText ? `${pText} ${ampText} ${sText}` : `${pText} ${sText}`;
      elementsSvg = `
        <text x="${centerX}" y="${centerY}" font-family="${mainFontConfig.cssFontFamily}" font-size="${pFontSize}" font-weight="${fontWeight}" font-style="${isItalic}" letter-spacing="${letterSpacing}" fill="${fill}" opacity="${textOpacity}" text-anchor="middle" dominant-baseline="middle">${escapeXml(comboText)}</text>
      `;
    }

    const bgRect = bgFill !== "transparent" ? `<rect width="${width}" height="${height}" fill="${bgFill}" />` : "";

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  ${fontImportTag}
  ${bgRect}
  <g id="vowmark-typography-layer">
    ${elementsSvg}
  </g>
</svg>`;

    return {
      svg,
      width,
      height,
      viewBox: `0 0 ${width} ${height}`,
      isVector: true,
    };
  }
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
