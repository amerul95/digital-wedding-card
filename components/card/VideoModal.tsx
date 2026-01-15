"use client";

import React from "react";

interface VideoModalProps {
    videoUrl?: string; // YouTube, Vimeo, or direct URL
}

export function VideoModal({ videoUrl }: VideoModalProps) {
    if (!videoUrl) return <div className="text-center text-gray-500">No video available</div>;

    // Simple helper to detect if it's an embeddable link or needs modification (basic support)
    // Real implementation might want robust embed handling for YT/Vimeo
    const isYoutube = videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be");
    const isVimeo = videoUrl.includes("vimeo.com");

    let embedUrl = videoUrl;

    if (isYoutube) {
        if (videoUrl.includes("watch?v=")) {
            const videoId = videoUrl.split("watch?v=")[1].split("&")[0];
            embedUrl = `https://www.youtube.com/embed/${videoId}`;
        } else if (videoUrl.includes("youtu.be/")) {
            const videoId = videoUrl.split("youtu.be/")[1];
            embedUrl = `https://www.youtube.com/embed/${videoId}`;
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
