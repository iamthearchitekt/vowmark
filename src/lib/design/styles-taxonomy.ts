export interface WeddingStyleDefinition {
  slug: string;
  name: string;
  description: string;
  typographyCategories: string[];
  recommendedFonts: string[];
  layoutRules: string[];
  spacingRules: string;
  hierarchyRules: string;
  ornamentRecommendations: string[];
  floralRecommendations: string[];
  colorPalette: {
    primary: string;
    secondary: string;
    background: string;
    accent: string;
  };
  promptKeywords: string[];
  negativeKeywords: string[];
}

export const WEDDING_STYLES: Record<string, WeddingStyleDefinition> = {
  editorial_luxury: {
    slug: "editorial_luxury",
    name: "Editorial Luxury",
    description: "High-fashion, magazine-worthy aesthetic with sharp typographic contrast, generous white space, and restrained elegance.",
    typographyCategories: ["high_contrast_serif", "didone_serif", "editorial_sans"],
    recommendedFonts: ["Cormorant Garamond", "Bodoni Moda", "Playfair Display", "Cinzel"],
    layoutRules: ["Large primary names", "Small supporting text", "Wide margins", "Controlled ornamentation"],
    spacingRules: "Generous tracking on all caps, tight line spacing on stacked serif titles.",
    hierarchyRules: "Primary names 3x size of date/location.",
    ornamentRecommendations: ["Fine line dividers", "Minimalist hairline frame", "None"],
    floralRecommendations: ["None", "Single fine line stem"],
    colorPalette: {
      primary: "#1C1917",
      secondary: "#78716C",
      background: "#FFFDF9",
      accent: "#D4AF37",
    },
    promptKeywords: ["editorial", "vogue wedding", "high-contrast serif", "statuesque", "minimal ornament", "sharp kerning"],
    negativeKeywords: ["script font", "calligraphy", "chopin script", "rustic wood", "clipart", "excessive flowers", "mockup", "paper texture"],
  },
  modern_minimal: {
    slug: "modern_minimal",
    name: "Modern Minimal",
    description: "Clean geometric layouts, sans-serif or crisp serif typography, zero unnecessary flourishes.",
    typographyCategories: ["modern_minimal_sans", "editorial_sans", "classical_roman_serif"],
    recommendedFonts: ["Inter", "Montserrat", "Cinzel", "Cormorant"],
    layoutRules: ["Architectural alignment", "Extreme whitespace", "Uncluttered negative space"],
    spacingRules: "Wide letter-spacing (tracking 0.25em to 0.4em).",
    hierarchyRules: "Clean horizontal or vertical stacked grid.",
    ornamentRecommendations: ["None", "Geometric thin divider"],
    floralRecommendations: ["None"],
    colorPalette: {
      primary: "#000000",
      secondary: "#555555",
      background: "#FFFFFF",
      accent: "#999999",
    },
    promptKeywords: ["minimalist", "architectural", "clean geometric", "sans serif monogram", "stark white"],
    negativeKeywords: ["flowers", "wreath", "vines", "scrollwork", "calligraphy", "swashes", "vintage", "shadows"],
  },
  black_tie: {
    slug: "black_tie",
    name: "Black Tie Formal",
    description: "Strictly formal, timeless high-society aesthetic with polished Roman capitals and traditional proportions.",
    typographyCategories: ["classical_roman_serif", "didone_serif", "engraved_serif"],
    recommendedFonts: ["Bodoni Moda", "Cinzel", "Prata", "Playfair Display"],
    layoutRules: ["Formal centered hierarchy", "Traditional ampersand accent"],
    spacingRules: "Refined formal letter spacing.",
    hierarchyRules: "Symmetrical balance centered on artboard.",
    ornamentRecommendations: ["Classic double-line border", "Shield crest outline"],
    floralRecommendations: ["Laurel wreath", "Symmetrical olive leaves"],
    colorPalette: {
      primary: "#000000",
      secondary: "#475569",
      background: "#FFFFFF",
      accent: "#C5A059",
    },
    promptKeywords: ["black tie", "formal ball", "polished roman serif", "engraved crest", "society wedding"],
    negativeKeywords: ["casual script", "handwritten", "boho", "rustic", "distressed", "watercolor"],
  },
  romantic_garden: {
    slug: "romantic_garden",
    name: "Romantic Garden",
    description: "Soft botanical framing, lush peony and rose clusters surrounding delicate elegant typography.",
    typographyCategories: ["old_style_serif", "formal_calligraphy", "high_contrast_serif"],
    recommendedFonts: ["Alex Brush", "Cormorant Garamond", "Playfair Display", "Great Vibes"],
    layoutRules: ["Circular wreath or corner floral clusters enclosing central monogram/names"],
    spacingRules: "Organic balanced spacing inside botanical frame.",
    hierarchyRules: "Names centered within wreath focal area.",
    ornamentRecommendations: ["Full botanical wreath", "Corner floral sprigs"],
    floralRecommendations: ["English rose", "Peony", "Eucalyptus leaves", "Hydrangea"],
    colorPalette: {
      primary: "#292524",
      secondary: "#57534E",
      background: "#FFFDF9",
      accent: "#991B1B",
    },
    promptKeywords: ["romantic garden", "botanical wreath", "peonies", "roses", "delicate vines", "fine line ink floral"],
    negativeKeywords: ["geometric", "neon", "cyberpunk", "heavy blackletter", "bold block sans"],
  },
  european_estate: {
    slug: "european_estate",
    name: "European Estate",
    description: "Heritage Italian villa or French chateau feeling with architectural engraving and noble heraldic monograms.",
    typographyCategories: ["engraved_serif", "classical_roman_serif", "high_contrast_serif"],
    recommendedFonts: ["Cinzel", "Cormorant Garamond", "Prata"],
    layoutRules: ["Interlocking crest or engraved shield monogram"],
    spacingRules: "Stately classical spacing.",
    hierarchyRules: "Surname monogram dominates top; couple names beneath.",
    ornamentRecommendations: ["Heritage crest", "Architectural arch", "Ornate coat of arms border"],
    floralRecommendations: ["Olive branches", "Cypress motif", "Vintage citrus sprig"],
    colorPalette: {
      primary: "#000000",
      secondary: "#64748B",
      background: "#F8FAFC",
      accent: "#B45309",
    },
    promptKeywords: ["european estate", "chateau wedding", "heraldic crest", "interlocking monogram", "vintage villa engraving"],
    negativeKeywords: ["modern script", "casual handwriting", "clipart", "bright colors"],
  },
  french_editorial: {
    slug: "french_editorial",
    name: "French Editorial",
    description: "Chic Paris fashion editorial with high-contrast Didone serifs and effortless Parisian minimalism.",
    typographyCategories: ["didone_serif", "editorial_sans"],
    recommendedFonts: ["Bodoni Moda", "Playfair Display", "Cormorant Garamond"],
    layoutRules: ["Asymmetrical elegance", "Extreme size contrast between initial letters and full names"],
    spacingRules: "Ultra-tight title kerning with widely tracked subtext.",
    hierarchyRules: "Dynamic contrast.",
    ornamentRecommendations: ["Minimal thin line", "Wax seal shape"],
    floralRecommendations: ["Single magnolia bloom", "Isolated French lavender sprig"],
    colorPalette: {
      primary: "#18181B",
      secondary: "#71717A",
      background: "#FAFAFA",
      accent: "#A16207",
    },
    promptKeywords: ["french editorial", "parisian chic", "bodoni serif", "fashion magazine monogram", "haute couture"],
    negativeKeywords: ["rustic", "farmhouse", "chopin script", "heavy floral wreath", "cartoon"],
  },
  traditional_formal: {
    slug: "traditional_formal",
    name: "Traditional Formal",
    description: "Classic stationery style with copperplate lettering accents and formal centered layout.",
    typographyCategories: ["copperplate_script", "classical_roman_serif"],
    recommendedFonts: ["Great Vibes", "Cinzel", "Cormorant Garamond"],
    layoutRules: ["Symmetrical centered text block", "Formal ampersand"],
    spacingRules: "Standard formal invitation kerning.",
    hierarchyRules: "Host line / Name line / Date line stack.",
    ornamentRecommendations: ["Traditional formal scroll border"],
    floralRecommendations: ["Subtle ivy border"],
    colorPalette: {
      primary: "#000000",
      secondary: "#334155",
      background: "#FFFFFF",
      accent: "#D4AF37",
    },
    promptKeywords: ["traditional formal", "copperplate monogram", "classic engraved invitation mark"],
    negativeKeywords: ["modern sans", "abstract geometric", "boho", "grunge"],
  },
  botanical: {
    slug: "botanical",
    name: "Fine-Line Botanical",
    description: "Scientific botanical illustrations with delicate line work and organic leaf sprigs.",
    typographyCategories: ["old_style_serif", "high_contrast_serif"],
    recommendedFonts: ["Cormorant Garamond", "Prata", "Inter"],
    layoutRules: ["Intertwined stems through lettering"],
    spacingRules: "Generous breathing space.",
    hierarchyRules: "Artwork and text in harmonious balance.",
    ornamentRecommendations: ["Botanical frame", "Corner leaf cluster"],
    floralRecommendations: ["Eucalyptus", "Fern", "Olive leaves", "Wildflowers"],
    colorPalette: {
      primary: "#14532D",
      secondary: "#3F6212",
      background: "#F0FDF4",
      accent: "#A16207",
    },
    promptKeywords: ["botanical illustration", "fine ink line art", "eucalyptus leaves", "wildflower sprigs"],
    negativeKeywords: ["bold block font", "neon", "thick graffiti", "3d render"],
  },
  minimal_black_and_white: {
    slug: "minimal_black_and_white",
    name: "Minimal Black & White",
    description: "Pure high-contrast monochrome design focused on typography silhouette and negative space.",
    typographyCategories: ["high_contrast_serif", "modern_minimal_sans"],
    recommendedFonts: ["Bodoni Moda", "Cinzel", "Inter"],
    layoutRules: ["Strict monochrome", "No gradients", "No gray fuzziness"],
    spacingRules: "Pixel-perfect spacing.",
    hierarchyRules: "Clean crisp typography.",
    ornamentRecommendations: ["Thin vector line", "None"],
    floralRecommendations: ["None"],
    colorPalette: {
      primary: "#000000",
      secondary: "#000000",
      background: "#FFFFFF",
      accent: "#000000",
    },
    promptKeywords: ["pure black and white", "monochrome high-contrast", "vector silhouette", "no background"],
    negativeKeywords: ["color", "gray background", "shadows", "gradients", "paper texture"],
  },
};

export function getStyleDefinition(styleSlug: string): WeddingStyleDefinition {
  return WEDDING_STYLES[styleSlug] || WEDDING_STYLES.editorial_luxury;
}
