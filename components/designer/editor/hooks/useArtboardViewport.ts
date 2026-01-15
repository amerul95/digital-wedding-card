/**
 * Hook to calculate artboard viewport scaling and positioning
 */

import { useEffect, useState } from 'react';
import { DESIGN_W, DESIGN_H } from '@/lib/store/types';

export interface ViewportInfo {
  viewportW: number;
  viewportH: number;
  scale: number;
  offsetX: number;
  offsetY: number;
  isMobile: boolean;
  mode: 'editor' | 'preview';
}

export function useArtboardViewport(mode: 'editor' | 'preview' = 'editor'): ViewportInfo {
  const [viewport, setViewport] = useState<ViewportInfo>({
    viewportW: typeof window !== 'undefined' ? window.innerWidth : 1920,
    viewportH: typeof window !== 'undefined' ? window.innerHeight : 1080,
    scale: 1,
    offsetX: 0,
    offsetY: 0,
    isMobile: false,
    mode,
  });

  useEffect(() => {
    function updateViewport() {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const isMobile = vw < 768;

      let scale: number;
      let offsetX: number;
      let offsetY: number;

      if (mode === 'editor') {
        // Editor: always scaleContain
        const scaleX = vw / DESIGN_W;
        const scaleY = vh / DESIGN_H;
        scale = Math.min(scaleX, scaleY);
        const scaledW = DESIGN_W * scale;
        const scaledH = DESIGN_H * scale;
        offsetX = (vw - scaledW) / 2;
        offsetY = (vh - scaledH) / 2;
      } else {
        // Preview mode
        if (isMobile) {
          // Mobile preview: scaleCover
          const scaleX = vw / DESIGN_W;
          const scaleY = vh / DESIGN_H;
          scale = Math.max(scaleX, scaleY);
          const scaledW = DESIGN_W * scale;
          const scaledH = DESIGN_H * scale;
          offsetX = (vw - scaledW) / 2;
          offsetY = (vh - scaledH) / 2;
        } else {
          // Desktop preview: scaleContain
          const scaleX = vw / DESIGN_W;
          const scaleY = vh / DESIGN_H;
          scale = Math.min(scaleX, scaleY);
          const scaledW = DESIGN_W * scale;
          const scaledH = DESIGN_H * scale;
          offsetX = (vw - scaledW) / 2;
          offsetY = (vh - scaledH) / 2;
        }
      }

      setViewport({
        viewportW: vw,
        viewportH: vh,
        scale,
        offsetX,
        offsetY,
        isMobile,
        mode,
      });
    }

    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, [mode]);

  return viewport;
}
