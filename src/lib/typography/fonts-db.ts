export interface FontRecord {
  id: string;
  familyName: string;
  provider: "google" | "local" | "custom";
  classification: "serif" | "sans" | "script" | "decorative";
  subclassification: string;
  description: string;
  supportedWeights: number[];
  weddingTags: string[];
  bestFor: string[];
  licensing: {
    licenseName: string;
    commercialApproved: boolean;
    embeddingApproved: boolean;
    exportApproved: boolean;
  };
  sampleSvgPath?: string;
}

export const CURATED_FONTS: FontRecord[] = [
  {
    id: "cormorant_garamond",
    familyName: "Cormorant Garamond",
    provider: "google",
    classification: "serif",
    subclassification: "high_contrast_serif",
    description: "Refined capitals, elegant high contrast, and strong editorial luxury character.",
    supportedWeights: [300, 400, 500, 600, 700],
    weddingTags: ["editorial", "luxury", "formal", "high contrast", "romantic", "best for initials"],
    bestFor: ["couple wordmarks", "formal invitations", "editorial monograms"],
    licensing: {
      licenseName: "OFL (Open Font License)",
      commercialApproved: true,
      embeddingApproved: true,
      exportApproved: true,
    },
  },
  {
    id: "bodoni_moda",
    familyName: "Bodoni Moda",
    provider: "google",
    classification: "serif",
    subclassification: "didone_serif",
    description: "Stately Didone serif with extreme vertical stress and dramatic thick-thin strokes.",
    supportedWeights: [400, 600, 800, 900],
    weddingTags: ["black tie", "high fashion", "french editorial", "dramatic"],
    bestFor: ["parisian wordmarks", "black tie monograms", "high fashion logos"],
    licensing: {
      licenseName: "OFL",
      commercialApproved: true,
      embeddingApproved: true,
      exportApproved: true,
    },
  },
  {
    id: "cinzel",
    familyName: "Cinzel",
    provider: "google",
    classification: "serif",
    subclassification: "classical_roman_serif",
    description: "Inspired by 1st-century Roman inscriptions, classical proportions with refined serifs.",
    supportedWeights: [400, 600, 700, 900],
    weddingTags: ["heritage", "european estate", "classical", "formal", "all caps"],
    bestFor: ["crest monograms", "estate logos", "formal dates"],
    licensing: {
      licenseName: "OFL",
      commercialApproved: true,
      embeddingApproved: true,
      exportApproved: true,
    },
  },
  {
    id: "playfair_display",
    familyName: "Playfair Display",
    provider: "google",
    classification: "serif",
    subclassification: "high_contrast_serif",
    description: "Transitional display serif with graceful letterforms and beautiful ampersands.",
    supportedWeights: [400, 600, 700, 800, 900],
    weddingTags: ["romantic", "traditional", "elegant", "high contrast"],
    bestFor: ["stacked wordmarks", "couples names", "save the dates"],
    licensing: {
      licenseName: "OFL",
      commercialApproved: true,
      embeddingApproved: true,
      exportApproved: true,
    },
  },
  {
    id: "inter",
    familyName: "Inter",
    provider: "google",
    classification: "sans",
    subclassification: "minimal_sans",
    description: "Precision-engineered geometric sans-serif for clean modern minimalist wedding identity.",
    supportedWeights: [300, 400, 500, 600, 700],
    weddingTags: ["modern minimal", "clean", "architectural", "contemporary"],
    bestFor: ["minimal wordmarks", "supporting text", "dates and locations"],
    licensing: {
      licenseName: "OFL",
      commercialApproved: true,
      embeddingApproved: true,
      exportApproved: true,
    },
  },
  {
    id: "alex_brush",
    familyName: "Alex Brush",
    provider: "google",
    classification: "script",
    subclassification: "formal_calligraphy",
    description: "Flowing formal calligraphy script with beautiful connecting swashes.",
    supportedWeights: [400],
    weddingTags: ["romantic", "calligraphy", "script accent"],
    bestFor: ["script name accents", "romantic initials"],
    licensing: {
      licenseName: "OFL",
      commercialApproved: true,
      embeddingApproved: true,
      exportApproved: true,
    },
  },
];
