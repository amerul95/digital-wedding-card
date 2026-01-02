"use client";

import { useEvent } from "@/context/EventContext";
import { Label, Input, Row } from "@/components/card/UI";

export function Section1Form() {
  const { event, updateEvent } = useEvent();

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-rose-200 p-6">
      <h3 className="text-xl font-semibold text-rose-700 mb-4">Section 2: Title & Header</h3>
      <div className="space-y-4">
        <div>
          <Label>Event Title Prefix</Label>
          <Input
            value={event.uiTitlePrefix}
            onChange={(e) => updateEvent({ uiTitlePrefix: e.target.value })}
            placeholder="Majlis Aqiqah"
          />
        </div>
        <div>
          <Label>Person Name</Label>
          <Input
            value={event.uiName}
            onChange={(e) => updateEvent({ uiName: e.target.value })}
            placeholder="Aqil"
          />
        </div>
        <Row>
          <div>
            <Label>Date Short Format</Label>
            <Input
              value={event.dateShort}
              onChange={(e) => updateEvent({ dateShort: e.target.value })}
              placeholder="Rabu • 29.10.25"
            />
          </div>
          <div>
            <Label>Location Short</Label>
            <Input
              value={event.locationShort}
              onChange={(e) => updateEvent({ locationShort: e.target.value })}
              placeholder="Kuala Lumpur"
            />
          </div>
        </Row>
      </div>
    </div>
  );
}

