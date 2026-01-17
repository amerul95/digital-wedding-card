"use client";

import { useEditorStore } from "@/components/editor/store";
import { cn } from "@/lib/utils";
import { useDroppable } from "@dnd-kit/core";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade, EffectCube, EffectCoverflow, EffectFlip, EffectCards } from 'swiper/modules';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'swiper/css/effect-cube';
import 'swiper/css/effect-coverflow';
import 'swiper/css/effect-flip';
import 'swiper/css/effect-cards';
import { motion } from "framer-motion";
import { useWidgetAnimations } from "@/components/editor/utils/animationUtils";

interface ImageSliderWidgetProps {
    id: string;
    data: any;
    style: any;
}

export function ImageSliderWidget({ id, data, style }: ImageSliderWidgetProps) {
    const selectNode = useEditorStore((state) => state.selectNode);
    const selectedId = useEditorStore((state) => state.selectedId);
    const updateNodeData = useEditorStore((state) => state.updateNodeData);

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        selectNode(id);
    };

    const isSelected = selectedId === id;
    const images = data.images || [];

    // Container width handling
    const isFullWidth = data.containerWidth === 'full' || !data.containerWidth;
    
    // Padding handling - individual sides
    const paddingTop = data.sliderPaddingTop !== undefined ? `${data.sliderPaddingTop}px` : undefined;
    const paddingRight = data.sliderPaddingRight !== undefined ? `${data.sliderPaddingRight}px` : undefined;
    const paddingBottom = data.sliderPaddingBottom !== undefined ? `${data.sliderPaddingBottom}px` : undefined;
    const paddingLeft = data.sliderPaddingLeft !== undefined ? `${data.sliderPaddingLeft}px` : undefined;
    
    const containerStyle: React.CSSProperties = {
        ...style,
        width: isFullWidth ? '100%' : `${Math.min(data.customWidth || 300, 100)}%`,
        maxWidth: isFullWidth ? 'none' : '100%',
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft,
    };

    // Pagination handling - use enablePagination to determine if pagination should be shown
    const shouldShowPagination = data.enablePagination !== false; // Default to true if not set
    const paginationConfig = shouldShowPagination && data.paginationType && data.paginationType !== 'none'
        ? { clickable: true, type: data.paginationType }
        : false;

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
                "relative transition-all group z-0", // Removed p-1 padding - now controlled by data properties
                isSelected ? "ring-2 ring-blue-500 z-10" : "hover:ring-1 hover:ring-blue-300",
            )}
            style={containerStyle}
            onClick={handleClick}
        >
            {images.length > 0 ? (
                <Swiper
                    modules={[Navigation, Pagination, Autoplay, EffectFade, EffectCube, EffectCoverflow, EffectFlip, EffectCards]}
                    spaceBetween={data.spaceBetween || 0}
                    slidesPerView={data.slidesPerView || 1}
                    navigation={data.showNavigation}
                    pagination={paginationConfig}
                    autoplay={data.autoPlay ? { delay: 3000, disableOnInteraction: false } : false}
                    effect={data.effect || 'slide'}
                    className="w-full h-full rounded"
                >
                    {images.map((img: string, idx: number) => (
                        <SwiperSlide key={idx}>
                            <div className="w-full h-64 relative">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={img}
                                    alt={`Slide ${idx}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            ) : (
                <div className="w-full h-48 bg-gray-100 rounded-lg flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200">
                    <span className="text-sm">Empty Slider</span>
                    <span className="text-xs">Add images in properties</span>
                </div>
            )}
        </MotionDiv>
    );
}
