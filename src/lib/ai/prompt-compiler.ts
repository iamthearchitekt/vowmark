import { DesignBrief } from "./brief-schema";
import { getStyleDefinition } from "../design/styles-taxonomy";

export const UNIVERSAL_WEDDING_PROMPT_AID = {
  prefix: "High-fashion luxury wedding stationery asset. Ultra-clean, high contrast, pure white background (#FFFFFF), solid black artwork (#000000). Isolated asset composition, precise line weight, perfect symmetry and balance.",
  suffix: "No paper texture, no realistic mockups, no 3D rendering, no shadows, no gray background, no color bleed, no blurry edges, high-resolution production artwork."
};

export function applyUniversalPromptAid(rawPrompt: string): string {
  const cleanPrompt = rawPrompt.trim();
  return `${UNIVERSAL_WEDDING_PROMPT_AID.prefix} ${cleanPrompt} ${UNIVERSAL_WEDDING_PROMPT_AID.suffix}`.trim();
}

export function compileGenerationPrompt(brief: DesignBrief): {
  prompt: string;
  negativePrompt: string[];
} {
  const styleDef = getStyleDefinition(brief.weddingStyle);

  const primaryStr = brief.primaryText ? `“${brief.primaryText}”` : "";
  const secondaryStr = brief.secondaryText ? `“${brief.secondaryText}”` : "";
  const namesClause = primaryStr && secondaryStr ? `exact names ${primaryStr} and ${secondaryStr}` : "couple names";

  let layoutInstruction = "Stack the primary name above the secondary name with a smaller centered ampersand.";
  if (brief.layout === "horizontal") {
    layoutInstruction = "Place the names horizontally in a single refined line separated by an elegant ampersand.";
  } else if (brief.layout === "interlocking") {
    layoutInstruction = "Interlock the initial letterforms into a cohesive monogram silhouette.";
  }

  let assetInstruction = `Create a bespoke wedding logo asset for ${namesClause}.`;
  if (brief.assetType === "botanical_wreath") {
    assetInstruction = `Create an isolated circular botanical wreath featuring fine line ink art of botanical sprigs and leaves. Do not include text inside the artwork.`;
  } else if (brief.assetType === "wedding_crest") {
    assetInstruction = `Create an isolated heraldic wedding crest frame with fine line engraving detail. Do not include central text.`;
  } else if (brief.assetType === "invitation_divider") {
    assetInstruction = `Create an isolated horizontal invitation divider ornament with a subtle central botanical flourish and hairline rule.`;
  }

  let fontStyleClause = "Use an elegant high-contrast editorial serif typeface.";
  if (styleDef.typographyCategories.includes("didone_serif")) {
    fontStyleClause = "Use sharp Didone luxury serif lettering with dramatic contrast.";
  } else if (styleDef.typographyCategories.includes("classical_roman_serif")) {
    fontStyleClause = "Use polished classical Roman inscription capitals.";
  } else if (styleDef.typographyCategories.includes("modern_minimal_sans")) {
    fontStyleClause = "Use crisp architectural sans-serif typography with generous letter spacing.";
  }

  const rawPrompt = [
    assetInstruction,
    fontStyleClause,
    layoutInstruction,
    `Style aesthetic: ${styleDef.name}.`,
    `Color: solid black artwork on a pure white background.`,
    `Composition: balanced, restrained, refined, and appropriate for a high-end invitation.`,
    brief.generationPrompt ? `User instructions: ${brief.generationPrompt}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  const finalPrompt = applyUniversalPromptAid(rawPrompt);

  const combinedNegativePrompts = Array.from(
    new Set([
      ...brief.negativePrompt,
      ...styleDef.negativeKeywords,
      "paper texture",
      "shadows",
      "mockup",
      "gray background",
      "extra text",
      "distorted spelling",
    ])
  );

  return {
    prompt: finalPrompt,
    negativePrompt: combinedNegativePrompts,
  };
}
