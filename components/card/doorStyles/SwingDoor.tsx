"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Door } from "../Door";

interface SwingDoorProps {
  eventTitle: string;
  doorsOpen: boolean;
  showDoors: boolean;
  onOpen: () => void;
  onReplay: () => void;
  onAnimationComplete: () => void;
  color?: string;
  showReplayButton?: boolean;
}

export function SwingDoor({
  eventTitle,
  doorsOpen,
  showDoors,
  onOpen,
  onReplay,
  onAnimationComplete,
  color = "#f43f5e",
  showReplayButton = true,
}: SwingDoorProps) {
  return (
    <>
      {/* DOORS OVERLAY */}
      <AnimatePresence>
        {showDoors && (
          <>
            <motion.div
              key={`left-door-${color}`}
              className="absolute left-0 top-0 h-full w-1/2 z-10"
              style={{
                transformOrigin: "right center",
                backfaceVisibility: "hidden",
                willChange: "transform, opacity",
              }}
              initial={{ rotateY: 0, x: "0%", opacity: 1 }}
              animate={
                doorsOpen
                  ? { rotateY: [0, -60, -60], x: ["0%", "0%", "-52%"], opacity: [1, 1, 0] }
                  : { rotateY: 0, x: "0%", opacity: 1 }
              }
              exit={{ opacity: 0 }}
              transition={{ duration: 1.8, times: [0, 0.6, 1], ease: [0.65, 0, 0.35, 1] }}
            >
              <Door side="left" color={color} />
            </motion.div>
            <motion.div
              key={`right-door-${color}`}
              className="absolute right-0 top-0 h-full w-1/2 z-10"
              style={{
                transformOrigin: "left center",
                backfaceVisibility: "hidden",
                willChange: "transform, opacity",
              }}
              initial={{ rotateY: 0, x: "0%", opacity: 1 }}
              animate={
                doorsOpen
                  ? { rotateY: [0, 60, 60], x: ["0%", "0%", "52%"], opacity: [1, 1, 0] }
                  : { rotateY: 0, x: "0%", opacity: 1 }
              }
              exit={{ opacity: 0 }}
              transition={{ duration: 1.8, times: [0, 0.6, 1], ease: [0.65, 0, 0.35, 1] }}
              onAnimationComplete={onAnimationComplete}
            >
              <Door side="right" color={color} />
            </motion.div>
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

