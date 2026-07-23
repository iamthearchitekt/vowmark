import OpenAI from "openai";
import { DesignBrief, DesignBriefSchema } from "./brief-schema";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface AiChatResponse {
  message: string;
  updatedBrief?: Partial<DesignBrief>;
  suggestedActions?: string[];
}

export class OpenAIProvider {
  private client: OpenAI | null = null;
  private model: string;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      this.client = new OpenAI({ apiKey });
    }
    this.model = process.env.OPENAI_CHAT_MODEL || "gpt-4o";
  }

  async processChat(
    messages: ChatMessage[],
    currentBrief: DesignBrief
  ): Promise<AiChatResponse> {
    if (!this.client || process.env.USE_MOCK_AI === "true") {
      return this.mockChatAssistant(messages, currentBrief);
    }

    try {
      const systemPrompt = `You are VOWMARK's AI Design Assistant.
CRITICAL INSTRUCTION: Be extremely concise, direct, and brief (1 to 2 short sentences MAX).
Do NOT write long paragraphs, lists, or wordy explanations.
Simply acknowledge the user's request and confirm that the artwork is generated on the canvas.`;

      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        temperature: 0.5,
        max_tokens: 60,
      });

      const responseText = completion.choices[0]?.message?.content || "✨ Generated artwork on canvas.";

      return {
        message: responseText,
        updatedBrief: currentBrief,
      };
    } catch (err) {
      console.warn("OpenAI API call failed, falling back to mock assistant:", err);
      return this.mockChatAssistant(messages, currentBrief);
    }
  }

  async chatAssistant(messages: ChatMessage[], currentBrief: DesignBrief): Promise<AiChatResponse> {
    return this.processChat(messages, currentBrief);
  }

  async generateStructuredBrief(userRequest: string, style?: string, assetType?: string): Promise<DesignBrief> {
    const match = userRequest.match(/([A-Z])\s*(?:&|and|\+)\s*([A-Z])/i);
    const primary = match ? match[1].toUpperCase() : "Partner 1";
    const secondary = match ? match[2].toUpperCase() : "Partner 2";

    return DesignBriefSchema.parse({
      assetType: (assetType as any) || "couple_logo",
      primaryText: primary,
      secondaryText: secondary,
      initials: [primary, secondary],
      layout: "stacked",
      typographyCategory: "high_contrast_serif",
      weddingStyle: (style as any) || "editorial_luxury",
      styleKeywords: ["editorial", "luxury", "minimal"],
      colorMode: "black_on_white",
      background: "pure_white",
      ornamentType: "none",
      floralType: "none",
      referenceInstructions: [],
      generationPrompt: userRequest,
      negativePrompt: ["script font", "calligraphy", "mockup", "paper texture"],
      outputMode: "hybrid",
      aspectRatio: "1:1",
      recommendedFonts: ["Cormorant Garamond", "Bodoni Moda", "Cinzel"],
      productionNotes: [],
    });
  }

  private mockChatAssistant(
    messages: ChatMessage[],
    currentBrief: DesignBrief
  ): AiChatResponse {
    const lastUserMsg = messages[messages.length - 1]?.content || "";
    const lower = lastUserMsg.toLowerCase();

    let message = "✨ Generated artwork on canvas.";

    if (lower.includes("crest") || strokeContains(lower, ["crest", "estate", "shield"])) {
      message = "🛡️ Generated heraldic crest logo. Canvas updated.";
    } else if (lower.includes("editorial") || strokeContains(lower, ["editorial", "vogue", "luxury"])) {
      message = "💎 Applied editorial luxury styling. Canvas updated.";
    } else if (lower.includes("minimal") || lower.includes("clean")) {
      message = "✨ Generated minimal identity mark. Loaded on canvas.";
    } else if (lower.includes("background") || lower.includes("floral") || lower.includes("border")) {
      message = "🌸 Generated stationery background pattern on canvas.";
    }

    return {
      message,
      updatedBrief: currentBrief,
    };
  }
}

function strokeContains(text: string, keywords: string[]): boolean {
  return keywords.some((k) => text.includes(k));
}

export const openAIProvider = new OpenAIProvider();
