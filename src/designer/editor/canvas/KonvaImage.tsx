/**
 * Konva Image component
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Image as KonvaImage } from 'react-konva';
import { ImageObject } from '@/src/store/types';

interface KonvaImageProps {
  object: ImageObject;
}

export function KonvaImageComponent({ object }: KonvaImageProps) {
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.src = object.src;
    img.onload = () => setImage(img);
    img.onerror = () => setImage(null);
  }, [object.src]);

  if (!image) {
    return null;
  }

  let displayWidth = object.width;
  let displayHeight = object.height;
  let x = object.x;
  let y = object.y;

  if (object.fit === 'cover') {
    const imageAspect = image.width / image.height;
    const objectAspect = object.width / object.height;
    
    if (imageAspect > objectAspect) {
      displayHeight = object.height;
      displayWidth = imageAspect * displayHeight;
      x = object.x - (displayWidth - object.width) / 2;
    } else {
      displayWidth = object.width;
      displayHeight = displayWidth / imageAspect;
      y = object.y - (displayHeight - object.height) / 2;
    }
  } else {
    // contain
    const imageAspect = image.width / image.height;
    const objectAspect = object.width / object.height;
    
    if (imageAspect > objectAspect) {
      displayWidth = object.width;
      displayHeight = displayWidth / imageAspect;
      y = object.y + (object.height - displayHeight) / 2;
    } else {
      displayHeight = object.height;
      displayWidth = imageAspect * displayHeight;
      x = object.x + (object.width - displayWidth) / 2;
    }
  }

  return (
    <KonvaImage
      image={image}
      x={x}
      y={y}
      width={displayWidth}
      height={displayHeight}
      rotation={object.rotation}
      opacity={object.opacity}
      listening={!object.locked}
    />
  );
}
