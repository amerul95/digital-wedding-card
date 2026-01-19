"use client";

import { EditorLayout } from "@/components/editor/EditorLayout";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useEditorStore } from "@/components/editor/store";

export default function CreateThemePage() {
    const searchParams = useSearchParams();
    const themeId = searchParams.get('id');
    const [isLoading, setIsLoading] = useState(!!themeId);

    useEffect(() => {
        async function loadTemplate() {
            if (!themeId) {
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch(`/api/designer/themes/${themeId}`);
                if (response.ok) {
                    const data = await response.json();
                    const config = data.config || {};
                    
                    // Load editorData if it exists
                    if (config.editorData) {
                        useEditorStore.setState({
                            nodes: config.editorData.nodes || {},
                            rootId: config.editorData.rootId || 'root',
                            selectedId: null,
                            globalSettings: config.editorData.globalSettings || {},
                            viewOptions: config.editorData.viewOptions || {},
                        });
                    }
                } else {
                    console.error('Failed to load theme:', response.statusText);
                }
            } catch (error) {
                console.error('Error loading theme:', error);
            } finally {
                setIsLoading(false);
            }
        }

        loadTemplate();
    }, [themeId]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-gray-500">Loading template...</div>
            </div>
        );
    }

    return (
        <EditorLayout />
    );
}
