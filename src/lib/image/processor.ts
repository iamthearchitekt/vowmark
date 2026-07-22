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

    if (options.width || options.height) {
      pipeline = pipeline.resize(options.width || currentWidth, options.height || currentHeight, {
        fit: "contain",
        background: { r: 255, g: 255, b: 255, alpha: options.makeTransparent ? 0 : 1 },
      });
    }

    if (options.pureBlackAndWhite) {
      const thresholdVal = options.bwThreshold || 180;
      pipeline = pipeline.threshold(thresholdVal);
    }

    if (options.invertColors) {
      pipeline = pipeline.negate({ alpha: false });
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
