export interface GenerateImageResponse {
  image?: string;
  revisedPrompt?: string | null;
  provider?: string;
  model?: string;
  error?: string;
}

export async function generateWeddingImage(
  prompt: string,
  options?: {
    size?: "1024x1024" | "1536x1024" | "1024x1536";
    quality?: "low" | "medium" | "high";
  }
): Promise<GenerateImageResponse> {
  const response = await fetch("/api/images/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
      size: options?.size || "1536x1024",
      quality: options?.quality || "medium",
    }),
  });

  const data = (await response.json()) as GenerateImageResponse;

  if (!response.ok) {
    throw new Error(data.error || "Image generation failed.");
  }

  return data;
}
