"use client";

import { useEvent } from "@/context/EventContext";
import { Label, Input, Row } from "@/components/card/UI";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function Page2Form() {
  const { event, updateEvent } = useEvent();
  const [showGradientPicker, setShowGradientPicker] = useState(false);
  const [gradientPickerFor, setGradientPickerFor] = useState<"eventTitle" | "shortName">("shortName");
  const [gradientColor1, setGradientColor1] = useState("#ff0000");
  const [gradientColor2, setGradientColor2] = useState("#0000ff");
  const [gradientDirection, setGradientDirection] = useState("to bottom");

  return (
    <div className="bg-white p-6">
      <div className="space-y-6">
        {/* 1. Type of Event - Grouped */}
        <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <Label>1. Type of Event (Event Title Name)</Label>
          <div className="space-y-3">
            <Input
              value={event.eventTitle}
              onChange={(e) => updateEvent({ eventTitle: e.target.value })}
              placeholder="Majlis Aqiqah"
            />
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Font Size</label>
              <input
                type="number"
                value={event.eventTitleFontSize}
                onChange={(e) => updateEvent({ eventTitleFontSize: Number(e.target.value) })}
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
                    style={{ 
                      backgroundColor: event.eventTitleFontColor && event.eventTitleFontColor.startsWith('linear-gradient') 
                        ? 'transparent' 
                        : event.eventTitleFontColor,
                      background: event.eventTitleFontColor && event.eventTitleFontColor.startsWith('linear-gradient') 
                        ? event.eventTitleFontColor 
                        : undefined
                    }}
                  />
                  <input
                    type="color"
                    value={event.eventTitleFontColor && !event.eventTitleFontColor.startsWith('linear-gradient') ? event.eventTitleFontColor : "#f43f5e"}
                    onChange={(e) => updateEvent({ eventTitleFontColor: e.target.value })}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    style={{ WebkitAppearance: "none", appearance: "none" }}
                  />
                </div>
                <input
                  type="text"
                  value={event.eventTitleFontColor}
                  onChange={(e) => updateEvent({ eventTitleFontColor: e.target.value })}
                  placeholder="#f43f5e or gradient"
                  className="flex-1 px-3 py-2 rounded-xl border border-[#36463A] text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#36463A] bg-white font-mono"
                />
                <button
                  type="button"
                  onClick={() => {
                    setGradientPickerFor("eventTitle");
                    setShowGradientPicker(true);
                  }}
                  className="px-3 py-2 rounded-xl border border-[#36463A] text-[#36463A] bg-white hover:bg-gray-50 text-sm font-medium transition-colors flex items-center gap-2"
                  title="Gradient Color"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                  </svg>
                  Gradient
                </button>
              </div>
            </div>
            {/* Preview */}
            {event.eventTitleFontColor && event.eventTitleFontColor.startsWith('linear-gradient') && (
              <div className="p-2 rounded border border-green-200 bg-green-50">
                <div 
                  className="text-lg font-semibold text-center"
                  style={{
                    background: event.eventTitleFontColor,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    color: 'transparent'
                  }}
                >
                  {event.eventTitle || 'Preview Text'}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 2. Short Name - Grouped */}
        <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <Label>2. Short Name (Celebrated Person)</Label>
          <div className="space-y-3">
            <Input
              value={event.shortName}
              onChange={(e) => updateEvent({ shortName: e.target.value })}
              placeholder="Aqil"
            />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Family Font</label>
                <input
                  type="text"
                  value={event.shortNameFamilyFont}
                  onChange={(e) => updateEvent({ shortNameFamilyFont: e.target.value })}
                  placeholder="Arial"
                  className="w-full px-3 py-2 rounded-xl border border-[#36463A] text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#36463A] bg-white"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Font Size</label>
                <input
                  type="number"
                  value={event.shortNameFontSize}
                  onChange={(e) => updateEvent({ shortNameFontSize: Number(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl border border-[#36463A] text-base font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#36463A] bg-white"
                  min="8"
                  max="72"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Font Color</label>
              <div className="flex gap-2 items-center">
                <div className="relative h-10 w-10">
                  <div
                    className="absolute inset-0 rounded-full border border-[#36463A] cursor-pointer"
                    style={{ 
                      backgroundColor: event.shortNameFontColor && event.shortNameFontColor.startsWith('linear-gradient') 
                        ? 'transparent' 
                        : event.shortNameFontColor,
                      background: event.shortNameFontColor && event.shortNameFontColor.startsWith('linear-gradient') 
                        ? event.shortNameFontColor 
                        : undefined
                    }}
                  />
                  <input
                    type="color"
                    value={event.shortNameFontColor && !event.shortNameFontColor.startsWith('linear-gradient') ? event.shortNameFontColor : "#f43f5e"}
                    onChange={(e) => updateEvent({ shortNameFontColor: e.target.value })}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    style={{ WebkitAppearance: "none", appearance: "none" }}
                  />
                </div>
                <input
                  type="text"
                  value={event.shortNameFontColor}
                  onChange={(e) => updateEvent({ shortNameFontColor: e.target.value })}
                  placeholder="#f43f5e or gradient"
                  className="flex-1 px-3 py-2 rounded-xl border border-[#36463A] text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#36463A] bg-white font-mono"
                />
                <button
                  type="button"
                  onClick={() => {
                    setGradientPickerFor("shortName");
                    setShowGradientPicker(true);
                  }}
                  className="px-3 py-2 rounded-xl border border-[#36463A] text-[#36463A] bg-white hover:bg-gray-50 text-sm font-medium transition-colors flex items-center gap-2"
                  title="Gradient Color"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                  </svg>
                  Gradient
                </button>
              </div>
            </div>
            {/* Preview */}
            {event.shortNameFontColor && event.shortNameFontColor.startsWith('linear-gradient') && (
              <div className="p-2 rounded border border-green-200 bg-green-50">
                <div 
                  className="text-lg font-semibold text-center"
                  style={{
                    background: event.shortNameFontColor,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    color: 'transparent'
                  }}
                >
                  {event.shortName || 'Preview Text'}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3. Start of Event - Grouped */}
        <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <Label>3. Start of Event</Label>
          <div>
            <DateTimePicker
              value={event.startEventDateTime}
              onChange={(value) => updateEvent({ startEventDateTime: value })}
              placeholder="Select start date and time"
            />
          </div>
        </div>

        {/* 4. End of Event - Grouped */}
        <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <Label>4. End of Event</Label>
          <div>
            <DateTimePicker
              value={event.endEventDateTime}
              onChange={(value) => updateEvent({ endEventDateTime: value })}
              placeholder="Select end date and time"
            />
          </div>
        </div>

        {/* 5. Day and Date - Grouped */}
        <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <Label>5. Day and Date (Format: Days - dd.mm.yy)</Label>
          <div className="space-y-3">
            <Input
              value={event.dayAndDate}
              onChange={(e) => updateEvent({ dayAndDate: e.target.value })}
              placeholder="Rabu - 29.10.25"
            />
            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="dayAndDateShowName"
                  checked={event.dayAndDateShowName}
                  onChange={(e) => updateEvent({ dayAndDateShowName: e.target.checked })}
                  className="w-4 h-4 text-[#36463A] border-[#36463A] rounded focus:ring-[#36463A]"
                />
                <Label htmlFor="dayAndDateShowName" className="mb-0 text-sm">Name</Label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="dayAndDateShowPhone"
                  checked={event.dayAndDateShowPhone}
                  onChange={(e) => updateEvent({ dayAndDateShowPhone: e.target.checked })}
                  className="w-4 h-4 text-[#36463A] border-[#36463A] rounded focus:ring-[#36463A]"
                />
                <Label htmlFor="dayAndDateShowPhone" className="mb-0 text-sm">Phone</Label>
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-600 mb-1 block">Font Size</label>
                <input
                  type="number"
                  value={event.dayAndDateFontSize}
                  onChange={(e) => updateEvent({ dayAndDateFontSize: Number(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl border border-[#36463A] text-base font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#36463A] bg-white"
                  min="8"
                  max="72"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 6. Place/hashtag/etc (Venue) - Grouped */}
        <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <Label>6. Place/Hashtag/Etc (Venue)</Label>
          <Input
            value={event.venue}
            onChange={(e) => updateEvent({ venue: e.target.value })}
            placeholder="Dewan Seri Melati, Putrajaya"
          />
        </div>
      </div>

      {/* Gradient Picker Dialog */}
      <Dialog open={showGradientPicker} onOpenChange={setShowGradientPicker}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>🎨 Gradient Text Color</DialogTitle>
            <DialogDescription>
              Choose two colors and direction for your gradient text
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-4">
              {/* Color 1 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Color 1 (Start)</label>
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10">
                    <div
                      className="absolute inset-0 rounded-full border border-gray-300 cursor-pointer"
                      style={{ backgroundColor: gradientColor1 }}
                    />
                    <input
                      type="color"
                      value={gradientColor1}
                      onChange={(e) => setGradientColor1(e.target.value)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      style={{ WebkitAppearance: "none", appearance: "none" }}
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={gradientColor1}
                      onChange={(e) => setGradientColor1(e.target.value)}
                      className="w-full px-3 py-2 border border-green-200 rounded text-sm font-mono focus:outline-none focus:ring-1 focus:ring-[#36463A]"
                      placeholder="#ff0000"
                    />
                  </div>
                </div>
              </div>

              {/* Color 2 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Color 2 (End)</label>
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10">
                    <div
                      className="absolute inset-0 rounded-full border border-gray-300 cursor-pointer"
                      style={{ backgroundColor: gradientColor2 }}
                    />
                    <input
                      type="color"
                      value={gradientColor2}
                      onChange={(e) => setGradientColor2(e.target.value)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      style={{ WebkitAppearance: "none", appearance: "none" }}
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={gradientColor2}
                      onChange={(e) => setGradientColor2(e.target.value)}
                      className="w-full px-3 py-2 border border-green-200 rounded text-sm font-mono focus:outline-none focus:ring-1 focus:ring-[#36463A]"
                      placeholder="#0000ff"
                    />
                  </div>
                </div>
              </div>

              {/* Direction */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Direction</label>
                <select
                  value={gradientDirection}
                  onChange={(e) => setGradientDirection(e.target.value)}
                  className="w-full px-3 py-2 border border-green-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#36463A]"
                >
                  <option value="to bottom">Top to Bottom</option>
                  <option value="to top">Bottom to Top</option>
                  <option value="to right">Left to Right</option>
                  <option value="to left">Right to Left</option>
                  <option value="to bottom right">Top Left to Bottom Right</option>
                  <option value="to top right">Bottom Left to Top Right</option>
                  <option value="45deg">45° Diagonal</option>
                  <option value="90deg">90° Vertical</option>
                  <option value="135deg">135° Diagonal</option>
                </select>
              </div>

              {/* Preview */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Preview</label>
                <div 
                  className="w-full h-16 rounded border border-gray-300 flex items-center justify-center text-xl font-semibold"
                  style={{ 
                    background: `linear-gradient(${gradientDirection}, ${gradientColor1}, ${gradientColor2})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    color: 'transparent'
                  }}
                >
                  {gradientPickerFor === "eventTitle" ? (event.eventTitle || 'Gradient Text Preview') : (event.shortName || 'Gradient Text Preview')}
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setShowGradientPicker(false)}
              className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                const gradientValue = `linear-gradient(${gradientDirection}, ${gradientColor1}, ${gradientColor2})`;
                if (gradientPickerFor === "eventTitle") {
                  updateEvent({ eventTitleFontColor: gradientValue });
                } else {
                  updateEvent({ shortNameFontColor: gradientValue });
                }
                setShowGradientPicker(false);
              }}
              className="px-4 py-2 text-sm bg-[#36463A] text-white rounded hover:bg-[#2d3a2f]"
            >
              Apply Gradient
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}


