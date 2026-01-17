"use client";

import { useEditorStore } from "@/components/editor/store";
import { cn } from "@/lib/utils";
import { useClientStore } from "@/components/studio/clientStore";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useWidgetAnimations } from "@/components/editor/utils/animationUtils";

interface CongratulationSpeechWidgetProps {
    id: string;
    data: any;
    style: any;
}

export function CongratulationSpeechWidget({ id, data, style }: CongratulationSpeechWidgetProps) {
    const selectNode = useEditorStore((state) => state.selectNode);
    const selectedId = useEditorStore((state) => state.selectedId);
    const clientData = useClientStore((state) => state.clientData);
    
    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        selectNode(id);
    };

    const isSelected = selectedId === id;
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [currentScrollIndex, setCurrentScrollIndex] = useState(0);

    // Get real speeches from clientData, sorted by timestamp (latest first)
    const realSpeeches = (clientData.speeches || []).sort((a, b) => b.timestamp - a.timestamp);
    
    // Get mockup speeches from widget data (filter out empty ones)
    const mockupSpeeches = (data.mockupSpeeches || [])
        .filter((mockup: any) => mockup.speech && mockup.speech.trim() && mockup.author && mockup.author.trim())
        .map((mockup: any) => ({
            content: mockup.speech || '',
            author: mockup.author || '',
            timestamp: mockup.timestamp || Date.now(), // Use provided timestamp or current time
            isMockup: true, // Flag to identify mockup speeches
        }));
    
    // Combine real and mockup speeches, with real speeches first (latest first), then mockups
    const allSpeeches = [...realSpeeches, ...mockupSpeeches];
    
    // Padding handling - individual sides
    const paddingTop = data.speechPaddingTop !== undefined ? `${data.speechPaddingTop}px` : '16px';
    const paddingRight = data.speechPaddingRight !== undefined ? `${data.speechPaddingRight}px` : '16px';
    const paddingBottom = data.speechPaddingBottom !== undefined ? `${data.speechPaddingBottom}px` : '16px';
    const paddingLeft = data.speechPaddingLeft !== undefined ? `${data.speechPaddingLeft}px` : '16px';

    const containerStyle: React.CSSProperties = {
        ...style,
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft,
    };

    // Speech text style
    const speechTextStyle: React.CSSProperties = {
        fontSize: data.speechTextFontSize || '14px',
        color: data.speechTextColor || '#333333',
        fontFamily: data.speechTextFontFamily || undefined,
        fontWeight: data.speechTextFontWeight || 'normal',
        textAlign: (data.speechTextAlign || 'left') as 'left' | 'center' | 'right',
    };

    // Author text style
    const authorTextStyle: React.CSSProperties = {
        fontSize: data.authorTextFontSize || '12px',
        color: data.authorTextColor || '#666666',
        fontFamily: data.authorTextFontFamily || undefined,
        fontWeight: data.authorTextFontWeight || 'normal',
        textAlign: (data.authorTextAlign || 'left') as 'left' | 'center' | 'right',
    };

    // Reset scroll index when speeches change
    useEffect(() => {
        setCurrentScrollIndex(0);
    }, [allSpeeches.length]);

    // Auto-scroll loop effect - scrolls from latest (index 0) to oldest (last index), then loops back
    useEffect(() => {
        if (!data.enableAutoScroll || allSpeeches.length === 0 || !scrollContainerRef.current) return;

        const container = scrollContainerRef.current;
        const scrollInterval = setInterval(() => {
            setCurrentScrollIndex(prev => {
                const nextIndex = prev + 1;
                // If reached the end (oldest), loop back to start (latest)
                return nextIndex >= allSpeeches.length ? 0 : nextIndex;
            });
        }, data.autoScrollDelay || 3000); // Default 3 seconds per speech

        // Scroll to current index
        if (currentScrollIndex < allSpeeches.length && container.children[currentScrollIndex]) {
            const speechElement = container.children[currentScrollIndex] as HTMLElement;
            if (speechElement) {
                speechElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }

        return () => clearInterval(scrollInterval);
    }, [currentScrollIndex, data.enableAutoScroll, data.autoScrollDelay, allSpeeches.length]);

    // Use animation hooks
    const { widgetRef, controls, motionInitial, motionAnimate, animationVariants, useMotion } = useWidgetAnimations(
        id,
        data.initialAnimation,
        data.scrollAnimation
    );

    const MotionDiv = motion.div as any;

    return (
        <MotionDiv
            ref={widgetRef}
            {...(useMotion ? {
                animate: controls,
                initial: motionInitial,
                variants: animationVariants,
            } : {})}
            className={cn(
                "relative transition-all group",
                isSelected ? "ring-2 ring-blue-500 z-10" : "hover:ring-1 hover:ring-blue-300",
            )}
            style={containerStyle}
            onClick={handleClick}
        >
            <div
                ref={scrollContainerRef}
                className="space-y-4 overflow-y-auto scrollbar-hide"
                style={{
                    height: 'auto',
                    maxHeight: '336px',
                }}
            >
                {allSpeeches.length > 0 ? (
                    allSpeeches.map((speech, index) => (
                        <div key={speech.isMockup ? `mockup-${index}` : `real-${speech.timestamp}-${index}`} className="flex flex-col gap-2">
                            <div style={speechTextStyle}>
                                {speech.content}
                            </div>
                            <div style={authorTextStyle}>
                                — {speech.author}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-400 text-sm py-8">
                        No speeches yet. Add mockup speeches in properties or wait for visitors to leave congratulations.
                    </div>
                )}
            </div>
        </MotionDiv>
    );
}
