export interface FontStyleConfig {
  familyName: string;
  cssFontFamily: string;
  googleFontUrl?: string;
  webFontName: string;
}

export function resolveFontConfig(rawFamilyName: string, classification?: string): FontStyleConfig {
  const clean = (rawFamilyName || "Cormorant Garamond").replace(/['"]/g, "").trim();
  const lower = clean.toLowerCase();

  // 1. Bodoni variants (BodoniStd, BodoniStdBold, Bodoni Moda, etc.)
  if (lower.includes("bodoni") || lower.startsWith("bod")) {
    return {
      familyName: clean,
      webFontName: "Bodoni Moda",
      googleFontUrl: "https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900&display=swap",
      cssFontFamily: `'${clean}', 'Bodoni Moda', Didot, 'Didot LT STD', 'Hoefler Text', Garamond, serif`,
    };
  }

  // 2. Garamond / Cormorant variants
  if (lower.includes("cormorant") || lower.includes("garamond")) {
    return {
      familyName: clean,
      webFontName: "Cormorant Garamond",
      googleFontUrl: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300..700;1,300..700&display=swap",
      cssFontFamily: `'${clean}', 'Cormorant Garamond', Garamond, 'Baskerville', serif`,
    };
  }

  // 3. Classical Roman Inscription (Cinzel)
  if (lower.includes("cinzel")) {
    return {
      familyName: clean,
      webFontName: "Cinzel",
      googleFontUrl: "https://fonts.googleapis.com/css2?family=Cinzel:wght@400..900&display=swap",
      cssFontFamily: `'${clean}', 'Cinzel', 'Trajan Pro', 'Times New Roman', serif`,
    };
  }

  // 4. Playfair Display
  if (lower.includes("playfair")) {
    return {
      familyName: clean,
      webFontName: "Playfair Display",
      googleFontUrl: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap",
      cssFontFamily: `'${clean}', 'Playfair Display', Georgia, serif`,
    };
  }

  // 5. Calligraphy & Script (Allura, Allitta, Alex Brush, Bunny Honey, Buttercup, Aston, Rose, Calligraphy, Script)
  if (
    classification === "script" ||
    lower.includes("allura") ||
    lower.includes("script") ||
    lower.includes("calligraphy") ||
    lower.includes("brush") ||
    lower.includes("bunny") ||
    lower.includes("buttercup") ||
    lower.includes("aston") ||
    lower.includes("rose") ||
    lower.includes("amore")
  ) {
    return {
      familyName: clean,
      webFontName: "Alex Brush",
      googleFontUrl: "https://fonts.googleapis.com/css2?family=Alex+Brush&family=Great+Vibes&display=swap",
      cssFontFamily: `'${clean}', 'Alex Brush', 'Great Vibes', 'Brush Script MT', cursive`,
    };
  }

  // 6. Baskerville variants (BASKVILL)
  if (lower.includes("bask") || lower.includes("baskvill")) {
    return {
      familyName: clean,
      webFontName: "Cormorant Garamond",
      googleFontUrl: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300..700;1,300..700&display=swap",
      cssFontFamily: `'${clean}', 'Baskerville', 'Cormorant Garamond', Georgia, serif`,
    };
  }

  // 7. Sans-Serif / Modern Architectural (Inter, Modern)
  if (classification === "sans" || lower.includes("sans") || lower.includes("inter")) {
    return {
      familyName: clean,
      webFontName: "Inter",
      googleFontUrl: "https://fonts.googleapis.com/css2?family=Inter:wght@300..800&display=swap",
      cssFontFamily: `'${clean}', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`,
    };
  }

  // 8. General High-Contrast Serif Default
  return {
    familyName: clean,
    webFontName: "Cormorant Garamond",
    googleFontUrl: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300..700;1,300..700&display=swap",
    cssFontFamily: `'${clean}', 'Cormorant Garamond', Georgia, serif`,
  };
}
