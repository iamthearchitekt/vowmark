import { describe, it, expect } from "vitest";
import { compileGenerationPrompt } from "../lib/ai/prompt-compiler";
import { DesignBrief } from "../lib/ai/brief-schema";

describe("Server-side Prompt Compiler", () => {
  it("should compile high-precision prompt with negative constraints", () => {
    const brief: DesignBrief = {
      assetType: "couple_logo",
      primaryText: "Erick",
      secondaryText: "Emily",
      initials: ["E", "E"],
      surname: "",
      date: "10.24.2026",
      location: "",
      layout: "stacked",
      typographyCategory: "high_contrast_serif",
      weddingStyle: "editorial_luxury",
      styleKeywords: ["editorial"],
      colorMode: "black_on_white",
      background: "pure_white",
      ornamentType: "none",
      floralType: "none",
      referenceInstructions: [],
      generationPrompt: "",
      negativePrompt: ["chopin script"],
      outputMode: "hybrid",
      aspectRatio: "1:1",
      hasActiveBackground: false,
      recommendedFonts: [],
      productionNotes: [],
    };

    const compiled = compileGenerationPrompt(brief);
    expect(compiled.prompt).toContain("Erick");
    expect(compiled.prompt).toContain("Emily");
    expect(compiled.negativePrompt).toContain("script font");
  });
});
