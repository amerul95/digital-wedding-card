"use client";

import { useEffect, useRef, useState } from "react";

interface YouTubePlayerProps {
  videoId: string;
  startTime?: number;
  onReady?: () => void;
}

export function YouTubePlayer({ videoId, startTime = 0, onReady }: YouTubePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const playerRef = useRef<any>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    console.log('🎵 YouTubePlayer mounted with videoId:', videoId);

    // Setup YouTube player when API is ready
    const createPlayer = () => {
      console.log('🎬 Creating YouTube player...');
      if (!iframeRef.current) {
        console.log('❌ No iframe ref found');
        return;
      }

      try {
        playerRef.current = new (window as any).YT.Player(iframeRef.current, {
          videoId: videoId,
          playerVars: {
            autoplay: 1,
            controls: 0,
            loop: 1,
            playlist: videoId,
            playsinline: 1,
            start: startTime,
          },
          events: {
            onReady: (event: any) => {
              console.log('✅ YouTube player ready!');
              setIsReady(true);
              setIsPlaying(true);
              event.target.playVideo();
              onReady?.();
            },
            onStateChange: (event: any) => {
              console.log('🎵 Player state changed:', event.data);
              setIsPlaying(event.data === 1); // 1 = playing
            },
            onError: (event: any) => {
              console.error('❌ YouTube player error:', event.data);
            },
          },
        });
        console.log('✅ Player created successfully');
      } catch (error) {
        console.error('❌ Error creating player:', error);
      }
    };

    // Check if API is already loaded
    if ((window as any).YT && (window as any).YT.Player) {
      console.log('✅ YouTube API already loaded, creating player immediately');
      createPlayer();
      return;
    }

    // Load YouTube IFrame API
    console.log('📦 Loading YouTube IFrame API...');
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    (window as any).onYouTubeIframeAPIReady = () => {
      console.log('✅ YouTube API ready!');
      createPlayer();
    };

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [videoId, onReady]);

  const togglePlay = () => {
    console.log('🎵 Toggle play clicked, isPlaying:', isPlaying);
    if (!playerRef.current) {
      console.log('❌ No player ref');
      return;
    }

    if (isPlaying) {
      console.log('⏸️ Pausing video');
      playerRef.current.pauseVideo();
    } else {
      console.log('▶️ Playing video');
      playerRef.current.playVideo();
    }
  };

  console.log('🎵 YouTubePlayer render - isReady:', isReady, 'isPlaying:', isPlaying);

  return (
    <div className="fixed bottom-24 right-4 z-[10000]">
      {/* Hidden iframe for audio */}
      <div className="hidden">
        <div ref={iframeRef as any} />
      </div>

      {/* Play/Pause Control */}
      {isReady && (
        <button
          onClick={togglePlay}
          className="w-14 h-14 rounded-full bg-rose-600 text-white shadow-2xl hover:bg-rose-700 transition-all flex items-center justify-center group hover:scale-110"
          aria-label={isPlaying ? "Pause music" : "Play music"}
        >
          {isPlaying ? (
            // Pause Icon
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            // Play Icon
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
      )}
    </div>
  );
}

