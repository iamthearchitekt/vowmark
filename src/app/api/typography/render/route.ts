import { NextRequest, NextResponse } from "next/server";
import { TypographyEngine } from "@/lib/typography/engine";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = TypographyEngine.renderSvg(body);
    return NextResponse.json(result);
  } catch (err) {
    console.error("API /typography/render error:", err);
    return NextResponse.json({ error: "Typography rendering failed" }, { status: 500 });
  }
}
