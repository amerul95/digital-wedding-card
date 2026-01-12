/**
 * Sections panel - left sidebar with tools and previews
 */

'use client';

import React, { useState } from 'react';
import { useProjectStore } from '@/src/store/projectStore';
import { Button } from '@/components/ui/button';
import { Plus, Copy, Trash2, GripVertical, MousePointer2, Type, Square, Circle, Minus, Image as ImageIcon } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useRouter, useSearchParams } from 'next/navigation';
import { SectionThumbnail } from './SectionThumbnail';

export function SectionsPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    project,
    currentSectionId,
    setCurrentSection,
    addSection,
    duplicateSection,
    deleteSection,
    reorderSection,
    tool,
    setTool,
  } = useProjectStore();

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  if (!project) return null;

  const tools: Array<{
    id: 'select' | 'text' | 'rect' | 'circle' | 'line' | 'image';
    icon: React.ReactNode;
    label: string;
  }> = [
    { id: 'select', icon: <MousePointer2 className="h-4 w-4" />, label: 'Select' },
    { id: 'text', icon: <Type className="h-4 w-4" />, label: 'Text' },
    { id: 'rect', icon: <Square className="h-4 w-4" />, label: 'Rectangle' },
    { id: 'circle', icon: <Circle className="h-4 w-4" />, label: 'Circle' },
    { id: 'line', icon: <Minus className="h-4 w-4" />, label: 'Line' },
    { id: 'image', icon: <ImageIcon className="h-4 w-4" />, label: 'Image' },
  ];

  const handleSectionClick = (sectionId: string) => {
    // Only update the store - let the page component handle URL sync
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
    <div className="w-80 h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Tools Section */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Tools</h2>
        <div className="grid grid-cols-3 gap-2">
          {tools.map((toolItem) => (
            <TooltipProvider key={toolItem.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={tool === toolItem.id ? 'default' : 'outline'}
                    size="sm"
                    className="w-full"
                    onClick={() => setTool(toolItem.id)}
                  >
                    {toolItem.icon}
                    <span className="ml-1 text-xs">{toolItem.label}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{toolItem.label}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>

      {/* Sections Section */}
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

      <div className="flex-1 overflow-y-auto p-3">
        {project.sections.map((section, index) => (
          <div
            key={section.id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            onClick={() => handleSectionClick(section.id)}
            className={`mb-3 p-3 rounded-lg border cursor-pointer transition-colors ${
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

            {/* Thumbnail Preview */}
            <div className="w-full bg-gray-100 rounded border border-gray-200 mb-2 overflow-hidden relative" style={{ minHeight: '120px', aspectRatio: '9/16' }}>
              <SectionThumbnail
                section={section}
                width={280}
                height={497}
              />
              {section.objects.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400 bg-gray-100 pointer-events-none">
                  Empty
                </div>
              )}
            </div>

            {/* Object count indicator */}
            {section.objects.length > 0 && (
              <div className="text-xs text-gray-500 mb-2">
                {section.objects.length} object{section.objects.length !== 1 ? 's' : ''}
              </div>
            )}

            <div className="flex items-center gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={(e) => {
                        e.stopPropagation();
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
                      onClick={(e) => {
                        e.stopPropagation();
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
