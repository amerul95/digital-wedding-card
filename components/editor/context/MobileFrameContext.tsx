"use client";

import React, { createContext, useContext } from "react";

interface MobileFrameContextType {
    isMobile: boolean;
    frameHeight: number; // Height of the mobile frame in pixels
}

const MobileFrameContext = createContext<MobileFrameContextType>({
    isMobile: false,
    frameHeight: 0,
});

export function MobileFrameProvider({ 
    children, 
    isMobile 
}: { 
    children: React.ReactNode; 
    isMobile: boolean;
}) {
    // Mobile frame dimensions: 375px width x 812px height
    const frameHeight = isMobile ? 812 : 0;

    return (
        <MobileFrameContext.Provider value={{ isMobile, frameHeight }}>
            {children}
        </MobileFrameContext.Provider>
    );
}

export function useMobileFrame() {
    return useContext(MobileFrameContext);
}
