/**
 * Elements tool details panel
 */

'use client';

import React, { useState } from 'react';
import { useProjectStore } from '@/lib/store/projectStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Square, Circle, Minus, Search, Sparkles } from 'lucide-react';
import { DESIGN_W, DESIGN_H, RectObject, CircleObject, LineObject } from '@/lib/store/types';

export function ElementsPanel() {
  const { currentSectionId, addObject } = useProjectStore();
  const [searchQuery, setSearchQuery] = useState('');

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
      fill: '#3b82f6',
      stroke: '#1e40af',
      strokeWidth: 2,
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
      fill: '#10b981',
      stroke: '#059669',
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
      stroke: '#6366f1',
      strokeWidth: 3,
    };
    addObject(currentSectionId, lineObject);
  };

  const elements = [
    { id: 'rect', label: 'Rectangle', icon: Square, action: addRectangle },
    { id: 'circle', label: 'Circle', icon: Circle, action: addCircle },
    { id: 'line', label: 'Line', icon: Minus, action: addLine },
  ];

  const filteredElements = elements.filter((el) =>
    el.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
        <Input
          type="text"
          placeholder="Search elements..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 h-9 text-sm"
        />
      </div>

      {/* Elements Grid */}
      <div>
        <div className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-3">
          Basic Elements
        </div>
        <div className="grid grid-cols-3 gap-2">
          {filteredElements.map((element) => {
            const Icon = element.icon;
            return (
              <Button
                key={element.id}
                variant="outline"
                className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-zinc-50"
                onClick={element.action}
              >
                <Icon className="h-6 w-6 text-zinc-600" />
                <span className="text-xs text-zinc-600">{element.label}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {filteredElements.length === 0 && (
        <div className="text-center py-8 text-zinc-400 text-sm">
          No elements found
        </div>
      )}
    </div>
  );
}
