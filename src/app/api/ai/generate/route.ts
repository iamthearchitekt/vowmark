import { NextRequest, NextResponse } from "next/server";
import { openAIDallEProvider } from "@/lib/ai/dalle-provider";
import { compileGenerationPrompt } from "@/lib/ai/prompt-compiler";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { brief, action } = body;

    if (!brief) {
      return NextResponse.json({ error: "Missing design brief" }, { status: 400 });
    }

    const compiled = compileGenerationPrompt(brief);
    const userPrompt = brief.generationPrompt || compiled.prompt;

    // Trigger OpenAI DALL-E 3 Image Generation
    const result = await openAIDallEProvider.generateImage({
      prompt: userPrompt,
      quality: "standard",
      size: "1024x1024",
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
