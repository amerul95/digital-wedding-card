/**
 * Text editing overlay for double-click text editing
 * Based on KonvaJS official example pattern
 */

'use client';

import React, { useEffect, useRef } from 'react';
import type Konva from 'konva';
import { useProjectStore } from '@/src/store/projectStore';
import { TextObject } from '@/src/store/types';

interface TextEditOverlayProps {
  objectId: string;
  onClose: () => void;
  stageRef: React.RefObject<Konva.Stage | null>;
  workspaceScale: number;
}

export function TextEditOverlay({
  objectId,
  onClose,
  stageRef,
  workspaceScale,
}: TextEditOverlayProps) {
  const { project, currentSectionId, updateObject } = useProjectStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const currentSection = project?.sections.find((s) => s.id === currentSectionId);
  const object = currentSection?.objects.find(
    (o) => o.id === objectId
  ) as TextObject | undefined;

  useEffect(() => {
    if (!object || !textareaRef.current) return;

    const stage = stageRef.current;
    if (!stage) return;

    const group = stage.findOne(`#${objectId}`);
    if (!group) return;

    // Find the actual Konva Text node inside the group
    const textNode = group.findOne('Text') as Konva.Text | null;
    if (!textNode) return;

    const textarea = textareaRef.current;
    const textPosition = textNode.position();
    const stageBox = stage.container().getBoundingClientRect();
    
    // Get absolute scale from the text node (accounts for all parent transforms)
    const absoluteScale = textNode.getAbsoluteScale();
    const scaleX = absoluteScale.x;
    
    // Calculate position in screen coordinates
    const areaPosition = {
      x: stageBox.left + textPosition.x * scaleX,
      y: stageBox.top + textPosition.y * scaleX,
    };

    // Match styles with the text node (KonvaJS pattern)
    textarea.value = textNode.text();
    textarea.style.position = 'absolute';
    textarea.style.top = `${areaPosition.y}px`;
    textarea.style.left = `${areaPosition.x}px`;
    textarea.style.width = `${textNode.width() * scaleX}px`;
    textarea.style.height = `${textNode.height() * scaleX + 5}px`;
    textarea.style.fontSize = `${textNode.fontSize() * scaleX}px`;
    textarea.style.border = '2px solid #3b82f6';
    // Use Konva text padding if available
    const konvaPadding = textNode.padding() || 0;
    textarea.style.padding = `${konvaPadding * scaleX}px`;
    textarea.style.margin = '0px';
    textarea.style.overflow = 'hidden';
    textarea.style.background = 'rgba(255, 255, 255, 0.95)';
    textarea.style.outline = 'none';
    textarea.style.resize = 'none';
    textarea.style.lineHeight = `${textNode.lineHeight()}`;
    textarea.style.fontFamily = textNode.fontFamily();
    textarea.style.transformOrigin = 'left top';
    // During editing, always use left align for textarea to ensure all text is visible
    textarea.style.textAlign = 'left';
    textarea.style.color = textNode.fill();
    textarea.style.letterSpacing = `${textNode.letterSpacing() * scaleX}px`;
    
    // Handle font style
    const fontStyle = textNode.fontStyle();
    textarea.style.fontWeight = fontStyle.includes('bold') ? 'bold' : 'normal';
    textarea.style.fontStyle = fontStyle.includes('italic') ? 'italic' : 'normal';
    textarea.style.opacity = `${textNode.opacity()}`;
    
    // Handle text decoration (underline, line-through)
    const textDecoration = textNode.textDecoration() || '';
    if (textDecoration) {
      textarea.style.textDecoration = textDecoration;
    } else {
      textarea.style.textDecoration = 'none';
    }
    
    // Handle font variant (small-caps)
    const fontVariant = textNode.fontVariant() || 'normal';
    textarea.style.fontVariant = fontVariant;

    // Handle rotation
    const rotation = textNode.rotation();
    let transform = '';
    if (rotation) {
      transform += `rotateZ(${rotation}deg)`;
    }
    textarea.style.transform = transform;

    // Auto-resize height based on content (KonvaJS pattern)
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight + 3}px`;

    textarea.focus();
    textarea.select();

    const handleOutsideClick = (e: MouseEvent) => {
      if (e.target !== textarea) {
        handleTextChange(textarea.value);
        onClose();
      }
    };

    const handleTextChange = (newText: string) => {
      if (!currentSectionId || !object) return;
      updateObject(currentSectionId, objectId, { text: newText });
    };

    // Add event listeners
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleTextChange(textarea.value);
        onClose();
      }
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleInput = () => {
      // Dynamically resize textarea as user types (KonvaJS pattern)
      textarea.style.width = `${textNode.width() * scaleX}px`;
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight + textNode.fontSize() * scaleX}px`;
    };

    textarea.addEventListener('keydown', handleKeyDown);
    textarea.addEventListener('input', handleInput);
    setTimeout(() => {
      window.addEventListener('click', handleOutsideClick);
    });

    return () => {
      textarea.removeEventListener('keydown', handleKeyDown);
      textarea.removeEventListener('input', handleInput);
      window.removeEventListener('click', handleOutsideClick);
    };
  }, [object, objectId, stageRef, workspaceScale, currentSectionId, updateObject, onClose]);

  if (!object) return null;

  return (
    <textarea
      ref={textareaRef}
      style={{
        minHeight: '1em',
        position: 'absolute',
        zIndex: 50,
      }}
    />
  );
}
