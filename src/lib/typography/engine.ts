export interface TypographyOptions {
  primaryText: string;
  secondaryText?: string;
  ampersandText?: string;
  dateText?: string;
  locationText?: string;
  fontFamily: string;
  fontSize: number; // e.g. 72
  fontWeight?: number | string;
  isItalic?: boolean;
  textTransform?: "uppercase" | "lowercase" | "titlecase" | "none";
  letterSpacing?: number; // in px or em
  lineHeight?: number; // relative e.g. 1.2
  layout: "stacked" | "horizontal" | "interlocking" | "circular" | "crest";
  ampersandScale?: number; // relative, e.g. 0.6
  ampersandOffsetY?: number; // in px
  initialOverlap?: number; // in px for monogram
  colorMode: "black_on_white" | "white_on_black" | "champagne_on_paper" | "custom";
  textColor?: string;
  backgroundColor?: string;
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
    const centerY = height / 2;

    let fill = options.textColor || "#0F172A";
    let bgFill = options.backgroundColor || "#FFFFFF";

    if (options.colorMode === "black_on_white") {
      fill = "#0F172A";
      bgFill = "#FFFFFF";
    } else if (options.colorMode === "white_on_black") {
      fill = "#FFFFFF";
      bgFill = "#0F172A";
    } else if (options.colorMode === "champagne_on_paper") {
      fill = "#C9A251";
      bgFill = "#FFFFFF";
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

    const pText = transformText(rawPrimary || "PARTNER 1");
    const sText = transformText(rawSecondary || "PARTNER 2");
    const isPlaceholder = !rawPrimary && !rawSecondary;
    const textOpacity = isPlaceholder ? 0.35 : 1;

    const ampText = options.ampersandText || "&";
    const dateStr = transformText(options.dateText || "");
    const font = options.fontFamily || "Cormorant Garamond";
    const fontSize = options.fontSize || 72;
    const letterSpacing = options.letterSpacing || 6;
    const ampScale = options.ampersandScale || 0.6;
    const ampFontSize = fontSize * ampScale;
    const isItalic = options.isItalic ? "italic" : "normal";
    const fontWeight = options.fontWeight || 400;

    let elementsSvg = "";

    if (options.layout === "stacked") {
      const spacingY = fontSize * (options.lineHeight || 1.15);
      const topY = centerY - spacingY * 0.7;
      const ampY = centerY + 8 + (options.ampersandOffsetY || 0);
      const botY = centerY + spacingY * 0.7;

      elementsSvg = `
        <text x="${centerX}" y="${topY}" font-family="${font}" font-size="${fontSize}" font-weight="${fontWeight}" font-style="${isItalic}" letter-spacing="${letterSpacing}" fill="${fill}" opacity="${textOpacity}" text-anchor="middle" dominant-baseline="middle">${escapeXml(pText)}</text>
        <text x="${centerX}" y="${ampY}" font-family="${font}" font-size="${ampFontSize}" font-weight="300" font-style="italic" fill="${fill}" opacity="${textOpacity}" text-anchor="middle" dominant-baseline="middle">${escapeXml(ampText)}</text>
        <text x="${centerX}" y="${botY}" font-family="${font}" font-size="${fontSize}" font-weight="${fontWeight}" font-style="${isItalic}" letter-spacing="${letterSpacing}" fill="${fill}" opacity="${textOpacity}" text-anchor="middle" dominant-baseline="middle">${escapeXml(sText)}</text>
      `;

      if (dateStr) {
        const dateY = botY + fontSize * 0.9;
        elementsSvg += `
          <line x1="${centerX - 60}" y1="${dateY - 25}" x2="${centerX + 60}" y2="${dateY - 25}" stroke="${fill}" stroke-width="0.75" opacity="0.6" />
          <text x="${centerX}" y="${dateY}" font-family="${font}" font-size="${fontSize * 0.28}" font-weight="400" letter-spacing="4" fill="${fill}" text-anchor="middle" opacity="0.85">${escapeXml(dateStr)}</text>
        `;
      }
    } else if (options.layout === "horizontal") {
      const horizontalText = `${pText}  ${ampText}  ${sText}`;
      elementsSvg = `
        <text x="${centerX}" y="${centerY}" font-family="${font}" font-size="${fontSize}" font-weight="${fontWeight}" font-style="${isItalic}" letter-spacing="${letterSpacing}" fill="${fill}" opacity="${textOpacity}" text-anchor="middle" dominant-baseline="middle">${escapeXml(horizontalText)}</text>
      `;
      if (dateStr) {
        elementsSvg += `
          <text x="${centerX}" y="${centerY + fontSize * 0.8}" font-family="${font}" font-size="${fontSize * 0.3}" letter-spacing="4" fill="${fill}" text-anchor="middle" opacity="0.85">${escapeXml(dateStr)}</text>
        `;
      }
    } else if (options.layout === "interlocking" || options.layout === "circular") {
      const init1 = rawPrimary ? pText.charAt(0) : "P1";
      const init2 = rawSecondary ? sText.charAt(0) : "P2";
      const monoSize = fontSize * 2.2;
      const offset = options.initialOverlap || 45;

      elementsSvg = `
        ${options.layout === "circular" ? `<circle cx="${centerX}" cy="${centerY}" r="${monoSize * 0.85}" fill="none" stroke="${fill}" stroke-width="1.5" opacity="0.85" />` : ""}
        <text x="${centerX - offset}" y="${centerY + 10}" font-family="${font}" font-size="${monoSize}" font-weight="${fontWeight}" font-style="${isItalic}" fill="${fill}" opacity="${textOpacity}" text-anchor="middle" dominant-baseline="middle">${escapeXml(init1)}</text>
        <text x="${centerX + offset}" y="${centerY + 10}" font-family="${font}" font-size="${monoSize}" font-weight="${fontWeight}" font-style="${isItalic}" fill="${fill}" opacity="${textOpacity}" text-anchor="middle" dominant-baseline="middle">${escapeXml(init2)}</text>
        <text x="${centerX}" y="${centerY + 15}" font-family="${font}" font-size="${monoSize * 0.4}" font-weight="300" font-style="italic" fill="${fill}" opacity="${textOpacity}" text-anchor="middle" dominant-baseline="middle">${escapeXml(ampText)}</text>
      `;
    } else {
      elementsSvg = `
        <text x="${centerX}" y="${centerY}" font-family="${font}" font-size="${fontSize}" font-weight="${fontWeight}" font-style="${isItalic}" letter-spacing="${letterSpacing}" fill="${fill}" opacity="${textOpacity}" text-anchor="middle" dominant-baseline="middle">${escapeXml(pText)} &amp; ${escapeXml(sText)}</text>
      `;
    }

    const bgRect = bgFill !== "transparent" ? `<rect width="${width}" height="${height}" fill="${bgFill}" />` : "";

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
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
