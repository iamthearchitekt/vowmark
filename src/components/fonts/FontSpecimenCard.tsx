"use client";

import { FontRecord } from "@/lib/typography/fonts-db";
import { resolveFontConfig } from "@/lib/typography/font-resolver";
import { useEditorStore } from "@/lib/store/useEditorStore";
import { useRouter } from "next/navigation";
import { Check, ShieldCheck, ArrowRight } from "lucide-react";
import { useEffect } from "react";

interface FontSpecimenCardProps {
  font: FontRecord;
  primaryText?: string;
  secondaryText?: string;
  isSelected?: boolean;
  onSelect?: () => void;
}

export function FontSpecimenCard({
  font,
  primaryText = "Claude",
  secondaryText = "Alexa",
  isSelected,
  onSelect,
}: FontSpecimenCardProps) {
  const router = useRouter();
  const setTypographyOptions = useEditorStore((state) => state.setTypographyOptions);

  const isCustomUploaded =
    font.description?.includes("Uploaded custom font") ||
    font.description?.includes("Uploaded custom typeface");

  const fontConfig = resolveFontConfig(font.familyName, font.classification);

  // Dynamically load Web Font stylesheet for both Google and custom font records
  useEffect(() => {
    if (fontConfig.googleFontUrl) {
      const linkId = `font-link-${fontConfig.webFontName.replace(/\s+/g, "-").toLowerCase()}`;
      if (!document.getElementById(linkId)) {
        const link = document.createElement("link");
        link.id = linkId;
        link.rel = "stylesheet";
        link.href = fontConfig.googleFontUrl;
        document.head.appendChild(link);
      }
    }
  }, [fontConfig.googleFontUrl, fontConfig.webFontName]);

  const handleMoveToStudio = (e: React.MouseEvent) => {
    e.stopPropagation(); // Don't trigger modal click
    setTypographyOptions({ fontFamily: font.familyName });
    router.push("/editor");
  };

  return (
    <div
      onClick={onSelect}
      className={`p-6 bg-vow-paper border rounded-xl cursor-pointer transition-all duration-200 font-sans group ${
        isSelected
          ? "border-vow-accent ring-2 ring-vow-accent/20 bg-amber-50/20 shadow-md"
          : "border-vow-border hover:border-stone-400 hover:shadow-sm"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="font-bold text-lg text-vow-dark group-hover:text-vow-accent transition-colors">
            {font.familyName}
          </h4>
          <p className="text-[11px] font-sans text-vow-muted capitalize uppercase tracking-wider">
            {font.subclassification.replace(/_/g, " ")} • {font.provider} font
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {font.licensing.commercialApproved && (
            <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-3 h-3 text-emerald-600" /> Commercial Approved
            </span>
          )}
          {isSelected && (
            <div className="w-6 h-6 rounded-full bg-vow-accent text-white flex items-center justify-center">
              <Check className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>

      {/* Live Specimen Preview Render */}
      <div className="py-8 border-y border-vow-border my-4 text-center bg-white rounded-lg p-6 flex items-center justify-center min-h-[110px]">
        <p className="text-3xl text-vow-dark" style={{ fontFamily: fontConfig.cssFontFamily }}>
          {secondaryText ? `${primaryText} & ${secondaryText}` : primaryText}
        </p>
      </div>

      <div className="flex items-center justify-between text-[11px] text-vow-muted">
        <p className="italic truncate max-w-[240px]">
          {!isCustomUploaded ? font.description : "Click to view full specimen & character map."}
        </p>

        <button
          type="button"
          onClick={handleMoveToStudio}
          className="px-3 py-1.5 bg-vow-dark hover:bg-black text-vow-paper rounded-lg text-[11px] font-bold uppercase tracking-wider transition-colors flex items-center space-x-1.5 shadow-2xs cursor-pointer"
        >
          <span>Move to Studio</span>
          <ArrowRight className="w-3.5 h-3.5 text-vow-champagne" />
        </button>
      </div>
    </div>
  );
}
