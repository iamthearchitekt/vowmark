import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  return NextResponse.json({
    project: {
      id,
      title: "Erick & Emily Wedding Identity",
      assetType: "couple_logo",
      status: "ACTIVE",
      currentVersionId: "ver_2",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      versions: [
        {
          id: "ver_1",
          versionNumber: 1,
          name: "Initial Typography Stack",
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          artboardState: JSON.stringify({
            fontFamily: "Cormorant Garamond",
            fontSize: 72,
            layout: "stacked",
            primaryText: "Erick",
            secondaryText: "Emily",
            ampersandScale: 0.6,
            colorMode: "black_on_white",
          }),
        },
        {
          id: "ver_2",
          versionNumber: 2,
          name: "Added Botanical Wreath Ornament",
          createdAt: new Date().toISOString(),
          artboardState: JSON.stringify({
            fontFamily: "Cormorant Garamond",
            fontSize: 72,
            layout: "stacked",
            primaryText: "Erick",
            secondaryText: "Emily",
            ampersandScale: 0.5,
            colorMode: "black_on_white",
            ornamentUrl: "/samples/botanical-wreath-sample.svg",
          }),
        },
      ],
    },
  });
}
