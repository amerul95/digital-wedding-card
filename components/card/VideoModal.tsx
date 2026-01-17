"use client";

import React, { useEffect, useRef } from "react";

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
    duration?: number; // Duration in seconds (0 = unlimited)
    playerRef?: React.MutableRefObject<any>; // Optional: use existing player instance
    containerRef?: React.MutableRefObject<HTMLDivElement | null>; // Optional: use existing container
    onPlayerReady?: (player: any) => void; // Callback when player is ready
    isVisible?: boolean; // Whether modal is visible (to pause video when hidden)
}

export function VideoModal({ videoUrl, styles = {}, startTime = 0, duration = 0, playerRef: externalPlayerRef, containerRef: externalContainerRef, onPlayerReady, isVisible = true }: VideoModalProps) {
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

    const iframeRef = useRef<HTMLIFrameElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const localPlayerRef = useRef<any>(null);
    
    // Use external player ref if provided, otherwise use local
    const playerRef = externalPlayerRef || localPlayerRef;

    // Simple helper to detect if it's an embeddable link or needs modification (basic support)
    // Real implementation might want robust embed handling for YT/Vimeo
    const isYoutube = videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be");
    const isVimeo = videoUrl.includes("vimeo.com");

    let embedUrl = videoUrl;
    let videoId = "";

    if (isYoutube) {
        if (videoUrl.includes("watch?v=")) {
            videoId = videoUrl.split("watch?v=")[1].split("&")[0];
        } else if (videoUrl.includes("youtu.be/")) {
            videoId = videoUrl.split("youtu.be/")[1].split("?")[0];
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

    // Determine if we should use YouTube IFrame API (for duration control or better autoplay)
    const useYouTubeAPI = isYoutube && videoId;

    // Handle duration limit and autoplay using YouTube IFrame API when needed
    useEffect(() => {
        // Use YouTube IFrame API for better control (autoplay, startTime, duration)
        const targetContainer = containerRef.current;
        if (!useYouTubeAPI || !targetContainer) return;

        // Load YouTube IFrame API if not already loaded (always use it for better control)
        const loadYouTubeAPI = () => {
            if ((window as any).YT && (window as any).YT.Player) {
                return Promise.resolve();
            }

            return new Promise<void>((resolve) => {
                // Check if API is already being loaded
                if ((window as any).onYouTubeIframeAPIReady) {
                    const originalCallback = (window as any).onYouTubeIframeAPIReady;
                    (window as any).onYouTubeIframeAPIReady = () => {
                        originalCallback();
                        resolve();
                    };
                    return;
                }

                const tag = document.createElement('script');
                tag.src = "https://www.youtube.com/iframe_api";
                const firstScriptTag = document.getElementsByTagName('script')[0];
                firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
                
                (window as any).onYouTubeIframeAPIReady = () => {
                    resolve();
                };
            });
        };

        let player: any = null;
        let timeoutId: NodeJS.Timeout | null = null;

        const setupPlayer = async () => {
            try {
                // If player already exists in local ref, don't create a new one
                if (playerRef.current) {
                    console.log("Player already exists");
                    return;
                }

                await loadYouTubeAPI();
                
                // Use local container for player initialization
                const targetContainer = containerRef.current;
                if (!targetContainer) {
                    // Wait a bit for container to be available
                    setTimeout(() => setupPlayer(), 100);
                    return;
                }

                // Use container div - API will create iframe inside it
                player = new (window as any).YT.Player(targetContainer, {
                    videoId: videoId,
                    playerVars: {
                        autoplay: 1, // Autoplay when modal opens
                        start: startTime || 0,
                        controls: 1, // Show YouTube's native controls
                        mute: 1, // Start muted to ensure autoplay works (will unmute after playing starts)
                        modestbranding: 1,
                        rel: 0,
                    },
                    events: {
                        onReady: (event: any) => {
                            // Store player reference
                            playerRef.current = event.target;
                            
                            // Play video when modal opens
                            try {
                                event.target.playVideo();
                                console.log("Video player ready and playing in modal");
                                
                                // Unmute after a short delay to ensure playback has started
                                // This helps bypass autoplay restrictions
                                setTimeout(() => {
                                    try {
                                        event.target.unMute();
                                        console.log("Video unmuted");
                                    } catch (error) {
                                        console.log("Could not unmute video");
                                    }
                                }, 500);
                            } catch (error) {
                                console.log("Autoplay may be blocked by browser policy");
                            }

                            // Set timeout to pause video after duration if specified
                            if (duration && duration > 0) {
                                timeoutId = setTimeout(() => {
                                    if (playerRef.current && playerRef.current.pauseVideo) {
                                        playerRef.current.pauseVideo();
                                    }
                                }, duration * 1000);
                            }
                            
                            if (onPlayerReady) {
                                onPlayerReady(event.target);
                            }
                        },
                        onStateChange: (event: any) => {
                            // Log state changes for debugging
                            if (event.data === (window as any).YT.PlayerState.PLAYING) {
                                console.log("Video started playing");
                                // Ensure video is unmuted when it starts playing
                                try {
                                    if (event.target.isMuted && event.target.isMuted()) {
                                        event.target.unMute();
                                    }
                                } catch (error) {
                                    // Ignore unmute errors
                                }
                            }
                        },
                    },
                });
            } catch (error) {
                console.error("Error creating YouTube player:", error);
            }
        };

        setupPlayer();

        return () => {
            // Cleanup when component unmounts
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            if (player && player.destroy) {
                try {
                    player.destroy();
                } catch (error) {
                    // Ignore destroy errors
                }
            }
        };
    }, [isYoutube, videoId, startTime, duration, containerRef, onPlayerReady]);

    // No need to move iframe - video will be created directly in modal container
    
    // Always use our own container for rendering in the modal
    // If we have an external player, we'll move its iframe here via useEffect above
    return (
        <div className="w-full aspect-video rounded-lg overflow-hidden bg-black relative">
            {useYouTubeAPI ? (
                // Use div for YouTube IFrame API - API will create iframe inside
                // If using external player, the iframe will be moved here via useEffect
                <div 
                    ref={containerRef} 
                    className="w-full h-full"
                    style={{
                        minHeight: '200px',
                        backgroundColor: '#000'
                    }}
                />
            ) : (
                // Use regular iframe for non-YouTube or fallback
                <iframe
                    ref={iframeRef}
                    width="100%"
                    height="100%"
                    src={embedUrl}
                    title="Video Player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            )}
        </div>
    );
}
