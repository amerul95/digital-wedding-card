"use client";

import { useState } from "react";
import { CreatorCard } from "@/components/creator/CreatorCard";
import { defaultThemeConfig, ThemeConfig, BackgroundStyle } from "@/components/creator/ThemeTypes";
import Link from "next/link";

export default function CreateThemePage() {
    const [config, setConfig] = useState<ThemeConfig>(defaultThemeConfig);
    const [themeName, setThemeName] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const updateConfig = (key: keyof ThemeConfig, style: BackgroundStyle) => {
        setConfig((prev) => ({
            ...prev,
            [key]: style,
        }));
    };

    const handleSaveTheme = async () => {
        if (!themeName.trim()) {
            alert("Please enter a theme name");
            return;
        }

        setIsSaving(true);
        try {
            // TODO: Replace with actual API call
            const response = await fetch('/api/designer/themes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: themeName,
                    config: config,
                }),
            });

            if (response.ok) {
                alert("Theme saved successfully!");
                setThemeName("");
                setConfig(defaultThemeConfig);
            } else {
                alert("Failed to save theme. Please try again.");
            }
        } catch (error) {
            console.error("Error saving theme:", error);
            alert("An error occurred while saving the theme.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen py-8 font-sans">
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2" style={{ fontSize: '24px', color: '#36463A' }}>Create New Theme</h1>
                    <p className="mb-4" style={{ color: '#36463A' }}>Design your wedding card theme. Customize backgrounds for the card and each section.</p>
                </div>

                {/* Theme Name Input */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <label htmlFor="themeName" className="block text-sm font-semibold text-gray-700 mb-2">
                        Theme Name *
                    </label>
                    <input
                        id="themeName"
                        type="text"
                        value={themeName}
                        onChange={(e) => setThemeName(e.target.value)}
                        placeholder="Enter theme name (e.g., Romantic Rose, Elegant Gold)"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#327442] focus:border-transparent"
                    />
                </div>

                {/* Theme Creator */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <main className="flex justify-center">
                        <CreatorCard config={config} updateConfig={updateConfig} />
                    </main>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 justify-end">
                    <Link 
                        href="/designer/dashboard" 
                        className="px-6 py-2 rounded-full border border-[#36463A] text-[#36463A] bg-white text-sm shadow hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </Link>
                    <button
                        className="px-6 py-2 rounded-full bg-[#327442] text-white text-sm shadow hover:bg-[#2d3a2f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleSaveTheme}
                        disabled={isSaving || !themeName.trim()}
                    >
                        {isSaving ? "Saving..." : "Save Theme"}
                    </button>
                    <button
                        className="px-6 py-2 rounded-full bg-[#36463A] text-white text-sm shadow hover:bg-[#2d3a2f] transition-colors"
                        onClick={() => {
                            console.log("Current Configuration:", JSON.stringify(config, null, 2));
                            alert("Theme config logged to console!");
                        }}
                    >
                        Preview JSON
                    </button>
                </div>
            </div>
        </div>
    );
}



