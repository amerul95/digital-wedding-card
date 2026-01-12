/**
 * Renders canvas objects based on type
 */

'use client';

import React from 'react';
import { CanvasObject } from '@/src/store/types';
import { KonvaTextComponent } from './KonvaText';
import { KonvaRectComponent } from './KonvaRect';
import { KonvaCircleComponent } from './KonvaCircle';
import { KonvaLineComponent } from './KonvaLine';
import { KonvaImageComponent } from './KonvaImage';

interface CanvasObjectRendererProps {
  object: CanvasObject;
  onDoubleClick?: (objectId: string) => void;
}

export function CanvasObjectRenderer({
  object,
  onDoubleClick,
}: CanvasObjectRendererProps) {
  if (object.hidden) {
    return null;
  }

  switch (object.type) {
    case 'text':
      return (
        <KonvaTextComponent
          object={object}
          onDoubleClick={() => onDoubleClick?.(object.id)}
        />
      );
    case 'rect':
      return <KonvaRectComponent object={object} />;
    case 'circle':
      return <KonvaCircleComponent object={object} />;
    case 'line':
      return <KonvaLineComponent object={object} />;
    case 'image':
      return <KonvaImageComponent object={object} />;
    case 'group':
      // Group rendering - render children with relative positioning
      return (
        <React.Fragment>
          {object.children.map((child) => (
            <CanvasObjectRenderer
              key={child.id}
              object={child}
              onDoubleClick={onDoubleClick}
            />
          ))}
        </React.Fragment>
      );
    default:
      return null;
  }
}
