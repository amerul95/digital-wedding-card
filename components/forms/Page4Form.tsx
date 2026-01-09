"use client";

import { useEvent } from "@/context/EventContext";
import { Label, Input } from "@/components/card/UI";
import { RichTextEditor } from "@/components/RichTextEditor";

export function Page4Form() {
  const { event, updateEvent } = useEvent();

  return (
    <div className="bg-white p-6">
      <div className="space-y-6">
        {/* 1. Hijrah Date - Grouped */}
        <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <Label>1. Hijrah Date (Optional)</Label>
          <Input
            value={event.hijrahDate}
            onChange={(e) => updateEvent({ hijrahDate: e.target.value })}
            placeholder="Hijrah date"
          />
        </div>

        {/* 2. Event Address - Grouped */}
        <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <Label>2. Event Address (Location Full)</Label>
          <RichTextEditor
            content={event.eventAddress}
            onChange={(html) => updateEvent({ eventAddress: html })}
            placeholder="Dewan Seri Melati, Putrajaya"
          />
        </div>

        {/* 3. Navigation - Grouped */}
        <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <Label>3. Navigation (Optional)</Label>
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


