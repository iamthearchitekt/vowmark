export interface ExtractedColor {
  hex: string;
  rgb: [number, number, number];
  population: number;
  label: string;
}

/**
 * Extracts dominant colors from an image file using HTML5 Canvas & color quantization.
 */
export async function extractPaletteFromImage(file: File, colorCount: number = 5): Promise<ExtractedColor[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        try {
          const colors = analyzeImageColors(img, colorCount);
          resolve(colors);
        } catch (err) {
          reject(err);
        }
      };
      img.onerror = () => reject(new Error("Failed to load image for color analysis"));
      img.src = event.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Failed to read image file"));
    reader.readAsDataURL(file);
  });
}

function analyzeImageColors(img: HTMLImageElement, count: number): ExtractedColor[] {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context unavailable");

  // Downsample image for performance
  const maxDim = 150;
  let width = img.width;
  let height = img.height;
  if (width > height) {
    if (width > maxDim) {
      height = Math.round((height * maxDim) / width);
      width = maxDim;
    }
  } else {
    if (height > maxDim) {
      width = Math.round((width * maxDim) / height);
      height = maxDim;
    }
  }

  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(img, 0, 0, width, height);

  const imageData = ctx.getImageData(0, 0, width, height);
  const pixels = imageData.data;

  // Simple bucket quantization (reduce 256^3 colors to 32^3 bins)
  const buckets: { [key: string]: { r: number; g: number; b: number; count: number } } = {};

  for (let i = 0; i < pixels.length; i += 4) {
    const a = pixels[i + 3];
    if (a < 128) continue; // Skip transparent pixels

    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];

    // Quantize to 16-step bins
    const qr = Math.floor(r / 16) * 16;
    const qg = Math.floor(g / 16) * 16;
    const qb = Math.floor(b / 16) * 16;

    const key = `${qr},${qg},${qb}`;
    if (!buckets[key]) {
      buckets[key] = { r: 0, g: 0, b: 0, count: 0 };
    }
    buckets[key].r += r;
    buckets[key].g += g;
    buckets[key].b += b;
    buckets[key].count++;
  }

  // Convert buckets to average colors
  const colorList = Object.values(buckets).map((b) => ({
    r: Math.round(b.r / b.count),
    g: Math.round(b.g / b.count),
    b: Math.round(b.b / b.count),
    count: b.count,
  }));

  // Sort by frequency
  colorList.sort((a, b) => b.count - a.count);

  // Filter out colors that are too visually similar
  const distinctColors: typeof colorList = [];
  for (const c of colorList) {
    const isSimilar = distinctColors.some((existing) => {
      const dr = c.r - existing.r;
      const dg = c.g - existing.g;
      const db = c.b - existing.b;
      return Math.sqrt(dr * dr + dg * dg + db * db) < 45; // Color distance threshold
    });

    if (!isSimilar) {
      distinctColors.push(c);
    }
    if (distinctColors.length >= count) break;
  }

  const roleLabels = ["Dominant Tone", "Secondary Accent", "Highlight Tone", "Subtle Neutral", "Deep Base"];

  return distinctColors.slice(0, count).map((c, index) => {
    const hex = rgbToHex(c.r, c.g, c.b);
    return {
      hex,
      rgb: [c.r, c.g, c.b],
      population: c.count,
      label: roleLabels[index] || `Tone ${index + 1}`,
    };
  });
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => n.toString(16).padStart(2, "0").toUpperCase();
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
