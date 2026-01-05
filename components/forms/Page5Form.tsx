"use client";

import { useEvent } from "@/context/EventContext";
import { Label } from "@/components/card/UI";
import { RichTextEditor } from "@/components/RichTextEditor";

export function Page5Form() {
  const { event, updateEvent } = useEvent();

  return (
    <div className="bg-white p-6">
      <div className="space-y-4">
        {/* 1. Additional information #1 (optional) */}
        <div>
          <Label>1. Additional Information #1 (Optional)</Label>
          <RichTextEditor
            content={event.additionalInformation1}
            onChange={(html) => updateEvent({ additionalInformation1: html })}
            placeholder="Additional information (rich text)..."
          />
        </div>

        {/* 2. Event tentative */}
        <div>
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

