"use client";

import { useEditorStore } from "@/components/editor/store";
import { cn } from "@/lib/utils";
import { useDroppable } from "@dnd-kit/core";
import { NodeRenderer } from "@/components/editor/NodeRenderer";
import { SectionNavigator } from "./SectionNavigator";
import React from "react";

export function CardStage() {
    const rootId = useEditorStore((state) => state.rootId);
    const rootNode = useEditorStore((state) => state.nodes[rootId]);
    const [isMobile, setIsMobile] = React.useState(true);

    const { setNodeRef, isOver } = useDroppable({
        id: rootId,
        data: {
            type: 'root',
        }
    });

    return (
        <div className="flex flex-col items-center w-full min-h-0">
            {/* View Toggle */}
            <div className="flex gap-2 mb-4 bg-white p-1 rounded-lg border shadow-sm flex-shrink-0">
                <button
                    onClick={() => setIsMobile(true)}
                    className={cn(
                        "px-3 py-1.5 text-xs rounded transition-all font-medium",
                        isMobile ? "bg-gray-900 text-white shadow-sm" : "text-gray-500 hover:bg-gray-50"
                    )}
                >
                    Mobile Frame
                </button>
                <button
                    onClick={() => setIsMobile(false)}
                    className={cn(
                        "px-3 py-1.5 text-xs rounded transition-all font-medium",
                        !isMobile ? "bg-gray-900 text-white shadow-sm" : "text-gray-500 hover:bg-gray-50"
                    )}
                >
                    Desktop (Full)
                </button>
            </div>

            {/* Frame Container - handles scrolling internally for desktop, or constraints for mobile */}
            <div
                className={cn(
                    "relative transition-all duration-300 shadow-2xl bg-white border-gray-900 ring-1 ring-gray-900/5 flex flex-col transform-gpu",
                    isMobile
                        ? "w-[375px] h-[812px] rounded-[40px] border-8 overflow-hidden flex-shrink-0"
                        : "w-full h-full max-w-6xl rounded-lg border border-gray-200 shadow-sm min-h-[500px]"
                )}
            >
                {/* Notch - only visible in mobile */}
                {isMobile && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[30px] bg-gray-900 rounded-b-[20px] z-50 pointer-events-none"></div>
                )}

                {/* Screen Content */}
                <div
                    ref={setNodeRef}
                    className={cn(
                        "w-full h-full overflow-y-auto scrollbar-hide bg-white relative",
                        isOver && "bg-blue-50"
                    )}
                    style={rootNode?.style}
                >
                    <div className="flex flex-1 overflow-hidden relative min-h-full">
                        {/* Main Content Area */}
                        <div className={cn("flex-1 min-h-full", isMobile ? "pb-0 pt-0" : "pb-0 pt-0")}>
                            {/* Notch spacing handled by first section padding if needed, or overlay */}
                            {/* {isMobile && <div className="h-[30px] w-full pointer-events-none" />} */}

                            {rootNode?.children.map((childId) => (
                                <NodeRenderer key={childId} nodeId={childId} />
                            ))}

                            {rootNode?.children.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8 text-center border-2 border-dashed border-gray-200 m-4 rounded-xl">
                                    <p>Drop sections here</p>
                                </div>
                            )}
                        </div>

                        {/* Overlays */}
                        {isMobile && <SectionNavigator />}
                    </div>
                </div>
            </div>
        </div>
    );
}
