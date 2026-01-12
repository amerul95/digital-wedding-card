"use client";

import { useEvent } from "@/context/EventContext";
import { Label, Input, Row } from "@/components/card/UI";
import { RichTextEditorWithMargins } from "@/components/forms/RichTextEditorWithMargins";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMemo } from "react";

export function Page2Form() {
  const { event, updateEvent } = useEvent();
  
  // Convert plain text to HTML if needed (for backward compatibility)
  const eventTitleHtml = useMemo(() => {
    if (!event.eventTitle) return '<p></p>';
    // Check if it's already HTML
    if (event.eventTitle.includes('<')) {
      return event.eventTitle;
    }
    // Convert plain text to HTML
    return `<p>${event.eventTitle}</p>`;
  }, [event.eventTitle]);

  const shortNameHtml = useMemo(() => {
    if (!event.shortName) return '<p></p>';
    // Check if it's already HTML
    if (event.shortName.includes('<')) {
      return event.shortName;
    }
    // Convert plain text to HTML
    return `<p>${event.shortName}</p>`;
  }, [event.shortName]);

  // Extract plain text from HTML
  const extractTextFromHtml = (html: string): string => {
    if (typeof document === 'undefined') return html.replace(/<[^>]*>/g, '');
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || '';
  };

  return (
    <div className="bg-white p-6">
      <div className="space-y-0">
        {/* 1. Type of Event - Grouped */}
        <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50 mb-0">
          <Label>1. Type of Event (Event Title Name)</Label>
          <div className="space-y-3">
            <RichTextEditorWithMargins
              content={eventTitleHtml}
              onChange={(html) => {
                const plainText = extractTextFromHtml(html);
                updateEvent({ eventTitle: html }); // Store HTML
                // Also update plain text for backward compatibility if needed
                if (plainText !== event.eventTitle && !event.eventTitle?.includes('<')) {
                  // Only update if it was plain text before
                }
              }}
              placeholder="Majlis Aqiqah"
              fontColor={event.eventTitleFontColor}
              onFontColorChange={(color) => updateEvent({ eventTitleFontColor: color })}
              marginTop={event.eventTitleMarginTop}
              marginRight={event.eventTitleMarginRight}
              marginBottom={event.eventTitleMarginBottom}
              marginLeft={event.eventTitleMarginLeft}
              onMarginTopChange={(value) => updateEvent({ eventTitleMarginTop: value })}
              onMarginRightChange={(value) => updateEvent({ eventTitleMarginRight: value })}
              onMarginBottomChange={(value) => updateEvent({ eventTitleMarginBottom: value })}
              onMarginLeftChange={(value) => updateEvent({ eventTitleMarginLeft: value })}
            />
          </div>
        </div>

        {/* 2. Short Name - Grouped */}
        <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50 mb-0">
          <Label>2. Short Name (Celebrated Person)</Label>
          <div className="space-y-3">
            <RichTextEditorWithMargins
              content={shortNameHtml}
              onChange={(html) => {
                const plainText = extractTextFromHtml(html);
                updateEvent({ shortName: html }); // Store HTML
                // Also update plain text for backward compatibility if needed
                if (plainText !== event.shortName && !event.shortName?.includes('<')) {
                  // Only update if it was plain text before
                }
              }}
              placeholder="Aqil"
              fontSize={event.shortNameFontSize}
              onFontSizeChange={(size) => updateEvent({ shortNameFontSize: size })}
              fontColor={event.shortNameFontColor}
              onFontColorChange={(color) => updateEvent({ shortNameFontColor: color })}
              marginTop={event.shortNameMarginTop}
              marginRight={event.shortNameMarginRight}
              marginBottom={event.shortNameMarginBottom}
              marginLeft={event.shortNameMarginLeft}
              onMarginTopChange={(value) => updateEvent({ shortNameMarginTop: value })}
              onMarginRightChange={(value) => updateEvent({ shortNameMarginRight: value })}
              onMarginBottomChange={(value) => updateEvent({ shortNameMarginBottom: value })}
              onMarginLeftChange={(value) => updateEvent({ shortNameMarginLeft: value })}
            />
          </div>
        </div>

        {/* 3. Day and Date - Grouped */}
        <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50 mb-0">
          <div className="flex items-center justify-between">
            <Label>3. Day and Date (Format: Days - dd.mm.yy)</Label>
            <div className="flex items-center gap-2">
              <label htmlFor="showDayAndDate" className="text-sm text-gray-600">Show in Card</label>
              <input
                type="checkbox"
                id="showDayAndDate"
                checked={event.showDayAndDate ?? true}
                onChange={(e) => updateEvent({ showDayAndDate: e.target.checked })}
                className="w-4 h-4 text-[#36463A] border-[#36463A] rounded focus:ring-[#36463A]"
              />
            </div>
          </div>
          <div className="space-y-3">
            <Input
              id="dayAndDate"
              name="dayAndDate"
              value={event.dayAndDate}
              onChange={(e) => updateEvent({ dayAndDate: e.target.value })}
              placeholder="Rabu - 29.10.25"
            />
            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="dayAndDateShowName"
                  name="dayAndDateShowName"
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
                  name="dayAndDateShowPhone"
                  checked={event.dayAndDateShowPhone}
                  onChange={(e) => updateEvent({ dayAndDateShowPhone: e.target.checked })}
                  className="w-4 h-4 text-[#36463A] border-[#36463A] rounded focus:ring-[#36463A]"
                />
                <Label htmlFor="dayAndDateShowPhone" className="mb-0 text-sm">Phone</Label>
              </div>
              <div className="flex-1">
                <label htmlFor="dayAndDateFontSize" className="text-xs text-gray-600 mb-1 block">Font Size</label>
                <input
                  id="dayAndDateFontSize"
                  name="dayAndDateFontSize"
                  type="number"
                  value={event.dayAndDateFontSize}
                  onChange={(e) => updateEvent({ dayAndDateFontSize: Number(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl border border-[#36463A] text-base font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#36463A] bg-white"
                  min="8"
                  max="72"
                />
              </div>
            </div>
            <div>
              <label htmlFor="dayAndDateTextAlign" className="text-xs text-gray-600 mb-1 block">Text Alignment</label>
              <Select
                value={event.dayAndDateTextAlign || "center"}
                onValueChange={(value: "left" | "center" | "right") => updateEvent({ dayAndDateTextAlign: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select text alignment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="dayAndDateFontColor" className="text-xs text-gray-600 mb-1 block">Font Color</label>
              <div className="flex gap-2 items-center">
                <div className="relative h-10 w-10">
                  <div
                    className="absolute inset-0 rounded-full border border-[#36463A] cursor-pointer"
                    style={{ 
                      backgroundColor: event.dayAndDateFontColor && !event.dayAndDateFontColor.startsWith('linear-gradient') 
                        ? event.dayAndDateFontColor 
                        : '#be123c'
                    }}
                  />
                  <input
                    type="color"
                    value={event.dayAndDateFontColor && !event.dayAndDateFontColor.startsWith('linear-gradient')
                      ? event.dayAndDateFontColor
                      : '#be123c'}
                    onChange={(e) => updateEvent({ dayAndDateFontColor: e.target.value })}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    style={{ WebkitAppearance: "none", appearance: "none" }}
                  />
                </div>
                <input
                  type="text"
                  value={event.dayAndDateFontColor || ""}
                  onChange={(e) => updateEvent({ dayAndDateFontColor: e.target.value || undefined })}
                  placeholder="#be123c or linear-gradient(...)"
                  className="flex-1 px-3 py-2 rounded-xl border border-[#36463A] text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#36463A] bg-white font-mono"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Enter hex color (e.g., #be123c) or gradient (e.g., linear-gradient(to right, #ff0000, #0000ff))</p>
            </div>
          </div>
        </div>

        {/* 4. Place/hashtag/etc (Venue) - Grouped */}
        <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50 mb-0">
          <Label>4. Place/Hashtag/Etc (Venue)</Label>
          <div className="space-y-3">
            <Input
              id="venue"
              name="venue"
              value={event.venue}
              onChange={(e) => updateEvent({ venue: e.target.value })}
              placeholder="Dewan Seri Melati, Putrajaya"
            />
            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <label htmlFor="venueFontSize" className="text-xs text-gray-600 mb-1 block">Font Size</label>
                <input
                  id="venueFontSize"
                  name="venueFontSize"
                  type="number"
                  value={event.venueFontSize ?? ""}
                  onChange={(e) => updateEvent({ venueFontSize: e.target.value ? Number(e.target.value) : undefined })}
                  className="w-full px-4 py-3 rounded-xl border border-[#36463A] text-base font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#36463A] bg-white"
                  min="8"
                  max="72"
                  placeholder="Auto"
                />
              </div>
            </div>
            <div>
              <label htmlFor="venueTextAlign" className="text-xs text-gray-600 mb-1 block">Text Alignment</label>
              <Select
                value={event.venueTextAlign || "center"}
                onValueChange={(value: "left" | "center" | "right") => updateEvent({ venueTextAlign: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select text alignment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="venueFontColor" className="text-xs text-gray-600 mb-1 block">Font Color</label>
              <div className="flex gap-2 items-center">
                <div className="relative h-10 w-10">
                  <div
                    className="absolute inset-0 rounded-full border border-[#36463A] cursor-pointer"
                    style={{ 
                      backgroundColor: event.venueFontColor && !event.venueFontColor.startsWith('linear-gradient') 
                        ? event.venueFontColor 
                        : '#6b7280'
                    }}
                  />
                  <input
                    type="color"
                    value={event.venueFontColor && !event.venueFontColor.startsWith('linear-gradient')
                      ? event.venueFontColor
                      : '#6b7280'}
                    onChange={(e) => updateEvent({ venueFontColor: e.target.value })}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    style={{ WebkitAppearance: "none", appearance: "none" }}
                  />
                </div>
                <input
                  type="text"
                  value={event.venueFontColor || ""}
                  onChange={(e) => updateEvent({ venueFontColor: e.target.value || undefined })}
                  placeholder="#6b7280 or linear-gradient(...)"
                  className="flex-1 px-3 py-2 rounded-xl border border-[#36463A] text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#36463A] bg-white font-mono"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Enter hex color (e.g., #6b7280) or gradient (e.g., linear-gradient(to right, #ff0000, #0000ff))</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}


