"use strict";
import React from "react";
import { ThemeControls } from "./ThemeControls";
import { ThemeConfig, BackgroundStyle } from "./ThemeTypes";

interface CreatorScaffoldProps {
    config: ThemeConfig;
    updateConfig: (key: keyof ThemeConfig, style: BackgroundStyle) => void;
}

export function CreatorScaffold({ config, updateConfig }: CreatorScaffoldProps) {

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
        return {}; // none
    };

    return (
        <div className="absolute inset-0 overflow-y-auto scrollbar-hide pb-24 scroll-smooth" style={{ WebkitOverflowScrolling: 'touch' }}>

            {/* Section 1 */}
            <section
                id="card-sec-1"
                className="min-h-full flex flex-col justify-center items-center text-center px-8 py-8 relative border-b border-dashed border-gray-300/50"
                style={getStyle(config.section1Background)}
            >
                <ThemeControls
                    label="Section 1"
                    value={config.section1Background}
                    onChange={(val) => updateConfig('section1Background', val)}
                    className="absolute top-4 right-4"
                />
                <div className="w-3/4 h-32 border-2 border-dashed border-rose-200 rounded-lg flex items-center justify-center text-rose-300 text-sm">
                    Section 1 Content
                </div>
            </section>

            {/* Section 2 */}
            <section
                id="card-sec-2"
                className="min-h-full flex flex-col justify-center items-center text-center px-8 py-8 relative border-b border-dashed border-gray-300/50"
                style={getStyle(config.section2Background)}
            >
                <ThemeControls
                    label="Section 2"
                    value={config.section2Background}
                    onChange={(val) => updateConfig('section2Background', val)}
                    className="absolute top-4 right-4"
                />
                <div className="w-3/4 h-64 border-2 border-dashed border-rose-200 rounded-lg flex items-center justify-center text-rose-300 text-sm">
                    Section 2 Content
                </div>
            </section>

            {/* Section 3 */}
            <section
                id="card-sec-3"
                className="min-h-full flex flex-col justify-center items-center text-center px-8 py-8 relative border-b border-dashed border-gray-300/50"
                style={getStyle(config.section3Background)}
            >
                <ThemeControls
                    label="Section 3"
                    value={config.section3Background}
                    onChange={(val) => updateConfig('section3Background', val)}
                    className="absolute top-4 right-4"
                />
                <div className="w-full h-96 border-2 border-dashed border-rose-200 rounded-lg flex items-center justify-center text-rose-300 text-sm">
                    Section 3 Content
                </div>
            </section>

            {/* Section 4 */}
            <section
                id="card-sec-4"
                className="min-h-full flex flex-col justify-center items-center text-center px-8 py-8 relative"
                style={getStyle(config.section4Background)}
            >
                <ThemeControls
                    label="Section 4"
                    value={config.section4Background}
                    onChange={(val) => updateConfig('section4Background', val)}
                    className="absolute top-4 right-4"
                />
                <div className="w-3/4 h-32 border-2 border-dashed border-rose-200 rounded-lg flex items-center justify-center text-rose-300 text-sm">
                    Section 4 Content
                </div>
            </section>

        </div>
    );
}
