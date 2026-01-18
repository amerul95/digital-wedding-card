/**
 * Thumbnail Generation Utility
 * 
 * Generates thumbnails by filtering out door widgets and rendering only the first section.
 * Used for catalog card previews.
 */

import html2canvas from 'html2canvas';
import { EditorNode } from '@/components/editor/store';

export interface ThumbnailGenerationOptions {
  nodes: Record<string, EditorNode>;
  rootId: string;
  width?: number; // Thumbnail width in pixels
  height?: number; // Thumbnail height in pixels
}

/**
 * Generates a thumbnail image of the first section (excluding door)
 * Returns a data URL (base64) that can be stored in the database
 */
export const generateThumbnail = async (
  options: ThumbnailGenerationOptions
): Promise<string | null> => {
  const { nodes, rootId, width = 375, height = 667 } = options;

  try {
    // Find root node
    const rootNode = nodes[rootId];
    if (!rootNode) {
      console.warn('[Thumbnail] Root node not found');
      return null;
    }

    // Find first section (excluding door)
    const firstSectionId = rootNode.children.find((childId) => {
      const child = nodes[childId];
      return child && child.type === 'section';
    });

    if (!firstSectionId) {
      console.warn('[Thumbnail] No section found to generate thumbnail');
      return null;
    }

    // Create a temporary container for rendering
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.width = `${width}px`;
    tempContainer.style.height = `${height}px`;
    tempContainer.style.overflow = 'hidden';
    tempContainer.style.backgroundColor = '#ffffff';
    document.body.appendChild(tempContainer);

    // We'll need to render the section component here
    // For now, we'll create a simpler approach: render a hidden preview container
    // and capture it. This requires the actual React component rendering.
    
    // Cleanup
    document.body.removeChild(tempContainer);

    // For now, return null - we'll implement the actual rendering in the component
    // where we have access to React components
    return null;
  } catch (error) {
    console.error('[Thumbnail] Error generating thumbnail:', error);
    return null;
  }
};

/**
 * Generates thumbnail from an existing DOM element
 * This is the preferred method - capture a rendered element
 */
export const generateThumbnailFromElement = async (
  element: HTMLElement,
  options?: {
    width?: number;
    height?: number;
    scale?: number;
  }
): Promise<string | null> => {
  const { width = 375, height = 667, scale = 1 } = options || {};

  try {
    const canvas = await html2canvas(element, {
      width,
      height,
      scale,
      backgroundColor: '#ffffff',
      useCORS: true,
      logging: false,
    });

    return canvas.toDataURL('image/png', 0.9);
  } catch (error) {
    console.error('[Thumbnail] Error generating thumbnail from element:', error);
    return null;
  }
};
