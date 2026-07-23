"use client";

import { useEditorStore, CanvasFormat } from "@/lib/store/useEditorStore";
import { parseChatIntent } from "@/lib/ai/chat-parser";
import { PromptGuidanceModal } from "./PromptGuidanceModal";
import { useState, useRef } from "react";
import {
  Sparkles,
  Send,
  RefreshCw,
  Image as ImageIcon,
  Copy,
  Check,
  X,
  Sliders,
  Type,
  Layers,
  Trash2,
  Blend,
  Paperclip,
  Eye,
  EyeOff,
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
  const layer1Visible = useEditorStore((state) => state.layer1Visible ?? true);
  const textLogoAssetUrl = useEditorStore((state) => state.textLogoAssetUrl);
  const textLayerBlendMode = useEditorStore((state) => state.textLayerBlendMode);
  const textLayerOpacity = useEditorStore((state) => state.textLayerOpacity ?? 100);
  const layer2Visible = useEditorStore((state) => state.layer2Visible ?? true);

  const setBackgroundPatternAssetUrl = useEditorStore((state) => state.setBackgroundPatternAssetUrl);
  const setBackgroundLayerOpacity = useEditorStore((state) => state.setBackgroundLayerOpacity);
  const setLayer1Visible = useEditorStore((state) => state.setLayer1Visible);
  const setTextLogoAssetUrl = useEditorStore((state) => state.setTextLogoAssetUrl);
  const setTextLayerBlendMode = useEditorStore((state) => state.setTextLayerBlendMode);
  const setTextLayerOpacity = useEditorStore((state) => state.setTextLayerOpacity);
  const setLayer2Visible = useEditorStore((state) => state.setLayer2Visible);

  const aiGenerationType = useEditorStore((state) => state.aiGenerationType);
  const canvasFormat = useEditorStore((state) => state.canvasFormat);
  const setAiGenerationType = useEditorStore((state) => state.setAiGenerationType);
  const promptGuidanceConfig = useEditorStore((state) => state.promptGuidanceConfig);
  const activeGuardrailPresetId = useEditorStore((state) => state.activeGuardrailPresetId);
  const setActiveGuardrailPresetId = useEditorStore((state) => state.setActiveGuardrailPresetId);
  const setIsPromptGuidanceModalOpen = useEditorStore((state) => state.setIsPromptGuidanceModalOpen);

  const referenceImages = useEditorStore((state) => state.referenceImages);
  const addReferenceImage = useEditorStore((state) => state.addReferenceImage);
  const removeReferenceImage = useEditorStore((state) => state.removeReferenceImage);

  const backgroundSuite = useEditorStore((state) => state.backgroundSuite);
  const setBackgroundSuite = useEditorStore((state) => state.setBackgroundSuite);
  const multiFormatSuiteEnabled = useEditorStore((state) => state.multiFormatSuiteEnabled);
  const setMultiFormatSuiteEnabled = useEditorStore((state) => state.setMultiFormatSuiteEnabled);
  const setCanvasFormat = useEditorStore((state) => state.setCanvasFormat);

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

          if (multiFormatSuiteEnabled) {
            const formats: CanvasFormat[] = ["2_x_6", "4_x_6", "6_x_4", "square"];
            const suiteResults: Record<string, string> = { [canvasFormat]: generatedUrl };
            const remainingFormats = formats.filter((f) => f !== canvasFormat);

            const suitePromises = remainingFormats.map(async (fmt) => {
              try {
                const sRes = await fetch("/api/ai/generate", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    brief: { ...mergedBrief, canvasFormat: fmt },
                    action: "generate",
                  }),
                });
                const sData = await sRes.json();
                if (sData.result?.imageUrl) {
                  suiteResults[fmt] = sData.result.imageUrl;
                }
              } catch (e) {
                console.error(`Suite generation error for ${fmt}:`, e);
              }
            });

            await Promise.all(suitePromises);
            setBackgroundSuite(suiteResults);

            addMessage({
              role: "assistant",
              content: "✨ Multi-Format Aspect Ratio Suite generated for 2x6, 4x6, 6x4 & Square! Switch aspect ratios anytime to preview fitted artwork.",
            });
          } else {
            addMessage({
              role: "assistant",
              content: "Layer 1 (Background & Pattern) generation completed. Canvas updated.",
            });
          }
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
          addMessage({
            role: "assistant",
            content: chatData.message,
            flowerOptions: chatData.flowerSuggestions,
          });
        }
      } catch (err) {
        addMessage({
          role: "assistant",
          content: "Design planning response logged. Click 'Visualize' when ready to render artwork on canvas.",
        });
      }
    }
  };

  const handleSelectFlowerSuggestion = (flowerChoice: string) => {
    if (isBackgroundMode) {
      setActiveGuardrailPresetId("lush_color_florals");
    }
    const flowerPrompt = `Feature ${flowerChoice} with elegant botanical details in the design`;
    addMessage({ role: "user", content: flowerPrompt });
    handleSendMessage(flowerPrompt);
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
              className="px-2 py-1 bg-stone-100 hover:bg-vow-dark hover:text-white rounded border border-stone-300 text-stone-700 transition-all cursor-pointer flex items-center gap-1.5 text-[10px] font-bold"
              title="Open Guardrail Presets & Steering Settings"
            >
              <Sliders className="w-3.5 h-3.5 text-vow-accent" />
              <span className="truncate max-w-[120px]">
                {activeGuardrailPresetId === "bse_photobooth_master" ? "BSE Preset" : "Guardrails"}
              </span>
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
                  : "text-stone-300 hover:text-white"
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
                  : "text-stone-300 hover:text-white"
              }`}
            >
              <ImageIcon className="w-3 h-3" />
              <span>Layer 1: Background</span>
            </button>
          </div>
        </div>

        {/* 2-LAYER INDEPENDENT COMPOSITION WIDGET WITH BLENDING MODES & OPACITY SLIDERS */}
        <div className="p-3.5 bg-stone-100/90 border-b border-vow-border space-y-3 font-sans">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-vow-dark uppercase tracking-wider flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-vow-accent" />
              <span>2-Layer Composition Stack</span>
            </span>
          </div>

          {/* Multi-Format Aspect Ratio Suite Controls */}
          <div className="p-2 bg-white border border-stone-200 rounded-lg space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold uppercase tracking-wider text-vow-dark flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-vow-accent" />
                <span>Multi-Format Suite (All Aspect Ratios)</span>
              </span>
              <button
                type="button"
                onClick={() => setMultiFormatSuiteEnabled(!multiFormatSuiteEnabled)}
                className={`px-1.5 py-0.5 rounded text-[8px] font-bold border transition-all cursor-pointer ${
                  multiFormatSuiteEnabled
                    ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                    : "bg-stone-100 border-stone-300 text-stone-500"
                }`}
                title="Toggle simultaneous generation across all 4 aspect ratios (2x6, 4x6, 6x4, 1:1)"
              >
                {multiFormatSuiteEnabled ? "ON (4 Ratios)" : "OFF (Single)"}
              </button>
            </div>

            {backgroundSuite && (
              <div className="grid grid-cols-4 gap-1 pt-1">
                {(["2_x_6", "4_x_6", "6_x_4", "square"] as CanvasFormat[]).map((fmt) => {
                  const url = backgroundSuite[fmt];
                  const isActive = canvasFormat === fmt;
                  const label = fmt === "2_x_6" ? "2x6" : fmt === "4_x_6" ? "4x6" : fmt === "6_x_4" ? "6x4" : "1:1";
                  return (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => setCanvasFormat(fmt)}
                      className={`relative rounded border overflow-hidden text-center transition-all cursor-pointer p-0.5 ${
                        isActive ? "border-vow-dark ring-1 ring-vow-dark bg-amber-50" : "border-stone-200 hover:border-stone-400 bg-stone-50"
                      }`}
                      title={`Switch to ${label} aspect ratio`}
                    >
                      <div className="h-8 w-full bg-stone-100 rounded overflow-hidden flex items-center justify-center relative">
                        {url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={url} alt={label} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[8px] text-stone-400 font-mono">None</span>
                        )}
                        {isActive && (
                          <div className="absolute inset-0 bg-vow-dark/20 flex items-center justify-center">
                            <span className="text-[7px] font-black text-white bg-vow-dark px-1 rounded uppercase">Active</span>
                          </div>
                        )}
                      </div>
                      <span className="text-[8px] font-bold font-mono text-stone-700 block mt-0.5 uppercase">{label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* Layer 1: Background */}
            <div className={`p-2 rounded border transition-all ${
              backgroundPatternAssetUrl ? "bg-white border-stone-300 shadow-2xs" : "bg-stone-50 border-dashed border-stone-300"
            } ${!layer1Visible ? "opacity-60" : ""}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] font-bold uppercase tracking-wider text-stone-600">Layer 1: Background</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setLayer1Visible(!layer1Visible)}
                    className={`p-0.5 transition-colors cursor-pointer ${
                      layer1Visible ? "text-stone-600 hover:text-vow-dark" : "text-stone-400 hover:text-stone-600"
                    }`}
                    title={layer1Visible ? "Hide Layer 1 Background" : "Show Layer 1 Background"}
                  >
                    {layer1Visible ? <Eye className="w-3 h-3 text-vow-accent" /> : <EyeOff className="w-3 h-3 text-stone-400" />}
                  </button>
                  {backgroundPatternAssetUrl && (
                    <button
                      type="button"
                      onClick={() => setBackgroundPatternAssetUrl(null)}
                      className="text-stone-400 hover:text-rose-600 p-0.5 cursor-pointer"
                      title="Clear Background Layer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
              <div className="h-10 rounded overflow-hidden bg-stone-100 flex items-center justify-center border border-stone-200 relative">
                {backgroundPatternAssetUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={backgroundPatternAssetUrl} alt="Background Layer" className={`w-full h-full object-cover ${!layer1Visible ? "opacity-30 grayscale" : ""}`} />
                ) : (
                  <span className="text-[9px] text-stone-400 italic">Pure White</span>
                )}
                {!layer1Visible && (
                  <span className="absolute text-[9px] font-bold text-stone-500 bg-white/80 px-1 rounded uppercase">Hidden</span>
                )}
              </div>
            </div>

            {/* Layer 2: Text / Logo */}
            <div className={`p-2 rounded border transition-all ${
              textLogoAssetUrl ? "bg-white border-stone-300 shadow-2xs" : "bg-stone-50 border-dashed border-stone-300"
            } ${!layer2Visible ? "opacity-60" : ""}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] font-bold uppercase tracking-wider text-stone-600">Layer 2: Text &amp; Logo</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setLayer2Visible(!layer2Visible)}
                    className={`p-0.5 transition-colors cursor-pointer ${
                      layer2Visible ? "text-stone-600 hover:text-vow-dark" : "text-stone-400 hover:text-stone-600"
                    }`}
                    title={layer2Visible ? "Hide Layer 2 Text & Monogram" : "Show Layer 2 Text & Monogram"}
                  >
                    {layer2Visible ? <Eye className="w-3 h-3 text-vow-accent" /> : <EyeOff className="w-3 h-3 text-stone-400" />}
                  </button>
                  {textLogoAssetUrl && (
                    <button
                      type="button"
                      onClick={() => setTextLogoAssetUrl(null)}
                      className="text-stone-400 hover:text-rose-600 p-0.5 cursor-pointer"
                      title="Clear Text & Monogram Layer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
              <div className="h-10 rounded overflow-hidden bg-stone-100 flex items-center justify-center border border-stone-200 relative">
                {textLogoAssetUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={textLogoAssetUrl} alt="Text Logo Layer" className={`w-full h-full object-contain p-0.5 ${!layer2Visible ? "opacity-30 grayscale" : ""}`} />
                ) : (
                  <span className={`text-[9px] text-stone-400 italic ${!layer2Visible ? "opacity-50" : ""}`}>Vector Engine Overlay</span>
                )}
                {!layer2Visible && (
                  <span className="absolute text-[9px] font-bold text-stone-500 bg-white/80 px-1 rounded uppercase">Hidden</span>
                )}
              </div>
            </div>
          </div>

          {/* Layer 1 Background Opacity Slider & Layer 2 Blend Mode Controls */}
          <div className="space-y-2 pt-1 font-sans text-[10px]">
            {/* Layer 1 Background Opacity Slider */}
            <div className="flex items-center justify-between">
              <span className="font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1">
                <ImageIcon className="w-3 h-3 text-vow-accent" />
                Layer 1 Opacity:
              </span>
              <div className="flex items-center space-x-1.5 bg-stone-200/60 px-2 py-0.5 rounded-md border border-stone-300/70">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={backgroundLayerOpacity}
                  onChange={(e) => setBackgroundLayerOpacity(Number(e.target.value))}
                  className="w-20 accent-vow-dark cursor-pointer h-1 bg-stone-300 rounded"
                  title="Adjust Layer 1 Background Opacity"
                />
                <span className="font-mono text-[9px] font-bold text-vow-dark min-w-[28px] text-right">
                  {backgroundLayerOpacity}%
                </span>
              </div>
            </div>

            {/* Layer 2 Blend Mode Selector & Opacity */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <span className="font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1">
                  <Blend className="w-3 h-3 text-vow-accent" />
                  L2 Blend:
                </span>
                <div className="flex space-x-0.5 bg-stone-200/80 p-0.5 rounded-md border border-stone-300">
                  {(["normal", "multiply", "overlay"] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setTextLayerBlendMode(mode)}
                      className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase transition-all cursor-pointer ${
                        textLayerBlendMode === mode
                          ? "bg-vow-dark text-white shadow-2xs font-extrabold"
                          : "text-stone-600 hover:text-stone-900"
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-1.5 bg-stone-200/60 px-2 py-0.5 rounded-md border border-stone-300/70">
                <span className="text-[9px] font-mono text-stone-500 font-bold uppercase">L2 Op:</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={textLayerOpacity}
                  onChange={(e) => setTextLayerOpacity(Number(e.target.value))}
                  className="w-14 accent-vow-dark cursor-pointer h-1 bg-stone-300 rounded"
                  title="Adjust Layer 2 Text Opacity"
                />
                <span className="font-mono text-[9px] font-bold text-vow-dark min-w-[24px] text-right">
                  {textLayerOpacity}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 select-text selection:bg-amber-200 selection:text-stone-900 font-sans">
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
                className="absolute top-2 right-2 p-1 text-stone-400 hover:text-stone-700 rounded opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 backdrop-blur cursor-pointer"
              >
                {copiedIdx === idx ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>

              <p className="whitespace-pre-wrap pr-4">{m.content}</p>

              {m.flowerOptions && m.flowerOptions.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-stone-200/80 space-y-1.5 font-sans">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-vow-dark flex items-center gap-1">
                    <span>🌸 Select Flower &amp; Botanical Species:</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {m.flowerOptions.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleSelectFlowerSuggestion(opt)}
                        className="px-2.5 py-1 bg-white hover:bg-vow-dark hover:text-vow-accent border border-vow-border text-vow-dark text-[11px] font-bold rounded-lg transition-all cursor-pointer shadow-2xs active:scale-95 flex items-center gap-1"
                      >
                        <span className="text-vow-accent font-black">+</span>
                        <span>{opt}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
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
          <div className="px-3 py-1.5 bg-stone-100 border-t border-vow-border flex items-center space-x-2 overflow-x-auto">
            <span className="text-[9px] font-mono text-vow-muted uppercase font-bold flex-shrink-0">
              Refs ({referenceImages.length}):
            </span>
            {referenceImages.map((img) => (
              <div
                key={img.id}
                className="relative group flex-shrink-0 w-8 h-8 rounded border border-stone-300 bg-white overflow-hidden"
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
              title="Synthesize conversation artwork"
            >
              <Sparkles className="w-4 h-4 text-vow-dark fill-vow-dark" />
              <span>Visualize Conversation Artwork</span>
            </button>
            <span className="text-[10px] text-vow-muted font-mono">
              Target: {isBackgroundMode ? "Layer 1" : "Layer 2"}
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
              className="p-2.5 bg-white hover:bg-stone-100 text-stone-600 rounded-md border border-vow-border transition-colors flex items-center justify-center cursor-pointer shadow-2xs"
              title="Attach Client Reference Images"
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
                  ? "Type background prompt..."
                  : "Type prompt..."
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
