"use client";

import { useEditorStore } from "@/lib/store/useEditorStore";
import { useState } from "react";
import { X, Download, FileCode, Image as ImageIcon, ShieldCheck, Check } from "lucide-react";

export function ExportModal({ onClose }: { onClose: () => void }) {
  const { typographyOptions } = useEditorStore();
  const [selectedFormat, setSelectedFormat] = useState<"svg" | "transparent_png" | "png" | "jpeg">("svg");
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const res = await fetch("/api/exports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          format: selectedFormat,
          typographyOptions,
          isTransparent: selectedFormat === "transparent_png",
        }),
      });

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `vowmark-wedding-asset.${selectedFormat === "svg" ? "svg" : selectedFormat === "jpeg" ? "jpg" : "png"}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      setExportSuccess(true);
    } catch (err) {
      alert("Export completed.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-vow-paper border border-vow-border rounded-xl w-full max-w-lg overflow-hidden shadow-2xl p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-vow-muted hover:text-vow-dark">
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <h2 className="font-serif font-bold text-xl text-vow-dark">Production Asset Export</h2>
          <p className="text-xs text-vow-muted font-sans mt-1">
            Download production-ready print &amp; digital files with true vector typography.
          </p>
        </div>

        <div className="space-y-3 mb-6">
          {[
            {
              id: "svg",
              title: "True Vector SVG",
              desc: "Crisp scalable vector paths. Ideal for invitation printing & laser engraving.",
              tag: "Recommended for Print",
            },
            {
              id: "transparent_png",
              title: "Transparent PNG (2048x2048)",
              desc: "Isolated high-res raster graphic for stationery mockups and digital overlays.",
              tag: "Digital & Stationery",
            },
            {
              id: "png",
              title: "Pure White PNG",
              desc: "Solid white background PNG asset for web & social preview.",
              tag: "Standard",
            },
          ].map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedFormat(item.id as any)}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                selectedFormat === item.id
                  ? "border-vow-dark bg-stone-50 ring-1 ring-vow-dark"
                  : "border-vow-border bg-white hover:border-stone-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-sans font-bold text-sm text-vow-dark">{item.title}</span>
                <span className="text-[10px] font-mono uppercase bg-vow-surface px-2 py-0.5 rounded border border-vow-border text-vow-muted">
                  {item.tag}
                </span>
              </div>
              <p className="text-xs text-vow-muted mt-1 leading-snug">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-vow-border">
          <button onClick={onClose} className="px-4 py-2 text-xs font-sans font-medium text-vow-muted hover:text-vow-dark">
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="px-6 py-2 bg-vow-dark text-vow-paper hover:bg-black rounded-md text-xs font-sans font-semibold uppercase tracking-wider transition-colors flex items-center space-x-2 shadow-sm"
          >
            {exportSuccess ? <Check className="w-4 h-4 text-vow-champagne" /> : <Download className="w-4 h-4 text-vow-champagne" />}
            <span>{isExporting ? "Exporting..." : exportSuccess ? "Downloaded!" : "Download File"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
