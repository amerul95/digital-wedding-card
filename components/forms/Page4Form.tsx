"use client";

import { useEvent } from "@/context/EventContext";
import { useDesignerFonts } from "@/context/DesignerFontContext";
import { Label, Input } from "@/components/card/UI";
import { RichTextEditorWithMargins } from "@/components/forms/RichTextEditorWithMargins";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { FontFamilySelect } from "@/components/forms/FontFamilySelect";

export function Page4Form() {
  const { event, updateEvent } = useEvent();
  const { customFonts } = useDesignerFonts();

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
            <RichTextEditorWithMargins
              content={event.section2DateTimeContent}
              onChange={(html) => updateEvent({ section2DateTimeContent: html })}
              placeholder="Tarikh: 29 Oktober 2025&#10;Masa: 11:00 pagi - 3:00 petang&#10;Masa Tamat: 3:00 petang"
              marginTop={event.section2DateTimeMarginTop}
              marginRight={event.section2DateTimeMarginRight}
              marginBottom={event.section2DateTimeMarginBottom}
              marginLeft={event.section2DateTimeMarginLeft}
              onMarginTopChange={(value) => updateEvent({ section2DateTimeMarginTop: value })}
              onMarginRightChange={(value) => updateEvent({ section2DateTimeMarginRight: value })}
              onMarginBottomChange={(value) => updateEvent({ section2DateTimeMarginBottom: value })}
              onMarginLeftChange={(value) => updateEvent({ section2DateTimeMarginLeft: value })}
            />
          </div>
        </div>

        {/* 2. Hijrah Date - Grouped */}
        <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50 mb-0">
          <Label>2. Hijrah Date (Optional)</Label>
          <div className="space-y-3">
            <div>
              <label htmlFor="hijrahDateFontFamily" className="text-xs text-gray-600 mb-1 block">Font Family</label>
              <FontFamilySelect
                value={event.hijrahDateFontFamily || ""}
                onValueChange={(value) => updateEvent({ hijrahDateFontFamily: value || undefined })}
                customFonts={customFonts}
                placeholder="Select font..."
              />
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
            <RichTextEditorWithMargins
              content={event.eventAddress}
              onChange={(html) => updateEvent({ eventAddress: html })}
              placeholder="Dewan Seri Melati, Putrajaya"
              marginTop={event.eventAddressMarginTop}
              marginRight={event.eventAddressMarginRight}
              marginBottom={event.eventAddressMarginBottom}
              marginLeft={event.eventAddressMarginLeft}
              onMarginTopChange={(value) => updateEvent({ eventAddressMarginTop: value })}
              onMarginRightChange={(value) => updateEvent({ eventAddressMarginRight: value })}
              onMarginBottomChange={(value) => updateEvent({ eventAddressMarginBottom: value })}
              onMarginLeftChange={(value) => updateEvent({ eventAddressMarginLeft: value })}
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


