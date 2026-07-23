import { openai, getOpenAIClient } from "@/lib/openai";
import { applyUniversalPromptAid } from "./prompt-compiler";

export interface ImageGenerationInput {
  prompt: string;
  quality?: "low" | "medium" | "high" | "standard" | "hd";
  size?: "1024x1024" | "1536x1024" | "1024x1536" | "1792x1024" | "1024x1792";
}

export interface ImageGenerationResult {
  imageUrl: string;
  revisedPrompt?: string;
  provider: "openai_gpt_image" | "mock";
  model: string;
  duration: number; // seconds
}

export class OpenAIImageProvider {
  async generateImage(input: ImageGenerationInput): Promise<ImageGenerationResult> {
    const startTime = Date.now();
    const model = process.env.OPENAI_IMAGE_MODEL || "gpt-image-2";

    // Apply Universal Pre-Prompt Aid under the hood
    const enhancedPrompt = applyUniversalPromptAid(input.prompt);

    // If mock mode is explicitly forced via USE_MOCK_AI=true without an API key
    if (process.env.USE_MOCK_AI === "true") {
      return this.mockImageResponse(enhancedPrompt, model, startTime);
    }

    try {
      const client = getOpenAIClient();

      const response = await client.images.generate({
        model,
        prompt: enhancedPrompt,
        n: 1,
        size: (input.size as any) || "1536x1024",
        quality: (input.quality as any) || "medium",
        output_format: "png",
      } as any);

      const duration = (Date.now() - startTime) / 1000;
      const b64Json = response.data?.[0]?.b64_json;
      const rawUrl = response.data?.[0]?.url;
      const revisedPrompt = response.data?.[0]?.revised_prompt;

      if (b64Json) {
        return {
          imageUrl: `data:image/png;base64,${b64Json}`,
          revisedPrompt,
          provider: "openai_gpt_image",
          model,
          duration,
        };
      }

      if (rawUrl) {
        return {
          imageUrl: rawUrl,
          revisedPrompt,
          provider: "openai_gpt_image",
          model,
          duration,
        };
      }

      throw new Error("OpenAI API returned no image data.");
    } catch (err: any) {
      const errorMessage = err?.message || err || "Image generation service encountered an unexpected error.";
      console.error("VOWMARK Image Generation Error:", errorMessage);
      // Strictly throw error as requested - NO fallback to vector or DALL-E 3
      throw new Error(`VOWMARK Image Generation Failed: ${errorMessage}`);
    }
  }

  private mockImageResponse(prompt: string, model: string, startTime: number): ImageGenerationResult {
    const duration = (Date.now() - startTime) / 1000;

    const rawSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
      <rect width="1000" height="1000" fill="#FFFFFF"/>
      <g stroke="#0F172A" stroke-width="3" fill="none" stroke-linecap="round">
        <polygon points="500,160 810,470 500,780 190,470" stroke-width="3.5"/>
        <polygon points="500,185 785,470 500,755 215,470" stroke-dasharray="6 4" stroke-width="1.5"/>
        <circle cx="500" cy="470" r="160" stroke-width="2"/>
        <text x="500" y="480" font-family="'Bodoni Moda', 'Cormorant Garamond', serif" font-size="110" font-weight="700" fill="#0F172A" text-anchor="middle" dominant-baseline="middle" stroke="none">GPT IMAGE 2</text>
        <line x1="320" y1="650" x2="680" y2="650" stroke-width="1.5"/>
        <text x="500" y="690" font-family="system-ui, sans-serif" font-size="20" font-weight="700" letter-spacing="10" fill="#0F172A" text-anchor="middle" stroke="none">OPENAI ENGINE</text>
      </g>
    </svg>`;

    const base64 = Buffer.from(rawSvg).toString("base64");
    return {
      imageUrl: `data:image/svg+xml;base64,${base64}`,
      revisedPrompt: prompt,
      provider: "mock",
      model,
      duration: Math.max(0.3, duration),
    };
  }
}

export const openAIImageProvider = new OpenAIImageProvider();
export const openAIDallEProvider = openAIImageProvider; // backward compatibility export
