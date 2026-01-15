/**
 * Sections/Pages tool details panel
 */

'use client';

import React from 'react';
import { useProjectStore } from '@/lib/store/projectStore';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, Copy, Trash2, MoreVertical, ArrowUp, ArrowDown } from 'lucide-react';
import { SectionThumbnail } from '@/components/designer/editor/panels/SectionThumbnail';

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

  if (!project) return null;

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      reorderSection(index, index - 1);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < project.sections.length - 1) {
      reorderSection(index, index + 1);
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Add Section Button */}
      <Button
        variant="outline"
        className="w-full hover:bg-zinc-50"
        onClick={() => {
          const newId = addSection();
          setCurrentSection(newId);
        }}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Section
      </Button>

      {/* Sections List */}
      <div className="space-y-2">
        <div className="text-xs font-medium text-zinc-500 uppercase tracking-wide">
          Sections ({project.sections.length})
        </div>
        <div className="space-y-2">
          {project.sections.map((section, index) => {
            const isCurrent = section.id === currentSectionId;
            return (
              <div
                key={section.id}
                className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                  isCurrent
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-zinc-200 hover:border-zinc-300'
                }`}
                onClick={() => setCurrentSection(section.id)}
              >
                {/* Section Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-zinc-500">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium text-zinc-900">
                      {section.name}
                    </span>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          const newId = duplicateSection(section.id);
                          setCurrentSection(newId);
                        }}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          if (project.sections.length > 1) {
                            deleteSection(section.id);
                          }
                        }}
                        disabled={project.sections.length <= 1}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Thumbnail */}
                <div
                  className="w-full bg-zinc-100 rounded border border-zinc-200 overflow-hidden mb-2"
                  style={{ height: '80px' }}
                >
                  <SectionThumbnail section={section} width={200} height={80} />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  {section.objects.length > 0 && (
                    <div className="text-xs text-zinc-500">
                      {section.objects.length} object{section.objects.length !== 1 ? 's' : ''}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveUp(index);
                      }}
                      disabled={index === 0}
                    >
                      <ArrowUp className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveDown(index);
                      }}
                      disabled={index === project.sections.length - 1}
                    >
                      <ArrowDown className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
