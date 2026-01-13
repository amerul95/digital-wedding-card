"use strict";
import React from "react";
import { ThemeConfig, BackgroundStyle } from "./ThemeTypes";

interface CreatorScaffoldProps {
    config: ThemeConfig;
    updateConfig: (key: keyof ThemeConfig, style: BackgroundStyle) => void;
    cardPaddingTop?: number;
    cardPaddingRight?: number;
    cardPaddingBottom?: number;
    cardPaddingLeft?: number;
}

export function CreatorScaffold({ 
    config, 
    updateConfig,
    cardPaddingTop = 32,
    cardPaddingRight = 32,
    cardPaddingBottom = 32,
    cardPaddingLeft = 32,
}: CreatorScaffoldProps) {

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
        return {}; // none
    };

    return (
        <div className="absolute inset-0 overflow-y-auto scrollbar-hide pb-24 scroll-smooth" style={{ WebkitOverflowScrolling: 'touch' }}>

            {/* Section 1 */}
            <section
                id="card-sec-1"
                className={`flex flex-col justify-center items-center text-center relative border-b border-dashed border-gray-300/50 ${config.section1Height ? '' : 'min-h-full'}`}
                style={{
                    ...getStyle(config.section1Background),
                    paddingTop: `${cardPaddingTop}px`,
                    paddingRight: `${cardPaddingRight}px`,
                    paddingBottom: `${cardPaddingBottom}px`,
                    paddingLeft: `${cardPaddingLeft}px`,
                    ...(config.section1Height ? { height: `${config.section1Height}px` } : {}),
                }}
            >
                <div className="w-3/4 h-32 border-2 border-dashed border-rose-200 rounded-lg flex items-center justify-center text-rose-300 text-sm">
                    Section 1 Content
                </div>
            </section>

            {/* Section 2 */}
            <section
                id="card-sec-2"
                className={`flex flex-col justify-center items-center text-center relative border-b border-dashed border-gray-300/50 ${config.section2Height ? '' : 'min-h-full'}`}
                style={{
                    ...getStyle(config.section2Background),
                    paddingTop: `${cardPaddingTop}px`,
                    paddingRight: `${cardPaddingRight}px`,
                    paddingBottom: `${cardPaddingBottom}px`,
                    paddingLeft: `${cardPaddingLeft}px`,
                    ...(config.section2Height ? { height: `${config.section2Height}px` } : {}),
                }}
            >
                <div className="w-3/4 h-64 border-2 border-dashed border-rose-200 rounded-lg flex items-center justify-center text-rose-300 text-sm">
                    Section 2 Content
                </div>
            </section>

            {/* Section 3 */}
            <section
                id="card-sec-3"
                className={`flex flex-col justify-center items-center text-center relative border-b border-dashed border-gray-300/50 ${config.section3Height ? '' : 'min-h-full'}`}
                style={{
                    ...getStyle(config.section3Background),
                    paddingTop: `${cardPaddingTop}px`,
                    paddingRight: `${cardPaddingRight}px`,
                    paddingBottom: `${cardPaddingBottom}px`,
                    paddingLeft: `${cardPaddingLeft}px`,
                    ...(config.section3Height ? { height: `${config.section3Height}px` } : {}),
                }}
            >
                <div className="w-full h-96 border-2 border-dashed border-rose-200 rounded-lg flex items-center justify-center text-rose-300 text-sm">
                    Section 3 Content
                </div>
            </section>

            {/* Section 4 */}
            <section
                id="card-sec-4"
                className={`flex flex-col justify-center items-center text-center relative ${config.section4Height ? '' : 'min-h-full'}`}
                style={{
                    ...getStyle(config.section4Background),
                    paddingTop: `${cardPaddingTop}px`,
                    paddingRight: `${cardPaddingRight}px`,
                    paddingBottom: `${cardPaddingBottom}px`,
                    paddingLeft: `${cardPaddingLeft}px`,
                    ...(config.section4Height ? { height: `${config.section4Height}px` } : {}),
                }}
            >
                <div className="w-3/4 h-32 border-2 border-dashed border-rose-200 rounded-lg flex items-center justify-center text-rose-300 text-sm">
                    Section 4 Content
                </div>
            </section>

        </div>
    );
}
