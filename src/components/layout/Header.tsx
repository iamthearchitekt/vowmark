"use client";

import Link from "next/link";
import { SITE_CONFIG } from "@/config/site";
import { useEditorStore } from "@/lib/store/useEditorStore";
import { RotateCcw, Camera, Save, Check } from "lucide-react";
import { useState } from "react";

export function Header() {
  const resetFields = useEditorStore((state) => state.resetFields);
  const photoboothMode = useEditorStore((state) => state.photoboothMode);
  const setPhotoboothMode = useEditorStore((state) => state.setPhotoboothMode);
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveProject = () => {
    const state = useEditorStore.getState();
    const pId = state.projectId || `proj_${Date.now()}`;
    const pTitle =
      state.typographyOptions.primaryText && state.typographyOptions.secondaryText
        ? `${state.typographyOptions.primaryText} & ${state.typographyOptions.secondaryText}`
        : state.projectTitle || "Wedding Mark Project";

    const projectData = {
      id: pId,
      title: pTitle,
      assetType: state.brief.assetType || "couple_logo",
      style: state.brief.weddingStyle || "editorial_luxury",
      font: state.typographyOptions.fontFamily || "Cormorant Garamond",
      primaryText: state.typographyOptions.primaryText,
      secondaryText: state.typographyOptions.secondaryText,
      dateText: state.typographyOptions.dateText,
      hashtagText: state.typographyOptions.hashtagText,
      canvasFormat: state.canvasFormat,
      backgroundPatternAssetUrl: state.backgroundPatternAssetUrl,
      backgroundSuite: state.backgroundSuite,
      textLogoAssetUrl: state.textLogoAssetUrl,
      textColor: state.textColor,
      photoboothMode: state.photoboothMode,
      brief: state.brief,
      typographyOptions: state.typographyOptions,
      updatedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      savedAtIso: new Date().toISOString(),
      version: "v1.0 (Saved)",
    };

    try {
      // 1. Save individual project
      localStorage.setItem(`vowmark_project_${pId}`, JSON.stringify(projectData));
      localStorage.setItem("vowmark_latest_project", JSON.stringify(projectData));

      // 2. Push to global Client Projects array
      const existingRaw = localStorage.getItem("vowmark_client_projects");
      let projectsList: any[] = existingRaw ? JSON.parse(existingRaw) : [];

      const existingIdx = projectsList.findIndex((p: any) => p.id === pId);
      if (existingIdx >= 0) {
        projectsList[existingIdx] = projectData;
      } else {
        projectsList.unshift(projectData);
      }
      localStorage.setItem("vowmark_client_projects", JSON.stringify(projectsList));

      // 3. Dispatch event to notify dashboard
      window.dispatchEvent(new CustomEvent("vowmark_project_saved", { detail: projectData }));
    } catch (e) {
      console.warn("Save project error:", e);
    }

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <header className="sticky top-0 z-40 bg-vow-paper border-b border-vow-border px-6 py-3.5 flex items-center justify-between font-sans">
      <div className="flex items-center space-x-8">
        <Link href="/" className="flex items-center space-x-4 group">
          {/* Updated VOWMARK Logo Image */}
          <div className="h-11 flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/vowmark-logo.png"
              alt="VOWMARK Logo"
              className="h-10 w-auto min-w-[216px] max-w-[290px] object-contain group-hover:scale-105 transition-transform"
            />
          </div>
        </Link>

        <nav className="hidden md:flex items-center space-x-6 text-xs uppercase tracking-wider font-semibold text-vow-charcoal">
          <Link href="/" className="hover:text-vow-accent transition-colors text-vow-dark font-bold">
            Studio Workbench
          </Link>
          <Link href="/dashboard" className="hover:text-vow-accent transition-colors">
            Client Projects
          </Link>
          <Link href="/fonts" className="hover:text-vow-accent transition-colors">
            Fonts Library
          </Link>
        </nav>
      </div>

      <div className="flex items-center space-x-3">
        {/* Universal Toggle Photo Mock Switch */}
        <button
          type="button"
          onClick={() => setPhotoboothMode(!photoboothMode)}
          className={`text-[11px] font-sans font-bold flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border transition-all shadow-2xs cursor-pointer ${
            photoboothMode
              ? "bg-vow-dark text-white border-vow-dark ring-1 ring-vow-accent"
              : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50"
          }`}
          title="Toggle Universal Photo Mock Frame Overlay"
        >
          <Camera className={`w-3.5 h-3.5 ${photoboothMode ? "text-vow-accent" : "text-stone-400"}`} />
          <span>Photo Mock: {photoboothMode ? "ON" : "OFF"}</span>
        </button>

        {/* SAVE PROJECT Button — High Visibility Gold Highlight */}
        <button
          type="button"
          onClick={handleSaveProject}
          className={`text-[11px] font-sans font-extrabold tracking-wider uppercase flex items-center space-x-1.5 px-4 py-1.5 rounded-lg border transition-all shadow-md cursor-pointer ${
            isSaved
              ? "bg-emerald-600 text-white border-emerald-600 ring-2 ring-emerald-400"
              : "bg-vow-accent text-vow-dark hover:bg-amber-400 border-vow-accent ring-1 ring-stone-900"
          }`}
          title="Save active project design & settings to Client Projects"
        >
          {isSaved ? (
            <>
              <Check className="w-4 h-4 text-white" />
              <span>Project Saved!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4 text-vow-dark" />
              <span>SAVE PROJECT</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={resetFields}
          className="text-[11px] font-sans font-medium text-stone-500 hover:text-stone-800 flex items-center space-x-1.5 px-2.5 py-1 rounded border border-stone-200 hover:border-stone-300 hover:bg-stone-50 transition-colors shadow-2xs cursor-pointer"
          title="Reset all form fields & artboard to initial state"
        >
          <RotateCcw className="w-3 h-3 text-stone-400" />
          <span>Reset Fields</span>
        </button>
      </div>
    </header>
  );
}
