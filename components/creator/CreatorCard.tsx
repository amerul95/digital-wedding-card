"use strict";
import React from "react";
import { ThemeConfig, BackgroundStyle, FooterIcons } from "./ThemeTypes";
import { CreatorScaffold } from "./CreatorScaffold";
import { Footer } from "../card/Footer"; // Reusing existing Footer

interface CreatorCardProps {
    config: ThemeConfig;
    updateConfig: (key: keyof ThemeConfig, value: BackgroundStyle | string | FooterIcons) => void;
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
        if (bgStyle.type === 'gradient') {
            return { background: bgStyle.value };
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
                        background: config.footerBackground.type === 'color' 
                            ? config.footerBackground.value 
                            : config.footerBackground.type === 'gradient'
                            ? config.footerBackground.value
                            : config.footerBackground.type === 'image'
                            ? `url(${config.footerBackground.value})`
                            : undefined,
                        color: config.footerIconColor,
                        textColor: config.footerTextColor || config.footerIconColor,
                        boxShadow: config.footerBoxShadow
                    }}
                    customIcons={config.footerIcons}
                />
            </div>
        </div>
    );
}
