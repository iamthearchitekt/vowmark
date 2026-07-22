"use client";

import { useEditorStore } from "@/lib/store/useEditorStore";
import { useState } from "react";
import { X, History, RotateCcw, Check, ArrowRight } from "lucide-react";

export function VersionHistoryModal({ onClose }: { onClose: () => void }) {
  const { setTypographyOptions, setOrnamentUrl } = useEditorStore();
  const [restoredId, setRestoredId] = useState<string | null>(null);

  const versions = [
    {
      id: "ver_2",
      name: "Version 2: Added Botanical Wreath Ornament",
      date: "Just now",
      font: "Cormorant Garamond",
      layout: "Stacked",
      ornament: "Botanical Wreath",
      state: {
        fontFamily: "Cormorant Garamond",
        fontSize: 72,
        layout: "stacked",
        ampersandScale: 0.6,
        ornamentUrl: "/samples/botanical-wreath-sample.svg",
      },
    },
    {
      id: "ver_1",
      name: "Version 1: Initial Typography Stack",
      date: "15 minutes ago",
      font: "Bodoni Moda",
      layout: "Stacked",
      ornament: "None",
      state: {
        fontFamily: "Bodoni Moda",
        fontSize: 76,
        layout: "stacked",
        ampersandScale: 0.5,
        ornamentUrl: null,
      },
    },
  ];

  const handleRestore = (ver: (typeof versions)[0]) => {
    setTypographyOptions(ver.state as any);
    setOrnamentUrl(ver.state.ornamentUrl);
    setRestoredId(ver.id);
    setTimeout(() => {
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-vow-paper border border-vow-border rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-vow-muted hover:text-vow-dark">
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6 flex items-center space-x-3">
          <History className="w-6 h-6 text-vow-accent" />
          <div>
            <h2 className="font-serif font-bold text-xl text-vow-dark">Project Version History</h2>
            <p className="text-xs text-vow-muted font-sans mt-0.5">
              Compare design iterations and restore previous typography states anytime.
            </p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          {versions.map((ver) => (
            <div
              key={ver.id}
              className="p-4 border border-vow-border bg-white rounded-lg flex items-center justify-between hover:border-stone-400 transition-colors"
            >
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-sans font-bold text-sm text-vow-dark">{ver.name}</span>
                  <span className="text-[10px] font-mono text-vow-muted bg-stone-100 px-2 py-0.5 rounded">{ver.date}</span>
                </div>
                <div className="flex items-center space-x-4 text-xs text-vow-muted mt-2">
                  <span>Font: <strong className="text-vow-dark">{ver.font}</strong></span>
                  <span>Layout: <strong className="text-vow-dark">{ver.layout}</strong></span>
                  <span>Ornament: <strong className="text-vow-dark">{ver.ornament}</strong></span>
                </div>
              </div>

              <button
                onClick={() => handleRestore(ver)}
                className="px-4 py-2 bg-vow-surface border border-vow-border hover:bg-vow-dark hover:text-white rounded-md text-xs font-sans font-semibold uppercase tracking-wider transition-colors flex items-center space-x-1.5"
              >
                {restoredId === ver.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-vow-success" />
                    <span>Restored!</span>
                  </>
                ) : (
                  <>
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restore</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
