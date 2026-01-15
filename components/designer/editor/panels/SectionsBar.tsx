/**
 * Sections bar - bottom horizontal scrollable panel
 */

'use client';

import React, { useState } from 'react';
import { useProjectStore } from '@/lib/store/projectStore';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { SectionThumbnail } from './SectionThumbnail';

export function SectionsBar() {
  const {
    project,
    currentSectionId,
    setCurrentSection,
    addSection,
    reorderSection,
  } = useProjectStore();

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  if (!project) return null;

  const handleSectionClick = (sectionId: string) => {
    if (sectionId !== currentSectionId) {
      setCurrentSection(sectionId);
    }
  };

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
    <div className="h-48 bg-white border-t border-gray-200 flex items-center justify-center gap-3 px-4 overflow-x-auto">
      {project.sections.map((section, index) => (
        <div
          key={section.id}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragEnd={handleDragEnd}
          onClick={() => handleSectionClick(section.id)}
          className={`shrink-0 w-28 p-2 rounded-lg border cursor-pointer transition-colors relative ${
            currentSectionId === section.id
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >

          {/* Thumbnail Preview - resized to fit */}
          <div className="w-full bg-gray-100 rounded border border-gray-200 mb-1 overflow-hidden relative" style={{ height: '120px' }}>
            <SectionThumbnail
              section={section}
              width={96}
              height={120}
            />
            {section.objects.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400 bg-gray-100 pointer-events-none">
                Empty
              </div>
            )}
          </div>

          {/* Object count */}
          {section.objects.length > 0 && (
            <div className="text-xs text-gray-500 mb-1 text-center">
              {section.objects.length} object{section.objects.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      ))}
      
      {/* Add Section Button */}
      <div className="shrink-0">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="w-28 h-28 border-dashed"
                onClick={() => {
                  const id = addSection();
                  setCurrentSection(id);
                }}
              >
                <Plus className="h-6 w-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add Section</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
