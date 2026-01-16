"use client";

import { useEditorStore } from "@/components/editor/store";
import { cn } from "@/lib/utils";
import { SwingDoor } from "@/components/card/doorStyles/SwingDoor";
import { SlideDoors } from "@/components/card/doorStyles/SlideDoors";
import { EnvelopeDoors } from "@/components/card/doorStyles/EnvelopeDoors";
import React, { useState, useEffect } from "react";

interface DoorWidgetProps {
    id: string;
    data: any;
    style: any;
}

export function DoorWidget({ id, data, style }: DoorWidgetProps) {
    const selectNode = useEditorStore((state) => state.selectNode);
    const selectedId = useEditorStore((state) => state.selectedId);
    const viewOptions = useEditorStore((state) => state.viewOptions);

    // All hooks must be called before any early returns
    const [isOpen, setIsOpen] = useState(false);
    const [showDoors, setShowDoors] = useState(true);

    // Visibility Logic: Hidden if data.isHidden ("Hide" toggle) OR !viewOptions.showDoorOverlay ("View" toggle)
    if (data.isHidden || !viewOptions.showDoorOverlay) return null;

    // Optional: Reset door state when toggling between edit/view or re-selecting?
    // For now we keep local state persistent per mount.

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        selectNode(id);
    };

    const isSelected = selectedId === id;

    const handleOpen = () => {
        setIsOpen(true);
    };

    const handleReplay = () => {
        setIsOpen(false);
        setShowDoors(true);
    };

    const handleAnimationComplete = () => {
        if (isOpen) {
            setShowDoors(false);
        }
    };

    const DoorComponent = (() => {
        switch (data.doorStyle) {
            case 'slide': return SlideDoors;
            case 'envelope': return EnvelopeDoors;
            case 'swing': default: return SwingDoor;
        }
    })();

    const doorProps = {
        eventTitle: data.title || "Wedding",
        doorsOpen: isOpen,
        showDoors: showDoors,
        onOpen: handleOpen,
        onReplay: handleReplay,
        onAnimationComplete: handleAnimationComplete,
        color: data.doorColor || "#f43f5e",
        // Animation Properties
        animationEffect: viewOptions.showAnimation ? (data.animationEffect || 'none') : 'none',
        effectColor: data.effectColor,

        doorButtonText: data.doorButtonText,
        doorButtonType: data.doorButtonType,
        doorButtonTextMarginTop: data.doorButtonTextMarginTop,
        doorButtonTextMarginRight: data.doorButtonTextMarginRight,
        doorButtonTextMarginBottom: data.doorButtonTextMarginBottom,
        doorButtonTextMarginLeft: data.doorButtonTextMarginLeft,
        doorButtonPaddingX: data.doorButtonPaddingX,
        doorButtonPaddingY: data.doorButtonPaddingY,
        doorButtonMarginTop: data.doorButtonMarginTop,
        doorButtonMarginRight: data.doorButtonMarginRight,
        doorButtonMarginBottom: data.doorButtonMarginBottom,
        doorButtonMarginLeft: data.doorButtonMarginLeft,
        doorButtonBorderRadius: data.doorButtonBorderRadius,
        doorButtonWidth: data.doorButtonWidth,
        doorButtonBorderSize: data.doorButtonBorderSize,
        doorButtonBorderColor: data.doorButtonBorderColor,
        doorButtonBackgroundColor: data.doorButtonBackgroundColor,
        doorButtonBoxShadow: data.doorButtonBoxShadow,
        doorButtonOpenTextColor: data.doorButtonOpenTextColor,
        doorButtonAnimation: data.doorButtonAnimation,
    };

    return (
        <div
            className={cn(
                "relative z-30 transition-all duration-200 group min-h-[50vh]",
                isSelected ? "ring-2 ring-blue-500" : "hover:ring-1 hover:ring-blue-300"
            )}
            style={{
                ...style,
                height: style.height || '100%',
                width: style.width || '100%'
            }}
            onClick={handleClick}
        >
            {/* Wrapper to ensure Door takes full space */}
            <div className="absolute inset-0 overflow-hidden pointer-events-auto">
                <DoorComponent {...doorProps} />
            </div>

            {/* Editor Overlay to allow selection even if doors are "open" or interaction is complex */}
            <div className="absolute inset-0 z-40 pointer-events-none border-2 border-transparent group-hover:border-blue-300/30" />

            {isSelected && (
                <div className="absolute top-2 right-2 z-50 flex gap-2">
                    <button
                        className="bg-white text-xs px-2 py-1 rounded shadow pointer-events-auto"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleReplay();
                        }}
                    >
                        Reset Doors
                    </button>
                </div>
            )}
        </div>
    );
}
