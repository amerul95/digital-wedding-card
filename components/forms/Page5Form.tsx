"use client";

import { useEvent } from "@/context/EventContext";
import { Label } from "@/components/card/UI";
import { RichTextEditor } from "@/components/RichTextEditor";

export function Page5Form() {
  const { event, updateEvent } = useEvent();

  return (
    <div className="bg-white p-6">
      <div className="space-y-6">
        {/* 1. Additional Information - Grouped */}
        <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <Label>1. Additional Information #1 (Optional)</Label>
          <RichTextEditor
            content={event.additionalInformation1}
            onChange={(html) => updateEvent({ additionalInformation1: html })}
            placeholder="Additional information (rich text)..."
          />
        </div>

        {/* 2. Event Tentative - Grouped */}
        <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <Label>2. Event Tentative (Schedule Content)</Label>
          <RichTextEditor
            content={event.eventTentative}
            onChange={(html) => updateEvent({ eventTentative: html })}
            placeholder="Enter schedule items..."
          />
        </div>
      </div>
    </div>
  );
}

