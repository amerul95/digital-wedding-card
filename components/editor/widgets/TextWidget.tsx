"use client";

import { useEditorStore } from "@/components/editor/store";
import { cn } from "@/lib/utils";

interface TextWidgetProps {
    id: string;
    data: any;
    style: any;
}

export function TextWidget({ id, data, style }: TextWidgetProps) {
    const selectNode = useEditorStore((state) => state.selectNode);
    const selectedId = useEditorStore((state) => state.selectedId);
    const updateNodeData = useEditorStore((state) => state.updateNodeData);

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        selectNode(id);
    };

    const isSelected = selectedId === id;

    // Render HTML content safely
    return (
        <div
            className={cn(
                "relative transition-all p-2 group",
                isSelected ? "ring-2 ring-blue-500 z-10" : "hover:ring-1 hover:ring-blue-300",
            )}
            style={style}
            onClick={handleClick}
        >
            <div
                className="outline-none min-h-[1em] prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: data.content || '<p>Start typing...</p>' }}
            />
        </div>
    );
}
