"use client";

import { useEditorStore } from "@/components/editor/store";
import { cn } from "@/lib/utils";
import { useDroppable } from "@dnd-kit/core";
import { useMobileFrame } from "@/components/editor/context/MobileFrameContext";
import { usePreview } from "@/components/editor/context/PreviewContext";
import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface SectionWidgetProps {
    id: string;
    data: any;
    style: any;
    children?: React.ReactNode;
}

const LAYOUT_KEYS = [
    'display', 'flexDirection', 'justifyContent', 'alignItems', 'gap', 'gridTemplateColumns'
];

// Helper function to get animation variants
function getAnimationVariants(animationType: string | undefined) {
    if (!animationType || animationType === 'none') {
        return { initial: {}, animate: {}, exit: {} };
    }

    const common = {
        initial: {} as any,
        animate: { opacity: 1 } as any,
        exit: { opacity: 0 } as any,
        transition: { duration: 0.6, ease: "easeOut" } as any,
    };

    switch (animationType) {
        case 'fadeIn':
            return {
                ...common,
                initial: { opacity: 0 },
            };
        case 'slideUp':
            return {
                ...common,
                initial: { opacity: 0, y: 50 },
                animate: { opacity: 1, y: 0 },
            };
        case 'slideDown':
            return {
                ...common,
                initial: { opacity: 0, y: -50 },
                animate: { opacity: 1, y: 0 },
            };
        case 'slideLeft':
            return {
                ...common,
                initial: { opacity: 0, x: 50 },
                animate: { opacity: 1, x: 0 },
            };
        case 'slideRight':
            return {
                ...common,
                initial: { opacity: 0, x: -50 },
                animate: { opacity: 1, x: 0 },
            };
        case 'bounce':
            return {
                ...common,
                initial: { opacity: 0, y: 50 },
                animate: {
                    opacity: 1,
                    y: 0,
                    transition: { type: "spring", stiffness: 300, damping: 20 }
                },
            };
        case 'scale':
            return {
                ...common,
                initial: { opacity: 0, scale: 0.8 },
                animate: { opacity: 1, scale: 1 },
            };
        default:
            return { initial: {}, animate: {}, exit: {} };
    }
}

export function SectionWidget({ id, data, style, children }: SectionWidgetProps) {
    const selectNode = useEditorStore((state) => state.selectNode);
    const selectedId = useEditorStore((state) => state.selectedId);
    const rootId = useEditorStore((state) => state.rootId);
    const rootNode = useEditorStore((state) => rootId ? state.nodes[rootId] : null);
    const { isMobile, frameHeight } = useMobileFrame();
    const { isPreview } = usePreview();
    const sectionRef = useRef<HTMLElement>(null);
    const [isInView, setIsInView] = useState(false);
    const [initialAnimationTriggered, setInitialAnimationTriggered] = useState(false);
    const controls = useAnimation();

    // Check if this is the first section
    const isFirstSection = rootNode?.children?.[0] === id;

    const { setNodeRef, isOver } = useDroppable({
        id: id,
        data: {
            type: 'section',
        },
        disabled: isPreview, // Disable drag and drop in preview mode
    });

    // Combine refs for droppable and animation
    const combinedRef = (element: HTMLElement | null) => {
        setNodeRef(element);
        sectionRef.current = element;
    };

    const handleClick = (e: React.MouseEvent) => {
        if (isPreview) return; // Don't allow selection in preview mode
        e.stopPropagation();
        selectNode(id);
    };

    const isSelected = !isPreview && selectedId === id;

    // Split styles
    const layoutStyle: React.CSSProperties = {};
    const boxStyle: React.CSSProperties = {};

    Object.entries(style || {}).forEach(([key, value]) => {
        if (LAYOUT_KEYS.includes(key)) {
            // @ts-ignore
            layoutStyle[key] = value;
        } else {
            // @ts-ignore
            boxStyle[key] = value;
        }
    });

    // Check if individual padding properties are set
    const hasIndividualPadding = boxStyle.paddingTop || boxStyle.paddingRight || boxStyle.paddingBottom || boxStyle.paddingLeft;
    
    // If individual padding is set, exclude shorthand padding to avoid conflicts
    const boxStyleWithoutPadding: React.CSSProperties = hasIndividualPadding 
        ? (() => {
            const { padding, ...rest } = boxStyle as any;
            return rest;
        })()
        : boxStyle;

    const bgStyle: React.CSSProperties = {
        ...(boxStyle.backgroundImage ? {
            backgroundImage: `url(${boxStyle.backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
        } : {}),
        ...((style as any).gradientType === 'linear' && (style as any).gradientColor1 && (style as any).gradientColor2 ? {
            background: `linear-gradient(${style.gradientDirection || 'to bottom'}, ${(style as any).gradientColor1}, ${(style as any).gradientColor2})`,
        } : {}),
    };

    // Handle background opacity if present
    if (!bgStyle.background && !bgStyle.backgroundImage && (boxStyle as any).backgroundColor) {
        const opacity = (boxStyle as any).backgroundOpacity !== undefined ? parseFloat((boxStyle as any).backgroundOpacity) : 1;
        if (opacity < 1) {
            const hex = (boxStyle as any).backgroundColor.toString();
            // Convert hex to rgba
            let r = 0, g = 0, b = 0;
            if (hex.length === 4) {
                r = parseInt(hex[1] + hex[1], 16);
                g = parseInt(hex[2] + hex[2], 16);
                b = parseInt(hex[3] + hex[3], 16);
            } else if (hex.length === 7) {
                r = parseInt(hex.substring(1, 3), 16);
                g = parseInt(hex.substring(3, 5), 16);
                b = parseInt(hex.substring(5, 7), 16);
            }
            (bgStyle as any).backgroundColor = `rgba(${r}, ${g}, ${b}, ${opacity})`;
            // Remove raw background color from boxStyle so it doesn't override
            delete (boxStyle as any).backgroundColor;
        }
    }

    // Ensure Section specific defaults are respected if not overwritten
    if (layoutStyle.display === undefined) layoutStyle.display = 'block';

    // Apply backdrop blur if specified
    const backdropBlur = (boxStyle as any).backdropBlur ?? 0;
    const backdropBlurFilter = backdropBlur > 0 ? `blur(${backdropBlur}px)` : 'none';

    // Get animation settings
    const initialAnimation = data?.initialAnimation || 'none';
    const scrollAnimation = data?.scrollAnimation || 'none';

    // Get animation variants
    const initialVariants = getAnimationVariants(initialAnimation);
    const scrollVariants = getAnimationVariants(scrollAnimation);

    // Intersection Observer for scroll animation
    useEffect(() => {
        if (isPreview && scrollAnimation !== 'none' && sectionRef.current) {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            setIsInView(true);
                            controls.start(scrollVariants.animate);
                        }
                    });
                },
                { threshold: 0.2 }
            );

            observer.observe(sectionRef.current);

            return () => {
                if (sectionRef.current) {
                    observer.unobserve(sectionRef.current);
                }
            };
        }
    }, [isPreview, scrollAnimation, controls, scrollVariants]);

    // Trigger initial animation when doors open (for first section)
    useEffect(() => {
        if (isPreview && isFirstSection && initialAnimation !== 'none' && !initialAnimationTriggered) {
            // Delay to allow door animation to complete
            const timer = setTimeout(() => {
                setInitialAnimationTriggered(true);
                controls.start(initialVariants.animate);
            }, 2000); // 2 seconds after mount (door animation takes ~1.8s)

            return () => clearTimeout(timer);
        }
    }, [isPreview, isFirstSection, initialAnimation, initialAnimationTriggered, controls, initialVariants]);

    // Determine which animation to use
    const shouldUseInitialAnimation = isFirstSection && initialAnimation !== 'none' && !isInView;
    const animationVariants = shouldUseInitialAnimation ? initialVariants :
        (scrollAnimation !== 'none' ? scrollVariants : { initial: {}, animate: {}, exit: {} });

    // For initial animation, start with initial state
    const motionInitial = shouldUseInitialAnimation && initialAnimationTriggered ? animationVariants.initial :
        (scrollAnimation !== 'none' && !isInView ? animationVariants.initial : {});

    // For animate prop
    const motionAnimate = (shouldUseInitialAnimation && initialAnimationTriggered) ||
        (scrollAnimation !== 'none' && isInView) ? animationVariants.animate : {};

    // Use motion wrapper only in preview mode with animations
    const useMotion = isPreview && (initialAnimation !== 'none' || scrollAnimation !== 'none');

    // Use motion.section for animations, regular section otherwise
    const MotionSection = motion.section as any;

    return (
        <MotionSection
            ref={combinedRef}
            data-section-id={id}
            {...(useMotion ? {
                animate: controls,
                initial: motionInitial,
                variants: animationVariants,
            } : {})}
            className={cn(
                "relative w-full transition-all block", // Ensure block display for proper stacking
                !isPreview && "group", // Only add group class in editor mode
                !isPreview && "border-b border-transparent hover:border-blue-200", // Only show hover border in editor mode
                isSelected ? "ring-2 ring-blue-500 z-10" : "",
                !isPreview && isOver ? "bg-blue-50/30" : "", // Only show drop indicator in editor mode
                !boxStyle.backgroundImage && "bg-white", // Default white if no image
            )}
            style={{
                ...boxStyleWithoutPadding,
                ...bgStyle,
                // Ensure box-sizing is border-box so padding is included in height calculation
                boxSizing: 'border-box',
                backdropFilter: backdropBlurFilter,
                WebkitBackdropFilter: backdropBlurFilter, // Safari support
                // Height handling
                // In preview mode, sections should be 100vh to enable scrolling (one section per viewport)
                // In editor mode, respect the height settings
                minHeight: boxStyle?.height === 'full'
                    ? (isMobile && frameHeight > 0 ? `${frameHeight}px` : '100vh')
                    : (boxStyle?.height === 'auto'
                        ? (isPreview ? '100vh' : (isMobile ? '200px' : (boxStyle?.minHeight || '150px')))
                        : (boxStyle?.minHeight || '150px')),
                // Set actual height when 'full' to prevent overflow
                // In preview mode with 'auto' height, use 100vh so sections scroll one at a time
                // With border-box, padding is included in the height, so section will be exactly frameHeight
                height: boxStyle?.height === 'full'
                    ? (isMobile && frameHeight > 0 ? `${frameHeight}px` : '100vh')
                    : (boxStyle?.height === 'auto'
                        ? (isPreview ? '100vh' : 'auto')
                        : boxStyle?.height),
                // Padding applies to outer or inner? 
                // Usually Padding fits on outer, affecting inner size.
                // With border-box, this padding is included in the height above
                // Support individual padding properties or shorthand
                ...(boxStyle?.paddingTop || boxStyle?.paddingRight || boxStyle?.paddingBottom || boxStyle?.paddingLeft
                    ? {
                        paddingTop: boxStyle.paddingTop || '0px',
                        paddingRight: boxStyle.paddingRight || '0px',
                        paddingBottom: boxStyle.paddingBottom || '0px',
                        paddingLeft: boxStyle.paddingLeft || '0px',
                    }
                    : {
                        padding: boxStyle?.padding || '20px 0',
                    }
                ),
            }}
            onClick={handleClick}
        >
            {/* Label for the section - only show in editor mode */}
            {!isPreview && (
                <div className={cn(
                    "absolute top-0 left-0 bg-blue-500 text-white text-[10px] px-2 py-0.5 opacity-0 transition-opacity z-20 pointer-events-none",
                    isSelected || isOver ? "opacity-100" : "group-hover:opacity-100"
                )}>
                    Section
                </div>
            )}

            {/* Inner Content Wrapper - Recieves Layout Styles */}
            <div
                className="px-4 relative z-10 h-full"
                style={layoutStyle}
            >
                {children}
            </div>

            {/* Empty Section placeholder - only show in editor mode */}
            {!isPreview && !children && (
                <div className="h-20 flex items-center justify-center text-gray-300 pointer-events-none text-sm border border-dashed border-gray-100 rounded m-2">
                    Empty Section
                </div>
            )}
        </MotionSection>
    );
}
