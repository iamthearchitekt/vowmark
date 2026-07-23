import { NextRequest, NextResponse } from "next/server";
import { openAIImageProvider } from "@/lib/ai/dalle-provider";

export const runtime = "nodejs";
export const maxDuration = 120;

interface GenerateImageBody {
  prompt?: string;
  size?: "1024x1024" | "1536x1024" | "1024x1536";
  quality?: "low" | "medium" | "high";
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as GenerateImageBody;
    const prompt = body.prompt?.trim();

    if (!prompt) {
      return NextResponse.json(
        { error: "A generation prompt is required." },
        { status: 400 }
      );
    }

    if (prompt.length > 12000) {
      return NextResponse.json(
        { error: "The prompt exceeds the maximum allowed length of 12,000 characters." },
        { status: 400 }
      );
    }

    const result = await openAIImageProvider.generateImage({
      prompt,
      size: body.size || "1536x1024",
      quality: body.quality || "medium",
    });

    return NextResponse.json({
      image: result.imageUrl,
      revisedPrompt: result.revisedPrompt ?? null,
      provider: result.provider,
      model: result.model,
    });
  } catch (error: any) {
    console.error("OpenAI Image Generation Error:", error);
    const message = error instanceof Error ? error.message : "Image generation failed.";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
