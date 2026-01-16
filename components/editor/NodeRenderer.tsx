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
import { DoorWidget } from "@/components/editor/widgets/DoorWidget";
import { ModalWidget } from "@/components/editor/widgets/ModalWidget";
import { CongratulationSpeechWidget } from "@/components/editor/widgets/CongratulationSpeechWidget";

import { useClientStore, defaultClientData } from "@/components/studio/clientStore";

// Helper to recursively replace placeholders in objects
const processDataWithPlaceholders = (data: any, clientData: any): any => {
    if (!data) return data;
    if (typeof data === 'string') {
        let text = data;
        // Replace known placeholders
        text = text.replace(/%groom%/gi, clientData.groomName || defaultClientData.groomName);
        text = text.replace(/%bride%/gi, clientData.brideName || defaultClientData.brideName);
        text = text.replace(/%title%/gi, clientData.ceremonyTitle || defaultClientData.ceremonyTitle);
        text = text.replace(/%speech%/gi, clientData.welcomingSpeech || defaultClientData.welcomingSpeech);
        text = text.replace(/%date%/gi, clientData.ceremonyDate || defaultClientData.ceremonyDate);
        text = text.replace(/%startTime%/gi, clientData.ceremonyStartTime || defaultClientData.ceremonyStartTime);
        text = text.replace(/%endTime%/gi, clientData.ceremonyEndTime || defaultClientData.ceremonyEndTime);
        return text;
    }
    if (Array.isArray(data)) {
        return data.map(item => processDataWithPlaceholders(item, clientData));
    }
    if (typeof data === 'object') {
        const newData: any = {};
        for (const key in data) {
            newData[key] = processDataWithPlaceholders(data[key], clientData);
        }
        return newData;
    }
    return data;
};

export function NodeRenderer({ nodeId }: { nodeId: string }) {
    const node = useEditorStore((state) => state.nodes[nodeId]);
    const selectNode = useEditorStore((state) => state.selectNode);
    const selectedId = useEditorStore((state) => state.selectedId);

    // Client Data for placeholders
    const clientData = useClientStore((state) => state.clientData);

    if (!node) return null;

    // Check visibility based on ClientStore
    // If this node or its parent is hidden by client
    // Note: This logic assumes simple ID checking. 
    const isHidden = clientData.hiddenSectionIds.includes(nodeId);

    // For editor, we might still want to show it but maybe dimmed? 
    // The user requirement implies hiding it from the final card. 
    // 'app/studio' is for client input, but the PREVIEW should reflect this.
    // If we are in the "Editor" (Designer), we probably want to see everything.
    // Ideally we'd detect if we are in 'view' mode or 'edit' mode. 
    // For now, let's treat NodeRenderer as the universal renderer.
    // If it's hidden, and we are NOT in edit mode (we can guess this if selectNode is no-op, but here it is passed).
    // Let's rely on visual cues or just render it for now. The requirement was "control what they want hide".

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        selectNode(nodeId);
    };

    const isSelected = selectedId === nodeId;

    // Process data to replace placeholders
    const processedData = processDataWithPlaceholders(node.data, clientData);

    // Render children recursively
    const content = node.children?.map(childId => (
        <NodeRenderer key={childId} nodeId={childId} />
    ));

    // If completely hidden by client (and we assume this is final view or we want to simulate it)
    // We could return null. But for Designer mode, we might want to see it.
    // Let's stick to replacing placeholders for now.

    switch (node.type) {
        case 'section':
            return (
                <SectionWidget id={nodeId} data={processedData} style={node.style}>
                    {content.length > 0 ? content : null}
                </SectionWidget>
            );
        case 'container':
            return (
                <ContainerWidget id={nodeId} data={processedData} style={node.style}>
                    {content.length > 0 ? content : null}
                </ContainerWidget>
            );
        case 'text':
            return <TextWidget id={nodeId} data={processedData} style={node.style} />;
        case 'image':
            return <ImageWidget id={nodeId} data={processedData} style={node.style} />;
        case 'couple-header':
            // Specific widget might fetch from clientData internally too, but props injection is safer
            return <CoupleHeaderWidget id={nodeId} data={processedData} style={node.style} />;
        case 'slider':
            return <ImageSliderWidget id={nodeId} data={processedData} style={node.style} />;
        case 'countdown':
            return <CountdownWidget id={nodeId} data={processedData} style={node.style} />;
        case 'bottom-nav':
            // Bottom Nav needs special handling for hidden items
            // processedData.items should be filtered if they match hiddenNavbarItemIds
            const visibleItems = (processedData.items || []).filter((item: any) => !clientData.hiddenNavbarItemIds.includes(item.id));
            const navData = { ...processedData, items: visibleItems };

            return <BottomNavWidget id={nodeId} data={navData} style={node.style} />;

        // Other widgets can be inline here or extracted similarly
        case 'button':
            return <ButtonWidget id={nodeId} data={processedData} style={node.style} />;
        case 'door':
            return <DoorWidget id={nodeId} data={processedData} style={node.style} />;
        case 'modal':
            return <ModalWidget id={nodeId} data={processedData} style={node.style} />;
        case 'congratulation-speech':
            return <CongratulationSpeechWidget id={nodeId} data={processedData} style={node.style} />;
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
