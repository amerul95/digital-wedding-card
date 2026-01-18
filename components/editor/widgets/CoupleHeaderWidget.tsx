"use client";

import { useEditorStore } from "@/components/editor/store";
import { cn } from "@/lib/utils";
import { usePreview } from "@/components/editor/context/PreviewContext";

interface CoupleHeaderWidgetProps {
    id: string;
    data: any;
    style: any;
}

export function CoupleHeaderWidget({ id, data, style }: CoupleHeaderWidgetProps) {
    const selectNode = useEditorStore((state) => state.selectNode);
    const selectedId = useEditorStore((state) => state.selectedId);
    const { isPreview } = usePreview();

    const handleClick = (e: React.MouseEvent) => {
        if (isPreview) return; // Don't allow selection in preview mode
        e.stopPropagation();
        selectNode(id);
    };

    const isSelected = !isPreview && selectedId === id;

    return (
        <div
            className={cn(
                "relative transition-all p-6 text-center group",
                !isPreview && (isSelected ? "ring-2 ring-blue-500 z-10" : "hover:ring-1 hover:ring-blue-300"),
            )}
            style={style}
            onClick={handleClick}
        >
            <div className="font-serif text-4xl mb-2 text-gray-800">
                {data.groomName || "Groom"} & {data.brideName || "Bride"}
            </div>
            <div className="text-sm text-gray-500 uppercase tracking-widest mb-4">
                are getting married
            </div>
            <div className="text-lg font-medium text-gray-700">
                {data.date || "Sunday, May 24th, 2026"}
            </div>
        </div>
    );
}
