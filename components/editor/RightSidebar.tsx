"use client";

import { useEditorStore } from "@/components/editor/store";
import { ChevronRight, ChevronLeft, Music, DoorOpen, Settings, PlayCircle, Eye, EyeOff, Sparkles, Edit } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface RightSidebarProps {
    isMobile: boolean;
    setIsMobile: (val: boolean) => void;
}

export function RightSidebar({ isMobile, setIsMobile }: RightSidebarProps) {
    const [isOpen, setIsOpen] = useState(true);
    const updateGlobalSettings = useEditorStore((state) => state.updateGlobalSettings);
    const globalSettings = useEditorStore((state) => state.globalSettings);
    const addNode = useEditorStore((state) => state.addNode);
    const rootId = useEditorStore((state) => state.rootId);

    const nodes = useEditorStore((state) => state.nodes);
    const updateNodeData = useEditorStore((state) => state.updateNodeData);
    const selectNode = useEditorStore((state) => state.selectNode);

    // Find door node
    const doorNodeEntry = Object.entries(nodes).find(([_, n]) => n.type === 'door');
    const doorNodeId = doorNodeEntry ? doorNodeEntry[0] : null;
    const doorNode = doorNodeEntry ? doorNodeEntry[1] : null;

    const handleAddDoor = () => {
        if (doorNodeId) {
            // If it exists but is hidden, just unhide it
            updateNodeData(doorNodeId, { isHidden: false });
            selectNode(doorNodeId);
        } else {
            const timestamp = Date.now();
            const newNodeId = `door-${timestamp}`;
            const newNode = {
                id: newNodeId,
                type: 'door' as any,
                parentId: rootId,
                children: [],
                data: {
                    title: "Wedding",
                    doorColor: "#f43f5e",
                    doorStyle: "swing",
                    isHidden: false
                },
                style: {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 40
                }
            };
            addNode(newNode, rootId);
            selectNode(newNodeId);
        }
    };

    const updateDoorData = (newData: any) => {
        if (doorNodeId) {
            updateNodeData(doorNodeId, newData);
        }
    };


    const handleDoorSelection = () => {
        if (doorNodeId) selectNode(doorNodeId);
    };

    const handleAnimationSelection = () => {
        // Select special ID to show only animation settings
        selectNode('animation-settings');
    };

    const handleDoorToggle = (checked: boolean) => {
        if (checked) {
            handleAddDoor(); // Ensures it exists and is visible
        } else {
            if (doorNodeId) {
                updateNodeData(doorNodeId, { isHidden: true });
            }
        }
    };

    const isDoorEnabled = doorNode ? !doorNode.data.isHidden : false;
    // Ensure isAnimationEnabled is always a boolean, never undefined
    const isAnimationEnabled = doorNode
        ? Boolean(doorNode.data?.animationEffect && doorNode.data.animationEffect !== 'none')
        : false;

    const handleAnimationToggle = (checked: boolean) => {
        if (!doorNodeId) {
            // If door doesn't exist, maybe we should create it? 
            // Animation usually depends on door layer being present in this context (overlay).
            // Let's assume user must have door enabled to animate.
            if (checked) handleAddDoor();
        }

        if (checked) {
            // Enable default if none
            updateDoorData({ animationEffect: 'snow' }); // Default to snow or whatever previous value if we tracked it?
            // Since we don't store "previous", 'snow' is a safe default.
        } else {
            updateDoorData({ animationEffect: 'none' });
        }
    };

    return (
        <div
            className={cn(
                "bg-white border rounded-xl shadow-xl z-30 transition-all duration-300 flex flex-col",
                isOpen ? "w-64" : "w-0 overflow-hidden border-none"
            )}
            style={{ height: '80vh' }}
        >
            <div className="p-3 border-b bg-gray-50 flex items-center justify-between">
                <h2 className="font-semibold text-sm uppercase tracking-wider flex items-center gap-2">
                    <Settings size={14} /> Page Settings
                </h2>
            </div>

            <div className="p-4 space-y-6 overflow-y-auto flex-1 scrollbar-thin">

                {/* 1. Door Overlay Toggle Section */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-2">
                            <DoorOpen size={14} /> Door Overlay
                        </h3>
                        <input
                            type="checkbox"
                            className="toggle toggle-sm toggle-primary"
                            checked={isDoorEnabled}
                            onChange={(e) => handleDoorToggle(e.target.checked)}
                        />
                    </div>

                    {/* Detailed Edit Button (Only if Enabled) */}
                    {isDoorEnabled && (
                        <div className="pl-6 border-l-2 border-gray-100 ml-1.5 space-y-2">
                            <p className="text-[10px] text-gray-400">
                                Style: <span className="font-medium text-gray-600 capitalize">{doorNode?.data.doorStyle || 'Swing'}</span>
                            </p>
                            <button
                                onClick={handleDoorSelection}
                                className="w-full py-1.5 px-3 bg-white border border-rose-200 text-rose-600 rounded text-xs font-medium hover:bg-rose-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
                            >
                                <Edit size={12} /> Edit Detailed Properties
                            </button>
                        </div>
                    )}
                </div>

                <hr />

                {/* 2. Animation Effect Toggle Section */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-2">
                            <Sparkles size={14} /> Animation Effect
                        </h3>
                        {/* Only enable animation toggle if door exists? Or allow independent? 
                            The effect is rendered by DoorWidget. So door must exist.
                            If door is hidden, animation might not show either?
                        */}
                        <input
                            type="checkbox"
                            className="toggle toggle-sm toggle-info"
                            checked={isAnimationEnabled}
                            // Disabled if door is not enabled? User said "toggle yes or false".
                            // Let's assume independent logic or auto-enable door.
                            onChange={(e) => handleAnimationToggle(e.target.checked)}
                        />
                    </div>

                    {isAnimationEnabled && (
                        <div className="pl-6 border-l-2 border-gray-100 ml-1.5 space-y-2">
                            <p className="text-[10px] text-gray-400">
                                Effect: <span className="font-medium text-gray-600 capitalize">{doorNode?.data.animationEffect || 'None'}</span>
                            </p>
                            <button
                                onClick={handleAnimationSelection}
                                className="w-full py-1.5 px-3 bg-white border border-blue-200 text-blue-600 rounded text-xs font-medium hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
                            >
                                <Edit size={12} /> Edit Animation Properties
                            </button>
                        </div>
                    )}
                </div>

                <hr />

                {/* Autoscroll Section */}
                <div className="space-y-3">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-2">
                        <PlayCircle size={14} /> Auto Scroll
                    </h3>
                    <div className="flex items-center justify-between">
                        <label className="text-xs text-gray-600">Enable Autoscroll</label>
                        <input
                            type="checkbox"
                            className="toggle toggle-sm"
                            checked={globalSettings.autoscroll}
                            onChange={(e) => updateGlobalSettings({ autoscroll: e.target.checked })}
                        />
                    </div>
                    {/* Autoscroll Settings */}
                    {globalSettings.autoscroll && (
                        <div className="space-y-2 mt-2 pl-6 border-l-2 border-gray-100 ml-1.5">
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] text-gray-500">Delay (Seconds)</label>
                                <input
                                    type="number"
                                    className="border rounded p-2 text-xs"
                                    placeholder="0"
                                    min="0"
                                    value={globalSettings.autoscrollDelay}
                                    onChange={(e) => updateGlobalSettings({ autoscrollDelay: parseInt(e.target.value) || 0 })}
                                />
                                <p className="text-[10px] text-gray-400">
                                    Time to wait after door opens before starting autoscroll
                                </p>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] text-gray-500">Speed (1-10)</label>
                                <input
                                    type="number"
                                    className="border rounded p-2 text-xs"
                                    placeholder="5"
                                    min="1"
                                    max="10"
                                    value={globalSettings.autoscrollSpeed}
                                    onChange={(e) => {
                                        const speed = parseInt(e.target.value) || 5;
                                        const clampedSpeed = Math.max(1, Math.min(10, speed));
                                        updateGlobalSettings({ autoscrollSpeed: clampedSpeed });
                                    }}
                                />
                                <p className="text-[10px] text-gray-400">
                                    1 = slowest, 10 = fastest
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <hr />

                {/* Scroll Animation Settings Section */}
                <div className="space-y-3">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-2">
                        <Eye size={14} /> Scroll Animation
                    </h3>
                    <div className="space-y-2 pl-6 border-l-2 border-gray-100 ml-1.5">
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] text-gray-500">Bottom Margin (px)</label>
                            <input
                                type="number"
                                className="border rounded p-2 text-xs"
                                placeholder="90"
                                min="0"
                                value={globalSettings.scrollAnimationBottomMargin}
                                onChange={(e) => updateGlobalSettings({ scrollAnimationBottomMargin: parseInt(e.target.value) || 90 })}
                            />
                            <p className="text-[10px] text-gray-400">
                                Distance from bottom of viewport to trigger scroll animations
                            </p>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] text-gray-500">Visibility Threshold (0-1)</label>
                            <input
                                type="number"
                                className="border rounded p-2 text-xs"
                                placeholder="0.1"
                                min="0"
                                max="1"
                                step="0.05"
                                value={globalSettings.scrollAnimationThreshold}
                                onChange={(e) => {
                                    const threshold = parseFloat(e.target.value) || 0.1;
                                    const clampedThreshold = Math.max(0, Math.min(1, threshold));
                                    updateGlobalSettings({ scrollAnimationThreshold: clampedThreshold });
                                }}
                            />
                            <p className="text-[10px] text-gray-400">
                                0.1 = 10% visible, 0.5 = 50% visible, 1.0 = 100% visible
                            </p>
                        </div>
                    </div>
                </div>

                <hr />

                {/* Background Music Section */}
                <div className="space-y-4">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-2">
                        <Music size={14} /> Background Music
                    </h3>

                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-gray-500">YouTube URL</label>
                        <input
                            type="text"
                            className="border rounded p-2 text-xs"
                            placeholder="https://youtube.com/watch?v=..."
                            value={globalSettings.backgroundMusic.url}
                            onChange={(e) => updateGlobalSettings({ url: e.target.value })}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-gray-500">Duration</label>
                        <select
                            className="border rounded p-2 text-xs"
                            value={globalSettings.backgroundMusic.duration === 0 ? 'full' : 'custom'}
                            onChange={(e) => {
                                if (e.target.value === 'full') {
                                    updateGlobalSettings({ duration: 0 });
                                } else {
                                    // Keep current custom value or set to a default
                                    const currentDuration = globalSettings.backgroundMusic.duration || 60;
                                    updateGlobalSettings({ duration: currentDuration });
                                }
                            }}
                        >
                            <option value="full">Full Duration</option>
                            <option value="custom">Custom</option>
                        </select>
                        {globalSettings.backgroundMusic.duration !== 0 && (
                            <input
                                type="number"
                                className="border rounded p-2 text-xs mt-1"
                                placeholder="Duration in seconds"
                                value={globalSettings.backgroundMusic.duration}
                                onChange={(e) => updateGlobalSettings({ duration: parseInt(e.target.value) || 0 })}
                            />
                        )}
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-gray-500">Start Time (Seconds)</label>
                        <input
                            type="number"
                            className="border rounded p-2 text-xs"
                            placeholder="0 (Start form beginning)"
                            value={globalSettings.backgroundMusic.startTime}
                            onChange={(e) => updateGlobalSettings({ startTime: parseInt(e.target.value) || 0 })}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}

export function SidebarToggle({ isOpen, onToggle }: { isOpen: boolean, onToggle: () => void }) {
    return (
        <button
            onClick={onToggle}
            className={cn(
                "absolute -left-6 top-4 z-50 bg-white border shadow-md p-1 rounded-l-md hover:bg-gray-50 text-gray-400",
                !isOpen && "-left-6"
            )}
        >
            {isOpen ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
    );
}
