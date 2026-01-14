"use client";

import { useEditorStore } from "@/components/editor/store";
import { cn } from "@/lib/utils";
import React from "react";

interface ButtonWidgetProps {
    id: string;
    data: any;
    style: any;
}

export function ButtonWidget({ id, data, style }: ButtonWidgetProps) {
    const selectNode = useEditorStore((state) => state.selectNode);
    const selectedId = useEditorStore((state) => state.selectedId);

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        selectNode(id);
    };

    const isSelected = selectedId === id;

    // Alignment wrapper style
    // We use the 'textAlign' prop from style to determine flex alignment
    const wrapperStyle: React.CSSProperties = {
        display: 'flex',
        width: '100%',
        justifyContent: style.textAlign === 'center' ? 'center' : style.textAlign === 'right' ? 'flex-end' : 'flex-start',
        padding: '4px', // Touch target / visual breathing room
    };

    // Button specific style
    // Filter out styles that apply to wrapper (like textAlign) if necessary, 
    // but mostly we want borders/fonts on the button.
    const buttonStyle: React.CSSProperties = {
        backgroundColor: style.backgroundColor || '#111827', // Default gray-900
        color: style.color || '#ffffff',
        padding: style.padding || '10px 24px',
        fontSize: style.fontSize || '14px',
        fontWeight: style.fontWeight || '500',
        fontFamily: style.fontFamily,
        // Borders
        borderTopWidth: style.borderTopWidth,
        borderRightWidth: style.borderRightWidth,
        borderBottomWidth: style.borderBottomWidth,
        borderLeftWidth: style.borderLeftWidth,
        borderColor: style.borderTopColor, // Simplification: if specific sides needed, we'd map them. 
        // For HTML elements, 'borderColor' sets all sets, but 'border-top-color' etc work too.
        // Let's pass the specific side colors.
        borderTopColor: style.borderTopColor,
        borderRightColor: style.borderRightColor,
        borderBottomColor: style.borderBottomColor,
        borderLeftColor: style.borderLeftColor,
        borderStyle: style.borderStyle,
        // Radius
        borderTopLeftRadius: style.borderRadiusTopLeft,
        borderTopRightRadius: style.borderRadiusTopRight,
        borderBottomLeftRadius: style.borderRadiusBottomLeft,
        borderBottomRightRadius: style.borderRadiusBottomRight,
        ...style // Spread rest, but be careful of conflicting display/positioning that might break the button internals
    };

    // Clean up style to avoid passing wrapper-only styles to button if strictly needed, 
    // but React is usually forgiving. 
    // Important: 'textAlign' on button text usually aligns text *inside* button. 
    // The user asked for "button align for left, center or right for position in container".
    // So wrapper handles position. Button handles internal.

    return (
        <div
            style={wrapperStyle}
            onClick={handleClick}
            className={cn("group relative", isSelected ? "ring-2 ring-blue-500 ring-offset-2 z-10" : "hover:ring-1 hover:ring-blue-300")}
        >
            {/* Use a span or div for the button to avoid form submission behaviors if ever placed in form, 
                 though strictly 'button' tag is semantic. type='button' prevents submit. */}
            <button
                type="button"
                className="shadow-sm transition-all duration-200 active:scale-95"
                style={buttonStyle}
            >
                {data.label || "Button"}
            </button>
        </div>
    );
}
