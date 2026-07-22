import { NextRequest, NextResponse } from "next/server";
import { TypographyEngine } from "@/lib/typography/engine";
import { ImageProcessor } from "@/lib/image/processor";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { format, typographyOptions, isTransparent, pureBlackAndWhite } = body;

    // 1. Generate clean SVG vector typography
    const svgResult = TypographyEngine.renderSvg(typographyOptions);

    if (format === "svg") {
      return new NextResponse(svgResult.svg, {
        headers: {
          "Content-Type": "image/svg+xml",
          "Content-Disposition": `attachment; filename="vowmark-vector-asset.svg"`,
        },
      });
    }

    // 2. Convert to PNG/JPEG via Sharp Image Processor
    const svgBuffer = Buffer.from(svgResult.svg);
    const processed = await ImageProcessor.processImage(svgBuffer, {
      makeTransparent: isTransparent || format === "transparent_png",
      pureBlackAndWhite,
      width: 2048,
      height: 2048,
    });

    const mimeType = format === "jpeg" ? "image/jpeg" : "image/png";
    const ext = format === "jpeg" ? "jpg" : "png";

    return new NextResponse(new Uint8Array(processed.processedBuffer), {
      headers: {
        "Content-Type": mimeType,
        "Content-Disposition": `attachment; filename="vowmark-wedding-asset.${ext}"`,
      },
    });
  } catch (err) {
    console.error("API /exports error:", err);
    return NextResponse.json({ error: "Asset export failed" }, { status: 500 });
  }
}
