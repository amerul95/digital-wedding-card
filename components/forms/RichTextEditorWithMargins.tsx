"use client";

import { RichTextEditor } from "@/components/RichTextEditor";
import { Input } from "@/components/card/UI";

interface RichTextEditorWithMarginsProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  fontSize?: number;
  onFontSizeChange?: (size: number) => void;
  fontColor?: string;
  onFontColorChange?: (color: string) => void;
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
  onMarginTopChange?: (value: number) => void;
  onMarginRightChange?: (value: number) => void;
  onMarginBottomChange?: (value: number) => void;
  onMarginLeftChange?: (value: number) => void;
}

export function RichTextEditorWithMargins({
  content,
  onChange,
  placeholder,
  fontSize,
  onFontSizeChange,
  fontColor,
  onFontColorChange,
  marginTop,
  marginRight,
  marginBottom,
  marginLeft,
  onMarginTopChange,
  onMarginRightChange,
  onMarginBottomChange,
  onMarginLeftChange,
}: RichTextEditorWithMarginsProps) {
  return (
    <div className="space-y-3">
      <div
        style={{
          marginTop: marginTop ? `${marginTop}px` : undefined,
          marginRight: marginRight ? `${marginRight}px` : undefined,
          marginBottom: marginBottom ? `${marginBottom}px` : undefined,
          marginLeft: marginLeft ? `${marginLeft}px` : undefined,
        }}
      >
        <RichTextEditor
          content={content}
          onChange={onChange}
          placeholder={placeholder}
          fontSize={fontSize}
          onFontSizeChange={onFontSizeChange}
          fontColor={fontColor}
          onFontColorChange={onFontColorChange}
        />
      </div>
      
      {/* Margin Controls */}
      {(onMarginTopChange || onMarginRightChange || onMarginBottomChange || onMarginLeftChange) && (
        <div className="mt-4 pt-4 border-t border-gray-300">
          <label className="text-sm font-semibold text-gray-700 mb-3 block">Margin Controls (px)</label>
          <div className="grid grid-cols-2 gap-3">
            {onMarginTopChange && (
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Top</label>
                <Input
                  type="number"
                  value={marginTop ?? 0}
                  onChange={(e) => onMarginTopChange(Number(e.target.value) || 0)}
                  placeholder="0"
                  min="0"
                />
              </div>
            )}
            {onMarginRightChange && (
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Right</label>
                <Input
                  type="number"
                  value={marginRight ?? 0}
                  onChange={(e) => onMarginRightChange(Number(e.target.value) || 0)}
                  placeholder="0"
                  min="0"
                />
              </div>
            )}
            {onMarginBottomChange && (
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Bottom</label>
                <Input
                  type="number"
                  value={marginBottom ?? 0}
                  onChange={(e) => onMarginBottomChange(Number(e.target.value) || 0)}
                  placeholder="0"
                  min="0"
                />
              </div>
            )}
            {onMarginLeftChange && (
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Left</label>
                <Input
                  type="number"
                  value={marginLeft ?? 0}
                  onChange={(e) => onMarginLeftChange(Number(e.target.value) || 0)}
                  placeholder="0"
                  min="0"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
