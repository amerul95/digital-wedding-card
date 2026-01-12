/**
 * Left tools bar - vertical icon panel (like Canva/Polotno)
 */

'use client';

import React, { useEffect } from 'react';
import { useEditorUIStore, ActiveTool } from '@/src/store/editorUIStore';
import { useProjectStore } from '@/src/store/projectStore';
import { useHotkeys } from 'react-hotkeys-hook';
import { Button } from '@/components/ui/button';
import {
  Type,
  Sparkles,
  Upload,
  LayoutTemplate,
  Layers,
  Settings,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface Tool {
  id: ActiveTool;
  icon: React.ReactNode;
  label: string;
  shortcut: string;
}

const tools: Tool[] = [
  { id: 'text', icon: <Type className="h-5 w-5" />, label: 'Text', shortcut: 'T' },
  { id: 'elements', icon: <Sparkles className="h-5 w-5" />, label: 'Elements', shortcut: 'E' },
  { id: 'uploads', icon: <Upload className="h-5 w-5" />, label: 'Uploads', shortcut: 'U' },
  { id: 'sections', icon: <LayoutTemplate className="h-5 w-5" />, label: 'Pages', shortcut: 'P' },
  { id: 'layers', icon: <Layers className="h-5 w-5" />, label: 'Layers', shortcut: 'L' },
  { id: 'settings', icon: <Settings className="h-5 w-5" />, label: 'Settings', shortcut: ',' },
];

export function ToolsBar() {
  const { activeTool, toggleTool } = useEditorUIStore();
  const { tool, setTool } = useProjectStore();

  // Keyboard shortcuts (removed 'v' for select - it's now automatic)
  useHotkeys('t', () => toggleTool('text'), { enabled: true, preventDefault: true });
  useHotkeys('e', () => toggleTool('elements'), { enabled: true, preventDefault: true });
  useHotkeys('u', () => toggleTool('uploads'), { enabled: true, preventDefault: true });
  useHotkeys('p', () => toggleTool('sections'), { enabled: true, preventDefault: true });
  useHotkeys('l', () => toggleTool('layers'), { enabled: true, preventDefault: true });
  useHotkeys(',', () => toggleTool('settings'), { enabled: true, preventDefault: true });

  // Sync editor UI tool with project store tool when selecting tools that map to canvas tools
  // Note: 'select' is now automatic when mouse enters canvas, so it's not in the toolMap
  useEffect(() => {
    const toolMap: Record<ActiveTool, 'select' | 'text' | 'rect' | 'circle' | 'line' | 'image' | null> = {
      text: 'text',
      elements: 'rect',
      uploads: 'image',
      sections: null,
      layers: null,
      settings: null,
    };

    const mappedTool = toolMap[activeTool];
    if (mappedTool && mappedTool !== tool) {
      setTool(mappedTool);
    }
  }, [activeTool, tool, setTool]);

  return (
    <div className="w-[72px] h-full bg-zinc-50 border-r border-zinc-200 flex flex-col items-center py-3 gap-1">
      {tools.map((toolItem, index) => {
        const isActive = activeTool === toolItem.id;
        // Add separator before first tool
        const showSeparator = index === 0;
        
        return (
          <React.Fragment key={toolItem.id}>
            {showSeparator && (
              <div className="w-8 h-px bg-zinc-200 my-1" />
            )}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`w-11 h-11 rounded-xl transition-all ${
                      isActive
                        ? 'bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-200'
                        : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                    }`}
                    onClick={() => toggleTool(toolItem.id)}
                  >
                    {toolItem.icon}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="ml-2">
                  {toolItem.label} ({toolItem.shortcut})
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </React.Fragment>
        );
      })}
    </div>
  );
}
