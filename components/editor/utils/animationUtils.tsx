import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { usePreview } from "@/components/editor/context/PreviewContext";
import { useEditorStore } from "@/components/editor/store";

// Helper function to get animation variants
export function getAnimationVariants(animationType: string | undefined) {
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

// Hook to check if widget is in first section
export function useIsFirstSection(widgetId: string): boolean {
    const rootId = useEditorStore((state) => state.rootId);
    const rootNode = useEditorStore((state) => rootId ? state.nodes[rootId] : null);
    const nodes = useEditorStore((state) => state.nodes);
    
    if (!rootNode || !rootNode.children || rootNode.children.length === 0) {
        return false;
    }
    
    // Find the first section
    const firstSectionId = rootNode.children.find(childId => {
        const child = nodes[childId];
        return child && child.type === 'section';
    });
    
    if (!firstSectionId) return false;
    
    // Check if widget is a descendant of the first section
    const isDescendantOfFirstSection = (nodeId: string, targetId: string): boolean => {
        if (nodeId === targetId) return true;
        const node = nodes[nodeId];
        if (!node || !node.children || node.children.length === 0) return false;
        return node.children.some(childId => isDescendantOfFirstSection(childId, targetId));
    };
    
    return isDescendantOfFirstSection(firstSectionId, widgetId);
}

// Hook to get bottom navbar height for intersection observer rootMargin
export function useBottomNavbarHeight(): number {
    const nodes = useEditorStore((state) => state.nodes);
    const rootId = useEditorStore((state) => state.rootId);
    const rootNode = useEditorStore((state) => rootId ? state.nodes[rootId] : null);
    
    // Find bottom navbar widget
    const bottomNavNode = Object.values(nodes).find(n => n.type === 'bottom-nav');
    if (!bottomNavNode) return 80; // Default height + margin
    
    // Get height from node data or style
    const height = bottomNavNode.data?.height || bottomNavNode.style?.height || 64;
    const bottomPosition = bottomNavNode.data?.bottomPosition || 16;
    
    // Return total space needed (height + bottom position + some margin)
    return (typeof height === 'number' ? height : parseInt(height) || 64) + 
           (typeof bottomPosition === 'number' ? bottomPosition : parseInt(bottomPosition) || 16) + 20;
}

// Hook to use animations for widgets
export function useWidgetAnimations(
    widgetId: string,
    initialAnimation?: string,
    scrollAnimation?: string
) {
    const { isPreview } = usePreview();
    const controls = useAnimation();
    const widgetRef = useRef<HTMLElement>(null);
    const [isInView, setIsInView] = useState(false);
    const [initialAnimationTriggered, setInitialAnimationTriggered] = useState(false);
    const isFirstSection = useIsFirstSection(widgetId);
    const bottomNavbarHeight = useBottomNavbarHeight();
    
    const initialVariants = getAnimationVariants(initialAnimation);
    const scrollVariants = getAnimationVariants(scrollAnimation);
    
    // Intersection Observer for scroll animation - account for bottom navbar
    useEffect(() => {
        if (isPreview && scrollAnimation && scrollAnimation !== 'none' && widgetRef.current) {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            // Check if element is above bottom navbar
                            const rect = entry.boundingClientRect;
                            const viewportHeight = window.innerHeight;
                            const elementBottom = rect.bottom;
                            const navbarTop = viewportHeight - bottomNavbarHeight;
                            
                            // Element should be visible above bottom navbar (at least 20% of element visible)
                            // Only trigger if element bottom is above navbar top
                            if (elementBottom < navbarTop && rect.top < navbarTop) {
                                setIsInView(true);
                                controls.start(scrollVariants.animate);
                            }
                        }
                    });
                },
                { 
                    threshold: 0.2,
                    rootMargin: `0px 0px ${bottomNavbarHeight}px 0px` // Account for bottom navbar
                }
            );

            observer.observe(widgetRef.current);

            return () => {
                if (widgetRef.current) {
                    observer.unobserve(widgetRef.current);
                }
            };
        }
    }, [isPreview, scrollAnimation, controls, scrollVariants, bottomNavbarHeight]);
    
    // Trigger initial animation when doors open (for widgets in first section)
    useEffect(() => {
        if (isPreview && isFirstSection && initialAnimation && initialAnimation !== 'none' && !initialAnimationTriggered) {
            // Delay to allow door animation to complete
            const timer = setTimeout(() => {
                setInitialAnimationTriggered(true);
                controls.start(initialVariants.animate);
            }, 2000); // 2 seconds after mount (door animation takes ~1.8s)

            return () => clearTimeout(timer);
        }
    }, [isPreview, isFirstSection, initialAnimation, initialAnimationTriggered, controls, initialVariants]);
    
    // Determine which animation to use
    const shouldUseInitialAnimation = isFirstSection && initialAnimation && initialAnimation !== 'none' && !isInView;
    const animationVariants = shouldUseInitialAnimation ? initialVariants : 
                             (scrollAnimation && scrollAnimation !== 'none' ? scrollVariants : { initial: {}, animate: {}, exit: {} });

    // For initial animation, start with initial state
    const motionInitial = shouldUseInitialAnimation && initialAnimationTriggered ? animationVariants.initial : 
                         (scrollAnimation && scrollAnimation !== 'none' && !isInView ? animationVariants.initial : {});
    
    // For animate prop
    const motionAnimate = (shouldUseInitialAnimation && initialAnimationTriggered) || 
                         (scrollAnimation && scrollAnimation !== 'none' && isInView) ? animationVariants.animate : {};

    // Use motion wrapper only in preview mode with animations
    const useMotion = isPreview && ((initialAnimation && initialAnimation !== 'none') || (scrollAnimation && scrollAnimation !== 'none'));
    
    return {
        widgetRef,
        controls,
        motionInitial,
        motionAnimate,
        animationVariants,
        useMotion,
    };
}
