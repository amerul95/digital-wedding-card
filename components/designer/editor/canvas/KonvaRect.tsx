/**
 * Konva Rect component
 */

'use client';

import React from 'react';
import { Rect as KonvaRect } from 'react-konva';
import { RectObject } from '@/lib/store/types';

interface KonvaRectProps {
  object: RectObject;
}

export function KonvaRectComponent({ object }: KonvaRectProps) {
  return (
    <KonvaRect
      x={0}
      y={0}
      width={object.width}
      height={object.height}
      rotation={object.rotation}
      opacity={object.opacity}
      fill={object.fill}
      stroke={object.stroke}
      strokeWidth={object.strokeWidth}
      cornerRadius={object.cornerRadius}
      listening={!object.locked}
    />
  );
}
