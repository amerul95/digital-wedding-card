"use client";

import { useState, useEffect, useRef } from "react";
import { Scroll, Grid, ChevronDown, X } from "lucide-react";
import { useEditorStore } from "@/components/editor/store";
import { usePreview } from "@/components/editor/context/PreviewContext";
import { cn } from "@/lib/utils";

export function SectionNavigator() {
    const { isPreview } = usePreview();
    const rootId = useEditorStore((state) => state.rootId);
    const rootNode = useEditorStore((state) => state.nodes[rootId]);
    const [showGrid, setShowGrid] = useState(false);
    const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
    const gridRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLElement | null>(null);

    // Find scroll container (the one with overflow-y-auto)
    useEffect(() => {
        const findScrollContainer = () => {
            const containers = document.querySelectorAll('[class*="overflow-y-auto"]');
            for (const container of containers) {
                const htmlContainer = container as HTMLElement;
                if (htmlContainer.scrollHeight > htmlContainer.clientHeight) {
                    scrollContainerRef.current = htmlContainer;
                    return;
                }
            }
            // Fallback to window
            scrollContainerRef.current = document.documentElement;
        };
        findScrollContainer();
    }, []);

    // Get all section nodes
    const sections = rootNode?.children
        .map((childId) => useEditorStore.getState().nodes[childId])
        .filter((node) => node?.type === 'section') || [];

    // Track current section based on scroll position
    useEffect(() => {
        if (!scrollContainerRef.current || sections.length === 0 || isPreview) return;

        const updateCurrentSection = () => {
            const container = scrollContainerRef.current;
            if (!container) return;

            const scrollTop = container === document.documentElement 
                ? window.scrollY 
                : container.scrollTop;
            const containerHeight = container === document.documentElement
                ? window.innerHeight
                : container.clientHeight;

            // Find which section is most visible
            let bestIndex = 0;
            let bestVisibility = 0;

            sections.forEach((section, index) => {
                const sectionElement = document.querySelector(`[data-section-id="${section.id}"]`) as HTMLElement;
                if (!sectionElement) return;

                const rect = sectionElement.getBoundingClientRect();
                const containerRect = container === document.documentElement
                    ? { top: 0, bottom: window.innerHeight }
                    : container.getBoundingClientRect();

                const visibleTop = Math.max(rect.top, containerRect.top);
                const visibleBottom = Math.min(rect.bottom, containerRect.bottom);
                const visibleHeight = Math.max(0, visibleBottom - visibleTop);
                const visibility = visibleHeight / rect.height;

                if (visibility > bestVisibility) {
                    bestVisibility = visibility;
                    bestIndex = index;
                }
            });

            setCurrentSectionIndex(bestIndex);
        };

        const container = scrollContainerRef.current;
        const scrollHandler = () => updateCurrentSection();
        
        if (container === document.documentElement) {
            window.addEventListener('scroll', scrollHandler, { passive: true });
        } else {
            container.addEventListener('scroll', scrollHandler, { passive: true });
        }

        updateCurrentSection(); // Initial update

        return () => {
            if (container === document.documentElement) {
                window.removeEventListener('scroll', scrollHandler);
            } else {
                container.removeEventListener('scroll', scrollHandler);
            }
        };
    }, [sections, isPreview]);

    // Close grid when clicking outside
    useEffect(() => {
        if (!showGrid) return;

        const handleClickOutside = (e: MouseEvent) => {
            if (gridRef.current && !gridRef.current.contains(e.target as Node)) {
                setShowGrid(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showGrid]);

    // Scroll to next section
    const scrollToNext = () => {
        if (sections.length === 0) return;

        const nextIndex = (currentSectionIndex + 1) % sections.length;
        const nextSection = sections[nextIndex];
        const sectionElement = document.querySelector(`[data-section-id="${nextSection.id}"]`) as HTMLElement;

        if (sectionElement && scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const containerRect = container === document.documentElement
                ? { top: 0 }
                : container.getBoundingClientRect();
            const sectionRect = sectionElement.getBoundingClientRect();
            
            const scrollTop = container === document.documentElement
                ? window.scrollY
                : container.scrollTop;
            
            const targetScroll = scrollTop + (sectionRect.top - containerRect.top);

            if (container === document.documentElement) {
                window.scrollTo({ top: targetScroll, behavior: 'smooth' });
            } else {
                container.scrollTo({ top: targetScroll, behavior: 'smooth' });
            }
        }
    };

    // Scroll to specific section
    const scrollToSection = (sectionId: string) => {
        const sectionElement = document.querySelector(`[data-section-id="${sectionId}"]`) as HTMLElement;

        if (sectionElement && scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const containerRect = container === document.documentElement
                ? { top: 0 }
                : container.getBoundingClientRect();
            const sectionRect = sectionElement.getBoundingClientRect();
            
            const scrollTop = container === document.documentElement
                ? window.scrollY
                : container.scrollTop;
            
            const targetScroll = scrollTop + (sectionRect.top - containerRect.top);

            if (container === document.documentElement) {
                window.scrollTo({ top: targetScroll, behavior: 'smooth' });
            } else {
                container.scrollTo({ top: targetScroll, behavior: 'smooth' });
            }
        }
        setShowGrid(false);
    };

    // Hide in preview mode
    if (isPreview) {
        return null;
    }

    if (sections.length === 0) {
        return null;
    }

    return (
        <>
            <div className="absolute right-2 top-20 z-40 flex flex-col gap-2">
                {/* Scroll to Next Section Button */}
                <button
                    onClick={scrollToNext}
                    className="w-8 h-8 bg-black/50 backdrop-blur rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-black/70 transition-colors"
                    title="Scroll to next section"
                >
                    <Scroll size={14} />
                </button>

                {/* Grid/Overview Button */}
                <button
                    onClick={() => setShowGrid(!showGrid)}
                    className={cn(
                        "w-8 h-8 bg-black/50 backdrop-blur rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-black/70 transition-colors",
                        showGrid && "bg-black/70"
                    )}
                    title="Show section overview"
                >
                    <Grid size={14} />
                </button>
            </div>

            {/* Section Grid/Overview Modal */}
            {showGrid && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                    <div
                        ref={gridRef}
                        className="bg-white rounded-lg shadow-2xl p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Sections Overview</h3>
                            <button
                                onClick={() => setShowGrid(false)}
                                className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <div className="space-y-2">
                            {sections.map((section, index) => {
                                const sectionData = section.data || {};
                                const sectionLabel = sectionData.label || `Section ${index + 1}`;
                                const isActive = index === currentSectionIndex;

                                return (
                                    <button
                                        key={section.id}
                                        onClick={() => scrollToSection(section.id)}
                                        className={cn(
                                            "w-full text-left p-3 rounded-lg border transition-colors",
                                            isActive
                                                ? "bg-blue-50 border-blue-500 text-blue-700"
                                                : "bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-700"
                                        )}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium">{sectionLabel}</span>
                                            {isActive && (
                                                <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
                                                    Current
                                                </span>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
