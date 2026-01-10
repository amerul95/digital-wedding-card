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
import { Page1Form } from "@/components/forms/Page1Form";
import { Page2Form } from "@/components/forms/Page2Form";
import { Page3Form } from "@/components/forms/Page3Form";
import { Page4Form } from "@/components/forms/Page4Form";
import { Page5Form } from "@/components/forms/Page5Form";
import { Page6Form } from "@/components/forms/Page6Form";
import { Page7Form } from "@/components/forms/Page7Form";
import { Page8Form } from "@/components/forms/Page8Form";
import { Page9Form } from "@/components/forms/Page9Form";
import { Page10Form } from "@/components/forms/Page10Form";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

// Helper function to parse box shadow value
const parseBoxShadow = (value: string | undefined): { x: number; y: number; blur: number; spread: number; r: number; g: number; b: number; a: number } | null => {
    if (!value || value === 'none') return null;
    
    // Handle multiple shadows - take the first one
    const firstShadow = value.split(',')[0].trim();
    
    // Simple regex to parse box-shadow: offset-x offset-y blur spread color
    // Example: "0 3px 6px rgba(0, 0, 0, 0.16)" or "0 3px 6px 0 rgba(0, 0, 0, 0.16)"
    const match = firstShadow.match(/^(-?\d+(?:\.\d+)?)\s*(?:px)?\s+(-?\d+(?:\.\d+)?)\s*(?:px)?\s+(-?\d+(?:\.\d+)?)\s*(?:px)?\s*(?:(-?\d+(?:\.\d+)?)\s*(?:px)?\s+)?(rgba?\([^)]+\)|#[0-9a-fA-F]{3,8}|\w+)/);
    
    if (match) {
        const x = parseFloat(match[1]) || 0;
        const y = parseFloat(match[2]) || 0;
        const blur = parseFloat(match[3]) || 0;
        const spread = match[4] ? parseFloat(match[4]) : 0;
        
        // Parse color - handle rgba/rgb
        let r = 0, g = 0, b = 0, a = 0.16;
        const colorMatch = match[5]?.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
        if (colorMatch) {
            r = parseInt(colorMatch[1]) || 0;
            g = parseInt(colorMatch[2]) || 0;
            b = parseInt(colorMatch[3]) || 0;
            a = parseFloat(colorMatch[4]) || 0.16;
        }
        
        return { x, y, blur, spread, r, g, b, a };
    }
    
    // Default values
    return { x: 0, y: 0, blur: 0, spread: 0, r: 0, g: 0, b: 0, a: 0.16 };
};

// Helper function to construct box shadow value
const constructBoxShadow = (values: { x: number; y: number; blur: number; spread: number; r: number; g: number; b: number; a: number } | null): string => {
    if (!values) return 'none';
    const { x, y, blur, spread, r, g, b, a } = values;
    return `${x}px ${y}px ${blur}px ${spread}px rgba(${r}, ${g}, ${b}, ${a})`;
};

// Helper function to convert RGB to hex
const rgbToHex = (r: number, g: number, b: number): string => {
    return "#" + [r, g, b].map(x => {
        const hex = Math.round(x).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    }).join("");
};

// Helper function to convert hex to RGB
const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

export default function CreateThemePage() {
    const router = useRouter();
    const { event, resetEvent } = useEvent();
    const [config, setConfig] = useState<ThemeConfig>(defaultThemeConfig);
    const [isSavingTheme, setIsSavingTheme] = useState(false);
    const [isSavingContent, setIsSavingContent] = useState(false);
    const [isSavingTemplate, setIsSavingTemplate] = useState(false);
    const [activeSection, setActiveSection] = useState<1 | 2 | 3 | 4>(1);
    const [currentContentSection, setCurrentContentSection] = useState(1);
    const [openAccordionSection, setOpenAccordionSection] = useState<string>("1");
    const [activeTab, setActiveTab] = useState<"theme" | "content">("theme");
    const cardRef = useRef<HTMLDivElement>(null);
    const previewContainerRef = useRef<HTMLDivElement>(null);
    
    // Ref to track if we're updating from user input (prevent useEffect from overriding)
    const isUpdatingFromUserInput = useRef(false);
    
    // Box shadow state
    const [boxShadowValues, setBoxShadowValues] = useState(() => 
        parseBoxShadow(config.footerBoxShadow) || { x: 0, y: 0, blur: 0, spread: 0, r: 0, g: 0, b: 0, a: 0.16 }
    );
    
    // Sync box shadow values when config changes externally (but not from user input)
    useEffect(() => {
        if (!isUpdatingFromUserInput.current) {
            const parsed = parseBoxShadow(config.footerBoxShadow);
            if (parsed) {
                setBoxShadowValues(parsed);
            }
        } else {
            // Reset the flag after a brief delay to allow state to settle
            const timeoutId = setTimeout(() => {
                isUpdatingFromUserInput.current = false;
            }, 0);
            return () => clearTimeout(timeoutId);
        }
    }, [config.footerBoxShadow]);
    
    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<"theme" | "content" | "template" | null>(null);
    const [modalName, setModalName] = useState("");

    const updateConfig = (key: keyof ThemeConfig, value: BackgroundStyle | string | FooterIcons) => {
        setConfig((prev) => ({
            ...prev,
            [key]: value,
        }));
        
        // Update box shadow values when config changes (only if not from user input)
        if (key === 'footerBoxShadow' && !isUpdatingFromUserInput.current) {
            const parsed = parseBoxShadow(value as string);
            if (parsed) {
                setBoxShadowValues(parsed);
            }
        }
    };
    
    // Update box shadow when individual values change
    const updateBoxShadow = (field: keyof typeof boxShadowValues, value: number) => {
        // Clamp values to valid ranges
        let clampedValue = value;
        if (field === 'a') {
            clampedValue = Math.max(0, Math.min(1, value));
        } else if (field === 'r' || field === 'g' || field === 'b') {
            clampedValue = Math.max(0, Math.min(255, Math.round(value)));
        }
        
        const newValues = { ...boxShadowValues, [field]: clampedValue };
        
        // Set flag to prevent useEffect from overriding our update
        isUpdatingFromUserInput.current = true;
        
        // Update local state immediately
        setBoxShadowValues(newValues);
        
        // Update config with the new CSS value
        const cssValue = constructBoxShadow(newValues);
        setConfig((prev) => ({
            ...prev,
            footerBoxShadow: cssValue as any,
        }));
    };
    
    // Apply preset box shadow
    const applyBoxShadowPreset = (preset: 'none' | 'subtle' | 'medium' | 'strong') => {
        let values: { x: number; y: number; blur: number; spread: number; r: number; g: number; b: number; a: number } | null = null;
        
        switch (preset) {
            case 'none':
                isUpdatingFromUserInput.current = true;
                updateConfig('footerBoxShadow', 'none' as any);
                setBoxShadowValues({ x: 0, y: 0, blur: 0, spread: 0, r: 0, g: 0, b: 0, a: 0.16 });
                return;
            case 'subtle':
                values = { x: 0, y: 1, blur: 3, spread: 0, r: 0, g: 0, b: 0, a: 0.12 };
                break;
            case 'medium':
                values = { x: 0, y: 3, blur: 6, spread: 0, r: 0, g: 0, b: 0, a: 0.16 };
                break;
            case 'strong':
                values = { x: 0, y: 10, blur: 20, spread: 0, r: 0, g: 0, b: 0, a: 0.19 };
                break;
        }
        
        if (values) {
            isUpdatingFromUserInput.current = true;
            setBoxShadowValues(values);
            updateConfig('footerBoxShadow', constructBoxShadow(values) as any);
        }
    };

    const scrollToSection = useCallback((pageNumber: number) => {
        // Map page numbers to card sections:
        // Page 1 → no scroll (door closed)
        // Page 2 → card section 1
        // Page 3-4 → card section 2
        // Page 5 → card section 3
        // Other pages → let CeremonyCard handle it
        
        if (pageNumber === 1) {
            // Page 1 - no scrolling needed, door stays closed
            return;
        }

        // Don't scroll immediately - let CeremonyCard's useEffect handle it based on editorSection
        // This prevents the double scroll issue
        return;
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
                        <div className="flex gap-4 items-start">
                            {/* Left Sidebar - Accordion Menus */}
                            <div className="w-80 shrink-0">
                                <Accordion type="multiple" defaultValue={["card-settings", "footer-card"]} className="space-y-2">
                                    {/* Card Settings Accordion */}
                                    <AccordionItem value="card-settings" className="border border-gray-200 rounded-lg bg-gray-50 overflow-hidden">
                                        <AccordionTrigger className="px-4 py-3 hover:no-underline">
                                            <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Card Settings</span>
                                        </AccordionTrigger>
                                        <AccordionContent className="px-4 pb-4 space-y-4">
                                            {/* Card Background */}
                                            <ThemeControls
                                                label="Card BG"
                                                value={config.cardBackground}
                                                onChange={(val) => updateConfig('cardBackground', val)}
                                            />

                                            {/* Section Backgrounds */}
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Section Background</span>
                                                    {activeSection && (
                                                        <span className="text-[10px] text-blue-600 font-medium px-2 py-0.5 bg-blue-50 rounded-full">
                                                            Section {activeSection} Active
                                                        </span>
                                                    )}
                                                </div>
                                                <ThemeControls
                                                    label="Section 1"
                                                    value={config.section1Background}
                                                    onChange={(val) => updateConfig('section1Background', val)}
                                                />
                                                <ThemeControls
                                                    label="Section 2"
                                                    value={config.section2Background}
                                                    onChange={(val) => updateConfig('section2Background', val)}
                                                />
                                                <ThemeControls
                                                    label="Section 3"
                                                    value={config.section3Background}
                                                    onChange={(val) => updateConfig('section3Background', val)}
                                                />
                                                <ThemeControls
                                                    label="Section 4"
                                                    value={config.section4Background}
                                                    onChange={(val) => updateConfig('section4Background', val)}
                                                />
                                                <p className="text-xs text-gray-500 mt-2">
                                                    Scroll the card to see which section is active.
                                                </p>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>

                                    {/* Footer Card Accordion */}
                                    <AccordionItem value="footer-card" className="border border-gray-200 rounded-lg bg-gray-50 overflow-hidden last:border-b">
                                        <AccordionTrigger className="px-4 py-3 hover:no-underline">
                                            <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Footer Card</span>
                                        </AccordionTrigger>
                                        <AccordionContent className="px-4 pb-4 space-y-4">
                                            {/* Footer Background */}
                                            <ThemeControls
                                                label="Footer BG"
                                                value={config.footerBackground}
                                                onChange={(val) => updateConfig('footerBackground', val)}
                                            />

                                            {/* Icon Color */}
                                            <div className="p-2 bg-white/90 backdrop-blur-sm rounded-lg border border-rose-200 shadow-sm flex flex-col gap-1">
                                                <label htmlFor="footerIconColor" className="text-xs font-semibold text-rose-800 uppercase tracking-wider">Icon Color</label>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        id="footerIconColor"
                                                        name="footerIconColor"
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
                                                <label htmlFor="footerTextColor" className="text-xs font-semibold text-rose-800 uppercase tracking-wider">Text Icon Color</label>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        id="footerTextColor"
                                                        name="footerTextColor"
                                                        type="color"
                                                        value={config.footerTextColor || config.footerIconColor}
                                                        onChange={(e) => updateConfig('footerTextColor', e.target.value as any)}
                                                        className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                                                    />
                                                    <span className="text-[10px] text-gray-500 font-mono">{config.footerTextColor || config.footerIconColor}</span>
                                                </div>
                                            </div>

                                            {/* Box Shadow Control */}
                                            <div className="p-2 bg-white/90 backdrop-blur-sm rounded-lg border border-rose-200 shadow-sm flex flex-col gap-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-semibold text-rose-800 uppercase tracking-wider">Box Shadow</span>
                                                    <div className="flex gap-1 flex-wrap">
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => applyBoxShadowPreset('none')}
                                                            className="text-[10px] h-6 px-2"
                                                        >
                                                            None
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => applyBoxShadowPreset('subtle')}
                                                            className="text-[10px] h-6 px-2"
                                                        >
                                                            Subtle
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => applyBoxShadowPreset('medium')}
                                                            className="text-[10px] h-6 px-2"
                                                        >
                                                            Medium
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => applyBoxShadowPreset('strong')}
                                                            className="text-[10px] h-6 px-2"
                                                        >
                                                            Strong
                                                        </Button>
                                                    </div>
                                                </div>
                                                
                                                {/* Position Controls */}
                                                <div className="space-y-2">
                                                    <div className="text-[10px] font-medium text-gray-700">Position</div>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div>
                                                            <label htmlFor="boxShadowXOffset" className="text-[9px] text-gray-600 mb-0.5 block">X Offset (px)</label>
                                                            <Input
                                                                id="boxShadowXOffset"
                                                                name="boxShadowXOffset"
                                                                type="number"
                                                                value={boxShadowValues.x}
                                                                onChange={(e) => updateBoxShadow('x', parseFloat(e.target.value) || 0)}
                                                                className="text-xs h-7"
                                                                step="0.1"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label htmlFor="boxShadowYOffset" className="text-[9px] text-gray-600 mb-0.5 block">Y Offset (px)</label>
                                                            <Input
                                                                id="boxShadowYOffset"
                                                                name="boxShadowYOffset"
                                                                type="number"
                                                                value={boxShadowValues.y}
                                                                onChange={(e) => updateBoxShadow('y', parseFloat(e.target.value) || 0)}
                                                                className="text-xs h-7"
                                                                step="0.1"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                {/* Blur & Spread Controls */}
                                                <div className="space-y-2">
                                                    <div className="text-[10px] font-medium text-gray-700">Blur & Spread</div>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div>
                                                            <label htmlFor="boxShadowBlur" className="text-[9px] text-gray-600 mb-0.5 block">Blur (px)</label>
                                                            <Input
                                                                id="boxShadowBlur"
                                                                name="boxShadowBlur"
                                                                type="number"
                                                                value={boxShadowValues.blur}
                                                                onChange={(e) => updateBoxShadow('blur', parseFloat(e.target.value) || 0)}
                                                                className="text-xs h-7"
                                                                min="0"
                                                                step="0.1"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label htmlFor="boxShadowSpread" className="text-[9px] text-gray-600 mb-0.5 block">Spread (px)</label>
                                                            <Input
                                                                id="boxShadowSpread"
                                                                name="boxShadowSpread"
                                                                type="number"
                                                                value={boxShadowValues.spread}
                                                                onChange={(e) => updateBoxShadow('spread', parseFloat(e.target.value) || 0)}
                                                                className="text-xs h-7"
                                                                step="0.1"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                {/* Color Controls */}
                                                <div className="space-y-2">
                                                    <div className="text-[10px] font-medium text-gray-700">Color</div>
                                                    <div className="flex items-start gap-3">
                                                        <div className="flex flex-col gap-1.5">
                                                            <label htmlFor="boxShadowColorPicker" className="text-[9px] text-gray-600">Color Picker</label>
                                                            <div className="relative">
                                                                <input
                                                                    id="boxShadowColorPicker"
                                                                    name="boxShadowColorPicker"
                                                                    type="color"
                                                                    value={rgbToHex(boxShadowValues.r, boxShadowValues.g, boxShadowValues.b)}
                                                                    onChange={(e) => {
                                                                        const rgb = hexToRgb(e.target.value);
                                                                        if (rgb) {
                                                                            const newValues = { ...boxShadowValues, r: rgb.r, g: rgb.g, b: rgb.b };
                                                                            setBoxShadowValues(newValues);
                                                                            const cssValue = constructBoxShadow(newValues);
                                                                            updateConfig('footerBoxShadow', cssValue as any);
                                                                        }
                                                                    }}
                                                                    className="w-14 h-14 rounded cursor-pointer border-2 border-gray-300"
                                                                    style={{ 
                                                                        WebkitAppearance: "none", 
                                                                        appearance: "none",
                                                                        backgroundColor: rgbToHex(boxShadowValues.r, boxShadowValues.g, boxShadowValues.b)
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="flex-1 space-y-2">
                                                            <div>
                                                                <label htmlFor="boxShadowOpacity" className="text-[9px] text-gray-600 mb-1 block">Opacity (0-1)</label>
                                                                <div className="flex items-center gap-2">
                                                                    <Input
                                                                        id="boxShadowOpacity"
                                                                        name="boxShadowOpacity"
                                                                        type="number"
                                                                        value={boxShadowValues.a}
                                                                        onChange={(e) => updateBoxShadow('a', parseFloat(e.target.value) || 0)}
                                                                        className="text-xs h-7 w-16"
                                                                        min="0"
                                                                        max="1"
                                                                        step="0.01"
                                                                    />
                                                                    <div className="flex-1 relative">
                                                                        <label htmlFor="boxShadowOpacitySlider" className="sr-only">Opacity Slider</label>
                                                                        <input
                                                                            id="boxShadowOpacitySlider"
                                                                            name="boxShadowOpacitySlider"
                                                                            type="range"
                                                                            min="0"
                                                                            max="1"
                                                                            step="0.01"
                                                                            value={Math.max(0, Math.min(1, boxShadowValues.a))}
                                                                            onChange={(e) => {
                                                                                const newValue = parseFloat(e.target.value);
                                                                                if (!isNaN(newValue)) {
                                                                                    updateBoxShadow('a', newValue);
                                                                                }
                                                                            }}
                                                                            onInput={(e) => {
                                                                                const newValue = parseFloat((e.target as HTMLInputElement).value);
                                                                                if (!isNaN(newValue)) {
                                                                                    updateBoxShadow('a', newValue);
                                                                                }
                                                                            }}
                                                                            className="w-full h-2 bg-transparent rounded-lg appearance-none cursor-pointer opacity-slider"
                                                                            style={{
                                                                                background: `linear-gradient(to right, rgba(${boxShadowValues.r}, ${boxShadowValues.g}, ${boxShadowValues.b}, 0) 0%, rgba(${boxShadowValues.r}, ${boxShadowValues.g}, ${boxShadowValues.b}, 1) 100%)`
                                                                            }}
                                                                            aria-label="Opacity Slider"
                                                                        />
                                                                    </div>
                                                                    <style dangerouslySetInnerHTML={{__html: `
                                                                        .opacity-slider {
                                                                            -webkit-appearance: none;
                                                                            appearance: none;
                                                                        }
                                                                        .opacity-slider::-webkit-slider-thumb {
                                                                            -webkit-appearance: none;
                                                                            appearance: none;
                                                                            width: 18px;
                                                                            height: 18px;
                                                                            border-radius: 50%;
                                                                            background: #36463A;
                                                                            cursor: grab;
                                                                            border: 2px solid white;
                                                                            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                                                                            margin-top: -5px;
                                                                        }
                                                                        .opacity-slider::-webkit-slider-thumb:active {
                                                                            cursor: grabbing;
                                                                        }
                                                                        .opacity-slider::-moz-range-thumb {
                                                                            width: 18px;
                                                                            height: 18px;
                                                                            border-radius: 50%;
                                                                            background: #36463A;
                                                                            cursor: grab;
                                                                            border: 2px solid white;
                                                                            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                                                                        }
                                                                        .opacity-slider::-moz-range-thumb:active {
                                                                            cursor: grabbing;
                                                                        }
                                                                        .opacity-slider::-webkit-slider-runnable-track {
                                                                            height: 8px;
                                                                            border-radius: 4px;
                                                                        }
                                                                        .opacity-slider::-moz-range-track {
                                                                            height: 8px;
                                                                            border-radius: 4px;
                                                                            background: transparent;
                                                                        }
                                                                    `}} />
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-3 text-[9px] text-gray-500 pt-1">
                                                                <span className="font-mono">RGB: ({boxShadowValues.r}, {boxShadowValues.g}, {boxShadowValues.b})</span>
                                                                <span className="font-mono">Hex: {rgbToHex(boxShadowValues.r, boxShadowValues.g, boxShadowValues.b)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                {/* Preview */}
                                                <div className="pt-2 border-t border-gray-200">
                                                    <div className="flex items-center gap-2">
                                                        <div 
                                                            className="w-16 h-8 rounded border border-gray-300 bg-white"
                                                            style={{ boxShadow: config.footerBoxShadow || 'none' }}
                                                        />
                                                        <span className="text-[9px] text-gray-500 font-mono truncate flex-1">
                                                            {config.footerBoxShadow || 'none'}
                                                        </span>
                                                    </div>
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
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </div>

                            {/* Center - Card Preview */}
                            <div className="flex-1 flex justify-center items-center" ref={cardRef}>
                                <CreatorCard config={config} updateConfig={updateConfig} />
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
                            <div className="flex gap-2">
                                <Button
                                    onClick={resetEvent}
                                    variant="outline"
                                    className="px-4 py-2 rounded-full border border-[#36463A] text-[#36463A] bg-white text-sm shadow hover:bg-gray-50"
                                >
                                    Reset to Defaults
                                </Button>
                                <Button
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
                                    className="px-4 py-2 rounded-full border border-[#36463A] text-white bg-[#36463A] text-sm shadow hover:bg-[#2d3a2f] flex items-center gap-2"
                                >
                                    <IconSave />
                                    Save
                                </Button>
                                <Button
                                    onClick={() => {
                                        // Save current event data to localStorage before navigating
                                        try {
                                            localStorage.setItem("ceremony-card-event", JSON.stringify(event));
                                        } catch (error) {
                                            console.error("Error saving event data:", error);
                                        }
                                        router.push("/designer/preview");
                                    }}
                                    className="px-4 py-2 rounded-full border border-[#36463A] text-white bg-[#36463A] text-sm shadow hover:bg-[#2d3a2f]"
                                >
                                    Preview
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-4 items-start">
                            {/* Left Sidebar - Accordion Menus with Forms */}
                            <div className="w-80 shrink-0">
                                <style dangerouslySetInnerHTML={{__html: `
                                    .content-form-wrapper > div.bg-white {
                                        padding: 0 !important;
                                        background: transparent !important;
                                    }
                                `}} />
                                <Accordion 
                                    type="single" 
                                    collapsible 
                                    value={openAccordionSection}
                                    onValueChange={(value) => {
                                        setOpenAccordionSection(value || "");
                                        if (value) {
                                            const sectionId = parseInt(value);
                                            setCurrentContentSection(sectionId);
                                            scrollToSection(sectionId);
                                        }
                                        // When value is empty (closed), accordion closes but section remains
                                    }}
                                    className="space-y-2"
                                >
                                    {SECTIONS.map((section) => {
                                        const formComponents: { [key: number]: React.ComponentType } = {
                                            1: Page1Form,
                                            2: Page2Form,
                                            3: Page3Form,
                                            4: Page4Form,
                                            5: Page5Form,
                                            6: Page6Form,
                                            7: Page7Form,
                                            8: Page8Form,
                                            9: Page9Form,
                                            10: Page10Form,
                                        };
                                        const SectionComponent = formComponents[section.id];
                                        
                                        return (
                                            <AccordionItem 
                                                key={section.id} 
                                                value={section.id.toString()}
                                                className="border border-gray-200 rounded-lg bg-gray-50 overflow-hidden last:border-b"
                                            >
                                                <AccordionTrigger className="px-4 py-3 hover:no-underline">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-sm font-semibold text-gray-600 w-6 text-right">
                                                            {section.id}
                                                        </span>
                                                        <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                                            {section.label.replace(/^\d+\.\s*/, "")}
                                                        </span>
                                                    </div>
                                                </AccordionTrigger>
                                                <AccordionContent className="px-0 pb-0">
                                                    <div className="bg-white rounded-lg border border-gray-200 max-h-[600px] overflow-y-auto content-form-wrapper">
                                                        {SectionComponent && <SectionComponent />}
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        );
                                    })}
                                </Accordion>
                            </div>

                            {/* Center - Card Preview */}
                            <div className="flex-1 flex justify-center items-center" ref={previewContainerRef}>
                                <CeremonyCard 
                                    event={event} 
                                    editorSection={currentContentSection} 
                                    themeConfig={config}
                                    onSectionClick={(sectionNumber) => {
                                        // Map section clicks to dropdown menu numbers
                                        // Section 1 (Front Page) → Opens dropdown "2"
                                        // Section 2 speech → Opens dropdown "3"
                                        // Section 2 location → Opens dropdown "4"
                                        // Section 3 tentative → Opens dropdown "5"
                                        // Section 4 → Opens dropdown "10"
                                        setOpenAccordionSection(sectionNumber.toString());
                                        setCurrentContentSection(sectionNumber);
                                        scrollToSection(sectionNumber);
                                    }}
                                />
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




