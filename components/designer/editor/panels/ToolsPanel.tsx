/**
 * Tools panel - left sidebar vertical column
 */

'use client';

import React from 'react';
import { useProjectStore } from '@/lib/store/projectStore';
import { Button } from '@/components/ui/button';
import { MousePointer2, Type, Square, Circle, Minus, Image as ImageIcon } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function ToolsPanel() {
  const { tool, setTool } = useProjectStore();

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

  return (
    <div className="w-16 h-full bg-white border-r border-gray-200 flex flex-col items-center py-4 gap-2">
      {tools.map((toolItem) => (
        <TooltipProvider key={toolItem.id}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={tool === toolItem.id ? 'default' : 'ghost'}
                size="icon"
                className="w-12 h-12"
                onClick={() => setTool(toolItem.id)}
              >
                {toolItem.icon}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">{toolItem.label}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
}
