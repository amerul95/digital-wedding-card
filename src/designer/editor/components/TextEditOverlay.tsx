/**
 * Text editing overlay for double-click text editing
 */

'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useProjectStore } from '@/src/store/projectStore';
import { TextObject } from '@/src/store/types';

interface TextEditOverlayProps {
  objectId: string;
  onClose: () => void;
}

export function TextEditOverlay({ objectId, onClose }: TextEditOverlayProps) {
  const { project, currentSectionId, updateObject } = useProjectStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const currentSection = project?.sections.find((s) => s.id === currentSectionId);
  const object = currentSection?.objects.find(
    (o) => o.id === objectId
  ) as TextObject | undefined;

  useEffect(() => {
    if (!object || !textareaRef.current) return;

    // Find the Konva stage and text node
    const stage = document.querySelector('canvas')?.closest('.konvajs-content');
    if (!stage) return;

    const stageElement = stage as HTMLElement;
    const stageRect = stageElement.getBoundingClientRect();

    // Calculate position in screen coordinates
    // This is a simplified version - in production, you'd get the actual Konva node position
    const scale = 1; // Get from viewport
    const offsetX = 0; // Get from viewport
    const offsetY = 0; // Get from viewport

    const screenX = stageRect.left + object.x * scale + offsetX;
    const screenY = stageRect.top + object.y * scale + offsetY;
    const screenWidth = object.width * scale;
    const screenHeight = object.height * scale;

    setPosition({
      x: screenX,
      y: screenY,
      width: screenWidth,
      height: screenHeight,
    });

    // Focus and select text
    setTimeout(() => {
      textareaRef.current?.focus();
      textareaRef.current?.select();
    }, 0);
  }, [object]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!currentSectionId || !object) return;
    updateObject(currentSectionId, objectId, { text: e.target.value });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleBlur();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleBlur = () => {
    onClose();
  };

  if (!object) return null;

  // Mirror font styles
  const fontStyle = object.fontStyle || 'normal';
  const isBold = fontStyle.includes('bold');
  const isItalic = fontStyle.includes('italic');

  return (
    <div
      className="fixed z-50 pointer-events-none"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${position.width}px`,
        height: `${position.height}px`,
      }}
    >
      <textarea
        ref={textareaRef}
        value={object.text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        className="w-full h-full resize-none border-2 border-blue-500 outline-none p-2 pointer-events-auto"
        style={{
          fontFamily: object.fontFamily,
          fontSize: `${object.fontSize}px`,
          color: object.fill,
          textAlign: object.align,
          lineHeight: object.lineHeight,
          letterSpacing: `${object.letterSpacing}px`,
          fontWeight: isBold ? 'bold' : 'normal',
          fontStyle: isItalic ? 'italic' : 'normal',
          opacity: object.opacity,
        }}
      />
    </div>
  );
}
