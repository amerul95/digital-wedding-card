/**
 * Layers panel - shows objects in current section
 */

'use client';

import React from 'react';
import { useProjectStore } from '@/lib/store/projectStore';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Lock, Unlock, ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { CanvasObject } from '@/lib/store/types';

export function LayersPanel() {
  const {
    project,
    currentSectionId,
    selectedIds,
    setSelectedIds,
    updateObject,
    reorderObject,
  } = useProjectStore();

  const currentSection = project?.sections.find((s) => s.id === currentSectionId);
  const objects = currentSection?.objects || [];

  if (!currentSection) {
    return (
      <div className="w-64 h-full bg-white border-l border-gray-200 p-4 text-sm text-gray-500">
        No section selected
      </div>
    );
  }

  // Reverse order for display (top to bottom = last to first in array)
  const displayObjects = [...objects].reverse();

  return (
    <div className="w-64 h-full bg-white border-l border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-900">Layers</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {displayObjects.length === 0 ? (
          <div className="text-sm text-gray-400 text-center py-8">
            No objects
          </div>
        ) : (
          displayObjects.map((object, displayIndex) => {
            const actualIndex = objects.length - 1 - displayIndex;
            const isSelected = selectedIds.includes(object.id);
            const typeLabel = object.type.charAt(0).toUpperCase() + object.type.slice(1);

            return (
              <div
                key={object.id}
                className={`mb-1 p-2 rounded cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-blue-100 border border-blue-300'
                    : 'hover:bg-gray-50 border border-transparent'
                }`}
                onClick={() => {
                  if (isSelected) {
                    setSelectedIds([]);
                  } else {
                    setSelectedIds([object.id]);
                  }
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-700 flex-1">
                    {typeLabel}
                  </span>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateObject(currentSectionId, object.id, {
                              hidden: !object.hidden,
                            });
                          }}
                        >
                          {object.hidden ? (
                            <EyeOff className="h-3 w-3" />
                          ) : (
                            <Eye className="h-3 w-3" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {object.hidden ? 'Show' : 'Hide'}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateObject(currentSectionId, object.id, {
                              locked: !object.locked,
                            });
                          }}
                        >
                          {object.locked ? (
                            <Lock className="h-3 w-3" />
                          ) : (
                            <Unlock className="h-3 w-3" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {object.locked ? 'Unlock' : 'Lock'}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <div className="flex items-center gap-1 mt-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            reorderObject(currentSectionId, object.id, 'up');
                          }}
                          disabled={actualIndex === objects.length - 1}
                        >
                          <ArrowUp className="h-3 w-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Bring Forward</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            reorderObject(currentSectionId, object.id, 'down');
                          }}
                          disabled={actualIndex === 0}
                        >
                          <ArrowDown className="h-3 w-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Send Backward</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
