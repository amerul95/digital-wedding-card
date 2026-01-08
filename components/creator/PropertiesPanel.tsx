"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { CanvasElement } from "./CanvasEditor";

interface PropertiesPanelProps {
  element: CanvasElement | null;
  onChange: (updates: Partial<CanvasElement>) => void;
}

export function PropertiesPanel({ element, onChange }: PropertiesPanelProps) {
  if (!element) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Properties</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 text-center py-8">
            Select an element to edit its properties
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Properties: {element.type}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Position */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="x">X Position</Label>
            <Input
              id="x"
              type="number"
              value={Math.round(element.x)}
              onChange={(e) => onChange({ x: parseFloat(e.target.value) || 0 })}
            />
          </div>
          <div>
            <Label htmlFor="y">Y Position</Label>
            <Input
              id="y"
              type="number"
              value={Math.round(element.y)}
              onChange={(e) => onChange({ y: parseFloat(e.target.value) || 0 })}
            />
          </div>
        </div>

        {/* Size */}
        {element.type !== "text" && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="width">Width</Label>
              <Input
                id="width"
                type="number"
                value={Math.round(element.width || 0)}
                onChange={(e) =>
                  onChange({ width: parseFloat(e.target.value) || 0 })
                }
              />
            </div>
            <div>
              <Label htmlFor="height">Height</Label>
              <Input
                id="height"
                type="number"
                value={Math.round(element.height || 0)}
                onChange={(e) =>
                  onChange({ height: parseFloat(e.target.value) || 0 })
                }
              />
            </div>
          </div>
        )}

        {/* Rotation */}
        <div>
          <Label htmlFor="rotation">Rotation (°)</Label>
          <Input
            id="rotation"
            type="number"
            value={element.rotation || 0}
            onChange={(e) => onChange({ rotation: parseFloat(e.target.value) || 0 })}
            min={0}
            max={360}
          />
        </div>

        {/* Opacity */}
        <div>
          <Label htmlFor="opacity">Opacity (0-1)</Label>
          <Input
            id="opacity"
            type="number"
            step="0.1"
            min="0"
            max="1"
            value={element.opacity ?? 1}
            onChange={(e) =>
              onChange({ opacity: parseFloat(e.target.value) || 1 })
            }
          />
        </div>

        {/* Type-specific properties */}
        {element.type === "text" && (
          <>
            <div>
              <Label htmlFor="text">Text Content</Label>
              <Input
                id="text"
                type="text"
                value={element.text || ""}
                onChange={(e) => onChange({ text: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="fontSize">Font Size</Label>
              <Input
                id="fontSize"
                type="number"
                value={element.fontSize || 24}
                onChange={(e) =>
                  onChange({ fontSize: parseFloat(e.target.value) || 24 })
                }
              />
            </div>
            <div>
              <Label htmlFor="fontFamily">Font Family</Label>
              <Input
                id="fontFamily"
                type="text"
                value={element.fontFamily || "Arial"}
                onChange={(e) => onChange({ fontFamily: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="textColor">Text Color</Label>
              <div className="flex gap-2">
                <Input
                  id="textColor"
                  type="color"
                  value={element.fill || "#000000"}
                  onChange={(e) => onChange({ fill: e.target.value })}
                  className="w-16 h-10"
                />
                <Input
                  type="text"
                  value={element.fill || "#000000"}
                  onChange={(e) => onChange({ fill: e.target.value })}
                  placeholder="#000000"
                />
              </div>
            </div>
          </>
        )}

        {(element.type === "rect" || element.type === "image") && (
          <div>
            <Label htmlFor="fill">Color</Label>
            <div className="flex gap-2">
              <Input
                id="fill"
                type="color"
                value={element.fill || "#3b82f6"}
                onChange={(e) => onChange({ fill: e.target.value })}
                className="w-16 h-10"
                disabled={element.type === "image"}
              />
              {element.type === "rect" && (
                <Input
                  type="text"
                  value={element.fill || "#3b82f6"}
                  onChange={(e) => onChange({ fill: e.target.value })}
                  placeholder="#3b82f6"
                />
              )}
            </div>
          </div>
        )}

        {element.type === "image" && (
          <div>
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              type="url"
              value={element.imageUrl || ""}
              onChange={(e) => onChange({ imageUrl: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
