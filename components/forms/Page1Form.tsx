"use client";

import { useEvent } from "@/context/EventContext";
import { Label } from "@/components/card/UI";
import { RichTextEditorWithMargins } from "@/components/forms/RichTextEditorWithMargins";
import { Input } from "@/components/card/UI";
import { useState, useEffect, useRef } from "react";

const DOOR_STYLES = [
  { value: "swing", label: "Swing Doors" },
  { value: "slide", label: "Slide Doors" },
  { value: "envelope", label: "Envelope Doors" },
] as const;

const EFFECTS = [
  { value: "none", label: "No Effect" },
  { value: "snow", label: "Snow" },
  { value: "petals", label: "Petals" },
  { value: "bubbles", label: "Bubbles" },
] as const;

export function Page1Form() {
  const { event, updateEvent } = useEvent();
  
  // Use local state for door button text with debounced updates
  const [localDoorButtonText, setLocalDoorButtonText] = useState(event.doorButtonText || "");
  const editorWrapperRef = useRef<HTMLDivElement>(null);
  const isInternalUpdateRef = useRef(false);
  const updateTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync local state with event when event changes externally (but not from our updates)
  useEffect(() => {
    if (!isInternalUpdateRef.current) {
      const externalValue = event.doorButtonText || "";
      if (externalValue !== localDoorButtonText) {
        setLocalDoorButtonText(externalValue);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event.doorButtonText]);

  // Handle change with debounced update to event context for real-time preview
  const handleDoorButtonTextChange = (html: string) => {
    setLocalDoorButtonText(html);
    
    // Clear existing timeout
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
    
    // Debounce the update to event context (150ms delay for responsive preview updates)
    updateTimeoutRef.current = setTimeout(() => {
      isInternalUpdateRef.current = true;
      updateEvent({ doorButtonText: html });
      // Reset the flag after a brief delay
      setTimeout(() => {
        isInternalUpdateRef.current = false;
      }, 100);
    }, 150);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="bg-white p-6">
      <div className="space-y-0">
        {/* 1. Package Choice - Grouped */}
        <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50 mb-0">
          <Label>1. Package Choice</Label>
          <select
            value={event.packageChoice}
            onChange={(e) => updateEvent({ packageChoice: e.target.value as "gold" | "silver" | "bronze" })}
            className="w-full px-4 py-2 rounded-xl border border-[#36463A] text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#36463A] bg-white"
          >
            <option value="gold">Gold</option>
            <option value="silver">Silver</option>
            <option value="bronze">Bronze</option>
          </select>
        </div>

        {/* 2. Opening Style - Grouped */}
        <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50 mb-0">
          <Label>2. Opening Style</Label>
          <div className="space-y-3">
            <select
              value={event.openingStyle || event.doorStyle}
              onChange={(e) => {
                const value = e.target.value as "swing" | "slide" | "envelope";
                updateEvent({ openingStyle: value, doorStyle: value });
              }}
              className="w-full px-4 py-2 rounded-xl border border-[#36463A] text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#36463A] bg-white"
            >
              {DOOR_STYLES.map((style) => (
                <option key={style.value} value={style.value}>
                  {style.label}
                </option>
              ))}
            </select>
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Door Color</label>
              <div className="flex gap-2 items-center">
                <div className="relative h-10 w-10">
                  <div
                    className="absolute inset-0 rounded-full border border-[#36463A] cursor-pointer"
                    style={{ backgroundColor: event.openingStyleColor || event.doorColor }}
                  />
                  <input
                    type="color"
                    value={event.openingStyleColor || event.doorColor}
                    onChange={(e) => {
                      updateEvent({ openingStyleColor: e.target.value, doorColor: e.target.value });
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    style={{ WebkitAppearance: "none", appearance: "none" }}
                  />
                </div>
                <input
                  type="text"
                  value={event.openingStyleColor || event.doorColor}
                  onChange={(e) => {
                    updateEvent({ openingStyleColor: e.target.value, doorColor: e.target.value });
                  }}
                  placeholder="#f43f5e"
                  className="flex-1 px-3 py-2 rounded-xl border border-[#36463A] text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#36463A] bg-white font-mono"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Door Opacity</label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={event.doorOpacity ?? 100}
                  onChange={(e) => updateEvent({ doorOpacity: Number(e.target.value) })}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#36463A]"
                />
                <div className="flex items-center gap-2 min-w-[80px]">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={event.doorOpacity ?? 100}
                    onChange={(e) => updateEvent({ doorOpacity: Number(e.target.value) })}
                    className="w-16 px-2 py-1 rounded-lg border border-[#36463A] text-sm text-gray-700 text-center focus:outline-none focus:ring-2 focus:ring-[#36463A]"
                  />
                  <span className="text-sm text-[#36463A] font-medium">%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Animation & Effects - Grouped */}
        <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50 mb-0">
          <Label>3. Animation & Effects</Label>
          <div className="space-y-3">
            <select
              value={event.animationEffect || event.effect}
              onChange={(e) => {
                const value = e.target.value as "none" | "snow" | "petals" | "bubbles";
                updateEvent({ animationEffect: value, effect: value });
              }}
              className="w-full px-4 py-2 rounded-xl border border-[#36463A] text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#36463A] bg-white"
            >
              {EFFECTS.map((effect) => (
                <option key={effect.value} value={effect.value}>
                  {effect.label}
                </option>
              ))}
            </select>
            {/* Effect Color (shown when effect is not none) */}
            {(event.animationEffect || event.effect) !== "none" && (
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Effect Color</label>
                <div className="flex gap-2 items-center">
                  <div className="relative h-10 w-10">
                    <div
                      className="absolute inset-0 rounded-full border border-[#36463A] cursor-pointer"
                      style={{ backgroundColor: event.animationEffectColor || event.effectColor }}
                    />
                    <input
                      type="color"
                      value={event.animationEffectColor || event.effectColor}
                      onChange={(e) => {
                        updateEvent({ animationEffectColor: e.target.value, effectColor: e.target.value });
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      style={{ WebkitAppearance: "none", appearance: "none" }}
                    />
                  </div>
                  <input
                    type="text"
                    value={event.animationEffectColor || event.effectColor}
                    onChange={(e) => {
                      updateEvent({ animationEffectColor: e.target.value, effectColor: e.target.value });
                    }}
                    placeholder="#f43f5e"
                    className="flex-1 px-3 py-2 rounded-xl border border-[#36463A] text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#36463A] bg-white font-mono"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 4. Door Button - Grouped */}
        <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50 mb-0">
          <Label>4. Door Button</Label>
          <div className="space-y-3">
            <div
              ref={editorWrapperRef}
              className="door-button-text-editor-wrapper"
            >
              <label className="text-xs text-gray-600 mb-1 block">Button Text</label>
              <RichTextEditorWithMargins
                content={localDoorButtonText}
                onChange={handleDoorButtonTextChange}
                placeholder="Enter button text..."
                marginTop={event.doorButtonTextMarginTop}
                marginRight={event.doorButtonTextMarginRight}
                marginBottom={event.doorButtonTextMarginBottom}
                marginLeft={event.doorButtonTextMarginLeft}
                onMarginTopChange={(value) => updateEvent({ doorButtonTextMarginTop: value })}
                onMarginRightChange={(value) => updateEvent({ doorButtonTextMarginRight: value })}
                onMarginBottomChange={(value) => updateEvent({ doorButtonTextMarginBottom: value })}
                onMarginLeftChange={(value) => updateEvent({ doorButtonTextMarginLeft: value })}
              />
            </div>

            {/* Button Type */}
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Button Type</label>
              <select
                value={event.doorButtonType || ""}
                onChange={(e) => updateEvent({ doorButtonType: e.target.value ? e.target.value as "circle" | "square" | "rectangle" : undefined })}
                className="w-full px-4 py-2 rounded-xl border border-[#36463A] text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#36463A] bg-white"
              >
                <option value="">Auto (Custom Size)</option>
                <option value="circle">Circle (126×126)</option>
                <option value="square">Square (126×126)</option>
                <option value="rectangle">Rectangle (140×126)</option>
              </select>
            </div>

            {/* Container Settings */}
            <div className="mt-4 pt-4 border-t border-gray-300">
              <label className="text-sm font-semibold text-gray-700 mb-3 block">Container Settings</label>
              
              {/* Padding */}
              <div className="mb-4">
                <label className="text-xs text-gray-600 mb-2 block">Padding (px)</label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">X (Horizontal)</label>
                    <Input
                      type="number"
                      value={event.doorButtonPaddingX ?? 24}
                      onChange={(e) => updateEvent({ doorButtonPaddingX: Number(e.target.value) || 0 })}
                      placeholder="24"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Y (Vertical)</label>
                    <Input
                      type="number"
                      value={event.doorButtonPaddingY ?? 12}
                      onChange={(e) => updateEvent({ doorButtonPaddingY: Number(e.target.value) || 0 })}
                      placeholder="12"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              {/* Margin */}
              <div className="mb-4">
                <label className="text-xs text-gray-600 mb-2 block">Margin (px)</label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Top</label>
                    <Input
                      type="number"
                      value={event.doorButtonMarginTop ?? 0}
                      onChange={(e) => updateEvent({ doorButtonMarginTop: Number(e.target.value) || 0 })}
                      placeholder="0"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Right</label>
                    <Input
                      type="number"
                      value={event.doorButtonMarginRight ?? 0}
                      onChange={(e) => updateEvent({ doorButtonMarginRight: Number(e.target.value) || 0 })}
                      placeholder="0"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Bottom</label>
                    <Input
                      type="number"
                      value={event.doorButtonMarginBottom ?? 0}
                      onChange={(e) => updateEvent({ doorButtonMarginBottom: Number(e.target.value) || 0 })}
                      placeholder="0"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Left</label>
                    <Input
                      type="number"
                      value={event.doorButtonMarginLeft ?? 0}
                      onChange={(e) => updateEvent({ doorButtonMarginLeft: Number(e.target.value) || 0 })}
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              {/* Border Radius and Size */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Border Radius (px)</label>
                  <Input
                    type="number"
                    value={event.doorButtonBorderRadius ?? 9999}
                    onChange={(e) => updateEvent({ doorButtonBorderRadius: Number(e.target.value) || 0 })}
                    placeholder="9999"
                    min="0"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Width (px)</label>
                  <Input
                    type="number"
                    value={event.doorButtonWidth ?? ""}
                    onChange={(e) => updateEvent({ doorButtonWidth: e.target.value ? Number(e.target.value) : undefined })}
                    placeholder="Auto"
                    min="0"
                  />
                </div>
              </div>

              {/* Border Size */}
              <div className="mb-4">
                <label className="text-xs text-gray-600 mb-1 block">Border Size (px)</label>
                <Input
                  type="number"
                  value={event.doorButtonBorderSize ?? 1}
                  onChange={(e) => updateEvent({ doorButtonBorderSize: Number(e.target.value) || 0 })}
                  placeholder="1"
                  min="0"
                />
              </div>

              {/* Border Color */}
              <div className="mb-4">
                <label className="text-xs text-gray-600 mb-1 block">Border Color</label>
                <div className="flex gap-2 items-center">
                  <div className="relative h-10 w-10">
                    <div
                      className="absolute inset-0 rounded-full border border-[#36463A] cursor-pointer"
                      style={{ backgroundColor: event.doorButtonBorderColor || "#fecdd3" }}
                    />
                    <input
                      type="color"
                      value={event.doorButtonBorderColor || "#fecdd3"}
                      onChange={(e) => updateEvent({ doorButtonBorderColor: e.target.value })}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      style={{ WebkitAppearance: "none", appearance: "none" }}
                    />
                  </div>
                  <input
                    type="text"
                    value={event.doorButtonBorderColor || ""}
                    onChange={(e) => updateEvent({ doorButtonBorderColor: e.target.value || undefined })}
                    placeholder="#fecdd3"
                    className="flex-1 px-3 py-2 rounded-xl border border-[#36463A] text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#36463A] bg-white font-mono"
                  />
                </div>
              </div>

              {/* Background Color */}
              <div className="mb-4">
                <label className="text-xs text-gray-600 mb-1 block">Background Color</label>
                <div className="flex gap-2 items-center">
                  <div className="relative h-10 w-10">
                    <div
                      className="absolute inset-0 rounded-full border border-[#36463A] cursor-pointer"
                      style={{ backgroundColor: event.doorButtonBackgroundColor || "#ffffff" }}
                    />
                    <input
                      type="color"
                      value={event.doorButtonBackgroundColor || "#ffffff"}
                      onChange={(e) => updateEvent({ doorButtonBackgroundColor: e.target.value })}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      style={{ WebkitAppearance: "none", appearance: "none" }}
                    />
                  </div>
                  <input
                    type="text"
                    value={event.doorButtonBackgroundColor || ""}
                    onChange={(e) => updateEvent({ doorButtonBackgroundColor: e.target.value || undefined })}
                    placeholder="#ffffff"
                    className="flex-1 px-3 py-2 rounded-xl border border-[#36463A] text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#36463A] bg-white font-mono"
                  />
                </div>
              </div>

              {/* Box Shadow */}
              <div className="mb-4">
                <label className="text-xs text-gray-600 mb-1 block">Box Shadow</label>
                <Input
                  type="text"
                  value={event.doorButtonBoxShadow || ""}
                  onChange={(e) => updateEvent({ doorButtonBoxShadow: e.target.value || undefined })}
                  placeholder="e.g., 0 2px 4px rgba(0,0,0,0.1)"
                  className="font-mono text-xs"
                />
                <p className="text-xs text-gray-500 mt-1">CSS box-shadow value (e.g., 0 2px 4px rgba(0,0,0,0.1))</p>
              </div>

              {/* OPEN Text Color */}
              <div className="mb-4">
                <label className="text-xs text-gray-600 mb-1 block">OPEN Text Color (11px)</label>
                <div className="flex gap-2 items-center">
                  <div className="relative h-10 w-10">
                    <div
                      className="absolute inset-0 rounded-full border border-[#36463A] cursor-pointer"
                      style={{ backgroundColor: event.doorButtonOpenTextColor || "#36463A" }}
                    />
                    <input
                      type="color"
                      value={event.doorButtonOpenTextColor || "#36463A"}
                      onChange={(e) => updateEvent({ doorButtonOpenTextColor: e.target.value })}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      style={{ WebkitAppearance: "none", appearance: "none" }}
                    />
                  </div>
                  <input
                    type="text"
                    value={event.doorButtonOpenTextColor || ""}
                    onChange={(e) => updateEvent({ doorButtonOpenTextColor: e.target.value || undefined })}
                    placeholder="#36463A"
                    className="flex-1 px-3 py-2 rounded-xl border border-[#36463A] text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#36463A] bg-white font-mono"
                  />
                </div>
              </div>

              {/* Button Animation */}
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Button Animation</label>
                <select
                  value={event.doorButtonAnimation || "none"}
                  onChange={(e) => updateEvent({ doorButtonAnimation: e.target.value as "none" | "pulse" | "bounce" | "shake" | "glow" | "float" })}
                  className="w-full px-4 py-2 rounded-xl border border-[#36463A] text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#36463A] bg-white"
                >
                  <option value="none">None</option>
                  <option value="pulse">Pulse</option>
                  <option value="bounce">Bounce</option>
                  <option value="shake">Shake</option>
                  <option value="glow">Glow</option>
                  <option value="float">Float</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

