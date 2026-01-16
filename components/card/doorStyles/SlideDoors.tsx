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
  doorButtonText?: string;  // HTML content for door button text
  doorButtonTextFontFamily?: string;  // Font family for door button text
  doorButtonTextMarginTop?: number;  // Margin top for door button text container
  doorButtonTextMarginRight?: number;  // Margin right for door button text container
  doorButtonTextMarginBottom?: number;  // Margin bottom for door button text container
  doorButtonTextMarginLeft?: number;  // Margin left for door button text container
  doorButtonType?: "circle" | "square" | "rectangle";
  doorButtonPaddingX?: number;
  doorButtonPaddingY?: number;
  doorButtonMarginTop?: number;
  doorButtonMarginRight?: number;
  doorButtonMarginBottom?: number;
  doorButtonMarginLeft?: number;
  doorButtonBorderRadius?: number;
  doorButtonWidth?: number;
  doorButtonBorderSize?: number;
  doorButtonBorderColor?: string;
  doorButtonBackgroundColor?: string;
  doorButtonBoxShadow?: string;
  doorButtonOpenTextColor?: string;
  doorButtonOpenTextFontFamily?: string;
  doorButtonAnimation?: "none" | "pulse" | "bounce" | "shake" | "glow" | "float";
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
  doorButtonText,
  doorButtonTextFontFamily,
  doorButtonTextMarginTop,
  doorButtonTextMarginRight,
  doorButtonTextMarginBottom,
  doorButtonTextMarginLeft,
  doorButtonType,
  doorButtonPaddingX = 24,
  doorButtonPaddingY = 12,
  doorButtonMarginTop = 0,
  doorButtonMarginRight = 0,
  doorButtonMarginBottom = 0,
  doorButtonMarginLeft = 0,
  doorButtonBorderRadius = 9999,
  doorButtonWidth,
  doorButtonBorderSize = 1,
  doorButtonBorderColor,
  doorButtonBackgroundColor,
  doorButtonBoxShadow,
  doorButtonOpenTextColor = "#36463A",
  doorButtonOpenTextFontFamily,
  doorButtonAnimation = "none",
}: SlideDoorsProps) {
  const rgb = hexToRgb(color);
  const lightColor = rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.05)` : "rgba(244, 63, 94, 0.05)";
  const gradient = `linear-gradient(to right, ${lightColor}, #ffffff)`;
  const gradientReverse = `linear-gradient(to left, ${lightColor}, #ffffff)`;
  
  // Calculate button dimensions based on type
  let buttonWidth: number | undefined = doorButtonWidth;
  let buttonHeight: number | undefined = undefined;
  
  if (doorButtonType === "circle") {
    buttonWidth = 126;
    buttonHeight = 126;
  } else if (doorButtonType === "square") {
    buttonWidth = 126;
    buttonHeight = 126;
  } else if (doorButtonType === "rectangle") {
    buttonWidth = 140;
    buttonHeight = 126;
  }
  
  // Build button container styles
  const buttonContainerStyle: React.CSSProperties = {
    marginTop: doorButtonMarginTop !== undefined ? `${doorButtonMarginTop}px` : undefined,
    marginRight: doorButtonMarginRight !== undefined ? `${doorButtonMarginRight}px` : undefined,
    marginBottom: doorButtonMarginBottom !== undefined ? `${doorButtonMarginBottom}px` : undefined,
    marginLeft: doorButtonMarginLeft !== undefined ? `${doorButtonMarginLeft}px` : undefined,
  };

  // Build button styles
  const buttonStyle: React.CSSProperties = {
    paddingLeft: doorButtonPaddingX !== undefined ? `${doorButtonPaddingX}px` : undefined,
    paddingRight: doorButtonPaddingX !== undefined ? `${doorButtonPaddingX}px` : undefined,
    paddingTop: doorButtonPaddingY !== undefined ? `${doorButtonPaddingY}px` : undefined,
    paddingBottom: doorButtonPaddingY !== undefined ? `${doorButtonPaddingY}px` : undefined,
    borderRadius: doorButtonBorderRadius !== undefined ? `${doorButtonBorderRadius}px` : undefined,
    width: buttonWidth !== undefined ? `${buttonWidth}px` : undefined,
    height: buttonHeight !== undefined ? `${buttonHeight}px` : undefined,
    borderWidth: doorButtonBorderSize !== undefined ? `${doorButtonBorderSize}px` : undefined,
    borderColor: doorButtonBorderColor || undefined,
    backgroundColor: doorButtonBackgroundColor || undefined,
    boxShadow: doorButtonBoxShadow || undefined,
  };

  // Determine button content - use HTML if provided, otherwise fallback to eventTitle
  const hasCustomText = doorButtonText && doorButtonText.trim().length > 0;
  
  return (
    <>
      {/* SLIDE DOORS */}
      <AnimatePresence>
        {showDoors && (
          <>
            <motion.div
              key={`left-slide-${color}`}
              className="absolute left-0 top-0 h-full w-1/2 z-10 pointer-events-none"
              style={{ background: gradient }}
              initial={{ x: 0, opacity: 1 }}
              animate={doorsOpen ? { x: "-100%", opacity: [1, 1, 0.001] } : { x: 0, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, ease: [0.55, 0, 0.45, 1] }}
            />
            <motion.div
              key={`right-slide-${color}`}
              className="absolute right-0 top-0 h-full w-1/2 z-10 pointer-events-none"
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
        <div className="absolute inset-0 z-20 flex items-center justify-center p-4 pointer-events-none" style={buttonContainerStyle}>
          <button
            onClick={onOpen}
            className={`bg-white/90 backdrop-blur border border-rose-200 shadow-lg text-rose-700 text-base font-medium hover:bg-white transition-colors flex flex-col items-center pointer-events-auto ${
              doorButtonAnimation !== "none" ? `door-button-${doorButtonAnimation}` : ""
            }`}
            aria-label="Buka kad jemputan"
            style={buttonStyle}
          >
            <div 
              className="flex-1 flex items-center justify-center"
              style={{
                marginTop: doorButtonTextMarginTop ? `${doorButtonTextMarginTop}px` : undefined,
                marginRight: doorButtonTextMarginRight ? `${doorButtonTextMarginRight}px` : undefined,
                marginBottom: doorButtonTextMarginBottom ? `${doorButtonTextMarginBottom}px` : undefined,
                marginLeft: doorButtonTextMarginLeft ? `${doorButtonTextMarginLeft}px` : undefined,
              }}
            >
              {hasCustomText ? (
                <span 
                  dangerouslySetInnerHTML={{ __html: doorButtonText }}
                  style={{ fontFamily: doorButtonTextFontFamily || undefined }}
                />
              ) : (
                <span style={{ fontFamily: doorButtonTextFontFamily || undefined }}>
                  {eventTitle} — Buka
                </span>
              )}
            </div>
            {/* OPEN Text at bottom inside button */}
            <span
              style={{
                fontSize: "11px",
                color: doorButtonOpenTextColor || "#36463A",
                marginBottom: "4px",
                fontWeight: 500,
                fontFamily: doorButtonOpenTextFontFamily || undefined,
              }}
            >
              OPEN
            </span>
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
