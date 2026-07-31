export interface SwatchColor {
  name: string;
  hex: string;
  role: "primary" | "accent" | "background" | "neutral" | "subtle";
}

export interface WeddingPaletteRecord {
  id: string;
  name: string;
  category: "traditional" | "floral" | "editorial" | "coastal" | "autumn";
  categoryLabel: string;
  description: string;
  weddingTags: string[];
  swatches: SwatchColor[];
}

export const CURATED_PALETTES: WeddingPaletteRecord[] = [
  // ── 1. TRADITIONAL & BLACK TIE ─────────────────────────────────────────────
  {
    id: "parisian_black_tie",
    name: "Parisian Black Tie",
    category: "traditional",
    categoryLabel: "Traditional & Black Tie",
    description: "Classic high-contrast black tie stationery identity with burnished gold accents.",
    weddingTags: ["black tie", "formal", "parisian", "high contrast", "editorial"],
    swatches: [
      { name: "Onyx Black", hex: "#1C1917", role: "primary" },
      { name: "Vow Gold", hex: "#C9A251", role: "accent" },
      { name: "French Cream", hex: "#FBF9F5", role: "background" },
      { name: "Pewter Slate", hex: "#57534E", role: "neutral" },
      { name: "Pearl Grey", hex: "#E7E5E4", role: "subtle" },
    ],
  },
  {
    id: "estate_champagne",
    name: "Estate Champagne",
    category: "traditional",
    categoryLabel: "Traditional & Black Tie",
    description: "Refined European estate palette with warm champagne tones and deep espresso text.",
    weddingTags: ["champagne", "estate", "european", "heritage", "warm"],
    swatches: [
      { name: "Deep Espresso", hex: "#3A2E2B", role: "primary" },
      { name: "Burnished Brass", hex: "#D4AF37", role: "accent" },
      { name: "Warm Champagne", hex: "#E8D8C8", role: "background" },
      { name: "Estate Linen", hex: "#F5F2EB", role: "neutral" },
      { name: "Soft Bronze", hex: "#8C7A6B", role: "subtle" },
    ],
  },
  {
    id: "heritage_gold_ivory",
    name: "Heritage Gold & Ivory",
    category: "traditional",
    categoryLabel: "Traditional & Black Tie",
    description: "Time-tested luxury stationery palette featuring gold leaf accent tones.",
    weddingTags: ["gold leaf", "ivory", "classic", "formal", "crest"],
    swatches: [
      { name: "Classic Gold", hex: "#C9A251", role: "primary" },
      { name: "Midnight Ink", hex: "#0F172A", role: "accent" },
      { name: "Pure Ivory", hex: "#FAF8F5", role: "background" },
      { name: "Antique Brass", hex: "#A38338", role: "neutral" },
      { name: "Parchment", hex: "#F3EFE6", role: "subtle" },
    ],
  },
  {
    id: "monochrome_editorial",
    name: "Monochrome Editorial",
    category: "traditional",
    categoryLabel: "Traditional & Black Tie",
    description: "Striking black and white minimalism tailored for modern luxury typography.",
    weddingTags: ["minimalist", "monochrome", "modern", "black and white"],
    swatches: [
      { name: "Velvet Noir", hex: "#09090B", role: "primary" },
      { name: "Pure White", hex: "#FFFFFF", role: "background" },
      { name: "Charcoal Ink", hex: "#27272A", role: "accent" },
      { name: "Slate Pewter", hex: "#71717A", role: "neutral" },
      { name: "Soft Fog", hex: "#F4F4F5", role: "subtle" },
    ],
  },

  // ── 2. FLORAL & BOTANICAL ──────────────────────────────────────────────────
  {
    id: "garden_rose_eucalyptus",
    name: "Garden Rose & Eucalyptus",
    category: "floral",
    categoryLabel: "Floral & Botanical",
    description: "Soft romantic blush petals grounded by muted botanical eucalyptus green.",
    weddingTags: ["blush", "eucalyptus", "garden", "romantic", "botanical"],
    swatches: [
      { name: "Blush Petal", hex: "#D8A47F", role: "primary" },
      { name: "Eucalyptus Green", hex: "#8EA38C", role: "accent" },
      { name: "Soft Linen", hex: "#FAF7F2", role: "background" },
      { name: "Muted Crimson", hex: "#9B4B52", role: "neutral" },
      { name: "Dusty Rose", hex: "#E9C3B4", role: "subtle" },
    ],
  },
  {
    id: "peony_burgundy",
    name: "Peony & Velvet Burgundy",
    category: "floral",
    categoryLabel: "Floral & Botanical",
    description: "Lush deep burgundy wine tones paired with soft peony pink and sage foliage.",
    weddingTags: ["burgundy", "peony", "dramatic floral", "fall floral", "lush"],
    swatches: [
      { name: "Velvet Burgundy", hex: "#581825", role: "primary" },
      { name: "Peony Pink", hex: "#F4D3C6", role: "accent" },
      { name: "Fresh Sage", hex: "#7E8D7B", role: "background" },
      { name: "Rosewood", hex: "#8B4255", role: "neutral" },
      { name: "Warm Pearl", hex: "#FAF8F6", role: "subtle" },
    ],
  },
  {
    id: "french_lavender_sage",
    name: "French Lavender & Sage",
    category: "floral",
    categoryLabel: "Floral & Botanical",
    description: "Provencal countryside palette with soft lavender dusk and muted dried sage.",
    weddingTags: ["lavender", "provence", "sage", "romantic", "french"],
    swatches: [
      { name: "Lavender Dusk", hex: "#7C75A3", role: "primary" },
      { name: "Dried Sage", hex: "#7D8D7E", role: "accent" },
      { name: "Provencal Cream", hex: "#FAF8F5", role: "background" },
      { name: "Plum Accent", hex: "#5B4059", role: "neutral" },
      { name: "Soft Mauve", hex: "#D2C9DB", role: "subtle" },
    ],
  },
  {
    id: "wildflower_meadow",
    name: "Wildflower Meadow",
    category: "floral",
    categoryLabel: "Floral & Botanical",
    description: "Vibrant botanical palette inspired by sunlit summer wildflower fields.",
    weddingTags: ["wildflower", "summer", "botanical", "buttercup", "cornflower"],
    swatches: [
      { name: "Buttercup Gold", hex: "#D9A036", role: "primary" },
      { name: "Dusty Cornflower", hex: "#5B80A8", role: "accent" },
      { name: "Meadow Green", hex: "#738B67", role: "background" },
      { name: "Cream Paper", hex: "#FBF9F5", role: "neutral" },
      { name: "Soft Rust", hex: "#C87D55", role: "subtle" },
    ],
  },
  {
    id: "olive_grove_terracotta",
    name: "Olive Grove & Terracotta",
    category: "floral",
    categoryLabel: "Floral & Botanical",
    description: "Earthy Mediterranean olive foliage paired with sun-baked terracotta tile.",
    weddingTags: ["olive", "terracotta", "mediterranean", "earthy", "tuscan"],
    swatches: [
      { name: "Mediterranean Olive", hex: "#586048", role: "primary" },
      { name: "Tuscan Terracotta", hex: "#C87B64", role: "accent" },
      { name: "Warm Sand", hex: "#EADCC9", role: "background" },
      { name: "Espresso Bark", hex: "#3A2A23", role: "neutral" },
      { name: "Soft Almond", hex: "#F5EFE6", role: "subtle" },
    ],
  },

  // ── 3. EDITORIAL & MODERN ──────────────────────────────────────────────────
  {
    id: "minimalist_parchment",
    name: "Minimalist Parchment",
    category: "editorial",
    categoryLabel: "Editorial & Modern",
    description: "Quiet luxury aesthetic focusing on warm tactile parchment and soft charcoal ink.",
    weddingTags: ["minimalist", "quiet luxury", "tactile", "parchment", "modern"],
    swatches: [
      { name: "Charcoal Ink", hex: "#292524", role: "primary" },
      { name: "Warm Gold", hex: "#B89748", role: "accent" },
      { name: "Soft Parchment", hex: "#F5F3EF", role: "background" },
      { name: "Taupe Neutral", hex: "#78716C", role: "neutral" },
      { name: "Alabaster", hex: "#E7E5E4", role: "subtle" },
    ],
  },
  {
    id: "high_fashion_monochrome",
    name: "High Fashion Monochrome",
    category: "editorial",
    categoryLabel: "Editorial & Modern",
    description: "Sleek magazine-style editorial palette with sharp contrast.",
    weddingTags: ["fashion", "magazine", "vogue", "sharp", "editorial"],
    swatches: [
      { name: "Deep Ink", hex: "#000000", role: "primary" },
      { name: "Champagne Gold", hex: "#D8C39D", role: "accent" },
      { name: "Vogue White", hex: "#FFFFFF", role: "background" },
      { name: "Gunmetal", hex: "#3F3F46", role: "neutral" },
      { name: "Off White", hex: "#F8F8F8", role: "subtle" },
    ],
  },

  // ── 4. COASTAL & DESTINATION ───────────────────────────────────────────────
  {
    id: "coastal_navy_seasalt",
    name: "Coastal Navy & Sea Salt",
    category: "coastal",
    categoryLabel: "Coastal & Destination",
    description: "Seaside estate palette with crisp ocean navy and sun-bleached linen.",
    weddingTags: ["coastal", "navy", "sea salt", "ocean", "nautical luxury"],
    swatches: [
      { name: "Deep Ocean Navy", hex: "#1E293B", role: "primary" },
      { name: "Brass Accent", hex: "#CA8A04", role: "accent" },
      { name: "Sea Salt Linen", hex: "#F8FAFC", role: "background" },
      { name: "Driftwood Slate", hex: "#64748B", role: "neutral" },
      { name: "Cloud Grey", hex: "#E2E8F0", role: "subtle" },
    ],
  },
  {
    id: "amalfi_citrus_tile",
    name: "Amalfi Citrus & Tile",
    category: "coastal",
    categoryLabel: "Coastal & Destination",
    description: "Vibrant Italian coastline palette inspired by lemon groves and majolica tile.",
    weddingTags: ["amalfi", "citrus", "italy", "tile", "destination"],
    swatches: [
      { name: "Mediterranean Tile Blue", hex: "#1E40AF", role: "primary" },
      { name: "Limoncello Yellow", hex: "#EAB308", role: "accent" },
      { name: "Terracotta Brick", hex: "#C2410C", role: "neutral" },
      { name: "Italian Linen", hex: "#FAFAFA", role: "background" },
      { name: "Sea Foam", hex: "#E0F2FE", role: "subtle" },
    ],
  },

  // ── 5. AUTUMN & TERRACOTTA ─────────────────────────────────────────────────
  {
    id: "autumn_rust_dahlia",
    name: "Autumn Rust & Dahlia",
    category: "autumn",
    categoryLabel: "Autumn & Terracotta",
    description: "Rich autumnal harvest tones with warm burnt rust and honeyed dahlia gold.",
    weddingTags: ["autumn", "rust", "dahlia", "harvest", "warm terracotta"],
    swatches: [
      { name: "Burnt Terracotta Rust", hex: "#9A3412", role: "primary" },
      { name: "Honeyed Gold", hex: "#D97706", role: "accent" },
      { name: "Warm Linen", hex: "#FFFBEB", role: "background" },
      { name: "Deep Amber", hex: "#78350F", role: "neutral" },
      { name: "Oatmeal", hex: "#FEF3C7", role: "subtle" },
    ],
  },
];
