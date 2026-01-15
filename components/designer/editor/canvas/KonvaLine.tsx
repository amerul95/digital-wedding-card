/**
 * Konva Line component
 */

'use client';

import React from 'react';
import { Line as KonvaLine } from 'react-konva';
import { LineObject } from '@/lib/store/types';

interface KonvaLineProps {
  object: LineObject;
}

export function KonvaLineComponent({ object }: KonvaLineProps) {
  return (
    <KonvaLine
      x={0}
      y={0}
      points={object.points}
      rotation={object.rotation}
      opacity={object.opacity}
      stroke={object.stroke}
      strokeWidth={object.strokeWidth}
      listening={!object.locked}
    />
  );
}
