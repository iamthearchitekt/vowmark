export interface PromptTemplateSeed {
  id: string;
  name: string;
  assetType: string;
  weddingStyle: string;
  typographyCategory: string;
  basePrompt: string;
  negativePrompt: string[];
  requiredFields: string[];
  optionalFields: string[];
}

export const SEEDED_PROMPT_TEMPLATES: PromptTemplateSeed[] = [
  {
    id: "stacked_editorial_serif",
    name: "Stacked Editorial Serif",
    assetType: "couple_wordmark",
    weddingStyle: "editorial_luxury",
    typographyCategory: "high_contrast_serif",
    basePrompt:
      "Create a bespoke wedding couple wordmark using the exact names '{primaryText}' and '{secondaryText}'. Use an elegant high-contrast editorial serif typeface. Stack '{primaryText}' above '{secondaryText}' with a smaller centered ampersand. Use solid black typography on a pure white background. Make the composition balanced, restrained, refined, and appropriate for a black-tie wedding invitation.",
    negativePrompt: [
      "script font",
      "calligraphy",
      "brush lettering",
      "chopin script",
      "flowers",
      "borders",
      "crest",
      "paper texture",
      "shadows",
      "mockup",
      "gray background",
    ],
    requiredFields: ["primaryText", "secondaryText"],
    optionalFields: ["date", "location"],
  },
  {
    id: "horizontal_editorial_serif",
    name: "Horizontal Editorial Serif",
    assetType: "couple_wordmark",
    weddingStyle: "french_editorial",
    typographyCategory: "didone_serif",
    basePrompt:
      "Create a chic horizontal couple wordmark with '{primaryText}' & '{secondaryText}' in sharp Didone luxury serif lettering. Balanced spacing, high fashion editorial aesthetic, black artwork on pure white background.",
    negativePrompt: ["handwritten", "rustic", "cluttered", "vines", "mockup"],
    requiredFields: ["primaryText", "secondaryText"],
    optionalFields: ["date"],
  },
  {
    id: "minimal_ampersand_wordmark",
    name: "Minimal Ampersand Wordmark",
    assetType: "couple_logo",
    weddingStyle: "modern_minimal",
    typographyCategory: "modern_minimal_sans",
    basePrompt:
      "Minimalist wedding mark featuring '{primaryText}' and '{secondaryText}' with a prominent, artfully designed central ampersand. Clean architectural geometric lines, black on white background.",
    negativePrompt: ["flowers", "vines", "scrolls", "paper texture"],
    requiredFields: ["primaryText", "secondaryText"],
    optionalFields: ["date"],
  },
  {
    id: "interlocking_initials",
    name: "Interlocking Monogram",
    assetType: "interlocking_monogram",
    weddingStyle: "european_estate",
    typographyCategory: "monogram_display",
    basePrompt:
      "A luxury interlocking monogram composed of initials '{initial1}' and '{initial2}'. Artistically woven serifs, classic balance, solid black lines on pure white background.",
    negativePrompt: ["colored ink", "background noise", "shadows", "full names"],
    requiredFields: ["initials"],
    optionalFields: ["surname"],
  },
  {
    id: "circular_monogram",
    name: "Circular Monogram",
    assetType: "two_initial_monogram",
    weddingStyle: "black_tie",
    typographyCategory: "classical_roman_serif",
    basePrompt:
      "Circular wedding monogram featuring initials '{initial1}' and '{initial2}' inside a refined thin double circle frame. High contrast black ink on pure white.",
    negativePrompt: ["flowers", "cluttered background", "3d render"],
    requiredFields: ["initials"],
    optionalFields: ["date"],
  },
  {
    id: "three_letter_surname_monogram",
    name: "Three-Letter Surname Monogram",
    assetType: "three_letter_monogram",
    weddingStyle: "traditional_formal",
    typographyCategory: "engraved_serif",
    basePrompt:
      "Traditional three-letter monogram with prominent central surname initial '{surnameInitial}' flanked by partner initials '{initial1}' and '{initial2}'. Classic engraved serif proportions, black on white background.",
    negativePrompt: ["script font", "casual handwriting", "color"],
    requiredFields: ["initials", "surname"],
    optionalFields: [],
  },
  {
    id: "botanical_wreath",
    name: "Botanical Wreath",
    assetType: "botanical_wreath",
    weddingStyle: "romantic_garden",
    typographyCategory: "old_style_serif",
    basePrompt:
      "An isolated circular botanical wreath woven with garden rose leaves, eucalyptus sprigs, and delicate olive branches. Fine line ink drawing, centered, black art on pure white background, no text inside.",
    negativePrompt: ["text", "names", "mockup", "paper texture", "shadow"],
    requiredFields: [],
    optionalFields: ["floralType"],
  },
  {
    id: "engraved_floral_crest",
    name: "Engraved Floral Crest",
    assetType: "wedding_crest",
    weddingStyle: "european_estate",
    typographyCategory: "engraved_serif",
    basePrompt:
      "Vintage heraldic wedding crest frame outlined in fine engraved botanical vines and classical shield contours. Isolated artwork, black ink on pure white background, no central text.",
    negativePrompt: ["text", "names", "color fill", "shadows"],
    requiredFields: [],
    optionalFields: [],
  },
  {
    id: "fine_line_corner_floral",
    name: "Fine-Line Corner Floral",
    assetType: "corner_ornament",
    weddingStyle: "fine_art",
    typographyCategory: "high_contrast_serif",
    basePrompt:
      "Elegant stationery corner ornament featuring fine-line botanical rose sprigs and organic leaf flourishes. Isolated corner art, black on white.",
    negativePrompt: ["text", "heavy solid fill", "color"],
    requiredFields: [],
    optionalFields: [],
  },
  {
    id: "botanical_divider",
    name: "Botanical Divider",
    assetType: "invitation_divider",
    weddingStyle: "editorial_luxury",
    typographyCategory: "editorial_sans",
    basePrompt:
      "Isolated horizontal invitation divider ornament with a delicate central olive leaf cluster and hairline rules. Black artwork on white background.",
    negativePrompt: ["text", "vertical orientation", "color"],
    requiredFields: [],
    optionalFields: [],
  },
  {
    id: "art_deco_frame",
    name: "Art Deco Frame",
    assetType: "invitation_border",
    weddingStyle: "art_deco",
    typographyCategory: "monogram_display",
    basePrompt:
      "Architectural 1920s Art Deco rectangular border frame with crisp geometric corner flourishes. Crisp black line art on pure white background, no text.",
    negativePrompt: ["curved flowers", "organic vines", "color", "text"],
    requiredFields: [],
    optionalFields: [],
  },
  {
    id: "vintage_estate_crest",
    name: "Vintage Estate Crest",
    assetType: "wedding_crest",
    weddingStyle: "european_estate",
    typographyCategory: "engraved_serif",
    basePrompt:
      "Ornate noble family crest border with intricate scrollwork, leaf wreaths, and vintage etching detail. Isolated black vector ornament on pure white background.",
    negativePrompt: ["text", "modern", "flat vector clipart"],
    requiredFields: [],
    optionalFields: [],
  },
];
