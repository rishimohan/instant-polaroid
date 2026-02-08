"use client";

import { useState, useCallback } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Header from "@/components/header";
import PhotoUpload from "@/components/photo-upload";
import CameraCapture from "@/components/camera-capture";
import PolaroidGrid from "@/components/polaroid-grid";
import DecorativePolaroids from "@/components/decorative-polaroids";

export default function Home() {
  const [photos, setPhotos] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [error, setError] = useState(null);
  const [caption, setCaption] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("#f5f5f4");
  const [captionColor, setCaptionColor] = useState("#1a1a1a");
  const [previewImage, setPreviewImage] = useState(null);

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const generatePolaroid = useCallback(
    async (imageData) => {
      setIsProcessing(true);
      setError(null);

      try {
        const response = await fetch("/api/polaroid", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageUrl: imageData,
            caption,
            backgroundColor,
            captionColor,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to generate polaroid");
        }

        setPhotos((prev) => [{ id: Date.now(), image: data.image }, ...prev]);
      } catch (err) {
        setError(err.message);
        console.error("Generation error:", err);
      } finally {
        setIsProcessing(false);
      }
    },
    [caption, backgroundColor, captionColor],
  );

  const handleFileSelect = useCallback(async (file) => {
    try {
      const base64 = await fileToBase64(file);
      setPreviewImage(base64);
    } catch (err) {
      setError("Failed to read file");
      console.error(err);
    }
  }, []);

  const handleCameraCapture = useCallback((dataUrl) => {
    setPreviewImage(dataUrl);
  }, []);

  const handleGenerate = useCallback(() => {
    if (previewImage) {
      generatePolaroid(previewImage);
    }
  }, [previewImage, generatePolaroid]);

  const handleRemovePhoto = useCallback((index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const showTwoColumns = photos.length > 0 || isProcessing;

  return (
    <main className="relative min-h-screen px-4 py-8 sm:py-10 md:py-10">
      <DecorativePolaroids />
      <div className="relative z-10 mx-auto max-w-6xl">
        <Header />

        <LayoutGroup>
          <div
            className={cn(
              "grid gap-16 items-start",
              showTwoColumns
                ? "grid-cols-1 lg:grid-cols-[460px_1fr]"
                : "grid-cols-1",
            )}
          >
            {/* Left column — form */}
            <motion.div
              layout
              transition={{
                layout: { duration: 0.6, ease: [0.32, 0.72, 0, 1] },
              }}
              className={cn(
                !showTwoColumns && "max-w-lg mx-auto w-full",
                showTwoColumns && "lg:sticky lg:top-8",
              )}
            >
              <PhotoUpload
                onFileSelect={handleFileSelect}
                onCameraOpen={() => setIsCameraOpen(true)}
                isProcessing={isProcessing}
                caption={caption}
                onCaptionChange={setCaption}
                captionColor={captionColor}
                onCaptionColorChange={setCaptionColor}
                backgroundColor={backgroundColor}
                onBackgroundColorChange={setBackgroundColor}
                previewImage={previewImage}
                onClearPreview={() => setPreviewImage(null)}
                onGenerate={handleGenerate}
              />

              {/* Error message */}
              <AnimatePresence>
                {error && (
                  <div className="mt-4">
                    <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
                      {error}
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Right column — polaroids */}
            <AnimatePresence mode="popLayout">
              {showTwoColumns && (
                <motion.div
                  key="polaroid-column"
                  layout
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 40 }}
                  transition={{
                    duration: 0.5,
                    ease: [0.32, 0.72, 0, 1],
                    layout: { duration: 0.6, ease: [0.32, 0.72, 0, 1] },
                  }}
                  className="min-h-[200px]"
                >
                  <PolaroidGrid
                    photos={photos}
                    onRemove={handleRemovePhoto}
                    isProcessing={isProcessing}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </LayoutGroup>
      </div>

      {/* Camera dialog */}
      <CameraCapture
        open={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCameraCapture}
      />
    </main>
  );
}
