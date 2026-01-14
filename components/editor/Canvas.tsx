"use client";

import { Canvas as OriginalCanvas } from "@/components/editor/Canvas";
import { CardStage } from "@/components/editor/canvas/CardStage";

export function Canvas() {
    return (
        <div className="flex-1 bg-gray-100 p-4 overflow-y-auto flex justify-center items-start min-h-0">
            <CardStage />
        </div>
    );
}
