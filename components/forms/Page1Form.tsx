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

const DESIGN_CODES = [
  "Design A",
  "Design B",
  "Design C",
  "Design D",
  "Design E",
  "Design F",
  "Design G",
  "Design H",
  "Design I",
  "Design J",
  "Design K",
  "Design L",
];

export function Page1Form() {
  const { event, updateEvent } = useEvent();

  return (
    <div className="bg-white p-6">
      <div className="space-y-4">
        {/* 1. Card Language */}
        <div>
          <Label>1. Card Language</Label>
          <div className="flex gap-4 mt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="cardLanguage"
                value="english"
                checked={event.cardLanguage === "english"}
                onChange={(e) => updateEvent({ cardLanguage: e.target.value as "english" | "bahasa-melayu" })}
                className="w-4 h-4 text-[#36463A] border-[#36463A] focus:ring-[#36463A]"
              />
              <span className="text-sm text-gray-700">English</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="cardLanguage"
                value="bahasa-melayu"
                checked={event.cardLanguage === "bahasa-melayu"}
                onChange={(e) => updateEvent({ cardLanguage: e.target.value as "english" | "bahasa-melayu" })}
                className="w-4 h-4 text-[#36463A] border-[#36463A] focus:ring-[#36463A]"
              />
              <span className="text-sm text-gray-700">Bahasa</span>
            </label>
          </div>
        </div>

        {/* 2. Package Choice */}
        <div>
          <Label>2. Package Choice</Label>
          <select
            value={event.packageChoice}
            onChange={(e) => updateEvent({ packageChoice: e.target.value as "gold" | "silver" | "bronze" })}
            className="w-full px-4 py-2 rounded-xl border border-[#36463A] text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#36463A] bg-white mt-2"
          >
            <option value="gold">Gold</option>
            <option value="silver">Silver</option>
            <option value="bronze">Bronze</option>
          </select>
        </div>

        {/* 3. Design Code */}
        <div>
          <Label>3. Design Code</Label>
          <select
            value={event.designCode}
            onChange={(e) => updateEvent({ designCode: e.target.value })}
            className="w-full px-4 py-2 rounded-xl border border-[#36463A] text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#36463A] bg-white mt-2"
          >
            {DESIGN_CODES.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        </div>

        {/* 4. Opening Style */}
        <div>
          <Label>4. Opening Style</Label>
          <select
            value={event.openingStyle || event.doorStyle}
            onChange={(e) => {
              const value = e.target.value as "swing" | "slide" | "envelope";
              updateEvent({ openingStyle: value, doorStyle: value });
            }}
            className="w-full px-4 py-2 rounded-xl border border-[#36463A] text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#36463A] bg-white mt-2"
          >
            {DOOR_STYLES.map((style) => (
              <option key={style.value} value={style.value}>
                {style.label}
              </option>
            ))}
          </select>
        </div>

        {/* 4a. Door Color (shown after opening style is selected) */}
        <div>
          <Label>4a. Door Color</Label>
          <div className="flex gap-2 items-center mt-2">
            <input
              type="color"
              value={event.openingStyleColor || event.doorColor}
              onChange={(e) => {
                updateEvent({ openingStyleColor: e.target.value, doorColor: e.target.value });
              }}
              className="h-10 w-20 rounded-lg border border-[#36463A] cursor-pointer"
            />
            <input
              type="text"
              value={event.openingStyleColor || event.doorColor}
              onChange={(e) => {
                updateEvent({ openingStyleColor: e.target.value, doorColor: e.target.value });
              }}
              placeholder="#f43f5e"
              className="flex-1 px-4 py-2 rounded-xl border border-[#36463A] text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#36463A] bg-white font-mono"
            />
          </div>
        </div>

        {/* 5. Animation & effects */}
        <div>
          <Label>5. Animation & Effects</Label>
          <select
            value={event.animationEffect || event.effect}
            onChange={(e) => {
              const value = e.target.value as "none" | "snow" | "petals" | "bubbles";
              updateEvent({ animationEffect: value, effect: value });
            }}
            className="w-full px-4 py-2 rounded-xl border border-[#36463A] text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#36463A] bg-white mt-2"
          >
            {EFFECTS.map((effect) => (
              <option key={effect.value} value={effect.value}>
                {effect.label}
              </option>
            ))}
          </select>
        </div>

        {/* 5a. Effect Color (shown when effect is not none) */}
        {(event.animationEffect || event.effect) !== "none" && (
          <div>
            <Label>5a. Effect Color</Label>
            <div className="flex gap-2 items-center mt-2">
              <input
                type="color"
                value={event.animationEffectColor || event.effectColor}
                onChange={(e) => {
                  updateEvent({ animationEffectColor: e.target.value, effectColor: e.target.value });
                }}
                className="h-10 w-20 rounded-lg border border-[#36463A] cursor-pointer"
              />
              <input
                type="text"
                value={event.animationEffectColor || event.effectColor}
                onChange={(e) => {
                  updateEvent({ animationEffectColor: e.target.value, effectColor: e.target.value });
                }}
                placeholder="#f43f5e"
                className="flex-1 px-4 py-2 rounded-xl border border-[#36463A] text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#36463A] bg-white font-mono"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

