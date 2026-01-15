/**
 * Thumbnail preview component for sections
 */

'use client';

import React, { useEffect, useRef } from 'react';
import { Stage, Layer, Group, Rect } from 'react-konva';
import { CanvasObjectRenderer } from '../canvas/CanvasObjectRenderer';
import { DESIGN_W, DESIGN_H, Section } from '@/lib/store/types';

interface SectionThumbnailProps {
  section: Section;
  width: number;
  height: number;
}

export function SectionThumbnail({ section, width, height }: SectionThumbnailProps) {
  const scale = Math.min(width / DESIGN_W, height / DESIGN_H);
  const scaledWidth = DESIGN_W * scale;
  const scaledHeight = DESIGN_H * scale;
  const offsetX = (width - scaledWidth) / 2;
  const offsetY = (height - scaledHeight) / 2;

  return (
    <Stage width={width} height={height}>
      <Layer>
        <Group
          x={offsetX}
          y={offsetY}
          scaleX={scale}
          scaleY={scale}
        >
          {/* Background */}
          <Rect
            x={0}
            y={0}
            width={DESIGN_W}
            height={DESIGN_H}
            fill={section.background.fill}
          />
          {/* Objects */}
          {section.objects.map((object) => (
            <Group
              key={object.id}
              x={object.x}
              y={object.y}
              width={object.width}
              height={object.height}
              rotation={object.rotation}
              opacity={object.opacity}
            >
              <CanvasObjectRenderer object={object} />
            </Group>
          ))}
        </Group>
      </Layer>
    </Stage>
  );
}
