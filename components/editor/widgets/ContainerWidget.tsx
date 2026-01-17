"use client";

import { useEditorStore } from "@/components/editor/store";
import { cn } from "@/lib/utils";
import { useDroppable } from "@dnd-kit/core";

interface ContainerWidgetProps {
    id: string;
    data: any;
    style: any;
    children?: React.ReactNode;
}

const LAYOUT_KEYS = [
    'display', 'flexDirection', 'justifyContent', 'alignItems', 'gap', 'gridTemplateColumns'
];

export function ContainerWidget({ id, data, style, children }: ContainerWidgetProps) {
    const selectNode = useEditorStore((state) => state.selectNode);
    const selectedId = useEditorStore((state) => state.selectedId);

    const { setNodeRef, isOver } = useDroppable({
        id: id,
        data: {
            type: 'container',
        }
    });

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        selectNode(id);
    };

    const isSelected = selectedId === id;

    // Split styles
    const layoutStyle: React.CSSProperties = {};
    const boxStyle: React.CSSProperties & Record<string, any> = {};

    Object.entries(style || {}).forEach(([key, value]) => {
        if (LAYOUT_KEYS.includes(key)) {
            // @ts-ignore
            layoutStyle[key] = value;
        } else {
            // @ts-ignore
            boxStyle[key] = value;
        }
    });

    const bgStyle: React.CSSProperties = {
        ...(boxStyle.backgroundImage ? {
            backgroundImage: `url(${boxStyle.backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
        } : {}),
        ...(boxStyle.gradientType === 'linear' && boxStyle.gradientColor1 && boxStyle.gradientColor2 ? {
            background: `linear-gradient(${boxStyle.gradientDirection || 'to bottom'}, ${boxStyle.gradientColor1}, ${boxStyle.gradientColor2})`,
        } : {}),
    };

    // Handle background opacity if present
    if (!bgStyle.background && !bgStyle.backgroundImage && boxStyle.backgroundColor) {
        const opacity = boxStyle.backgroundOpacity !== undefined ? parseFloat(boxStyle.backgroundOpacity) : 1;
        if (opacity < 1) {
            const hex = boxStyle.backgroundColor.toString();
            // Convert hex to rgba
            let r = 0, g = 0, b = 0;
            if (hex.length === 4) {
                r = parseInt(hex[1] + hex[1], 16);
                g = parseInt(hex[2] + hex[2], 16);
                b = parseInt(hex[3] + hex[3], 16);
            } else if (hex.length === 7) {
                r = parseInt(hex.substring(1, 3), 16);
                g = parseInt(hex.substring(3, 5), 16);
                b = parseInt(hex.substring(5, 7), 16);
            }
            bgStyle.backgroundColor = `rgba(${r}, ${g}, ${b}, ${opacity})`;
            // Remove raw background color from boxStyle so it doesn't override
            delete boxStyle.backgroundColor;
        }
    }

    // Apply backdrop blur if specified
    const backdropBlur = (boxStyle as any).backdropBlur ?? 0;
    const backdropBlurFilter = backdropBlur > 0 ? `blur(${backdropBlur}px)` : 'none';

    return (
        <div
            ref={setNodeRef}
            className={cn(
                "relative transition-all min-h-[20px] m-2 rounded border border-dashed",
                isSelected ? "ring-2 ring-blue-500 border-blue-500 z-10" : "border-gray-300 hover:border-blue-300",
                isOver ? "bg-blue-50/50" : "bg-transparent"
            )}
            style={{
                ...boxStyle,
                ...bgStyle,
                padding: boxStyle?.padding || '16px',
                backdropFilter: backdropBlurFilter,
                WebkitBackdropFilter: backdropBlurFilter, // Safari support
            }}
            onClick={handleClick}
        >
            {/* Label for the container */}
            <div className={cn(
                "absolute -top-3 left-2 bg-gray-200 text-gray-600 text-[9px] px-1.5 py-0.5 rounded opacity-0 transition-opacity uppercase font-bold tracking-wider pointer-events-none z-20",
                isSelected || isOver ? "opacity-100" : "group-hover:opacity-100"
            )}>
                Container
            </div>

            {/* Inner Content Wrapper - Recieves Layout Styles */}
            <div
                className="relative z-10"
                style={layoutStyle}
            >
                {children}
            </div>

            {!children && (
                <div className="h-full flex items-center justify-center text-xs text-gray-300 pointer-events-none">
                    Drop items
                </div>
            )}
        </div>
    );
}
