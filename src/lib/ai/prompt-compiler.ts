import { DesignBrief } from "./brief-schema";
import { getStyleDefinition } from "../design/styles-taxonomy";

export type AiGenerationType = "text_logo" | "background_pattern";

export interface PromptGuidanceConfig {
  textLogoPrefix: string;
  textLogoSuffix: string;
  backgroundPrefix: string;
  backgroundSuffix: string;
}

export const DEFAULT_PROMPT_GUIDANCE: PromptGuidanceConfig = {
  textLogoPrefix:
    "High-fashion luxury wedding stationery asset. Ultra-clean, high contrast, pure white background (#FFFFFF), solid black artwork (#000000). Isolated asset composition, precise line weight, perfect letterform typography.",
  textLogoSuffix:
    "No paper texture, no realistic mockups, no 3D rendering, no shadows, no gray background, no color bleed, no blurry edges, high-resolution artwork.",
  backgroundPrefix:
    "High-fashion luxury wedding stationery background graphic asset. Seamless pattern, elegant botanical florals, delicate watercolor wash, fine line filigree frame, gold accent flourishes on a pure white background (#FFFFFF).",
  backgroundSuffix:
    "STRICTLY NO TEXT, NO LETTERS, NO WORDS, NO NAMES, NO LOGOS, NO MONOGRAMS, NO INITIALS. Pure background graphic artwork, no paper texture mockup, no 3D rendering, crisp high-resolution production art.",
};

export function applyUniversalPromptAid(
  rawPrompt: string,
  generationType: AiGenerationType = "text_logo",
  customGuidance?: Partial<PromptGuidanceConfig>
): string {
  const config = { ...DEFAULT_PROMPT_GUIDANCE, ...customGuidance };
  const cleanPrompt = rawPrompt.trim();

  if (generationType === "background_pattern") {
    return `${config.backgroundPrefix} ${cleanPrompt} ${config.backgroundSuffix}`.trim();
  }

  return `${config.textLogoPrefix} ${cleanPrompt} ${config.textLogoSuffix}`.trim();
}

export function compileGenerationPrompt(
  brief: DesignBrief,
  options?: {
    generationType?: AiGenerationType;
    guidanceConfig?: Partial<PromptGuidanceConfig>;
  }
): {
  prompt: string;
  negativePrompt: string[];
} {
  const genType =
    options?.generationType ||
    (brief.assetType?.includes("background") ? "background_pattern" : "text_logo");
  const guidance = options?.guidanceConfig;
  const styleDef = getStyleDefinition(brief.weddingStyle);

  if (genType === "background_pattern") {
    const rawPrompt = [
      "Create a luxury wedding stationery background asset.",
      "Incorporate botanical florals, filigree borders, and subtle stationery framing.",
      `Style aesthetic: ${styleDef.name}.`,
      "Composition: balanced, elegant, seamless background pattern without central text.",
      brief.generationPrompt ? `User background instructions: ${brief.generationPrompt}` : "",
    ]
      .filter(Boolean)
      .join(" ");

    const finalPrompt = applyUniversalPromptAid(rawPrompt, "background_pattern", guidance);

    const negativePrompts = Array.from(
      new Set([
        ...brief.negativePrompt,
        ...styleDef.negativeKeywords,
        "text",
        "letters",
        "words",
        "names",
        "monogram",
        "initials",
        "logo",
        "alphabet",
        "paper texture",
        "shadows",
        "mockup",
        "gray background",
      ])
    );

    return {
      prompt: finalPrompt,
      negativePrompt: negativePrompts,
    };
  }

  // Default: text_logo Mode
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
    assetInstruction = `Create an isolated circular botanical wreath featuring fine line ink art of botanical sprigs and leaves with central typography.`;
  } else if (brief.assetType === "wedding_crest") {
    assetInstruction = `Create an isolated heraldic wedding crest frame with fine line engraving detail and monogram lettering.`;
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

  const finalPrompt = applyUniversalPromptAid(rawPrompt, "text_logo", guidance);

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
