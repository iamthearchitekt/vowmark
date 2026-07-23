import OpenAI from "openai";
import { DesignBrief, DesignBriefSchema } from "./brief-schema";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  flowerOptions?: string[];
}

export interface AiChatResponse {
  message: string;
  updatedBrief?: Partial<DesignBrief>;
  suggestedActions?: string[];
  flowerSuggestions?: string[];
}

export const FLORAL_SUGGESTIONS = [
  "English Roses & Peonies",
  "Eucalyptus & Olive Leaves",
  "White Anemones & Wildflowers",
  "Pampas Grass & Dried Botanicals",
  "Citrus Sprigs & Cypress",
  "French Lavender & Magnolia",
];

const FLORAL_KEYWORDS = [
  "floral",
  "flower",
  "flowers",
  "botanical",
  "botany",
  "wreath",
  "foliage",
  "leaf",
  "leaves",
  "sprig",
  "sprigs",
  "bouquet",
  "bloom",
  "garden",
  "garland",
];

const SPECIFIC_FLOWER_NAMES = [
  "rose",
  "peony",
  "peonies",
  "eucalyptus",
  "anemone",
  "olive",
  "pampas",
  "citrus",
  "lavender",
  "magnolia",
  "hydrangea",
  "ivy",
];

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
    const lastUserMsg = messages[messages.length - 1]?.content || "";
    const lower = lastUserMsg.toLowerCase();

    const isFloralRequest = FLORAL_KEYWORDS.some((k) => lower.includes(k));
    const hasSpecificFlower = SPECIFIC_FLOWER_NAMES.some((k) => lower.includes(k));

    if (!this.client || process.env.USE_MOCK_AI === "true") {
      return this.mockChatAssistant(messages, currentBrief, isFloralRequest && !hasSpecificFlower);
    }

    try {
      const systemPrompt = `You are VOWMARK's Senior AI Wedding Design Consultant.
CRITICAL DIRECTIVES:
1. NO EMOJIS. Never use emojis in any response.
2. Be concise, procedural, and professional (1 to 3 short sentences MAX).
3. If the user mentions florals, flowers, or botanical motifs without specifying exact plant species, ask them what specific flowers or plants they prefer (e.g. English roses, eucalyptus, olive leaves, peonies, anemones).
4. Provide direct design advice, style recommendations, font pairings, or layout guidance.`;

      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        temperature: 0.5,
        max_tokens: 100,
      });

      const rawContent = completion.choices[0]?.message?.content || "Planning response logged.";
      const cleanContent = rawContent.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "").trim();

      return {
        message: isFloralRequest && !hasSpecificFlower 
          ? `${cleanContent} What specific flowers or plants would you like to feature?`
          : cleanContent,
        updatedBrief: currentBrief,
        flowerSuggestions: isFloralRequest && !hasSpecificFlower ? FLORAL_SUGGESTIONS : undefined,
      };
    } catch (err) {
      console.warn("OpenAI API call failed, falling back to mock assistant:", err);
      return this.mockChatAssistant(messages, currentBrief, isFloralRequest && !hasSpecificFlower);
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
    currentBrief: DesignBrief,
    needsFloralPrompt = false
  ): AiChatResponse {
    const lastUserMsg = messages[messages.length - 1]?.content || "";
    const lower = lastUserMsg.toLowerCase();

    let message = "Planning response logged. Click 'Visualize' when ready to render artwork on canvas.";

    if (needsFloralPrompt) {
      message = "To sharpen your floral output, what specific flowers or plants would you like to feature in this design?";
    } else if (lower.includes("make me") || lower.includes("generate") || lower.includes("create")) {
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
      flowerSuggestions: needsFloralPrompt ? FLORAL_SUGGESTIONS : undefined,
    };
  }
}

function strokeContains(text: string, keywords: string[]): boolean {
  return keywords.some((k) => text.includes(k));
}

export const openAIProvider = new OpenAIProvider();
