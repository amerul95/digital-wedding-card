"use client";

import { useEvent } from "@/context/EventContext";
import { Label } from "@/components/card/UI";
import { RichTextEditor } from "@/components/RichTextEditor";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function Page5Form() {
  const { event, updateEvent } = useEvent();

  return (
    <div className="bg-white p-6">
      <div className="space-y-0">
        {/* 1. Additional Information - Grouped */}
        <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50 mb-0">
          <Label>1. Additional Information #1 (Optional)</Label>
          <div className="space-y-3">
            <div>
              <label htmlFor="additionalInformation1FontFamily" className="text-xs text-gray-600 mb-1 block">Font Family</label>
              {(event.uploadedFonts && event.uploadedFonts.length > 0) ? (
                <Select
                  value={event.additionalInformation1FontFamily || ""}
                  onValueChange={(value) => updateEvent({ additionalInformation1FontFamily: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select font..." />
                  </SelectTrigger>
                  <SelectContent>
                    {(event.uploadedFonts || []).map((font, index) => (
                      <SelectItem key={index} value={font.fontFamily}>
                        {font.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm text-gray-500 bg-gray-50">
                  Please upload font first
                </div>
              )}
            </div>
            <RichTextEditor
              content={event.additionalInformation1}
              onChange={(html) => updateEvent({ additionalInformation1: html })}
              placeholder="Additional information (rich text)..."
            />
          </div>
        </div>

        {/* 2. Event Tentative - Grouped */}
        <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50 mb-0">
          <Label>2. Event Tentative (Schedule Content)</Label>
          <div className="space-y-3">
            <div>
              <label htmlFor="eventTentativeFontFamily" className="text-xs text-gray-600 mb-1 block">Font Family</label>
              {(event.uploadedFonts && event.uploadedFonts.length > 0) ? (
                <Select
                  value={event.eventTentativeFontFamily || ""}
                  onValueChange={(value) => updateEvent({ eventTentativeFontFamily: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select font..." />
                  </SelectTrigger>
                  <SelectContent>
                    {(event.uploadedFonts || []).map((font, index) => (
                      <SelectItem key={index} value={font.fontFamily}>
                        {font.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm text-gray-500 bg-gray-50">
                  Please upload font first
                </div>
              )}
            </div>
            <RichTextEditor
              content={event.eventTentative}
              onChange={(html) => updateEvent({ eventTentative: html })}
              placeholder="Enter schedule items..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

