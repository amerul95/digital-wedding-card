/**
 * Konva Line component
 */

'use client';

import React from 'react';
import { Line as KonvaLine } from 'react-konva';
import { LineObject } from '@/src/store/types';

interface KonvaLineProps {
  object: LineObject;
}

export function KonvaLineComponent({ object }: KonvaLineProps) {
  return (
    <KonvaLine
      x={object.x}
      y={object.y}
      points={object.points}
      rotation={object.rotation}
      opacity={object.opacity}
      stroke={object.stroke}
      strokeWidth={object.strokeWidth}
      listening={!object.locked}
    />
  );
}
