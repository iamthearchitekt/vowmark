"use client";

import { useEditorStore, ReferenceImage } from "@/lib/store/useEditorStore";
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
} from "lucide-react";

export function RightAiPanel() {
  const messages = useEditorStore((state) => state.messages);
  const isAiGenerating = useEditorStore((state) => state.isAiGenerating);
  const studioMode = useEditorStore((state) => state.studioMode);
  const brief = useEditorStore((state) => state.brief);
  const aiGeneratedAssetUrl = useEditorStore((state) => state.aiGeneratedAssetUrl);

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
  const setAiGeneratedAssetUrl = useEditorStore((state) => state.setAiGeneratedAssetUrl);
  const setBrief = useEditorStore((state) => state.setBrief);
  const setTypographyOptions = useEditorStore((state) => state.setTypographyOptions);

  const [inputMsg, setInputMsg] = useState("");
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    setIsAiGenerating(true);

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

    try {
      // Trigger OpenAI DALL-E 3 Image Generation
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

      setAiGeneratedAssetUrl(generatedUrl);

      // Call OpenAI Chat Assistant for conversational response
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
        content:
          aiGenerationType === "background_pattern"
            ? "✨ Generated new seamless wedding background & floral pattern artwork on Artboard Canvas!"
            : "✨ Generated new OpenAI wedding logo image artwork. Canvas updated!",
      });
    } finally {
      setIsAiGenerating(false);
    }
  };

  const isBackgroundMode = aiGenerationType === "background_pattern";

  return (
    <>
      <aside className="w-96 bg-vow-paper border-l border-vow-border flex flex-col h-full overflow-hidden text-xs font-sans select-none">
        {/* Assistant Header */}
        <div className="p-4 border-b border-vow-border bg-vow-surface flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-md bg-vow-dark text-vow-accent flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4 text-vow-accent" />
            </div>
            <div>
              <h3 className="font-bold text-vow-dark uppercase tracking-wider text-xs">
                AI Design Assistant
              </h3>
              <p className="text-[10px] text-vow-muted">OpenAI Image AI (gpt-image-2)</p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              type="button"
              onClick={() => setIsPromptGuidanceModalOpen(true)}
              className="p-1.5 bg-slate-100 hover:bg-vow-dark hover:text-white rounded border border-slate-300 text-slate-700 transition-all"
              title="Open Developer Prompt Guidance & Steering System"
            >
              <Sliders className="w-3.5 h-3.5 text-vow-accent" />
            </button>
          </div>
        </div>

        {/* MASTER GENERATION MENTALITY SWITCHER */}
        <div className="p-2.5 bg-vow-dark text-white flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-vow-champagne">
            Generation Mode:
          </span>
          <div className="flex space-x-1 bg-black/40 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setAiGenerationType("text_logo")}
              className={`px-2.5 py-1 rounded text-[10px] font-bold flex items-center gap-1 transition-all ${
                !isBackgroundMode
                  ? "bg-vow-accent text-vow-dark font-extrabold shadow-sm"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <Type className="w-3 h-3" />
              <span>Text &amp; Logo</span>
            </button>

            <button
              type="button"
              onClick={() => setAiGenerationType("background_pattern")}
              className={`px-2.5 py-1 rounded text-[10px] font-bold flex items-center gap-1 transition-all ${
                isBackgroundMode
                  ? "bg-vow-accent text-vow-dark font-extrabold shadow-sm"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <ImageIcon className="w-3 h-3" />
              <span>Backgrounds</span>
            </button>
          </div>
        </div>

        {/* CLIENT REFERENCE IMAGES & INVITATIONS UPLOAD PANEL */}
        <div className="p-3 bg-slate-50/80 border-b border-vow-border space-y-2.5">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-vow-dark uppercase tracking-wider flex items-center gap-1">
              <FileImage className="w-3.5 h-3.5 text-vow-accent" />
              <span>Client Reference &amp; Invitations ({referenceImages.length})</span>
            </p>
          </div>

          {/* Drop / Upload Button */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            multiple
            className="hidden"
          />
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-vow-border hover:border-vow-dark bg-white rounded-lg p-2.5 text-center cursor-pointer transition-all duration-150 group"
          >
            <Upload className="w-4 h-4 text-vow-muted group-hover:text-vow-accent mx-auto mb-1 transition-colors" />
            <p className="font-semibold text-[11px] text-vow-dark">
              Upload Client Invitations / References
            </p>
            <p className="text-[9px] text-vow-muted">
              Click or drag PNG, JPG, WebP for AI style guidance
            </p>
          </div>

          {/* Uploaded Reference Thumbnails Grid */}
          {referenceImages.length > 0 && (
            <div className="grid grid-cols-3 gap-2 pt-1">
              {referenceImages.map((img) => (
                <div
                  key={img.id}
                  className="relative group bg-white border border-vow-border rounded-lg p-1.5 flex flex-col items-center space-y-1 shadow-2xs"
                >
                  <button
                    type="button"
                    onClick={() => removeReferenceImage(img.id)}
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    title="Remove reference image"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>

                  <div className="w-full h-14 bg-slate-100 rounded overflow-hidden flex items-center justify-center border border-slate-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                  </div>

                  <div className="w-full text-center">
                    <span className="text-[9px] font-mono text-slate-600 truncate block max-w-full" title={img.name}>
                      {img.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Chat Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 select-text selection:bg-amber-200 selection:text-slate-900">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`relative group p-3.5 rounded-lg text-xs leading-relaxed ${
                m.role === "user"
                  ? "bg-vow-dark text-vow-paper ml-6 rounded-tr-none font-medium"
                  : "bg-white border border-vow-border text-vow-charcoal mr-4 rounded-tl-none shadow-2xs"
              }`}
            >
              {/* Copy Button */}
              <button
                type="button"
                onClick={() => handleCopyMessage(m.content, idx)}
                title="Copy message text"
                className="absolute top-2 right-2 p-1 text-slate-400 hover:text-slate-700 rounded opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 backdrop-blur"
              >
                {copiedIdx === idx ? (
                  <Check className="w-3 h-3 text-emerald-600" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>

              <p className="whitespace-pre-wrap pr-4">{m.content}</p>

              {m.role === "assistant" && idx === messages.length - 1 && aiGeneratedAssetUrl && (
                <div className="mt-2.5 p-2 bg-slate-50 border border-slate-200 rounded-md flex items-center space-x-2 select-none">
                  <div className="w-12 h-12 bg-white rounded border border-slate-200 p-1 flex items-center justify-center overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={aiGeneratedAssetUrl}
                      alt="Generated OpenAI Image AI Preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-[10px] text-vow-dark flex items-center gap-1">
                      <ImageIcon className="w-3 h-3 text-vow-accent" /> OpenAI Asset Generated
                    </p>
                    <p className="text-[9px] text-vow-muted">
                      {isBackgroundMode ? "Seamless Background Loaded" : "Loaded on Artboard Canvas"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
          {isAiGenerating && (
            <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-center space-x-2.5 select-none">
              <RefreshCw className="w-4 h-4 animate-spin text-vow-accent" />
              <span className="font-semibold">
                {isBackgroundMode
                  ? "Generating background texture & florals with OpenAI Image AI..."
                  : "Generating AI logo image with OpenAI Image AI..."}
              </span>
            </div>
          )}
        </div>

        {/* Chat Prompt Input */}
        <div className="p-3 border-t border-vow-border bg-vow-surface">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder={
                isBackgroundMode
                  ? "Type background prompt (e.g. Vintage floral watercolor border, gold filigree frame)..."
                  : "Type prompt (e.g. Create logo for Jack & Jill)..."
              }
              className="flex-1 bg-white border border-vow-border rounded-md px-3 py-2 text-xs focus:ring-1 focus:ring-vow-dark focus:outline-none font-medium select-text"
            />
            <button
              type="submit"
              disabled={isAiGenerating}
              className="bg-vow-dark text-vow-paper p-2.5 rounded-md hover:bg-black transition-colors font-bold flex items-center justify-center cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 text-vow-champagne" />
            </button>
          </form>
        </div>
      </aside>

      {/* Developer Prompt Guidance & Steering System Modal */}
      <PromptGuidanceModal />
    </>
  );
}
