/**
 * Section snapshot generation and caching
 * 
 * Why snapshots:
 * - Rendering live Konva for 10+ sections is expensive (10+ Stage instances)
 * - Static images are ~100x faster to render
 * - Snapshots only regenerate when section content changes (debounced)
 * - Non-active sections show instant preview without Konva overhead
 */

import Konva from 'konva';

// Cache of section snapshots (data URLs)
const snapshotCache = new Map<string, string>();

// Debounce snapshot generation to avoid regenerating on every edit
let snapshotDebounceTimers = new Map<string, NodeJS.Timeout>();

/**
 * Generate a low-res PNG snapshot of a Konva stage
 * Simplified version that's more reliable
 */
export async function generateSectionSnapshot(
  stage: Konva.Stage | null,
  width: number = 200,
  height: number = 356
): Promise<string | null> {
  if (!stage) return null;

  try {
    // Use the stage's current dimensions
    const stageWidth = stage.width();
    const stageHeight = stage.height();

    if (stageWidth === 0 || stageHeight === 0) return null;

    // Generate data URL directly from the stage
    // This is simpler and more reliable than cloning
    const dataURL = stage.toDataURL({
      pixelRatio: Math.min(width / stageWidth, height / stageHeight),
      mimeType: 'image/png',
      quality: 0.8,
    });

    return dataURL;
  } catch (error) {
    console.error('Failed to generate snapshot:', error);
    return null;
  }
}

/**
 * Schedule snapshot regeneration (debounced)
 * Call this when section content changes
 * 
 * This invalidates the cache, forcing regeneration on next view
 */
export function scheduleSnapshotRegeneration(sectionId: string) {
  // Clear existing timer
  const existingTimer = snapshotDebounceTimers.get(sectionId);
  if (existingTimer) {
    clearTimeout(existingTimer);
  }

  // Invalidate cache immediately (will be regenerated when section becomes visible)
  snapshotCache.delete(sectionId);

  // Clear the timer reference
  snapshotDebounceTimers.delete(sectionId);
}

/**
 * Clear snapshot cache (useful when project changes)
 */
export function clearSnapshotCache() {
  snapshotCache.clear();
  snapshotDebounceTimers.forEach((timer) => clearTimeout(timer));
  snapshotDebounceTimers.clear();
}

/**
 * Get cached snapshot synchronously (for immediate display)
 */
export function getCachedSnapshot(sectionId: string): string | null {
  return snapshotCache.get(sectionId) || null;
}

/**
 * Set snapshot in cache (called after generation)
 */
export function setSnapshot(sectionId: string, dataURL: string) {
  snapshotCache.set(sectionId, dataURL);
}
