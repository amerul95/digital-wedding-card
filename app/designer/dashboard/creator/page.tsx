"use client";

import { useState } from "react";
import { CreatorCard } from "@/components/creator/CreatorCard";
import { defaultThemeConfig, ThemeConfig, BackgroundStyle, FooterIcons } from "@/components/creator/ThemeTypes";
import Link from "next/link"; // For navigation back home if needed

export default function CreatorPage() {
    const [config, setConfig] = useState<ThemeConfig>(defaultThemeConfig);

    const updateConfig = (key: keyof ThemeConfig, value: BackgroundStyle | string | FooterIcons) => {
        setConfig((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    return (
        <div className="min-h-screen py-8 font-sans">
            <div className="container mx-auto px-4">
                <header className="mb-8 text-center">
                    <h1 className="text-3xl font-bold mb-2" style={{ fontSize: '24px', color: '#36463A' }}>Theme Creator</h1>
                    <p className="mb-4" style={{ color: '#36463A' }}>Design your wedding card theme. Customize backgrounds for the card and each section.</p>
                    <div className="flex gap-4 justify-center">
                        <Link href="/" className="px-4 py-2 rounded-full border border-[#36463A] text-[#36463A] bg-white text-sm shadow hover:bg-gray-50 transition-colors">
                            Back to Home
                        </Link>
                        <button
                            className="px-4 py-2 rounded-full bg-[#36463A] text-white text-sm shadow hover:bg-[#2d3a2f] transition-colors"
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

