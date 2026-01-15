/**
 * Convert millimeters to pixels at a given DPI
 */
export function mmToPx(mm: number, dpi: number = 300): number {
  // 1 inch = 25.4 mm
  // pixels = (mm / 25.4) * dpi
  return (mm / 25.4) * dpi;
}

/**
 * Convert pixels to millimeters at a given DPI
 */
export function pxToMm(px: number, dpi: number = 300): number {
  return (px / dpi) * 25.4;
}
