"use client";

import { useEditorStore } from "@/components/editor/store";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useWidgetAnimations } from "@/components/editor/utils/animationUtils";
import { usePreview } from "@/components/editor/context/PreviewContext";

interface TextWidgetProps {
    id: string;
    data: any;
    style: any;
}

export function TextWidget({ id, data, style }: TextWidgetProps) {
    const selectNode = useEditorStore((state) => state.selectNode);
    const selectedId = useEditorStore((state) => state.selectedId);
    const updateNodeData = useEditorStore((state) => state.updateNodeData);
    const { isPreview } = usePreview();

    const handleClick = (e: React.MouseEvent) => {
        if (isPreview) return; // Don't allow selection in preview mode
        e.stopPropagation();
        selectNode(id);
    };

    const isSelected = !isPreview && selectedId === id;

    // Use animation hooks
    const { widgetRef, controls, motionInitial, motionAnimate, animationVariants, useMotion } = useWidgetAnimations(
        id,
        data.initialAnimation,
        data.scrollAnimation
    );

    const MotionDiv = motion.div as any;

    // Render HTML content safely
    return (
        <MotionDiv
            ref={widgetRef}
            {...(useMotion ? {
                animate: controls,
                initial: motionInitial,
                variants: animationVariants,
            } : {})}
            className={cn(
                "relative transition-all p-2 group",
                !isPreview && (isSelected ? "ring-2 ring-blue-500 z-10" : "hover:ring-1 hover:ring-blue-300"),
            )}
            style={style}
            onClick={handleClick}
        >
            <div
                className="outline-none min-h-[1em] prose prose-sm max-w-none"
                style={{
                    // Ensure text styles from parent are applied
                    color: style?.color || 'inherit',
                    textAlign: style?.textAlign || 'inherit',
                    // Ensure text is not cut off
                    overflow: 'visible',
                    wordWrap: 'break-word',
                    whiteSpace: 'pre-wrap'
                }}
                dangerouslySetInnerHTML={{ __html: data.content || '<p>Start typing...</p>' }}
            />
        </MotionDiv>
    );
}
