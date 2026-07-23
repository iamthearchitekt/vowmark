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
    name: "BSE Photobooth Master (Custom Preset)",
    description: "Trained on your uploaded photobooth design library: high-contrast luxury framing, crisp vector florals, photo cutouts, and rich gold/black ornaments.",
    textLogoPrefix:
      "High-fashion luxury photobooth stationery monogram mark. Ultra-clean vector artwork, solid black (#000000) or gold (#C9A251) line art on pure white background (#FFFFFF). Elegant typography, crisp heraldic crest framing, precise line weight.",
    textLogoSuffix:
      "No background clutter, no paper texture, no realistic photobooth mockups, no 3D rendering, no shadows, no gray tones, no color bleed, razor-sharp isolated vector logo.",
    backgroundPrefix:
      "Professional photobooth backdrop asset. Luxury stationery design with elegant border framing (roses, eucalyptus foliage, gold filigree, or gothic scrollwork). Wide open central photo placement area.",
    backgroundSuffix:
      "STRICTLY NO TEXT, NO LETTERS, NO WORDS, NO NAMES, NO INITIALS, NO LOGOS. High-resolution production photobooth background graphic asset.",
  },
  {
    id: "editorial_luxury",
    name: "Editorial Luxury & Monogram",
    description: "Chic Paris fashion editorial style with high-contrast Didone typography and minimalist luxury line art.",
    textLogoPrefix:
      "High-fashion luxury editorial wedding mark. High contrast, pure white background (#FFFFFF), solid black (#000000) artwork. Bodoni style typography, ultra-clean vector paths.",
    textLogoSuffix:
      "No mockups, no paper grain, no shadows, no gray background, high-resolution isolated vector asset.",
    backgroundPrefix:
      "Chic Parisian editorial stationery background graphic asset with minimal line borders and subtle gold accents.",
    backgroundSuffix:
      "STRICTLY NO TEXT, NO LETTERS, NO WORDS, NO LOGOS, NO MONOGRAMS. Clean production background asset.",
  },
  {
    id: "botanical_romance",
    name: "Lush Botanical & Wreath",
    description: "Soft romantic botanical framing with English roses, eucalyptus sprigs, and fine-line organic florals.",
    textLogoPrefix:
      "Fine-line botanical wedding monogram asset. Hand-drawn organic line art with delicate rose sprigs and eucalyptus wreath outline.",
    textLogoSuffix:
      "No 3D rendering, no heavy solid blocks, no clutter, clean isolated line art vector asset.",
    backgroundPrefix:
      "Lush romantic wedding stationery background asset featuring botanical floral borders, soft roses, and eucalyptus greenery enclosing artboard.",
    backgroundSuffix:
      "STRICTLY NO TEXT, NO LETTERS, NO WORDS, NO LOGOS. Clean production graphic background.",
  },
  {
    id: "black_and_gold_gothic",
    name: "Black & Gold Victorian Ornate",
    description: "Rich Victorian filigree, ornate scrollwork, dark luxury contrast, and gold heraldic border framing.",
    textLogoPrefix:
      "Victorian ornate black-tie wedding crest mark. Intricate gold filigree scrollwork, heraldic shield outline, luxury monogram lettering.",
    textLogoSuffix:
      "No blurry edges, no 3D shadows, no paper grain, sharp isolated vector mark.",
    backgroundPrefix:
      "Victorian ornate black and gold photobooth backdrop asset with intricate filigree corner borders and golden scrollwork frame.",
    backgroundSuffix:
      "STRICTLY NO TEXT, NO LETTERS, NO WORDS, NO LOGOS. High-resolution production background asset.",
  },
  {
    id: "minimal_vector",
    name: "Pure Minimal Vector",
    description: "Ultra-clean modern architectural line art with zero decorative clutter.",
    textLogoPrefix:
      "Minimalist modern wedding logo asset. Ultra-clean geometric line art, solid black (#000000) on pure white (#FFFFFF).",
    textLogoSuffix:
      "No textures, no shadows, no gradients, pure vector asset.",
    backgroundPrefix:
      "Minimalist architectural wedding stationery background with single thin hairline border frame.",
    backgroundSuffix:
      "STRICTLY NO TEXT, NO LETTERS, NO WORDS, NO LOGOS. Production graphic background.",
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
        "paper texture",
        "shadows",
        "mockup",
        "gray background",
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
