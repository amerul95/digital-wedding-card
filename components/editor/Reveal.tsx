"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimation, useReducedMotion } from "framer-motion";

export type AnimationTrigger = "scroll" | "door" | "load" | "none";
export type AnimationPreset = "fadeUp" | "fade" | "slideLeft" | "slideRight";

export interface RevealProps {
    children: React.ReactNode;
    rootRef?: React.RefObject<HTMLElement>;
    bottomNavbarHeight?: number;
    trigger: AnimationTrigger;
    preset: AnimationPreset;
    replay?: boolean;
    duration?: number;
    delay?: number;
    threshold?: number;
    doorStatus?: "closed" | "opening" | "opened";
    enabled?: boolean;
}

// Animation presets
const getAnimationVariants = (
    preset: AnimationPreset,
    prefersReducedMotion: boolean
): { initial: any; animate: any; exit: any } => {
    // If reduced motion, only use opacity
    if (prefersReducedMotion) {
        return {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
        };
    }

    switch (preset) {
        case "fadeUp":
            return {
                initial: { opacity: 0, y: 30 },
                animate: { opacity: 1, y: 0 },
                exit: { opacity: 0, y: 30 },
            };
        case "fade":
            return {
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                exit: { opacity: 0 },
            };
        case "slideLeft":
            return {
                initial: { opacity: 0, x: 50 },
                animate: { opacity: 1, x: 0 },
                exit: { opacity: 0, x: 50 },
            };
        case "slideRight":
            return {
                initial: { opacity: 0, x: -50 },
                animate: { opacity: 1, x: 0 },
                exit: { opacity: 0, x: -50 },
            };
        default:
            return {
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                exit: { opacity: 0 },
            };
    }
};

export function Reveal({
    children,
    rootRef,
    bottomNavbarHeight = 80,
    trigger,
    preset,
    replay = false,
    duration = 0.6,
    delay = 0,
    threshold = 0.1,
    doorStatus = "closed",
    enabled = true,
}: RevealProps) {
    const elementRef = useRef<HTMLDivElement>(null);
    const controls = useAnimation();
    const prefersReducedMotion = useReducedMotion();
    const [hasAnimated, setHasAnimated] = useState(false);
    const [isInView, setIsInView] = useState(false);

    const variants = getAnimationVariants(preset, !!prefersReducedMotion);

    // Handle "load" trigger - animate immediately
    useEffect(() => {
        if (!enabled || trigger !== "load") return;

        const timer = setTimeout(() => {
            controls.start("animate");
            setHasAnimated(true);
        }, delay * 1000);

        return () => clearTimeout(timer);
    }, [enabled, trigger, delay, controls]);

    // Handle "door" trigger - wait for door to open
    useEffect(() => {
        if (!enabled || trigger !== "door") return;
        if (doorStatus === "opened" && !hasAnimated) {
            const timer = setTimeout(() => {
                controls.start("animate");
                setHasAnimated(true);
            }, delay * 1000);

            return () => clearTimeout(timer);
        }
    }, [enabled, trigger, doorStatus, hasAnimated, delay, controls]);

    // Handle "scroll" trigger - use IntersectionObserver
    useEffect(() => {
        if (!enabled || trigger !== "scroll") return;

        const element = elementRef.current;
        const root = rootRef?.current;

        if (!element || !root) return;

        // Calculate rootMargin to subtract bottom navbar height
        const rootMargin = `0px 0px -${bottomNavbarHeight}px 0px`;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const isVisible = entry.isIntersecting;
                    setIsInView(isVisible);

                    if (isVisible) {
                        // Element entered view
                        if (!hasAnimated || replay) {
                            setTimeout(() => {
                                controls.start("animate");
                                setHasAnimated(true);
                            }, delay * 1000);
                        }
                    } else if (replay && hasAnimated) {
                        // Element left view and replay is enabled
                        controls.start("exit");
                        setHasAnimated(false);
                    }
                });
            },
            {
                root,
                rootMargin,
                threshold,
            }
        );

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, [
        enabled,
        trigger,
        rootRef,
        bottomNavbarHeight,
        threshold,
        delay,
        replay,
        hasAnimated,
        controls,
    ]);

    // If animation is disabled or trigger is "none", render children directly
    if (!enabled || trigger === "none") {
        return <>{children}</>;
    }

    // For "load" and "door" triggers, start with initial state
    const shouldShowInitial =
        (trigger === "load" && !hasAnimated) ||
        (trigger === "door" && doorStatus !== "opened");

    // For "scroll" trigger, start with initial state if not in view
    const initialState =
        trigger === "scroll" ? (isInView && hasAnimated ? "animate" : "initial") : shouldShowInitial ? "initial" : "animate";

    return (
        <motion.div
            ref={elementRef}
            initial={variants.initial}
            animate={controls}
            variants={variants}
            transition={{
                duration: duration,
                delay: trigger === "scroll" ? 0 : delay,
                ease: [0.25, 0.1, 0.25, 1], // Smooth easing
            }}
            style={{
                willChange: prefersReducedMotion ? undefined : "transform, opacity",
            }}
        >
            {children}
        </motion.div>
    );
}
