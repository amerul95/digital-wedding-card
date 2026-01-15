/**
 * Virtualized section renderer
 * 
 * Performance optimizations:
 * - Only renders active section + 1 before/after (3 total)
 * - Non-active sections show static snapshots instead of live Konva
 * - Prevents mounting/unmounting Konva Stages during scroll
 * - Reduces DOM nodes from N sections to max 3
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Group, Rect, Transformer } from 'react-konva';
import Konva from 'konva';
import { Section, DESIGN_W, DESIGN_H, CanvasObject } from '@/lib/store/types';
import { CanvasObjectRenderer } from './CanvasObjectRenderer';
import { getCachedSnapshot, generateSectionSnapshot, setSnapshot } from '../utils/sectionSnapshot';

interface SectionRendererProps {
  section: Section;
  isActive: boolean;
  isVisible: boolean; // Whether this section is in the virtualized viewport
  editScale: number;
  stageWidth: number;
  stageHeight: number;
  bleedPaddingScaled: number;
  bleedPx: number;
  safePadding: number;
  currentSectionId: string | null;
  selectedIds: string[];
  tool: string;
  editingTextId?: string | null;
  onSectionClick: (sectionId: string) => void;
  onObjectClick: (objectId: string) => void;
  onObjectDragMove?: (e: any, objectId: string, sectionId: string) => void;
  onObjectDragEnd: (e: any, objectId: string, sectionId: string) => void;
  onObjectTransform?: (e: any, objectId: string, sectionId: string) => void;
  onObjectTransformEnd: (e: any, objectId: string, sectionId: string) => void;
  onContextMenu: (e: any, objectId: string) => void;
  onTextEdit: (objectId: string) => void;
  onDoubleClick: (e: any, object: CanvasObject) => void;
  onCanvasClick?: (e: Konva.KonvaEventObject<MouseEvent>) => void;
  onCanvasMouseEnter?: () => void;
  stageRef?: React.RefObject<Konva.Stage | null>;
  transformerRef?: React.RefObject<Konva.Transformer | null>;
  artboardGroupRef?: React.RefObject<Konva.Group | null>;
}

export function SectionRenderer({
  section,
  isActive,
  isVisible,
  editScale,
  stageWidth,
  stageHeight,
  bleedPaddingScaled,
  bleedPx,
  safePadding,
  currentSectionId,
  selectedIds,
  tool,
  editingTextId,
  onSectionClick,
  onObjectClick,
  onObjectDragMove,
  onObjectDragEnd,
  onObjectTransform,
  onObjectTransformEnd,
  onContextMenu,
  onTextEdit,
  onDoubleClick,
  onCanvasClick,
  onCanvasMouseEnter,
  stageRef,
  transformerRef,
  artboardGroupRef,
}: SectionRendererProps) {
  const [snapshotUrl, setSnapshotUrl] = useState<string | null>(null);
  const snapshotStageRef = useRef<Konva.Stage | null>(null);
  const snapshotGenerationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load cached snapshot for non-active sections
  useEffect(() => {
    if (!isActive && isVisible) {
      // Try cached first
      const cached = getCachedSnapshot(section.id);
      if (cached) {
        setSnapshotUrl(cached);
      } else {
        // Schedule snapshot generation after a short delay to ensure stage is rendered
        snapshotGenerationTimeoutRef.current = setTimeout(() => {
          if (snapshotStageRef.current && !isActive) {
            generateSectionSnapshot(snapshotStageRef.current, 200, 356)
              .then((snapshot) => {
                if (snapshot) {
                  setSnapshot(section.id, snapshot);
                  setSnapshotUrl(snapshot);
                }
              })
              .catch(() => {
                // Ignore errors - will show live Konva as fallback
              });
          }
        }, 100);
      }
    } else {
      setSnapshotUrl(null);
      if (snapshotGenerationTimeoutRef.current) {
        clearTimeout(snapshotGenerationTimeoutRef.current);
      }
    }

    return () => {
      if (snapshotGenerationTimeoutRef.current) {
        clearTimeout(snapshotGenerationTimeoutRef.current);
      }
    };
  }, [section.id, isActive, isVisible]);

  // If not visible, don't render at all (virtualization)
  // Return placeholder div to maintain scroll position
  if (!isVisible) {
    return (
      <div
        data-section-id={section.id}
        className="shrink-0 relative"
        style={{
          width: stageWidth,
          height: stageHeight,
          border: '2px solid transparent',
          borderRadius: '8px',
        }}
      >
        <div className="w-full h-full bg-zinc-100" />
      </div>
    );
  }

  // For non-active sections with snapshot, show static image
  if (!isActive && snapshotUrl) {
    return (
      <div
        data-section-id={section.id}
        className="shrink-0 relative cursor-pointer"
        style={{
          width: stageWidth,
          height: stageHeight,
          border: '2px solid transparent',
          borderRadius: '8px',
        }}
        onClick={() => onSectionClick(section.id)}
      >
        <img
          src={snapshotUrl}
          alt={`Section ${section.name}`}
          className="w-full h-full object-contain"
          style={{ imageRendering: 'auto' }}
        />
      </div>
    );
  }

  // Active section or section without snapshot: render live Konva
  // For non-active sections without snapshot, render minimal Konva (no interactivity)
  return (
    <div
      data-section-id={section.id}
      className="shrink-0 relative"
      style={{
        width: stageWidth,
        height: stageHeight,
        border: isActive ? '2px solid #3b82f6' : '2px solid transparent',
        borderRadius: '8px',
        transition: 'border-color 0.3s ease',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget || (e.target as HTMLElement).tagName === 'DIV') {
          onSectionClick(section.id);
        }
      }}
    >
      <Stage
        ref={isActive ? stageRef : snapshotStageRef}
        width={stageWidth}
        height={stageHeight}
        onContextMenu={(e) => {
          // Prevent right-click context menu from creating objects
          e.evt.preventDefault();
        }}
        onMouseEnter={(e) => {
          // Auto-switch to select tool when mouse enters canvas (Canva pattern)
          if (isActive && onCanvasMouseEnter) {
            onCanvasMouseEnter();
          }
        }}
        onClick={(e) => {
          const stage = e.target.getStage();
          const target = e.target;
          
          // Check if we clicked on the stage itself (empty space)
          const clickedOnStage = target === stage;
          
          // Check if we clicked on the Layer
          const clickedOnLayer = target.getType() === 'Layer';
          
          // Check if we clicked on the background Rect
          const clickedOnBackground = target.getType() === 'Rect' && target.name() === 'background';
          
          // Check if we clicked on the Transformer
          const clickedOnTransformer = target.getType() === 'Transformer' || 
            (target.getParent() && target.getParent().getType() === 'Transformer');
          
          // Check if we clicked on any object (Group with id, or child elements like Rect, Text, Circle, etc.)
          // If target has a parent Group with an id, it's part of an object
          let clickedOnObject = false;
          if (target.getType() === 'Group' && target.id() !== '') {
            clickedOnObject = true;
          } else {
            // Check if target is a child of an object Group
            let parent = target.getParent();
            while (parent) {
              if (parent.getType() === 'Group' && parent.id() !== '') {
                clickedOnObject = true;
                break;
              }
              if (parent.getType() === 'Transformer') {
                clickedOnObject = true;
                break;
              }
              if (parent === stage) break; // Reached stage, stop checking
              parent = parent.getParent();
            }
          }
          
          // Also check if we're currently dragging - if so, don't create objects
          // This prevents creating objects when clicking to start a drag
          
          // Only trigger canvas click if we clicked on truly empty space (stage, layer, or background)
          // and NOT on any object or transformer
          // Also check it's a left click (not right click)
          const isLeftClick = e.evt.button === 0 || e.evt.button === undefined;
          if ((clickedOnStage || clickedOnLayer || clickedOnBackground) && !clickedOnObject && !clickedOnTransformer && isLeftClick) {
            if (isActive && onCanvasClick) {
              // Only call canvas click handler if we clicked on empty stage
              // and we're not currently dragging
              onCanvasClick(e);
            } else if (!isActive) {
              // Switch to this section if clicking on non-active section
              onSectionClick(section.id);
            }
          }
        }}
        // Disable all mouse events for non-active sections (performance)
        onMouseDown={isActive ? undefined : undefined}
        onMouseMove={isActive ? undefined : undefined}
        onMouseUp={isActive ? undefined : undefined}
        // Disable listening for non-active sections to prevent event processing
        listening={isActive}
      >
        <Layer listening={isActive}>
          <Group
            ref={isActive ? artboardGroupRef : undefined}
            x={isActive ? bleedPaddingScaled : 0}
            y={isActive ? bleedPaddingScaled : 0}
            scaleX={editScale}
            scaleY={editScale}
            listening={isActive}
          >
            {/* Background */}
            <Rect
              name="background"
              x={0}
              y={0}
              width={DESIGN_W}
              height={DESIGN_H}
              fill={section.background.fill}
              listening={false}
            />

            {/* Bleed guides - only for active section */}
            {isActive && (
              <>
                <Rect
                  x={-bleedPx}
                  y={-bleedPx}
                  width={DESIGN_W + bleedPx * 2}
                  height={DESIGN_H + bleedPx * 2}
                  stroke="#ff0000"
                  strokeWidth={1 / editScale}
                  dash={[5, 5]}
                  listening={false}
                />
                <Rect
                  x={safePadding}
                  y={safePadding}
                  width={DESIGN_W - safePadding * 2}
                  height={DESIGN_H - safePadding * 2}
                  stroke="#00ff00"
                  strokeWidth={1 / editScale}
                  dash={[5, 5]}
                  listening={false}
                />
              </>
            )}

            {/* Objects */}
            {section.objects.map((object) => {
              // Hide text object when it's being edited (to prevent duplicate display)
              const isEditing = object.type === 'text' && object.id === editingTextId;
              
              return (
              <Group
                key={object.id}
                id={object.id}
                x={object.x}
                y={object.y}
                width={object.width}
                height={object.height}
                rotation={object.rotation}
                opacity={isEditing ? 0 : object.opacity}
                draggable={!object.locked && isActive}
                onDragMove={(e) => {
                  // Real-time drag with snapping (polotno pattern)
                  if (isActive && onObjectDragMove) {
                    onObjectDragMove(e, object.id, section.id);
                  }
                }}
                onDragEnd={(e) => {
                  // Simple Konva.js pattern: just call handler on drag end
                  if (isActive) {
                    onObjectDragEnd(e, object.id, section.id);
                  }
                }}
                onTransform={(e) => {
                  // Real-time transform with snapping (polotno pattern)
                  if (isActive && onObjectTransform) {
                    onObjectTransform(e, object.id, section.id);
                  }
                }}
                onTransformEnd={(e) => {
                  if (isActive) {
                    onObjectTransformEnd(e, object.id, section.id);
                  }
                }}
                onClick={(e) => {
                  if (isActive) {
                    // Prevent event from bubbling to stage
                    e.cancelBubble = true;
                    onObjectClick(object.id, e);
                  } else {
                    onSectionClick(section.id);
                  }
                }}
                onContextMenu={(e) => {
                  if (isActive) {
                    e.evt.preventDefault();
                    onContextMenu(e, object.id);
                  }
                }}
                onDblClick={(e) => {
                  if (object.type === 'text' && isActive) {
                    e.evt.preventDefault();
                    onTextEdit(object.id);
                  }
                }}
                listening={isActive}
              >
                <CanvasObjectRenderer
                  object={object}
                  onDoubleClick={onTextEdit}
                />
              </Group>
              );
            })}

            {/* Transformer - only for active section */}
            {isActive && transformerRef && (
              <Transformer
                ref={transformerRef}
                boundBoxFunc={(oldBox, newBox) => {
                  // Polotno pattern: prevent objects from becoming too small
                  if (Math.abs(newBox.width) < 10 || Math.abs(newBox.height) < 10) {
                    return oldBox;
                  }
                  return newBox;
                }}
                // Polotno pattern: enable rotation and better handles
                rotateEnabled={true}
                enabledAnchors={[
                  'top-left',
                  'top-center',
                  'top-right',
                  'middle-right',
                  'bottom-right',
                  'bottom-center',
                  'bottom-left',
                  'middle-left',
                ]}
                // Better visual appearance
                borderEnabled={true}
                borderStroke="#3b82f6"
                borderStrokeWidth={2}
                anchorFill="#ffffff"
                anchorStroke="#3b82f6"
                anchorStrokeWidth={2}
                anchorSize={8}
                // Keep aspect ratio with shift key (handled by Konva)
                keepRatio={false}
              />
            )}
          </Group>
        </Layer>
      </Stage>
    </div>
  );
}
