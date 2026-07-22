export interface BotanicalPreset {
  id: string;
  name: string;
  category: "floral" | "foliage" | "wreath" | "divider" | "frame";
  styles: string[];
  description: string;
  promptSnippet: string;
}

export const BOTANICAL_PRESETS: BotanicalPreset[] = [
  {
    id: "rose_peony_wreath",
    name: "Rose & Peony Wreath",
    category: "wreath",
    styles: ["Romantic Garden", "Fine Art", "European Estate"],
    description: "Circular floral wreath with lush English garden roses, peonies, and delicate greenery.",
    promptSnippet: "isolated circular botanical wreath featuring fine ink line art of garden roses and peonies, black line art on pure white background",
  },
  {
    id: "olive_laurel_crest",
    name: "Olive & Laurel Crest",
    category: "wreath",
    styles: ["European Estate", "Black Tie", "Traditional Formal"],
    description: "Classic Mediterranean olive sprigs formed into an elegant heraldic crest loop.",
    promptSnippet: "isolated heraldic crest wreath made of delicate olive branches and laurel leaves, engraved vintage etching style, black on white",
  },
  {
    id: "eucalyptus_corner",
    name: "Eucalyptus Corner Cluster",
    category: "floral",
    styles: ["Botanical", "Modern Minimal", "Organic Modern"],
    description: "Subtle corner ornament of silver dollar eucalyptus sprigs.",
    promptSnippet: "isolated botanical corner ornament featuring eucalyptus leaves and fine line vines, minimal black ink illustration on pure white background",
  },
  {
    id: "botanical_divider_line",
    name: "Botanical Hairline Divider",
    category: "divider",
    styles: ["Editorial Luxury", "French Editorial", "Modern Minimal"],
    description: "Horizontal divider featuring a delicate central olive or leaf flourish.",
    promptSnippet: "isolated horizontal stationery divider with delicate central olive leaves and hairline rule, crisp black vector on pure white",
  },
  {
    id: "art_deco_frame",
    name: "Art Deco Geometric Frame",
    category: "frame",
    styles: ["Art Deco", "Black Tie", "High-Fashion"],
    description: "Architectural 1920s geometric invitation border with crisp corners.",
    promptSnippet: "isolated vintage Art Deco geometric border frame, crisp black line art pattern on pure white background, no text",
  },
];
