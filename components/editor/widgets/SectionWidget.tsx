"use client";

import { useEditorStore } from "@/components/editor/store";
import { cn } from "@/lib/utils";
import { useDroppable } from "@dnd-kit/core";

interface SectionWidgetProps {
    id: string;
    data: any;
    style: any;
    children?: React.ReactNode;
}

const LAYOUT_KEYS = [
    'display', 'flexDirection', 'justifyContent', 'alignItems', 'gap', 'gridTemplateColumns'
];

export function SectionWidget({ id, data, style, children }: SectionWidgetProps) {
    const selectNode = useEditorStore((state) => state.selectNode);
    const selectedId = useEditorStore((state) => state.selectedId);

    const { setNodeRef, isOver } = useDroppable({
        id: id,
        data: {
            type: 'section',
        }
    });

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        selectNode(id);
    };

    const isSelected = selectedId === id;

    // Split styles
    const layoutStyle: React.CSSProperties = {};
    const boxStyle: React.CSSProperties = {};

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
        ...((style as any).gradientType === 'linear' && (style as any).gradientColor1 && (style as any).gradientColor2 ? {
            background: `linear-gradient(${style.gradientDirection || 'to bottom'}, ${(style as any).gradientColor1}, ${(style as any).gradientColor2})`,
        } : {}),
    };

    // Ensure Section specific defaults are respected if not overwritten
    if (layoutStyle.display === undefined) layoutStyle.display = 'block';

    return (
        <section
            ref={setNodeRef}
            className={cn(
                "relative w-full transition-all group",
                "border-b border-transparent hover:border-blue-200",
                isSelected ? "ring-2 ring-blue-500 z-10" : "",
                isOver ? "bg-blue-50/30" : "",
                !boxStyle.backgroundImage && "bg-white", // Default white if no image
            )}
            style={{
                ...boxStyle,
                ...bgStyle,
                // Height defaults
                minHeight: boxStyle?.height === 'full' ? '100vh' : (boxStyle?.minHeight || '150px'),
                height: boxStyle?.height === 'auto' ? 'auto' : boxStyle?.height,
                // Padding applies to outer or inner? 
                // Usually Padding fits on outer, affecting inner size.
                padding: boxStyle?.padding || '20px 0',
            }}
            onClick={handleClick}
        >
            {/* Label for the section */}
            <div className={cn(
                "absolute top-0 left-0 bg-blue-500 text-white text-[10px] px-2 py-0.5 opacity-0 transition-opacity z-20 pointer-events-none",
                isSelected || isOver ? "opacity-100" : "group-hover:opacity-100"
            )}>
                Section
            </div>

            {/* Inner Content Wrapper - Recieves Layout Styles */}
            <div
                className="px-4 relative z-10 h-full"
                style={layoutStyle}
            >
                {children}
            </div>

            {!children && (
                <div className="h-20 flex items-center justify-center text-gray-300 pointer-events-none text-sm border border-dashed border-gray-100 rounded m-2">
                    Empty Section
                </div>
            )}
        </section>
    );
}
