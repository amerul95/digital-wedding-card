/**
 * Calculates which section is currently most visible in viewport
 * 
 * Performance optimizations:
 * - Uses refs and DOM queries instead of React state
 * - Only calculates when needed (not on every scroll tick)
 * - Uses getBoundingClientRect once per section (cached by browser)
 * - Returns null if no section crosses threshold (avoids unnecessary updates)
 */

export interface SectionBounds {
  id: string;
  top: number;
  bottom: number;
  height: number;
  center: number;
}

export interface GetActiveSectionOptions {
  container: HTMLElement;
  sectionIds: string[];
  visibilityThreshold?: number; // Minimum % of section that must be visible (0-1)
  centerBias?: boolean; // Prefer sections closer to viewport center
}

export function getActiveSectionFromScroll(
  scrollTop: number,
  options: GetActiveSectionOptions
): string | null {
  const {
    container,
    sectionIds,
    visibilityThreshold = 0.3,
    centerBias = true,
  } = options;

  const containerRect = container.getBoundingClientRect();
  const viewportHeight = container.clientHeight;
  const viewportTop = scrollTop;
  const viewportBottom = scrollTop + viewportHeight;
  const viewportCenter = scrollTop + viewportHeight / 2;

  let bestSection: string | null = null;
  let bestScore = -Infinity;

  // Calculate bounds for each section
  // Using querySelector is fast (O(n) but n is small, typically < 20 sections)
  sectionIds.forEach((sectionId) => {
    const sectionElement = container.querySelector(
      `[data-section-id="${sectionId}"]`
    ) as HTMLElement | null;

    if (!sectionElement) return;

    // getBoundingClientRect is optimized by browser and cached
    const sectionRect = sectionElement.getBoundingClientRect();
    
    // Convert to container-relative coordinates
    const sectionTop = sectionRect.top - containerRect.top + scrollTop;
    const sectionBottom = sectionTop + sectionRect.height;
    const sectionCenter = (sectionTop + sectionBottom) / 2;
    const sectionHeight = sectionBottom - sectionTop;

    // Calculate visibility ratio
    const visibleTop = Math.max(viewportTop, sectionTop);
    const visibleBottom = Math.min(viewportBottom, sectionBottom);
    const visibleHeight = Math.max(0, visibleBottom - visibleTop);
    const visibilityRatio = sectionHeight > 0 ? visibleHeight / sectionHeight : 0;

    // Only consider sections that meet visibility threshold
    if (visibilityRatio >= visibilityThreshold) {
      let score = visibilityRatio * 100;

      // Bias towards sections closer to viewport center
      if (centerBias) {
        const distanceFromCenter = Math.abs(sectionCenter - viewportCenter);
        // Normalize distance (divide by viewport height to get 0-1 range)
        const normalizedDistance = distanceFromCenter / viewportHeight;
        // Subtract distance from score (closer = higher score)
        score -= normalizedDistance * 50;
      }

      if (score > bestScore) {
        bestScore = score;
        bestSection = sectionId;
      }
    }
  });

  return bestSection;
}
