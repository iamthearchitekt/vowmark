import { NextRequest, NextResponse } from "next/server";
import { openAIImageProvider } from "@/lib/ai/dalle-provider";
import { compileGenerationPrompt } from "@/lib/ai/prompt-compiler";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { brief, action } = body;

    if (!brief) {
      return NextResponse.json({ error: "Missing design brief" }, { status: 400 });
    }

    const compiled = compileGenerationPrompt(brief, {
      generationType: brief.generationType,
      guidanceConfig: brief.guidanceConfig,
    });
    const userPrompt = compiled.prompt;

    // Trigger OpenAI Image Generation with Universal Prompt Aids
    const result = await openAIImageProvider.generateImage({
      prompt: userPrompt,
      quality: "medium",
      size: "1536x1024",
    });

    return NextResponse.json({
      compiledPrompt: compiled.prompt,
      negativePrompt: compiled.negativePrompt,
      result,
    });
  } catch (err: any) {
    console.error("API /ai/generate error:", err);
    return NextResponse.json({ error: err?.message || "Image generation failed" }, { status: 500 });
  }
}
