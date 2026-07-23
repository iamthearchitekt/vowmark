import sharp from "sharp";

export interface ImageProcessingOptions {
  cleanBackground?: boolean;
  nearWhiteThreshold?: number; // 0 to 255, default 240
  makeTransparent?: boolean;
  pureBlackAndWhite?: boolean;
  bwThreshold?: number; // 0 to 255, default 128
  invertColors?: boolean;
  width?: number;
  height?: number;
}

export class ImageProcessor {
  /**
   * Process a buffer (PNG/JPEG/SVG) and return clean, 100% Photoshop-compliant PNG output buffer
   */
  static async processImage(
    inputBuffer: Buffer,
    options: ImageProcessingOptions = {}
  ): Promise<{ processedBuffer: Buffer; width: number; height: number }> {
    // Sanitize SVG input to strip @import url(...) stylesheets that cause librsvg hangs in Sharp
    let sanitizedBuffer = inputBuffer;
    const strContent = inputBuffer.toString("utf-8").trim();
    if (strContent.includes("<svg")) {
      const cleanSvg = strContent.replace(/@import\s+url\([^)]+\);?/gi, "");
      sanitizedBuffer = Buffer.from(cleanSvg, "utf-8");
    }

    let pipeline = sharp(sanitizedBuffer, { density: 300 });

    const metadata = await pipeline.metadata().catch(() => ({ width: 2048, height: 2048 }));
    const currentWidth = options.width || metadata.width || 2048;
    const currentHeight = options.height || metadata.height || 2048;

    // Resize pipeline if dimensions specified
    if (options.width || options.height) {
      pipeline = pipeline.resize(currentWidth, currentHeight, {
        fit: "contain",
        background: options.makeTransparent
          ? { r: 0, g: 0, b: 0, alpha: 0 }
          : { r: 255, g: 255, b: 255, alpha: 1 },
      });
    }

    if (options.pureBlackAndWhite) {
      const thresholdVal = options.bwThreshold || 180;
      pipeline = pipeline.threshold(thresholdVal);
    }

    if (options.invertColors) {
      pipeline = pipeline.negate({ alpha: false });
    }

    // Transparent Background White Keying for Raster Images
    if (options.makeTransparent) {
      const isSvg = strContent.includes("<svg");
      if (!isSvg) {
        // Extract raw RGBA pixels from pipeline
        const { data, info } = await pipeline
          .ensureAlpha()
          .raw()
          .toBuffer({ resolveWithObject: true });

        const threshold = options.nearWhiteThreshold || 238;
        const pixelData = new Uint8Array(data);

        // Loop over RGBA pixels and convert near-white pixels to transparent alpha (0)
        for (let i = 0; i < pixelData.length; i += 4) {
          const r = pixelData[i];
          const g = pixelData[i + 1];
          const b = pixelData[i + 2];
          if (r >= threshold && g >= threshold && b >= threshold) {
            pixelData[i + 3] = 0; // Alpha transparent
          }
        }

        pipeline = sharp(Buffer.from(pixelData.buffer), {
          raw: {
            width: info.width,
            height: info.height,
            channels: 4,
          },
        });
      }
    }

    // Force sRGB color space & output standard unindexed 32-bit RGBA PNG
    const { data, info } = await pipeline
      .toColorspace("srgb")
      .png({
        compressionLevel: 6,
        palette: false, // Prevents indexed palette hangs in Adobe Photoshop/Illustrator
        effort: 6,
        adaptiveFiltering: true,
      })
      .toBuffer({ resolveWithObject: true });

    return {
      processedBuffer: data,
      width: info.width,
      height: info.height,
    };
  }

  /**
   * Generate a small square thumbnail buffer
   */
  static async generateThumbnail(inputBuffer: Buffer, size: number = 256): Promise<Buffer> {
    let sanitizedBuffer = inputBuffer;
    const strContent = inputBuffer.toString("utf-8").trim();
    if (strContent.includes("<svg")) {
      const cleanSvg = strContent.replace(/@import\s+url\([^)]+\);?/gi, "");
      sanitizedBuffer = Buffer.from(cleanSvg, "utf-8");
    }

    return sharp(sanitizedBuffer, { density: 150 })
      .resize(size, size, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .toColorspace("srgb")
      .png({ compressionLevel: 6 })
      .toBuffer();
  }
}
