/**
 * Client-Side Canvas Compositing Exporter
 *
 * Exports PNG and SVG entirely in the browser using the Canvas 2D API.
 * No server round-trip, no Sharp, no encoding bugs.
 *
 * Layers drawn in order:
 *   1. White background fill (for non-transparent exports)
 *   2. Layer 1 — background pattern image (with opacity)
 *   3. Photobooth frame overlay (with optional H/V flips)
 *   4. Layer 2 — text/logo image OR vector SVG (with blend mode + opacity)
 */

export interface ExportLayer1 {
  assetUrl: string;
  opacity: number; // 0–100
}

export interface ExportFrameOverlay {
  assetUrl: string;
  flipH: boolean;
  flipV: boolean;
}

export interface ExportLayer2Image {
  type: "image";
  assetUrl: string;
  opacity: number; // 0–100
  blendMode: string;
}

export interface ExportLayer2Svg {
  type: "svg";
  svgString: string;
  opacity: number; // 0–100
  blendMode: string;
}

export interface ExportCompositeOptions {
  /** Output canvas width in pixels (print resolution) */
  width: number;
  /** Output canvas height in pixels (print resolution) */
  height: number;
  /** If true, do not fill white background (transparent PNG) */
  makeTransparent: boolean;
  layer1?: ExportLayer1 | null;
  frameOverlay?: ExportFrameOverlay | null;
  layer2?: ExportLayer2Image | ExportLayer2Svg | null;
}

// ─── Print-resolution dimensions per format (300 DPI) ────────────────────────
export const PRINT_DIMS: Record<string, { width: number; height: number }> = {
  "2_x_6": { width: 600, height: 1800 },
  "4_x_6": { width: 1200, height: 1800 },
  "6_x_4": { width: 1800, height: 1200 },
  square:  { width: 1800, height: 1800 },
};

// ─── Image Loading ────────────────────────────────────────────────────────────

/**
 * Load any image src (data:, blob:, /, http:) into an HTMLImageElement.
 * For external http URLs we fetch as a blob first to avoid CORS issues.
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(new Error(`Failed to load image: ${src.slice(0, 80)} — ${e}`));

    if (
      src.startsWith("data:") ||
      src.startsWith("blob:") ||
      src.startsWith("/")
    ) {
      // Local or inline — load directly
      img.src = src;
    } else {
      // External URL — proxy through fetch to avoid CORS
      fetch(src)
        .then((r) => {
          if (!r.ok) throw new Error(`HTTP ${r.status} fetching image`);
          return r.blob();
        })
        .then((blob) => {
          const objUrl = URL.createObjectURL(blob);
          img.onload = () => {
            URL.revokeObjectURL(objUrl);
            resolve(img);
          };
          img.src = objUrl;
        })
        .catch(reject);
    }
  });
}

/**
 * Convert an SVG string into a loaded HTMLImageElement via Blob URL.
 * Note: when rendered as an <img>, SVGs cannot load external resources
 * (Google Fonts), so text will fall back to the declared fallback stack.
 * This is acceptable — users should use SVG format for vector/font-perfect output.
 */
async function svgStringToImage(svgString: string): Promise<HTMLImageElement> {
  // Remove @import url(...) to avoid browser security warnings
  const cleanSvg = svgString.replace(/@import\s+url\([^)]+\);?/gi, "");
  const blob = new Blob([cleanSvg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  try {
    return await loadImage(url);
  } finally {
    // Delay revoke so the img element has time to fully decode
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }
}

// ─── Blend Mode Mapping ───────────────────────────────────────────────────────

const CSS_TO_CANVAS_BLEND: Record<string, GlobalCompositeOperation> = {
  normal:       "source-over",
  multiply:     "multiply",
  screen:       "screen",
  overlay:      "overlay",
  darken:       "darken",
  lighten:      "lighten",
  "color-dodge": "color-dodge",
  "color-burn":  "color-burn",
  "hard-light":  "hard-light",
  "soft-light":  "soft-light",
  difference:   "difference",
  exclusion:    "exclusion",
  hue:          "hue",
  saturation:   "saturation",
  color:        "color",
  luminosity:   "luminosity",
};

function toCanvasBlend(cssMode: string): GlobalCompositeOperation {
  return CSS_TO_CANVAS_BLEND[cssMode] ?? "source-over";
}

// ─── Core Compositing ─────────────────────────────────────────────────────────

/**
 * Composite all layers onto an offscreen canvas and return a Blob.
 */
export async function compositeToBlob(
  opts: ExportCompositeOptions,
  mimeType: "image/png" | "image/jpeg" = "image/png",
  quality = 0.95
): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = opts.width;
  canvas.height = opts.height;
  const ctx = canvas.getContext("2d", { colorSpace: "srgb" });
  if (!ctx) throw new Error("Canvas 2D context unavailable");

  // ── Background fill ──────────────────────────────────────────────────────────
  if (!opts.makeTransparent) {
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, opts.width, opts.height);
  }

  // ── Layer 1: Background pattern ──────────────────────────────────────────────
  if (opts.layer1?.assetUrl) {
    try {
      const img = await loadImage(opts.layer1.assetUrl);
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, opts.layer1.opacity / 100));
      ctx.globalCompositeOperation = "source-over";
      ctx.drawImage(img, 0, 0, opts.width, opts.height);
      ctx.restore();
    } catch (e) {
      console.warn("[Exporter] Layer 1 failed:", e);
    }
  }

  // ── Frame overlay ────────────────────────────────────────────────────────────
  if (opts.frameOverlay?.assetUrl) {
    try {
      const img = await loadImage(opts.frameOverlay.assetUrl);
      ctx.save();
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";

      const { flipH, flipV } = opts.frameOverlay;
      if (flipH || flipV) {
        ctx.translate(flipH ? opts.width : 0, flipV ? opts.height : 0);
        ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
      }
      // Draw at full canvas size (frame image is designed to match canvas aspect ratio)
      ctx.drawImage(img, 0, 0, opts.width, opts.height);
      ctx.restore();
    } catch (e) {
      console.warn("[Exporter] Frame overlay failed:", e);
    }
  }

  // ── Layer 2: Text / logo / SVG ───────────────────────────────────────────────
  if (opts.layer2) {
    try {
      const layer = opts.layer2;
      let img: HTMLImageElement;

      if (layer.type === "svg") {
        img = await svgStringToImage(layer.svgString);
      } else {
        img = await loadImage(layer.assetUrl);
      }

      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, layer.opacity / 100));
      ctx.globalCompositeOperation = toCanvasBlend(layer.blendMode);
      ctx.drawImage(img, 0, 0, opts.width, opts.height);
      ctx.restore();
    } catch (e) {
      console.warn("[Exporter] Layer 2 failed:", e);
    }
  }

  // ── Serialise ────────────────────────────────────────────────────────────────
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("canvas.toBlob() returned null — canvas may be tainted by cross-origin images"));
      },
      mimeType,
      quality
    );
  });
}

// ─── Download Helpers ─────────────────────────────────────────────────────────

/** Trigger a browser file-save dialog for a Blob */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Delay revoke so browser has time to start the download
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

/** Directly download an SVG string as a .svg file */
export function downloadSVG(svgString: string, filename: string): void {
  const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  downloadBlob(blob, filename);
}
