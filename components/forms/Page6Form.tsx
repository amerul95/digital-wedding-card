"use client";

import { useEvent } from "@/context/EventContext";
import { useDesignerFonts } from "@/context/DesignerFontContext";
import { Label } from "@/components/card/UI";
import { FontFamilySelect } from "@/components/forms/FontFamilySelect";
import { useRef } from "react";

export function Page6Form() {
  const { event, updateEvent } = useEvent();
  const { customFonts } = useDesignerFonts();

  return (
    <div className="bg-white p-6">
      <div className="space-y-0">
        {/* 1. Body Text - Grouped */}
        <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50 mb-0">
          <Label>1. Body Text</Label>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Font Family</label>
              <FontFamilySelect
                value={event.bodyTextFontFamily || ""}
                onValueChange={(value) => updateEvent({ bodyTextFontFamily: value || undefined })}
                customFonts={customFonts}
                placeholder="Select font..."
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Font Size</label>
              <input
                type="number"
                value={event.bodyTextFontSize}
                onChange={(e) => updateEvent({ bodyTextFontSize: Number(e.target.value) })}
                className="w-full px-4 py-3 rounded-xl border border-[#36463A] text-base font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#36463A] bg-white"
                min="8"
                max="72"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Font Color</label>
              <div className="flex gap-2 items-center">
                <div className="relative h-10 w-10">
                  <div
                    className="absolute inset-0 rounded-full border border-[#36463A] cursor-pointer"
                    style={{ backgroundColor: event.bodyTextFontColor }}
                  />
                  <input
                    type="color"
                    value={event.bodyTextFontColor}
                    onChange={(e) => updateEvent({ bodyTextFontColor: e.target.value })}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    style={{ WebkitAppearance: "none", appearance: "none" }}
                  />
                </div>
                <input
                  type="text"
                  value={event.bodyTextFontColor}
                  onChange={(e) => updateEvent({ bodyTextFontColor: e.target.value })}
                  placeholder="#000000"
                  className="flex-1 px-3 py-2 rounded-xl border border-[#36463A] text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#36463A] bg-white font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 2. Title Text - Grouped */}
        <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50 mb-0">
          <Label>2. Title Text</Label>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Font Family</label>
              <FontFamilySelect
                value={event.titleTextFontFamily || ""}
                onValueChange={(value) => updateEvent({ titleTextFontFamily: value || undefined })}
                customFonts={customFonts}
                placeholder="Select font..."
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Font Size</label>
              <input
                type="number"
                value={event.titleTextFontSize}
                onChange={(e) => updateEvent({ titleTextFontSize: Number(e.target.value) })}
                className="w-full px-4 py-3 rounded-xl border border-[#36463A] text-base font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#36463A] bg-white"
                min="8"
                max="72"
              />
            </div>
          </div>
        </div>

        {/* 3. Background Color - Grouped */}
        <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50 mb-0">
          <Label>3. Background Color</Label>
          <div className="flex gap-2 items-center">
            <div className="relative h-10 w-10">
              <div
                className="absolute inset-0 rounded-full border border-[#36463A] cursor-pointer"
                style={{ backgroundColor: event.backgroundColor }}
              />
              <input
                type="color"
                value={event.backgroundColor}
                onChange={(e) => updateEvent({ backgroundColor: e.target.value })}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                style={{ WebkitAppearance: "none", appearance: "none" }}
              />
            </div>
            <input
              type="text"
              value={event.backgroundColor}
              onChange={(e) => updateEvent({ backgroundColor: e.target.value })}
              placeholder="#ffffff"
              className="flex-1 px-3 py-2 rounded-xl border border-[#36463A] text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#36463A] bg-white font-mono"
            />
          </div>
        </div>

        {/* 4. Side Margin - Grouped */}
        <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50 mb-0">
          <Label>4. Side Margin</Label>
          <div className="flex items-center gap-4">
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


