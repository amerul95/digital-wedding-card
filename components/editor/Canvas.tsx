"use client";

import { CardStage } from "@/components/editor/canvas/CardStage";
import { RightSidebar, SidebarToggle } from "@/components/editor/RightSidebar";
import { useState } from "react";
import { useEditorStore } from "@/components/editor/store";
import { Toggle } from "@/components/ui/toggle-switch";

export function Canvas() {
    const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(true);
    const viewOptions = useEditorStore((state) => state.viewOptions);
    const toggleViewOption = useEditorStore((state) => state.toggleViewOption);

    return (
        <div className="flex-1 bg-gray-100 p-4 overflow-y-auto flex justify-center items-start min-h-0 relative">
            <div className="flex gap-4 items-start">
                <div className="flex flex-col gap-2 items-center">
                    {/* View Toggles Toolbar */}
                    <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-200 flex gap-4 z-20">
                        <label className="flex items-center gap-2 text-xs font-medium text-gray-600 cursor-pointer select-none">
                            <Toggle
                                checked={viewOptions.showDoorOverlay}
                                onChange={() => toggleViewOption('showDoorOverlay')}
                            />
                            Show Door
                        </label>
                        <div className="w-px h-4 bg-gray-200"></div>
                        <label className="flex items-center gap-2 text-xs font-medium text-gray-600 cursor-pointer select-none">
                            <Toggle
                                checked={viewOptions.showAnimation}
                                onChange={() => toggleViewOption('showAnimation')}
                            />
                            Show Animation
                        </label>
                    </div>

                    <CardStage isMobile={isMobile} />
                </div>
                <div className="relative pt-0">
                    <SidebarToggle isOpen={rightSidebarOpen} onToggle={() => setRightSidebarOpen(!rightSidebarOpen)} />
                    {rightSidebarOpen ? <RightSidebar isMobile={isMobile} setIsMobile={setIsMobile} /> : null}
                </div>
            </div>
        </div>
    );
}
