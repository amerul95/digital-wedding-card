"use client";

import { motion, AnimatePresence } from "framer-motion";

interface EnvelopeDoorsProps {
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

export function EnvelopeDoors({
  eventTitle,
  doorsOpen,
  showDoors,
  onOpen,
  onReplay,
  onAnimationComplete,
  color = "#f43f5e",
  showReplayButton = true,
}: EnvelopeDoorsProps) {
  const rgb = hexToRgb(color);
  const lightColor = rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.05)` : "rgba(244, 63, 94, 0.05)";
  const gradientTop = `linear-gradient(to bottom, ${lightColor}, #ffffff)`;
  const gradientBottom = `linear-gradient(to top, ${lightColor}, #ffffff)`;
  
  return (
    <>
      {/* ENVELOPE DOORS */}
      <AnimatePresence>
        {showDoors && (
          <>
            {/* TOP FLAP */}
            <motion.div
              key={`top-flap-${color}`}
              className="absolute left-0 top-0 w-full h-1/2 z-10"
              style={{
                transformOrigin: "top center",
                background: gradientTop,
                backfaceVisibility: "hidden",
                willChange: "transform, opacity",
              }}
              initial={{ rotateX: 0, y: 0, opacity: 1 }}
              animate={
                doorsOpen
                  ? { rotateX: -90, y: "-10%", opacity: [1, 1, 0.001] }
                  : { rotateX: 0, y: 0, opacity: 1 }
              }
              transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
            />
            {/* BOTTOM FLAP */}
            <motion.div
              key={`bottom-flap-${color}`}
              className="absolute left-0 bottom-0 w-full h-1/2 z-10"
              style={{
                transformOrigin: "bottom center",
                background: gradientBottom,
                backfaceVisibility: "hidden",
                willChange: "transform, opacity",
              }}
              initial={{ rotateX: 0, y: 0, opacity: 1 }}
              animate={
                doorsOpen
                  ? { rotateX: 90, y: "10%", opacity: [1, 1, 0.001] }
                  : { rotateX: 0, y: 0, opacity: 1 }
              }
              transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1], delay: doorsOpen ? 0.15 : 0 }}
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
