import { NextRequest, NextResponse } from "next/server";
import { storageProvider } from "@/lib/image/storage-provider";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const classification = (formData.get("classification") as string) || "style";
    const notes = (formData.get("notes") as string) || "";
    const strength = (formData.get("strength") as string) || "moderate";

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploaded = await storageProvider.uploadFile(buffer, file.name, file.type);

    return NextResponse.json({
      reference: {
        id: `ref_${Date.now()}`,
        url: uploaded.fileUrl,
        classification,
        notes,
        strength,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (err) {
    return NextResponse.json({ error: "Reference upload failed" }, { status: 500 });
  }
}
