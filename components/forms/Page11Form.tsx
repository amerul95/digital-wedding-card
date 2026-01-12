"use client";

import { useEvent } from "@/context/EventContext";
import { useDesignerFonts } from "@/context/DesignerFontContext";
import { FontFamilySelect } from "@/components/forms/FontFamilySelect";
import { Label, Input } from "@/components/card/UI";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input as UIInput } from "@/components/ui/input";
import { useState, useEffect } from "react";

// Helper function to parse box shadow value
const parseBoxShadow = (value: string | undefined): { x: number; y: number; blur: number; spread: number; r: number; g: number; b: number; a: number } | null => {
  if (!value || value === 'none') return null;
  
  // Handle multiple shadows - take the first one
  const firstShadow = value.split(',')[0].trim();
  
  // Simple regex to parse box-shadow: offset-x offset-y blur spread color
  const match = firstShadow.match(/^(-?\d+(?:\.\d+)?)\s*(?:px)?\s+(-?\d+(?:\.\d+)?)\s*(?:px)?\s+(-?\d+(?:\.\d+)?)\s*(?:px)?\s*(?:(-?\d+(?:\.\d+)?)\s*(?:px)?\s+)?(rgba?\([^)]+\)|#[0-9a-fA-F]{3,8}|\w+)/);
  
  if (match) {
    const x = parseFloat(match[1]) || 0;
    const y = parseFloat(match[2]) || 0;
    const blur = parseFloat(match[3]) || 0;
    const spread = match[4] ? parseFloat(match[4]) : 0;
    
    // Parse color - handle rgba/rgb
    let r = 0, g = 0, b = 0, a = 0.16;
    const colorMatch = match[5]?.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (colorMatch) {
      r = parseInt(colorMatch[1]) || 0;
      g = parseInt(colorMatch[2]) || 0;
      b = parseInt(colorMatch[3]) || 0;
      a = parseFloat(colorMatch[4]) || 0.16;
    }
    
    return { x, y, blur, spread, r, g, b, a };
  }
  
  // Default values
  return { x: 0, y: 0, blur: 0, spread: 0, r: 0, g: 0, b: 0, a: 0.16 };
};

// Helper function to construct box shadow value
const constructBoxShadow = (values: { x: number; y: number; blur: number; spread: number; r: number; g: number; b: number; a: number } | null): string => {
  if (!values) return 'none';
  const { x, y, blur, spread, r, g, b, a } = values;
  return `${x}px ${y}px ${blur}px ${spread}px rgba(${r}, ${g}, ${b}, ${a})`;
};

// Helper function to convert RGB to hex
const rgbToHex = (r: number, g: number, b: number): string => {
  return "#" + [r, g, b].map(x => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }).join("");
};

// Helper function to convert hex to RGB
const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

// Box Shadow Input Component
function BoxShadowInput({ 
  value, 
  onChange 
}: { 
  value: string; 
  onChange: (value: string) => void;
}) {
  const [boxShadowValues, setBoxShadowValues] = useState(() => 
    parseBoxShadow(value) || { x: 0, y: 0, blur: 0, spread: 0, r: 0, g: 0, b: 0, a: 0.16 }
  );

  // Sync when value prop changes externally
  useEffect(() => {
    const parsed = parseBoxShadow(value);
    if (parsed) {
      setBoxShadowValues(parsed);
    }
  }, [value]);

  const updateBoxShadow = (field: keyof typeof boxShadowValues, fieldValue: number) => {
    // Clamp values to valid ranges
    let clampedValue = fieldValue;
    if (field === 'a') {
      clampedValue = Math.max(0, Math.min(1, fieldValue));
    } else if (field === 'r' || field === 'g' || field === 'b') {
      clampedValue = Math.max(0, Math.min(255, Math.round(fieldValue)));
    }
    
    const newValues = { ...boxShadowValues, [field]: clampedValue };
    setBoxShadowValues(newValues);
    onChange(constructBoxShadow(newValues));
  };

  return (
    <div className="space-y-3">
      {/* Presets */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => {
            const preset = { x: 0, y: 1, blur: 3, spread: 0, r: 0, g: 0, b: 0, a: 0.12 };
            setBoxShadowValues(preset);
            onChange(constructBoxShadow(preset));
          }}
          className="px-2 py-1 text-xs rounded border border-gray-300 hover:bg-gray-50"
        >
          Subtle
        </button>
        <button
          type="button"
          onClick={() => {
            const preset = { x: 0, y: 3, blur: 6, spread: 0, r: 0, g: 0, b: 0, a: 0.16 };
            setBoxShadowValues(preset);
            onChange(constructBoxShadow(preset));
          }}
          className="px-2 py-1 text-xs rounded border border-gray-300 hover:bg-gray-50"
        >
          Medium
        </button>
        <button
          type="button"
          onClick={() => {
            const preset = { x: 0, y: 10, blur: 20, spread: 0, r: 0, g: 0, b: 0, a: 0.19 };
            setBoxShadowValues(preset);
            onChange(constructBoxShadow(preset));
          }}
          className="px-2 py-1 text-xs rounded border border-gray-300 hover:bg-gray-50"
        >
          Strong
        </button>
        <button
          type="button"
          onClick={() => {
            const preset = { x: 0, y: 0, blur: 0, spread: 0, r: 0, g: 0, b: 0, a: 0.16 };
            setBoxShadowValues(preset);
            onChange('none');
          }}
          className="px-2 py-1 text-xs rounded border border-gray-300 hover:bg-gray-50"
        >
          None
        </button>
      </div>

      {/* Position Controls */}
      <div className="space-y-2">
        <div className="text-xs font-medium text-gray-700">Position</div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-gray-600 mb-1 block">X Offset (px)</label>
            <UIInput
              type="number"
              value={boxShadowValues.x}
              onChange={(e) => updateBoxShadow('x', parseFloat(e.target.value) || 0)}
              className="text-xs h-8"
              step="0.1"
            />
          </div>
          <div>
            <label className="text-xs text-gray-600 mb-1 block">Y Offset (px)</label>
            <UIInput
              type="number"
              value={boxShadowValues.y}
              onChange={(e) => updateBoxShadow('y', parseFloat(e.target.value) || 0)}
              className="text-xs h-8"
              step="0.1"
            />
          </div>
        </div>
      </div>

      {/* Blur & Spread Controls */}
      <div className="space-y-2">
        <div className="text-xs font-medium text-gray-700">Blur & Spread</div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-gray-600 mb-1 block">Blur (px)</label>
            <UIInput
              type="number"
              value={boxShadowValues.blur}
              onChange={(e) => updateBoxShadow('blur', parseFloat(e.target.value) || 0)}
              className="text-xs h-8"
              min="0"
              step="0.1"
            />
          </div>
          <div>
            <label className="text-xs text-gray-600 mb-1 block">Spread (px)</label>
            <UIInput
              type="number"
              value={boxShadowValues.spread}
              onChange={(e) => updateBoxShadow('spread', parseFloat(e.target.value) || 0)}
              className="text-xs h-8"
              step="0.1"
            />
          </div>
        </div>
      </div>

      {/* Color Controls */}
      <div className="space-y-2">
        <div className="text-xs font-medium text-gray-700">Color</div>
        <div className="flex items-start gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-600">Color Picker</label>
            <input
              type="color"
              value={rgbToHex(boxShadowValues.r, boxShadowValues.g, boxShadowValues.b)}
              onChange={(e) => {
                const rgb = hexToRgb(e.target.value);
                if (rgb) {
                  updateBoxShadow('r', rgb.r);
                  updateBoxShadow('g', rgb.g);
                  updateBoxShadow('b', rgb.b);
                }
              }}
              className="w-12 h-12 rounded cursor-pointer border-2 border-gray-300"
              style={{ 
                WebkitAppearance: "none", 
                appearance: "none",
              }}
            />
          </div>
          <div className="flex-1 space-y-2">
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Opacity (0-1)</label>
              <div className="flex items-center gap-2">
                <UIInput
                  type="number"
                  value={boxShadowValues.a}
                  onChange={(e) => updateBoxShadow('a', parseFloat(e.target.value) || 0)}
                  className="text-xs h-8 w-16"
                  min="0"
                  max="1"
                  step="0.01"
                />
                <div className="flex-1 relative">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={Math.max(0, Math.min(1, boxShadowValues.a))}
                    onChange={(e) => {
                      const newValue = parseFloat(e.target.value);
                      if (!isNaN(newValue)) {
                        updateBoxShadow('a', newValue);
                      }
                    }}
                    className="w-full h-2 bg-transparent rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, rgba(${boxShadowValues.r}, ${boxShadowValues.g}, ${boxShadowValues.b}, 0) 0%, rgba(${boxShadowValues.r}, ${boxShadowValues.g}, ${boxShadowValues.b}, 1) 100%)`
                    }}
                  />
                  <style dangerouslySetInnerHTML={{__html: `
                    input[type="range"]::-webkit-slider-thumb {
                      -webkit-appearance: none;
                      appearance: none;
                      width: 16px;
                      height: 16px;
                      border-radius: 50%;
                      background: #36463A;
                      cursor: grab;
                      border: 2px solid white;
                      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                    }
                    input[type="range"]::-webkit-slider-thumb:active {
                      cursor: grabbing;
                    }
                    input[type="range"]::-moz-range-thumb {
                      width: 16px;
                      height: 16px;
                      border-radius: 50%;
                      background: #36463A;
                      cursor: grab;
                      border: 2px solid white;
                      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                    }
                    input[type="range"]::-webkit-slider-runnable-track {
                      height: 6px;
                      border-radius: 3px;
                    }
                    input[type="range"]::-moz-range-track {
                      height: 6px;
                      border-radius: 3px;
                      background: transparent;
                    }
                  `}} />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className="font-mono">RGB: ({boxShadowValues.r}, {boxShadowValues.g}, {boxShadowValues.b})</span>
              <span className="font-mono">Hex: {rgbToHex(boxShadowValues.r, boxShadowValues.g, boxShadowValues.b)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="pt-2 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <div 
            className="w-16 h-8 rounded border border-gray-300 bg-white"
            style={{ boxShadow: value || 'none' }}
          />
          <span className="text-xs text-gray-500 font-mono truncate flex-1">
            {value || 'none'}
          </span>
        </div>
      </div>
    </div>
  );
}

export function Page11Form() {
  const { event, updateEvent } = useEvent();
  const { customFonts } = useDesignerFonts();

  return (
    <div className="bg-white p-6">
      <div className="space-y-0">
        {/* Save The Date Button - Grouped */}
        <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50 mb-0">
          <Label>Save The Date Button (Section 2)</Label>
          <div className="space-y-3">
            <div>
              <Label>Button Text</Label>
              <Input
                value={event.saveDateButtonText || "Save The Date"}
                onChange={(e) => updateEvent({ saveDateButtonText: e.target.value })}
                placeholder="Save The Date"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Padding X (px)</Label>
                <Input
                  type="number"
                  value={event.saveDateButtonPaddingX ?? 16}
                  onChange={(e) => updateEvent({ saveDateButtonPaddingX: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label>Padding Y (px)</Label>
                <Input
                  type="number"
                  value={event.saveDateButtonPaddingY ?? 8}
                  onChange={(e) => updateEvent({ saveDateButtonPaddingY: Number(e.target.value) })}
                />
              </div>
            </div>
            <div>
              <Label>Border Radius (px)</Label>
              <Input
                type="number"
                value={event.saveDateButtonBorderRadius ?? 9999}
                onChange={(e) => updateEvent({ saveDateButtonBorderRadius: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label>Background Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={event.saveDateButtonBackgroundColor || "#e11d48"}
                  onChange={(e) => updateEvent({ saveDateButtonBackgroundColor: e.target.value })}
                  className="w-20 h-10"
                />
                <Input
                  value={event.saveDateButtonBackgroundColor || "#e11d48"}
                  onChange={(e) => updateEvent({ saveDateButtonBackgroundColor: e.target.value })}
                  placeholder="#e11d48"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Font Family</label>
              <FontFamilySelect
                value={event.saveDateButtonFontFamily || ""}
                onValueChange={(value) => updateEvent({ saveDateButtonFontFamily: value || undefined })}
                customFonts={customFonts}
                placeholder="Select font..."
              />
            </div>
            <div>
              <Label>Font Size (px)</Label>
              <Input
                type="number"
                value={event.saveDateButtonFontSize ?? 14}
                onChange={(e) => updateEvent({ saveDateButtonFontSize: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label>Text Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={event.saveDateButtonTextColor || "#ffffff"}
                  onChange={(e) => updateEvent({ saveDateButtonTextColor: e.target.value })}
                  className="w-20 h-10"
                />
                <Input
                  value={event.saveDateButtonTextColor || "#ffffff"}
                  onChange={(e) => updateEvent({ saveDateButtonTextColor: e.target.value })}
                  placeholder="#ffffff"
                />
              </div>
            </div>
            <div>
              <Label>Box Shadow</Label>
              <BoxShadowInput
                value={event.saveDateButtonBoxShadow || "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)"}
                onChange={(value) => updateEvent({ saveDateButtonBoxShadow: value })}
              />
            </div>
          </div>
        </div>

        {/* Sahkan Kehadiran Button - Grouped */}
        <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50 mb-0">
          <Label>Sahkan Kehadiran Button (Section 4)</Label>
          <div className="space-y-3">
            <div>
              <Label>Button Text</Label>
              <Input
                value={event.confirmAttendanceButtonText || "Sahkan Kehadiran"}
                onChange={(e) => updateEvent({ confirmAttendanceButtonText: e.target.value })}
                placeholder="Sahkan Kehadiran"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Padding X (px)</Label>
                <Input
                  type="number"
                  value={event.confirmAttendanceButtonPaddingX ?? 16}
                  onChange={(e) => updateEvent({ confirmAttendanceButtonPaddingX: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label>Padding Y (px)</Label>
                <Input
                  type="number"
                  value={event.confirmAttendanceButtonPaddingY ?? 8}
                  onChange={(e) => updateEvent({ confirmAttendanceButtonPaddingY: Number(e.target.value) })}
                />
              </div>
            </div>
            <div>
              <Label>Border Radius (px)</Label>
              <Input
                type="number"
                value={event.confirmAttendanceButtonBorderRadius ?? 9999}
                onChange={(e) => updateEvent({ confirmAttendanceButtonBorderRadius: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label>Background Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={event.confirmAttendanceButtonBackgroundColor || "#e11d48"}
                  onChange={(e) => updateEvent({ confirmAttendanceButtonBackgroundColor: e.target.value })}
                  className="w-20 h-10"
                />
                <Input
                  value={event.confirmAttendanceButtonBackgroundColor || "#e11d48"}
                  onChange={(e) => updateEvent({ confirmAttendanceButtonBackgroundColor: e.target.value })}
                  placeholder="#e11d48"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Font Family</label>
              <FontFamilySelect
                value={event.confirmAttendanceButtonFontFamily || ""}
                onValueChange={(value) => updateEvent({ confirmAttendanceButtonFontFamily: value || undefined })}
                customFonts={customFonts}
                placeholder="Select font..."
              />
            </div>
            <div>
              <Label>Font Size (px)</Label>
              <Input
                type="number"
                value={event.confirmAttendanceButtonFontSize ?? 14}
                onChange={(e) => updateEvent({ confirmAttendanceButtonFontSize: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label>Text Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={event.confirmAttendanceButtonTextColor || "#ffffff"}
                  onChange={(e) => updateEvent({ confirmAttendanceButtonTextColor: e.target.value })}
                  className="w-20 h-10"
                />
                <Input
                  value={event.confirmAttendanceButtonTextColor || "#ffffff"}
                  onChange={(e) => updateEvent({ confirmAttendanceButtonTextColor: e.target.value })}
                  placeholder="#ffffff"
                />
              </div>
            </div>
            <div>
              <Label>Box Shadow</Label>
              <BoxShadowInput
                value={event.confirmAttendanceButtonBoxShadow || "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)"}
                onChange={(value) => updateEvent({ confirmAttendanceButtonBoxShadow: value })}
              />
            </div>
          </div>
        </div>

        {/* Tulis Ucapan Tahniah Button - Grouped */}
        <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50 mb-0">
          <Label>Tulis Ucapan Tahniah Button (Section 4)</Label>
          <div className="space-y-3">
            <div>
              <Label>Button Text</Label>
              <Input
                value={event.writeMessageButtonText || "Tulis Ucapan Tahniah"}
                onChange={(e) => updateEvent({ writeMessageButtonText: e.target.value })}
                placeholder="Tulis Ucapan Tahniah"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Padding X (px)</Label>
                <Input
                  type="number"
                  value={event.writeMessageButtonPaddingX ?? 16}
                  onChange={(e) => updateEvent({ writeMessageButtonPaddingX: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label>Padding Y (px)</Label>
                <Input
                  type="number"
                  value={event.writeMessageButtonPaddingY ?? 8}
                  onChange={(e) => updateEvent({ writeMessageButtonPaddingY: Number(e.target.value) })}
                />
              </div>
            </div>
            <div>
              <Label>Border Radius (px)</Label>
              <Input
                type="number"
                value={event.writeMessageButtonBorderRadius ?? 9999}
                onChange={(e) => updateEvent({ writeMessageButtonBorderRadius: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label>Background Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={event.writeMessageButtonBackgroundColor || "#ffffff"}
                  onChange={(e) => updateEvent({ writeMessageButtonBackgroundColor: e.target.value })}
                  className="w-20 h-10"
                />
                <Input
                  value={event.writeMessageButtonBackgroundColor || "#ffffff"}
                  onChange={(e) => updateEvent({ writeMessageButtonBackgroundColor: e.target.value })}
                  placeholder="#ffffff"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Font Family</label>
              <FontFamilySelect
                value={event.writeMessageButtonFontFamily || ""}
                onValueChange={(value) => updateEvent({ writeMessageButtonFontFamily: value || undefined })}
                customFonts={customFonts}
                placeholder="Select font..."
              />
            </div>
            <div>
              <Label>Font Size (px)</Label>
              <Input
                type="number"
                value={event.writeMessageButtonFontSize ?? 14}
                onChange={(e) => updateEvent({ writeMessageButtonFontSize: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label>Text Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={event.writeMessageButtonTextColor || "#be123c"}
                  onChange={(e) => updateEvent({ writeMessageButtonTextColor: e.target.value })}
                  className="w-20 h-10"
                />
                <Input
                  value={event.writeMessageButtonTextColor || "#be123c"}
                  onChange={(e) => updateEvent({ writeMessageButtonTextColor: e.target.value })}
                  placeholder="#be123c"
                />
              </div>
            </div>
            <div>
              <Label>Border Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={event.writeMessageButtonBorderColor || "#fda4af"}
                  onChange={(e) => updateEvent({ writeMessageButtonBorderColor: e.target.value })}
                  className="w-20 h-10"
                />
                <Input
                  value={event.writeMessageButtonBorderColor || "#fda4af"}
                  onChange={(e) => updateEvent({ writeMessageButtonBorderColor: e.target.value })}
                  placeholder="#fda4af"
                />
              </div>
            </div>
            <div>
              <Label>Box Shadow</Label>
              <BoxShadowInput
                value={event.writeMessageButtonBoxShadow || "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)"}
                onChange={(value) => updateEvent({ writeMessageButtonBoxShadow: value })}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
