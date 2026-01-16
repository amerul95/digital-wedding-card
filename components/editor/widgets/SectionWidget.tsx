"use client";

import { useEditorStore } from "@/components/editor/store";
import { cn } from "@/lib/utils";
import { useDroppable } from "@dnd-kit/core";
import { useMobileFrame } from "@/components/editor/context/MobileFrameContext";
import { usePreview } from "@/components/editor/context/PreviewContext";

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
    const { isMobile, frameHeight } = useMobileFrame();
    const { isPreview } = usePreview();

    const { setNodeRef, isOver } = useDroppable({
        id: id,
        data: {
            type: 'section',
        },
        disabled: isPreview, // Disable drag and drop in preview mode
    });

    const handleClick = (e: React.MouseEvent) => {
        if (isPreview) return; // Don't allow selection in preview mode
        e.stopPropagation();
        selectNode(id);
    };

    const isSelected = !isPreview && selectedId === id;

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
            data-section-id={id}
            className={cn(
                "relative w-full transition-all block", // Ensure block display for proper stacking
                !isPreview && "group", // Only add group class in editor mode
                !isPreview && "border-b border-transparent hover:border-blue-200", // Only show hover border in editor mode
                isSelected ? "ring-2 ring-blue-500 z-10" : "",
                !isPreview && isOver ? "bg-blue-50/30" : "", // Only show drop indicator in editor mode
                !boxStyle.backgroundImage && "bg-white", // Default white if no image
            )}
            style={{
                ...boxStyle,
                ...bgStyle,
                // Ensure box-sizing is border-box so padding is included in height calculation
                boxSizing: 'border-box',
                // Height handling
                // When height is 'full' and we're in mobile frame, use frame height instead of viewport height
                // For 'auto' height in mobile frame, use 200px minHeight
                minHeight: boxStyle?.height === 'full' 
                    ? (isMobile && frameHeight > 0 ? `${frameHeight}px` : '100vh')
                    : (boxStyle?.height === 'auto' 
                        ? (isMobile ? '200px' : (boxStyle?.minHeight || '150px'))
                        : (boxStyle?.minHeight || '150px')),
                // Set actual height when 'full' to prevent overflow
                // With border-box, padding is included in the height, so section will be exactly frameHeight
                // For 'auto', let it size naturally based on content
                height: boxStyle?.height === 'full' 
                    ? (isMobile && frameHeight > 0 ? `${frameHeight}px` : '100vh')
                    : (boxStyle?.height === 'auto' ? 'auto' : boxStyle?.height),
                // Padding applies to outer or inner? 
                // Usually Padding fits on outer, affecting inner size.
                // With border-box, this padding is included in the height above
                padding: boxStyle?.padding || '20px 0',
            }}
            onClick={handleClick}
        >
            {/* Label for the section - only show in editor mode */}
            {!isPreview && (
                <div className={cn(
                    "absolute top-0 left-0 bg-blue-500 text-white text-[10px] px-2 py-0.5 opacity-0 transition-opacity z-20 pointer-events-none",
                    isSelected || isOver ? "opacity-100" : "group-hover:opacity-100"
                )}>
                    Section
                </div>
            )}

            {/* Inner Content Wrapper - Recieves Layout Styles */}
            <div
                className="px-4 relative z-10 h-full"
                style={layoutStyle}
            >
                {children}
            </div>

            {/* Empty Section placeholder - only show in editor mode */}
            {!isPreview && !children && (
                <div className="h-20 flex items-center justify-center text-gray-300 pointer-events-none text-sm border border-dashed border-gray-100 rounded m-2">
                    Empty Section
                </div>
            )}
        </section>
    );
}
