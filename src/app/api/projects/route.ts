import { NextRequest, NextResponse } from "next/server";

// In-memory / mock store fallback if DB is initializing
const mockProjects: any[] = [
  {
    id: "proj_erick_emily",
    title: "Erick & Emily Wedding Identity",
    assetType: "couple_logo",
    status: "ACTIVE",
    currentVersionId: "ver_1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    briefData: {
      primaryText: "Erick",
      secondaryText: "Emily",
      date: "10.24.2026",
      weddingStyle: "editorial_luxury",
      layout: "stacked",
    },
  },
];

export async function GET() {
  return NextResponse.json({ projects: mockProjects });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newProject = {
      id: `proj_${Date.now()}`,
      title: body.title || `${body.primaryText || "Couple"} Wedding Mark`,
      assetType: body.assetType || "couple_logo",
      status: "DRAFT",
      currentVersionId: `ver_${Date.now()}_1`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      briefData: body,
    };
    mockProjects.unshift(newProject);
    return NextResponse.json(newProject);
  } catch (err) {
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
