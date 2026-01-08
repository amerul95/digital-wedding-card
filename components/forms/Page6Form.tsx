"use client";

import { useEvent } from "@/context/EventContext";
import { Label } from "@/components/card/UI";
import { useRef } from "react";

export function Page6Form() {
  const { event, updateEvent } = useEvent();
  const bodyFontInputRef = useRef<HTMLInputElement>(null);
  const titleFontInputRef = useRef<HTMLInputElement>(null);
  
  const uploadedFonts = event.uploadedFonts || [];
  
  const handleFontUpload = (file: File, fontType: 'body' | 'title') => {
    const url = URL.createObjectURL(file);
    const fontFamily = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
    const newFont = { name: file.name, url, fontFamily };
    const updatedFonts = [...uploadedFonts, newFont];
    updateEvent({ 
      uploadedFonts: updatedFonts,
      ...(fontType === 'body' ? { bodyTextFontFamily: fontFamily } : { titleTextFontFamily: fontFamily })
    });
  };

  return (
    <div className="bg-white p-6">
      <div className="space-y-4">
        {/* 1. Body text */}
        <div>
          <Label>1. Body Text</Label>
          <div className="space-y-2 mt-2">
            <div>
              <div className="flex items-center justify-between mb-1">
                <Label className="text-sm">1a. Font Family</Label>
                <button
                  onClick={() => bodyFontInputRef.current?.click()}
                  className="px-2 py-1 rounded text-xs border border-[#36463A] text-[#36463A] bg-white hover:bg-gray-50"
                >
                  Upload Font
                </button>
              </div>
              <input
                type="file"
                ref={bodyFontInputRef}
                className="hidden"
                accept=".ttf,.otf,.woff,.woff2,.eot"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleFontUpload(file, 'body');
                  }
                }}
              />
              <select
                value={event.bodyTextFontFamily}
                onChange={(e) => updateEvent({ bodyTextFontFamily: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-[#36463A] text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#36463A] bg-white"
              >
                <option value="">Select font...</option>
                {uploadedFonts.map((font, index) => (
                  <option key={index} value={font.fontFamily}>
                    {font.name}
                  </option>
                ))}
              </select>
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
              <div className="flex items-center justify-between mb-1">
                <Label className="text-sm">2a. Font Family</Label>
                <button
                  onClick={() => titleFontInputRef.current?.click()}
                  className="px-2 py-1 rounded text-xs border border-[#36463A] text-[#36463A] bg-white hover:bg-gray-50"
                >
                  Upload Font
                </button>
              </div>
              <input
                type="file"
                ref={titleFontInputRef}
                className="hidden"
                accept=".ttf,.otf,.woff,.woff2,.eot"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleFontUpload(file, 'title');
                  }
                }}
              />
              <select
                value={event.titleTextFontFamily}
                onChange={(e) => updateEvent({ titleTextFontFamily: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-[#36463A] text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#36463A] bg-white"
              >
                <option value="">Select font...</option>
                {uploadedFonts.map((font, index) => (
                  <option key={index} value={font.fontFamily}>
                    {font.name}
                  </option>
                ))}
              </select>
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


