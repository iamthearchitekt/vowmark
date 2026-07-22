import { NextRequest, NextResponse } from "next/server";
import { CURATED_FONTS, FontRecord } from "@/lib/typography/fonts-db";
import { loadPersistentCustomFonts, savePersistentCustomFontsBulk } from "@/lib/typography/custom-fonts-storage";

export async function GET() {
  const customFonts = loadPersistentCustomFonts();
  const allFonts = [...CURATED_FONTS, ...customFonts];

  // Deduplicate by font family name
  const uniqueFontsMap = new Map<string, FontRecord>();
  allFonts.forEach((f) => uniqueFontsMap.set(f.familyName.toLowerCase(), f));

  return NextResponse.json(Array.from(uniqueFontsMap.values()));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const fontItems = Array.isArray(body) ? body : [body];
    const registeredFonts: FontRecord[] = [];

    for (const item of fontItems) {
      const { familyName, classification, commercialApproved } = item;
      if (!familyName) continue;

      const newFont: FontRecord = {
        id: `font_custom_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        familyName: familyName.trim(),
        provider: "custom",
        classification: classification || "serif",
        subclassification: "custom_uploaded",
        description: "Uploaded custom font for wedding stationery production.",
        supportedWeights: [400, 600, 700],
        weddingTags: ["custom", "uploaded", "wedding identity"],
        bestFor: ["wedding wordmarks", "initial logos"],
        licensing: {
          licenseName: "Commercial Upload",
          commercialApproved: commercialApproved ?? true,
          embeddingApproved: true,
          exportApproved: true,
        },
      };

      CURATED_FONTS.push(newFont);
      registeredFonts.push(newFont);
    }

    // Persist all custom fonts to disk permanently via server storage
    savePersistentCustomFontsBulk(registeredFonts);

    return NextResponse.json({ success: true, count: registeredFonts.length, fonts: registeredFonts });
  } catch (err) {
    console.error("API /api/fonts POST error:", err);
    return NextResponse.json({ error: "Failed to upload fonts" }, { status: 500 });
  }
}
