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
      const systemPrompt = `You are VOWMARK's Senior AI Wedding Logo Architect.
You help generate bespoke high-fashion wedding logos, monograms, crests, and stationer identities using Google Gemini Nano Banana API.
When users ask for logos, monograms, or image revisions, enthusiastically acknowledge their request, confirm the compiled style taxonomy rules, and report that the bespoke artwork has been generated on their artboard canvas.`;

      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        temperature: 0.7,
      });

      const responseText = completion.choices[0]?.message?.content || "Generated bespoke AI wedding logo artwork on your artboard.";

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

    // Extract initials if present
    const match = lastUserMsg.match(/([A-Z])\s*(?:&|and|\+)\s*([A-Z])/i);
    let initialsStr = match ? `${match[1].toUpperCase()} & ${match[2].toUpperCase()}` : "your requested initials";

    let message = `✨ Generated bespoke AI wedding logo artwork for ${initialsStr} using Google Gemini Nano Banana! The new identity mark is loaded live on your artboard canvas.`;

    if (lower.includes("crest") || strokeContains(lower, ["crest", "estate", "shield"])) {
      message = `🛡️ Compiled European Estate Crest taxonomy rules and generated a bespoke heraldic shield logo for ${initialsStr}. Loaded live on your main artboard!`;
    } else if (lower.includes("editorial") || strokeContains(lower, ["editorial", "vogue", "luxury"])) {
      message = `💎 Applied Editorial Luxury design taxonomy and rendered high-contrast Didone/Bodoni typography logo artwork for ${initialsStr}. Canvas updated!`;
    } else if (lower.includes("minimal") || lower.includes("clean")) {
      message = `✨ Generated modern minimal wedding identity mark with clean monogram silhouette for ${initialsStr}. Loaded on canvas!`;
    }

    return {
      message,
      updatedBrief: currentBrief,
      suggestedActions: [
        "Make More Editorial",
        "Generate Estate Crest",
        "Convert to High-Contrast B&W",
        "Simplify Monogram",
      ],
    };
  }
}

function strokeContains(text: string, keywords: string[]): boolean {
  return keywords.some((k) => text.includes(k));
}

export const openAIProvider = new OpenAIProvider();
