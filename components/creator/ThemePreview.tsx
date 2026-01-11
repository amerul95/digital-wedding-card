"use client";

import React from "react";
import { ThemeConfig, BackgroundStyle } from "./ThemeTypes";
import { PreviewScaffold } from "./PreviewScaffold";
import { Footer } from "../card/Footer";

interface ThemePreviewProps {
  config: ThemeConfig;
}

export function ThemePreview({ config }: ThemePreviewProps) {
  const getStyle = (bgStyle: BackgroundStyle): React.CSSProperties => {
    if (bgStyle.type === 'color') {
      return { backgroundColor: bgStyle.value };
    }
    if (bgStyle.type === 'image') {
      return {
        backgroundImage: `url(${bgStyle.value})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'local'
      };
    }
    if (bgStyle.type === 'gradient') {
      return { background: bgStyle.value };
    }
    return {
      background: 'linear-gradient(to bottom, #fff1f2, #ffffff, #ffe4e6)'
    };
  };

  // No-op function for preview mode
  const noOp = () => {};

  return (
    <div className="w-full h-full flex items-center justify-center p-1">
      <div
        className="relative rounded-lg shadow-md border border-gray-200 bg-white overflow-hidden"
        style={{
          aspectRatio: "9 / 16", // Mobile screen ratio
          width: "100%",
          height: "100%",
        }}
      >
        {/* CARD BACKGROUND */}
        <div
          className="absolute inset-0"
          style={getStyle(config.cardBackground)}
        />

        {/* SCAFFOLD CONTENT - Just show initial view, no scrolling */}
        <div className="relative h-full overflow-hidden">
          <PreviewScaffold config={config} />
        </div>

        {/* FIXED FOOTER */}
        <Footer
          onCalendarClick={noOp}
          onContactClick={noOp}
          onLocationClick={noOp}
          onRSVPClick={noOp}
          onGiftsClick={noOp}
          customStyle={{
            background: config.footerBackground.type === 'color' 
              ? config.footerBackground.value 
              : config.footerBackground.type === 'gradient'
              ? config.footerBackground.value
              : config.footerBackground.type === 'image'
              ? `url(${config.footerBackground.value})`
              : undefined,
            color: config.footerIconColor,
            fontFamily: config.footerTextFontFamily,
            fontSize: config.footerTextFontSize,
            fontWeight: config.footerTextFontWeight,
          }}
          customIcons={config.footerIcons}
          containerConfig={config.footerContainerConfig}
        />
      </div>
    </div>
  );
}

