import { CURATED_FONTS, FontRecord } from "./fonts-db";

export interface FontSearchInput {
  query?: string;
  category?: string;
  weddingStyle?: string;
}

export class GoogleFontsProvider {
  static async searchFonts(input: FontSearchInput): Promise<FontRecord[]> {
    let results = [...CURATED_FONTS];

    if (input.category) {
      results = results.filter(
        (f) => f.classification.toLowerCase() === input.category?.toLowerCase()
      );
    }

    if (input.query) {
      const q = input.query.toLowerCase();
      results = results.filter(
        (f) =>
          f.familyName.toLowerCase().includes(q) ||
          f.description.toLowerCase().includes(q) ||
          f.weddingTags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return results;
  }

  static async getFontMetadata(fontId: string): Promise<FontRecord | undefined> {
    return CURATED_FONTS.find((f) => f.id === fontId || f.familyName.toLowerCase() === fontId.toLowerCase());
  }
}
