"use client";

import { useEvent } from "@/context/EventContext";
import { Label } from "@/components/card/UI";

const DOOR_STYLES = [
  { value: "swing", label: "Swing Doors", description: "Classic swing open animation" },
  { value: "slide", label: "Slide Doors", description: "Modern sliding animation" },
  { value: "envelope", label: "Envelope Doors", description: "Envelope-style fold animation" },
] as const;

const EFFECTS = [
  { value: "none", label: "No Effect", description: "Clean look without any background effects" },
  { value: "snow", label: "Snow", description: "Gentle falling snowflakes" },
  { value: "petals", label: "Petals", description: "Romantic falling rose petals" },
  { value: "bubbles", label: "Bubbles", description: "Floating bubbles animation" },
] as const;

export function Section5Form() {
  const { event, updateEvent } = useEvent();

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-rose-200 p-6">
      <h3 className="text-xl font-semibold text-rose-700 mb-4">Section 1: Appearance Style</h3>
      <div className="space-y-4">
        <div>
          <Label htmlFor="doorStyle">Door Animation Style</Label>
          <select
            id="doorStyle"
            value={event.doorStyle}
            onChange={(e) => updateEvent({ doorStyle: e.target.value as "swing" | "slide" | "envelope" })}
            className="w-full px-4 py-2 rounded-xl border border-rose-200 text-sm text-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-300 bg-white"
          >
            {DOOR_STYLES.map((style) => (
              <option key={style.value} value={style.value}>
                {style.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-rose-600 mt-2">
            {DOOR_STYLES.find((s) => s.value === event.doorStyle)?.description}
          </p>
        </div>

        <div>
          <Label htmlFor="doorColor">Door Color</Label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              id="doorColor"
              value={event.doorColor}
              onChange={(e) => updateEvent({ doorColor: e.target.value })}
              className="h-10 w-20 rounded-lg border border-rose-200 cursor-pointer"
            />
            <input
              type="text"
              value={event.doorColor}
              onChange={(e) => updateEvent({ doorColor: e.target.value })}
              placeholder="#f43f5e"
              className="flex-1 px-4 py-2 rounded-xl border border-rose-200 text-sm text-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-300 bg-white font-mono"
            />
          </div>
          <p className="text-xs text-rose-600 mt-2">
            Customize the color of the door pattern and accents
          </p>
        </div>

        <div>
          <Label htmlFor="effect">Background Effect</Label>
          <select
            id="effect"
            value={event.effect}
            onChange={(e) => updateEvent({ effect: e.target.value as "none" | "snow" | "petals" | "bubbles" })}
            className="w-full px-4 py-2 rounded-xl border border-rose-200 text-sm text-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-300 bg-white"
          >
            {EFFECTS.map((effect) => (
              <option key={effect.value} value={effect.value}>
                {effect.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-rose-600 mt-2">
            {EFFECTS.find((e) => e.value === event.effect)?.description}
          </p>
        </div>

        {event.effect !== "none" && (
          <div>
            <Label htmlFor="effectColor">Effect Color</Label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                id="effectColor"
                value={event.effectColor}
                onChange={(e) => updateEvent({ effectColor: e.target.value })}
                className="h-10 w-20 rounded-lg border border-rose-200 cursor-pointer"
              />
              <input
                type="text"
                value={event.effectColor}
                onChange={(e) => updateEvent({ effectColor: e.target.value })}
                placeholder="#f43f5e"
                className="flex-1 px-4 py-2 rounded-xl border border-rose-200 text-sm text-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-300 bg-white font-mono"
              />
            </div>
            <p className="text-xs text-rose-600 mt-2">
              Customize the color of the background effect particles
            </p>
          </div>
        )}

        {/* Preview hint */}
        <div className="mt-4 p-4 bg-rose-50 rounded-xl border border-rose-200">
          <p className="text-sm text-rose-700">
            <strong>Preview:</strong> The doors will automatically close when you change the animation style, 
            allowing you to see the new effect immediately. Click the "Buka" button to see the animation.
            Background effects are visible once the doors are open.
          </p>
        </div>
      </div>
    </div>
  );
}

