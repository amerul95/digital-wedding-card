"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Trash2, Copy } from "lucide-react";
import type { CanvasElement } from "./CanvasEditor";

interface LayerPanelProps {
  elements: CanvasElement[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onLayerUp: (id: string) => void;
  onLayerDown: (id: string) => void;
  onToggleVisibility: (id: string) => void;
}

export function LayerPanel({
  elements,
  selectedId,
  onSelect,
  onDelete,
  onDuplicate,
  onLayerUp,
  onLayerDown,
  onToggleVisibility,
}: LayerPanelProps) {
  // Sort by zIndex (reverse order for display - highest zIndex at top of list)
  const sortedElements = [...elements].sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Layers ({elements.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 max-h-96 overflow-y-auto">
        {sortedElements.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">
            No elements yet. Add elements using the toolbar.
          </p>
        ) : (
          sortedElements.map((element, index) => {
            const isSelected = selectedId === element.id;
            const isVisible = element.opacity !== 0;

            return (
              <div
                key={element.id}
                onClick={() => onSelect(element.id)}
                className={`
                  p-3 rounded-lg border cursor-pointer transition-all
                  ${isSelected ? "bg-blue-50 border-blue-500" : "bg-gray-50 border-gray-200 hover:border-gray-300"}
                `}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div
                      className="w-4 h-4 rounded border-2 flex-shrink-0"
                      style={{
                        backgroundColor:
                          element.type === "text"
                            ? element.fill || "#000"
                            : element.type === "rect"
                            ? element.fill || "#3b82f6"
                            : "#94a3b8",
                        borderColor: isSelected ? "#3b82f6" : "#cbd5e1",
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">
                        {element.type === "text"
                          ? element.text || "Text"
                          : element.type === "rect"
                          ? "Rectangle"
                          : "Image"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {element.type} • Layer {elements.length - index}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleVisibility(element.id);
                      }}
                      title={isVisible ? "Hide" : "Show"}
                    >
                      {isVisible ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDuplicate(element.id);
                      }}
                      title="Duplicate"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-red-600 hover:text-red-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(element.id);
                      }}
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
