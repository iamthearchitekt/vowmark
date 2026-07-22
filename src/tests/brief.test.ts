import { describe, it, expect } from "vitest";
import { DesignBriefSchema } from "../lib/ai/brief-schema";

describe("Design Brief Schema Validation", () => {
  it("should validate a complete wedding design brief", () => {
    const brief = {
      assetType: "couple_logo",
      primaryText: "Erick",
      secondaryText: "Emily",
      initials: ["E", "E"],
      date: "10.24.2026",
      layout: "stacked",
      typographyCategory: "high_contrast_serif",
      weddingStyle: "editorial_luxury",
      styleKeywords: ["editorial", "luxury"],
      colorMode: "black_on_white",
      background: "pure_white",
      ornamentType: "none",
      floralType: "none",
      referenceInstructions: [],
      generationPrompt: "Test prompt",
      negativePrompt: ["script font"],
      outputMode: "hybrid",
      aspectRatio: "1:1",
      recommendedFonts: ["Cormorant Garamond"],
      productionNotes: [],
    };

    const parsed = DesignBriefSchema.safeParse(brief);
    expect(parsed.success).toBe(true);
  });
});
