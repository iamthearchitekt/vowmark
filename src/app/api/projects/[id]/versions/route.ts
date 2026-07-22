import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { name, artboardState, briefData } = body;

    const version = {
      id: `ver_${Date.now()}`,
      projectId: params.id,
      versionNumber: Math.floor(Math.random() * 10) + 3,
      name: name || "Saved Revision",
      artboardState: JSON.stringify(artboardState || {}),
      briefData: JSON.stringify(briefData || {}),
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(version);
  } catch (err) {
    return NextResponse.json({ error: "Failed to save project version" }, { status: 500 });
  }
}
