import OpenAI from "openai";

export interface DallEGenerationInput {
  prompt: string;
  style?: string;
  quality?: "standard" | "hd";
  size?: "1024x1024" | "1024x1792" | "1792x1024";
}

export interface DallEGenerationResult {
  imageUrl: string;
  revisedPrompt?: string;
  provider: "openai_dalle_3" | "mock";
  model: "dall-e-3";
  duration: number; // seconds
}

export class OpenAIDallEProvider {
  private client: OpenAI | null = null;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      this.client = new OpenAI({ apiKey });
    }
  }

  async generateImage(input: DallEGenerationInput): Promise<DallEGenerationResult> {
    const startTime = Date.now();

    // High-fashion wedding stationery prompt compiler
    const enhancedPrompt = `Vector line art wedding logo, ${input.prompt}. Black silhouette artwork on pure white background, flat vector composition, clean typography, luxury stationery asset, minimal, no mockup, no paper texture, no shading, high contrast.`;

    if (!this.client || process.env.USE_MOCK_AI === "true") {
      if (process.env.OPENAI_API_KEY) {
        this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      } else {
        return this.mockDalleResponse(enhancedPrompt, startTime);
      }
    }

    try {
      // Use response_format: "b64_json" for permanent, non-expiring image data URIs in production
      const response = await this.client.images.generate({
        model: "dall-e-3",
        prompt: enhancedPrompt,
        n: 1,
        size: input.size || "1024x1024",
        quality: input.quality || "standard",
        response_format: "b64_json",
      });

      const duration = (Date.now() - startTime) / 1000;
      const b64Json = response.data?.[0]?.b64_json;
      const revisedPrompt = response.data?.[0]?.revised_prompt;

      if (!b64Json) {
        // Fallback to URL format if b64_json is not returned
        const rawUrl = response.data?.[0]?.url;
        if (rawUrl) {
          return {
            imageUrl: rawUrl,
            revisedPrompt,
            provider: "openai_dalle_3",
            model: "dall-e-3",
            duration,
          };
        }
        return this.mockDalleResponse(enhancedPrompt, startTime);
      }

      // Format as permanent PNG Data URI
      const imageUrl = `data:image/png;base64,${b64Json}`;

      return {
        imageUrl,
        revisedPrompt,
        provider: "openai_dalle_3",
        model: "dall-e-3",
        duration,
      };
    } catch (err: any) {
      console.warn("DALL-E 3 API call failed or missing key, falling back:", err?.message || err);
      return this.mockDalleResponse(enhancedPrompt, startTime);
    }
  }

  private mockDalleResponse(prompt: string, startTime: number): DallEGenerationResult {
    const duration = (Date.now() - startTime) / 1000;
    
    // Generates a clean high-contrast SVG data URI representing the compiled DALL-E 3 prompt
    const rawSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
      <rect width="1000" height="1000" fill="#FFFFFF"/>
      <g stroke="#0F172A" stroke-width="3" fill="none" stroke-linecap="round">
        <polygon points="500,160 810,470 500,780 190,470" stroke-width="3.5"/>
        <polygon points="500,185 785,470 500,755 215,470" stroke-dasharray="6 4" stroke-width="1.5"/>
        <circle cx="500" cy="470" r="160" stroke-width="2"/>
        <text x="500" y="480" font-family="'Bodoni Moda', 'Cormorant Garamond', serif" font-size="110" font-weight="700" fill="#0F172A" text-anchor="middle" dominant-baseline="middle" stroke="none">DALL·E 3</text>
        <line x1="320" y1="650" x2="680" y2="650" stroke-width="1.5"/>
        <text x="500" y="690" font-family="system-ui, sans-serif" font-size="20" font-weight="700" letter-spacing="10" fill="#0F172A" text-anchor="middle" stroke="none">OPENAI IMAGE ENGINE</text>
      </g>
    </svg>`;

    const base64 = Buffer.from(rawSvg).toString("base64");
    const dataUri = `data:image/svg+xml;base64,${base64}`;

    return {
      imageUrl: dataUri,
      revisedPrompt: prompt,
      provider: "mock",
      model: "dall-e-3",
      duration: Math.max(0.3, duration),
    };
  }
}

export const openAIDallEProvider = new OpenAIDallEProvider();
