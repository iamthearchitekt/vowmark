"use client";

import { FontRecord } from "@/lib/typography/fonts-db";
import { useState } from "react";
import { Tag, X, Plus, RotateCcw, Check, Sparkles } from "lucide-react";

interface FontTagEditorModalProps {
  font: FontRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveTags: (fontId: string, updatedTags: string[], subclassification?: string) => void;
}

const PRESET_TAG_SUGGESTIONS = [
  "editorial",
  "luxury",
  "formal",
  "serif",
  "sans",
  "script",
  "calligraphy",
  "modern",
  "vintage",
  "minimalist",
  "high contrast",
  "romantic",
  "black tie",
  "didone",
  "inscription",
  "monogram",
  "initials",
  "handwritten",
  "bold",
];

export function FontTagEditorModal({
  font,
  isOpen,
  onClose,
  onSaveTags,
}: FontTagEditorModalProps) {
  const [tags, setTags] = useState<string[]>(font?.weddingTags || []);
  const [subclass, setSubclass] = useState<string>(font?.subclassification || "serif");
  const [newTagInput, setNewTagInput] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  // Sync state when font prop changes
  if (!isOpen || !font) return null;

  const handleAddTag = (tagToAdd: string) => {
    const cleanTag = tagToAdd.trim().toLowerCase();
    if (cleanTag && !tags.includes(cleanTag)) {
      setTags([...tags, cleanTag]);
    }
    setNewTagInput("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSave = () => {
    onSaveTags(font.id, tags, subclass);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 font-sans select-none animate-in fade-in duration-200">
      <div className="bg-white border border-vow-border w-full max-w-lg rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-vow-border bg-vow-paper flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-vow-dark text-vow-accent flex items-center justify-center font-bold shadow-sm">
              <Tag className="w-5 h-5 text-vow-accent" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-vow-dark uppercase tracking-wider">
                Edit Font Tags: {font.familyName}
              </h3>
              <p className="text-[11px] text-vow-muted">
                Customize wedding tags &amp; classification for live discovery &amp; recommendation filtering.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-vow-muted hover:text-vow-dark rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 flex-1 overflow-y-auto">
          {/* Subclassification Edit */}
          <div>
            <label className="block text-xs font-bold text-vow-dark uppercase tracking-wider mb-1.5">
              Font Style Subclassification
            </label>
            <input
              type="text"
              value={subclass}
              onChange={(e) => setSubclass(e.target.value)}
              className="w-full bg-slate-50 border border-vow-border rounded-lg px-3 py-2 text-xs font-medium focus:ring-1 focus:ring-vow-dark focus:outline-none"
              placeholder="e.g. high_contrast_serif, didone, classical_roman"
            />
          </div>

          {/* Current Active Tags */}
          <div>
            <label className="block text-xs font-bold text-vow-dark uppercase tracking-wider mb-2">
              Active Tags ({tags.length})
            </label>
            <div className="flex flex-wrap gap-1.5 p-3 bg-slate-50 border border-vow-border rounded-xl min-h-[60px]">
              {tags.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 bg-white border border-vow-border rounded-full text-xs font-bold text-vow-dark flex items-center gap-1.5 shadow-2xs group hover:border-rose-300 transition-all"
                >
                  <span>{t}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(t)}
                    className="text-slate-400 hover:text-rose-600 transition-colors"
                    title={`Remove tag ${t}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {tags.length === 0 && (
                <span className="text-xs text-slate-400 italic">No tags assigned yet. Add some below!</span>
              )}
            </div>
          </div>

          {/* Add New Custom Tag Input */}
          <div>
            <label className="block text-xs font-bold text-vow-dark uppercase tracking-wider mb-1.5">
              Add New Custom Tag
            </label>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddTag(newTagInput);
              }}
              className="flex items-center space-x-2"
            >
              <input
                type="text"
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                placeholder="Type tag name and press Enter..."
                className="flex-1 bg-slate-50 border border-vow-border rounded-lg px-3 py-2 text-xs font-medium focus:ring-1 focus:ring-vow-dark focus:outline-none"
              />
              <button
                type="submit"
                disabled={!newTagInput.trim()}
                className="px-4 py-2 bg-vow-dark text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-black disabled:opacity-50 transition-all flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5 text-vow-accent" />
                <span>Add Tag</span>
              </button>
            </form>
          </div>

          {/* Preset Suggestions */}
          <div>
            <label className="block text-xs font-bold text-vow-muted uppercase tracking-wider mb-2 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-vow-accent" />
              <span>Quick Tag Presets (Click to add)</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_TAG_SUGGESTIONS.map((preset) => {
                const isAdded = tags.includes(preset);
                return (
                  <button
                    key={preset}
                    type="button"
                    disabled={isAdded}
                    onClick={() => handleAddTag(preset)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                      isAdded
                        ? "bg-slate-200 text-slate-500 cursor-default opacity-60"
                        : "bg-amber-50 text-amber-950 border border-amber-200 hover:border-vow-dark hover:bg-amber-100 cursor-pointer active:scale-95"
                    }`}
                  >
                    {isAdded ? `✓ ${preset}` : `+ ${preset}`}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-vow-border bg-vow-paper flex items-center justify-between">
          <button
            type="button"
            onClick={() => setTags(font.weddingTags || [])}
            className="px-3 py-1.5 text-xs text-slate-500 hover:text-vow-dark transition-colors flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Tags</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
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
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Tag className="w-3.5 h-3.5 text-vow-champagne" />
                  <span>Save Tag Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
