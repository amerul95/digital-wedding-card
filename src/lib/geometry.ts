/**
 * Geometry utilities for snapping, alignment, etc.
 */

export interface Point {
  x: number;
  y: number;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Bounds {
  left: number;
  right: number;
  top: number;
  bottom: number;
  centerX: number;
  centerY: number;
}

/**
 * Get bounds from a rect
 */
export function getBounds(rect: Rect): Bounds {
  return {
    left: rect.x,
    right: rect.x + rect.width,
    top: rect.y,
    bottom: rect.y + rect.height,
    centerX: rect.x + rect.width / 2,
    centerY: rect.y + rect.height / 2,
  };
}

/**
 * Check if two values are within threshold
 */
export function withinThreshold(a: number, b: number, threshold: number): boolean {
  return Math.abs(a - b) <= threshold;
}

/**
 * Snap value to target if within threshold
 */
export function snapValue(value: number, target: number, threshold: number): number {
  if (withinThreshold(value, target, threshold)) {
    return target;
  }
  return value;
}

/**
 * Get distance between two points
 */
export function distance(p1: Point, p2: Point): number {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

/**
 * Clamp value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
