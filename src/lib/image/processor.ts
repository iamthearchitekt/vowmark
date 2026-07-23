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
   * Process a buffer (PNG/JPEG) or SVG string and return cleaned PNG output buffer
   */
  static async processImage(
    inputBuffer: Buffer,
    options: ImageProcessingOptions = {}
  ): Promise<{ processedBuffer: Buffer; width: number; height: number }> {
    let pipeline = sharp(inputBuffer);

    const metadata = await pipeline.metadata();
    const currentWidth = metadata.width || 1024;
    const currentHeight = metadata.height || 1024;

    // If transparent PNG requested, ensure resize uses transparent background fill
    if (options.width || options.height) {
      pipeline = pipeline.resize(options.width || currentWidth, options.height || currentHeight, {
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
      const isSvg = inputBuffer.toString("utf-8").trim().startsWith("<svg");
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

    const { data, info } = await pipeline
      .png({ compressionLevel: 9, quality: 100 })
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
    return sharp(inputBuffer)
      .resize(size, size, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .png()
      .toBuffer();
  }
}
