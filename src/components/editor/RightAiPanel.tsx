"use client";

import { useEditorStore, ReferenceImage, TextBlendMode } from "@/lib/store/useEditorStore";
import { parseChatIntent } from "@/lib/ai/chat-parser";
import { PromptGuidanceModal } from "./PromptGuidanceModal";
import { useState, useRef } from "react";
import {
  Sparkles,
  Send,
  RefreshCw,
  Zap,
  Cpu,
  Image as ImageIcon,
  Copy,
  Check,
  Upload,
  X,
  FileImage,
  Tag,
  Sliders,
  Type,
  Layers,
  Trash2,
  Blend,
  Paperclip,
} from "lucide-react";

function isImageGenerationTrigger(text: string): boolean {
  const lower = text.toLowerCase().trim();
  return (
    lower.startsWith("make me") ||
    lower.startsWith("make a") ||
    lower.startsWith("generate") ||
    lower.startsWith("create") ||
    lower.startsWith("draw") ||
    lower.startsWith("design a") ||
    lower.startsWith("build") ||
    lower.startsWith("render") ||
    lower.includes("make me a") ||
    lower.includes("make a ") ||
    lower.includes("generate a") ||
    lower.includes("create a") ||
    lower.includes("make background") ||
    lower.includes("generate background")
  );
}

export function RightAiPanel() {
  const [inputMsg, setInputMsg] = useState("");
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const promptInputRef = useRef<HTMLInputElement>(null);

  const messages = useEditorStore((state) => state.messages);
  const isAiGenerating = useEditorStore((state) => state.isAiGenerating);
  const studioMode = useEditorStore((state) => state.studioMode);
  const brief = useEditorStore((state) => state.brief);

  // 2-Layer Composition State
  const backgroundPatternAssetUrl = useEditorStore((state) => state.backgroundPatternAssetUrl);
  const backgroundLayerOpacity = useEditorStore((state) => state.backgroundLayerOpacity ?? 100);
  const textLogoAssetUrl = useEditorStore((state) => state.textLogoAssetUrl);
  const textLayerBlendMode = useEditorStore((state) => state.textLayerBlendMode);
  const textLayerOpacity = useEditorStore((state) => state.textLayerOpacity ?? 100);

  const setBackgroundPatternAssetUrl = useEditorStore((state) => state.setBackgroundPatternAssetUrl);
  const setBackgroundLayerOpacity = useEditorStore((state) => state.setBackgroundLayerOpacity);
  const setTextLogoAssetUrl = useEditorStore((state) => state.setTextLogoAssetUrl);
  const setTextLayerBlendMode = useEditorStore((state) => state.setTextLayerBlendMode);
  const setTextLayerOpacity = useEditorStore((state) => state.setTextLayerOpacity);

  const aiGenerationType = useEditorStore((state) => state.aiGenerationType);
  const canvasFormat = useEditorStore((state) => state.canvasFormat);
  const setAiGenerationType = useEditorStore((state) => state.setAiGenerationType);
  const promptGuidanceConfig = useEditorStore((state) => state.promptGuidanceConfig);
  const setIsPromptGuidanceModalOpen = useEditorStore((state) => state.setIsPromptGuidanceModalOpen);

  const referenceImages = useEditorStore((state) => state.referenceImages);
  const addReferenceImage = useEditorStore((state) => state.addReferenceImage);
  const removeReferenceImage = useEditorStore((state) => state.removeReferenceImage);

  const addMessage = useEditorStore((state) => state.addMessage);
  const setIsAiGenerating = useEditorStore((state) => state.setIsAiGenerating);
  const setBrief = useEditorStore((state) => state.setBrief);
  const setTypographyOptions = useEditorStore((state) => state.setTypographyOptions);

  const handleCopyMessage = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      const objectUrl = URL.createObjectURL(file);
      addReferenceImage({
        id: `ref_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        url: objectUrl,
        name: file.name,
        tag: "Reference",
      });
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputMsg;
    if (!textToSend.trim()) return;

    addMessage({ role: "user", content: textToSend });
    if (!customPrompt) setInputMsg("");

    const isGeneration = isImageGenerationTrigger(textToSend);

    // Parse intent cleanly
    const intent = parseChatIntent(textToSend);

    const updatedBriefData: any = {
      generationPrompt: textToSend,
      generationType: aiGenerationType,
      guidanceConfig: promptGuidanceConfig,
    };

    if (
      aiGenerationType === "text_logo" &&
      intent.primaryText &&
      intent.primaryText.length <= 15 &&
      intent.secondaryText &&
      intent.secondaryText.length <= 15
    ) {
      updatedBriefData.primaryText = intent.primaryText;
      updatedBriefData.secondaryText = intent.secondaryText;
      setTypographyOptions({
        primaryText: intent.primaryText,
        secondaryText: intent.secondaryText,
      });
    }

    if (intent.assetType) {
      updatedBriefData.assetType = intent.assetType;
    }
    if (intent.weddingStyle) {
      updatedBriefData.weddingStyle = intent.weddingStyle;
    }

    setBrief(updatedBriefData);

    const mergedBrief = {
      ...brief,
      ...updatedBriefData,
      generationPrompt: textToSend,
      generationType: aiGenerationType,
      canvasFormat: canvasFormat,
      guidanceConfig: promptGuidanceConfig,
      referenceImages: referenceImages.map((img) => ({ url: img.url, tag: img.tag })),
    };

    if (isGeneration) {
      // Trigger OpenAI Image Generation mode
      setIsAiGenerating(true);
      try {
        const genRes = await fetch("/api/ai/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            brief: mergedBrief,
            action: "generate",
          }),
        });

        const genData = await genRes.json();
        const generatedUrl = genData.result?.imageUrl || "/samples/generated-wedding-logo.svg";

        if (aiGenerationType === "background_pattern") {
          setBackgroundPatternAssetUrl(generatedUrl);
          addMessage({
            role: "assistant",
            content: "Layer 1 (Background & Pattern) generation completed. Canvas updated.",
          });
        } else {
          setTextLogoAssetUrl(generatedUrl);
          addMessage({
            role: "assistant",
            content: "Layer 2 (Text & Monogram Logo) generation completed. Canvas updated.",
          });
        }
      } catch (err) {
        addMessage({
          role: "assistant",
          content: "Generation failed. Please try again.",
        });
      } finally {
        setIsAiGenerating(false);
      }
    } else {
      // Conversational Design Planning Mode (Instant ChatGPT Response)
      try {
        const chatRes = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...messages, { role: "user", content: textToSend }],
            currentBrief: mergedBrief,
          }),
        });

        const chatData = await chatRes.json();
        if (chatData.message) {
          addMessage({ role: "assistant", content: chatData.message });
        }
      } catch (err) {
        addMessage({
          role: "assistant",
          content: "Design planning response logged. Click 'Visualize' when ready to render artwork on canvas.",
        });
      }
    }
  };

  const handleVisualizeFromConversation = async () => {
    // Collect entire chat history between user and assistant
    const chatHistorySummary = messages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
      .join("\n");

    const textSummary =
      chatHistorySummary || "Create a bespoke luxury wedding identity mark based on our design preferences.";

    addMessage({
      role: "user",
      content: "🎨 Visualize latest conversation artwork on canvas.",
    });

    setIsAiGenerating(true);

    const intent = parseChatIntent(textSummary);

    const updatedBriefData: any = {
      generationPrompt: textSummary,
      generationType: aiGenerationType,
      guidanceConfig: promptGuidanceConfig,
    };

    if (
      aiGenerationType === "text_logo" &&
      intent.primaryText &&
      intent.primaryText.length <= 15 &&
      intent.secondaryText &&
      intent.secondaryText.length <= 15
    ) {
      updatedBriefData.primaryText = intent.primaryText;
      updatedBriefData.secondaryText = intent.secondaryText;
      setTypographyOptions({
        primaryText: intent.primaryText,
        secondaryText: intent.secondaryText,
      });
    }

    if (intent.assetType) {
      updatedBriefData.assetType = intent.assetType;
    }
    if (intent.weddingStyle) {
      updatedBriefData.weddingStyle = intent.weddingStyle;
    }

    setBrief(updatedBriefData);

    const mergedBrief = {
      ...brief,
      ...updatedBriefData,
      generationPrompt: textSummary,
      generationType: aiGenerationType,
      canvasFormat: canvasFormat,
      guidanceConfig: promptGuidanceConfig,
      referenceImages: referenceImages.map((img) => ({ url: img.url, tag: img.tag })),
    };

    try {
      const genRes = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brief: mergedBrief,
          action: "generate",
        }),
      });

      const genData = await genRes.json();
      const generatedUrl = genData.result?.imageUrl || "/samples/generated-wedding-logo.svg";

      if (aiGenerationType === "background_pattern") {
        setBackgroundPatternAssetUrl(generatedUrl);
        addMessage({
          role: "assistant",
          content: "Layer 1 (Background Pattern) generated from conversation history. Canvas updated.",
        });
      } else {
        setTextLogoAssetUrl(generatedUrl);
        addMessage({
          role: "assistant",
          content: "Layer 2 (Text & Monogram Logo) generated from conversation history. Canvas updated.",
        });
      }
    } catch (err) {
        addMessage({
          role: "assistant",
          content: "Generation failed. Please try again.",
        });
    } finally {
      setIsAiGenerating(false);
    }
  };

  const isBackgroundMode = aiGenerationType === "background_pattern";

  return (
    <>
      <aside className="w-[480px] bg-vow-paper border-l border-vow-border flex flex-col h-full overflow-hidden text-sm font-sans select-none">
        {/* Assistant Header */}
        <div className="p-4 border-b border-vow-border bg-vow-surface flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-md bg-vow-dark text-vow-accent flex items-center justify-center font-bold">
              <Sparkles className="w-4.5 h-4.5 text-vow-accent" />
            </div>
            <div>
              <h3 className="font-bold text-vow-dark uppercase tracking-wider text-sm">
                AI Design Assistant
              </h3>
              <p className="text-xs text-vow-muted">OpenAI Image AI (DALL·E 3)</p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              type="button"
              onClick={() => setIsPromptGuidanceModalOpen(true)}
              className="p-1.5 bg-slate-100 hover:bg-vow-dark hover:text-white rounded border border-slate-300 text-slate-700 transition-all cursor-pointer"
              title="Open Developer Prompt Guidance & Steering System"
            >
              <Sliders className="w-4 h-4 text-vow-accent" />
            </button>
          </div>
        </div>

        {/* MASTER GENERATION MENTALITY SWITCHER */}
        <div className="p-3 bg-vow-dark text-white flex items-center justify-between">
          <span className="text-xs font-mono uppercase font-bold tracking-wider text-vow-champagne">
            Target Layer:
          </span>
          <div className="flex space-x-1 bg-black/40 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setAiGenerationType("text_logo")}
              className={`px-3 py-1 rounded text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                !isBackgroundMode
                  ? "bg-vow-accent text-vow-dark font-extrabold shadow-sm"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <Type className="w-3 h-3" />
              <span>Layer 2: Text &amp; Logo</span>
            </button>

            <button
              type="button"
              onClick={() => setAiGenerationType("background_pattern")}
              className={`px-2.5 py-1 rounded text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                isBackgroundMode
                  ? "bg-vow-accent text-vow-dark font-extrabold shadow-sm"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <ImageIcon className="w-3 h-3" />
              <span>Layer 1: Background</span>
            </button>
          </div>
        </div>

        {/* 2-LAYER INDEPENDENT COMPOSITION WIDGET WITH BLENDING MODES & OPACITY SLIDERS */}
        <div className="p-3.5 bg-slate-100/90 border-b border-vow-border space-y-3 font-sans">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-vow-dark uppercase tracking-wider flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-vow-accent" />
              <span>2-Layer Composition Stack</span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* Layer 1: Background */}
            <div className={`p-2 rounded border transition-all ${
              backgroundPatternAssetUrl ? "bg-white border-slate-300 shadow-2xs" : "bg-slate-50 border-dashed border-slate-300"
            }`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-600">Layer 1: Background</span>
                {backgroundPatternAssetUrl && (
                  <button
                    type="button"
                    onClick={() => setBackgroundPatternAssetUrl(null)}
                    className="text-slate-400 hover:text-rose-600 p-0.5 cursor-pointer"
                    title="Clear Background Layer"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
              <div className="h-10 rounded overflow-hidden bg-slate-100 flex items-center justify-center border border-slate-200">
                {backgroundPatternAssetUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={backgroundPatternAssetUrl} alt="Background Layer" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[9px] text-slate-400 italic">Pure White</span>
                )}
              </div>
            </div>

            {/* Layer 2: Text / Logo */}
            <div className={`p-2 rounded border transition-all ${
              textLogoAssetUrl ? "bg-white border-slate-300 shadow-2xs" : "bg-slate-50 border-dashed border-slate-300"
            }`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-600">Layer 2: Text &amp; Logo</span>
                {textLogoAssetUrl && (
                  <button
                    type="button"
                    onClick={() => setTextLogoAssetUrl(null)}
                    className="text-slate-400 hover:text-rose-600 p-0.5 cursor-pointer"
                    title="Clear Text & Monogram Layer"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
              <div className="h-10 rounded overflow-hidden bg-slate-100 flex items-center justify-center border border-slate-200">
                {textLogoAssetUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={textLogoAssetUrl} alt="Text Logo Layer" className="w-full h-full object-contain p-0.5" />
                ) : (
                  <span className="text-[9px] text-slate-400 italic">Vector Engine Overlay</span>
                )}
              </div>
            </div>
          </div>

          {/* Layer 1 Background Opacity Slider & Layer 2 Blend Mode Controls */}
          <div className="space-y-2 pt-1 font-sans text-[10px]">
            {/* Layer 1 Background Opacity Slider */}
            <div className="flex items-center justify-between">
              <span className="font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                <ImageIcon className="w-3 h-3 text-vow-accent" />
                Layer 1 Background Opacity:
              </span>
              <div className="flex items-center space-x-1.5 bg-slate-200/60 px-2 py-0.5 rounded-md border border-slate-300/70">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={backgroundLayerOpacity}
                  onChange={(e) => setBackgroundLayerOpacity(Number(e.target.value))}
                  className="w-20 accent-vow-dark cursor-pointer h-1 bg-slate-300 rounded"
                  title="Adjust Layer 1 Background Opacity (0% to 100%)"
                />
                <span className="font-mono text-[9px] font-bold text-vow-dark min-w-[28px] text-right">
                  {backgroundLayerOpacity}%
                </span>
              </div>
            </div>

            {/* Layer 2 Blend Mode Selector & Opacity */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <span className="font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                  <Blend className="w-3 h-3 text-vow-accent" />
                  L2 Blend:
                </span>
                <div className="flex space-x-0.5 bg-slate-200/80 p-0.5 rounded-md border border-slate-300">
                  {(["normal", "multiply", "overlay"] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setTextLayerBlendMode(mode)}
                      className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase transition-all cursor-pointer ${
                        textLayerBlendMode === mode
                          ? "bg-vow-dark text-white shadow-2xs font-extrabold"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-1.5 bg-slate-200/60 px-2 py-0.5 rounded-md border border-slate-300/70">
                <span className="text-[9px] font-mono text-slate-500 font-bold uppercase">L2 Op:</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={textLayerOpacity}
                  onChange={(e) => setTextLayerOpacity(Number(e.target.value))}
                  className="w-14 accent-vow-dark cursor-pointer h-1 bg-slate-300 rounded"
                  title="Adjust Layer 2 Text Opacity (0% to 100%)"
                />
                <span className="font-mono text-[9px] font-bold text-vow-dark min-w-[24px] text-right">
                  {textLayerOpacity}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 select-text selection:bg-amber-200 selection:text-slate-900 font-sans">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`relative group p-4 rounded-lg text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-vow-dark text-vow-paper ml-8 rounded-tr-none font-medium"
                  : "bg-white border border-vow-border text-vow-charcoal mr-6 rounded-tl-none shadow-2xs"
              }`}
            >
              <button
                type="button"
                onClick={() => handleCopyMessage(m.content, idx)}
                title="Copy message text"
                className="absolute top-2 right-2 p-1 text-slate-400 hover:text-slate-700 rounded opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 backdrop-blur cursor-pointer"
              >
                {copiedIdx === idx ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>

              <p className="whitespace-pre-wrap pr-4">{m.content}</p>
            </div>
          ))}
          {isAiGenerating && (
            <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-lg text-sm text-amber-900 flex items-center space-x-3 select-none">
              <RefreshCw className="w-4 h-4 animate-spin text-vow-accent" />
              <span className="font-semibold">
                {isBackgroundMode
                  ? "Generating background texture..."
                  : "Generating AI image..."}
              </span>
            </div>
          )}
        </div>

        {/* Attached Reference Images Thumbnails Bar (Compact) */}
        {referenceImages.length > 0 && (
          <div className="px-3 py-1.5 bg-slate-100 border-t border-vow-border flex items-center space-x-2 overflow-x-auto">
            <span className="text-[9px] font-mono text-vow-muted uppercase font-bold flex-shrink-0">
              Refs ({referenceImages.length}):
            </span>
            {referenceImages.map((img) => (
              <div
                key={img.id}
                className="relative group flex-shrink-0 w-8 h-8 rounded border border-slate-300 bg-white overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => removeReferenceImage(img.id)}
                  className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-rose-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer"
                  title="Remove reference"
                >
                  <X className="w-2 h-2" />
                </button>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}

        {/* Chat Prompt Input with File Upload Button Next to Send Button */}
        <div className="p-3.5 border-t border-vow-border bg-vow-surface space-y-2">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleVisualizeFromConversation}
              disabled={isAiGenerating}
              className="px-3.5 py-1.5 bg-vow-accent hover:brightness-110 border border-vow-accent rounded-md text-xs font-black text-vow-dark flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer disabled:opacity-50"
              title="Synthesize our latest conversation into new artwork on canvas"
            >
              <Sparkles className="w-4 h-4 text-vow-dark fill-vow-dark" />
              <span>Visualize Conversation Artwork</span>
            </button>
            <span className="text-[10px] text-vow-muted font-mono">
              Target: {isBackgroundMode ? "Layer 1 (Background)" : "Layer 2 (Text & Logo)"}
            </span>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center space-x-2"
          >
            {/* Hidden Input File for Reference Upload */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              multiple
              className="hidden"
            />

            {/* Reference Upload Icon Button Next to Chat Input */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 bg-white hover:bg-slate-100 text-slate-600 rounded-md border border-vow-border transition-colors flex items-center justify-center cursor-pointer shadow-2xs"
              title="Attach Client Reference Images / Invitations"
            >
              <Paperclip className="w-4 h-4 text-vow-dark" />
            </button>

            <input
              ref={promptInputRef}
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder={
                isBackgroundMode
                  ? "Type background prompt (e.g. Make me a vintage floral watercolor border)..."
                  : "Type prompt (e.g. Make me a logo for Jack & Jill)..."
              }
              className="flex-1 bg-white border border-vow-border rounded-md px-3.5 py-2.5 text-sm focus:ring-1 focus:ring-vow-dark focus:outline-none font-medium select-text"
            />
            <button
              type="submit"
              disabled={isAiGenerating}
              className="bg-vow-dark text-vow-paper p-3 rounded-md hover:bg-black transition-colors font-bold flex items-center justify-center cursor-pointer"
            >
              <Send className="w-4 h-4 text-vow-champagne" />
            </button>
          </form>
        </div>
      </aside>

      {/* Developer Prompt Guidance & Steering System Modal */}
      <PromptGuidanceModal />
    </>
  );
}
