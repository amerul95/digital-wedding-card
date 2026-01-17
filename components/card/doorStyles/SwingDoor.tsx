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
  opacity?: number; // 0-100, default 100
  blur?: number; // 0-100 in pixels, default 0
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

// Helper function to apply opacity to hex color
function applyOpacityToHex(hex: string, opacity: number): string {
  const opacityValue = opacity / 100;
  const cleanHex = hex.replace('#', '');
  let r: number, g: number, b: number;
  if (cleanHex.length === 3) {
    r = parseInt(cleanHex[0] + cleanHex[0], 16);
    g = parseInt(cleanHex[1] + cleanHex[1], 16);
    b = parseInt(cleanHex[2] + cleanHex[2], 16);
  } else {
    r = parseInt(cleanHex.substring(0, 2), 16);
    g = parseInt(cleanHex.substring(2, 4), 16);
    b = parseInt(cleanHex.substring(4, 6), 16);
  }
  return `rgba(${r}, ${g}, ${b}, ${opacityValue})`;
}

// Helper function to check if color is white or very light
function isWhiteColor(color: string): boolean {
  const normalizedColor = color.toLowerCase().trim();
  if (normalizedColor === '#ffffff' || normalizedColor === '#fff' || normalizedColor === 'white') {
    return true;
  }
  if (normalizedColor.startsWith('#')) {
    const hex = normalizedColor.replace('#', '');
    if (hex.length === 3) {
      const r = parseInt(hex[0] + hex[0], 16);
      const g = parseInt(hex[1] + hex[1], 16);
      const b = parseInt(hex[2] + hex[2], 16);
      return r > 240 && g > 240 && b > 240;
    } else if (hex.length === 6) {
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return r > 240 && g > 240 && b > 240;
    }
  }
  return false;
}

export function SwingDoor({
  eventTitle,
  doorsOpen,
  showDoors,
  onOpen,
  onReplay,
  onAnimationComplete,
  color = "#f43f5e",
  opacity = 100,
  blur = 0,
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
}: SwingDoorProps) {
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
  
  // Apply backdrop blur filter if blur > 0 - this blurs content behind, not the door itself
  const backdropBlurFilter = blur > 0 ? `blur(${blur}px)` : 'none';
  
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
                transformOrigin: "left center",
                backfaceVisibility: "hidden",
                willChange: "transform, opacity",
                backdropFilter: backdropBlurFilter, // Blurs content behind the door
                WebkitBackdropFilter: backdropBlurFilter, // Safari support
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
              <Door side="left" color={color} opacity={opacity} blur={blur} />
            </motion.div>
            <motion.div
              key={`right-door-${color}`}
              className="absolute right-0 top-0 h-full w-1/2 z-10 pointer-events-none"
              style={{
                transformOrigin: "right center",
                backfaceVisibility: "hidden",
                willChange: "transform, opacity",
                backdropFilter: backdropBlurFilter, // Blurs content behind the door
                WebkitBackdropFilter: backdropBlurFilter, // Safari support
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
              <Door side="right" color={color} opacity={opacity} blur={blur} />
            </motion.div>
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
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
          <button
            onClick={onReplay}
            className="px-4 py-1.5 rounded-full bg-white/80 backdrop-blur border border-rose-200 text-rose-700 text-xs shadow hover:bg-white pointer-events-auto"
          >
            Replay Opening
          </button>
        </div>
      )}
    </>
  );
}

