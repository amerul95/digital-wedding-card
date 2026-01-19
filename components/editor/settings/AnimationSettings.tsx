"use client";

import { useEditorStore } from "@/components/editor/store";
import { Sparkles } from "lucide-react";

const ANIMATION_EFFECTS = [
    { value: "none", label: "No Effect" },
    { value: "snow", label: "Snow" },
    { value: "petals", label: "Petals" },
    { value: "bubbles", label: "Bubbles" },
] as const;

export function AnimationSettings() {
    const nodes = useEditorStore((state) => state.nodes);
    const updateNodeData = useEditorStore((state) => state.updateNodeData);

    // Find door node (animation properties are stored on door node)
    const doorNodeEntry = Object.entries(nodes).find(([_, n]) => n.type === 'door');
    const doorNodeId = doorNodeEntry ? doorNodeEntry[0] : null;
    const doorNode = doorNodeEntry ? doorNodeEntry[1] : null;

    if (!doorNodeId || !doorNode) {
        return (
            <div className="text-gray-400 text-sm text-center mt-10 p-4">
                Door overlay must be enabled to configure animation properties.
            </div>
        );
    }

    const handleUpdate = (data: any) => {
        updateNodeData(doorNodeId, data);
    };

    return (
        <div className="flex flex-col gap-6">
            {/* === ANIMATION PROPERTIES SECTION === */}
            <div className="space-y-4 border rounded-lg p-3 bg-white shadow-sm">
                <h4 className="text-xs uppercase font-bold text-blue-600 flex items-center gap-2 border-b pb-2">
                    <Sparkles size={14} /> Animation Properties
                </h4>

                {/* Animation Selection */}
                <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-gray-700">Animation Effect</label>
                    <select
                        className="w-full text-xs p-2 border rounded bg-gray-50 focus:bg-white focus:ring-1 focus:ring-blue-200 transition-colors"
                        value={doorNode.data.animationEffect || 'none'}
                        onChange={(e) => handleUpdate({ animationEffect: e.target.value })}
                    >
                        {ANIMATION_EFFECTS.map(effect => (
                            <option key={effect.value} value={effect.value}>{effect.label}</option>
                        ))}
                    </select>
                </div>

                {(doorNode.data.animationEffect && doorNode.data.animationEffect !== 'none') && (
                    <div className="space-y-1 pt-2">
                        <label className="text-[10px] text-gray-500">Effect Color</label>
                        <div className="flex gap-2">
                            <input
                                type="color"
                                className="h-8 w-8 cursor-pointer rounded border p-0"
                                value={doorNode.data.effectColor || '#f43f5e'}
                                onChange={(e) => handleUpdate({ effectColor: e.target.value })}
                            />
                            <input
                                type="text"
                                className="flex-1 text-xs border rounded px-2"
                                value={doorNode.data.effectColor || '#f43f5e'}
                                onChange={(e) => handleUpdate({ effectColor: e.target.value })}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
