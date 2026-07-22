"use client";

import { Header } from "@/components/layout/Header";
import { PreviewModesBar } from "@/components/editor/PreviewModesBar";
import { LeftControlPanel } from "@/components/editor/LeftControlPanel";
import { ArtboardCanvas } from "@/components/editor/ArtboardCanvas";
import { RightAiPanel } from "@/components/editor/RightAiPanel";

export default function EditorPage({ params }: { params: { id: string } }) {
  return (
    <div className="h-screen bg-vow-bg flex flex-col font-sans overflow-hidden">
      <Header />
      <PreviewModesBar />

      <main className="flex-1 flex overflow-hidden">
        {/* Left Control Panel: Asset Type, Names, Style, Fonts, References */}
        <LeftControlPanel />

        {/* Center Panel: Interactive Multi-Layer Artboard */}
        <ArtboardCanvas />

        {/* Right Panel: AI Assistant, Brief Summary & Quick Actions */}
        <RightAiPanel />
      </main>
    </div>
  );
}
