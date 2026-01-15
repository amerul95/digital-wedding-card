/**
 * Export utilities for PNG generation
 */

import Konva from 'konva';
import { Section, DESIGN_W, DESIGN_H, CanvasObject, ImageObject } from '@/lib/store/types';

/**
 * Export section as PNG
 */
export async function exportSectionPNG(
  section: Section,
  pixelRatio: number = 2,
  hideGuides: boolean = true
): Promise<Blob> {
  return new Promise(async (resolve, reject) => {
    try {
      const stage = new Konva.Stage({
        container: document.createElement('div'),
        width: DESIGN_W * pixelRatio,
        height: DESIGN_H * pixelRatio,
      });

      const layer = new Konva.Layer();
      stage.add(layer);

      // Background
      const bgRect = new Konva.Rect({
        x: 0,
        y: 0,
        width: DESIGN_W * pixelRatio,
        height: DESIGN_H * pixelRatio,
        fill: section.background.fill,
      });
      layer.add(bgRect);

      // Objects - handle async image loading
      const imagePromises: Promise<void>[] = [];
      section.objects.forEach((object) => {
        if (object.hidden) return;
        if (object.type === 'image') {
          imagePromises.push(
            new Promise<void>((resolveImg) => {
              renderObjectToLayer(layer, object, pixelRatio, resolveImg);
            })
          );
        } else {
          renderObjectToLayer(layer, object, pixelRatio);
        }
      });

      // Wait for all images to load
      await Promise.all(imagePromises);

      layer.draw();

      stage.toBlob({
        mimeType: 'image/png',
        quality: 1,
        pixelRatio: 1,
        callback: (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to export PNG'));
          }
          stage.destroy();
        },
      });
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Export section as print PNG with bleed
 */
export async function exportPrintPNG(
  section: Section,
  targetWidth: number,
  targetHeight: number,
  bleedPx: number,
  dpi: number = 300
): Promise<Blob> {
  return new Promise(async (resolve, reject) => {
    try {
    const finalWidth = targetWidth + bleedPx * 2;
    const finalHeight = targetHeight + bleedPx * 2;
    const scale = Math.min(targetWidth / DESIGN_W, targetHeight / DESIGN_H);

    const stage = new Konva.Stage({
      container: document.createElement('div'),
      width: finalWidth,
      height: finalHeight,
    });

    const layer = new Konva.Layer();
    stage.add(layer);

    // Background with bleed
    const bgRect = new Konva.Rect({
      x: 0,
      y: 0,
      width: finalWidth,
      height: finalHeight,
      fill: section.background.fill,
    });
    layer.add(bgRect);

    // Center the design
    const offsetX = (finalWidth - DESIGN_W * scale) / 2;
    const offsetY = (finalHeight - DESIGN_H * scale) / 2;

    const group = new Konva.Group({
      x: offsetX,
      y: offsetY,
      scaleX: scale,
      scaleY: scale,
    });

      // Objects - handle async image loading
      const imagePromises: Promise<void>[] = [];
      section.objects.forEach((object) => {
        if (object.hidden) return;
        if (object.type === 'image') {
          imagePromises.push(
            new Promise<void>((resolveImg) => {
              renderObjectToGroup(group, object, 1, resolveImg);
            })
          );
        } else {
          renderObjectToGroup(group, object, 1);
        }
      });

      // Wait for all images to load
      await Promise.all(imagePromises);

      layer.add(group);
      layer.draw();

      stage.toBlob({
        mimeType: 'image/png',
        quality: 1,
        pixelRatio: 1,
        callback: (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to export print PNG'));
          }
          stage.destroy();
        },
      });
    } catch (error) {
      reject(error);
    }
  });
}

function renderObjectToLayer(layer: Konva.Layer, object: CanvasObject, pixelRatio: number, onImageLoad?: () => void) {
  switch (object.type) {
    case 'rect': {
      const rectObj = object as any;
      const rect = new Konva.Rect({
        x: object.x * pixelRatio,
        y: object.y * pixelRatio,
        width: object.width * pixelRatio,
        height: object.height * pixelRatio,
        rotation: object.rotation,
        opacity: object.opacity,
        fill: rectObj.fill,
        stroke: rectObj.stroke,
        strokeWidth: rectObj.strokeWidth * pixelRatio,
        cornerRadius: rectObj.cornerRadius * pixelRatio,
      });
      layer.add(rect);
      break;
    }
    case 'circle': {
      const circleObj = object as any;
      const radius = Math.min(object.width, object.height) / 2;
      const circle = new Konva.Circle({
        x: (object.x + object.width / 2) * pixelRatio,
        y: (object.y + object.height / 2) * pixelRatio,
        radius: radius * pixelRatio,
        rotation: object.rotation,
        opacity: object.opacity,
        fill: circleObj.fill,
        stroke: circleObj.stroke,
        strokeWidth: circleObj.strokeWidth * pixelRatio,
      });
      layer.add(circle);
      break;
    }
    case 'text': {
      const textObj = object as any;
      const text = new Konva.Text({
        x: object.x * pixelRatio,
        y: object.y * pixelRatio,
        width: object.width * pixelRatio,
        height: object.height * pixelRatio,
        rotation: object.rotation,
        opacity: object.opacity,
        text: textObj.text,
        fontSize: textObj.fontSize * pixelRatio,
        fontFamily: textObj.fontFamily,
        fill: textObj.fill,
        align: textObj.align,
        lineHeight: textObj.lineHeight,
        letterSpacing: textObj.letterSpacing * pixelRatio,
        fontStyle: textObj.fontStyle || 'normal',
      });
      layer.add(text);
      break;
    }
    case 'image': {
      const imgObj = object as ImageObject;
      Konva.Image.fromURL(imgObj.src, (img) => {
        img.setAttrs({
          x: object.x * pixelRatio,
          y: object.y * pixelRatio,
          width: object.width * pixelRatio,
          height: object.height * pixelRatio,
          rotation: object.rotation,
          opacity: object.opacity,
        });
        layer.add(img);
        layer.draw();
        onImageLoad?.();
      });
      break;
    }
    case 'line': {
      const lineObj = object as any;
      const points = lineObj.points.map((p: number) => p * pixelRatio);
      const line = new Konva.Line({
        points: points,
        x: object.x * pixelRatio,
        y: object.y * pixelRatio,
        rotation: object.rotation,
        opacity: object.opacity,
        stroke: lineObj.stroke,
        strokeWidth: lineObj.strokeWidth * pixelRatio,
      });
      layer.add(line);
      break;
    }
  }
}

function renderObjectToGroup(group: Konva.Group, object: CanvasObject, scale: number, onImageLoad?: () => void) {
  switch (object.type) {
    case 'rect': {
      const rectObj = object as any;
      const rect = new Konva.Rect({
        x: object.x,
        y: object.y,
        width: object.width,
        height: object.height,
        rotation: object.rotation,
        opacity: object.opacity,
        fill: rectObj.fill,
        stroke: rectObj.stroke,
        strokeWidth: rectObj.strokeWidth,
        cornerRadius: rectObj.cornerRadius,
      });
      group.add(rect);
      break;
    }
    case 'circle': {
      const circleObj = object as any;
      const radius = Math.min(object.width, object.height) / 2;
      const circle = new Konva.Circle({
        x: object.x + object.width / 2,
        y: object.y + object.height / 2,
        radius: radius,
        rotation: object.rotation,
        opacity: object.opacity,
        fill: circleObj.fill,
        stroke: circleObj.stroke,
        strokeWidth: circleObj.strokeWidth,
      });
      group.add(circle);
      break;
    }
    case 'text': {
      const textObj = object as any;
      const text = new Konva.Text({
        x: object.x,
        y: object.y,
        width: object.width,
        height: object.height,
        rotation: object.rotation,
        opacity: object.opacity,
        text: textObj.text,
        fontSize: textObj.fontSize,
        fontFamily: textObj.fontFamily,
        fill: textObj.fill,
        align: textObj.align || 'left',
        lineHeight: textObj.lineHeight ?? 1,
        letterSpacing: textObj.letterSpacing ?? 0,
        fontStyle: textObj.fontStyle || 'normal',
        // Additional Konva Text properties
        wrap: textObj.wrap || 'word',
        ellipsis: textObj.ellipsis ?? false,
        padding: textObj.padding ?? 0,
        verticalAlign: textObj.verticalAlign || 'top',
        textDecoration: textObj.textDecoration || '',
        fontVariant: textObj.fontVariant || 'normal',
        direction: textObj.direction || 'inherit',
      });
      group.add(text);
      break;
    }
    case 'image': {
      const imgObj = object as ImageObject;
      Konva.Image.fromURL(imgObj.src, (img) => {
        img.setAttrs({
          x: object.x,
          y: object.y,
          width: object.width,
          height: object.height,
          rotation: object.rotation,
          opacity: object.opacity,
        });
        group.add(img);
        onImageLoad?.();
      });
      break;
    }
    case 'line': {
      const lineObj = object as any;
      const line = new Konva.Line({
        points: lineObj.points,
        x: object.x,
        y: object.y,
        rotation: object.rotation,
        opacity: object.opacity,
        stroke: lineObj.stroke,
        strokeWidth: lineObj.strokeWidth,
      });
      group.add(line);
      break;
    }
  }
}

/**
 * Download blob as file
 */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
