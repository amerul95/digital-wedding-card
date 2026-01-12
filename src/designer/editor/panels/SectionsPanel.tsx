/**
 * Sections panel - left sidebar
 */

'use client';

import React, { useState } from 'react';
import { useProjectStore } from '@/src/store/projectStore';
import { Button } from '@/components/ui/button';
import { Plus, Copy, Trash2, GripVertical } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function SectionsPanel() {
  const {
    project,
    currentSectionId,
    setCurrentSection,
    addSection,
    duplicateSection,
    deleteSection,
    reorderSection,
  } = useProjectStore();

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  if (!project) return null;

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null) return;
    if (draggedIndex === index) return;

    const newSections = [...project.sections];
    const [removed] = newSections.splice(draggedIndex, 1);
    newSections.splice(index, 0, removed);
    reorderSection(draggedIndex, index);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="w-64 h-full bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-gray-900">Sections</h2>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => {
                    const id = addSection();
                    setCurrentSection(id);
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Add Section</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {project.sections.map((section, index) => (
          <div
            key={section.id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={`mb-2 p-3 rounded-lg border cursor-move transition-colors ${
              currentSectionId === section.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <GripVertical className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-900 flex-1">
                {section.name}
              </span>
            </div>

            {/* Thumbnail placeholder */}
            <div className="w-full aspect-[9/16] bg-gray-100 rounded border border-gray-200 mb-2 flex items-center justify-center text-xs text-gray-400">
              Preview
            </div>

            <div className="flex items-center gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => {
                        const id = duplicateSection(section.id);
                        setCurrentSection(id);
                      }}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Duplicate</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => {
                        if (project.sections.length > 1) {
                          deleteSection(section.id);
                        }
                      }}
                      disabled={project.sections.length <= 1}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Delete</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
