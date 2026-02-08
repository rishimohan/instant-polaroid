"use client";

import { motion } from "framer-motion";

const POLAROIDS = [
  // Left side (4)
  { top: "3%", left: "-2%", rotate: -12, delay: 0, color: "#fef2f2" },
  { top: "25%", left: "-3.5%", rotate: 8, delay: 0.1, color: "#eff6ff" },
  { top: "49%", left: "-1.5%", rotate: -7, delay: 0.2, color: "#f0fdf4" },
  { top: "72%", left: "-3%", rotate: 11, delay: 0.3, color: "#fefce8" },
  // Right side (5)
  { top: "2%", right: "-2.5%", rotate: 10, delay: 0.05, color: "#faf5ff" },
  { top: "20%", right: "-3%", rotate: -14, delay: 0.15, color: "#fef2f2" },
  { top: "40%", right: "-2%", rotate: 6, delay: 0.25, color: "#eff6ff" },
  { top: "60%", right: "-3.5%", rotate: -9, delay: 0.35, color: "#f0fdf4" },
  { top: "80%", right: "-2.5%", rotate: 8, delay: 0.45, color: "#fefce8" },
];

function PolaroidFrame({ style, rotate, delay, color }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, delay, ease: "easeOut" }}
      className="absolute pointer-events-none hidden md:block"
      style={style}
    >
      <div
        className="w-28 rounded-sm shadow-md p-2 pb-7"
        style={{
          backgroundColor: "#fff",
          transform: `rotate(${rotate}deg)`,
        }}
      >
        <div
          className="aspect-square rounded-[1px]"
          style={{ backgroundColor: color }}
        />
      </div>
    </motion.div>
  );
}

export default function DecorativePolaroids() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {POLAROIDS.map((p, i) => (
        <PolaroidFrame
          key={i}
          style={{
            top: p.top,
            ...(p.left != null && { left: p.left }),
            ...(p.right != null && { right: p.right }),
          }}
          rotate={p.rotate}
          delay={p.delay}
          color={p.color}
        />
      ))}
    </div>
  );
}
