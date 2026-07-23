import { create } from "zustand";
import { DesignBrief } from "../ai/brief-schema";
import { TypographyOptions } from "../typography/engine";
import { CURATED_FONTS } from "../typography/fonts-db";
import { AiGenerationType, PromptGuidanceConfig, DEFAULT_PROMPT_GUIDANCE } from "../ai/prompt-compiler";

export type CanvasFormat = "2_x_6" | "4_x_6" | "6_x_4" | "square";
export type StudioMode = "generative_ai" | "deterministic_vector";
export type TextBlendMode = "normal" | "multiply" | "overlay";

export interface ReferenceImage {
  id: string;
  url: string;
  name: string;
  tag: string;
}

export interface EditorState {
  projectId: string;
  projectTitle: string;
  assetType: string;

  // Studio Mode: Generative AI (OpenAI DALL-E 3) vs Deterministic Vector
  studioMode: StudioMode;
  aiGeneratedAssetUrl: string | null;

  // 2-Layer Composition System
  backgroundPatternAssetUrl: string | null; // Layer 1: Background & Pattern
  textLogoAssetUrl: string | null;          // Layer 2: Text & Monogram Logo
  textLayerBlendMode: TextBlendMode;         // Layer 2 Blend Mode: normal | multiply | overlay
  vectorOverlayEnabled: boolean;            // Enable Vector Typography overlay over AI backgrounds

  aiPrompt: string;

  // AI Generation Type: Text & Logo vs Background & Pattern
  aiGenerationType: AiGenerationType;
  promptGuidanceConfig: PromptGuidanceConfig;
  isPromptGuidanceModalOpen: boolean;

  // Canvas Format Mode: 2x6, 4x6, 6x4, or basic square mode
  canvasFormat: CanvasFormat;

  // Photobooth Strip Feature (2x6 format)
  photoboothMode: boolean;
  photoboothFrameUrl: string | null; // Custom PNG mock frame or default /photobooth-2x6-frame.png
  photoboothOffsetY: number;         // Vertical adjustment in px (-150 to +150)
  photoboothScale: number;           // Scale adjustment in percent (50 to 150)

  brief: DesignBrief;
  typographyOptions: TypographyOptions;

  referenceImages: ReferenceImage[];

  ornamentUrl: string | null;
  ornamentPosition: { x: number; y: number; scale: number };

  // Always flat white background
  previewMode: "white";
  zoomLevel: number; // 100% default zoom scaling

  messages: Array<{ role: "user" | "assistant" | "system"; content: string }>;
  isAiGenerating: boolean;

  setStudioMode: (mode: StudioMode) => void;
  setAiGeneratedAssetUrl: (url: string | null) => void;
  setBackgroundPatternAssetUrl: (url: string | null) => void;
  setTextLogoAssetUrl: (url: string | null) => void;
  setTextLayerBlendMode: (mode: TextBlendMode) => void;
  setVectorOverlayEnabled: (enabled: boolean) => void;
  setAiGenerationType: (type: AiGenerationType) => void;
  setPromptGuidanceConfig: (config: Partial<PromptGuidanceConfig>) => void;
  setIsPromptGuidanceModalOpen: (open: boolean) => void;
  setCanvasFormat: (format: CanvasFormat) => void;
  setPhotoboothMode: (enabled: boolean) => void;
  setPhotoboothFrameUrl: (url: string | null) => void;
  setPhotoboothOffsetY: (offset: number) => void;
  setPhotoboothScale: (scale: number) => void;
  setBrief: (brief: Partial<DesignBrief>) => void;
  setTypographyOptions: (options: Partial<TypographyOptions>) => void;
  addReferenceImage: (img: ReferenceImage) => void;
  removeReferenceImage: (id: string) => void;
  setOrnamentUrl: (url: string | null) => void;
  setPreviewMode: (mode: "white") => void;
  setZoomLevel: (zoom: number) => void;
  addMessage: (msg: { role: "user" | "assistant" | "system"; content: string }) => void;
  setIsAiGenerating: (loading: boolean) => void;
  resetFields: () => void;
}

export function getFormatDimensions(format: CanvasFormat): { width: number; height: number; aspectRatio: string } {
  switch (format) {
    case "2_x_6":
      return { width: 600, height: 1800, aspectRatio: "1/3" };
    case "4_x_6":
      return { width: 1200, height: 1800, aspectRatio: "2/3" };
    case "6_x_4":
      return { width: 1800, height: 1200, aspectRatio: "3/2" };
    case "square":
    default:
      return { width: 1200, height: 1200, aspectRatio: "1/1" };
  }
}

const defaultBrief: DesignBrief = {
  assetType: "couple_logo",
  primaryText: "",
  secondaryText: "",
  initials: [],
  surname: "",
  date: "",
  location: "",
  layout: "stacked",
  typographyCategory: "high_contrast_serif",
  weddingStyle: "editorial_luxury",
  styleKeywords: ["editorial", "luxury", "minimal", "formal"],
  colorMode: "black_on_white",
  background: "pure_white",
  ornamentType: "none",
  floralType: "none",
  referenceInstructions: [],
  generationPrompt: "",
  negativePrompt: ["script font", "calligraphy", "chopin script", "mockup", "paper texture", "leaves"],
  outputMode: "hybrid",
  aspectRatio: "1:1",
  recommendedFonts: ["Cormorant Garamond", "Bodoni Moda", "Cinzel"],
  productionNotes: [],
};

// Default letter spacing natively set to -1px for perfect cursive letter connection
const defaultTypography: TypographyOptions = {
  primaryText: "",
  secondaryText: "",
  ampersandText: "&",
  dateText: "",
  fontFamily: "Cormorant Garamond",
  fontSize: 150,
  primaryFontSize: 150,
  secondaryFontSize: 150,
  dateFontSize: 42,
  hashtagFontSize: 36,
  fontWeight: 400,
  letterSpacing: -1, // Set to -1px default
  lineHeight: 1.15,
  nameGap: 120,
  layout: "stacked",
  ampersandScale: 0.6,
  ampersandOffsetY: 0,
  colorMode: "black_on_white",
};

export const useEditorStore = create<EditorState>((set) => ({
  projectId: "proj_new_client",
  projectTitle: "New Client Wedding Mark",
  assetType: "couple_logo",

  studioMode: "generative_ai",
  aiGeneratedAssetUrl: null,

  // 2-Layer Composition System defaults with blend mode
  backgroundPatternAssetUrl: null,
  textLogoAssetUrl: null,
  textLayerBlendMode: "multiply", // Default to multiply for seamless print blending
  vectorOverlayEnabled: true,     // Vector text overlay on top of AI backgrounds enabled by default

  aiPrompt: "",

  aiGenerationType: "text_logo",
  promptGuidanceConfig: DEFAULT_PROMPT_GUIDANCE,
  isPromptGuidanceModalOpen: false,

  canvasFormat: "square",

  // Photobooth strip mode defaults (enabled when selecting 2x6)
  photoboothMode: true,
  photoboothFrameUrl: null,
  photoboothOffsetY: 0,
  photoboothScale: 100,

  brief: defaultBrief,
  typographyOptions: defaultTypography,

  referenceImages: [],

  ornamentUrl: null,
  ornamentPosition: { x: 500, y: 500, scale: 1 },

  // Always flat white background with 100% default zoom scaling
  previewMode: "white",
  zoomLevel: 100,

  messages: [
    {
      role: "assistant",
      content: "Canvas ready. Enter prompt to generate assets.",
    },
  ],
  isAiGenerating: false,

  setStudioMode: (mode) => set({ studioMode: mode }),
  setAiGeneratedAssetUrl: (url) => set({ aiGeneratedAssetUrl: url, textLogoAssetUrl: url }),
  setBackgroundPatternAssetUrl: (url) => set({ backgroundPatternAssetUrl: url }),
  setTextLogoAssetUrl: (url) => set({ textLogoAssetUrl: url, aiGeneratedAssetUrl: url }),
  setTextLayerBlendMode: (mode) => set({ textLayerBlendMode: mode }),
  setVectorOverlayEnabled: (enabled) => set({ vectorOverlayEnabled: enabled }),
  setAiGenerationType: (type) => set({ aiGenerationType: type }),
  setPromptGuidanceConfig: (config) =>
    set((state) => ({ promptGuidanceConfig: { ...state.promptGuidanceConfig, ...config } })),
  setIsPromptGuidanceModalOpen: (open) => set({ isPromptGuidanceModalOpen: open }),
  addReferenceImage: (img) => set((state) => ({ referenceImages: [...state.referenceImages, img] })),
  removeReferenceImage: (id) =>
    set((state) => ({ referenceImages: state.referenceImages.filter((img) => img.id !== id) })),

  setCanvasFormat: (format) => {
    const dims = getFormatDimensions(format);
    set((state) => ({
      canvasFormat: format,
      photoboothMode: format === "2_x_6" ? true : false,
      typographyOptions: {
        ...state.typographyOptions,
        canvasWidth: dims.width,
        canvasHeight: dims.height,
      },
    }));
  },

  setPhotoboothMode: (enabled) => set({ photoboothMode: enabled }),
  setPhotoboothFrameUrl: (url) => set({ photoboothFrameUrl: url }),
  setPhotoboothOffsetY: (offset) => set({ photoboothOffsetY: offset }),
  setPhotoboothScale: (scale) => set({ photoboothScale: scale }),

  setBrief: (newBrief) =>
    set((state) => ({
      brief: { ...state.brief, ...newBrief },
      typographyOptions: {
        ...state.typographyOptions,
        primaryText: newBrief.primaryText ?? state.typographyOptions.primaryText,
        secondaryText: newBrief.secondaryText ?? state.typographyOptions.secondaryText,
        layout: (newBrief.layout as any) ?? state.typographyOptions.layout,
      },
    })),

  setTypographyOptions: (opts) =>
    set((state) => {
      const updatedOpts = { ...state.typographyOptions, ...opts };

      // Automatically reset letter spacing to -1 when selecting a cursive/script font
      if (opts.fontFamily) {
        const foundFont = CURATED_FONTS.find((f) => f.familyName === opts.fontFamily);
        const isScript =
          foundFont?.classification === "script" ||
          opts.fontFamily.toLowerCase().includes("script") ||
          opts.fontFamily.toLowerCase().includes("brush") ||
          opts.fontFamily.toLowerCase().includes("calligraphy") ||
          opts.fontFamily.toLowerCase().includes("cursive");

        if (isScript && opts.letterSpacing === undefined) {
          updatedOpts.letterSpacing = -1;
        }
      }

      return { typographyOptions: updatedOpts };
    }),

  setOrnamentUrl: (url) => set({ ornamentUrl: url }),
  setPreviewMode: (mode) => set({ previewMode: mode }),
  setZoomLevel: (zoom) => set({ zoomLevel: zoom }),

  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
  setIsAiGenerating: (loading) => set({ isAiGenerating: loading }),

  resetFields: () =>
    set({
      brief: defaultBrief,
      typographyOptions: defaultTypography,
      aiGeneratedAssetUrl: null,
      backgroundPatternAssetUrl: null,
      textLogoAssetUrl: null,
      textLayerBlendMode: "multiply",
      vectorOverlayEnabled: true,
      ornamentUrl: null,
      referenceImages: [],
      photoboothMode: true,
      photoboothFrameUrl: null,
      photoboothOffsetY: 0,
      photoboothScale: 100,
    }),
}));
