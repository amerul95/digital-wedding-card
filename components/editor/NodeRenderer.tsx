"use client";

import React from "react";
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
import { AttendanceWidget } from "@/components/editor/widgets/AttendanceWidget";
import { Reveal } from "@/components/editor/Reveal";
import { usePreview } from "@/components/editor/context/PreviewContext";

import { useClientStore, defaultClientData } from "@/components/studio/clientStore";

// Helper function to format date with day and style options
const formatDateWithDay = (dateISO: string, style: string = "Day, Date"): string => {
    if (!dateISO) return "";
    
    try {
        const date = new Date(dateISO);
        if (isNaN(date.getTime())) return dateISO; // Invalid date, return original
        
        const day = date.getDate();
        const month = date.getMonth();
        const year = date.getFullYear();
        const dayOfWeek = date.getDay();
        
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayNamesShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const monthNamesShort = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        
        const dayName = dayNames[dayOfWeek];
        const dayNameShort = dayNamesShort[dayOfWeek];
        const monthName = monthNames[month];
        const monthNameShort = monthNamesShort[month];
        const yearShort = year.toString().slice(-2);
        
        // Format date part
        const dateFormats: Record<string, string> = {
            'dd/mm/yy': `${String(day).padStart(2, '0')}/${String(month + 1).padStart(2, '0')}/${yearShort}`,
            'dd-mm-yy': `${String(day).padStart(2, '0')}-${String(month + 1).padStart(2, '0')}-${yearShort}`,
            'dd.mm.yy': `${String(day).padStart(2, '0')}.${String(month + 1).padStart(2, '0')}.${yearShort}`,
            'dd full month years': `${day} ${monthName} ${year}`,
            'dd month short years': `${day} ${monthNameShort} ${year}`,
            'full date': `${day} ${monthName} ${year}`,
        };
        
        // Determine date format from style or use default
        let dateFormat = 'dd full month years';
        if (style.includes('dd/mm/yy') || style.includes('dd-mm-yy') || style.includes('dd.mm.yy')) {
            if (style.includes('dd/mm/yy')) dateFormat = 'dd/mm/yy';
            else if (style.includes('dd-mm-yy')) dateFormat = 'dd-mm-yy';
            else if (style.includes('dd.mm.yy')) dateFormat = 'dd.mm.yy';
        }
        
        const formattedDate = dateFormats[dateFormat] || `${day} ${monthName} ${year}`;
        
        // Apply style
        switch (style.toLowerCase()) {
            case 'day, date':
            case 'day date':
                return `${dayName}, ${formattedDate}`;
            case 'date, day':
            case 'date day':
                return `${formattedDate}, ${dayName}`;
            case 'day short, date':
            case 'day short date':
                return `${dayNameShort}, ${formattedDate}`;
            case 'date, day short':
            case 'date day short':
                return `${formattedDate}, ${dayNameShort}`;
            case 'day':
                return dayName;
            case 'day short':
                return dayNameShort;
            default:
                // If style contains date format, use it
                if (style.includes('Day') || style.includes('day')) {
                    if (style.startsWith('Day') || style.startsWith('day')) {
                        return `${dayName}, ${formattedDate}`;
                    } else {
                        return `${formattedDate}, ${dayName}`;
                    }
                }
                return formattedDate;
        }
    } catch (error) {
        return dateISO; // Return original on error
    }
};

// Helper to recursively replace placeholders in objects
// This function replaces placeholders (like %groom%) with client data or default values
// Default values (e.g., "Adam" for groom) are used when no client data is provided
// When client enters new data (e.g., "John"), it replaces the default value
const processDataWithPlaceholders = (data: any, clientData: any): any => {
    if (!data) return data;
    if (typeof data === 'string') {
        let text = data;
        // Replace known placeholders
        // Use clientData if provided (non-empty), otherwise use default values
        // This allows default values like "Adam" to show in preview/studio when no client input exists
        const groomName = (clientData.groomName && clientData.groomName.trim()) ? clientData.groomName : defaultClientData.groomName;
        const brideName = (clientData.brideName && clientData.brideName.trim()) ? clientData.brideName : defaultClientData.brideName;
        const groomShort = (clientData.groomShort && clientData.groomShort.trim()) ? clientData.groomShort : defaultClientData.groomShort;
        const brideShort = (clientData.brideShort && clientData.brideShort.trim()) ? clientData.brideShort : defaultClientData.brideShort;
        const ceremonyTitle = (clientData.ceremonyTitle && clientData.ceremonyTitle.trim()) ? clientData.ceremonyTitle : defaultClientData.ceremonyTitle;
        const welcomingSpeech = (clientData.welcomingSpeech && clientData.welcomingSpeech.trim()) ? clientData.welcomingSpeech : defaultClientData.welcomingSpeech;
        
        text = text.replace(/%groom%/gi, groomName);
        text = text.replace(/%bride%/gi, brideName);
        text = text.replace(/%groomshort%/gi, groomShort);
        text = text.replace(/%brideshort%/gi, brideShort);
        text = text.replace(/%title%/gi, ceremonyTitle);
        text = text.replace(/%speech%/gi, welcomingSpeech);
        
        // Date placeholder with day and style formatting
        const dateStyle = clientData.dateStyle || defaultClientData.dateStyle;
        const formattedDate = formatDateWithDay(
            clientData.ceremonyDate || defaultClientData.ceremonyDate,
            dateStyle
        );
        text = text.replace(/%date%/gi, formattedDate);
        
        // Time placeholders (all map to the same fields)
        const ceremonyStartTime = (clientData.ceremonyStartTime && clientData.ceremonyStartTime.trim()) ? clientData.ceremonyStartTime : defaultClientData.ceremonyStartTime;
        const ceremonyEndTime = (clientData.ceremonyEndTime && clientData.ceremonyEndTime.trim()) ? clientData.ceremonyEndTime : defaultClientData.ceremonyEndTime;
        text = text.replace(/%starttime%/gi, ceremonyStartTime);
        text = text.replace(/%endtime%/gi, ceremonyEndTime);
        text = text.replace(/%startTime%/gi, ceremonyStartTime);
        text = text.replace(/%endTime%/gi, ceremonyEndTime);
        
        // Organizer placeholders
        const organizer1 = (clientData.organizer1 && clientData.organizer1.trim()) ? clientData.organizer1 : defaultClientData.organizer1;
        const organizer2 = (clientData.organizer2 && clientData.organizer2.trim()) ? clientData.organizer2 : defaultClientData.organizer2;
        text = text.replace(/%organizer1%/gi, organizer1);
        text = text.replace(/%organizer2%/gi, organizer2);
        
        // Venue placeholders
        const mainVenue = (clientData.mainVenue && clientData.mainVenue.trim()) ? clientData.mainVenue : defaultClientData.mainVenue;
        const fullVenue = (clientData.fullVenue && clientData.fullVenue.trim()) ? clientData.fullVenue : defaultClientData.fullVenue;
        text = text.replace(/%mainvenue%/gi, mainVenue);
        text = text.replace(/%fullvenue%/gi, fullVenue);
        
        // Event placeholders
        const eventTentativeTitle = (clientData.eventTentativeTitle && clientData.eventTentativeTitle.trim()) ? clientData.eventTentativeTitle : defaultClientData.eventTentativeTitle;
        const eventTentativeActivity = (clientData.eventTentativeActivity && clientData.eventTentativeActivity.trim()) ? clientData.eventTentativeActivity : defaultClientData.eventTentativeActivity;
        text = text.replace(/%eventtentativetitle%/gi, eventTentativeTitle);
        // For event tentative activity, preserve line breaks (already in HTML format from rich text editor)
        text = text.replace(/%eventtentiveactivity%/gi, eventTentativeActivity);
        
        // Pray placeholder
        const pray = (clientData.pray && clientData.pray.trim()) ? clientData.pray : defaultClientData.pray;
        text = text.replace(/%pray%/gi, pray);
        
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
    const cardScrollElement = useEditorStore((state) => state.cardScrollElement);
    const bottomNavbarHeight = useEditorStore((state) => state.bottomNavbarHeight);
    const doorStatus = useEditorStore((state) => state.doorStatus);
    const viewOptions = useEditorStore((state) => state.viewOptions);
    const { isPreview } = usePreview();

    // Create a ref object from the stored element for Reveal component
    const cardScrollRef = React.useMemo(() => {
        if (!cardScrollElement) return undefined;
        return { current: cardScrollElement } as React.RefObject<HTMLElement>;
    }, [cardScrollElement]);

    // Client Data for placeholders
    // In designer preview/editor mode, always use defaultClientData to show default placeholder values
    // This ensures designers always see the latest default values, not cached localStorage data
    // In studio/preview (client view), use persisted clientData if available
    const persistedClientData = useClientStore((state) => state.clientData);
    
    // Check if we're in designer preview mode (not studio/client preview)
    // Designer preview should always use defaultClientData, not persisted store
    const isDesignerPreview = typeof window !== 'undefined' && (
        window.location.pathname.includes('/designer/preview') ||
        window.location.pathname.includes('/designer/dashboard/create-theme-2')
    );
    
    // Use defaultClientData in designer preview, otherwise use persisted clientData
    const clientData = isDesignerPreview ? defaultClientData : persistedClientData;

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

    // Helper to wrap content with Reveal if animation is enabled
    const wrapWithReveal = (content: React.ReactNode) => {
        const animation = node.animation;
        const isAnimationEnabled = 
            isPreview && 
            viewOptions.showAnimation && 
            animation?.enabled && 
            animation.trigger !== "none";

        if (!isAnimationEnabled) {
            return content;
        }

        return (
            <Reveal
                rootRef={cardScrollRef}
                bottomNavbarHeight={bottomNavbarHeight}
                trigger={animation.trigger}
                preset={animation.preset}
                replay={animation.replay ?? false}
                duration={animation.duration}
                delay={animation.delay}
                threshold={animation.threshold}
                doorStatus={doorStatus}
                enabled={animation.enabled}
            >
                {content}
            </Reveal>
        );
    };

    // If completely hidden by client (and we assume this is final view or we want to simulate it)
    // We could return null. But for Designer mode, we might want to see it.
    // Let's stick to replacing placeholders for now.

    switch (node.type) {
        case 'section':
            return wrapWithReveal(
                <SectionWidget id={nodeId} data={processedData} style={node.style}>
                    {content.length > 0 ? content : null}
                </SectionWidget>
            );
        case 'container':
            return wrapWithReveal(
                <ContainerWidget id={nodeId} data={processedData} style={node.style}>
                    {content.length > 0 ? content : null}
                </ContainerWidget>
            );
        case 'text':
            return wrapWithReveal(
                <TextWidget id={nodeId} data={processedData} style={node.style} />
            );
        case 'image':
            return wrapWithReveal(
                <ImageWidget id={nodeId} data={processedData} style={node.style} />
            );
        case 'couple-header':
            // Specific widget might fetch from clientData internally too, but props injection is safer
            return wrapWithReveal(
                <CoupleHeaderWidget id={nodeId} data={processedData} style={node.style} />
            );
        case 'slider':
            return wrapWithReveal(
                <ImageSliderWidget id={nodeId} data={processedData} style={node.style} />
            );
        case 'countdown':
            return wrapWithReveal(
                <CountdownWidget id={nodeId} data={processedData} style={node.style} />
            );
        case 'bottom-nav':
            // Bottom Nav needs special handling for hidden items
            // processedData.items should be filtered if they match hiddenNavbarItemIds
            const visibleItems = (processedData.items || []).filter((item: any) => !clientData.hiddenNavbarItemIds.includes(item.id));
            const navData = { ...processedData, items: visibleItems };

            return <BottomNavWidget id={nodeId} data={navData} style={node.style} />;

        // Other widgets can be inline here or extracted similarly
        case 'button':
            return wrapWithReveal(
                <ButtonWidget id={nodeId} data={processedData} style={node.style} />
            );
        case 'door':
            return <DoorWidget id={nodeId} data={processedData} style={node.style} />;
        case 'modal':
            return wrapWithReveal(
                <ModalWidget id={nodeId} data={processedData} style={node.style} />
            );
        case 'congratulation-speech':
            return wrapWithReveal(
                <CongratulationSpeechWidget id={nodeId} data={processedData} style={node.style} />
            );
        case 'attendance':
            return wrapWithReveal(
                <AttendanceWidget id={nodeId} data={processedData} style={node.style} />
            );
        default:
            return wrapWithReveal(
                <div
                    className={cn("p-2 border border-red-200 bg-red-50 text-xs text-red-500", isSelected ? "ring-2 ring-blue-500" : "")}
                    onClick={handleClick}
                >
                    {node.type}
                </div>
            );
    }
}
