/**
 * Konva Text component
 */

'use client';

import React from 'react';
import { Text as KonvaText } from 'react-konva';
import { TextObject } from '@/src/store/types';

interface KonvaTextProps {
  object: TextObject;
  onDoubleClick?: () => void;
}

export function KonvaTextComponent({ object, onDoubleClick }: KonvaTextProps) {
  const fontStyle = object.fontStyle || 'normal';
  const isBold = fontStyle.includes('bold');
  const isItalic = fontStyle.includes('italic');

  return (
    <KonvaText
      x={0}
      y={0}
      width={object.width}
      height={object.height}
      rotation={object.rotation}
      opacity={object.opacity}
      text={object.text}
      fontSize={object.fontSize}
      fontFamily={object.fontFamily}
      fontStyle={isBold && isItalic ? 'bold italic' : isBold ? 'bold' : isItalic ? 'italic' : 'normal'}
      fill={object.fill}
      align={object.align}
      lineHeight={object.lineHeight}
      letterSpacing={object.letterSpacing}
      listening={!object.locked}
      onDblClick={onDoubleClick}
    />
  );
}
