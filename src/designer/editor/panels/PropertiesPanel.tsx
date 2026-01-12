/**
 * Properties panel - right sidebar for selected object
 */

'use client';

import React from 'react';
import { useProjectStore } from '@/src/store/projectStore';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { CanvasObject, TextObject, RectObject, CircleObject, ImageObject } from '@/src/store/types';

export function PropertiesPanel() {
  const {
    project,
    currentSectionId,
    selectedIds,
    updateObject,
  } = useProjectStore();

  const currentSection = project?.sections.find((s) => s.id === currentSectionId);
  const selectedObject = currentSection?.objects.find(
    (o) => o.id === selectedIds[0]
  ) as CanvasObject | undefined;

  if (!selectedObject || selectedIds.length !== 1) {
    return (
      <div className="w-80 h-full bg-white border-l border-gray-200 p-4 text-sm text-gray-500">
        {selectedIds.length === 0
          ? 'Select an object to edit properties'
          : `${selectedIds.length} objects selected`}
      </div>
    );
  }

  const handleUpdate = (updates: Partial<CanvasObject>) => {
    if (currentSectionId) {
      updateObject(currentSectionId, selectedObject.id, updates);
    }
  };

  return (
    <div className="w-80 h-full bg-white border-l border-gray-200 overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-900">Properties</h2>
      </div>

      <div className="p-4 space-y-4">
        {/* Position & Size */}
        <div className="space-y-2">
          <Label className="text-xs font-medium">Position</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs text-gray-500">X</Label>
              <Input
                type="number"
                value={Math.round(selectedObject.x)}
                onChange={(e) =>
                  handleUpdate({ x: parseFloat(e.target.value) || 0 })
                }
                className="h-8 text-xs"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-500">Y</Label>
              <Input
                type="number"
                value={Math.round(selectedObject.y)}
                onChange={(e) =>
                  handleUpdate({ y: parseFloat(e.target.value) || 0 })
                }
                className="h-8 text-xs"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-medium">Size</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs text-gray-500">Width</Label>
              <Input
                type="number"
                value={Math.round(selectedObject.width)}
                onChange={(e) =>
                  handleUpdate({ width: Math.max(10, parseFloat(e.target.value) || 10) })
                }
                className="h-8 text-xs"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-500">Height</Label>
              <Input
                type="number"
                value={Math.round(selectedObject.height)}
                onChange={(e) =>
                  handleUpdate({ height: Math.max(10, parseFloat(e.target.value) || 10) })
                }
                className="h-8 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Rotation */}
        <div className="space-y-2">
          <Label className="text-xs font-medium">
            Rotation: {Math.round(selectedObject.rotation)}°
          </Label>
          <Slider
            value={[selectedObject.rotation]}
            onValueChange={([value]) => handleUpdate({ rotation: value })}
            min={-180}
            max={180}
            step={1}
            className="w-full"
          />
        </div>

        {/* Opacity */}
        <div className="space-y-2">
          <Label className="text-xs font-medium">
            Opacity: {Math.round(selectedObject.opacity * 100)}%
          </Label>
          <Slider
            value={[selectedObject.opacity * 100]}
            onValueChange={([value]) => handleUpdate({ opacity: value / 100 })}
            min={0}
            max={100}
            step={1}
            className="w-full"
          />
        </div>

        {/* Lock & Hide */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium">Locked</Label>
            <Switch
              checked={selectedObject.locked}
              onCheckedChange={(checked) => handleUpdate({ locked: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium">Hidden</Label>
            <Switch
              checked={selectedObject.hidden}
              onCheckedChange={(checked) => handleUpdate({ hidden: checked })}
            />
          </div>
        </div>

        {/* Type-specific properties */}
        {selectedObject.type === 'text' && (
          <TextProperties
            object={selectedObject as TextObject}
            onUpdate={handleUpdate}
          />
        )}

        {selectedObject.type === 'rect' && (
          <RectProperties
            object={selectedObject as RectObject}
            onUpdate={handleUpdate}
          />
        )}

        {selectedObject.type === 'circle' && (
          <CircleProperties
            object={selectedObject as CircleObject}
            onUpdate={handleUpdate}
          />
        )}

        {selectedObject.type === 'image' && (
          <ImageProperties
            object={selectedObject as ImageObject}
            onUpdate={handleUpdate}
          />
        )}
      </div>
    </div>
  );
}

function TextProperties({
  object,
  onUpdate,
}: {
  object: TextObject;
  onUpdate: (updates: Partial<CanvasObject>) => void;
}) {
  return (
    <div className="space-y-4 pt-4 border-t border-gray-200">
      <div className="space-y-2">
        <Label className="text-xs font-medium">Font Family</Label>
        <Select
          value={object.fontFamily}
          onValueChange={(value) => onUpdate({ fontFamily: value })}
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Arial">Arial</SelectItem>
            <SelectItem value="Helvetica">Helvetica</SelectItem>
            <SelectItem value="Times New Roman">Times New Roman</SelectItem>
            <SelectItem value="Georgia">Georgia</SelectItem>
            <SelectItem value="Courier New">Courier New</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-medium">Font Size</Label>
        <Input
          type="number"
          value={object.fontSize}
          onChange={(e) =>
            onUpdate({ fontSize: Math.max(8, parseFloat(e.target.value) || 8) })
          }
          className="h-8 text-xs"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-medium">Color</Label>
        <Input
          type="color"
          value={object.fill}
          onChange={(e) => onUpdate({ fill: e.target.value })}
          className="h-8"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-medium">Align</Label>
        <Select
          value={object.align}
          onValueChange={(value: 'left' | 'center' | 'right') =>
            onUpdate({ align: value })
          }
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Left</SelectItem>
            <SelectItem value="center">Center</SelectItem>
            <SelectItem value="right">Right</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-medium">Font Style</Label>
        <Select
          value={object.fontStyle}
          onValueChange={(value: 'normal' | 'bold' | 'italic' | 'bold italic') =>
            onUpdate({ fontStyle: value })
          }
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="bold">Bold</SelectItem>
            <SelectItem value="italic">Italic</SelectItem>
            <SelectItem value="bold italic">Bold Italic</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function RectProperties({
  object,
  onUpdate,
}: {
  object: RectObject;
  onUpdate: (updates: Partial<CanvasObject>) => void;
}) {
  return (
    <div className="space-y-4 pt-4 border-t border-gray-200">
      <div className="space-y-2">
        <Label className="text-xs font-medium">Fill</Label>
        <Input
          type="color"
          value={object.fill}
          onChange={(e) => onUpdate({ fill: e.target.value })}
          className="h-8"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-medium">Stroke</Label>
        <Input
          type="color"
          value={object.stroke}
          onChange={(e) => onUpdate({ stroke: e.target.value })}
          className="h-8"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-medium">Stroke Width</Label>
        <Input
          type="number"
          value={object.strokeWidth}
          onChange={(e) =>
            onUpdate({ strokeWidth: Math.max(0, parseFloat(e.target.value) || 0) })
          }
          className="h-8 text-xs"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-medium">Corner Radius</Label>
        <Input
          type="number"
          value={object.cornerRadius}
          onChange={(e) =>
            onUpdate({ cornerRadius: Math.max(0, parseFloat(e.target.value) || 0) })
          }
          className="h-8 text-xs"
        />
      </div>
    </div>
  );
}

function CircleProperties({
  object,
  onUpdate,
}: {
  object: CircleObject;
  onUpdate: (updates: Partial<CanvasObject>) => void;
}) {
  return (
    <div className="space-y-4 pt-4 border-t border-gray-200">
      <div className="space-y-2">
        <Label className="text-xs font-medium">Fill</Label>
        <Input
          type="color"
          value={object.fill}
          onChange={(e) => onUpdate({ fill: e.target.value })}
          className="h-8"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-medium">Stroke</Label>
        <Input
          type="color"
          value={object.stroke}
          onChange={(e) => onUpdate({ stroke: e.target.value })}
          className="h-8"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-medium">Stroke Width</Label>
        <Input
          type="number"
          value={object.strokeWidth}
          onChange={(e) =>
            onUpdate({ strokeWidth: Math.max(0, parseFloat(e.target.value) || 0) })
          }
          className="h-8 text-xs"
        />
      </div>
    </div>
  );
}

function ImageProperties({
  object,
  onUpdate,
}: {
  object: ImageObject;
  onUpdate: (updates: Partial<CanvasObject>) => void;
}) {
  return (
    <div className="space-y-4 pt-4 border-t border-gray-200">
      <div className="space-y-2">
        <Label className="text-xs font-medium">Fit</Label>
        <Select
          value={object.fit}
          onValueChange={(value: 'cover' | 'contain') => onUpdate({ fit: value })}
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cover">Cover</SelectItem>
            <SelectItem value="contain">Contain</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-medium">Image URL</Label>
        <Input
          type="text"
          value={object.src}
          onChange={(e) => onUpdate({ src: e.target.value })}
          className="h-8 text-xs"
          placeholder="https://..."
        />
      </div>
    </div>
  );
}
