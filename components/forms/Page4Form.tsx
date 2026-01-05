"use client";

import { useEvent } from "@/context/EventContext";
import { Label, Input } from "@/components/card/UI";
import { RichTextEditor } from "@/components/RichTextEditor";

export function Page4Form() {
  const { event, updateEvent } = useEvent();

  return (
    <div className="bg-white p-6">
      <div className="space-y-4">
        {/* 1. Hijrah date (optional) */}
        <div>
          <Label>1. Hijrah Date (Optional)</Label>
          <Input
            value={event.hijrahDate}
            onChange={(e) => updateEvent({ hijrahDate: e.target.value })}
            placeholder="Hijrah date"
            className="mt-2"
          />
        </div>

        {/* 2. Event address */}
        <div>
          <Label>2. Event Address (Location Full)</Label>
          <RichTextEditor
            content={event.eventAddress}
            onChange={(html) => updateEvent({ eventAddress: html })}
            placeholder="Dewan Seri Melati, Putrajaya"
          />
        </div>

        {/* 3. Navigation (optional) */}
        <div>
          <Label>3. Navigation (Optional)</Label>
          <div className="space-y-2 mt-2">
            <div>
              <Label className="text-sm">Google Map Link</Label>
              <Input
                value={event.navigationGoogleMap}
                onChange={(e) => updateEvent({ navigationGoogleMap: e.target.value })}
                placeholder="https://maps.google.com/..."
                type="url"
              />
            </div>
            <div>
              <Label className="text-sm">Waze Link</Label>
              <Input
                value={event.navigationWaze}
                onChange={(e) => updateEvent({ navigationWaze: e.target.value })}
                placeholder="https://waze.com/..."
                type="url"
              />
            </div>
            <div>
              <Label className="text-sm">Others</Label>
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


