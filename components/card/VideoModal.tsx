"use client";

import React from "react";

interface ModalStyles {
    title?: {
        fontSize?: string | number;
        color?: string;
        fontFamily?: string;
        fontWeight?: string;
    };
    message?: {
        fontSize?: string | number;
        color?: string;
        fontFamily?: string;
    };
}

interface VideoModalProps {
    videoUrl?: string; // YouTube, Vimeo, or direct URL
    styles?: ModalStyles;
    startTime?: number;
}

export function VideoModal({ videoUrl, styles = {}, startTime = 0 }: VideoModalProps) {
    if (!videoUrl) {
        return (
            <div
                className="text-center text-gray-500"
                style={{
                    fontSize: styles.message?.fontSize || undefined,
                    color: styles.message?.color || undefined,
                    fontFamily: styles.message?.fontFamily || undefined,
                }}
            >
                No video available
            </div>
        );
    }

    // Simple helper to detect if it's an embeddable link or needs modification (basic support)
    // Real implementation might want robust embed handling for YT/Vimeo
    const isYoutube = videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be");
    const isVimeo = videoUrl.includes("vimeo.com");

    let embedUrl = videoUrl;

    if (isYoutube) {
        let videoId = "";
        if (videoUrl.includes("watch?v=")) {
            videoId = videoUrl.split("watch?v=")[1].split("&")[0];
        } else if (videoUrl.includes("youtu.be/")) {
            videoId = videoUrl.split("youtu.be/")[1];
        } else if (videoUrl.includes("embed/")) {
            videoId = videoUrl.split("embed/")[1].split("?")[0];
        }

        if (videoId) {
            embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
            if (startTime > 0) {
                embedUrl += `&start=${startTime}`;
            }
        }
    } else if (isVimeo) {
        // Basic vimeo transform if needed, often just player.vimeo.com/video/ID
        // Assuming user might paste full url
    }

    return (
        <div className="w-full aspect-video rounded-lg overflow-hidden bg-black">
            <iframe
                width="100%"
                height="100%"
                src={embedUrl}
                title="Video Player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            ></iframe>
        </div>
    );
}
