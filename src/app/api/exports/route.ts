import { NextRequest, NextResponse } from "next/server";
import { TypographyEngine } from "@/lib/typography/engine";
import { ImageProcessor } from "@/lib/image/processor";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      format,
      studioMode,
      canvasFormat,
      aiGeneratedAssetUrl,
      typographyOptions,
      isTransparent,
      pureBlackAndWhite,
    } = body;

    const shouldBeTransparent = format === "transparent_png" || isTransparent === true;

    let inputBuffer: Buffer;

    if (studioMode === "generative_ai" && aiGeneratedAssetUrl) {
      try {
        if (aiGeneratedAssetUrl.startsWith("http://") || aiGeneratedAssetUrl.startsWith("https://")) {
          const fetchRes = await fetch(aiGeneratedAssetUrl);
          const arrayBuf = await fetchRes.arrayBuffer();
          inputBuffer = Buffer.from(arrayBuf);
        } else if (aiGeneratedAssetUrl.startsWith("data:")) {
          const base64Data = aiGeneratedAssetUrl.split(",")[1];
          inputBuffer = Buffer.from(base64Data, "base64");
        } else {
          // Local public path (e.g. /samples/generated-wedding-logo.svg)
          const cleanPath = aiGeneratedAssetUrl.replace(/^\//, "");
          const localPath = path.join(process.cwd(), "public", cleanPath);
          if (fs.existsSync(localPath)) {
            inputBuffer = fs.readFileSync(localPath);
          } else {
            // Fallback to clean SVG render
            const svgResult = TypographyEngine.renderSvg({
              ...typographyOptions,
              isTransparent: shouldBeTransparent,
            });
            inputBuffer = Buffer.from(svgResult.svg);
          }
        }
      } catch (err) {
        console.warn("Failed to fetch AI generated asset buffer, falling back to SVG render:", err);
        const svgResult = TypographyEngine.renderSvg({
          ...typographyOptions,
          isTransparent: shouldBeTransparent,
        });
        inputBuffer = Buffer.from(svgResult.svg);
      }
    } else {
      // Vector Mode SVG with transparency option
      const svgResult = TypographyEngine.renderSvg({
        ...typographyOptions,
        isTransparent: shouldBeTransparent,
      });
      inputBuffer = Buffer.from(svgResult.svg);
    }

    if (format === "svg") {
      const isSvg = inputBuffer.toString("utf-8").trim().includes("<svg");
      const svgContent = isSvg
        ? inputBuffer.toString("utf-8")
        : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><image href="${aiGeneratedAssetUrl}" width="1024" height="1024"/></svg>`;

      return new NextResponse(svgContent, {
        headers: {
          "Content-Type": "image/svg+xml; charset=utf-8",
          "Content-Disposition": `attachment; filename="vowmark-wedding-asset.svg"`,
        },
      });
    }

    // Convert via Sharp ImageProcessor to guaranteed 100% Photoshop-compliant sRGB 32-bit RGBA PNG
    const processed = await ImageProcessor.processImage(inputBuffer, {
      makeTransparent: shouldBeTransparent,
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
        "Content-Length": processed.processedBuffer.length.toString(),
      },
    });
  } catch (err: any) {
    console.error("API /exports error:", err);
    return NextResponse.json({ error: err?.message || "Asset export failed" }, { status: 500 });
  }
}
