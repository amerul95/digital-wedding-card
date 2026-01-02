"use strict";
import React from "react";
import { ThemeConfig, BackgroundStyle } from "./ThemeTypes";
import { CreatorScaffold } from "./CreatorScaffold";
import { ThemeControls } from "./ThemeControls";
import { Footer } from "../card/Footer"; // Reusing existing Footer

interface CreatorCardProps {
    config: ThemeConfig;
    updateConfig: (key: keyof ThemeConfig, style: BackgroundStyle) => void;
}

export function CreatorCard({ config, updateConfig }: CreatorCardProps) {

    const getStyle = (bgStyle: BackgroundStyle): React.CSSProperties => {
        if (bgStyle.type === 'color') {
            return { backgroundColor: bgStyle.value };
        }
        if (bgStyle.type === 'image') {
            return {
                backgroundImage: `url(${bgStyle.value})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            };
        }
        return {
            // Default fallback if 'none' (though usually we want a base color)
            background: 'linear-gradient(to bottom, #fff1f2, #ffffff, #ffe4e6)'
        };
    };

    return (
        // Outer wrapper matching CeremonyCard roughly (but maybe less restrictive on height if embedded)
        // We keep the logic for aspect ratio and sizing exactly as User requested: "size of card... fix no change"
        <div className="w-full flex items-center justify-center p-4">
            <div
                className="relative rounded-3xl shadow-2xl border border-gray-200 bg-white"
                style={{
                    aspectRatio: "420 / 945",
                    width: "min(90vw, calc(90vh * 420 / 945))", // Copy exact logic from CeremonyCard
                    perspective: 1200,
                    transformStyle: "preserve-3d",
                    overflow: "hidden",
                }}
            >
                {/* CARD BACKGROUND */}
                <div
                    className="absolute inset-0 transition-all duration-300 ease-in-out"
                    style={getStyle(config.cardBackground)}
                />

                {/* Card Background Controls - Floating at top left */}
                <ThemeControls
                    label="Card BG"
                    value={config.cardBackground}
                    onChange={(val) => updateConfig('cardBackground', val)}
                    className="absolute top-4 left-4"
                />

                {/* ADDED: Footer Controls - Floating at bottom left */}
                <div className="absolute bottom-20 left-4 z-50 flex flex-col gap-2">
                    <ThemeControls
                        label="Footer BG"
                        value={config.footerBackground}
                        onChange={(val) => updateConfig('footerBackground', val)}
                    />
                    <div className="p-2 bg-white/90 backdrop-blur-sm rounded-lg border border-rose-200 shadow-sm flex flex-col gap-1">
                        <span className="text-xs font-semibold text-rose-800 uppercase tracking-wider">Icon Color</span>
                        <div className="flex items-center gap-2">
                            <input
                                type="color"
                                value={config.footerIconColor}
                                onChange={(e) => updateConfig('footerIconColor', e.target.value as any)}
                                className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                            />
                            <span className="text-[10px] text-gray-500 font-mono">{config.footerIconColor}</span>
                        </div>
                    </div>
                </div>

                {/* SCAFFOLD CONTENT */}
                <CreatorScaffold config={config} updateConfig={updateConfig} />

                {/* FIXED FOOTER */}
                {/* User requested "size of menu bottom" fixed. using actual Footer accomplishes this. */}
                <Footer
                    onCalendarClick={() => { }}
                    onContactClick={() => { }}
                    onLocationClick={() => { }}
                    onRSVPClick={() => { }}
                    customStyle={{
                        background: config.footerBackground.type === 'color' ? config.footerBackground.value : undefined, // Simplify for now, assuming color. If image needed, logic needs update in Footer.tsx
                        color: config.footerIconColor
                    }}
                />
            </div>
        </div>
    );
}
