"use client";

import { Header } from "@/components/layout/Header";
import { CreditCard, ShieldCheck, CheckCircle2, Cpu } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-vow-bg flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto p-8">
        <div className="mb-8">
          <h1 className="font-serif font-bold text-3xl text-vow-dark">Studio Settings &amp; Billing</h1>
          <p className="text-xs text-vow-muted font-sans mt-1">
            Manage provider credentials, mock mode, and generation credit balance.
          </p>
        </div>

        <div className="space-y-6">
          {/* Development Billing Mode Banner */}
          <div className="p-6 bg-vow-paper border border-vow-border rounded-xl shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <CreditCard className="w-6 h-6 text-vow-accent" />
              <div>
                <h3 className="font-serif font-bold text-lg text-vow-dark">Development Billing Mode</h3>
                <p className="text-xs text-vow-muted">
                  Stripe architecture configured for credit transactions and subscriptions.
                </p>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span className="font-sans font-bold text-xs text-emerald-900">
                  Development Mode Active — Unlimited Mock Credits Available
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-800">10,000 / 10,000 CREDITS</span>
            </div>
          </div>

          {/* AI Provider Status */}
          <div className="p-6 bg-vow-paper border border-vow-border rounded-xl shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <Cpu className="w-6 h-6 text-vow-accent" />
              <div>
                <h3 className="font-serif font-bold text-lg text-vow-dark">AI Provider Configuration</h3>
                <p className="text-xs text-vow-muted">
                  Server-side keys for OpenAI Responses API &amp; Google Gemini Nano Banana.
                </p>
              </div>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-stone-50 border border-vow-border rounded flex justify-between">
                <span>USE_MOCK_AI</span>
                <span className="text-emerald-700 font-bold">true (Zero-Config Local Mode)</span>
              </div>
              <div className="p-3 bg-stone-50 border border-vow-border rounded flex justify-between">
                <span>OPENAI_CHAT_MODEL</span>
                <span>gpt-4o</span>
              </div>
              <div className="p-3 bg-stone-50 border border-vow-border rounded flex justify-between">
                <span>GEMINI_IMAGE_MODEL</span>
                <span>gemini-2.5-flash-imagen</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
