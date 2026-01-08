"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { CreatorCard } from "@/components/creator/CreatorCard";
import { CeremonyCard } from "@/components/card/CeremonyCard";
import { defaultThemeConfig, ThemeConfig, BackgroundStyle, FooterIcons } from "@/components/creator/ThemeTypes";
import { ThemeControls } from "@/components/creator/ThemeControls";
import { IconUpload } from "@/components/creator/IconUpload";
import { EditorPager } from "@/components/EditorPager";
import { useEvent } from "@/context/EventContext";
import { IconSave } from "@/components/card/Icons";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const SECTIONS = [
  { id: 1, label: "1. Main & Opening" },
  { id: 2, label: "2. Front Page" },
  { id: 3, label: "3. Invitation Speech" },
  { id: 4, label: "4. Location & Navigation" },
  { id: 5, label: "5. Tentative & More" },
  { id: 6, label: "6. Page In-Between" },
  { id: 7, label: "7. RSVP" },
  { id: 8, label: "8. Contacts" },
  { id: 9, label: "9. Music & Auto Scroll" },
  { id: 10, label: "10. Final Segment" },
];

export default function CreateThemePage() {
    const router = useRouter();
    const { event, resetEvent } = useEvent();
    const [config, setConfig] = useState<ThemeConfig>(defaultThemeConfig);
    const [isSavingTheme, setIsSavingTheme] = useState(false);
    const [isSavingContent, setIsSavingContent] = useState(false);
    const [isSavingTemplate, setIsSavingTemplate] = useState(false);
    const [activeSection, setActiveSection] = useState<1 | 2 | 3 | 4>(1);
    const [currentContentSection, setCurrentContentSection] = useState(1);
    const [activeTab, setActiveTab] = useState<"theme" | "content">("theme");
    const cardRef = useRef<HTMLDivElement>(null);
    const previewContainerRef = useRef<HTMLDivElement>(null);
    
    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<"theme" | "content" | "template" | null>(null);
    const [modalName, setModalName] = useState("");

    const updateConfig = (key: keyof ThemeConfig, value: BackgroundStyle | string | FooterIcons) => {
        setConfig((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const scrollToSection = useCallback((section: number) => {
        // Find the scrollable container within the CeremonyCard
        const container = previewContainerRef.current;
        if (!container) return;

        // The card content has a scrollable div, find it
        const scrollableDiv = container.querySelector('[class*="overflow-y-auto"]');
        if (!scrollableDiv) return;

        // Find the target section
        const targetSection = scrollableDiv.querySelector(`#card-sec-${section}`);
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, []);

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

    // Open modal for save
    const openSaveModal = (type: "theme" | "content" | "template") => {
        setModalType(type);
        setModalName("");
        setIsModalOpen(true);
    };

    // Handle actual save after modal confirms
    const handleConfirmSave = async () => {
        if (!modalName.trim()) {
            toast.error(`Please enter a ${modalType} name`);
            return;
        }

        if (!modalType) return;

        // Set loading state based on type
        if (modalType === "theme") {
            setIsSavingTheme(true);
        } else if (modalType === "content") {
            setIsSavingContent(true);
        } else {
            setIsSavingTemplate(true);
        }

        try {
            const payload: any = {
                name: modalName.trim(),
                type: modalType,
            };

            if (modalType === "theme" || modalType === "template") {
                payload.config = config;
            }

            if (modalType === "content" || modalType === "template") {
                payload.defaultEventData = event;
            }

            if (modalType === "content") {
                payload.config = {};
            }

            const response = await fetch('/api/designer/themes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(`${modalType === "theme" ? "Theme" : modalType === "content" ? "Content" : "Template"} saved successfully!`);
                setIsModalOpen(false);
                setModalName("");
                setModalType(null);
                
                // Reset based on type
                if (modalType === "theme" || modalType === "template") {
                    setConfig(defaultThemeConfig);
                }
                if (modalType === "content" || modalType === "template") {
                    resetEvent();
                }
                
                router.push("/designer/dashboard/themes");
            } else {
                toast.error(data.error || `Failed to save ${modalType}. Please try again.`);
            }
        } catch (error) {
            console.error(`Error saving ${modalType}:`, error);
            toast.error(`An error occurred while saving the ${modalType}.`);
        } finally {
            setIsSavingTheme(false);
            setIsSavingContent(false);
            setIsSavingTemplate(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Create New Theme</h1>
                    <p className="text-muted-foreground">Design your wedding card theme. Customize backgrounds, colors, and default content.</p>
                </div>
                
                {/* Tab Menu */}
                <div className="inline-flex rounded-2xl border border-[#36463A] overflow-hidden">
                    <button
                        onClick={() => setActiveTab("theme")}
                        className={`px-6 py-2 text-sm font-medium transition-colors ${
                            activeTab === "theme"
                                ? "bg-[#36463A] text-white"
                                : "bg-white text-[#36463A] hover:bg-gray-50"
                        }`}
                        style={{ 
                            borderTopLeftRadius: '16px',
                            borderBottomLeftRadius: '16px'
                        }}
                    >
                        Theme
                    </button>
                    <button
                        onClick={() => setActiveTab("content")}
                        className={`px-6 py-2 text-sm font-medium transition-colors ${
                            activeTab === "content"
                                ? "bg-[#36463A] text-white"
                                : "bg-white text-[#36463A] hover:bg-gray-50"
                        }`}
                        style={{ 
                            borderTopRightRadius: '16px',
                            borderBottomRightRadius: '16px'
                        }}
                    >
                        Content
                    </button>
                </div>
            </div>


            {/* Theme Tab - Theme Designer */}
            {activeTab === "theme" && (
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
            )}

            {/* Content Tab - Content Editor */}
            {activeTab === "content" && (
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Content Editor</CardTitle>
                                <CardDescription>Set default content for your theme. Clients can customize these later.</CardDescription>
                            </div>
                            <Button
                                onClick={resetEvent}
                                variant="outline"
                                className="px-4 py-2 rounded-full border border-[#36463A] text-[#36463A] bg-white text-sm shadow hover:bg-gray-50"
                            >
                                Reset to Defaults
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                            {/* Editor Forms - Paginated */}
                            <div className="flex flex-col mx-auto lg:mx-0 lg:justify-self-center" style={{ width: '571px' }}>
                                {/* Form Container */}
                                <div className="bg-white rounded-2xl shadow-lg border border-[#36463A] p-6" style={{ height: '592px', overflowY: 'auto' }}>
                                    <EditorPager 
                                        onSectionChange={scrollToSection}
                                        onCurrentSectionChange={setCurrentContentSection}
                                        currentSection={currentContentSection}
                                    />
                                </div>
                                
                                {/* Pagination Outside Form */}
                                <div className="mt-4 bg-white rounded-2xl shadow-lg border border-[#36463A] p-4">
                                    <div className="flex items-center justify-center gap-2 mb-3">
                                        <button
                                            onClick={() => {
                                                if (currentContentSection > 1) {
                                                    setCurrentContentSection(currentContentSection - 1);
                                                }
                                            }}
                                            disabled={currentContentSection === 1}
                                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                                currentContentSection === 1
                                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                    : "bg-[#36463A] text-white hover:bg-[#2d3a2f] shadow"
                                            }`}
                                        >
                                            ←
                                        </button>

                                        {SECTIONS.map((section) => (
                                            <button
                                                key={section.id}
                                                onClick={() => setCurrentContentSection(section.id)}
                                                className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                                                    section.id === currentContentSection
                                                        ? "bg-[#36463A] text-white shadow"
                                                        : "bg-white text-gray-700 border border-gray-300 hover:border-[#36463A]"
                                                }`}
                                            >
                                                {section.id}
                                            </button>
                                        ))}

                                        <button
                                            onClick={() => {
                                                if (currentContentSection < 10) {
                                                    setCurrentContentSection(currentContentSection + 1);
                                                }
                                            }}
                                            disabled={currentContentSection === 10}
                                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                                currentContentSection === 10
                                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                    : "bg-[#36463A] text-white hover:bg-[#2d3a2f] shadow"
                                            }`}
                                        >
                                            →
                                        </button>

                                        <button
                                            onClick={() => {
                                                try {
                                                    localStorage.setItem("ceremony-card-event", JSON.stringify(event));
                                                    toast.success("Content saved successfully!", {
                                                        description: "All your changes have been saved.",
                                                        duration: 3000,
                                                    });
                                                } catch (error) {
                                                    console.error("Error saving content:", error);
                                                    toast.error("Error saving content", {
                                                        description: "Failed to save. Check console for details.",
                                                        duration: 4000,
                                                    });
                                                }
                                            }}
                                            className="ml-4 px-4 py-1 rounded-full bg-[#36463A] text-white hover:bg-[#2d3a2f] shadow text-sm font-medium transition-colors flex items-center gap-2"
                                            title="Save current content"
                                        >
                                            <IconSave />
                                            <span className="hidden sm:inline">Save</span>
                                        </button>
                                    </div>

                                    {/* Section Label */}
                                    <div className="text-center">
                                        <p className="text-sm font-medium text-[#36463A] uppercase tracking-wide">
                                            {SECTIONS.find((s) => s.id === currentContentSection)?.label.replace(/^\d+\.\s*/, "") || ""}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Preview */}
                            <div className="lg:sticky lg:top-8 lg:h-fit flex items-start justify-center">
                                <div ref={previewContainerRef} className="overflow-visible [&>div]:min-h-0 [&>div]:h-auto [&>div]:w-full [&>div]:flex-none [&>div]:items-start [&>div]:rounded-3xl [&>div>div]:rounded-3xl [&>div>div]:overflow-hidden" style={{ width: '294px', height: '509px', backgroundColor: 'transparent' }}>
                                    <CeremonyCard editorSection={currentContentSection} themeConfig={config} />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 justify-end">
                <Link href="/designer/dashboard">
                    <Button variant="outline">Cancel</Button>
                </Link>
                <Button
                    onClick={() => openSaveModal("theme")}
                    disabled={isSavingTheme || isSavingContent || isSavingTemplate}
                >
                    Save Theme
                </Button>
                <Button
                    onClick={() => openSaveModal("content")}
                    disabled={isSavingTheme || isSavingContent || isSavingTemplate}
                    variant="secondary"
                >
                    Save Content
                </Button>
                <Button
                    onClick={() => openSaveModal("template")}
                    disabled={isSavingTheme || isSavingContent || isSavingTemplate}
                >
                    Save Template
                </Button>
            </div>

            {/* Save Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Save {modalType === "theme" ? "Theme" : modalType === "content" ? "Content" : "Template"}
                        </DialogTitle>
                        <DialogDescription>
                            Enter a name for your {modalType}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="modalName">
                                {modalType === "theme" ? "Theme" : modalType === "content" ? "Content" : "Template"} Name *
                            </Label>
                            <Input
                                id="modalName"
                                type="text"
                                value={modalName}
                                onChange={(e) => setModalName(e.target.value)}
                                placeholder={`Enter ${modalType} name`}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && modalName.trim()) {
                                        handleConfirmSave();
                                    }
                                }}
                                autoFocus
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsModalOpen(false);
                                setModalName("");
                                setModalType(null);
                            }}
                            disabled={isSavingTheme || isSavingContent || isSavingTemplate}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirmSave}
                            disabled={!modalName.trim() || isSavingTheme || isSavingContent || isSavingTemplate}
                        >
                            {isSavingTheme || isSavingContent || isSavingTemplate ? "Saving..." : "Save"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}




