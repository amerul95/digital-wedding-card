"use client";

import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Text, Rect, Image, Transformer, Group } from "react-konva";
import Konva from "konva";
import type { KonvaEventObject } from "konva/lib/Node";

export interface CanvasElement {
  id: string;
  type: "text" | "rect" | "image";
  x: number;
  y: number;
  width?: number;
  height?: number;
  rotation?: number;
  fill?: string;
  fontSize?: number;
  fontFamily?: string;
  text?: string;
  imageUrl?: string;
  opacity?: number;
  zIndex?: number;
}

interface CanvasEditorProps {
  width?: number;
  height?: number;
  elements: CanvasElement[];
  selectedId?: string | null;
  onElementsChange: (elements: CanvasElement[]) => void;
  onSelect: (id: string | null) => void;
}

export function CanvasEditor({
  width = 800,
  height = 600,
  elements,
  selectedId,
  onElementsChange,
  onSelect,
}: CanvasEditorProps) {
  const stageRef = useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const [imageCache, setImageCache] = useState<Map<string, HTMLImageElement>>(new Map());

  // Load images into cache
  useEffect(() => {
    const loadImage = (url: string) => {
      if (imageCache.has(url)) return;
      
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.src = url;
      img.onload = () => {
        setImageCache((prev) => {
          const newCache = new Map(prev);
          newCache.set(url, img);
          return newCache;
        });
      };
      img.onerror = () => {
        console.error(`Failed to load image: ${url}`);
      };
    };

    elements.forEach((el) => {
      if (el.type === "image" && el.imageUrl) {
        loadImage(el.imageUrl);
      }
    });
  }, [elements]);

  // Update transformer when selection changes
  useEffect(() => {
    if (!transformerRef.current || !selectedId) {
      transformerRef.current?.nodes([]);
      return;
    }

    const stage = stageRef.current;
    if (!stage) return;

    const selectedNode = stage.findOne(`#${selectedId}`);
    if (selectedNode) {
      transformerRef.current.nodes([selectedNode]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [selectedId]);

  const handleElementChange = (id: string, attrs: Partial<CanvasElement>) => {
    onElementsChange(
      elements.map((el) => (el.id === id ? { ...el, ...attrs } : el))
    );
  };

  const handleDragEnd = (e: KonvaEventObject<DragEvent>, id: string) => {
    handleElementChange(id, {
      x: e.target.x(),
      y: e.target.y(),
    });
  };

  const handleTransformEnd = (e: KonvaEventObject<Event>, id: string) => {
    const node = e.target;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    handleElementChange(id, {
      x: node.x(),
      y: node.y(),
      rotation: node.rotation(),
      width: Math.max(5, node.width() * scaleX),
      height: Math.max(5, node.height() * scaleY),
    });

    // Reset scale
    node.scaleX(1);
    node.scaleY(1);
  };

  const handleClick = (e: KonvaEventObject<MouseEvent>) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      onSelect(null);
      return;
    }

    const id = e.target.id();
    if (id) {
      onSelect(id);
    }
  };

  // Sort elements by zIndex for proper rendering order
  const sortedElements = [...elements].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

  return (
    <div className="border-2 border-gray-300 rounded-lg overflow-hidden shadow-lg bg-white">
      <Stage
        ref={stageRef}
        width={width}
        height={height}
        onClick={handleClick}
        onTap={handleClick}
        style={{ cursor: selectedId ? "move" : "default" }}
      >
        <Layer>
          {sortedElements.map((element) => {
            const isSelected = selectedId === element.id;
            const commonProps = {
              id: element.id,
              x: element.x,
              y: element.y,
              rotation: element.rotation || 0,
              opacity: element.opacity || 1,
              draggable: true,
              onClick: (e: KonvaEventObject<MouseEvent>) => {
                e.cancelBubble = true;
                onSelect(element.id);
              },
              onDragEnd: (e: KonvaEventObject<DragEvent>) => handleDragEnd(e, element.id),
              onTransformEnd: (e: KonvaEventObject<Event>) => handleTransformEnd(e, element.id),
            };

            switch (element.type) {
              case "text":
                return (
                  <Text
                    key={element.id}
                    {...commonProps}
                    text={element.text || "Text"}
                    fontSize={element.fontSize || 24}
                    fontFamily={element.fontFamily || "Arial"}
                    fill={element.fill || "#000000"}
                    width={element.width}
                    height={element.height}
                  />
                );

              case "rect":
                return (
                  <Rect
                    key={element.id}
                    {...commonProps}
                    width={element.width || 100}
                    height={element.height || 100}
                    fill={element.fill || "#3b82f6"}
                    stroke={isSelected ? "#f59e0b" : undefined}
                    strokeWidth={isSelected ? 2 : 0}
                  />
                );

              case "image":
                const image = element.imageUrl ? imageCache.get(element.imageUrl) : null;
                if (!image && element.imageUrl) {
                  // Image is still loading, show placeholder
                  return (
                    <Rect
                      key={element.id}
                      {...commonProps}
                      width={element.width || 200}
                      height={element.height || 200}
                      fill="#e5e7eb"
                      stroke={isSelected ? "#f59e0b" : "#d1d5db"}
                      strokeWidth={isSelected ? 2 : 1}
                      dash={[5, 5]}
                    />
                  );
                }
                if (!image) return null;
                return (
                  <Image
                    key={element.id}
                    {...commonProps}
                    image={image}
                    width={element.width || image.width}
                    height={element.height || image.height}
                    stroke={isSelected ? "#f59e0b" : undefined}
                    strokeWidth={isSelected ? 2 : 0}
                  />
                );

              default:
                return null;
            }
          })}
          <Transformer
            ref={transformerRef}
            boundBoxFunc={(oldBox, newBox) => {
              // Limit resize
              if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
                return oldBox;
              }
              return newBox;
            }}
          />
        </Layer>
      </Stage>
    </div>
  );
}
