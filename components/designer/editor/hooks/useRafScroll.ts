/**
 * Optimized scroll handler using requestAnimationFrame throttling
 * 
 * Why rAF throttling:
 * - Scroll events fire at 60-120Hz, but we only need to check ~60fps max
 * - rAF aligns with browser's repaint cycle, preventing jank
 * - Avoids setTimeout/setInterval overhead
 * - Ensures we only process scroll when browser is ready to paint
 */

import { useEffect, useRef, useCallback } from 'react';

interface UseRafScrollOptions {
  onScroll: (scrollTop: number, container: HTMLElement) => void;
  enabled?: boolean;
}

export function useRafScroll(
  containerRef: React.RefObject<HTMLElement | null>,
  options: UseRafScrollOptions
) {
  const { onScroll, enabled = true } = options;
  const rafIdRef = useRef<number | null>(null);
  const lastScrollTopRef = useRef<number>(0);

  const handleScroll = useCallback(() => {
    if (!containerRef.current || !enabled) return;

    // Cancel previous rAF if still pending
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
    }

    // Schedule scroll processing for next frame
    rafIdRef.current = requestAnimationFrame(() => {
      const container = containerRef.current;
      if (!container) return;

      const scrollTop = container.scrollTop;
      
      // Only process if scroll position actually changed
      // This prevents unnecessary work when scroll event fires but position is same
      if (scrollTop !== lastScrollTopRef.current) {
        lastScrollTopRef.current = scrollTop;
        onScroll(scrollTop, container);
      }

      rafIdRef.current = null;
    });
  }, [containerRef, onScroll, enabled]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !enabled) return;

    // Use passive listener for better scroll performance
    // Passive listeners can't call preventDefault, but we don't need to
    container.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [containerRef, handleScroll, enabled]);
}
