"use client";

import { useState } from "react";
import { CreatorCard } from "@/components/creator/CreatorCard";
import { defaultThemeConfig, ThemeConfig, BackgroundStyle } from "@/components/creator/ThemeTypes";
import Link from "next/link"; // For navigation back home if needed

export default function CreatorPage() {
    const [config, setConfig] = useState<ThemeConfig>(defaultThemeConfig);

    const updateConfig = (key: keyof ThemeConfig, style: BackgroundStyle) => {
        setConfig((prev) => ({
            ...prev,
            [key]: style,
        }));
    };

    return (
        <div className="min-h-screen bg-neutral-100 py-8 font-sans">
            <div className="container mx-auto px-4">
                <header className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-rose-700 mb-2">Theme Creator</h1>
                    <p className="text-rose-600 mb-4">Design your wedding card theme. Customize backgrounds for the card and each section.</p>
                    <div className="flex gap-4 justify-center">
                        <Link href="/" className="px-4 py-2 rounded-full border border-rose-300 text-rose-700 bg-white text-sm shadow hover:bg-rose-50 transition-colors">
                            Back to Home
                        </Link>
                        <button
                            className="px-4 py-2 rounded-full bg-rose-600 text-white text-sm shadow hover:bg-rose-700 transition-colors"
                            onClick={() => {
                                console.log("Current Configuration:", JSON.stringify(config, null, 2));
                                alert("Theme config logged to console!");
                            }}
                        >
                            Save Theme JSON
                        </button>
                    </div>
                </header>

                <main className="flex justify-center">
                    {/* The Creator Card itself */}
                    <CreatorCard config={config} updateConfig={updateConfig} />
                </main>
            </div>
        </div>
    );
}
