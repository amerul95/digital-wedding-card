"use client";

import React, { createContext, useContext, useRef, ReactNode } from "react";

interface VideoPlayerContextType {
  playerRef: React.MutableRefObject<any>;
  containerRef: React.MutableRefObject<HTMLDivElement | null>;
  setPlayer: (player: any) => void;
  setContainer: (container: HTMLDivElement | null) => void;
}

const VideoPlayerContext = createContext<VideoPlayerContextType | undefined>(undefined);

export function VideoPlayerProvider({ children }: { children: ReactNode }) {
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const setPlayer = (player: any) => {
    playerRef.current = player;
  };

  const setContainer = (container: HTMLDivElement | null) => {
    containerRef.current = container;
  };

  return (
    <VideoPlayerContext.Provider value={{ playerRef, containerRef, setPlayer, setContainer }}>
      {children}
    </VideoPlayerContext.Provider>
  );
}

export function useVideoPlayer() {
  const context = useContext(VideoPlayerContext);
  if (!context) {
    // Return a safe default instead of throwing
    // This allows components to work even without the provider
    return {
      playerRef: { current: null },
      containerRef: { current: null },
      setPlayer: () => {},
      setContainer: () => {},
    };
  }
  return context;
}
