"use client";

import { Header } from "@/components/layout/Header";
import { Download, Layers, ShieldCheck } from "lucide-react";

export default function LibraryPage() {
  const assets = [
    { name: "Erick & Emily Vector SVG", type: "SVG Vector", date: "Today", url: "/samples/botanical-wreath-sample.svg" },
    { name: "Estate Crest Shield PNG", type: "Transparent PNG", date: "Yesterday", url: "/samples/estate-crest-sample.svg" },
    { name: "Botanical Olive Divider", type: "SVG Vector", date: "3 days ago", url: "/samples/botanical-divider-sample.svg" },
    { name: "Corner Floral Sprig", type: "SVG Vector", date: "1 week ago", url: "/samples/corner-floral-sample.svg" },
  ];

  return (
    <div className="min-h-screen bg-vow-bg flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto p-8">
        <div className="mb-8">
          <h1 className="font-serif font-bold text-3xl text-vow-dark">Personal Design Library</h1>
          <p className="text-xs text-vow-muted font-sans mt-1">
            Access your exported vector SVGs, transparent PNGs, and reference imagery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {assets.map((ast, idx) => (
            <div key={idx} className="bg-vow-paper border border-vow-border rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div className="p-6 bg-white border border-stone-200 rounded-lg text-center mb-4 flex items-center justify-center h-48">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={ast.url} alt={ast.name} className="max-h-36 max-w-full object-contain" />
              </div>

              <div>
                <div className="flex items-center justify-between text-[10px] font-mono text-vow-muted mb-1">
                  <span>{ast.type}</span>
                  <span>{ast.date}</span>
                </div>
                <h4 className="font-serif font-bold text-sm text-vow-dark mb-3">{ast.name}</h4>
                <a
                  href={ast.url}
                  download
                  className="w-full py-2 bg-vow-surface border border-vow-border hover:bg-vow-dark hover:text-white rounded-md text-xs font-sans font-semibold uppercase tracking-wider transition-colors flex items-center justify-center space-x-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
