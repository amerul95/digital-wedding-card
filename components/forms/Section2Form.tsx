"use client";

import { useEvent } from "@/context/EventContext";
import { Label, Input, Textarea, Row } from "@/components/card/UI";

export function Section2Form() {
  const { event, updateEvent } = useEvent();

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-rose-200 p-6">
      <h3 className="text-xl font-semibold text-rose-700 mb-4">Section 3: Invitation Message</h3>
      <div className="space-y-4">
        <div>
          <Label>Greeting</Label>
          <Input
            value={event.greeting}
            onChange={(e) => updateEvent({ greeting: e.target.value })}
            placeholder="Assalamualaikum, hello & selamat sejahtera"
          />
        </div>
        <div>
          <Label>Speech (multiline)</Label>
          <Textarea
            rows={4}
            value={event.speech}
            onChange={(e) => updateEvent({ speech: e.target.value })}
            placeholder="Dengan penuh kesyukuran, kami mempersilakan..."
          />
          <p className="text-xs text-rose-600 mt-1">Use line breaks for formatting</p>
        </div>
        <Row>
          <div>
            <Label>Location Full</Label>
            <Input
              value={event.locationFull}
              onChange={(e) => updateEvent({ locationFull: e.target.value })}
              placeholder="Dewan Seri Melati, Putrajaya"
            />
          </div>
          <div>
            <Label>Date Full Format</Label>
            <Input
              value={event.dateFull}
              onChange={(e) => updateEvent({ dateFull: e.target.value })}
              placeholder="29 Oktober 2025"
            />
          </div>
        </Row>
        <div>
          <Label>Time Range</Label>
          <Input
            value={event.timeRange}
            onChange={(e) => updateEvent({ timeRange: e.target.value })}
            placeholder="11:00 pagi - 3:00 petang"
          />
        </div>
      </div>
    </div>
  );
}

