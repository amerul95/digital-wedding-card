/**
 * Shapes tool details panel
 */

'use client';

import React from 'react';
import { useProjectStore } from '@/lib/store/projectStore';
import { Button } from '@/components/ui/button';
import { Square, Circle, Minus } from 'lucide-react';
import { DESIGN_W, DESIGN_H, RectObject, CircleObject, LineObject } from '@/lib/store/types';

export function ShapesPanel() {
  const { currentSectionId, addObject } = useProjectStore();

  const addRectangle = () => {
    if (!currentSectionId) return;
    const rectW = 200;
    const rectH = 150;
    const rectObject: Omit<RectObject, 'id'> = {
      type: 'rect',
      x: (DESIGN_W - rectW) / 2,
      y: (DESIGN_H - rectH) / 2,
      width: rectW,
      height: rectH,
      rotation: 0,
      locked: false,
      opacity: 1,
      hidden: false,
      fill: '#8b5cf6',
      stroke: '#7c3aed',
      strokeWidth: 2,
    };
    addObject(currentSectionId, rectObject);
  };

  const addRoundedRectangle = () => {
    if (!currentSectionId) return;
    const rectW = 200;
    const rectH = 150;
    const rectObject: Omit<RectObject, 'id'> = {
      type: 'rect',
      x: (DESIGN_W - rectW) / 2,
      y: (DESIGN_H - rectH) / 2,
      width: rectW,
      height: rectH,
      rotation: 0,
      locked: false,
      opacity: 1,
      hidden: false,
      fill: '#ec4899',
      stroke: '#db2777',
      strokeWidth: 2,
      cornerRadius: 12,
    };
    addObject(currentSectionId, rectObject);
  };

  const addCircle = () => {
    if (!currentSectionId) return;
    const circleW = 150;
    const circleH = 150;
    const circleObject: Omit<CircleObject, 'id'> = {
      type: 'circle',
      x: (DESIGN_W - circleW) / 2,
      y: (DESIGN_H - circleH) / 2,
      width: circleW,
      height: circleH,
      rotation: 0,
      locked: false,
      opacity: 1,
      hidden: false,
      fill: '#f59e0b',
      stroke: '#d97706',
      strokeWidth: 2,
    };
    addObject(currentSectionId, circleObject);
  };

  const addLine = () => {
    if (!currentSectionId) return;
    const lineW = 200;
    const lineH = 0;
    const lineObject: Omit<LineObject, 'id'> = {
      type: 'line',
      x: (DESIGN_W - lineW) / 2,
      y: (DESIGN_H - lineH) / 2,
      width: lineW,
      height: lineH,
      rotation: 0,
      locked: false,
      opacity: 1,
      hidden: false,
      points: [0, 0, lineW, 0],
      stroke: '#ef4444',
      strokeWidth: 3,
    };
    addObject(currentSectionId, lineObject);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="text-xs font-medium text-zinc-500 uppercase tracking-wide">
        Shapes
      </div>
      <div className="space-y-2">
        <Button
          variant="outline"
          className="w-full justify-start h-auto py-3 px-4 hover:bg-zinc-50"
          onClick={addRectangle}
        >
          <div className="flex items-center gap-3 w-full">
            <Square className="h-5 w-5 text-zinc-600 shrink-0" />
            <span className="font-medium text-sm text-zinc-900">Rectangle</span>
          </div>
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start h-auto py-3 px-4 hover:bg-zinc-50"
          onClick={addRoundedRectangle}
        >
          <div className="flex items-center gap-3 w-full">
            <Square className="h-5 w-5 text-zinc-600 shrink-0" />
            <span className="font-medium text-sm text-zinc-900">Rounded Rectangle</span>
          </div>
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start h-auto py-3 px-4 hover:bg-zinc-50"
          onClick={addCircle}
        >
          <div className="flex items-center gap-3 w-full">
            <Circle className="h-5 w-5 text-zinc-600 shrink-0" />
            <span className="font-medium text-sm text-zinc-900">Circle</span>
          </div>
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start h-auto py-3 px-4 hover:bg-zinc-50"
          onClick={addLine}
        >
          <div className="flex items-center gap-3 w-full">
            <Minus className="h-5 w-5 text-zinc-600 shrink-0" />
            <span className="font-medium text-sm text-zinc-900">Line</span>
          </div>
        </Button>
      </div>
    </div>
  );
}
