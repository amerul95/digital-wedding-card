"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Play, Pause } from "lucide-react";

interface MusicControllerProps {
    playerRef?: React.MutableRefObject<any>;
    onPlay?: () => void;
    onPause?: () => void;
}

export function MusicController({ playerRef, onPlay, onPause }: MusicControllerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Check player state immediately and periodically
    useEffect(() => {
        const checkPlayerState = () => {
            if (!playerRef?.current) return;
            
            try {
                const playerState = playerRef.current?.getPlayerState?.();
                // 1 = playing, 2 = paused, 0 = ended, -1 = unstarted, 3 = buffering
                setIsPlaying(playerState === 1);
            } catch (e) {
                // Ignore errors - player might not be ready yet
            }
        };

        // Check immediately if player is available
        if (playerRef?.current) {
            checkPlayerState();
        }

        // Set up periodic check to stay in sync with player state
        // This also handles the case where player becomes available after mount
        const interval = setInterval(checkPlayerState, 500);

        return () => {
            clearInterval(interval);
        };
    }, [playerRef]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handlePlay = () => {
        if (playerRef?.current) {
            try {
                playerRef.current.playVideo();
                setIsPlaying(true);
                onPlay?.();
            } catch (e) {
                console.log("Error playing:", e);
            }
        }
        setIsOpen(false);
    };

    const handlePause = () => {
        if (playerRef?.current) {
            try {
                playerRef.current.pauseVideo();
                setIsPlaying(false);
                onPause?.();
            } catch (e) {
                console.log("Error pausing:", e);
            }
        }
        setIsOpen(false);
    };

    return (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full p-2 shadow-lg hover:bg-white transition-colors flex items-center gap-2"
                aria-label="Music Controls"
            >
                <ChevronDown 
                    size={20} 
                    className={`text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>
            
            {isOpen && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 p-2 flex flex-col gap-1 min-w-[120px]">
                    {isPlaying ? (
                        <button
                            onClick={handlePause}
                            className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-100 transition-colors text-sm text-gray-700"
                        >
                            <Pause size={16} />
                            <span>Pause</span>
                        </button>
                    ) : (
                        <button
                            onClick={handlePlay}
                            className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-100 transition-colors text-sm text-gray-700"
                        >
                            <Play size={16} />
                            <span>Play</span>
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
