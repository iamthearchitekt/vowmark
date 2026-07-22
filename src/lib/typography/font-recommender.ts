import { CURATED_FONTS, FontRecord } from "./fonts-db";
import { getStyleDefinition } from "../design/styles-taxonomy";

export interface FontRecommendationResult {
  fontRecord: FontRecord;
  confidence: number;
  reason: string;
  recommendedFor: string[];
}

export function recommendFonts(
  weddingStyle: string,
  assetType: string,
  userPreferenceCategory?: string
): FontRecommendationResult[] {
  const styleDef = getStyleDefinition(weddingStyle);

  const scored = CURATED_FONTS.map((font) => {
    let score = 0.5; // base score
    const reasons: string[] = [];

    // Check style recommendations
    if (styleDef.recommendedFonts.includes(font.familyName)) {
      score += 0.35;
      reasons.push(`Matches signature font recommendation for ${styleDef.name}.`);
    }

    // Category matching
    if (
      userPreferenceCategory &&
      font.classification.toLowerCase() === userPreferenceCategory.toLowerCase()
    ) {
      score += 0.2;
      reasons.push(`Fulfills requested ${userPreferenceCategory} category.`);
    }

    // Asset type matching
    if (assetType.includes("monogram") && font.weddingTags.includes("best for initials")) {
      score += 0.15;
      reasons.push(`Excellent uppercase glyph proportions for monograms.`);
    }

    if (assetType.includes("wordmark") && font.classification === "serif") {
      score += 0.15;
      reasons.push(`High editorial serif contrast ideal for couple wordmarks.`);
    }

    // Negative constraints check: if style definition prohibits script, penalize script fonts
    if (
      styleDef.negativeKeywords.includes("script font") &&
      font.classification === "script"
    ) {
      score -= 0.8;
      reasons.push(`Penalized: script typography violates ${styleDef.name} rules.`);
    }

    const confidence = Math.min(0.98, Math.max(0.1, score));

    return {
      fontRecord: font,
      confidence,
      reason: reasons.join(" ") || `Polished font candidate for ${styleDef.name}.`,
      recommendedFor: font.bestFor,
    };
  });

  return scored.sort((a, b) => b.confidence - a.confidence);
}
