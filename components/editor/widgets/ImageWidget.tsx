"use client";

import { useEditorStore } from "@/components/editor/store";
import { cn } from "@/lib/utils";
import { Image as ImageIcon, Upload } from "lucide-react";
import React from "react";
import { usePreview } from "@/components/editor/context/PreviewContext";

interface ImageWidgetProps {
    id: string;
    data: any;
    style: any;
}

export function ImageWidget({ id, data, style }: ImageWidgetProps) {
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

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            updateNodeData(id, { url });
        }
    };

    return (
        <div
            className={cn(
                "relative transition-all p-1 group",
                !isPreview && (isSelected ? "ring-2 ring-blue-500 z-10" : "hover:ring-1 hover:ring-blue-300"),
            )}
            style={style}
            onClick={handleClick}
        >
            {data.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={data.url} alt="Widget" className="w-full h-auto rounded" />
            ) : (
                <div className={cn(
                    "w-full h-48 bg-gray-100 rounded-lg flex flex-col items-center justify-center text-gray-400 gap-2 hover:bg-gray-50 cursor-pointer relative",
                    !isPreview && "border-2 border-dashed border-gray-200"
                )}>
                    <ImageIcon size={24} />
                    <span className="text-xs">Choose Image</span>

                    {/* Invisible file input covering the area */}
                    <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={handleFileUpload}
                    />
                </div>
            )}
        </div>
    );
}
