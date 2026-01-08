"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Type,
  Square,
  Image as ImageIcon,
  Trash2,
  Copy,
  MoveUp,
  MoveDown,
  Layers,
} from "lucide-react";
import type { CanvasElement } from "./CanvasEditor";

interface ToolbarProps {
  onAddElement: (type: "text" | "rect" | "image") => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onLayerUp: () => void;
  onLayerDown: () => void;
  selectedId: string | null;
  hasSelection: boolean;
}

export function Toolbar({
  onAddElement,
  onDelete,
  onDuplicate,
  onLayerUp,
  onLayerDown,
  selectedId,
  hasSelection,
}: ToolbarProps) {
  return (
    <div className="bg-white border-b border-gray-200 p-4 rounded-t-lg">
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1 border-r border-gray-300 pr-3 mr-2">
          <span className="text-xs font-semibold text-gray-600 mr-2">Add:</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddElement("text")}
            className="flex items-center gap-2"
          >
            <Type className="w-4 h-4" />
            Text
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddElement("rect")}
            className="flex items-center gap-2"
          >
            <Square className="w-4 h-4" />
            Shape
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddElement("image")}
            className="flex items-center gap-2"
          >
            <ImageIcon className="w-4 h-4" />
            Image
          </Button>
        </div>

        {hasSelection && (
          <>
            <div className="flex items-center gap-1 border-r border-gray-300 pr-3 mr-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onDuplicate}
                className="flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Duplicate
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onLayerUp}
                className="flex items-center gap-2"
              >
                <MoveUp className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onLayerDown}
                className="flex items-center gap-2"
              >
                <MoveDown className="w-4 h-4" />
              </Button>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={onDelete}
              className="flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          </>
        )}

        <div className="ml-auto text-xs text-gray-500">
          {selectedId ? `Selected: ${selectedId.slice(0, 8)}...` : "Click to select elements"}
        </div>
      </div>
    </div>
  );
}
