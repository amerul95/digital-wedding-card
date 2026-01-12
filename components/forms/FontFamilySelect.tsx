"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CURATED_GOOGLE_FONTS } from "@/lib/fonts";
import { useEffect } from "react";

interface FontFamilySelectProps {
  value: string;
  onValueChange: (value: string) => void;
  customFonts?: Array<{ name: string; url: string; fontFamily: string; format?: string }>;
  placeholder?: string;
}

export function FontFamilySelect({
  value,
  onValueChange,
  customFonts = [],
  placeholder = "Select font...",
}: FontFamilySelectProps) {
  // Load Google Fonts on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Load all curated fonts
      const fontsParam = CURATED_GOOGLE_FONTS.map(font => 
        encodeURIComponent(font) + ':wght@400'
      ).join('&family=');
      
      const linkId = 'curated-google-fonts';
      if (!document.getElementById(linkId)) {
        const link = document.createElement('link');
        link.id = linkId;
        link.rel = 'stylesheet';
        link.href = `https://fonts.googleapis.com/css2?family=${fontsParam}&display=swap`;
        document.head.appendChild(link);
      }
    }
  }, []);

  const allFonts = [
    ...CURATED_GOOGLE_FONTS.map(fontName => ({
      name: fontName,
      fontFamily: fontName,
      type: 'google' as const,
    })),
    ...customFonts.map(font => ({
      name: font.fontFamily,
      fontFamily: font.fontFamily,
      type: 'custom' as const,
    })),
  ];

  return (
    <Select value={value || undefined} onValueChange={onValueChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {allFonts.map((font, index) => (
          <SelectItem key={index} value={font.fontFamily}>
            {font.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
