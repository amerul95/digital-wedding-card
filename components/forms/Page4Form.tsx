"use client";

import { useEvent } from "@/context/EventContext";
import { Label, Input } from "@/components/card/UI";
import { RichTextEditor } from "@/components/RichTextEditor";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export function Page4Form() {
  const { event, updateEvent } = useEvent();

  return (
    <div className="bg-white p-6">
      <div className="space-y-0">
        {/* 1. Start and End of Event - Hidden (may be used in future) */}
        <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50 mb-0" style={{ display: 'none' }}>
          <div className="flex items-center justify-between">
            <Label>1. Start and End of Event</Label>
            <div className="flex items-center gap-2">
              <label htmlFor="showStartEndEvent" className="text-sm text-gray-600">Show in Card</label>
              <Switch
                id="showStartEndEvent"
                checked={event.showStartEndEvent ?? true}
                onCheckedChange={(checked) => updateEvent({ showStartEndEvent: checked })}
              />
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Start Date and Time</label>
              <DateTimePicker
                value={event.startEventDateTime}
                onChange={(value) => updateEvent({ startEventDateTime: value })}
                placeholder="Select start date and time"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-1 block">End Date and Time</label>
              <DateTimePicker
                value={event.endEventDateTime}
                onChange={(value) => updateEvent({ endEventDateTime: value })}
                placeholder="Select end date and time"
              />
            </div>
          </div>
        </div>

        {/* 1. Date and Time (Section 2) - Grouped */}
        <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50 mb-0">
          <div className="flex items-center justify-between">
            <Label>1. Date and Time (Section 2)</Label>
            <div className="flex items-center gap-2">
              <label htmlFor="showStartEndEvent" className="text-sm text-gray-600">Show in Card</label>
              <Switch
                id="showStartEndEvent"
                checked={event.showStartEndEvent ?? true}
                onCheckedChange={(checked) => updateEvent({ showStartEndEvent: checked })}
              />
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label htmlFor="section2DateTimeFontFamily" className="text-xs text-gray-600 mb-1 block">Font Family</label>
              {(event.uploadedFonts && event.uploadedFonts.length > 0) ? (
                <Select
                  value={event.section2DateTimeFontFamily || ""}
                  onValueChange={(value) => updateEvent({ section2DateTimeFontFamily: value })}
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
              content={event.section2DateTimeContent}
              onChange={(html) => updateEvent({ section2DateTimeContent: html })}
              placeholder="Tarikh: 29 Oktober 2025&#10;Masa: 11:00 pagi - 3:00 petang&#10;Masa Tamat: 3:00 petang"
            />
          </div>
        </div>

        {/* 2. Hijrah Date - Grouped */}
        <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50 mb-0">
          <Label>2. Hijrah Date (Optional)</Label>
          <div className="space-y-3">
            <div>
              <label htmlFor="hijrahDateFontFamily" className="text-xs text-gray-600 mb-1 block">Font Family</label>
              {(event.uploadedFonts && event.uploadedFonts.length > 0) ? (
                <Select
                  value={event.hijrahDateFontFamily || ""}
                  onValueChange={(value) => updateEvent({ hijrahDateFontFamily: value })}
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
            <Input
              value={event.hijrahDate}
              onChange={(e) => updateEvent({ hijrahDate: e.target.value })}
              placeholder="Hijrah date"
            />
          </div>
        </div>

        {/* 3. Event Address - Grouped */}
        <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50 mb-0">
          <Label>3. Event Address (Location Full)</Label>
          <div className="space-y-3">
            <div>
              <label htmlFor="eventAddressFontFamily" className="text-xs text-gray-600 mb-1 block">Font Family</label>
              {(event.uploadedFonts && event.uploadedFonts.length > 0) ? (
                <Select
                  value={event.eventAddressFontFamily || ""}
                  onValueChange={(value) => updateEvent({ eventAddressFontFamily: value })}
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
              content={event.eventAddress}
              onChange={(html) => updateEvent({ eventAddress: html })}
              placeholder="Dewan Seri Melati, Putrajaya"
            />
          </div>
        </div>

        {/* 4. Navigation - Grouped */}
        <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50 mb-0">
          <Label>4. Navigation (Optional)</Label>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Google Map Link</label>
              <Input
                value={event.navigationGoogleMap}
                onChange={(e) => updateEvent({ navigationGoogleMap: e.target.value })}
                placeholder="https://maps.google.com/..."
                type="url"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Waze Link</label>
              <Input
                value={event.navigationWaze}
                onChange={(e) => updateEvent({ navigationWaze: e.target.value })}
                placeholder="https://waze.com/..."
                type="url"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Others</label>
              <Input
                value={event.navigationOthers}
                onChange={(e) => updateEvent({ navigationOthers: e.target.value })}
                placeholder="Other navigation links"
                type="url"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


