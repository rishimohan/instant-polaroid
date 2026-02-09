"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PolaroidCard({ image, index, onRemove, onView }) {
  const [isHovered, setIsHovered] = useState(false);

  // Slight random rotation for organic feel
  const rotation = ((index * 7 + 3) % 11) - 5; // between -5 and 5 degrees

  const handleDownload = async () => {
    try {
      const response = await fetch(image);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `instant-polaroid-${index + 1}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
      // Fallback
      const link = document.createElement("a");
      link.href = image;
      link.download = `instant-polaroid-${index + 1}.png`;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.5, rotate: rotation + 10, y: 60 }}
      animate={{ opacity: 1, scale: 1, rotate: rotation, y: 0 }}
      exit={{ opacity: 0, scale: 0.5, rotate: rotation - 15, y: -40 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
        delay: 0.1,
      }}
      whileHover={{
        scale: 1.05,
        rotate: 0,
        zIndex: 10,
        transition: { duration: 0.2 },
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => onView()}
      className="relative cursor-pointer group"
    >
      {/* Polaroid frame */}
      <div className="bg-white rounded-sm shadow-lg hover:shadow-2xl transition-shadow duration-300 p-2 sm:p-3 pb-10 sm:pb-14">
        {/* Photo */}
        <div className="relative overflow-hidden rounded-[2px] bg-neutral-100">
          <img
            src={image}
            alt={`Polaroid ${index + 1}`}
            className="w-full h-auto"
            draggable={false}
          />

          {/* Hover overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 bg-black/30 flex items-center justify-center gap-2"
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                handleDownload();
              }}
              className="h-9 w-9 bg-white/90 hover:bg-white text-neutral-700 rounded-full shadow-md"
            >
              <Download size={16} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(index);
              }}
              className="h-9 w-9 bg-white/90 hover:bg-red-50 text-neutral-700 hover:text-red-600 rounded-full shadow-md"
            >
              <Trash2 size={16} />
            </Button>
          </motion.div>
        </div>

        {/* Bottom area — classic polaroid look */}
        <div className="absolute bottom-2 sm:bottom-3 left-3 right-3 flex items-center justify-center">
          <p className="text-[10px] sm:text-xs text-neutral-300 font-mono">
            #{String(index + 1).padStart(3, "0")}
          </p>
        </div>
      </div>

      {/* Tape effect on some cards */}
      {index % 3 === 0 && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-4 bg-amber-100/70 rounded-sm rotate-[-2deg] opacity-60" />
      )}
    </motion.div>
  );
}
