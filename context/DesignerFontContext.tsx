"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { getDesignerFonts, CustomFont } from "@/lib/fontStorage";

interface DesignerFontContextType {
  designerId: string | null;
  customFonts: CustomFont[];
  refreshFonts: () => void;
}

const DesignerFontContext = createContext<DesignerFontContextType | undefined>(undefined);

export function DesignerFontProvider({ children }: { children: ReactNode }) {
  const [designerId, setDesignerId] = useState<string | null>(null);
  const [customFonts, setCustomFonts] = useState<CustomFont[]>([]);

  const refreshFonts = useCallback(() => {
    if (designerId) {
      const fonts = getDesignerFonts(designerId);
      setCustomFonts(fonts);
      
      // Inject @font-face CSS for custom fonts
      if (typeof window !== 'undefined' && fonts.length > 0) {
        const styleId = 'custom-fonts-style';
        let styleElement = document.getElementById(styleId) as HTMLStyleElement;
        
        if (!styleElement) {
          styleElement = document.createElement('style');
          styleElement.id = styleId;
          document.head.appendChild(styleElement);
        }

        let css = styleElement.textContent || '';
        
        fonts.forEach(font => {
          const format = font.format || 'woff';
          const fontFaceRule = `
@font-face {
    font-family: "${font.fontFamily}";
    src: url("${font.url}") format("${format}");
}
`;
          // Check if this font is already injected
          if (!css.includes(`font-family: "${font.fontFamily}"`)) {
            css += fontFaceRule;
          }
        });

        styleElement.textContent = css;
      }
    }
  }, [designerId]);

  useEffect(() => {
    async function fetchDesignerId() {
      try {
        const response = await fetch('/api/designer/current-id');
        if (response.ok) {
          const data = await response.json();
          setDesignerId(data.designerId);
        }
      } catch (error) {
        console.error('Error fetching designer ID:', error);
      }
    }
    fetchDesignerId();
  }, []);

  // Refresh fonts when designerId changes
  useEffect(() => {
    refreshFonts();
  }, [refreshFonts]);

  return (
    <DesignerFontContext.Provider value={{ designerId, customFonts, refreshFonts }}>
      {children}
    </DesignerFontContext.Provider>
  );
}

export function useDesignerFonts() {
  const context = useContext(DesignerFontContext);
  if (context === undefined) {
    // Return default values if context is not available (for non-designer pages)
    return { designerId: null, customFonts: [], refreshFonts: () => {} };
  }
  return context;
}
