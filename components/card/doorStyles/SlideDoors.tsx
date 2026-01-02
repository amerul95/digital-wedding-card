"use client";

import { motion, AnimatePresence } from "framer-motion";

interface SlideDoorsProps {
  eventTitle: string;
  doorsOpen: boolean;
  showDoors: boolean;
  onOpen: () => void;
  onReplay: () => void;
  onAnimationComplete: () => void;
  color?: string;
  showReplayButton?: boolean;
}

// Helper function to convert hex to rgb
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

export function SlideDoors({
  eventTitle,
  doorsOpen,
  showDoors,
  onOpen,
  onReplay,
  onAnimationComplete,
  color = "#f43f5e",
  showReplayButton = true,
}: SlideDoorsProps) {
  const rgb = hexToRgb(color);
  const lightColor = rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.05)` : "rgba(244, 63, 94, 0.05)";
  const gradient = `linear-gradient(to right, ${lightColor}, #ffffff)`;
  const gradientReverse = `linear-gradient(to left, ${lightColor}, #ffffff)`;
  
  return (
    <>
      {/* SLIDE DOORS */}
      <AnimatePresence>
        {showDoors && (
          <>
            <motion.div
              key={`left-slide-${color}`}
              className="absolute left-0 top-0 h-full w-1/2 z-10"
              style={{ background: gradient }}
              initial={{ x: 0, opacity: 1 }}
              animate={doorsOpen ? { x: "-100%", opacity: [1, 1, 0.001] } : { x: 0, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, ease: [0.55, 0, 0.45, 1] }}
            />
            <motion.div
              key={`right-slide-${color}`}
              className="absolute right-0 top-0 h-full w-1/2 z-10"
              style={{ background: gradientReverse }}
              initial={{ x: 0, opacity: 1 }}
              animate={doorsOpen ? { x: "100%", opacity: [1, 1, 0.001] } : { x: 0, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, ease: [0.55, 0, 0.45, 1] }}
              onAnimationComplete={onAnimationComplete}
            />
          </>
        )}
      </AnimatePresence>

      {/* OPEN BUTTON (before doors open) */}
      {showDoors && !doorsOpen && (
        <div className="absolute inset-0 z-20 flex items-center justify-center p-4">
          <button
            onClick={onOpen}
            className="px-6 py-3 rounded-full bg-white/90 backdrop-blur border border-rose-200 shadow-lg text-rose-700 text-base font-medium hover:bg-white transition-colors"
            aria-label="Buka kad jemputan"
          >
            {eventTitle} — Buka
          </button>
        </div>
      )}

      {/* REPLAY BUTTON (after doors open) */}
      {!showDoors && showReplayButton && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-0">
          <button
            onClick={onReplay}
            className="px-4 py-1.5 rounded-full bg-white/80 backdrop-blur border border-rose-200 text-rose-700 text-xs shadow hover:bg-white"
          >
            Replay Opening
          </button>
        </div>
      )}
    </>
  );
}
