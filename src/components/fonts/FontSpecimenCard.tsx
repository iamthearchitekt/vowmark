"use client";

import { FontRecord } from "@/lib/typography/fonts-db";
import { Check, ShieldCheck } from "lucide-react";

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
  const isCustomUploaded = font.description?.includes("Uploaded custom font") || font.description?.includes("Uploaded custom typeface");

  return (
    <div
      onClick={onSelect}
      className={`p-6 bg-vow-paper border rounded-xl cursor-pointer transition-all duration-200 font-sans ${
        isSelected
          ? "border-vow-accent ring-2 ring-vow-accent/20 bg-amber-50/20 shadow-md"
          : "border-vow-border hover:border-stone-400 hover:shadow-sm"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="font-bold text-lg text-vow-dark">{font.familyName}</h4>
          <p className="text-[11px] font-sans text-vow-muted capitalize uppercase tracking-wider">
            {font.subclassification.replace(/_/g, " ")} • {font.provider} font
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {font.licensing.commercialApproved && (
            <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded flex items-center gap-1">
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
      <div className="py-8 border-y border-vow-border my-4 text-center bg-white rounded-lg p-6 flex items-center justify-center">
        <p className="text-3xl text-vow-dark" style={{ fontFamily: font.familyName }}>
          {primaryText} &amp; {secondaryText}
        </p>
      </div>

      <div className="flex items-center justify-between text-[11px] text-vow-muted">
        <p className="italic">{!isCustomUploaded ? font.description : ""}</p>
        <button className="font-sans font-bold uppercase tracking-wider text-vow-dark hover:text-vow-accent">
          Select Font
        </button>
      </div>
    </div>
  );
}
