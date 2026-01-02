"use client";

import { useEvent } from "@/context/EventContext";
import { Label, Input } from "@/components/card/UI";
import { RichTextEditor } from "@/components/RichTextEditor";

export function Section3Form() {
  const { event, updateEvent } = useEvent();

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-rose-200 p-6">
      <h3 className="text-xl font-semibold text-rose-700 mb-4">Section 4: Schedule (Aturcara)</h3>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="aturcaraTitleUseDefault"
            checked={event.aturcaraTitleUseDefault}
            onChange={(e) => updateEvent({ aturcaraTitleUseDefault: e.target.checked })}
            className="w-4 h-4 text-rose-600 border-rose-300 rounded focus:ring-rose-500"
          />
          <Label htmlFor="aturcaraTitleUseDefault">Use default title "Aturcara Majlis"</Label>
        </div>
        {!event.aturcaraTitleUseDefault && (
          <div>
            <Label>Custom Title</Label>
            <Input
              value={event.aturcaraTitle}
              onChange={(e) => updateEvent({ aturcaraTitle: e.target.value })}
              placeholder="Aturcara Majlis"
            />
          </div>
        )}
        <div>
          <Label>Schedule Content (Rich Text)</Label>
          <RichTextEditor
            content={event.aturcaraHtml}
            onChange={(html) => updateEvent({ aturcaraHtml: html })}
            placeholder="Enter schedule items..."
          />
        </div>
      </div>
    </div>
  );
}

