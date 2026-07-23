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
      const systemPrompt = `You are VOWMARK's Senior AI Wedding Design Consultant.
CRITICAL DIRECTIVES:
1. NO EMOJIS. Never use emojis in any response.
2. Be concise, procedural, and professional (1 to 3 short sentences MAX).
3. Provide direct design advice, style recommendations, font pairings, or layout guidance.
4. When planning design concepts, inform the user they can type "Make me a..." whenever they are ready to render artwork live on their canvas.`;

      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        temperature: 0.5,
        max_tokens: 100,
      });

      const rawContent = completion.choices[0]?.message?.content || "Generation completed. Canvas updated.";
      const cleanContent = rawContent.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "").trim();

      return {
        message: cleanContent,
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

    let message = "Planning response logged. Type 'Make me a...' when ready to generate artwork on canvas.";

    if (lower.includes("make me") || lower.includes("generate") || lower.includes("create")) {
      message = "Generation completed. Canvas updated.";
    } else if (lower.includes("font") || lower.includes("type")) {
      message = "High-contrast editorial serif fonts (Bodoni Moda, Cormorant Garamond) fit formal luxury invitations best. Type 'Make me a...' when ready to generate.";
    } else if (lower.includes("crest") || lower.includes("shield")) {
      message = "European heraldic crests with fine line engraving complement estate venues. Type 'Make me an estate crest...' to render live.";
    } else if (lower.includes("color") || lower.includes("palette")) {
      message = "High-contrast black-on-white or champagne gold accents provide optimal print clarity.";
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
