"use client";

import { Header } from "@/components/layout/Header";
import { PreviewModesBar } from "@/components/editor/PreviewModesBar";
import { LeftControlPanel } from "@/components/editor/LeftControlPanel";
import { ArtboardCanvas } from "@/components/editor/ArtboardCanvas";
import { RightAiPanel } from "@/components/editor/RightAiPanel";

export default function DirectStudioPage() {
  return (
    <div className="h-screen bg-vow-bg flex flex-col font-sans overflow-hidden">
      {/* Studio Header */}
      <Header />
      {/* Format Switcher Toolbar (2x6, 4x6, 6x4, Square Mode) */}
      <PreviewModesBar />

      {/* Main Personal Creator Studio Workbench */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Creator Controls */}
        <LeftControlPanel />

        {/* Dynamic Canvas Workspace */}
        <ArtboardCanvas />

        {/* Right AI Assistant & Quick Actions */}
        <RightAiPanel />
      </main>
    </div>
  );
}
