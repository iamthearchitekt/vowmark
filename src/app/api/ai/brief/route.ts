import { NextRequest, NextResponse } from "next/server";
import { openAIProvider } from "@/lib/ai/openai-provider";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, style, assetType } = body;

    const brief = await openAIProvider.generateStructuredBrief(
      prompt || "Bespoke couple logo",
      style || "editorial_luxury",
      assetType || "couple_logo"
    );

    return NextResponse.json(brief);
  } catch (err) {
    console.error("API /ai/brief error:", err);
    return NextResponse.json({ error: "Failed to generate design brief" }, { status: 500 });
  }
}
