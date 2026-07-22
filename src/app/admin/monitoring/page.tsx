"use client";

import { Header } from "@/components/layout/Header";
import { ShieldCheck, Activity, Cpu, Clock, DollarSign } from "lucide-react";

export default function AdminMonitoringPage() {
  const logs = [
    {
      id: "req_1",
      provider: "OpenAI Responses API",
      model: "gpt-4o",
      action: "Structured Brief Compilation",
      duration: "0.45s",
      cost: "$0.005",
      status: "SUCCESS",
    },
    {
      id: "req_2",
      provider: "Google Gemini Nano Banana",
      model: "gemini-2.5-flash-imagen",
      action: "Botanical Wreath Asset Generation",
      duration: "1.20s",
      cost: "$0.030",
      status: "SUCCESS",
    },
    {
      id: "req_3",
      provider: "Deterministic Typography Engine",
      model: "SVG Opentype Engine",
      action: "Vector Path Render & Kerning",
      duration: "0.02s",
      cost: "$0.000",
      status: "SUCCESS",
    },
  ];

  return (
    <div className="min-h-screen bg-vow-bg flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto p-8">
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-vow-accent text-xs font-mono mb-1 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Admin Management Suite</span>
          </div>
          <h1 className="font-serif font-bold text-3xl text-vow-dark">Generation Monitoring &amp; Usage Analytics</h1>
          <p className="text-xs text-vow-muted font-sans mt-1">
            Real-time server-side request duration, cost telemetry, and error normalization.
          </p>
        </div>

        <div className="bg-vow-paper border border-vow-border rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-vow-surface border-b border-vow-border font-mono text-[11px] text-vow-muted uppercase">
                <th className="p-4">Provider &amp; Model</th>
                <th className="p-4">Action</th>
                <th className="p-4">Duration</th>
                <th className="p-4">Estimated Cost</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-vow-border font-mono">
              {logs.map((l) => (
                <tr key={l.id} className="hover:bg-stone-50">
                  <td className="p-4">
                    <p className="font-bold text-vow-dark">{l.provider}</p>
                    <p className="text-[10px] text-vow-muted">{l.model}</p>
                  </td>
                  <td className="p-4">{l.action}</td>
                  <td className="p-4">{l.duration}</td>
                  <td className="p-4">{l.cost}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-[10px]">
                      {l.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
