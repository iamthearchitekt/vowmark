import { DesignBrief } from "./brief-schema";
import { getStyleDefinition } from "../design/styles-taxonomy";

export type AiGenerationType = "text_logo" | "background_pattern";

export interface PromptGuidanceConfig {
  textLogoPrefix: string;
  textLogoSuffix: string;
  backgroundPrefix: string;
  backgroundSuffix: string;
}

export interface GuardrailPreset {
  id: string;
  name: string;
  description: string;
  textLogoPrefix: string;
  textLogoSuffix: string;
  backgroundPrefix: string;
  backgroundSuffix: string;
}

export const GUARDRAIL_PRESETS: GuardrailPreset[] = [
  {
    id: "bse_photobooth_master",
    name: "Photobooth Studio Master (Balanced)",
    description: "Subject-neutral structural guardrail: ensures clean vector isolated output for logos and wide central photo space for backdrops without forcing specific flowers or motifs.",
    textLogoPrefix:
      "High-contrast isolated stationery logo asset. Solid black (#000000) or gold (#C9A251) line art on pure white background (#FFFFFF). Crisp line weight and clean letterforms.",
    textLogoSuffix:
      "No paper texture, no realistic mockups, no 3D rendering, no shadows, no gray background, high-resolution isolated vector asset.",
    backgroundPrefix:
      "High-resolution production photobooth background graphic asset with balanced border composition and open central photo zone.",
    backgroundSuffix:
      "STRICTLY NO TEXT, NO LETTERS, NO WORDS, NO NAMES, NO INITIALS, NO LOGOS. Clean production backdrop graphic asset.",
  },
  {
    id: "lush_color_florals",
    name: "Lush Color Florals (Layer 1 Backdrop)",
    description: "Strictly handles floral & botanical backdrops (wreath, border, corner sprigs, or full floral clusters). Enforces vibrant color-driven output unless black & white is explicitly asked.",
    textLogoPrefix:
      "High-contrast isolated stationery logo asset. Solid black (#000000) or gold (#C9A251) line art on pure white background (#FFFFFF). Crisp line weight.",
    textLogoSuffix:
      "No paper texture, no realistic mockups, no 3D rendering, no shadows, high-resolution isolated vector asset.",
    backgroundPrefix:
      "Lush color-driven botanical floral background graphic asset for wedding stationery and photobooth backdrops. Vibrant floral color palette, high-fidelity botanical illustration (border frame, floral wreath, or corner sprigs) with an open central photo zone.",
    backgroundSuffix:
      "STRICTLY NO TEXT, NO LETTERS, NO WORDS, NO NAMES, NO INITIALS, NO LOGOS. High-resolution production floral backdrop asset.",
  },
  {
    id: "minimal_steering",
    name: "Light & Neutral (Full Creative Control)",
    description: "Ultra-light structural guardrail. Gives 100% creative control to your prompt while enforcing technical isolated asset rules.",
    textLogoPrefix:
      "Isolated graphic logo asset on pure white background (#FFFFFF).",
    textLogoSuffix:
      "No 3D mockups, no paper texture, high resolution vector asset.",
    backgroundPrefix:
      "High-resolution graphic backdrop asset.",
    backgroundSuffix:
      "STRICTLY NO TEXT, NO LETTERS, NO WORDS, NO LOGOS.",
  },
  {
    id: "high_contrast_vector",
    name: "High Contrast Vector Line Art",
    description: "Enforces crisp 2D vector linework and sharp contrast for engraving / line art designs.",
    textLogoPrefix:
      "Ultra-clean 2D line art asset. Solid black (#000000) on pure white (#FFFFFF), razor-sharp lines.",
    textLogoSuffix:
      "No gradients, no realistic shadows, no photo backgrounds, pure vector line art asset.",
    backgroundPrefix:
      "Line art border stationery background asset.",
    backgroundSuffix:
      "STRICTLY NO TEXT, NO LETTERS, NO WORDS, NO LOGOS.",
  },
  {
    id: "luxury_gold_accent",
    name: "Gold Foil & Luxury Accent",
    description: "Enforces metallic gold accent tones (#C9A251) and luxury stationery contrast.",
    textLogoPrefix:
      "Luxury gold foil stationery asset (#C9A251) on pure white background (#FFFFFF). Clean refined line weight.",
    textLogoSuffix:
      "No drop shadows, no paper grain, high-resolution vector logo asset.",
    backgroundPrefix:
      "Luxury wedding backdrop asset with refined golden accents and open layout.",
    backgroundSuffix:
      "STRICTLY NO TEXT, NO LETTERS, NO WORDS, NO LOGOS.",
  },
];

export const DEFAULT_PROMPT_GUIDANCE: PromptGuidanceConfig = {
  textLogoPrefix: GUARDRAIL_PRESETS[0].textLogoPrefix,
  textLogoSuffix: GUARDRAIL_PRESETS[0].textLogoSuffix,
  backgroundPrefix: GUARDRAIL_PRESETS[0].backgroundPrefix,
  backgroundSuffix: GUARDRAIL_PRESETS[0].backgroundSuffix,
};

export function getAspectRatioInstruction(canvasFormat?: string): {
  promptInstruction: string;
  recommendedSize: "1024x1024" | "1024x1792" | "1792x1024";
} {
  switch (canvasFormat) {
    case "2_x_6":
      return {
        promptInstruction:
          "Target Canvas Format: 2x6 tall photo strip (1:3 vertical aspect ratio). Composition: Stack elements vertically in a tall, narrow photo strip format with top and bottom decorative borders.",
        recommendedSize: "1024x1792",
      };
    case "4_x_6":
      return {
        promptInstruction:
          "Target Canvas Format: 4x6 vertical invitation card (2:3 portrait aspect ratio). Composition: Balanced vertical portrait layout centered for a classic 4x6 invitation.",
        recommendedSize: "1024x1792",
      };
    case "6_x_4":
      return {
        promptInstruction:
          "Target Canvas Format: 6x4 horizontal card (3:2 landscape aspect ratio). Composition: Wide horizontal landscape layout with side-by-side elements tailored for a 6x4 landscape card.",
        recommendedSize: "1792x1024",
      };
    case "square":
    default:
      return {
        promptInstruction:
          "Target Canvas Format: Square 1:1 aspect ratio. Composition: Symmetrical, centered 1:1 square canvas layout.",
        recommendedSize: "1024x1024",
      };
  }
}

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
    canvasFormat?: string;
  }
): {
  prompt: string;
  negativePrompt: string[];
  recommendedSize: "1024x1024" | "1024x1792" | "1792x1024";
  aspectRatioInstruction: string;
} {
  const genType =
    options?.generationType ||
    (brief.assetType?.includes("background") ? "background_pattern" : "text_logo");
  const guidance = options?.guidanceConfig;
  const targetFormat = options?.canvasFormat || brief.canvasFormat || "square";
  const aspectRatioInfo = getAspectRatioInstruction(targetFormat);
  const styleDef = getStyleDefinition(brief.weddingStyle);

  if (genType === "background_pattern") {
    const rawPrompt = [
      "Create a luxury wedding stationery background asset.",
      aspectRatioInfo.promptInstruction,
      brief.generationPrompt ? `User instructions: ${brief.generationPrompt}` : "",
      "Composition: elegant background pattern without central text.",
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
        "shadows",
        "mockup",
      ])
    );

    return {
      prompt: finalPrompt,
      negativePrompt: negativePrompts,
      recommendedSize: aspectRatioInfo.recommendedSize,
      aspectRatioInstruction: aspectRatioInfo.promptInstruction,
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
    aspectRatioInfo.promptInstruction,
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
    recommendedSize: aspectRatioInfo.recommendedSize,
    aspectRatioInstruction: aspectRatioInfo.promptInstruction,
  };
}
