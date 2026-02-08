"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import PolaroidCard from "@/components/polaroid-card";

export default function PolaroidGrid({ photos, onRemove, isProcessing }) {
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const isOpen =
    lightboxIndex !== null &&
    lightboxIndex >= 0 &&
    lightboxIndex < photos.length;
  const lightboxImage = isOpen ? photos[lightboxIndex].image : null;

  const goNext = useCallback(() => {
    setLightboxIndex((i) => (i !== null && i < photos.length - 1 ? i + 1 : i));
  }, [photos.length]);

  const goPrev = useCallback(() => {
    setLightboxIndex((i) => (i !== null && i > 0 ? i - 1 : i));
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, goNext, goPrev, closeLightbox]);

  const handleDownload = () => {
    if (!lightboxImage) return;
    const link = document.createElement("a");
    link.href = lightboxImage;
    link.download = `polaroid-${lightboxIndex + 1}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const [isZipping, setIsZipping] = useState(false);

  const handleDownloadAll = useCallback(async () => {
    if (photos.length === 0) return;
    setIsZipping(true);
    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();
      await Promise.all(
        photos.map(async (photo, i) => {
          const res = await fetch(photo.image);
          const blob = await res.blob();
          zip.file(`polaroid-${i + 1}.png`, blob);
        }),
      );
      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const link = document.createElement("a");
      link.href = url;
      link.download = "polaroids.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Zip download failed:", err);
    } finally {
      setIsZipping(false);
    }
  }, [photos]);

  const totalItems = photos.length + (isProcessing ? 1 : 0);

  if (totalItems === 0) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        {photos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-6"
          >
            <h2 className="text-lg font-semibold text-neutral-800">
              Your Polaroids
              <span className="ml-2 text-sm font-normal text-neutral-400">
                ({photos.length})
              </span>
            </h2>
            {photos.length > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadAll}
                disabled={isZipping}
              >
                <Download size={14} />
                {isZipping ? "Zipping..." : "Download All"}
              </Button>
            )}
          </motion.div>
        )}

        <div
          className={cn(
            "grid gap-4 sm:gap-6 md:max-w-full max-w-[80%] mx-auto",
            totalItems === 1 ? "md:grid-cols-2" : "md:grid-cols-2",
          )}
        >
          <AnimatePresence mode="popLayout">
            {isProcessing && (
              <motion.div
                key="printing-placeholder"
                layout
                initial={{ opacity: 0, scale: 0.8, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <div className="bg-white rounded-sm shadow-lg p-2 sm:p-3 pb-10 sm:pb-14">
                  <div className="relative aspect-square bg-neutral-100 rounded-[2px] overflow-hidden">
                    <motion.div
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/60 to-transparent skew-x-[-20deg]"
                    />
                    <motion.div
                      animate={{ opacity: [0, 0.3, 0.1, 0.4, 0.2] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 bg-gradient-to-br from-amber-100/50 via-rose-100/30 to-sky-100/40"
                    />
                  </div>
                </div>
                <div className="mt-3 text-center">
                  <motion.p
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-xs text-neutral-400 font-medium"
                  >
                    Printing your polaroid...
                  </motion.p>
                </div>
              </motion.div>
            )}
            {photos.map((photo, index) => (
              <PolaroidCard
                key={photo.id}
                image={photo.image}
                index={index}
                onRemove={onRemove}
                onView={() => setLightboxIndex(index)}
              />
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Lightbox — portaled to body to avoid layout transform issues */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 sm:p-8"
                onClick={closeLightbox}
              >
                {/* Prev button */}
                {lightboxIndex > 0 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      goPrev();
                    }}
                    className="absolute left-3 sm:left-6 z-10 h-10 w-10 bg-black/50 hover:bg-black/70 text-white rounded-full"
                  >
                    <ChevronLeft size={20} />
                  </Button>
                )}

                {/* Next button */}
                {lightboxIndex < photos.length - 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      goNext();
                    }}
                    className="absolute right-3 sm:right-6 z-10 h-10 w-10 bg-black/50 hover:bg-black/70 text-white rounded-full"
                  >
                    <ChevronRight size={20} />
                  </Button>
                )}

                {/* Top-right controls */}
                <div
                  className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 flex items-center gap-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="text-xs text-white/60 font-mono mr-1">
                    {lightboxIndex + 1} / {photos.length}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleDownload}
                    className="h-11 w-11 bg-black/50 hover:bg-black/70 text-white rounded-full"
                  >
                    <Download size={20} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={closeLightbox}
                    className="h-11 w-11 bg-black/50 hover:bg-black/70 text-white rounded-full"
                  >
                    <X size={20} />
                  </Button>
                </div>

                <motion.div
                  key={lightboxIndex}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="relative max-w-3xl w-full max-h-[85vh] flex items-center justify-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <img
                    src={lightboxImage}
                    alt="Polaroid full view"
                    className="max-w-full max-h-[85vh] w-auto h-auto rounded-lg shadow-2xl"
                    draggable={false}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
