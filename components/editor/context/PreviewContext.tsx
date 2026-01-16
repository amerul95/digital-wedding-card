"use client";

import React, { createContext, useContext } from "react";

interface PreviewContextType {
    isPreview: boolean;
}

const PreviewContext = createContext<PreviewContextType>({
    isPreview: false,
});

export function PreviewProvider({ 
    children, 
    isPreview = true 
}: { 
    children: React.ReactNode; 
    isPreview?: boolean;
}) {
    return (
        <PreviewContext.Provider value={{ isPreview }}>
            {children}
        </PreviewContext.Provider>
    );
}

export function usePreview() {
    return useContext(PreviewContext);
}
