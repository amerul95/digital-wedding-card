/**
 * Main editor canvas component
 */

'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Group, Rect, Transformer } from 'react-konva';
import Konva from 'konva';
import { useProjectStore } from '@/src/store/projectStore';
import { useArtboardViewport } from '../hooks/useArtboardViewport';
import { useSnapping } from '../hooks/useSnapping';
import { CanvasObjectRenderer } from './CanvasObjectRenderer';
import { DESIGN_W, DESIGN_H, CanvasObject } from '@/src/store/types';
import { clamp } from '@/src/lib/geometry';

interface EditorCanvasProps {
  onTextEdit: (objectId: string) => void;
}

export function EditorCanvas({ onTextEdit }: EditorCanvasProps) {
  const stageRef = useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const artboardGroupRef = useRef<Konva.Group>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const {
    project,
    currentSectionId,
    selectedIds,
    tool,
    setSelectedIds,
    updateObject,
    addObject,
  } = useProjectStore();

  const viewport = useArtboardViewport('editor');
  const currentSection = project?.sections.find((s) => s.id === currentSectionId);
  const objects = currentSection?.objects || [];

  const { snap } = useSnapping(objects, selectedIds, viewport.scale * zoom);

  // Update transformer when selection changes
  useEffect(() => {
    if (!transformerRef.current || !artboardGroupRef.current) return;

    const transformer = transformerRef.current;
    const stage = transformer.getStage();
    if (!stage) return;

    const selectedNodes = selectedIds
      .map((id) => {
        const node = artboardGroupRef.current?.findOne(`#${id}`);
        return node;
      })
      .filter(Boolean) as Konva.Node[];

    if (selectedNodes.length > 0) {
      transformer.nodes(selectedNodes);
      transformer.getLayer()?.batchDraw();
    } else {
      transformer.nodes([]);
    }
  }, [selectedIds, objects]);

  // Handle stage click
  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedIds([]);
    }
  };

  // Handle object click
  const handleObjectClick = (
    e: Konva.KonvaEventObject<MouseEvent>,
    objectId: string
  ) => {
    e.cancelBubble = true;
    const isShiftPressed = e.evt.shiftKey;

    if (isShiftPressed) {
      setSelectedIds(
        selectedIds.includes(objectId)
          ? selectedIds.filter((id) => id !== objectId)
          : [...selectedIds, objectId]
      );
    } else {
      setSelectedIds([objectId]);
    }
  };

  // Handle right-click for context menu
  const handleContextMenu = (e: Konva.KonvaEventObject<PointerEvent>, objectId: string) => {
    e.evt.preventDefault();
    if (!selectedIds.includes(objectId)) {
      setSelectedIds([objectId]);
    }
    // Context menu will be handled by the parent component
  };

  // Handle drag start
  const handleDragStart = (e: Konva.KonvaEventObject<DragEvent>, objectId: string) => {
    setIsDragging(true);
    const node = e.target as Konva.Node;
    setDragStart({ x: node.x(), y: node.y() });
  };

  // Handle drag end with snapping
  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>, objectId: string) => {
    if (!currentSectionId) return;
    setIsDragging(false);

    const node = e.target as Konva.Node;
    let newX = node.x();
    let newY = node.y();

    const obj = objects.find((o) => o.id === objectId);
    if (obj) {
      const snapResult = snap(newX, newY, obj.width, obj.height, objectId);
      newX = snapResult.x;
      newY = snapResult.y;

      updateObject(currentSectionId, objectId, { x: newX, y: newY });
      node.position({ x: newX, y: newY });
    }
  };

  // Handle transform end
  const handleTransformEnd = (e: Konva.KonvaEventObject<Event>, objectId: string) => {
    if (!currentSectionId) return;

    const node = e.target as Konva.Node;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    const newWidth = Math.max(10, node.width() * scaleX);
    const newHeight = Math.max(10, node.height() * scaleY);

    node.scaleX(1);
    node.scaleY(1);

    const snapResult = snap(node.x(), node.y(), newWidth, newHeight, objectId);
    
    updateObject(currentSectionId, objectId, {
      x: snapResult.x,
      y: snapResult.y,
      width: newWidth,
      height: newHeight,
      rotation: node.rotation(),
    });

    node.width(newWidth);
    node.height(newHeight);
    node.position({ x: snapResult.x, y: snapResult.y });
  };

  // Handle canvas click for tools
  const handleCanvasClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (tool === 'select' || !currentSectionId) return;

    const stage = e.target.getStage();
    if (!stage) return;

    const pointerPos = stage.getPointerPosition();
    if (!pointerPos) return;

    // Convert screen coordinates to design coordinates
    const x = (pointerPos.x - viewport.offsetX) / (viewport.scale * zoom);
    const y = (pointerPos.y - viewport.offsetY) / (viewport.scale * zoom);

    if (tool === 'text') {
      const id = addObject(currentSectionId, {
        type: 'text',
        text: 'Double click to edit',
        x: clamp(x - 100, 0, DESIGN_W - 200),
        y: clamp(y - 20, 0, DESIGN_H - 40),
        width: 200,
        height: 40,
        rotation: 0,
        opacity: 1,
        locked: false,
        hidden: false,
        fontFamily: 'Arial',
        fontSize: 24,
        fill: '#000000',
        align: 'left',
        lineHeight: 1.2,
        letterSpacing: 0,
        fontStyle: 'normal',
      });
      setSelectedIds([id]);
    } else if (tool === 'rect') {
      const id = addObject(currentSectionId, {
        type: 'rect',
        x: clamp(x - 50, 0, DESIGN_W - 100),
        y: clamp(y - 50, 0, DESIGN_H - 100),
        width: 100,
        height: 100,
        rotation: 0,
        opacity: 1,
        locked: false,
        hidden: false,
        fill: '#3b82f6',
        stroke: '#000000',
        strokeWidth: 0,
        cornerRadius: 0,
      });
      setSelectedIds([id]);
    } else if (tool === 'circle') {
      const id = addObject(currentSectionId, {
        type: 'circle',
        x: clamp(x - 50, 0, DESIGN_W - 100),
        y: clamp(y - 50, 0, DESIGN_H - 100),
        width: 100,
        height: 100,
        rotation: 0,
        opacity: 1,
        locked: false,
        hidden: false,
        fill: '#3b82f6',
        stroke: '#000000',
        strokeWidth: 0,
      });
      setSelectedIds([id]);
    } else if (tool === 'line') {
      const id = addObject(currentSectionId, {
        type: 'line',
        x: clamp(x - 50, 0, DESIGN_W - 100),
        y: clamp(y, 0, DESIGN_H),
        width: 100,
        height: 0,
        rotation: 0,
        opacity: 1,
        locked: false,
        hidden: false,
        points: [0, 0, 100, 0],
        stroke: '#000000',
        strokeWidth: 2,
      });
      setSelectedIds([id]);
    }
  };

  // Pan with spacebar + drag
  const handleStageMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.evt.button !== 0) return;
    const isSpacePressed = e.evt.code === 'Space' || e.evt.key === ' ';
    
    if (isSpacePressed || e.evt.ctrlKey || e.evt.metaKey) {
      setIsPanning(true);
      const stage = e.target.getStage();
      if (stage) {
        setPanStart({ x: stage.x(), y: stage.y() });
      }
    }
  };

  const handleStageMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (isPanning && stageRef.current) {
      const stage = stageRef.current;
      const pointerPos = stage.getPointerPosition();
      if (pointerPos) {
        const dx = pointerPos.x - panStart.x;
        const dy = pointerPos.y - panStart.y;
        stage.position({ x: dx, y: dy });
      }
    }
  };

  const handleStageMouseUp = () => {
    setIsPanning(false);
  };

  // Zoom with mouse wheel
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const handleWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();

      const scaleBy = 1.1;
      const oldScale = zoom;
      const pointer = stage.getPointerPosition();
      if (!pointer) return;

      const mousePointTo = {
        x: (pointer.x - viewport.offsetX) / oldScale,
        y: (pointer.y - viewport.offsetY) / oldScale,
      };

      const newScale = e.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
      const clampedScale = clamp(newScale, 0.1, 5);
      setZoom(clampedScale);
    };

    const container = stage.container();
    container.addEventListener('wheel', handleWheel);
    return () => container.removeEventListener('wheel', handleWheel);
  }, [zoom, viewport]);

  if (!currentSection) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-500">
        No section selected
      </div>
    );
  }

  const bleedPx = (project?.settings.bleedMm || 3) * 3.779527559; // 3mm to px at 72dpi
  const safePadding = project?.settings.safePaddingPx || 20;

  return (
    <div className="w-full h-full relative bg-gray-100">
      <Stage
        ref={stageRef}
        width={viewport.viewportW}
        height={viewport.viewportH}
        onClick={handleStageClick}
        onMouseDown={handleStageMouseDown}
        onMouseMove={handleStageMouseMove}
        onMouseUp={handleStageMouseUp}
      >
        <Layer>
          {/* Artboard Group */}
          <Group
            ref={artboardGroupRef}
            x={viewport.offsetX}
            y={viewport.offsetY}
            scaleX={viewport.scale * zoom}
            scaleY={viewport.scale * zoom}
            onClick={handleCanvasClick}
          >
            {/* Background */}
            <Rect
              x={0}
              y={0}
              width={DESIGN_W}
              height={DESIGN_H}
              fill={currentSection.background.fill}
            />

            {/* Bleed guides */}
            <Rect
              x={-bleedPx}
              y={-bleedPx}
              width={DESIGN_W + bleedPx * 2}
              height={DESIGN_H + bleedPx * 2}
              stroke="#ff0000"
              strokeWidth={1 / (viewport.scale * zoom)}
              dash={[5, 5]}
              listening={false}
            />

            {/* Safe zone guides */}
            <Rect
              x={safePadding}
              y={safePadding}
              width={DESIGN_W - safePadding * 2}
              height={DESIGN_H - safePadding * 2}
              stroke="#00ff00"
              strokeWidth={1 / (viewport.scale * zoom)}
              dash={[5, 5]}
              listening={false}
            />

            {/* Objects */}
            {objects.map((object) => {
              const ObjectComponent = () => (
                <CanvasObjectRenderer
                  object={object}
                  onDoubleClick={onTextEdit}
                />
              );

              return (
                <Group
                  key={object.id}
                  id={object.id}
                  draggable={!object.locked && tool === 'select'}
                  onDragStart={(e) => handleDragStart(e, object.id)}
                  onDragEnd={(e) => handleDragEnd(e, object.id)}
                  onTransformEnd={(e) => handleTransformEnd(e, object.id)}
                  onClick={(e) => handleObjectClick(e, object.id)}
                  onContextMenu={(e) => handleContextMenu(e, object.id)}
                  onDblClick={(e) => {
                    if (object.type === 'text') {
                      onTextEdit(object.id);
                    }
                  }}
                >
                  <ObjectComponent />
                </Group>
              );
            })}

            {/* Transformer */}
            <Transformer
              ref={transformerRef}
              boundBoxFunc={(oldBox, newBox) => {
                if (Math.abs(newBox.width) < 10 || Math.abs(newBox.height) < 10) {
                  return oldBox;
                }
                return newBox;
              }}
            />
          </Group>
        </Layer>
      </Stage>
    </div>
  );
}
