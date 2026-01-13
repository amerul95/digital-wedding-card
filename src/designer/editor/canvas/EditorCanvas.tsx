/**
 * Main editor canvas component with virtualization
 * 
 * Performance optimizations:
 * - Virtualization: Only renders active section + 1 before/after (max 3 Konva Stages)
 * - Static snapshots: Non-active sections show cached PNG images instead of live Konva
 * - rAF throttled scroll: Scroll handler uses requestAnimationFrame, not React state
 * - No Konva operations during scroll: Prevents batchDraw/find operations during scroll
 */

'use client';

import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Stage, Layer, Group, Rect, Transformer } from 'react-konva';
import Konva from 'konva';
import { useProjectStore } from '@/src/store/projectStore';
import { useArtboardViewport } from '../hooks/useArtboardViewport';
import { useSnapping } from '../hooks/useSnapping';
import { CanvasObjectRenderer } from './CanvasObjectRenderer';
import { SectionRenderer } from './SectionRenderer';
import { DESIGN_W, DESIGN_H, CanvasObject, TextObject, RectObject, CircleObject, LineObject } from '@/src/store/types';
import { clamp } from '@/src/lib/geometry';
import { Button } from '@/components/ui/button';
import { Copy, Trash2 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { scheduleSnapshotRegeneration, generateSectionSnapshot, setSnapshot } from '../utils/sectionSnapshot';

interface EditorCanvasProps {
  onTextEdit: (objectId: string) => void;
  workspaceScale: number;
  stageRef?: React.RefObject<Konva.Stage | null>;
  editingTextId?: string | null;
}

export function EditorCanvas({ onTextEdit, workspaceScale, stageRef, editingTextId }: EditorCanvasProps) {
  const internalStageRef = useRef<Konva.Stage>(null);
  const activeStageRef = stageRef ?? internalStageRef;
  const transformerRef = useRef<Konva.Transformer>(null);
  const artboardGroupRef = useRef<Konva.Group>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  const {
    project,
    currentSectionId,
    selectedIds,
    tool,
    setSelectedIds,
    updateObject,
    addObject,
    setCurrentSection,
    duplicateSection,
    deleteSection,
    setTool,
  } = useProjectStore();

  const viewport = useArtboardViewport('editor');
  const currentSection = project?.sections.find((s) => s.id === currentSectionId);
  const objects = currentSection?.objects || [];
  const sectionRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const isScrollingProgrammaticallyRef = useRef(false);

  // Calculate smaller scale for editing (like Canva) - 40% of actual size for better space usage
  // Global zoom is applied by scaling the Konva stage/group sizes, not CSS transforms
  const editScale = 0.4;
  const displayScale = editScale * workspaceScale;
  const { snap } = useSnapping(objects, selectedIds, displayScale);

  // Calculate which sections should be rendered (virtualization)
  // Only render active section + 1 before and 1 after (max 3 sections)
  const visibleSectionIndices = useMemo(() => {
    if (!project || !currentSectionId) return new Set<number>();
    
    const currentIndex = project.sections.findIndex((s) => s.id === currentSectionId);
    if (currentIndex === -1) return new Set<number>();

    const indices = new Set<number>();
    // Include previous section
    if (currentIndex > 0) indices.add(currentIndex - 1);
    // Include current section
    indices.add(currentIndex);
    // Include next section
    if (currentIndex < project.sections.length - 1) indices.add(currentIndex + 1);

    return indices;
  }, [project, currentSectionId]);

  // Track previous section to generate snapshot when switching
  const prevSectionIdRef = useRef<string | null>(null);

  // Clear selection and force redraw when section changes
  // Also generate snapshot for previous section before switching
  useEffect(() => {
    if (!currentSectionId) return;

    // Generate snapshot for previous section if it exists
    if (prevSectionIdRef.current && prevSectionIdRef.current !== currentSectionId && activeStageRef.current) {
      // Generate snapshot asynchronously (don't block section switch)
      generateSectionSnapshot(activeStageRef.current, 200, 356)
        .then((snapshot) => {
          if (snapshot && prevSectionIdRef.current) {
            setSnapshot(prevSectionIdRef.current, snapshot);
          }
        })
        .catch(() => {
          // Ignore errors - snapshot generation is non-critical
        });
    }

    prevSectionIdRef.current = currentSectionId;

    // Clear selection immediately (synchronous for better UX)
    setSelectedIds([]);
    
    // Use rAF for Konva operations
    const rafId = requestAnimationFrame(() => {
      // Force Konva to redraw when section changes
      if (activeStageRef.current) {
        const layer = activeStageRef.current.getLayers()[0];
        if (layer) {
          layer.batchDraw();
        }
      }
      
      // Clear transformer
      if (transformerRef.current) {
        transformerRef.current.nodes([]);
      }
    });

    return () => cancelAnimationFrame(rafId);
  }, [currentSectionId, setSelectedIds]);

  // Schedule snapshot regeneration when section objects change
  // Debounced to avoid regenerating on every edit
  const prevObjectsHashRef = useRef<string>('');
  useEffect(() => {
    if (!project) return;
    
    // Create hash of all section objects to detect changes
    const objectsHash = project.sections
      .map((s) => `${s.id}:${s.objects.length}:${s.objects.map((o) => `${o.id}:${o.x}:${o.y}`).join(',')}`)
      .join('|');
    
    // Only regenerate if objects actually changed
    if (objectsHash !== prevObjectsHashRef.current) {
      prevObjectsHashRef.current = objectsHash;
      
      // Schedule regeneration for sections with objects (debounced)
      // This invalidates cache, forcing regeneration when section becomes visible
      project.sections.forEach((section) => {
        if (section.objects.length > 0) {
          scheduleSnapshotRegeneration(section.id);
        }
      });
    }
  }, [project]);

  // Update transformer when selection changes
  // Use rAF to batch updates and prevent jank
  useEffect(() => {
    if (!transformerRef.current || !artboardGroupRef.current || !currentSectionId) return;

    const rafId = requestAnimationFrame(() => {
      const transformer = transformerRef.current;
      const artboardGroup = artboardGroupRef.current;
      if (!transformer || !artboardGroup) return;

      const stage = transformer.getStage();
      if (!stage) return;

      // Only update transformer for current section
      const selectedNodes = selectedIds
        .map((id) => {
          const node = artboardGroup.findOne(`#${id}`);
          return node;
        })
        .filter(Boolean) as Konva.Node[];

      if (selectedNodes.length > 0) {
        transformer.nodes(selectedNodes);
        const layer = transformer.getLayer();
        if (layer) {
          layer.batchDraw();
        }
      } else {
        transformer.nodes([]);
      }
    });

    return () => cancelAnimationFrame(rafId);
  }, [selectedIds, objects, currentSectionId]);

  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // Polotno pattern: check if clicked on empty space more thoroughly
    const stage = e.target.getStage();
    const target = e.target;
    
    // Check if we clicked on the stage itself, layer, or background
    const clickedOnEmpty = 
      target === stage ||
      target.getType() === 'Layer' ||
      (target.getType() === 'Rect' && target.name() === 'background');
    
    // Also check if we clicked on transformer (should not deselect)
    const parent = target.getParent();
    const clickedOnTransformer = 
      target.getType() === 'Transformer' ||
      (parent !== null && parent.getType() === 'Transformer');
    
    if (clickedOnEmpty && !clickedOnTransformer) {
      // Use rAF to batch state updates (polotno pattern)
      requestAnimationFrame(() => {
        setSelectedIds([]);
      });
    }
  };

  const handleSectionCanvasClick = (sectionId: string) => {
    if (sectionId !== currentSectionId) {
      const { setCurrentSection } = useProjectStore.getState();
      setCurrentSection(sectionId);
    }
  };

  const handleObjectClick = (objectId: string, e?: Konva.KonvaEventObject<MouseEvent>) => {
    // Don't switch tool when clicking objects - allow selection/drag even with creation tools active
    // This allows users to select and move objects while a creation tool is active
    
    // Prevent event propagation to stage
    if (e) {
      e.cancelBubble = true;
    }
    
    // Use rAF to batch state updates for smooth interaction (polotno pattern)
    requestAnimationFrame(() => {
      if (e?.evt.shiftKey || e?.evt.metaKey || e?.evt.ctrlKey) {
        // Multi-select (polotno pattern)
        if (selectedIds.includes(objectId)) {
          setSelectedIds(selectedIds.filter((id) => id !== objectId));
        } else {
          setSelectedIds([...selectedIds, objectId]);
        }
      } else {
        // Single select
        setSelectedIds([objectId]);
      }
    });
  };

  const handleContextMenu = (e: Konva.KonvaEventObject<PointerEvent>, objectId: string) => {
    e.evt.preventDefault();
    if (!selectedIds.includes(objectId)) {
      setSelectedIds([objectId]);
    }
  };

  const handleDragMove = (
    e: Konva.KonvaEventObject<DragEvent>,
    objectId: string,
    targetSectionId: string
  ) => {
    // Real-time snapping during drag (polotno pattern)
    const node = e.target as Konva.Node;
    let newX = node.x();
    let newY = node.y();
    const width = node.width();
    const height = node.height();

    // Apply snapping during drag
    const snapResult = snap(newX, newY, width, height, objectId);
    newX = snapResult.x;
    newY = snapResult.y;

    // Update node position in real-time for smooth snapping
    node.position({ x: newX, y: newY });
    
    // Force redraw to show snap guides
    const layer = node.getLayer();
    if (layer) {
      layer.batchDraw();
    }
  };

  const handleDragEnd = (
    e: Konva.KonvaEventObject<DragEvent>,
    objectId: string,
    targetSectionId: string
  ) => {
    // Simple Konva.js pattern: just update position from the node
    const node = e.target as Konva.Node;
    const newX = node.x();
    const newY = node.y();

    // Update object position (coordinates are already in design space)
    updateObject(targetSectionId, objectId, { x: newX, y: newY });
  };

  const handleTransform = (
    e: Konva.KonvaEventObject<Event>,
    objectId: string,
    targetSectionId: string
  ) => {
    // Real-time transform with snapping (polotno pattern)
    const node = e.target as Konva.Node;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    
    // Calculate new dimensions
    const newWidth = Math.max(5, node.width() * scaleX);
    const newHeight = Math.max(5, node.height() * scaleY);
    let newX = node.x();
    let newY = node.y();

    // Apply snapping during transform
    const snapResult = snap(newX, newY, newWidth, newHeight, objectId);
    newX = snapResult.x;
    newY = snapResult.y;

    // Update node position for real-time snapping
    node.position({ x: newX, y: newY });
    
    // Force redraw
    const layer = node.getLayer();
    if (layer) {
      layer.batchDraw();
    }
  };

  const handleTransformEnd = (
    e: Konva.KonvaEventObject<Event>,
    objectId: string,
    targetSectionId: string
  ) => {
    // Simple Konva.js pattern: get values from node and update
    const node = e.target as Konva.Node;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    
    // Reset scale to 1 and apply to width/height
    node.scaleX(1);
    node.scaleY(1);

    const newWidth = Math.max(5, node.width() * scaleX);
    const newHeight = Math.max(5, node.height() * scaleY);
    const newX = node.x();
    const newY = node.y();

    // Update object with new dimensions and position
    updateObject(targetSectionId, objectId, {
      x: newX,
      y: newY,
      width: newWidth,
      height: newHeight,
      rotation: node.rotation(),
    });
  };

  const handleCanvasClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // Canva/Polotno behavior: clicking empty canvas ONLY clears selection
    // Objects are NEVER created from canvas clicks - only from explicit UI button actions
    
    // Clear selection when clicking empty space
    requestAnimationFrame(() => {
      if (selectedIds.length > 0) {
        setSelectedIds([]);
      }
      // Optionally switch to select tool
      if (tool !== 'select') {
        setTool('select');
      }
    });
  };

  const handleStageMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.evt.button !== 0) return; // Only handle left mouse button
    const stage = e.target.getStage();
    if (!stage) return;

    const pointerPos = stage.getPointerPosition();
    if (!pointerPos) return;

    // Check if spacebar is pressed for panning
    const isSpacePressed = (e.evt as any).spaceKey || false;
    if (isSpacePressed) {
      setIsPanning(true);
      if (stage) {
        setPanStart({ x: stage.x(), y: stage.y() });
      }
    }
  };

  const handleStageMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (isPanning && activeStageRef.current) {
      const stage = activeStageRef.current;
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

  if (!project) {
    return (
      <div className="w-full h-full flex items-center justify-center text-zinc-500">
        No project loaded
      </div>
    );
  }

  const bleedPx = (project?.settings.bleedMm || 3) * 3.779527559; // 3mm to px at 72dpi
  const safePadding = project?.settings.safePaddingPx || 20;

  // Calculate scaled size with global zoom applied
  const scaledWidth = DESIGN_W * displayScale;
  const scaledHeight = DESIGN_H * displayScale;

  // Increase stage size to accommodate bleed guides (add padding for bleed on all sides)
  // Bleed in design coordinates needs to be scaled to stage coordinates
  const bleedPaddingScaled = bleedPx * displayScale;
  const stageWidth = scaledWidth + (bleedPaddingScaled * 2);
  const stageHeight = scaledHeight + (bleedPaddingScaled * 2);

  if (!currentSection) {
    return (
      <div className="w-full h-full flex items-center justify-center text-zinc-500">
        No section selected
      </div>
    );
  }

  // Auto-switch to select tool when mouse enters canvas (Canva pattern)
  // Only switch if we're not actively using a creation tool
  // Note: Objects can still be selected/dragged even with creation tools active
  const handleCanvasMouseEnter = () => {
    // Switch to select when mouse enters canvas, but only if we're not in a creation tool
    // This allows tools to work properly while still defaulting to select
    // Users can still select and drag objects even with creation tools active
    const creationTools = ['text', 'rect', 'circle', 'line', 'image'];
    if (!creationTools.includes(tool)) {
      setTool('select');
    }
  };

  return (
    <div 
      className="flex flex-col items-center gap-8"
      onMouseEnter={handleCanvasMouseEnter}
    >
      {project.sections.map((section, index) => {
        const sectionObjects = section.objects || [];
        const isCurrentSection = section.id === currentSectionId;
        const isVisible = visibleSectionIndices.has(index);

        return (
          <div key={section.id} data-section-id={section.id} className="flex flex-col items-center">
            {/* Duplicate and Delete buttons - above canvas, top right */}
            <div className="w-full flex justify-end mb-2" style={{ width: isCurrentSection ? stageWidth : scaledWidth }}>
              <div className="flex flex-row gap-1" onClick={(e) => e.stopPropagation()}>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="secondary"
                        size="icon-sm"
                        className="h-8 w-8 bg-white shadow-md hover:bg-gray-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          const id = duplicateSection(section.id);
                          setCurrentSection(id);
                        }}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Duplicate Section</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="secondary"
                        size="icon-sm"
                        className="h-8 w-8 bg-white shadow-md hover:bg-gray-100 text-red-600 hover:text-red-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (project.sections.length > 1) {
                            deleteSection(section.id);
                          }
                        }}
                        disabled={project.sections.length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Delete Section</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            {/* Virtualized Section Renderer */}
            <SectionRenderer
              section={section}
              isActive={isCurrentSection}
              isVisible={isVisible}
              editScale={editScale}
              stageWidth={isCurrentSection ? stageWidth : scaledWidth}
              stageHeight={isCurrentSection ? stageHeight : scaledHeight}
              bleedPaddingScaled={bleedPaddingScaled}
              bleedPx={bleedPx}
              safePadding={safePadding}
              currentSectionId={currentSectionId}
              selectedIds={selectedIds}
              tool={tool}
              editingTextId={editingTextId}
              onSectionClick={handleSectionCanvasClick}
              onObjectClick={handleObjectClick}
              onObjectDragMove={handleDragMove}
              onObjectDragEnd={handleDragEnd}
              onObjectTransform={handleTransform}
              onObjectTransformEnd={handleTransformEnd}
              onContextMenu={handleContextMenu}
              onTextEdit={onTextEdit}
              onDoubleClick={(e, object) => {
                if (object.type === 'text' && isCurrentSection) {
                  onTextEdit(object.id);
                }
              }}
              onCanvasClick={isCurrentSection ? handleCanvasClick : undefined}
              onCanvasMouseEnter={isCurrentSection ? handleCanvasMouseEnter : undefined}
              stageRef={isCurrentSection ? activeStageRef : undefined}
              transformerRef={isCurrentSection ? transformerRef : undefined}
              artboardGroupRef={isCurrentSection ? artboardGroupRef : undefined}
            />
          </div>
        );
      })}
    </div>
  );
}
