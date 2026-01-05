"use client";

import { useEvent } from "@/context/EventContext";
import { Label } from "@/components/card/UI";

export function Page6Form() {
  const { event, updateEvent } = useEvent();

  return (
    <div className="bg-white p-6">
      <div className="space-y-4">
        {/* 1. Body text */}
        <div>
          <Label>1. Body Text</Label>
          <div className="space-y-2 mt-2">
            <div>
              <Label className="text-sm">1a. Font Family</Label>
              <input
                type="text"
                value={event.bodyTextFontFamily}
                onChange={(e) => updateEvent({ bodyTextFontFamily: e.target.value })}
                placeholder="Arial"
                className="w-full px-4 py-2 rounded-xl border border-[#36463A] text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#36463A] bg-white"
              />
            </div>
            <div>
              <Label className="text-sm">1b. Font Size</Label>
              <input
                type="number"
                value={event.bodyTextFontSize}
                onChange={(e) => updateEvent({ bodyTextFontSize: Number(e.target.value) })}
                className="w-full px-4 py-2 rounded-xl border border-[#36463A] text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#36463A] bg-white"
                min="8"
                max="72"
              />
            </div>
            <div>
              <Label className="text-sm">1c. Font Color</Label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={event.bodyTextFontColor}
                  onChange={(e) => updateEvent({ bodyTextFontColor: e.target.value })}
                  className="h-10 w-20 rounded-lg border border-[#36463A] cursor-pointer"
                />
                <input
                  type="text"
                  value={event.bodyTextFontColor}
                  onChange={(e) => updateEvent({ bodyTextFontColor: e.target.value })}
                  placeholder="#000000"
                  className="flex-1 px-4 py-2 rounded-xl border border-[#36463A] text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#36463A] bg-white font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 2. Title text */}
        <div>
          <Label>2. Title Text</Label>
          <div className="space-y-2 mt-2">
            <div>
              <Label className="text-sm">2a. Font Family</Label>
              <input
                type="text"
                value={event.titleTextFontFamily}
                onChange={(e) => updateEvent({ titleTextFontFamily: e.target.value })}
                placeholder="Arial"
                className="w-full px-4 py-2 rounded-xl border border-[#36463A] text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#36463A] bg-white"
              />
            </div>
            <div>
              <Label className="text-sm">2b. Font Size</Label>
              <input
                type="number"
                value={event.titleTextFontSize}
                onChange={(e) => updateEvent({ titleTextFontSize: Number(e.target.value) })}
                className="w-full px-4 py-2 rounded-xl border border-[#36463A] text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#36463A] bg-white"
                min="8"
                max="72"
              />
            </div>
          </div>
        </div>

        {/* 3. Background Color */}
        <div>
          <Label>3. Background Color</Label>
          <div className="flex gap-2 items-center mt-2">
            <input
              type="color"
              value={event.backgroundColor}
              onChange={(e) => updateEvent({ backgroundColor: e.target.value })}
              className="h-10 w-20 rounded-lg border border-[#36463A] cursor-pointer"
            />
            <input
              type="text"
              value={event.backgroundColor}
              onChange={(e) => updateEvent({ backgroundColor: e.target.value })}
              placeholder="#ffffff"
              className="flex-1 px-4 py-2 rounded-xl border border-[#36463A] text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#36463A] bg-white font-mono"
            />
          </div>
        </div>

        {/* 4. Side margin */}
        <div>
          <Label>4. Side Margin</Label>
          <div className="flex items-center gap-4 mt-2">
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={event.sideMargin}
              onChange={(e) => updateEvent({ sideMargin: Number(e.target.value) })}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#36463A]"
            />
            <div className="flex items-center gap-2 min-w-[80px]">
              <input
                type="number"
                min="0"
                max="100"
                value={event.sideMargin}
                onChange={(e) => updateEvent({ sideMargin: Number(e.target.value) })}
                className="w-16 px-2 py-1 rounded-lg border border-[#36463A] text-sm text-gray-700 text-center focus:outline-none focus:ring-2 focus:ring-[#36463A]"
              />
              <span className="text-sm text-[#36463A] font-medium">Rem</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


