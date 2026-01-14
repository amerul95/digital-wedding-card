"use client";

import { useEditorStore } from "@/components/editor/store";
import { cn } from "@/lib/utils";
import { SectionWidget } from "@/components/editor/widgets/SectionWidget";
import { ContainerWidget } from "@/components/editor/widgets/ContainerWidget";
import { TextWidget } from "@/components/editor/widgets/TextWidget";
import { ImageWidget } from "@/components/editor/widgets/ImageWidget";
import { CoupleHeaderWidget } from "@/components/editor/widgets/CoupleHeaderWidget";
import { ImageSliderWidget } from "@/components/editor/widgets/ImageSliderWidget";
import { CountdownWidget } from "@/components/editor/widgets/CountdownWidget";
import { BottomNavWidget } from "@/components/editor/widgets/BottomNavWidget";
import { ButtonWidget } from "@/components/editor/widgets/ButtonWidget";

export function NodeRenderer({ nodeId }: { nodeId: string }) {
    const node = useEditorStore((state) => state.nodes[nodeId]);
    const selectNode = useEditorStore((state) => state.selectNode);
    const selectedId = useEditorStore((state) => state.selectedId);

    if (!node) return null;

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        selectNode(nodeId);
    };

    const isSelected = selectedId === nodeId;

    // Render children recursively
    const content = node.children?.map(childId => (
        <NodeRenderer key={childId} nodeId={childId} />
    ));

    switch (node.type) {
        case 'section':
            return (
                <SectionWidget id={nodeId} data={node.data} style={node.style}>
                    {content.length > 0 ? content : null}
                </SectionWidget>
            );
        case 'container':
            return (
                <ContainerWidget id={nodeId} data={node.data} style={node.style}>
                    {content.length > 0 ? content : null}
                </ContainerWidget>
            );
        case 'text':
            return <TextWidget id={nodeId} data={node.data} style={node.style} />;
        case 'image':
            return <ImageWidget id={nodeId} data={node.data} style={node.style} />;
        case 'couple-header':
            return <CoupleHeaderWidget id={nodeId} data={node.data} style={node.style} />;
        case 'slider':
            return <ImageSliderWidget id={nodeId} data={node.data} style={node.style} />;
        case 'countdown':
            return <CountdownWidget id={nodeId} data={node.data} style={node.style} />;
        case 'bottom-nav':
            return <BottomNavWidget id={nodeId} data={node.data} style={node.style} />;

        // Other widgets can be inline here or extracted similarly
        case 'button':
            return <ButtonWidget id={nodeId} data={node.data} style={node.style} />;
        default:
            return (
                <div
                    className={cn("p-2 border border-red-200 bg-red-50 text-xs text-red-500", isSelected ? "ring-2 ring-blue-500" : "")}
                    onClick={handleClick}
                >
                    {node.type}
                </div>
            );
    }
}
