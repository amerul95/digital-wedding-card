/**
 * Konva Circle component
 */

'use client';

import React from 'react';
import { Circle as KonvaCircle } from 'react-konva';
import { CircleObject } from '@/src/store/types';

interface KonvaCircleProps {
  object: CircleObject;
}

export function KonvaCircleComponent({ object }: KonvaCircleProps) {
  const radius = Math.min(object.width, object.height) / 2;
  return (
    <KonvaCircle
      x={object.width / 2}
      y={object.height / 2}
      radius={radius}
      rotation={object.rotation}
      opacity={object.opacity}
      fill={object.fill}
      stroke={object.stroke}
      strokeWidth={object.strokeWidth}
      listening={!object.locked}
    />
  );
}
