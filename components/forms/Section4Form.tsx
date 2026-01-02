"use client";

import { useEvent } from "@/context/EventContext";
import { Label, Input } from "@/components/card/UI";

export function Section4Form() {
  const { event, updateEvent } = useEvent();

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-rose-200 p-6">
      <h3 className="text-xl font-semibold text-rose-700 mb-4">Section 5: Congratulations</h3>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="allowCongrats"
            checked={event.allowCongrats}
            onChange={(e) => updateEvent({ allowCongrats: e.target.checked })}
            className="w-4 h-4 text-rose-600 border-rose-300 rounded focus:ring-rose-500"
          />
          <Label htmlFor="allowCongrats">Allow guests to send congratulations</Label>
        </div>
        {!event.allowCongrats && (
          <div>
            <Label>Note (shown when congratulations are disabled)</Label>
            <Input
              value={event.congratsNote}
              onChange={(e) => updateEvent({ congratsNote: e.target.value })}
              placeholder="Tetamu boleh menulis ucapan tahniah."
            />
          </div>
        )}
      </div>
    </div>
  );
}

