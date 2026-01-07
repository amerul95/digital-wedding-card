"use client";

import { useState, useEffect, useRef } from "react";
import { CreatorCard } from "@/components/creator/CreatorCard";
import { defaultThemeConfig, ThemeConfig, BackgroundStyle, FooterIcons } from "@/components/creator/ThemeTypes";
import { ThemeControls } from "@/components/creator/ThemeControls";
import { IconUpload } from "@/components/creator/IconUpload";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function CreateThemePage() {
    const router = useRouter();
    const [config, setConfig] = useState<ThemeConfig>(defaultThemeConfig);
    const [themeName, setThemeName] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [activeSection, setActiveSection] = useState<1 | 2 | 3 | 4>(1);
    const cardRef = useRef<HTMLDivElement>(null);

    const updateConfig = (key: keyof ThemeConfig, value: BackgroundStyle | string | FooterIcons) => {
        setConfig((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    // Scroll detection to determine active section - improved to prevent flickering
    useEffect(() => {
        const findScrollableContainer = (): HTMLElement | null => {
            if (!cardRef.current) return null;
            
            // Try to find the scrollable container within the card
            const card = cardRef.current;
            // Look for the CreatorCard's inner scrollable div
            const nestedCard = card.querySelector('[class*="rounded-3xl"]');
            if (nestedCard) {
                const nestedScrollable = nestedCard.querySelector('[class*="overflow-y-auto"]') as HTMLElement;
                if (nestedScrollable) return nestedScrollable;
            }
            
            const possibleContainers = [
                card.querySelector('[class*="overflow-y-auto"]'),
                card.querySelector('[class*="overflow"]'),
            ].filter(Boolean) as HTMLElement[];
            
            return possibleContainers[0] || null;
        };

        const setupScrollDetection = () => {
            const scrollableContainer = findScrollableContainer();
            if (!scrollableContainer) return;

            const sections = [
                { id: 1, element: scrollableContainer.querySelector('#card-sec-1') as HTMLElement },
                { id: 2, element: scrollableContainer.querySelector('#card-sec-2') as HTMLElement },
                { id: 3, element: scrollableContainer.querySelector('#card-sec-3') as HTMLElement },
                { id: 4, element: scrollableContainer.querySelector('#card-sec-4') as HTMLElement },
            ].filter(s => s.element);

            if (sections.length === 0) return;

            let lastActiveSection: 1 | 2 | 3 | 4 = 1;
            let scrollTimeout: NodeJS.Timeout | null = null;

            const determineActiveSection = (): 1 | 2 | 3 | 4 => {
                const scrollTop = scrollableContainer.scrollTop;
                const containerHeight = scrollableContainer.clientHeight;
                const viewportTop = scrollTop;
                const viewportBottom = scrollTop + containerHeight;
                const viewportCenter = scrollTop + containerHeight / 2;

                // Find which section's center is closest to viewport center
                // But only if the section is significantly visible (at least 30% in viewport)
                let bestSection: 1 | 2 | 3 | 4 = 1;
                let bestScore = -Infinity;

                for (const section of sections) {
                    const rect = section.element.getBoundingClientRect();
                    const containerRect = scrollableContainer.getBoundingClientRect();
                    const sectionTop = rect.top - containerRect.top + scrollTop;
                    const sectionBottom = sectionTop + rect.height;
                    const sectionCenter = (sectionTop + sectionBottom) / 2;

                    // Calculate how much of the section is visible
                    const visibleTop = Math.max(viewportTop, sectionTop);
                    const visibleBottom = Math.min(viewportBottom, sectionBottom);
                    const visibleHeight = Math.max(0, visibleBottom - visibleTop);
                    const sectionHeight = sectionBottom - sectionTop;
                    const visibilityRatio = sectionHeight > 0 ? visibleHeight / sectionHeight : 0;

                    // Only consider sections that are at least 30% visible
                    if (visibilityRatio >= 0.3) {
                        // Score based on visibility and proximity to center
                        const distanceFromCenter = Math.abs(viewportCenter - sectionCenter);
                        const maxDistance = containerHeight;
                        const proximityScore = 1 - (distanceFromCenter / maxDistance);
                        const score = visibilityRatio * 0.7 + proximityScore * 0.3;

                        if (score > bestScore) {
                            bestScore = score;
                            bestSection = section.id as 1 | 2 | 3 | 4;
                        }
                    }
                }

                return bestSection;
            };

            const handleScroll = () => {
                // Clear any pending timeout
                if (scrollTimeout) {
                    clearTimeout(scrollTimeout);
                }

                // Debounce the update to prevent rapid changes
                scrollTimeout = setTimeout(() => {
                    const newActiveSection = determineActiveSection();
                    
                    // Only update if the section actually changed
                    if (newActiveSection !== lastActiveSection) {
                        lastActiveSection = newActiveSection;
                        setActiveSection(newActiveSection);
                    }
                }, 150); // 150ms debounce to prevent flickering
            };

            // Initial check
            lastActiveSection = determineActiveSection();
            setActiveSection(lastActiveSection);

            scrollableContainer.addEventListener('scroll', handleScroll, { passive: true });

            return () => {
                if (scrollTimeout) {
                    clearTimeout(scrollTimeout);
                }
                scrollableContainer.removeEventListener('scroll', handleScroll);
            };
        };

        // Wait for DOM to be ready
        const timeoutId = setTimeout(setupScrollDetection, 200);

        return () => {
            clearTimeout(timeoutId);
        };
    }, []);

    const handleSaveTheme = async () => {
        if (!themeName.trim()) {
            toast.error("Please enter a theme name");
            return;
        }

        setIsSaving(true);
        try {
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

            const data = await response.json();

            if (response.ok) {
                toast.success("Theme saved successfully!");
                setThemeName("");
                setConfig(defaultThemeConfig);
                // Redirect to themes page after successful save
                router.push("/designer/dashboard/themes");
            } else {
                toast.error(data.error || "Failed to save theme. Please try again.");
            }
        } catch (error) {
            console.error("Error saving theme:", error);
            toast.error("An error occurred while saving the theme.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold mb-2">Create New Theme</h1>
                <p className="text-muted-foreground">Design your wedding card theme. Customize backgrounds for the card and each section.</p>
            </div>

            {/* Theme Name Input */}
            <Card>
                <CardHeader>
                    <CardTitle>Theme Name</CardTitle>
                    <CardDescription>Enter a name for your theme</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <Label htmlFor="themeName">Theme Name *</Label>
                        <Input
                            id="themeName"
                            type="text"
                            value={themeName}
                            onChange={(e) => setThemeName(e.target.value)}
                            placeholder="Enter theme name (e.g., Romantic Rose, Elegant Gold)"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Theme Creator */}
            <Card>
                <CardHeader>
                    <CardTitle>Theme Designer</CardTitle>
                    <CardDescription>Customize your theme appearance</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-5 items-start justify-center" style={{ gap: '20px' }}>
                        {/* Left Sidebar - Card BG, Footer BG, Icon Color, Custom Icons */}
                        <div className="w-64 flex-shrink-0 space-y-4">
                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-4">
                                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Card Settings</h3>
                                
                                {/* Card Background */}
                                <ThemeControls
                                    label="Card BG"
                                    value={config.cardBackground}
                                    onChange={(val) => updateConfig('cardBackground', val)}
                                />

                                {/* Footer Background */}
                                <ThemeControls
                                    label="Footer BG"
                                    value={config.footerBackground}
                                    onChange={(val) => updateConfig('footerBackground', val)}
                                />

                                {/* Icon Color */}
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

                                {/* Text Icon Color */}
                                <div className="p-2 bg-white/90 backdrop-blur-sm rounded-lg border border-rose-200 shadow-sm flex flex-col gap-1">
                                    <span className="text-xs font-semibold text-rose-800 uppercase tracking-wider">Text Icon Color</span>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="color"
                                            value={config.footerTextColor || config.footerIconColor}
                                            onChange={(e) => updateConfig('footerTextColor', e.target.value as any)}
                                            className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                                        />
                                        <span className="text-[10px] text-gray-500 font-mono">{config.footerTextColor || config.footerIconColor}</span>
                                    </div>
                                </div>

                                {/* Custom Icons */}
                                <div className="p-2 bg-white/90 backdrop-blur-sm rounded-lg border border-rose-200 shadow-sm flex flex-col gap-2">
                                    <span className="text-xs font-semibold text-rose-800 uppercase tracking-wider mb-1">Custom Icons</span>
                                    <IconUpload
                                        label="Calendar"
                                        value={config.footerIcons?.calendar}
                                        onChange={(url) => {
                                            const newIcons: FooterIcons = { ...(config.footerIcons || {}), calendar: url };
                                            updateConfig('footerIcons', newIcons);
                                        }}
                                        onRemove={() => {
                                            const { calendar, ...rest } = config.footerIcons || {};
                                            updateConfig('footerIcons', Object.keys(rest).length > 0 ? rest : undefined as any);
                                        }}
                                    />
                                    <IconUpload
                                        label="Phone"
                                        value={config.footerIcons?.phone}
                                        onChange={(url) => {
                                            const newIcons: FooterIcons = { ...(config.footerIcons || {}), phone: url };
                                            updateConfig('footerIcons', newIcons);
                                        }}
                                        onRemove={() => {
                                            const { phone, ...rest } = config.footerIcons || {};
                                            updateConfig('footerIcons', Object.keys(rest).length > 0 ? rest : undefined as any);
                                        }}
                                    />
                                    <IconUpload
                                        label="Location"
                                        value={config.footerIcons?.pin}
                                        onChange={(url) => {
                                            const newIcons: FooterIcons = { ...(config.footerIcons || {}), pin: url };
                                            updateConfig('footerIcons', newIcons);
                                        }}
                                        onRemove={() => {
                                            const { pin, ...rest } = config.footerIcons || {};
                                            updateConfig('footerIcons', Object.keys(rest).length > 0 ? rest : undefined as any);
                                        }}
                                    />
                                    <IconUpload
                                        label="RSVP"
                                        value={config.footerIcons?.rsvp}
                                        onChange={(url) => {
                                            const newIcons: FooterIcons = { ...(config.footerIcons || {}), rsvp: url };
                                            updateConfig('footerIcons', newIcons);
                                        }}
                                        onRemove={() => {
                                            const { rsvp, ...rest } = config.footerIcons || {};
                                            updateConfig('footerIcons', Object.keys(rest).length > 0 ? rest : undefined as any);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Center - Card Preview */}
                        <div className="flex-shrink-0 flex justify-center" ref={cardRef}>
                            <CreatorCard config={config} updateConfig={updateConfig} />
                        </div>

                        {/* Right Sidebar - Section Background Controls */}
                        <div className="w-64 flex-shrink-0">
                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 sticky top-4">
                                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Section Background</h3>
                                
                                {/* Dynamic Section Control based on active section */}
                                {activeSection === 1 && (
                                    <ThemeControls
                                        label="Section 1"
                                        value={config.section1Background}
                                        onChange={(val) => updateConfig('section1Background', val)}
                                    />
                                )}
                                {activeSection === 2 && (
                                    <ThemeControls
                                        label="Section 2"
                                        value={config.section2Background}
                                        onChange={(val) => updateConfig('section2Background', val)}
                                    />
                                )}
                                {activeSection === 3 && (
                                    <ThemeControls
                                        label="Section 3"
                                        value={config.section3Background}
                                        onChange={(val) => updateConfig('section3Background', val)}
                                    />
                                )}
                                {activeSection === 4 && (
                                    <ThemeControls
                                        label="Section 4"
                                        value={config.section4Background}
                                        onChange={(val) => updateConfig('section4Background', val)}
                                    />
                                )}

                                <div className="mt-4 pt-4 border-t border-gray-300">
                                    <p className="text-xs text-gray-500">
                                        Scroll the card to change sections. The control will update automatically.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-end">
                <Link href="/designer/dashboard">
                    <Button variant="outline">Cancel</Button>
                </Link>
                <Button
                    variant="secondary"
                    onClick={() => {
                        console.log("Current Configuration:", JSON.stringify(config, null, 2));
                        toast.info("Theme config logged to console!");
                    }}
                >
                    Preview JSON
                </Button>
                <Button
                    onClick={handleSaveTheme}
                    disabled={isSaving || !themeName.trim()}
                >
                    {isSaving ? "Saving..." : "Save Theme"}
                </Button>
            </div>
        </div>
    );
}




