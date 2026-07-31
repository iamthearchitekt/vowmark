export interface SwatchColor {
  name: string;
  hex: string;
  role: "primary" | "accent" | "background" | "neutral" | "subtle";
}

export interface WeddingPaletteRecord {
  id: string;
  name: string;
  category: "traditional" | "floral" | "coastal" | "editorial" | "autumn";
  categoryLabel: string;
  description: string;
  weddingTags: string[];
  swatches: SwatchColor[];
}

export const CURATED_PALETTES: WeddingPaletteRecord[] = [
  // ── 1. USER SUBMITTED HIGH-END CLASSICS ──────────────────────────────────
  {
    id: "black_white_champagne_gold",
    name: "Black, White & Champagne Gold",
    category: "traditional",
    categoryLabel: "Traditional & Black Tie",
    description: "Black-tie, ballroom, and luxury hotel identity with rich champagne gold.",
    weddingTags: ["black tie", "ballroom", "luxury hotel", "champagne gold", "classic"],
    swatches: [
      { name: "Rich Black", hex: "#111111", role: "primary" },
      { name: "Champagne Gold", hex: "#B59561", role: "accent" },
      { name: "Silk White", hex: "#F8F5EF", role: "background" },
      { name: "Warm Champagne", hex: "#D8C3A5", role: "neutral" },
    ],
  },
  {
    id: "ivory_champagne_antique_gold",
    name: "Ivory, Champagne & Antique Gold",
    category: "traditional",
    categoryLabel: "Traditional & Black Tie",
    description: "Warm, traditional, and expensive-looking luxury stationery aesthetic.",
    weddingTags: ["warm", "antique gold", "expensive", "ivory", "traditional"],
    swatches: [
      { name: "Bronze Umber", hex: "#6B5A47", role: "primary" },
      { name: "Antique Gold", hex: "#B89A65", role: "accent" },
      { name: "Soft Ivory", hex: "#F4EFE5", role: "background" },
      { name: "Warm Champagne", hex: "#DDD0BD", role: "neutral" },
    ],
  },
  {
    id: "white_greenery_soft_black",
    name: "White, Greenery & Soft Black",
    category: "floral",
    categoryLabel: "Floral & Botanical",
    description: "Botanical, clean, and perennial foliage with soft black lettering.",
    weddingTags: ["botanical", "greenery", "clean", "perennial", "soft black"],
    swatches: [
      { name: "Deep Forest", hex: "#344035", role: "primary" },
      { name: "Eucalyptus Green", hex: "#79806B", role: "accent" },
      { name: "Linen White", hex: "#FAF9F5", role: "background" },
      { name: "Soft Black Ink", hex: "#1C1C1A", role: "neutral" },
    ],
  },
  {
    id: "navy_ivory_gold",
    name: "Navy, Ivory & Gold",
    category: "coastal",
    categoryLabel: "Coastal & Destination",
    description: "Formal, coastal, or country-club wedding identity with navy and gold.",
    weddingTags: ["navy", "coastal", "country club", "formal", "gold"],
    swatches: [
      { name: "Formal Navy", hex: "#18283C", role: "primary" },
      { name: "Muted Gold", hex: "#C2A46D", role: "accent" },
      { name: "Warm Ivory", hex: "#F5F0E6", role: "background" },
      { name: "Slate Blue", hex: "#8793A1", role: "neutral" },
    ],
  },
  {
    id: "black_ivory_greenery",
    name: "Black, Ivory & Greenery",
    category: "editorial",
    categoryLabel: "Editorial & Modern",
    description: "Modern formal with organic restraint and muted olive sage foliage.",
    weddingTags: ["modern formal", "organic restraint", "greenery", "ivory", "black"],
    swatches: [
      { name: "Velvet Black", hex: "#121212", role: "primary" },
      { name: "Organic Greenery", hex: "#65715A", role: "accent" },
      { name: "Soft Ivory", hex: "#F2EEE5", role: "background" },
      { name: "Muted Olive Sage", hex: "#A9AE9D", role: "neutral" },
    ],
  },
  {
    id: "french_blue_porcelain_champagne",
    name: "French Blue, Porcelain & Champagne",
    category: "coastal",
    categoryLabel: "Coastal & Destination",
    description: "Estate, European, and refined chateau palette with French blue and champagne.",
    weddingTags: ["french blue", "estate", "european", "porcelain", "champagne"],
    swatches: [
      { name: "French Blue", hex: "#718CA3", role: "primary" },
      { name: "Warm Champagne", hex: "#C8AE82", role: "accent" },
      { name: "Soft Porcelain", hex: "#E3E8E8", role: "background" },
      { name: "Chateau Cream", hex: "#F5F1E9", role: "neutral" },
    ],
  },

  // ── 2. FLORAL & BOTANICAL ──────────────────────────────────────────────────
  {
    id: "garden_rose_eucalyptus",
    name: "Garden Rose & Eucalyptus",
    category: "floral",
    categoryLabel: "Floral & Botanical",
    description: "Soft romantic blush rose petals grounded by muted botanical eucalyptus green.",
    weddingTags: ["blush", "eucalyptus", "garden rose", "romantic", "botanical"],
    swatches: [
      { name: "Blush Petal", hex: "#D8A47F", role: "primary" },
      { name: "Eucalyptus Green", hex: "#8EA38C", role: "accent" },
      { name: "Soft Linen", hex: "#FAF7F2", role: "background" },
      { name: "Muted Crimson", hex: "#9B4B52", role: "neutral" },
      { name: "Dusty Rose", hex: "#E9C3B4", role: "subtle" },
    ],
  },
  {
    id: "english_garden_hydrangea",
    name: "English Garden Hydrangea",
    category: "floral",
    categoryLabel: "Floral & Botanical",
    description: "Serene English estate garden tones featuring dusty periwinkle hydrangea, lavender lilac, and sage.",
    weddingTags: ["hydrangea", "english garden", "periwinkle", "estate floral", "lilac"],
    swatches: [
      { name: "Dusty Hydrangea Blue", hex: "#5C768D", role: "primary" },
      { name: "Soft Lilac Bloom", hex: "#B8A3C4", role: "accent" },
      { name: "English Ivory", hex: "#FAF9F6", role: "background" },
      { name: "Pale Sage Leaf", hex: "#94A38B", role: "neutral" },
      { name: "Deep Slate Foliage", hex: "#3A4B58", role: "subtle" },
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
    id: "chateau_wisteria_blush",
    name: "Chateau Wisteria & Soft Blush",
    category: "floral",
    categoryLabel: "Floral & Botanical",
    description: "French chateau courtyard palette with cascading wisteria violet and ballet slipper blush.",
    weddingTags: ["wisteria", "chateau", "french floral", "blush", "violet"],
    swatches: [
      { name: "Wisteria Violet", hex: "#8C7496", role: "primary" },
      { name: "Ballet Blush", hex: "#F7E1D7", role: "accent" },
      { name: "Chateau Linen", hex: "#FAF6F0", role: "background" },
      { name: "Gilded Gold", hex: "#B89748", role: "neutral" },
      { name: "Deep Plum", hex: "#4A354A", role: "subtle" },
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

  // ── 3. COASTAL & DESTINATION ───────────────────────────────────────────────
  {
    id: "santorini_aegean_white",
    name: "Santorini Aegean & Chalk White",
    category: "coastal",
    categoryLabel: "Coastal & Destination",
    description: "Greek island aesthetic with deep Aegean blue, sun-baked terracotta, and whitewashed stone.",
    weddingTags: ["santorini", "aegean blue", "greece", "whitewashed", "mediterranean"],
    swatches: [
      { name: "Aegean Deep Blue", hex: "#005F73", role: "primary" },
      { name: "Chalk White", hex: "#FFFFFF", role: "background" },
      { name: "Sunwashed Ochre", hex: "#EE9B00", role: "accent" },
      { name: "Sea Foam Teal", hex: "#94D2BD", role: "neutral" },
      { name: "Deep Midnight Indigo", hex: "#0A2540", role: "subtle" },
    ],
  },
  {
    id: "lake_como_villa",
    name: "Lake Como Villa & Cypress",
    category: "coastal",
    categoryLabel: "Coastal & Destination",
    description: "Northern Italian lakefront luxury with deep teal water, villa terrazzo, and Italian cypress.",
    weddingTags: ["lake como", "italy", "villa luxury", "lakefront", "cypress"],
    swatches: [
      { name: "Lake Como Teal", hex: "#1B4965", role: "primary" },
      { name: "Italian Cypress", hex: "#2C5E3B", role: "accent" },
      { name: "Villa Terrazzo Linen", hex: "#F7F3E9", role: "background" },
      { name: "Aged Champagne", hex: "#E9D8A6", role: "neutral" },
      { name: "Deep Midnight", hex: "#0F2027", role: "subtle" },
    ],
  },
  {
    id: "harbor_island_pink_sand",
    name: "Harbor Island Pink Sand & Sea Glass",
    category: "coastal",
    categoryLabel: "Coastal & Destination",
    description: "Bahamian seaside destination identity combining soft pink coral sands and sea glass mint.",
    weddingTags: ["pink sand", "bahamas", "sea glass", "caribbean", "coastal chic"],
    swatches: [
      { name: "Pink Sand Coral", hex: "#E8C5C8", role: "primary" },
      { name: "Sea Glass Mint", hex: "#A8DADC", role: "accent" },
      { name: "Deep Ocean Ink", hex: "#1D3557", role: "neutral" },
      { name: "Pure Shell White", hex: "#FAF9F6", role: "background" },
      { name: "Sunset Gold", hex: "#E9C46A", role: "subtle" },
    ],
  },

  // ── 4. TRADITIONAL & BLACK TIE ─────────────────────────────────────────────
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
    id: "cotswolds_limestone_sage",
    name: "Cotswolds Limestone & Sage",
    category: "traditional",
    categoryLabel: "Traditional & Black Tie",
    description: "Classic English countryside estate featuring honey-colored Cotswold stone and sage foliage.",
    weddingTags: ["cotswolds", "english estate", "limestone", "sage", "heritage"],
    swatches: [
      { name: "Limestone Cream", hex: "#EBE4D8", role: "background" },
      { name: "Cotswolds Sage", hex: "#7E8D7B", role: "accent" },
      { name: "Deep Charcoal Ink", hex: "#2C2C2C", role: "primary" },
      { name: "Heritage Gold", hex: "#C9A251", role: "neutral" },
      { name: "Warm Parchment", hex: "#F7F5F0", role: "subtle" },
    ],
  },
  {
    id: "venetian_velvet_gold",
    name: "Venetian Velvet & Gilded Rose",
    category: "traditional",
    categoryLabel: "Traditional & Black Tie",
    description: "Dramatic Venetian palace palette with deep crimson velvet and antique gilded gold leaf.",
    weddingTags: ["venetian", "velvet", "crimson", "gilded gold", "palace luxury"],
    swatches: [
      { name: "Venetian Crimson", hex: "#6B1D2F", role: "primary" },
      { name: "Gilded Gold Leaf", hex: "#C9A251", role: "accent" },
      { name: "Palace Cream", hex: "#FDFBF7", role: "background" },
      { name: "Midnight Espresso", hex: "#24181E", role: "neutral" },
      { name: "Antique Bronze", hex: "#8C6D3F", role: "subtle" },
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
