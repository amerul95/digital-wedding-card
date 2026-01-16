"use client";

import { useEditorStore } from "@/components/editor/store";
import { cn } from "@/lib/utils";
import { useDroppable } from "@dnd-kit/core";
import { NodeRenderer } from "@/components/editor/NodeRenderer";
import { SectionNavigator } from "./SectionNavigator";
import { MobileFrameProvider } from "@/components/editor/context/MobileFrameContext";
import { usePreview } from "@/components/editor/context/PreviewContext";
import React from "react";

interface CardStageProps {
    isMobile: boolean;
}

export function CardStage({ isMobile }: CardStageProps) {
    const rootId = useEditorStore((state) => state.rootId);
    const rootNode = useEditorStore((state) => state.nodes[rootId]);
    const { isPreview } = usePreview();

    const { setNodeRef, isOver } = useDroppable({
        id: rootId,
        data: {
            type: 'root',
        },
        disabled: isPreview, // Disable drag and drop in preview mode
    });

    return (
        <div className="flex flex-col items-center w-full min-h-0">
            {/* View Toggle removed - moved to RightSidebar */}

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
                    <MobileFrameProvider isMobile={isMobile}>
                        <div className={cn("relative", isMobile ? "w-full" : "flex flex-1 min-h-full")}>
                            {/* Main Content Area */}
                            <div className={cn(
                                isMobile ? "w-full" : "flex-1 min-h-full",
                                isMobile ? "pb-32" : "pb-0 pt-0" // Add bottom padding in mobile frame for drop zone
                            )}>
                                {/* Notch spacing handled by first section padding if needed, or overlay */}
                                {/* {isMobile && <div className="h-[30px] w-full pointer-events-none" />} */}

                                {rootNode?.children.map((childId) => (
                                    <NodeRenderer key={childId} nodeId={childId} />
                                ))}

                                {rootNode?.children.length === 0 && (
                                    <div className={cn(
                                        "flex flex-col items-center justify-center text-gray-400 p-8 text-center border-2 border-dashed border-gray-200 m-4 rounded-xl",
                                        isMobile ? "min-h-[812px]" : "h-full"
                                    )}>
                                        <p>Drop sections here</p>
                                    </div>
                                )}

                                {/* Drop Zone Indicator - only show in mobile frame when there are sections and not in preview */}
                                {isMobile && !isPreview && rootNode?.children.length > 0 && (
                                    <div className={cn(
                                        "h-24 flex items-center justify-center border-2 border-dashed rounded-lg mt-4 mx-4 transition-colors",
                                        "w-[calc(100%-2rem)]", // Account for mx-4 margins (1rem each side = 2rem total)
                                        isOver ? "border-blue-400 bg-blue-50/50" : "border-gray-300 bg-gray-50/50"
                                    )}>
                                        <p className={cn(
                                            "text-xs transition-colors",
                                            isOver ? "text-blue-600" : "text-gray-400"
                                        )}>
                                            Drop new sections here
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Overlays */}
                            {isMobile && <SectionNavigator />}
                        </div>
                    </MobileFrameProvider>
                </div>
            </div>
        </div>
    );
}
