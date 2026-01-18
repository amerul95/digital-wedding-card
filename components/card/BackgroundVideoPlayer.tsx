"use client";

import React, { useEffect, useRef } from "react";

interface BackgroundVideoPlayerProps {
    videoUrl?: string;
    startTime?: number;
    duration?: number; // Duration in seconds (0 = unlimited)
    playerRef?: React.MutableRefObject<any>;
    containerRef?: React.MutableRefObject<HTMLDivElement | null>;
    onPlayerReady?: (player: any) => void;
}

export function BackgroundVideoPlayer({ 
    videoUrl, 
    startTime = 0, 
    duration = 0,
    playerRef: externalPlayerRef,
    containerRef: externalContainerRef,
    onPlayerReady
}: BackgroundVideoPlayerProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const localPlayerRef = useRef<any>(null);
    const durationTimerRef = useRef<NodeJS.Timeout | null>(null);
    
    // Use external player ref if provided, otherwise use local
    const playerRef = externalPlayerRef || localPlayerRef;
    // Always use local container ref (externalContainerRef is mainly for sharing, but we create our own container)
    const targetContainer = containerRef;

    if (!videoUrl) return null;

    const isYoutube = videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be");
    let videoId = "";

    if (isYoutube) {
        if (videoUrl.includes("watch?v=")) {
            videoId = videoUrl.split("watch?v=")[1].split("&")[0];
        } else if (videoUrl.includes("youtu.be/")) {
            videoId = videoUrl.split("youtu.be/")[1].split("?")[0];
        } else if (videoUrl.includes("embed/")) {
            videoId = videoUrl.split("embed/")[1].split("?")[0];
        }
    }

    useEffect(() => {
        if (!isYoutube || !videoId) {
            console.log("BackgroundVideoPlayer: Missing requirements", { isYoutube, videoId, videoUrl });
            return;
        }

        console.log("BackgroundVideoPlayer: Setting up player", { videoId, startTime, duration, hasContainer: !!targetContainer.current });

        const loadYouTubeAPI = () => {
            if ((window as any).YT && (window as any).YT.Player) {
                return Promise.resolve();
            }

            return new Promise<void>((resolve) => {
                if ((window as any).onYouTubeIframeAPIReady) {
                    const originalCallback = (window as any).onYouTubeIframeAPIReady;
                    (window as any).onYouTubeIframeAPIReady = () => {
                        originalCallback();
                        resolve();
                    };
                } else {
                    (window as any).onYouTubeIframeAPIReady = () => {
                        resolve();
                    };
                }

                const tag = document.createElement('script');
                tag.src = 'https://www.youtube.com/iframe_api';
                const firstScriptTag = document.getElementsByTagName('script')[0];
                firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
            });
        };

        const setupPlayer = async () => {
            await loadYouTubeAPI();

            // Ensure container is ready
            if (!targetContainer.current) {
                console.warn("BackgroundVideoPlayer: Container ref not ready");
                return;
            }

            // Always create a new player for background playback
            // The container is local to this component

            try {
                playerRef.current = new (window as any).YT.Player(targetContainer.current, {
                    videoId: videoId,
                    playerVars: {
                        autoplay: 1,
                        mute: 1, // Start muted for autoplay
                        controls: 0,
                        loop: duration === 0 ? 1 : 0,
                        playlist: duration === 0 ? videoId : undefined,
                        playsinline: 1,
                        start: startTime,
                        rel: 0,
                        modestbranding: 1,
                    },
                    events: {
                        onReady: (event: any) => {
                            console.log("BackgroundVideoPlayer: Player ready");
                            
                            // Ensure video is playing
                            try {
                                const playerState = event.target.getPlayerState();
                                if (playerState !== 1) { // 1 = playing
                                    event.target.playVideo();
                                }
                            } catch (e) {
                                console.log("Error ensuring playback:", e);
                            }
                            
                            // Unmute after a short delay and ensure playback continues
                            setTimeout(() => {
                                try {
                                    event.target.unMute();
                                    // Ensure still playing after unmute
                                    const state = event.target.getPlayerState();
                                    if (state !== 1) {
                                        event.target.playVideo();
                                    }
                                } catch (e) {
                                    console.log("Error unmuting:", e);
                                }
                            }, 500);
                            
                            // Handle duration limit
                            if (duration > 0) {
                                durationTimerRef.current = setTimeout(() => {
                                    try {
                                        event.target.pauseVideo();
                                    } catch (e) {
                                        console.log("Error pausing after duration:", e);
                                    }
                                }, duration * 1000);
                            }
                            
                            onPlayerReady?.(event.target);
                        },
                        onStateChange: (event: any) => {
                            // Handle video end if not looping
                            if (event.data === 0 && duration === 0) {
                                // Video ended, restart if looping
                                try {
                                    event.target.seekTo(startTime, true);
                                    event.target.playVideo();
                                } catch (e) {
                                    console.log("Error restarting:", e);
                                }
                            }
                        },
                        onError: (event: any) => {
                            console.error("YouTube player error:", event.data);
                        },
                    },
                });
            } catch (error) {
                console.error("Error creating YouTube player:", error);
            }
        };

        setupPlayer();

        return () => {
            if (durationTimerRef.current) {
                clearTimeout(durationTimerRef.current);
            }
            // Don't destroy player - let it persist
        };
    }, [videoUrl, videoId, startTime, duration, isYoutube]);

    return (
        <div
            ref={targetContainer as React.RefObject<HTMLDivElement>}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '1px',
                height: '1px',
                opacity: 0,
                pointerEvents: 'none',
                zIndex: -1,
            }}
            aria-hidden="true"
        />
    );
}
