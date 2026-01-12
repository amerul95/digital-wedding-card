/**
 * Hook for snapping logic
 */

import { useMemo } from 'react';
import { CanvasObject, DESIGN_W, DESIGN_H } from '@/src/store/types';
import { getBounds, withinThreshold, snapValue } from '@/src/lib/geometry';

export interface SnapResult {
  x: number;
  y: number;
  width?: number;
  height?: number;
  guides: Array<{ x?: number; y?: number; type: 'vertical' | 'horizontal' }>;
}

const SNAP_THRESHOLD_SCREEN = 8; // pixels in screen space

export function useSnapping(
  objects: CanvasObject[],
  selectedIds: string[],
  scale: number
) {
  const snapThreshold = useMemo(() => SNAP_THRESHOLD_SCREEN / scale, [scale]);

  const snap = (
    x: number,
    y: number,
    width?: number,
    height?: number,
    excludeId?: string
  ): SnapResult => {
    const guides: Array<{ x?: number; y?: number; type: 'vertical' | 'horizontal' }> = [];
    let snappedX = x;
    let snappedY = y;
    let snappedWidth = width;
    let snappedHeight = height;

    // Artboard snapping
    // Left edge
    if (withinThreshold(x, 0, snapThreshold)) {
      snappedX = 0;
      guides.push({ x: 0, type: 'vertical' });
    }
    // Right edge
    if (width && withinThreshold(x + width, DESIGN_W, snapThreshold)) {
      snappedX = DESIGN_W - width;
      guides.push({ x: DESIGN_W, type: 'vertical' });
    }
    // Center X
    if (width && withinThreshold(x + width / 2, DESIGN_W / 2, snapThreshold)) {
      snappedX = DESIGN_W / 2 - width / 2;
      guides.push({ x: DESIGN_W / 2, type: 'vertical' });
    }
    // Top edge
    if (withinThreshold(y, 0, snapThreshold)) {
      snappedY = 0;
      guides.push({ y: 0, type: 'horizontal' });
    }
    // Bottom edge
    if (height && withinThreshold(y + height, DESIGN_H, snapThreshold)) {
      snappedY = DESIGN_H - height;
      guides.push({ y: DESIGN_H, type: 'horizontal' });
    }
    // Center Y
    if (height && withinThreshold(y + height / 2, DESIGN_H / 2, snapThreshold)) {
      snappedY = DESIGN_H / 2 - height / 2;
      guides.push({ y: DESIGN_H / 2, type: 'horizontal' });
    }

    // Object-to-object snapping (Phase 2)
    const otherObjects = objects.filter(
      (obj) => !selectedIds.includes(obj.id) && obj.id !== excludeId && !obj.hidden
    );

    for (const obj of otherObjects) {
      const bounds = getBounds(obj);
      
      // Snap to object edges and centers
      if (withinThreshold(x, bounds.left, snapThreshold)) {
        snappedX = bounds.left;
        guides.push({ x: bounds.left, type: 'vertical' });
      }
      if (width && withinThreshold(x + width, bounds.right, snapThreshold)) {
        snappedX = bounds.right - width;
        guides.push({ x: bounds.right, type: 'vertical' });
      }
      if (width && withinThreshold(x + width / 2, bounds.centerX, snapThreshold)) {
        snappedX = bounds.centerX - width / 2;
        guides.push({ x: bounds.centerX, type: 'vertical' });
      }
      if (withinThreshold(y, bounds.top, snapThreshold)) {
        snappedY = bounds.top;
        guides.push({ y: bounds.top, type: 'horizontal' });
      }
      if (height && withinThreshold(y + height, bounds.bottom, snapThreshold)) {
        snappedY = bounds.bottom - height;
        guides.push({ y: bounds.bottom, type: 'horizontal' });
      }
      if (height && withinThreshold(y + height / 2, bounds.centerY, snapThreshold)) {
        snappedY = bounds.centerY - height / 2;
        guides.push({ y: bounds.centerY, type: 'horizontal' });
      }
    }

    return {
      x: snappedX,
      y: snappedY,
      width: snappedWidth,
      height: snappedHeight,
      guides,
    };
  };

  return { snap, snapThreshold };
}
