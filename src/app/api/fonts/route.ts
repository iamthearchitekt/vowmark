import { NextRequest, NextResponse } from "next/server";
import { CURATED_FONTS, FontRecord } from "@/lib/typography/fonts-db";
import { loadPersistentCustomFonts, savePersistentCustomFontsBulk, removePersistentCustomFont } from "@/lib/typography/custom-fonts-storage";

export const dynamic = "force-dynamic";

export async function GET() {
  const customFonts = loadPersistentCustomFonts();
  const allFonts = [...CURATED_FONTS, ...customFonts];

  // Deduplicate by font family name
  const uniqueFontsMap = new Map<string, FontRecord>();
  allFonts.forEach((f) => uniqueFontsMap.set(f.familyName.toLowerCase(), f));

  const sortedFonts = Array.from(uniqueFontsMap.values()).sort((a, b) =>
    a.familyName.localeCompare(b.familyName)
  );

  return NextResponse.json(sortedFonts);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const fontItems = Array.isArray(body) ? body : [body];
    const registeredFonts: FontRecord[] = [];

    for (const item of fontItems) {
      const { familyName, classification } = item;
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
          licenseName: "Custom Upload",
          commercialApproved: true,
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

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const fontId = searchParams.get("id");
    if (!fontId) {
      return NextResponse.json({ error: "Font ID required" }, { status: 400 });
    }

    // Remove from memory CURATED_FONTS array if present
    const curatedIdx = CURATED_FONTS.findIndex((f) => f.id === fontId);
    if (curatedIdx !== -1) {
      CURATED_FONTS.splice(curatedIdx, 1);
    }

    // Remove from persistent storage
    removePersistentCustomFont(fontId);

    return NextResponse.json({ success: true, id: fontId });
  } catch (err) {
    console.error("API /api/fonts DELETE error:", err);
    return NextResponse.json({ error: "Failed to delete font" }, { status: 500 });
  }
}
