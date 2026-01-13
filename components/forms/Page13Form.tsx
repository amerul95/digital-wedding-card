"use client";

import { useEvent } from "@/context/EventContext";
import { Label, Input } from "@/components/card/UI";

export function Page13Form() {
  const { event, updateEvent } = useEvent();

  return (
    <div className="bg-white p-6">
      <div className="space-y-0">
        {/* Card Padding Settings - Grouped */}
        <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50 mb-0">
          <Label>Card Padding Settings</Label>
          <p className="text-xs text-gray-500 mb-3">
            Control the padding inside the card. This affects the spacing around all content sections.
          </p>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Padding Top (px)</Label>
              <Input
                type="number"
                value={event.cardPaddingTop ?? 32}
                onChange={(e) => updateEvent({ cardPaddingTop: Number(e.target.value) || 0 })}
                min="0"
                step="1"
              />
            </div>
            <div>
              <Label>Padding Bottom (px)</Label>
              <Input
                type="number"
                value={event.cardPaddingBottom ?? 32}
                onChange={(e) => updateEvent({ cardPaddingBottom: Number(e.target.value) || 0 })}
                min="0"
                step="1"
              />
            </div>
            <div>
              <Label>Padding Left (px)</Label>
              <Input
                type="number"
                value={event.cardPaddingLeft ?? 32}
                onChange={(e) => updateEvent({ cardPaddingLeft: Number(e.target.value) || 0 })}
                min="0"
                step="1"
              />
            </div>
            <div>
              <Label>Padding Right (px)</Label>
              <Input
                type="number"
                value={event.cardPaddingRight ?? 32}
                onChange={(e) => updateEvent({ cardPaddingRight: Number(e.target.value) || 0 })}
                min="0"
                step="1"
              />
            </div>
          </div>

          {/* Quick Presets */}
          <div className="mt-4 pt-3 border-t border-gray-200">
            <Label className="mb-2">Quick Presets</Label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  updateEvent({
                    cardPaddingTop: 32,
                    cardPaddingRight: 32,
                    cardPaddingBottom: 32,
                    cardPaddingLeft: 32,
                  });
                }}
                className="px-3 py-1.5 text-xs rounded border border-gray-300 hover:bg-gray-100 bg-white text-gray-700"
              >
                Default (32px)
              </button>
              <button
                type="button"
                onClick={() => {
                  updateEvent({
                    cardPaddingTop: 16,
                    cardPaddingRight: 16,
                    cardPaddingBottom: 16,
                    cardPaddingLeft: 16,
                  });
                }}
                className="px-3 py-1.5 text-xs rounded border border-gray-300 hover:bg-gray-100 bg-white text-gray-700"
              >
                Small (16px)
              </button>
              <button
                type="button"
                onClick={() => {
                  updateEvent({
                    cardPaddingTop: 48,
                    cardPaddingRight: 48,
                    cardPaddingBottom: 48,
                    cardPaddingLeft: 48,
                  });
                }}
                className="px-3 py-1.5 text-xs rounded border border-gray-300 hover:bg-gray-100 bg-white text-gray-700"
              >
                Large (48px)
              </button>
              <button
                type="button"
                onClick={() => {
                  updateEvent({
                    cardPaddingTop: 0,
                    cardPaddingRight: 0,
                    cardPaddingBottom: 0,
                    cardPaddingLeft: 0,
                  });
                }}
                className="px-3 py-1.5 text-xs rounded border border-gray-300 hover:bg-gray-100 bg-white text-gray-700"
              >
                None (0px)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
