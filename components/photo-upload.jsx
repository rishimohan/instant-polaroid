"use client";

import { Camera, Upload, Palette, Type, X, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCallback, useRef } from "react";
import { CameraPlusIcon } from "@phosphor-icons/react";

const BG_PRESETS = [
  { color: "#f5f5f4", label: "Stone" },
  { color: "#ffffff", label: "White" },
  { color: "#fef2f2", label: "Rose" },
  { color: "#eff6ff", label: "Blue" },
  { color: "#1a1a1a", label: "Dark" },
];

const TEXT_COLOR_PRESETS = [
  { color: "#1a1a1a", label: "Dark" },
  { color: "#ffffff", label: "White" },
];

export default function PhotoUpload({
  onFileSelect,
  onCameraOpen,
  isProcessing,
  caption,
  onCaptionChange,
  captionColor,
  onCaptionColorChange,
  backgroundColor,
  onBackgroundColorChange,
  previewImage,
  onClearPreview,
  onGenerate,
}) {
  const fileInputRef = useRef(null);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      if (isProcessing) return;
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        onFileSelect(file);
      }
    },
    [onFileSelect, isProcessing],
  );

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileSelect(file);
      e.target.value = "";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full"
    >
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() =>
          !isProcessing && !previewImage && fileInputRef.current?.click()
        }
        className={cn(
          "relative flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed p-8 sm:p-8 transition-all duration-300",
          isProcessing
            ? "border-neutral-200 bg-neutral-50 cursor-not-allowed opacity-60"
            : previewImage
              ? "border-neutral-300 bg-white"
              : "border-neutral-300 bg-white hover:border-neutral-400 hover:bg-neutral-50 cursor-pointer",
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          disabled={isProcessing}
          className="sr-only"
        />

        {previewImage ? (
          <div className="relative w-full flex flex-col items-center gap-4">
            <div className="relative group">
              <img
                src={previewImage}
                alt="Preview"
                className="max-h-32 rounded-xl object-contain"
              />
              {!isProcessing && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClearPreview();
                  }}
                  className="absolute -top-2 -right-2 rounded-full bg-neutral-900 p-1 text-white shadow-md hover:bg-neutral-700 transition-colors cursor-pointer"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <div onClick={(e) => e.stopPropagation()}>
              <Button
                variant="outline"
                size="sm"
                disabled={isProcessing}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={14} />
                Change Photo
              </Button>
            </div>
          </div>
        ) : (
          <>
            <motion.div
              animate={isProcessing ? {} : { y: [0, -4, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="rounded-xl bg-neutral-100 p-2 ring ring-neutral-300"
            >
              <CameraPlusIcon
                weight="light"
                className="size-6 text-neutral-400"
              />
            </motion.div>

            <div className="text-center">
              <p className="text-sm font-medium text-neutral-700">
                Drop your photo here
              </p>
              <p className="mt-px text-xs text-neutral-400">
                PNG, JPG, WEBP up to 10MB
              </p>
            </div>

            <div
              className="flex flex-col sm:flex-row items-center gap-3"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                variant="default"
                size="sm"
                disabled={isProcessing}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={16} />
                Add Photo
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={onCameraOpen}
                disabled={isProcessing}
              >
                <Camera size={16} />
                Take Photo
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Caption & Background Color Options */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.35 }}
        className="mt-4 space-y-4 rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5"
      >
        {/* Caption input */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-medium text-neutral-500">
            <Type size={13} />
            Caption
          </label>
          <input
            type="text"
            value={caption}
            onChange={(e) => onCaptionChange(e.target.value)}
            placeholder="Add a caption to your polaroid..."
            disabled={isProcessing}
            maxLength={60}
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-300 focus:border-neutral-400 focus:bg-white focus:outline-none transition-colors disabled:opacity-50"
          />
        </div>

        {/* Text color & Background color — side by side */}
        <div className="flex flex-col md:flex-row md:items-center gap-5 md:gap-8">
          {/* Text color */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-medium text-neutral-500">
              <Type size={13} />
              Caption Color
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {TEXT_COLOR_PRESETS.map((preset) => (
                <button
                  key={preset.color}
                  onClick={() => onCaptionColorChange(preset.color)}
                  disabled={isProcessing}
                  title={preset.label}
                  className={cn(
                    "size-7 rounded-lg border transition-all duration-200 cursor-pointer hover:scale-110 disabled:opacity-50",
                    captionColor === preset.color
                      ? "border-neutral-900 scale-110 ring ring-neutral-900/20"
                      : "border-neutral-200 hover:border-neutral-400",
                  )}
                  style={{ backgroundColor: preset.color }}
                />
              ))}
              <label
                title="Custom text color"
                className={cn(
                  "relative h-7 w-7 rounded-full border-2 border-dashed border-neutral-300 cursor-pointer overflow-hidden hover:border-neutral-400 transition-colors flex items-center justify-center",
                  isProcessing && "opacity-50 pointer-events-none",
                )}
              >
                <span className="text-[9px] text-neutral-400 font-bold">#</span>
                <input
                  type="color"
                  value={captionColor}
                  onChange={(e) => onCaptionColorChange(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Background color */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-medium text-neutral-500">
              <Palette size={13} />
              Card Color
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {BG_PRESETS.map((preset) => (
                <button
                  key={preset.color}
                  onClick={() => onBackgroundColorChange(preset.color)}
                  disabled={isProcessing}
                  title={preset.label}
                  className={cn(
                    "size-7 rounded-lg border transition-all duration-200 cursor-pointer hover:scale-110 disabled:opacity-50",
                    backgroundColor === preset.color
                      ? "border-neutral-900 scale-110 ring ring-neutral-900/20"
                      : "border-neutral-200 hover:border-neutral-400",
                  )}
                  style={{ backgroundColor: preset.color }}
                />
              ))}
              <label
                title="Custom color"
                className={cn(
                  "relative h-7 w-7 rounded-full border border-dashed border-neutral-300 cursor-pointer overflow-hidden hover:border-neutral-400 transition-colors flex items-center justify-center",
                  isProcessing && "opacity-50 pointer-events-none",
                )}
              >
                <span className="text-[9px] text-neutral-400 font-bold">#</span>
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => onBackgroundColorChange(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </label>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Generate button */}
      <div className="mt-4">
        <Button
          size="lg"
          disabled={isProcessing || !previewImage}
          onClick={onGenerate}
          className="w-full rounded-xl h-12 text-sm font-medium cursor-pointer"
        >
          <Sparkles size={16} />
          Generate Polaroid
        </Button>
      </div>
    </motion.div>
  );
}
