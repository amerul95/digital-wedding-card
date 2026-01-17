"use client";

import { useEditorStore } from "@/components/editor/store";
import { cn } from "@/lib/utils";
import { SwingDoor } from "@/components/card/doorStyles/SwingDoor";
import { SlideDoors } from "@/components/card/doorStyles/SlideDoors";
import { EnvelopeDoors } from "@/components/card/doorStyles/EnvelopeDoors";
import { usePreview } from "@/components/editor/context/PreviewContext";
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
    const { isPreview } = usePreview();

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
        // Emit event for preview page to know doors are opening
        if (isPreview) {
            window.dispatchEvent(new CustomEvent('door-opened'));
        }
    };

    const handleReplay = () => {
        setIsOpen(false);
        setShowDoors(true);
    };

    const handleAnimationComplete = () => {
        if (isOpen) {
            setShowDoors(false);
            // Emit event when door animation completes
            if (isPreview) {
                window.dispatchEvent(new CustomEvent('door-animation-complete'));
            }
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
        opacity: data.doorOpacity ?? 100, // Pass doorOpacity to door components
        blur: data.doorBlur ?? 0, // Pass doorBlur to door components
        showReplayButton: !isPreview, // Only show replay button in editor mode, not preview
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
        doorButtonOpenTextFontFamily: data.doorButtonOpenTextFontFamily,
        doorButtonAnimation: data.doorButtonAnimation,
    };

    return (
        <div
            className={cn(
                "absolute inset-0 z-30 transition-all duration-200 group",
                isSelected ? "ring-2 ring-blue-500" : "hover:ring-1 hover:ring-blue-300"
            )}
            style={{
                ...style,
                position: 'absolute',
                top: style.top ?? 0,
                left: style.left ?? 0,
                right: style.right ?? 0,
                bottom: style.bottom ?? 0,
                width: style.width || '100%',
                height: '100vh', // Fixed viewport height, don't expand with content
                maxHeight: '100vh', // Ensure it never exceeds viewport height
                pointerEvents: 'none', // Allow clicks to pass through by default
            }}
        >
            {/* Wrapper to ensure Door takes full space - only capture events on door elements */}
            <div 
                className="absolute inset-0 overflow-hidden pointer-events-none"
            >
                <DoorComponent {...doorProps} />
            </div>

            {/* Editor Overlay to allow selection even if doors are "open" or interaction is complex */}
            <div 
                className="absolute inset-0 z-40 border-2 border-transparent group-hover:border-blue-300/30" 
                style={{ pointerEvents: 'none' }}
            />

            {/* Small selection area at top-left corner - allows selecting door widget without blocking content */}
            <div 
                className="absolute top-0 left-0 w-16 h-16 z-50 cursor-pointer"
                onClick={handleClick}
                title="Click to select door widget"
            />

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
