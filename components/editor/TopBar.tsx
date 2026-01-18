"use client";

import { useEditorStore } from "@/components/editor/store";
import { Eye, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import axios from "axios";
import html2canvas from "html2canvas";
import { NodeRenderer } from "@/components/editor/NodeRenderer";
import { PreviewProvider } from "@/components/editor/context/PreviewContext";

export function TopBar() {
    const router = useRouter();
    const [showSaveDialog, setShowSaveDialog] = useState(false);
    const [templateName, setTemplateName] = useState("");
    const [themeName, setThemeName] = useState("wedding");
    const [color, setColor] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const thumbnailRef = useRef<HTMLDivElement>(null);

    /**
     * Generates a thumbnail of the first section (excluding door)
     */
    const generateThumbnail = async (): Promise<string | null> => {
        const state = useEditorStore.getState();
        const { nodes, rootId } = state;

        // Find root node
        const rootNode = nodes[rootId];
        if (!rootNode) return null;

        // Find first section (excluding door)
        const firstSectionId = rootNode.children.find((childId) => {
            const child = nodes[childId];
            return child && child.type === 'section';
        });

        if (!firstSectionId) return null;

        // Wait for DOM to update if thumbnailRef is not ready
        await new Promise(resolve => setTimeout(resolve, 100));

        if (!thumbnailRef.current) return null;

        try {
            const canvas = await html2canvas(thumbnailRef.current, {
                width: 375,
                height: 667,
                scale: 1,
                backgroundColor: '#ffffff',
                useCORS: true,
                logging: false,
            });

            return canvas.toDataURL('image/png', 0.9);
        } catch (error) {
            console.error('[TopBar] Error generating thumbnail:', error);
            return null;
        }
    };

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

    const handleSave = async () => {
        if (!templateName.trim() || !themeName.trim() || !color.trim()) {
            alert("Please fill in all required fields (Template Name, Theme Name, and Color)");
            return;
        }

        setIsSaving(true);

        try {
            // Generate thumbnail before saving
            const thumbnailDataUrl = await generateThumbnail();

            // Get all editor data from store
            const state = useEditorStore.getState();
            const editorData = {
                nodes: state.nodes,
                rootId: state.rootId,
                globalSettings: state.globalSettings,
                viewOptions: state.viewOptions,
            };

            // Prepare config with editorData
            const config = {
                themeName: themeName.trim().toLowerCase(),
                color: color.trim().toUpperCase(),
                editorData: editorData, // Include all editor data (nodes, settings, etc.)
            };

            // Save template to API with thumbnail
            const response = await axios.post('/api/designer/themes', {
                name: templateName.trim(),
                config: config,
                type: 'template',
                defaultEventData: null,
                previewImageUrl: thumbnailDataUrl, // Include generated thumbnail
            });

            if (response.status === 201) {
                alert("Template saved successfully! It will appear in the catalog.");
                setShowSaveDialog(false);
                setTemplateName("");
                setColor("");
            } else {
                throw new Error(response.data?.error || "Failed to save template");
            }
        } catch (error: any) {
            console.error("Error saving template:", error);
            const errorMessage = error.response?.data?.error || error.message || "Failed to save template. Please try again.";
            alert(errorMessage);
        } finally {
            setIsSaving(false);
        }
    };

    // Find first section for thumbnail rendering
    const nodes = useEditorStore((state) => state.nodes);
    const rootId = useEditorStore((state) => state.rootId);
    const rootNode = nodes[rootId];
    const firstSectionId = rootNode?.children?.find((childId) => {
        const child = nodes[childId];
        return child && child.type === 'section';
    });

    return (
        <>
            {/* Hidden thumbnail container for capture */}
            {firstSectionId && (
                <div
                    ref={thumbnailRef}
                    className="absolute left-[-9999px] w-[375px] h-[667px] bg-white overflow-hidden"
                    style={{ position: 'absolute', visibility: 'hidden' }}
                >
                    <PreviewProvider isPreview={true}>
                        <NodeRenderer nodeId={firstSectionId} />
                    </PreviewProvider>
                </div>
            )}

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
                    <button
                        onClick={() => setShowSaveDialog(true)}
                        className="px-4 py-2 text-sm bg-gray-900 hover:bg-black text-white rounded flex items-center gap-2 transition-colors"
                    >
                        <Save size={16} />
                        Save
                    </button>
                </div>
            </div>

            {/* Save Dialog */}
            <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Save Template</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="templateName">Template Name *</Label>
                            <Input
                                id="templateName"
                                type="text"
                                value={templateName}
                                onChange={(e) => setTemplateName(e.target.value)}
                                placeholder="Enter template name (e.g., Elegant Rose Template)"
                                className="w-full"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="themeName">Theme Name *</Label>
                            <Input
                                id="themeName"
                                type="text"
                                value={themeName}
                                onChange={(e) => setThemeName(e.target.value)}
                                placeholder="e.g., wedding, baby"
                                className="w-full"
                            />
                            <p className="text-xs text-gray-500">Theme name (e.g., wedding, baby, etc.)</p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="color">Color *</Label>
                            <Input
                                id="color"
                                type="text"
                                value={color}
                                onChange={(e) => setColor(e.target.value.toUpperCase())}
                                placeholder="e.g., ROSE, BLUE, GOLD"
                                className="w-full uppercase"
                            />
                            <p className="text-xs text-gray-500">Main color (e.g., ROSE, BLUE, GOLD)</p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={!templateName.trim() || !themeName.trim() || !color.trim() || isSaving}
                            className="bg-gray-900 hover:bg-black text-white"
                        >
                            {isSaving ? 'Saving...' : 'Save Template'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
