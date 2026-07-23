"use client";

import { useEditorStore } from "@/lib/store/useEditorStore";
import { DEFAULT_PROMPT_GUIDANCE, compileGenerationPrompt } from "@/lib/ai/prompt-compiler";
import { useState } from "react";
import { Sliders, X, RotateCcw, Check, Sparkles, Type, Image as ImageIcon, Code2 } from "lucide-react";

export function PromptGuidanceModal() {
  const isOpen = useEditorStore((state) => state.isPromptGuidanceModalOpen);
  const setIsOpen = useEditorStore((state) => state.setIsPromptGuidanceModalOpen);

  const aiGenerationType = useEditorStore((state) => state.aiGenerationType);
  const setAiGenerationType = useEditorStore((state) => state.setAiGenerationType);

  const guidanceConfig = useEditorStore((state) => state.promptGuidanceConfig);
  const setPromptGuidanceConfig = useEditorStore((state) => state.setPromptGuidanceConfig);

  const brief = useEditorStore((state) => state.brief);

  const [activeTab, setActiveTab] = useState<"text" | "background" | "compiler">("text");

  const [textPrefix, setTextPrefix] = useState(guidanceConfig.textLogoPrefix);
  const [textSuffix, setTextSuffix] = useState(guidanceConfig.textLogoSuffix);
  const [bgPrefix, setBgPrefix] = useState(guidanceConfig.backgroundPrefix);
  const [bgSuffix, setBgSuffix] = useState(guidanceConfig.backgroundSuffix);

  const [testUserPrompt, setTestUserPrompt] = useState("Vintage luxury botanical frame for M & S");
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setPromptGuidanceConfig({
      textLogoPrefix: textPrefix,
      textLogoSuffix: textSuffix,
      backgroundPrefix: bgPrefix,
      backgroundSuffix: bgSuffix,
    });
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      setIsOpen(false);
    }, 800);
  };

  const handleResetDefaults = () => {
    setTextPrefix(DEFAULT_PROMPT_GUIDANCE.textLogoPrefix);
    setTextSuffix(DEFAULT_PROMPT_GUIDANCE.textLogoSuffix);
    setBgPrefix(DEFAULT_PROMPT_GUIDANCE.backgroundPrefix);
    setBgSuffix(DEFAULT_PROMPT_GUIDANCE.backgroundSuffix);
    setPromptGuidanceConfig(DEFAULT_PROMPT_GUIDANCE);
  };

  // Compiled Test Prompt output
  const compiledTest = compileGenerationPrompt(
    { ...brief, generationPrompt: testUserPrompt },
    {
      generationType: aiGenerationType,
      guidanceConfig: {
        textLogoPrefix: textPrefix,
        textLogoSuffix: textSuffix,
        backgroundPrefix: bgPrefix,
        backgroundSuffix: bgSuffix,
      },
    }
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 font-sans select-none animate-in fade-in duration-200">
      <div className="bg-white border border-vow-border w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-vow-border bg-vow-paper flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-vow-dark text-vow-accent flex items-center justify-center font-bold shadow-sm">
              <Sliders className="w-5 h-5 text-vow-accent" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-vow-dark uppercase tracking-wider flex items-center gap-2">
                <span>AI Prompt Guidance &amp; Steering System</span>
                <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full">
                  Dev Mode
                </span>
              </h3>
              <p className="text-[11px] text-vow-muted">
                Control pre-prompt rules, master generation switches, and text/background steering.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="p-1.5 text-vow-muted hover:text-vow-dark rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Master Generation Switch Banner */}
        <div className="p-4 bg-slate-50 border-b border-vow-border flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-vow-dark uppercase tracking-wider block">
              Active Generation Mentality:
            </span>
            <span className="text-[11px] text-vow-muted">
              {aiGenerationType === "text_logo"
                ? "Text & Logo Mode (Renders names, monograms, initials & typography)"
                : "Background & Texture Mode (OMITS all words, names & logos for pure graphics)"}
            </span>
          </div>

          <div className="flex bg-slate-200 p-1 rounded-xl space-x-1">
            <button
              type="button"
              onClick={() => setAiGenerationType("text_logo")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                aiGenerationType === "text_logo"
                  ? "bg-vow-dark text-white shadow-sm"
                  : "text-slate-700 hover:text-slate-900"
              }`}
            >
              <Type className="w-3.5 h-3.5 text-vow-accent" />
              <span>Text &amp; Logo</span>
            </button>

            <button
              type="button"
              onClick={() => setAiGenerationType("background_pattern")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                aiGenerationType === "background_pattern"
                  ? "bg-vow-dark text-white shadow-sm"
                  : "text-slate-700 hover:text-slate-900"
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5 text-vow-accent" />
              <span>Background &amp; Texture</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-vow-border bg-slate-100/50 px-5 pt-2 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab("text")}
            className={`px-4 py-2.5 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "text"
                ? "border-vow-dark text-vow-dark font-extrabold"
                : "border-transparent text-vow-muted hover:text-vow-dark"
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>Text &amp; Logo Guidance</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("background")}
            className={`px-4 py-2.5 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "background"
                ? "border-vow-dark text-vow-dark font-extrabold"
                : "border-transparent text-vow-muted hover:text-vow-dark"
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Background &amp; Pattern Guidance</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("compiler")}
            className={`px-4 py-2.5 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "compiler"
                ? "border-vow-dark text-vow-dark font-extrabold"
                : "border-transparent text-vow-muted hover:text-vow-dark"
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Live Prompt Compiler Test</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          {activeTab === "text" && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-amber-900 text-[11px]">
                <strong className="font-bold">Text &amp; Logo Rules:</strong> These pre-prompt rules govern couple names, monogram initials, crests, and vector letterforms.
              </div>

              <div>
                <label className="block text-xs font-bold text-vow-dark uppercase tracking-wider mb-1">
                  Text &amp; Logo Pre-Prompt Prefix
                </label>
                <textarea
                  rows={3}
                  value={textPrefix}
                  onChange={(e) => setTextPrefix(e.target.value)}
                  className="w-full bg-slate-50 border border-vow-border rounded-lg p-3 text-xs font-mono focus:ring-1 focus:ring-vow-dark focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-vow-dark uppercase tracking-wider mb-1">
                  Text &amp; Logo Pre-Prompt Suffix (Negative Guardrails)
                </label>
                <textarea
                  rows={3}
                  value={textSuffix}
                  onChange={(e) => setTextSuffix(e.target.value)}
                  className="w-full bg-slate-50 border border-vow-border rounded-lg p-3 text-xs font-mono focus:ring-1 focus:ring-vow-dark focus:outline-none"
                />
              </div>
            </div>
          )}

          {activeTab === "background" && (
            <div className="space-y-4">
              <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-lg text-indigo-900 text-[11px]">
                <strong className="font-bold">Background &amp; Pattern Rules:</strong> These rules strictly exclude names, words, and logos to generate textures, florals, watercolors, and frames.
              </div>

              <div>
                <label className="block text-xs font-bold text-vow-dark uppercase tracking-wider mb-1">
                  Background Pre-Prompt Prefix
                </label>
                <textarea
                  rows={3}
                  value={bgPrefix}
                  onChange={(e) => setBgPrefix(e.target.value)}
                  className="w-full bg-slate-50 border border-vow-border rounded-lg p-3 text-xs font-mono focus:ring-1 focus:ring-vow-dark focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-vow-dark uppercase tracking-wider mb-1">
                  Background Pre-Prompt Suffix (Strict Text Omission)
                </label>
                <textarea
                  rows={3}
                  value={bgSuffix}
                  onChange={(e) => setBgSuffix(e.target.value)}
                  className="w-full bg-slate-50 border border-vow-border rounded-lg p-3 text-xs font-mono focus:ring-1 focus:ring-vow-dark focus:outline-none"
                />
              </div>
            </div>
          )}

          {activeTab === "compiler" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-vow-dark uppercase tracking-wider mb-1">
                  Test User Prompt Input
                </label>
                <input
                  type="text"
                  value={testUserPrompt}
                  onChange={(e) => setTestUserPrompt(e.target.value)}
                  className="w-full bg-slate-50 border border-vow-border rounded-lg px-3 py-2 text-xs font-medium focus:ring-1 focus:ring-vow-dark focus:outline-none"
                  placeholder="Type a sample user prompt to test compilation..."
                />
              </div>

              <div className="p-4 bg-slate-900 text-slate-100 rounded-xl space-y-2 select-text font-mono text-[11px]">
                <div className="flex items-center justify-between text-vow-champagne font-bold uppercase tracking-wider text-[10px]">
                  <span>Compiled OpenAI Image AI Final Prompt ({aiGenerationType})</span>
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <p className="whitespace-pre-wrap leading-relaxed">{compiledTest.prompt}</p>
              </div>

              <div className="p-3 bg-slate-100 rounded-lg space-y-1">
                <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
                  Compiled Negative Keywords Array:
                </span>
                <div className="flex flex-wrap gap-1">
                  {compiledTest.negativePrompt.map((kw) => (
                    <span key={kw} className="px-1.5 py-0.5 bg-white text-slate-800 rounded border text-[10px] font-mono">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-vow-border bg-vow-paper flex items-center justify-between">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3.5 py-2 bg-white border border-vow-border hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Factory Defaults</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 bg-white border border-vow-border text-vow-dark rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 bg-vow-dark hover:bg-black text-vow-paper rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm"
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Saved Guidance!</span>
                </>
              ) : (
                <>
                  <Sliders className="w-3.5 h-3.5 text-vow-champagne" />
                  <span>Save Guidance &amp; Apply</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
