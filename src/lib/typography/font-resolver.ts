import { CURATED_FONTS, FontRecord } from "./fonts-db";

export interface FontStyleConfig {
  familyName: string;
  cssFontFamily: string;
  googleFontUrl?: string;
  webFontName: string;
}

// Dynamic in-memory registry for user-uploaded custom fonts fetched via /api/fonts
const dynamicFontsMap = new Map<string, FontRecord>();

export function registerDynamicFonts(fonts: FontRecord[]): void {
  if (!Array.isArray(fonts)) return;
  fonts.forEach((f) => {
    if (f && f.familyName) {
      dynamicFontsMap.set(f.familyName.toLowerCase(), f);
    }
  });
}

/**
 * Resolves a font name to its full config including Google Fonts URL.
 *
 * Resolution order:
 *  1. Exact match in CURATED_FONTS by familyName (case-insensitive)
 *  2. Exact match in dynamically registered custom fonts by familyName (case-insensitive)
 *  3. Partial keyword fallback for legacy font name aliases
 *  4. Default to Cormorant Garamond
 */
export function resolveFontConfig(rawFamilyName: string, classification?: string): FontStyleConfig {
  const clean = (rawFamilyName || "Cormorant Garamond").replace(/['"]/g, "").trim();
  const lower = clean.toLowerCase();

  // ── 1. Exact DB lookup in curated fonts ──────────────────────────────────
  const curatedMatch = CURATED_FONTS.find(
    (f) => f.familyName.toLowerCase() === lower
  );
  if (curatedMatch) {
    return {
      familyName: curatedMatch.familyName,
      webFontName: curatedMatch.familyName,
      googleFontUrl: curatedMatch.googleFontUrl,
      cssFontFamily: buildCssFontFamily(curatedMatch.familyName, curatedMatch.classification),
    };
  }

  // ── 2. Exact DB lookup in dynamically registered custom fonts ────────────
  const dynamicMatch = dynamicFontsMap.get(lower);
  if (dynamicMatch) {
    return {
      familyName: dynamicMatch.familyName,
      webFontName: dynamicMatch.familyName,
      googleFontUrl: dynamicMatch.googleFontUrl,
      cssFontFamily: buildCssFontFamily(dynamicMatch.familyName, dynamicMatch.classification),
    };
  }

  // ── 3. Legacy keyword fallbacks (for old font names & aliases) ───────────

  // Bodoni variants
  if (lower.includes("bodoni") || lower.startsWith("bod")) {
    return {
      familyName: clean,
      webFontName: "Bodoni Moda",
      googleFontUrl: "https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900&display=swap",
      cssFontFamily: `'${clean}', 'Bodoni Moda', Didot, 'Didot LT STD', Garamond, serif`,
    };
  }

  // Garamond / Cormorant variants
  if (lower.includes("cormorant") || lower.includes("garamond")) {
    return {
      familyName: clean,
      webFontName: "Cormorant Garamond",
      googleFontUrl: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300..700;1,300..700&display=swap",
      cssFontFamily: `'${clean}', 'Cormorant Garamond', Garamond, Baskerville, serif`,
    };
  }

  // Cinzel variants
  if (lower.includes("cinzel")) {
    return {
      familyName: clean,
      webFontName: "Cinzel",
      googleFontUrl: "https://fonts.googleapis.com/css2?family=Cinzel:wght@400..900&display=swap",
      cssFontFamily: `'${clean}', 'Cinzel', 'Trajan Pro', 'Times New Roman', serif`,
    };
  }

  // Playfair variants
  if (lower.includes("playfair")) {
    return {
      familyName: clean,
      webFontName: "Playfair Display",
      googleFontUrl: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap",
      cssFontFamily: `'${clean}', 'Playfair Display', Georgia, serif`,
    };
  }

  // Baskerville variants
  if (lower.includes("bask")) {
    return {
      familyName: clean,
      webFontName: "Libre Baskerville",
      googleFontUrl: "https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap",
      cssFontFamily: `'${clean}', 'Libre Baskerville', Baskerville, Georgia, serif`,
    };
  }

  // Script / calligraphy keywords
  if (
    classification === "script" ||
    lower.includes("script") ||
    lower.includes("calligraphy") ||
    lower.includes("brush") ||
    lower.includes("allura") ||
    lower.includes("vibes") ||
    lower.includes("sacramento") ||
    lower.includes("tangerine") ||
    lower.includes("pinyon") ||
    lower.includes("dancing") ||
    lower.includes("delafield")
  ) {
    return {
      familyName: clean,
      webFontName: "Great Vibes",
      googleFontUrl: "https://fonts.googleapis.com/css2?family=Great+Vibes&family=Alex+Brush&display=swap",
      cssFontFamily: `'${clean}', 'Great Vibes', 'Alex Brush', 'Brush Script MT', cursive`,
    };
  }

  // Sans-serif keywords
  if (
    classification === "sans" ||
    lower.includes("sans") ||
    lower.includes("inter") ||
    lower.includes("montserrat") ||
    lower.includes("raleway") ||
    lower.includes("josefin")
  ) {
    return {
      familyName: clean,
      webFontName: "Inter",
      googleFontUrl: "https://fonts.googleapis.com/css2?family=Inter:wght@300..800&display=swap",
      cssFontFamily: `'${clean}', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
    };
  }

  // ── 4. Universal default ─────────────────────────────────────────────────
  return {
    familyName: clean,
    webFontName: "Cormorant Garamond",
    googleFontUrl: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300..700;1,300..700&display=swap",
    cssFontFamily: `'${clean}', 'Cormorant Garamond', Georgia, serif`,
  };
}

/** Build a sensible CSS font-family stack for a given classification. */
function buildCssFontFamily(familyName: string, classification: string): string {
  switch (classification) {
    case "script":
      return `'${familyName}', 'Great Vibes', 'Alex Brush', cursive`;
    case "sans":
      return `'${familyName}', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif`;
    case "decorative":
      return `'${familyName}', 'Cinzel', 'Trajan Pro', serif`;
    default:
      return `'${familyName}', 'Cormorant Garamond', Georgia, serif`;
  }
}
