"use client";

import { useEditorStore } from "@/components/editor/store";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, useSensor, useSensors, PointerSensor } from "@dnd-kit/core";
import { Sidebar } from "@/components/editor/Sidebar";
import { Canvas } from "@/components/editor/Canvas";
import { TopBar } from "@/components/editor/TopBar";
import { PropertyPanel, PropertyPanelToggle } from "@/components/editor/PropertyPanel";
import { RightSidebar, SidebarToggle } from "@/components/editor/RightSidebar";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export function EditorLayout() {
    const addNode = useEditorStore((state) => state.addNode);
    const selectedId = useEditorStore((state) => state.selectedId);
    const [activeDragItem, setActiveDragItem] = useState<any>(null);
    const [mounted, setMounted] = useState(false);
    const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
    const [propertyPanelOpen, setPropertyPanelOpen] = useState(true);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Auto-open property panel when a node is selected or page settings are accessed
    useEffect(() => {
        if (selectedId) {
            setPropertyPanelOpen(true);
        }
    }, [selectedId]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        setActiveDragItem(event.active.data.current);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveDragItem(null);

        if (!over) return;

        // Check if we dropped a sidebar item
        if (active.data.current?.isSidebarItem) {
            const type = active.data.current.type;
            const parentId = over.id as string; // distinct id of the drop target (section, container, or root)

            // Generate a unique ID
            const timestamp = Date.now();
            const random = Math.floor(Math.random() * 1000);
            const newNodeId = `${type}-${timestamp}-${random}`;

            const newNode = {
                id: newNodeId,
                type,
                parentId,
                children: [],
                data: {
                    label: `New ${type}`,
                    content: type === 'text' ? 'Start typing...' : undefined,
                    // Default slider data
                    images: type === 'slider' ? [] : undefined,
                    // Default countdown data
                    targetDate: type === 'countdown' ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16) : undefined,
                    // Default congratulation speech data
                    enableAutoScroll: type === 'congratulation-speech' ? false : undefined,
                    autoScrollDelay: type === 'congratulation-speech' ? 3000 : undefined,
                },
                style: {},
            };

            addNode(newNode, parentId);
        }
        // Handle reordering later
    };

    return (
        <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            id="editor-dnd-context"
        >
            <div className="flex h-screen w-full flex-col overflow-hidden bg-gray-50">
                <TopBar />
                <div className="flex flex-1 overflow-hidden">
                    <Sidebar />
                    <Canvas />
                    <div className="relative">
                        <PropertyPanel isOpen={propertyPanelOpen} />
                        <PropertyPanelToggle 
                            isOpen={propertyPanelOpen} 
                            onToggle={() => setPropertyPanelOpen(!propertyPanelOpen)} 
                        />
                    </div>
                    <div className="relative flex h-full">
                        {/* RightSidebar moved to Canvas */}
                    </div>
                </div>
            </div>
            {mounted && createPortal(
                <DragOverlay>
                    {activeDragItem ? (
                        <div className="p-3 border rounded bg-white shadow-lg opacity-80 cursor-grabbing w-40">
                            {activeDragItem.label || activeDragItem.type}
                        </div>
                    ) : null}
                </DragOverlay>,
                document.body
            )}
        </DndContext>
    );
}
