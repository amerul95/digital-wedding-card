"use client";

import { useEditorStore } from "@/components/editor/store";
import { Eye, Save } from "lucide-react";
import { useRouter } from "next/navigation";

export function TopBar() {
    const router = useRouter();

    const handlePreview = () => {
        // Serialize current state
        const state = useEditorStore.getState();
        const previewData = {
            nodes: state.nodes,
            rootId: state.rootId,
            globalSettings: state.globalSettings, // Include globalSettings (background music/video settings)
            viewOptions: state.viewOptions // Include viewOptions as well
        };

        // Save to localStorage
        localStorage.setItem("wedding-card-preview-data", JSON.stringify(previewData));

        // Open preview in new tab
        window.open("/designer/preview", "_blank");
    };

    return (
        <div className="h-14 border-b bg-white flex items-center px-4 justify-between z-30 relative shadow-sm">
            <div className="font-bold flex items-center gap-2">
                <span>Wedding Card Editor</span>
                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">v2.0</span>
            </div>
            <div className="flex gap-2">
                <button
                    onClick={handlePreview}
                    className="px-4 py-2 text-sm bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded flex items-center gap-2 transition-colors"
                >
                    <Eye size={16} />
                    Preview
                </button>
                <button className="px-4 py-2 text-sm bg-gray-900 hover:bg-black text-white rounded flex items-center gap-2 transition-colors">
                    <Save size={16} />
                    Save
                </button>
            </div>
        </div>
    );
}
