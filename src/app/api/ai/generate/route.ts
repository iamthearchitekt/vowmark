import { NextRequest, NextResponse } from "next/server";
import { openAIImageProvider } from "@/lib/ai/dalle-provider";
import { compileGenerationPrompt } from "@/lib/ai/prompt-compiler";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { brief } = body;

    if (!brief) {
      return NextResponse.json({ error: "Missing design brief" }, { status: 400 });
    }

    const compiled = compileGenerationPrompt(brief, {
      generationType: brief.generationType,
      guidanceConfig: brief.guidanceConfig,
      canvasFormat: brief.canvasFormat || body.canvasFormat,
    });
    const userPrompt = compiled.prompt;

    // Trigger OpenAI Image Generation with Aspect Ratio Size Matching
    const result = await openAIImageProvider.generateImage({
      prompt: userPrompt,
      quality: "medium",
      size: compiled.recommendedSize || "1024x1024",
    });

    return NextResponse.json({
      compiledPrompt: compiled.prompt,
      negativePrompt: compiled.negativePrompt,
      recommendedSize: compiled.recommendedSize,
      aspectRatioInstruction: compiled.aspectRatioInstruction,
      result,
    });
  } catch (err: any) {
    console.error("API /ai/generate error:", err);
    return NextResponse.json({ error: err?.message || "Image generation failed" }, { status: 500 });
  }
}
