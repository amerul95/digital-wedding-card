/**
 * Text tool details panel
 */

'use client';

import React, { useState } from 'react';
import { useProjectStore } from '@/src/store/projectStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Heading2, Heading3, FileText, Search } from 'lucide-react';
import { DESIGN_W, DESIGN_H, TextObject } from '@/src/store/types';

export function TextPanel() {
  const { currentSectionId, addObject } = useProjectStore();
  const [searchQuery, setSearchQuery] = useState('');

  const addText = (preset: 'heading' | 'subheading' | 'body') => {
    if (!currentSectionId) return;

    const presets = {
      heading: {
        text: 'Heading',
        fontSize: 48,
        fontFamily: 'Inter',
        fill: '#000000',
        fontStyle: 'bold' as const,
      },
      subheading: {
        text: 'Subheading',
        fontSize: 32,
        fontFamily: 'Inter',
        fill: '#333333',
        fontStyle: 'normal' as const,
      },
      body: {
        text: 'Body text',
        fontSize: 16,
        fontFamily: 'Inter',
        fill: '#666666',
        fontStyle: 'normal' as const,
      },
    };

    const presetData = presets[preset];
    const textW = 200;
    const textH = presetData.fontSize * 1.5;
    const textObject: Omit<TextObject, 'id'> = {
      type: 'text',
      x: (DESIGN_W - textW) / 2,
      y: (DESIGN_H - textH) / 2,
      width: textW,
      height: textH,
      rotation: 0,
      locked: false,
      opacity: 1,
      hidden: false,
      ...presetData,
      align: 'center',
      lineHeight: 1.5,
      letterSpacing: 0,
    };

    addObject(currentSectionId, textObject);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
        <Input
          type="text"
          placeholder="Search fonts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 h-9 text-sm"
        />
      </div>

      {/* Text Presets */}
      <div className="space-y-2">
        <div className="text-xs font-medium text-zinc-500 uppercase tracking-wide">
          Text Styles
        </div>
        <Button
          variant="outline"
          className="w-full justify-start h-auto py-3 px-4 hover:bg-zinc-50"
          onClick={() => addText('heading')}
        >
          <div className="flex items-center gap-3 w-full">
            <Heading2 className="h-5 w-5 text-zinc-600 shrink-0" />
            <div className="flex-1 text-left">
              <div className="font-medium text-sm text-zinc-900">Add Heading</div>
              <div className="text-xs text-zinc-500">Large title text</div>
            </div>
          </div>
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start h-auto py-3 px-4 hover:bg-zinc-50"
          onClick={() => addText('subheading')}
        >
          <div className="flex items-center gap-3 w-full">
            <Heading3 className="h-5 w-5 text-zinc-600 shrink-0" />
            <div className="flex-1 text-left">
              <div className="font-medium text-sm text-zinc-900">Add Subheading</div>
              <div className="text-xs text-zinc-500">Medium subtitle text</div>
            </div>
          </div>
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start h-auto py-3 px-4 hover:bg-zinc-50"
          onClick={() => addText('body')}
        >
          <div className="flex items-center gap-3 w-full">
            <FileText className="h-5 w-5 text-zinc-600 shrink-0" />
            <div className="flex-1 text-left">
              <div className="font-medium text-sm text-zinc-900">Add Body Text</div>
              <div className="text-xs text-zinc-500">Regular paragraph text</div>
            </div>
          </div>
        </Button>
      </div>
    </div>
  );
}
