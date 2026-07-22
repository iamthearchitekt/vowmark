import { NextRequest, NextResponse } from "next/server";
import { openAIProvider } from "@/lib/ai/openai-provider";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, currentBrief } = body;

    if (!Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages array" }, { status: 400 });
    }

    const response = await openAIProvider.chatAssistant(messages, currentBrief);
    return NextResponse.json(response);
  } catch (err) {
    console.error("API /ai/chat error:", err);
    return NextResponse.json(
      { error: "Failed to process chat request" },
      { status: 500 }
    );
  }
}
