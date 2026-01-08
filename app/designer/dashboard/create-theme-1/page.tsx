"use client";

import React, { useState, useCallback, useEffect } from "react";
import { CanvasEditor, type CanvasElement } from "@/components/creator/CanvasEditor";
import { Toolbar } from "@/components/creator/Toolbar";
import { PropertiesPanel } from "@/components/creator/PropertiesPanel";
import { LayerPanel } from "@/components/creator/LayerPanel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Save, ArrowLeft, Download } from "lucide-react";

export default function CreateTheme1Page() {
  const router = useRouter();
  const [themeName, setThemeName] = useState("");
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [nextId, setNextId] = useState(1);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });

  const selectedElement = elements.find((el) => el.id === selectedId) || null;

  const generateId = useCallback(() => {
    const id = `element-${nextId}`;
    setNextId((prev) => prev + 1);
    return id;
  }, [nextId]);

  const addElement = useCallback(
    (type: "text" | "rect" | "image") => {
      const baseElement: Partial<CanvasElement> = {
        id: generateId(),
        type,
        x: canvasSize.width / 2 - 50,
        y: canvasSize.height / 2 - 50,
        rotation: 0,
        opacity: 1,
        zIndex: elements.length,
      };

      let newElement: CanvasElement;

      switch (type) {
        case "text":
          newElement = {
            ...baseElement,
            type: "text",
            text: "Edit me",
            fontSize: 24,
            fontFamily: "Arial",
            fill: "#000000",
          } as CanvasElement;
          break;
        case "rect":
          newElement = {
            ...baseElement,
            type: "rect",
            width: 100,
            height: 100,
            fill: "#3b82f6",
          } as CanvasElement;
          break;
        case "image":
          newElement = {
            ...baseElement,
            type: "image",
            width: 200,
            height: 200,
            imageUrl: "",
          } as CanvasElement;
          break;
        default:
          return;
      }

      setElements((prev) => [...prev, newElement]);
      setSelectedId(newElement.id);
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} added`);
    },
    [elements.length, canvasSize, generateId]
  );

  const deleteElement = useCallback(() => {
    if (!selectedId) return;
    setElements((prev) => prev.filter((el) => el.id !== selectedId));
    setSelectedId(null);
    toast.success("Element deleted");
  }, [selectedId]);

  const duplicateElement = useCallback(() => {
    if (!selectedId) return;
    const element = elements.find((el) => el.id === selectedId);
    if (!element) return;

    const newElement: CanvasElement = {
      ...element,
      id: generateId(),
      x: element.x + 20,
      y: element.y + 20,
      zIndex: elements.length,
    };

    setElements((prev) => [...prev, newElement]);
    setSelectedId(newElement.id);
    toast.success("Element duplicated");
  }, [selectedId, elements, generateId]);

  const moveLayer = useCallback(
    (id: string, direction: "up" | "down") => {
      const element = elements.find((el) => el.id === id);
      if (!element) return;

      const currentZ = element.zIndex || 0;
      const sortedByZ = [...elements].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
      const currentIndex = sortedByZ.findIndex((el) => el.id === id);

      if (currentIndex === -1) return;

      let targetIndex: number;
      if (direction === "up") {
        targetIndex = Math.min(currentIndex + 1, sortedByZ.length - 1);
      } else {
        targetIndex = Math.max(currentIndex - 1, 0);
      }

      if (targetIndex === currentIndex) return;

      const targetElement = sortedByZ[targetIndex];
      const targetZ = targetElement.zIndex || 0;

      // Swap z-indices
      const updatedElements = elements.map((el) => {
        if (el.id === id) {
          return { ...el, zIndex: targetZ };
        }
        if (el.id === targetElement.id) {
          return { ...el, zIndex: currentZ };
        }
        return el;
      });

      setElements(updatedElements);
      toast.success(`Layer moved ${direction}`);
    },
    [elements]
  );

  const handleElementChange = useCallback(
    (updates: Partial<CanvasElement>) => {
      if (!selectedId) return;
      setElements((prev) =>
        prev.map((el) => (el.id === selectedId ? { ...el, ...updates } : el))
      );
    },
    [selectedId]
  );

  const toggleVisibility = useCallback(
    (id: string) => {
      setElements((prev) =>
        prev.map((el) =>
          el.id === id ? { ...el, opacity: el.opacity === 0 ? 1 : 0 } : el
        )
      );
    },
    []
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Delete key
      if ((e.key === "Delete" || e.key === "Backspace") && selectedId) {
        if (document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
          e.preventDefault();
          deleteElement();
        }
      }
      // Duplicate with Ctrl/Cmd + D
      if ((e.ctrlKey || e.metaKey) && e.key === "d" && selectedId) {
        e.preventDefault();
        duplicateElement();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedId, deleteElement, duplicateElement]);

  const handleSave = useCallback(async () => {
    if (!themeName.trim()) {
      toast.error("Please enter a theme name");
      return;
    }

    try {
      const themeData = {
        name: themeName,
        elements,
        canvasSize,
        createdAt: new Date().toISOString(),
      };

      // Save to localStorage for now (you can change to API later)
      const savedThemes = JSON.parse(
        localStorage.getItem("canvas-themes") || "[]"
      );
      savedThemes.push(themeData);
      localStorage.setItem("canvas-themes", JSON.stringify(savedThemes));

      toast.success("Theme saved successfully!");
      router.push("/designer/dashboard/themes");
    } catch (error) {
      console.error("Error saving theme:", error);
      toast.error("Failed to save theme");
    }
  }, [themeName, elements, canvasSize, router]);

  const exportJSON = useCallback(() => {
    const data = {
      name: themeName || "Untitled Theme",
      elements,
      canvasSize,
      version: "1.0",
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${themeName || "theme"}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Theme exported as JSON");
  }, [themeName, elements, canvasSize]);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <Link href="/designer/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Canvas Theme Creator</h1>
            <span className="px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full">
              NEW
            </span>
          </div>
          <p className="text-muted-foreground">
            Drag and drop elements to create your wedding card theme. Click elements to select and edit.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportJSON}>
            <Download className="w-4 h-4 mr-2" />
            Export JSON
          </Button>
          <Button onClick={handleSave} disabled={!themeName.trim()}>
            <Save className="w-4 h-4 mr-2" />
            Save Theme
          </Button>
        </div>
      </div>

      {/* Theme Name Input */}
      <Card>
        <CardHeader>
          <CardTitle>Theme Name</CardTitle>
          <CardDescription>Enter a name for your theme</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="themeName">Theme Name *</Label>
            <Input
              id="themeName"
              type="text"
              value={themeName}
              onChange={(e) => setThemeName(e.target.value)}
              placeholder="Enter theme name (e.g., Romantic Rose, Elegant Gold)"
            />
          </div>
        </CardContent>
      </Card>

      {/* Canvas Size Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Canvas Size</CardTitle>
          <CardDescription>Adjust the canvas dimensions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="canvasWidth">Width</Label>
              <Input
                id="canvasWidth"
                type="number"
                value={canvasSize.width}
                onChange={(e) =>
                  setCanvasSize((prev) => ({
                    ...prev,
                    width: parseInt(e.target.value) || 800,
                  }))
                }
                min={400}
                max={2000}
              />
            </div>
            <div>
              <Label htmlFor="canvasHeight">Height</Label>
              <Input
                id="canvasHeight"
                type="number"
                value={canvasSize.height}
                onChange={(e) =>
                  setCanvasSize((prev) => ({
                    ...prev,
                    height: parseInt(e.target.value) || 600,
                  }))
                }
                min={400}
                max={2000}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Editor */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Sidebar - Layers */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
          <LayerPanel
            elements={elements}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onDelete={(id) => {
              if (selectedId === id) setSelectedId(null);
              setElements((prev) => prev.filter((el) => el.id !== id));
            }}
            onDuplicate={(id) => {
              const element = elements.find((el) => el.id === id);
              if (!element) return;
              const newElement: CanvasElement = {
                ...element,
                id: generateId(),
                x: element.x + 20,
                y: element.y + 20,
                zIndex: elements.length,
              };
              setElements((prev) => [...prev, newElement]);
              setSelectedId(newElement.id);
            }}
            onLayerUp={(id) => moveLayer(id, "up")}
            onLayerDown={(id) => moveLayer(id, "down")}
            onToggleVisibility={toggleVisibility}
          />
        </div>

        {/* Center - Canvas */}
        <div className="col-span-12 lg:col-span-6 space-y-4">
          <Toolbar
            onAddElement={addElement}
            onDelete={deleteElement}
            onDuplicate={duplicateElement}
            onLayerUp={() => selectedId && moveLayer(selectedId, "up")}
            onLayerDown={() => selectedId && moveLayer(selectedId, "down")}
            selectedId={selectedId}
            hasSelection={!!selectedId}
          />
          <div className="bg-gray-100 p-4 rounded-lg">
            <CanvasEditor
              width={canvasSize.width}
              height={canvasSize.height}
              elements={elements}
              selectedId={selectedId}
              onElementsChange={setElements}
              onSelect={setSelectedId}
            />
          </div>
        </div>

        {/* Right Sidebar - Properties */}
        <div className="col-span-12 lg:col-span-3">
          <PropertiesPanel
            element={selectedElement}
            onChange={handleElementChange}
          />
        </div>
      </div>

      {/* Instructions */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">How to Use</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm text-blue-800 space-y-2 list-disc list-inside">
            <li>Use the toolbar to add Text, Shapes, or Images</li>
            <li>Click on any element to select it</li>
            <li>Drag elements to move them around</li>
            <li>Use the transform handles (when selected) to resize</li>
            <li>Edit properties in the right panel when an element is selected</li>
            <li>Manage layers from the left panel</li>
            <li>Press Delete key or use toolbar to remove selected element</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
