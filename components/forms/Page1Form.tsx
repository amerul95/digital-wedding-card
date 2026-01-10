"use client";

import { useEvent } from "@/context/EventContext";
import { Label } from "@/components/card/UI";

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
      </div>
    </div>
  );
}

