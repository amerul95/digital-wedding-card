"use client";

import { useEvent } from "@/context/EventContext";
import { Label, Input } from "@/components/card/UI";
import { RichTextEditorWithMargins } from "@/components/forms/RichTextEditorWithMargins";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CURATED_GOOGLE_FONTS } from "@/lib/fonts";
import { useDesignerFonts } from "@/context/DesignerFontContext";
import { useState, useEffect, useRef } from "react";

export function Page15Form() {
  const { event, updateEvent } = useEvent();
  const { customFonts } = useDesignerFonts();
  
  // Local state for color pickers to prevent excessive updates
  const [labelColor, setLabelColor] = useState(event.attendanceLabelColor || "#6b7280");
  const [numberColor, setNumberColor] = useState(event.attendanceNumberColor || "#16a34a");
  
  // Refs for color preview divs to update directly without re-renders
  const labelColorPreviewRef = useRef<HTMLDivElement>(null);
  const numberColorPreviewRef = useRef<HTMLDivElement>(null);
  const labelColorTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const numberColorTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Sync local state with event when event changes externally
  useEffect(() => {
    const newColor = event.attendanceLabelColor || "#6b7280";
    setLabelColor(newColor);
    if (labelColorPreviewRef.current) {
      labelColorPreviewRef.current.style.backgroundColor = newColor;
    }
  }, [event.attendanceLabelColor]);
  
  useEffect(() => {
    const newColor = event.attendanceNumberColor || "#16a34a";
    setNumberColor(newColor);
    if (numberColorPreviewRef.current) {
      numberColorPreviewRef.current.style.backgroundColor = newColor;
    }
  }, [event.attendanceNumberColor]);

  return (
    <div className="bg-white p-6">
      <div className="space-y-0">
        {/* Attendance Text - Grouped */}
        <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50 mb-4">
          <Label>Attendance Text</Label>
          <div className="space-y-3">
            <RichTextEditorWithMargins
              content={event.attendanceText || ""}
              onChange={(html) => updateEvent({ attendanceText: html })}
              placeholder="Enter attendance text/content..."
              marginTop={event.attendanceTextMarginTop}
              marginRight={event.attendanceTextMarginRight}
              marginBottom={event.attendanceTextMarginBottom}
              marginLeft={event.attendanceTextMarginLeft}
              onMarginTopChange={(value) => updateEvent({ attendanceTextMarginTop: value })}
              onMarginRightChange={(value) => updateEvent({ attendanceTextMarginRight: value })}
              onMarginBottomChange={(value) => updateEvent({ attendanceTextMarginBottom: value })}
              onMarginLeftChange={(value) => updateEvent({ attendanceTextMarginLeft: value })}
            />
            <div className="grid grid-cols-4 gap-3 pt-2 border-t border-gray-200">
              <div>
                <Label>Border Top (px)</Label>
                <Input
                  type="number"
                  value={event.attendanceTextBorderTop ?? 0}
                  onChange={(e) => updateEvent({ attendanceTextBorderTop: Number(e.target.value) || 0 })}
                  min="0"
                  step="1"
                />
              </div>
              <div>
                <Label>Border Right (px)</Label>
                <Input
                  type="number"
                  value={event.attendanceTextBorderRight ?? 0}
                  onChange={(e) => updateEvent({ attendanceTextBorderRight: Number(e.target.value) || 0 })}
                  min="0"
                  step="1"
                />
              </div>
              <div>
                <Label>Border Bottom (px)</Label>
                <Input
                  type="number"
                  value={event.attendanceTextBorderBottom ?? 0}
                  onChange={(e) => updateEvent({ attendanceTextBorderBottom: Number(e.target.value) || 0 })}
                  min="0"
                  step="1"
                />
              </div>
              <div>
                <Label>Border Left (px)</Label>
                <Input
                  type="number"
                  value={event.attendanceTextBorderLeft ?? 0}
                  onChange={(e) => updateEvent({ attendanceTextBorderLeft: Number(e.target.value) || 0 })}
                  min="0"
                  step="1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Counter Container Styling - Grouped */}
        <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50 mb-4">
          <Label>Attendance Counter Container Styling</Label>
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200">
              <Label>Show Separator</Label>
              <Switch
                checked={event.attendanceShowSeparator !== false}
                onCheckedChange={(checked) => updateEvent({ attendanceShowSeparator: checked })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Margin Top (px)</Label>
                <Input
                  type="number"
                  value={event.attendanceCounterMarginTop ?? ''}
                  onChange={(e) => updateEvent({ attendanceCounterMarginTop: e.target.value ? Number(e.target.value) : undefined })}
                  placeholder="Auto"
                  min="0"
                  step="1"
                />
              </div>
              <div>
                <Label>Margin Bottom (px)</Label>
                <Input
                  type="number"
                  value={event.attendanceCounterMarginBottom ?? ''}
                  onChange={(e) => updateEvent({ attendanceCounterMarginBottom: e.target.value ? Number(e.target.value) : undefined })}
                  placeholder="Auto"
                  min="0"
                  step="1"
                />
              </div>
              <div>
                <Label>Margin Left (px)</Label>
                <Input
                  type="number"
                  value={event.attendanceCounterMarginLeft ?? ''}
                  onChange={(e) => updateEvent({ attendanceCounterMarginLeft: e.target.value ? Number(e.target.value) : undefined })}
                  placeholder="Auto"
                  min="0"
                  step="1"
                />
              </div>
              <div>
                <Label>Margin Right (px)</Label>
                <Input
                  type="number"
                  value={event.attendanceCounterMarginRight ?? ''}
                  onChange={(e) => updateEvent({ attendanceCounterMarginRight: e.target.value ? Number(e.target.value) : undefined })}
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
                  value={event.attendanceCounterBorderTop ?? 0}
                  onChange={(e) => updateEvent({ attendanceCounterBorderTop: Number(e.target.value) || 0 })}
                  min="0"
                  step="1"
                />
              </div>
              <div>
                <Label>Border Right (px)</Label>
                <Input
                  type="number"
                  value={event.attendanceCounterBorderRight ?? 0}
                  onChange={(e) => updateEvent({ attendanceCounterBorderRight: Number(e.target.value) || 0 })}
                  min="0"
                  step="1"
                />
              </div>
              <div>
                <Label>Border Bottom (px)</Label>
                <Input
                  type="number"
                  value={event.attendanceCounterBorderBottom ?? 0}
                  onChange={(e) => updateEvent({ attendanceCounterBorderBottom: Number(e.target.value) || 0 })}
                  min="0"
                  step="1"
                />
              </div>
              <div>
                <Label>Border Left (px)</Label>
                <Input
                  type="number"
                  value={event.attendanceCounterBorderLeft ?? 0}
                  onChange={(e) => updateEvent({ attendanceCounterBorderLeft: Number(e.target.value) || 0 })}
                  min="0"
                  step="1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Label Text Styling - Grouped */}
        <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50 mb-4">
          <Label>Label Text Styling ("Attending", "Not Attending")</Label>
          <div className="space-y-3">
            <div>
              <Label>Font Size (px)</Label>
              <Input
                type="number"
                value={event.attendanceLabelFontSize ?? 12}
                onChange={(e) => updateEvent({ attendanceLabelFontSize: Number(e.target.value) || 12 })}
                min="8"
                max="72"
                step="1"
              />
            </div>
            <div>
              <Label>Color</Label>
              <div className="flex gap-2 items-center">
                <div className="relative h-8 w-8">
                  <div
                    ref={labelColorPreviewRef}
                    className="absolute inset-0 rounded-full border border-gray-300 cursor-pointer"
                    style={{ backgroundColor: labelColor }}
                  />
                  <input
                    type="color"
                    value={labelColor}
                    onChange={(e) => {
                      const newColor = e.target.value;
                      // Update preview directly without re-render
                      if (labelColorPreviewRef.current) {
                        labelColorPreviewRef.current.style.backgroundColor = newColor;
                      }
                      setLabelColor(newColor);
                      // Debounce the context update
                      if (labelColorTimeoutRef.current) {
                        clearTimeout(labelColorTimeoutRef.current);
                      }
                      labelColorTimeoutRef.current = setTimeout(() => {
                        updateEvent({ attendanceLabelColor: newColor });
                      }, 100);
                    }}
                    onMouseUp={(e) => {
                      const value = (e.target as HTMLInputElement).value;
                      if (labelColorTimeoutRef.current) {
                        clearTimeout(labelColorTimeoutRef.current);
                      }
                      updateEvent({ attendanceLabelColor: value });
                    }}
                    onBlur={(e) => {
                      const value = (e.target as HTMLInputElement).value;
                      if (labelColorTimeoutRef.current) {
                        clearTimeout(labelColorTimeoutRef.current);
                      }
                      updateEvent({ attendanceLabelColor: value });
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                <Input
                  type="text"
                  value={labelColor}
                  onChange={(e) => {
                    const color = e.target.value;
                    setLabelColor(color);
                    if (/^#[0-9A-F]{6}$/i.test(color)) {
                      updateEvent({ attendanceLabelColor: color });
                    }
                  }}
                  onBlur={(e) => {
                    const color = e.target.value;
                    if (/^#[0-9A-F]{6}$/i.test(color)) {
                      updateEvent({ attendanceLabelColor: color });
                    } else {
                      setLabelColor(event.attendanceLabelColor || "#6b7280");
                    }
                  }}
                  placeholder="#6b7280"
                  className="flex-1 px-2 py-1 border border-green-200 rounded text-xs font-mono bg-white focus:outline-none focus:ring-1 focus:ring-[#36463A]"
                />
              </div>
            </div>
            <div>
              <Label>Font Family</Label>
              <Select
                value={event.attendanceLabelFontFamily || "__default__"}
                onValueChange={(value) => updateEvent({ attendanceLabelFontFamily: value === "__default__" ? undefined : value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select font family" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  <SelectItem value="__default__" className="text-xs">
                    Default
                  </SelectItem>
                  {CURATED_GOOGLE_FONTS.map((fontName) => (
                    <SelectItem
                      key={fontName}
                      value={fontName}
                      className="text-xs"
                      style={{ fontFamily: fontName }}
                    >
                      {fontName}
                    </SelectItem>
                  ))}
                  {customFonts.map((font) => (
                    <SelectItem
                      key={font.fontFamily}
                      value={font.fontFamily}
                      className="text-xs"
                      style={{ fontFamily: font.fontFamily }}
                    >
                      {font.fontFamily}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Number Text Styling - Grouped */}
        <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50 mb-0">
          <Label>Number Text Styling (Count Numbers)</Label>
          <div className="space-y-3">
            <div>
              <Label>Font Size (px)</Label>
              <Input
                type="number"
                value={event.attendanceNumberFontSize ?? 24}
                onChange={(e) => updateEvent({ attendanceNumberFontSize: Number(e.target.value) || 24 })}
                min="8"
                max="72"
                step="1"
              />
            </div>
            <div>
              <Label>Color</Label>
              <div className="flex gap-2 items-center">
                <div className="relative h-8 w-8">
                  <div
                    ref={numberColorPreviewRef}
                    className="absolute inset-0 rounded-full border border-gray-300 cursor-pointer"
                    style={{ backgroundColor: numberColor }}
                  />
                  <input
                    type="color"
                    value={numberColor}
                    onChange={(e) => {
                      const newColor = e.target.value;
                      // Update preview directly without re-render
                      if (numberColorPreviewRef.current) {
                        numberColorPreviewRef.current.style.backgroundColor = newColor;
                      }
                      setNumberColor(newColor);
                      // Debounce the context update
                      if (numberColorTimeoutRef.current) {
                        clearTimeout(numberColorTimeoutRef.current);
                      }
                      numberColorTimeoutRef.current = setTimeout(() => {
                        updateEvent({ attendanceNumberColor: newColor });
                      }, 100);
                    }}
                    onMouseUp={(e) => {
                      const value = (e.target as HTMLInputElement).value;
                      if (numberColorTimeoutRef.current) {
                        clearTimeout(numberColorTimeoutRef.current);
                      }
                      updateEvent({ attendanceNumberColor: value });
                    }}
                    onBlur={(e) => {
                      const value = (e.target as HTMLInputElement).value;
                      if (numberColorTimeoutRef.current) {
                        clearTimeout(numberColorTimeoutRef.current);
                      }
                      updateEvent({ attendanceNumberColor: value });
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                <Input
                  type="text"
                  value={numberColor}
                  onChange={(e) => {
                    const color = e.target.value;
                    setNumberColor(color);
                    if (/^#[0-9A-F]{6}$/i.test(color)) {
                      updateEvent({ attendanceNumberColor: color });
                    }
                  }}
                  onBlur={(e) => {
                    const color = e.target.value;
                    if (/^#[0-9A-F]{6}$/i.test(color)) {
                      updateEvent({ attendanceNumberColor: color });
                    } else {
                      setNumberColor(event.attendanceNumberColor || "#16a34a");
                    }
                  }}
                  placeholder="#16a34a"
                  className="flex-1 px-2 py-1 border border-green-200 rounded text-xs font-mono bg-white focus:outline-none focus:ring-1 focus:ring-[#36463A]"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Note: This color applies to both "Attending" and "Not Attending" numbers. The component will override with green/red if color is not set.
              </p>
            </div>
            <div>
              <Label>Font Family</Label>
              <Select
                value={event.attendanceNumberFontFamily || "__default__"}
                onValueChange={(value) => updateEvent({ attendanceNumberFontFamily: value === "__default__" ? undefined : value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select font family" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  <SelectItem value="__default__" className="text-xs">
                    Default
                  </SelectItem>
                  {CURATED_GOOGLE_FONTS.map((fontName) => (
                    <SelectItem
                      key={fontName}
                      value={fontName}
                      className="text-xs"
                      style={{ fontFamily: fontName }}
                    >
                      {fontName}
                    </SelectItem>
                  ))}
                  {customFonts.map((font) => (
                    <SelectItem
                      key={font.fontFamily}
                      value={font.fontFamily}
                      className="text-xs"
                      style={{ fontFamily: font.fontFamily }}
                    >
                      {font.fontFamily}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
