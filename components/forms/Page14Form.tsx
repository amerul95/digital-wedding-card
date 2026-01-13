"use client";

import { useEvent } from "@/context/EventContext";
import { Label, Input } from "@/components/card/UI";
import { RichTextEditorWithMargins } from "@/components/forms/RichTextEditorWithMargins";

export function Page14Form() {
  const { event, updateEvent } = useEvent();

  return (
    <div className="bg-white p-6">
      <div className="space-y-0">
        {/* Text Above Counter - Grouped */}
        <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50 mb-0">
          <Label>Text Above Counter</Label>
          <div className="space-y-3">
            <RichTextEditorWithMargins
              content={event.countingDaysTextAbove || ""}
              onChange={(html) => updateEvent({ countingDaysTextAbove: html })}
              placeholder="Enter text to display above the counter..."
              fontColor={event.countingDaysTextAboveFontColor}
              onFontColorChange={(color) => updateEvent({ countingDaysTextAboveFontColor: color })}
              marginTop={event.countingDaysTextMarginTop}
              marginRight={event.countingDaysTextMarginRight}
              marginBottom={event.countingDaysTextMarginBottom}
              marginLeft={event.countingDaysTextMarginLeft}
              onMarginTopChange={(value) => updateEvent({ countingDaysTextMarginTop: value })}
              onMarginRightChange={(value) => updateEvent({ countingDaysTextMarginRight: value })}
              onMarginBottomChange={(value) => updateEvent({ countingDaysTextMarginBottom: value })}
              onMarginLeftChange={(value) => updateEvent({ countingDaysTextMarginLeft: value })}
            />
            <div className="grid grid-cols-4 gap-3 pt-2 border-t border-gray-200">
              <div>
                <Label>Border Top (px)</Label>
                <Input
                  type="number"
                  value={event.countingDaysTextBorderTop ?? 0}
                  onChange={(e) => updateEvent({ countingDaysTextBorderTop: Number(e.target.value) || 0 })}
                  min="0"
                  step="1"
                />
              </div>
              <div>
                <Label>Border Right (px)</Label>
                <Input
                  type="number"
                  value={event.countingDaysTextBorderRight ?? 0}
                  onChange={(e) => updateEvent({ countingDaysTextBorderRight: Number(e.target.value) || 0 })}
                  min="0"
                  step="1"
                />
              </div>
              <div>
                <Label>Border Bottom (px)</Label>
                <Input
                  type="number"
                  value={event.countingDaysTextBorderBottom ?? 0}
                  onChange={(e) => updateEvent({ countingDaysTextBorderBottom: Number(e.target.value) || 0 })}
                  min="0"
                  step="1"
                />
              </div>
              <div>
                <Label>Border Left (px)</Label>
                <Input
                  type="number"
                  value={event.countingDaysTextBorderLeft ?? 0}
                  onChange={(e) => updateEvent({ countingDaysTextBorderLeft: Number(e.target.value) || 0 })}
                  min="0"
                  step="1"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Border Radius (px)</Label>
                <Input
                  type="number"
                  value={event.countingDaysTextBorderRadius ?? 0}
                  onChange={(e) => updateEvent({ countingDaysTextBorderRadius: Number(e.target.value) || 0 })}
                  min="0"
                  step="1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Counter Container Styling - Grouped */}
        <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50 mb-0">
          <Label>Counter Container Styling</Label>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Margin Top (px)</Label>
                <Input
                  type="number"
                  value={event.countingDaysCounterMarginTop ?? ''}
                  onChange={(e) => updateEvent({ countingDaysCounterMarginTop: e.target.value ? Number(e.target.value) : undefined })}
                  placeholder="Auto"
                  min="0"
                  step="1"
                />
              </div>
              <div>
                <Label>Margin Bottom (px)</Label>
                <Input
                  type="number"
                  value={event.countingDaysCounterMarginBottom ?? ''}
                  onChange={(e) => updateEvent({ countingDaysCounterMarginBottom: e.target.value ? Number(e.target.value) : undefined })}
                  placeholder="Auto"
                  min="0"
                  step="1"
                />
              </div>
              <div>
                <Label>Margin Left (px)</Label>
                <Input
                  type="number"
                  value={event.countingDaysCounterMarginLeft ?? ''}
                  onChange={(e) => updateEvent({ countingDaysCounterMarginLeft: e.target.value ? Number(e.target.value) : undefined })}
                  placeholder="Auto"
                  min="0"
                  step="1"
                />
              </div>
              <div>
                <Label>Margin Right (px)</Label>
                <Input
                  type="number"
                  value={event.countingDaysCounterMarginRight ?? ''}
                  onChange={(e) => updateEvent({ countingDaysCounterMarginRight: e.target.value ? Number(e.target.value) : undefined })}
                  placeholder="Auto"
                  min="0"
                  step="1"
                />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3 pt-2 border-t border-gray-200">
              <div>
                <Label>Border Top (px)</Label>
                <Input
                  type="number"
                  value={event.countingDaysCounterBorderTop ?? 0}
                  onChange={(e) => updateEvent({ countingDaysCounterBorderTop: Number(e.target.value) || 0 })}
                  min="0"
                  step="1"
                />
              </div>
              <div>
                <Label>Border Right (px)</Label>
                <Input
                  type="number"
                  value={event.countingDaysCounterBorderRight ?? 0}
                  onChange={(e) => updateEvent({ countingDaysCounterBorderRight: Number(e.target.value) || 0 })}
                  min="0"
                  step="1"
                />
              </div>
              <div>
                <Label>Border Bottom (px)</Label>
                <Input
                  type="number"
                  value={event.countingDaysCounterBorderBottom ?? 0}
                  onChange={(e) => updateEvent({ countingDaysCounterBorderBottom: Number(e.target.value) || 0 })}
                  min="0"
                  step="1"
                />
              </div>
              <div>
                <Label>Border Left (px)</Label>
                <Input
                  type="number"
                  value={event.countingDaysCounterBorderLeft ?? 0}
                  onChange={(e) => updateEvent({ countingDaysCounterBorderLeft: Number(e.target.value) || 0 })}
                  min="0"
                  step="1"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Border Radius (px)</Label>
                <Input
                  type="number"
                  value={event.countingDaysCounterBorderRadius ?? 0}
                  onChange={(e) => updateEvent({ countingDaysCounterBorderRadius: Number(e.target.value) || 0 })}
                  min="0"
                  step="1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Counter Styling - Grouped */}
        <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50 mb-0">
          <Label>Counter Styling</Label>
          <div className="space-y-3">
            <div>
              <Label>Counter Color</Label>
              <div className="flex gap-2 items-center">
                <div className="relative h-8 w-8">
                  <div
                    className="absolute inset-0 rounded-full border border-gray-300 cursor-pointer"
                    style={{ backgroundColor: event.countingDaysColor || "#be123c" }}
                  />
                  <input
                    type="color"
                    value={event.countingDaysColor || "#be123c"}
                    onChange={(e) => updateEvent({ countingDaysColor: e.target.value })}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                <Input
                  type="text"
                  value={event.countingDaysColor || "#be123c"}
                  onChange={(e) => {
                    const color = e.target.value;
                    if (/^#[0-9A-F]{6}$/i.test(color)) {
                      updateEvent({ countingDaysColor: color });
                    }
                  }}
                  placeholder="#be123c"
                  className="flex-1 px-2 py-1 border border-green-200 rounded text-xs font-mono bg-white focus:outline-none focus:ring-1 focus:ring-[#36463A]"
                />
              </div>
            </div>
            <div>
              <Label>Counter Font Size (px)</Label>
              <Input
                type="number"
                value={event.countingDaysFontSize ?? 20}
                onChange={(e) => updateEvent({ countingDaysFontSize: Number(e.target.value) || 20 })}
                min="8"
                max="72"
                step="1"
              />
            </div>
            <div>
              <Label>Spacing Between Units (px)</Label>
              <Input
                type="number"
                value={event.countingDaysSpacing ?? 8}
                onChange={(e) => updateEvent({ countingDaysSpacing: Number(e.target.value) || 8 })}
                min="0"
                max="50"
                step="1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Spacing between Days, Hours, Minutes, and Seconds
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
