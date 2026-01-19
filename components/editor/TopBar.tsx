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
import { toast } from "sonner";

export function TopBar() {
    const router = useRouter();
    const [showSaveDialog, setShowSaveDialog] = useState(false);
    const [templateName, setTemplateName] = useState("");
    const [themeName, setThemeName] = useState("wedding");
    const [color, setColor] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [editingThemeId, setEditingThemeId] = useState<string | null>(null);
    const thumbnailRef = useRef<HTMLDivElement>(null);

    // Check if we're editing an existing theme
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');
        if (id) {
            setEditingThemeId(id);
            // Load existing template data
            fetch(`/api/designer/themes/${id}`)
                .then(res => res.json())
                .then(data => {
                    if (data.config) {
                        setTemplateName(data.name || "");
                        setThemeName(data.config.themeName || "wedding");
                        setColor(data.config.color || "");
                    }
                })
                .catch(err => console.error('Error loading template:', err));
        }
    }, []);

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

        // Open preview in new tab - use unified /preview page
        window.open("/preview", "_blank");
    };

    const handleSave = async () => {
        if (!templateName.trim() || !themeName.trim() || !color.trim()) {
            toast.error("Please fill in all required fields (Template Name, Theme Name, and Color)");
            return;
        }

        setIsSaving(true);

        try {
            // Try server-side thumbnail generation first (Option A)
            // Falls back to client-side html2canvas if server-side fails
            let thumbnailDataUrl: string | null = null;
            
            // For new templates, use client-side generation first
            // Then after saving, we can regenerate with server-side
            if (!editingThemeId) {
                console.log('[TopBar] New template - using client-side thumbnail generation');
                thumbnailDataUrl = await generateThumbnail();
            } else {
                // For existing templates, try server-side first
                try {
                    console.log('[TopBar] Attempting server-side thumbnail generation for template:', editingThemeId);
                    const thumbnailResponse = await axios.post('/api/thumbnail/generate', {
                        templateId: editingThemeId,
                    });
                    
                    if (thumbnailResponse.data?.thumbnailUrl) {
                        thumbnailDataUrl = thumbnailResponse.data.thumbnailUrl;
                        console.log('[TopBar] Server-side thumbnail generated:', thumbnailDataUrl);
                    }
                } catch (serverError: any) {
                    console.warn('[TopBar] Server-side thumbnail generation failed, falling back to html2canvas:', serverError.message);
                    // Fall back to client-side generation
                    thumbnailDataUrl = await generateThumbnail();
                }
            }

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

            let response;
            if (editingThemeId) {
                // Update existing template
                console.log('[TopBar] Updating template:', editingThemeId);
                response = await axios.put(`/api/designer/themes/${editingThemeId}`, {
                    name: templateName.trim(),
                    config: config,
                    type: 'template',
                    defaultEventData: null,
                    previewImageUrl: thumbnailDataUrl,
                });
            } else {
                // Create new template
                console.log('[TopBar] Creating new template with config:', { 
                    name: templateName.trim(), 
                    type: 'template',
                    themeName: config.themeName,
                    color: config.color,
                    hasEditorData: !!config.editorData,
                    nodeCount: Object.keys(config.editorData?.nodes || {}).length
                });
                response = await axios.post('/api/designer/themes', {
                    name: templateName.trim(),
                    config: config,
                    type: 'template',
                    defaultEventData: null,
                    previewImageUrl: thumbnailDataUrl,
                });
            }

            console.log('[TopBar] Save response:', response.status, response.data);

            if (response.status === 201 || response.status === 200) {
                const savedTemplateId = response.data?.theme?.id || editingThemeId
                
                // After saving, try to generate server-side thumbnail for better quality
                // This is optional - the client-side thumbnail is already saved
                if (savedTemplateId && !editingThemeId) {
                    // New template - try to regenerate with server-side after a short delay
                    setTimeout(async () => {
                        try {
                            console.log('[TopBar] Regenerating thumbnail server-side for new template:', savedTemplateId);
                            const thumbnailResponse = await axios.post('/api/thumbnail/generate', {
                                templateId: savedTemplateId,
                            });
                            
                            if (thumbnailResponse.data?.thumbnailUrl) {
                                console.log('[TopBar] Server-side thumbnail regenerated:', thumbnailResponse.data.thumbnailUrl);
                                // Optionally update the template with the new thumbnail
                                // But the client-side one is already saved, so this is just for quality improvement
                            }
                        } catch (err) {
                            console.warn('[TopBar] Failed to regenerate thumbnail server-side:', err);
                            // Not critical - client-side thumbnail is already saved
                        }
                    }, 2000); // Wait 2 seconds for template to be fully saved
                }
                
                const message = editingThemeId 
                    ? "Template updated successfully! It will appear in your themes list."
                    : "Template saved successfully! It will appear in your themes list. Note: Templates need to be published to appear in the catalog.";
                toast.success(message);
                // Keep dialog open and preserve inputs
                // Don't clear form or close dialog
                // Optionally redirect to themes page
                // router.push('/designer/dashboard/themes');
            } else {
                throw new Error(response.data?.error || "Failed to save template");
            }
        } catch (error: any) {
            console.error("Error saving template:", error);
            const errorMessage = error.response?.data?.error || error.message || "Failed to save template. Please try again.";
            toast.error(`Error: ${errorMessage}`);
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
