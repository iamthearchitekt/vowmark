"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { WEDDING_STYLES } from "@/lib/design/styles-taxonomy";
import { Sparkles, ArrowRight, ArrowLeft, Upload, CheckCircle2 } from "lucide-react";

export default function NewProjectWizardPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    assetType: "couple_logo",
    primaryText: "Erick",
    secondaryText: "Emily",
    date: "OCTOBER 24, 2026",
    location: "PARIS, FRANCE",
    weddingStyle: "editorial_luxury",
    typographyCategory: "high_contrast_serif",
    layout: "stacked",
    referenceNote: "",
  });

  const handleNext = () => {
    if (step < 7) {
      setStep(step + 1);
    } else {
      router.push("/editor/proj_erick_emily");
    }
  };

  return (
    <div className="min-h-screen bg-vow-bg flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-3xl w-full mx-auto p-8 flex flex-col justify-center">
        {/* Wizard Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-mono text-vow-muted mb-2">
            <span>STEP {step} OF 7</span>
            <span>{Math.round((step / 7) * 100)}% COMPLETED</span>
          </div>
          <div className="w-full bg-vow-border h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-vow-dark h-full transition-all duration-300"
              style={{ width: `${(step / 7) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-vow-paper border border-vow-border rounded-2xl p-8 shadow-xl">
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="font-serif font-bold text-2xl text-vow-dark">Choose Asset Type</h2>
              <p className="text-xs text-vow-muted">Select the specialized wedding stationery asset you wish to create.</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: "couple_logo", label: "Couple Logo", desc: "Combined names & monogram mark" },
                  { id: "couple_wordmark", label: "Couple Wordmark", desc: "Pure high-contrast editorial typography" },
                  { id: "two_initial_monogram", label: "Two-Initial Monogram", desc: "Interlocking or circular monogram" },
                  { id: "wedding_crest", label: "Wedding Crest", desc: "Heritage heraldic shield & frame" },
                  { id: "botanical_wreath", label: "Botanical Wreath", desc: "Isolated rose & olive leaf wreath" },
                  { id: "invitation_divider", label: "Invitation Divider", desc: "Horizontal stationery line rule" },
                ].map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setFormData({ ...formData, assetType: item.id })}
                    className={`p-4 border rounded-xl cursor-pointer transition-all ${
                      formData.assetType === item.id
                        ? "border-vow-dark bg-stone-50 ring-1 ring-vow-dark"
                        : "border-vow-border bg-white hover:border-stone-300"
                    }`}
                  >
                    <h3 className="font-serif font-bold text-sm text-vow-dark">{item.label}</h3>
                    <p className="text-[11px] text-vow-muted mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="font-serif font-bold text-2xl text-vow-dark">Enter Couple Content</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Partner One Name</label>
                  <input
                    type="text"
                    value={formData.primaryText}
                    onChange={(e) => setFormData({ ...formData, primaryText: e.target.value })}
                    className="w-full bg-white border border-vow-border rounded-md px-3 py-2 text-xs font-serif"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Partner Two Name</label>
                  <input
                    type="text"
                    value={formData.secondaryText}
                    onChange={(e) => setFormData({ ...formData, secondaryText: e.target.value })}
                    className="w-full bg-white border border-vow-border rounded-md px-3 py-2 text-xs font-serif"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Wedding Date</label>
                <input
                  type="text"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full bg-white border border-vow-border rounded-md px-3 py-2 text-xs font-sans"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="font-serif font-bold text-2xl text-vow-dark">Select Wedding Aesthetic Taxonomy</h2>
              <div className="space-y-3">
                {Object.values(WEDDING_STYLES).slice(0, 4).map((st) => (
                  <div
                    key={st.slug}
                    onClick={() => setFormData({ ...formData, weddingStyle: st.slug })}
                    className={`p-4 border rounded-xl cursor-pointer transition-all ${
                      formData.weddingStyle === st.slug
                        ? "border-vow-accent bg-amber-50/40 ring-1 ring-vow-accent"
                        : "border-vow-border bg-white hover:border-stone-300"
                    }`}
                  >
                    <h3 className="font-serif font-bold text-base text-vow-dark">{st.name}</h3>
                    <p className="text-xs text-vow-muted mt-1">{st.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step >= 4 && (
            <div className="space-y-6 text-center py-6">
              <div className="w-12 h-12 rounded-full bg-vow-dark text-vow-champagne flex items-center justify-center mx-auto mb-2">
                <Sparkles className="w-6 h-6" />
              </div>
              <h2 className="font-serif font-bold text-2xl text-vow-dark">Summary &amp; AI Brief Compilation</h2>
              <p className="text-xs text-vow-muted">
                Compiling design brief for {formData.primaryText} &amp; {formData.secondaryText} in {formData.weddingStyle} style.
              </p>
              <div className="p-4 bg-white border border-vow-border rounded-lg text-left text-xs font-mono text-stone-700 space-y-1">
                <p>• Output Mode: Mode 3 (Hybrid Vector + AI)</p>
                <p>• Primary Font: Cormorant Garamond (High-Contrast Serif)</p>
                <p>• Spacing: Wide Tracking (+6px)</p>
                <p>• Negative Rules: Prohibit Chopin Script &amp; Generic Clipart</p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-8 border-t border-vow-border mt-8">
            <button
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
              className="px-4 py-2 text-xs font-sans font-medium text-vow-muted hover:text-vow-dark disabled:opacity-30"
            >
              Back
            </button>

            <button
              onClick={handleNext}
              className="px-6 py-2.5 bg-vow-dark text-vow-paper hover:bg-black rounded-full text-xs font-semibold uppercase tracking-wider transition-colors flex items-center space-x-2 shadow-sm"
            >
              <span>{step === 7 ? "Launch Studio" : "Continue"}</span>
              <ArrowRight className="w-4 h-4 text-vow-champagne" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
