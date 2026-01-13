"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Upload } from "lucide-react";
import { CreatorCard } from "@/components/creator/CreatorCard";
import { CeremonyCard } from "@/components/card/CeremonyCard";
import { defaultThemeConfig, ThemeConfig, BackgroundStyle, FooterIcons, FooterIconConfig, FooterContainerConfig } from "@/components/creator/ThemeTypes";
import { ThemeControls } from "@/components/creator/ThemeControls";
import { IconUpload } from "@/components/creator/IconUpload";
import { IconUploadWithControls } from "@/components/creator/IconUploadWithControls";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent, UniqueIdentifier } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Switch } from "@/components/ui/switch";
import { EditorPager } from "@/components/EditorPager";
import { useEvent } from "@/context/EventContext";
import { IconSave } from "@/components/card/Icons";
import { Page1Form } from "@/components/forms/Page1Form";
import { Page2Form } from "@/components/forms/Page2Form";
import { Page3Form } from "@/components/forms/Page3Form";
import { Page4Form } from "@/components/forms/Page4Form";
import { Page5Form } from "@/components/forms/Page5Form";
import { Page7Form } from "@/components/forms/Page7Form";
import { Page8Form } from "@/components/forms/Page8Form";
import { Page9Form } from "@/components/forms/Page9Form";
import { Page10Form } from "@/components/forms/Page10Form";
import { Page11Form } from "@/components/forms/Page11Form";
import { Page12Form } from "@/components/forms/Page12Form";
import { Page13Form } from "@/components/forms/Page13Form";
import { Page14Form } from "@/components/forms/Page14Form";
import { Page15Form } from "@/components/forms/Page15Form";
import { Page16Form } from "@/components/forms/Page16Form";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, Save, Type } from "lucide-react";
import { CURATED_GOOGLE_FONTS, loadAllCuratedFonts } from "@/lib/fonts";
import { saveDesignerFont, CustomFont } from "@/lib/fontStorage";
import { useDesignerFonts } from "@/context/DesignerFontContext";

const SECTIONS = [
  { id: 1, label: "1. Main & Opening" },
  { id: 2, label: "2. Front Page" },
  { id: 3, label: "3. Invitation Speech" },
  { id: 4, label: "4. Location & Navigation" },
  { id: 5, label: "5. Tentative & More" },
  { id: 7, label: "7. RSVP" },
  { id: 8, label: "8. Contacts" },
  { id: 9, label: "9. Music & Auto Scroll" },
  { id: 10, label: "10. Final Segment" },
  { id: 11, label: "11. Button" },
  { id: 12, label: "12. Image Gallery" },
  { id: 13, label: "13. Body Card" },
  { id: 14, label: "14. Counting Days" },
  { id: 15, label: "15. Attendance" },
  { id: 16, label: "16. Congratulations" },
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

// Helper function to normalize icon config (support both old string format and new object format)
const normalizeIconConfig = (value: string | FooterIconConfig | undefined, defaultOrder: number): FooterIconConfig => {
    if (!value) return { visible: true, order: defaultOrder };
    if (typeof value === 'string') return { url: value, visible: true, order: defaultOrder };
    return { ...value, order: value.order ?? defaultOrder, visible: value.visible ?? true };
};

// Helper function to get icon config from FooterIcons
const getIconConfig = (icons: FooterIcons | undefined, key: 'calendar' | 'phone' | 'pin' | 'rsvp' | 'gifts', defaultOrder: number): FooterIconConfig => {
    const value = icons?.[key];
    return normalizeIconConfig(value, defaultOrder);
};

// Helper function to update icon config
const updateIconConfig = (icons: FooterIcons | undefined, key: 'calendar' | 'phone' | 'pin' | 'rsvp' | 'gifts', config: FooterIconConfig): FooterIcons => {
    return { ...(icons || {}), [key]: config };
};

// Icon definitions with default order
const ICON_DEFINITIONS = [
    { key: 'calendar' as const, label: 'Calendar', defaultOrder: 1 },
    { key: 'phone' as const, label: 'Phone', defaultOrder: 2 },
    { key: 'pin' as const, label: 'Location', defaultOrder: 3 },
    { key: 'rsvp' as const, label: 'RSVP', defaultOrder: 4 },
    { key: 'gifts' as const, label: 'Gifts', defaultOrder: 5 },
];

// Sortable Icon Item Component
function SortableIconItem({
    id,
    label,
    iconKey,
    value,
    order,
    visible,
    onChange,
    onRemove,
    onVisibilityChange,
}: {
    id: string;
    label: string;
    iconKey: 'calendar' | 'phone' | 'pin' | 'rsvp' | 'gifts';
    value: FooterIconConfig;
    order: number;
    visible: boolean;
    onChange: (config: FooterIconConfig) => void;
    onRemove: () => void;
    onVisibilityChange: (visible: boolean) => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} className={isDragging ? 'opacity-50' : ''}>
            <IconUploadWithControls
                label={label}
                iconKey={iconKey}
                value={value}
                order={order}
                visible={visible}
                onChange={onChange}
                onRemove={onRemove}
                onOrderChange={() => {}} // Handled by drag and drop
                onVisibilityChange={onVisibilityChange}
                isDragging={isDragging}
                dragHandleProps={{ ...attributes, ...listeners }}
            />
        </div>
    );
}

export default function CreateThemePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const editingId = searchParams.get('id');
    const isEditing = !!editingId;
    
    const { event, updateEvent, resetEvent } = useEvent();
    const [config, setConfig] = useState<ThemeConfig>(defaultThemeConfig);
    const [isSavingTheme, setIsSavingTheme] = useState(false);
    const [isSavingContent, setIsSavingContent] = useState(false);
    const [isSavingTemplate, setIsSavingTemplate] = useState(false);
    const [activeSection, setActiveSection] = useState<1 | 2 | 3 | 4>(1);
    const [currentContentSection, setCurrentContentSection] = useState(1);
    const [openAccordionSection, setOpenAccordionSection] = useState<string>("1");
    
    // Persist activeTab in localStorage to prevent reset on page refresh/event changes
    const [activeTab, setActiveTab] = useState<"theme" | "content">("theme");
    
    // Load activeTab from localStorage on mount (client-side only to avoid hydration error)
    useEffect(() => {
        const saved = localStorage.getItem("create-theme-activeTab");
        if (saved === "theme" || saved === "content") {
            setActiveTab(saved);
        }
    }, []);
    
    // Update localStorage when activeTab changes
    useEffect(() => {
        localStorage.setItem("create-theme-activeTab", activeTab);
    }, [activeTab]);
    const [isLoadingTheme, setIsLoadingTheme] = useState(false);
    const [editingType, setEditingType] = useState<'theme' | 'content' | 'template' | null>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const previewContainerRef = useRef<HTMLDivElement>(null);
    const fontUploadInputRef = useRef<HTMLInputElement>(null);
    const [showUnsavedChangesDialog, setShowUnsavedChangesDialog] = useState(false);
    const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [showFontNameDialog, setShowFontNameDialog] = useState(false);
    const [pendingFontFile, setPendingFontFile] = useState<File | null>(null);
    const [fontFamilyName, setFontFamilyName] = useState("");
    const { designerId, customFonts: designerCustomFonts, refreshFonts } = useDesignerFonts();
    const [showLoadThemeDialog, setShowLoadThemeDialog] = useState(false);
    const [showLoadContentDialog, setShowLoadContentDialog] = useState(false);
    const [loadingProjects, setLoadingProjects] = useState(false);
    const [savedThemes, setSavedThemes] = useState<any[]>([]);
    const [savedContent, setSavedContent] = useState<any[]>([]);
    
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
    const [isMounted, setIsMounted] = useState(false);

    // Ensure component only renders drag-and-drop on client
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Load theme/content/template data when editing
    useEffect(() => {
        async function loadThemeData() {
            if (!editingId) return;

            setIsLoadingTheme(true);
            try {
                const response = await fetch(`/api/designer/themes/${editingId}`);
                if (response.ok) {
                    const data = await response.json();
                    const themeConfig = data.config || {};
                    const themeType = themeConfig.type || 'theme';
                    
                    setEditingType(themeType);
                    
                    // Load theme config
                    if (themeType === 'theme' || themeType === 'template') {
                        setConfig(themeConfig as ThemeConfig);
                        // Only set active tab on initial load if localStorage doesn't have a saved value
                        const savedTab = localStorage.getItem("create-theme-activeTab");
                        if (!savedTab) {
                            setActiveTab('theme');
                        }
                    }
                    
                    // Load content/event data
                    if (themeType === 'content' || themeType === 'template') {
                        if (themeConfig.defaultEventData) {
                            // Update event context with loaded data (merge all fields at once)
                            updateEvent(themeConfig.defaultEventData);
                        }
                        // Only set active tab on initial load if localStorage doesn't have a saved value
                        const savedTab = localStorage.getItem("create-theme-activeTab");
                        if (!savedTab) {
                            if (themeType === 'content') {
                                setActiveTab('content');
                            }
                        }
                    }
                } else {
                    toast.error("Failed to load theme");
                    router.push("/designer/dashboard/themes");
                }
            } catch (error) {
                console.error("Error loading theme:", error);
                toast.error("Failed to load theme");
                router.push("/designer/dashboard/themes");
            } finally {
                setIsLoadingTheme(false);
            }
        }

        if (editingId) {
            loadThemeData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editingId, router]);

    // Drag and drop sensors
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor)
    );

    // Get sorted icon list based on order
    const getSortedIcons = () => {
        return ICON_DEFINITIONS.map(def => ({
            ...def,
            config: getIconConfig(config.footerIcons, def.key, def.defaultOrder),
        })).sort((a, b) => (a.config.order ?? a.defaultOrder) - (b.config.order ?? b.defaultOrder));
    };

    const [sortedIcons, setSortedIcons] = useState(getSortedIcons());

    // Update sorted icons when config changes
    useEffect(() => {
        setSortedIcons(getSortedIcons());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [config.footerIcons]);

    // Handle drag end for icon reordering
    const handleIconDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = sortedIcons.findIndex(icon => icon.key === active.id);
        const newIndex = sortedIcons.findIndex(icon => icon.key === over.id);

        if (oldIndex !== -1 && newIndex !== -1) {
            const newSortedIcons = arrayMove(sortedIcons, oldIndex, newIndex);
            setSortedIcons(newSortedIcons);

            // Update order in config
            const updatedIcons: FooterIcons = { ...(config.footerIcons || {}) };
            newSortedIcons.forEach((icon, index) => {
                const currentConfig = getIconConfig(updatedIcons, icon.key, icon.defaultOrder);
                updatedIcons[icon.key] = { ...currentConfig, order: index + 1 };
            });
            updateConfig('footerIcons', updatedIcons);
        }
    };

    // Inject @font-face CSS into the document
    const injectFontFaces = (fonts: Array<{ name: string; url: string; fontFamily: string; format?: string }>) => {
        if (typeof window === 'undefined') return;
        
        const styleId = 'custom-fonts-style';
        let styleElement = document.getElementById(styleId) as HTMLStyleElement;
        
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = styleId;
            document.head.appendChild(styleElement);
        }

        let css = styleElement.textContent || '';
        
        fonts.forEach(font => {
            const format = font.format || 'woff';
            const fontFaceRule = `
@font-face {
    font-family: "${font.fontFamily}";
    src: url("${font.url}") format("${format}");
}
`;
            // Check if this font is already injected
            if (!css.includes(`font-family: "${font.fontFamily}"`)) {
                css += fontFaceRule;
            }
        });

        styleElement.textContent = css;
    };


    // Load Google Fonts on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            loadAllCuratedFonts();
        }
    }, []);

    const handleFontFileSelect = (files: FileList | null) => {
        if (!files || files.length === 0) return;

        const file = files[0]; // Only accept single file
        if (!file.name.toLowerCase().endsWith('.woff')) {
            toast.error('Only .woff files are supported. Please upload a variable font file.');
            if (fontUploadInputRef.current) {
                fontUploadInputRef.current.value = '';
            }
            return;
        }

        // Show dialog to ask for font family name
        setPendingFontFile(file);
        setShowFontNameDialog(true);
        if (fontUploadInputRef.current) {
            fontUploadInputRef.current.value = '';
        }
    };

    const handleConfirmFontUpload = async () => {
        if (!pendingFontFile || !fontFamilyName.trim() || !designerId) {
            toast.error('Please provide a font family name.');
            return;
        }

        try {
            const url = URL.createObjectURL(pendingFontFile);
            const customFont: CustomFont = {
                name: pendingFontFile.name,
                url: url,
                fontFamily: fontFamilyName.trim(),
                format: 'woff',
            };

            // Save to designer's font storage
            saveDesignerFont(designerId, customFont);

            // Refresh fonts from context
            refreshFonts();

            toast.success('Font uploaded successfully!', {
                description: `Font "${fontFamilyName}" is now available for use.`,
                duration: 3000,
            });

            // Reset dialog state
            setShowFontNameDialog(false);
            setPendingFontFile(null);
            setFontFamilyName('');
            setHasUnsavedChanges(true);
        } catch (error) {
            console.error('Error uploading font:', error);
            toast.error('Failed to upload font. Please try again.');
        }
    };

    // Track changes to detect unsaved changes
    useEffect(() => {
        setHasUnsavedChanges(true);
    }, [event, config]);

    // Handle browser refresh/close
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (hasUnsavedChanges) {
                e.preventDefault();
                e.returnValue = '';
                return '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [hasUnsavedChanges]);

    const handleSaveAndContinue = () => {
        try {
            localStorage.setItem("ceremony-card-event", JSON.stringify(event));
            localStorage.setItem("theme-config", JSON.stringify(config));
            setHasUnsavedChanges(false);
            setShowUnsavedChangesDialog(false);
            
            if (pendingNavigation) {
                router.push(pendingNavigation);
                setPendingNavigation(null);
            } else {
                window.location.reload();
            }
            
            toast.success("Changes saved successfully!");
        } catch (error) {
            console.error("Error saving:", error);
            toast.error("Error saving changes");
        }
    };

    const handleDiscardAndContinue = () => {
        setHasUnsavedChanges(false);
        setShowUnsavedChangesDialog(false);
        
        if (pendingNavigation) {
            router.push(pendingNavigation);
            setPendingNavigation(null);
        } else {
            window.location.reload();
        }
    };

    const handleCancelNavigation = () => {
        setShowUnsavedChangesDialog(false);
        setPendingNavigation(null);
    };

    const updateConfig = (key: keyof ThemeConfig, value: BackgroundStyle | string | number | FooterIcons | FooterContainerConfig | undefined) => {
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

    // Handle save directly without modal - name will be auto-generated
    const handleSave = async (type: "theme" | "content" | "template") => {
        // Validation
        if (type === "theme" && !config.themeName) {
            toast.error("Please select a theme first");
            return;
        }
        if (type === "template" && (!config.themeName || !config.color)) {
            toast.error("Please select a theme and enter a color first");
            return;
        }

        // Set loading state based on type
        if (type === "theme") {
            setIsSavingTheme(true);
        } else if (type === "content") {
            setIsSavingContent(true);
        } else {
            setIsSavingTemplate(true);
        }

        try {
            // If editing, use PUT; otherwise POST
            const url = isEditing && editingId 
                ? `/api/designer/themes/${editingId}`
                : '/api/designer/themes';
            const method = isEditing && editingId ? 'PUT' : 'POST';

            const payload: any = {
                type: type,
                // Name will be auto-generated by the API based on customId (only for new items)
            };

            if (type === "theme" || type === "template") {
                payload.config = config;
            }

            if (type === "content" || type === "template") {
                payload.defaultEventData = event;
            }

            if (type === "content") {
                payload.config = {};
            }

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                const typeName = type === "theme" ? "Theme" : type === "content" ? "Content" : "Template";
                const action = isEditing ? "updated" : "saved";
                toast.success(`${typeName} ${action} successfully! ${data.theme?.customId ? `(ID: ${data.theme.customId})` : ''}`);
                
                // Update editingId if this was a new save (so URL reflects the saved item)
                if (!isEditing && data.theme?.id) {
                    router.replace(`/designer/dashboard/create-theme?id=${data.theme.id}`, { scroll: false });
                    setEditingType(type);
                }
                
                // Mark as no unsaved changes
                setHasUnsavedChanges(false);
                
                // Only reset if creating new, not editing
                if (!isEditing) {
                    if (type === "theme" || type === "template") {
                        setConfig(defaultThemeConfig);
                    }
                    if (type === "content" || type === "template") {
                        resetEvent();
                    }
                }
            } else {
                toast.error(data.error || `Failed to ${isEditing ? 'update' : 'save'} ${type}. Please try again.`);
            }
        } catch (error) {
            console.error(`Error saving ${type}:`, error);
            toast.error(`An error occurred while ${isEditing ? 'updating' : 'saving'} the ${type}.`);
        } finally {
            setIsSavingTheme(false);
            setIsSavingContent(false);
            setIsSavingTemplate(false);
        }
    };

    return (
        <>
            {/* Unsaved Changes Dialog */}
            <Dialog open={showUnsavedChangesDialog} onOpenChange={setShowUnsavedChangesDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Unsaved Changes</DialogTitle>
                        <DialogDescription>
                            You have unsaved changes. Would you like to save your project before leaving?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2">
                        <Button
                            variant="outline"
                            onClick={handleCancelNavigation}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDiscardAndContinue}
                        >
                            Discard Changes
                        </Button>
                        <Button
                            onClick={handleSaveAndContinue}
                            className="bg-[#36463A] hover:bg-[#2d3a2f]"
                        >
                            Save & Continue
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Font Name Dialog */}
            <Dialog open={showFontNameDialog} onOpenChange={(open) => {
                if (!open) {
                    setShowFontNameDialog(false);
                    setPendingFontFile(null);
                    setFontFamilyName('');
                }
            }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Font Family Name</DialogTitle>
                        <DialogDescription>
                            Please enter a name for this font family. This name will appear in the font dropdown.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Label htmlFor="fontFamilyName">Font Family Name</Label>
                        <Input
                            id="fontFamilyName"
                            value={fontFamilyName}
                            onChange={(e) => setFontFamilyName(e.target.value)}
                            placeholder="e.g., My Custom Font"
                            className="mt-2"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && fontFamilyName.trim()) {
                                    handleConfirmFontUpload();
                                }
                            }}
                        />
                        <p className="text-xs text-gray-500 mt-2">
                            Uploaded file: {pendingFontFile?.name}
                        </p>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowFontNameDialog(false);
                                setPendingFontFile(null);
                                setFontFamilyName('');
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirmFontUpload}
                            disabled={!fontFamilyName.trim()}
                            className="bg-[#36463A] hover:bg-[#2d3a2f]"
                        >
                            Upload Font
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Load Theme Dialog */}
            <Dialog open={showLoadThemeDialog} onOpenChange={setShowLoadThemeDialog}>
                <DialogContent className="max-w-2xl max-h-[80vh]">
                    <DialogHeader>
                        <DialogTitle>Load Saved Theme</DialogTitle>
                        <DialogDescription>
                            Select a saved theme to continue working on it.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        {loadingProjects ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#36463A]"></div>
                            </div>
                        ) : savedThemes.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                No saved themes found. Create and save a theme first.
                            </div>
                        ) : (
                            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                                {savedThemes.map((theme) => (
                                    <div
                                        key={theme.id}
                                        onClick={async () => {
                                            try {
                                                const response = await fetch(`/api/designer/themes/${theme.id}`);
                                                if (response.ok) {
                                                    const data = await response.json();
                                                    const themeConfig = data.config || {};
                                                    setConfig(themeConfig as ThemeConfig);
                                                    setShowLoadThemeDialog(false);
                                                    toast.success("Theme loaded successfully");
                                                    setHasUnsavedChanges(false);
                                                } else {
                                                    toast.error("Failed to load theme");
                                                }
                                            } catch (error) {
                                                console.error("Error loading theme:", error);
                                                toast.error("Failed to load theme");
                                            }
                                        }}
                                        className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{theme.name}</h3>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(theme.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-xs px-2 py-1 rounded ${
                                                    theme.status === 'published' 
                                                        ? 'bg-green-100 text-green-700' 
                                                        : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                    {theme.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowLoadThemeDialog(false)}
                        >
                            Cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Load Content Dialog */}
            <Dialog open={showLoadContentDialog} onOpenChange={setShowLoadContentDialog}>
                <DialogContent className="max-w-2xl max-h-[80vh]">
                    <DialogHeader>
                        <DialogTitle>Load Saved Content</DialogTitle>
                        <DialogDescription>
                            Select saved content to continue working on it.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        {loadingProjects ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#36463A]"></div>
                            </div>
                        ) : savedContent.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                No saved content found. Create and save content first.
                            </div>
                        ) : (
                            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                                {savedContent.map((content) => (
                                    <div
                                        key={content.id}
                                        onClick={async () => {
                                            try {
                                                const response = await fetch(`/api/designer/themes/${content.id}`);
                                                if (response.ok) {
                                                    const data = await response.json();
                                                    const themeConfig = data.config || {};
                                                    if (themeConfig.defaultEventData) {
                                                        updateEvent(themeConfig.defaultEventData);
                                                    }
                                                    setShowLoadContentDialog(false);
                                                    toast.success("Content loaded successfully");
                                                    setHasUnsavedChanges(false);
                                                } else {
                                                    toast.error("Failed to load content");
                                                }
                                            } catch (error) {
                                                console.error("Error loading content:", error);
                                                toast.error("Failed to load content");
                                            }
                                        }}
                                        className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{content.name}</h3>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(content.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-xs px-2 py-1 rounded ${
                                                    content.status === 'published' 
                                                        ? 'bg-green-100 text-green-700' 
                                                        : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                    {content.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowLoadContentDialog(false)}
                        >
                            Cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        <div className="space-y-6">
            {isLoadingTheme ? (
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#36463A] mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading theme...</p>
                    </div>
                </div>
            ) : (
                <>
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <h1 className="text-3xl font-bold mb-2">
                        {isEditing ? `Edit ${editingType === 'theme' ? 'Theme' : editingType === 'content' ? 'Content' : 'Template'}` : "Create New Theme"}
                    </h1>
                    <p className="text-muted-foreground">
                        {isEditing ? "Update your theme, content, or template. Make changes and save." : "Design your wedding card theme. Customize backgrounds, colors, and default content."}
                    </p>
                    
                    {/* Theme and Color Inputs */}
                    <div className="flex gap-4 mt-4">
                        <div className="flex-1">
                            <Label htmlFor="themeSelect" className="text-sm font-medium mb-1 block">Theme</Label>
                            <Select
                                value={config.themeName || ''}
                                onValueChange={(value) => {
                                    updateConfig('themeName', value);
                                }}
                            >
                                <SelectTrigger id="themeSelect" className="w-full">
                                    <SelectValue placeholder="Select theme" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="baby">Baby</SelectItem>
                                    <SelectItem value="party">Party</SelectItem>
                                    <SelectItem value="ramadan">Ramadan</SelectItem>
                                    <SelectItem value="raya">Raya</SelectItem>
                                    <SelectItem value="floral">Floral</SelectItem>
                                    <SelectItem value="islamic">Islamic</SelectItem>
                                    <SelectItem value="minimalist">Minimalist</SelectItem>
                                    <SelectItem value="modern">Modern</SelectItem>
                                    <SelectItem value="rustic">Rustic</SelectItem>
                                    <SelectItem value="traditional">Traditional</SelectItem>
                                    <SelectItem value="vintage">Vintage</SelectItem>
                                    <SelectItem value="watercolor">Watercolor</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex-1">
                            <Label htmlFor="colorInput" className="text-sm font-medium mb-1 block">Color</Label>
                            <Input
                                id="colorInput"
                                type="text"
                                value={config.color || ''}
                                onChange={(e) => {
                                    const value = e.target.value.toUpperCase();
                                    updateConfig('color', value);
                                }}
                                placeholder="e.g. ROSE, BLUE, GOLD"
                                className="w-full uppercase"
                            />
                        </div>
                    </div>
                </div>
                
                {/* Right Side - Action Buttons */}
                <div className="flex items-center gap-3 ml-6">
                    {/* Font Upload Button */}
                    <Button
                        onClick={() => fontUploadInputRef.current?.click()}
                        variant="outline"
                        className="px-4 py-2 rounded-full border border-[#36463A] text-[#36463A] bg-white text-sm shadow hover:bg-gray-50 flex items-center gap-2"
                    >
                        <Type className="w-4 h-4" />
                        Upload Font
                    </Button>
                    <input
                        ref={fontUploadInputRef}
                        type="file"
                        accept=".woff"
                        onChange={(e) => handleFontFileSelect(e.target.files)}
                        className="hidden"
                    />
                    
                    <Button
                        onClick={() => {
                            setConfig(defaultThemeConfig);
                            resetEvent();
                            setHasUnsavedChanges(false);
                            toast.success("Reset to defaults");
                        }}
                        variant="outline"
                        className="px-4 py-2 rounded-full border border-[#36463A] text-[#36463A] bg-white text-sm shadow hover:bg-gray-50"
                    >
                        Reset to Defaults
                    </Button>
                    
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                disabled={isSavingTheme || isSavingContent || isSavingTemplate}
                                className="px-4 py-2 rounded-full border border-[#36463A] text-white bg-[#36463A] text-sm shadow hover:bg-[#2d3a2f] flex items-center gap-2"
                            >
                                <Save className="w-4 h-4" />
                                Save
                                <ChevronDown className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={() => handleSave("theme")}
                                disabled={!config.themeName || isSavingTheme || isSavingContent || isSavingTemplate || isLoadingTheme}
                            >
                                <span>{isEditing ? "Update Theme" : "Save Theme"}</span>
                                {!config.themeName && (
                                    <span className="ml-2 text-xs text-gray-400">(Select theme first)</span>
                                )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleSave("content")}
                                disabled={isSavingTheme || isSavingContent || isSavingTemplate || isLoadingTheme}
                            >
                                {isEditing ? "Update Content" : "Save Content"}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleSave("template")}
                                disabled={!config.themeName || !config.color || isSavingTheme || isSavingContent || isSavingTemplate || isLoadingTheme}
                            >
                                <span>{isEditing ? "Update Template" : "Save Template"}</span>
                                {(!config.themeName || !config.color) && (
                                    <span className="ml-2 text-xs text-gray-400">(Complete theme & color)</span>
                                )}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    
                    <Button
                        onClick={() => {
                            if (hasUnsavedChanges) {
                                setPendingNavigation("/designer/preview");
                                setShowUnsavedChangesDialog(true);
                            } else {
                                router.push("/designer/preview");
                            }
                        }}
                        className="px-4 py-2 rounded-full border border-[#36463A] text-white bg-[#36463A] text-sm shadow hover:bg-[#2d3a2f]"
                    >
                        Preview
                    </Button>
                </div>
            </div>
            
            {/* Tab Menu */}
            <div className="flex items-center justify-between">
                <div className="inline-flex rounded-2xl border border-[#36463A] overflow-hidden">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setActiveTab("theme");
                        }}
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
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Theme Designer</CardTitle>
                                <CardDescription>Customize your theme appearance</CardDescription>
                            </div>
                            <Button
                                onClick={async () => {
                                    setShowLoadThemeDialog(true);
                                    setLoadingProjects(true);
                                    try {
                                        const response = await fetch('/api/designer/themes');
                                        if (response.ok) {
                                            const themes = await response.json();
                                            // Filter only themes (not content or template)
                                            const themeProjects = themes.filter((t: any) => t.type === 'theme');
                                            setSavedThemes(themeProjects);
                                        } else {
                                            toast.error("Failed to load saved themes");
                                        }
                                    } catch (error) {
                                        console.error("Error loading themes:", error);
                                        toast.error("Failed to load saved themes");
                                    } finally {
                                        setLoadingProjects(false);
                                    }
                                }}
                                variant="outline"
                                className="px-4 py-2"
                            >
                                Load
                            </Button>
                        </div>
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
                                                <div className="flex items-center gap-2">
                                                    <Label className="text-xs text-gray-600 w-24">Height (px)</Label>
                                                    <Input
                                                        type="number"
                                                        value={config.section1Height ?? ''}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            updateConfig('section1Height', value ? Number(value) : (undefined as any));
                                                        }}
                                                        placeholder="Auto"
                                                        className="h-8 text-xs"
                                                        min="0"
                                                        step="1"
                                                    />
                                                </div>
                                                <ThemeControls
                                                    label="Section 2"
                                                    value={config.section2Background}
                                                    onChange={(val) => updateConfig('section2Background', val)}
                                                />
                                                <div className="flex items-center gap-2">
                                                    <Label className="text-xs text-gray-600 w-24">Height (px)</Label>
                                                    <Input
                                                        type="number"
                                                        value={config.section2Height ?? ''}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            updateConfig('section2Height', value ? Number(value) : (undefined as any));
                                                        }}
                                                        placeholder="Auto"
                                                        className="h-8 text-xs"
                                                        min="0"
                                                        step="1"
                                                    />
                                                </div>
                                                <ThemeControls
                                                    label="Section 3"
                                                    value={config.section3Background}
                                                    onChange={(val) => updateConfig('section3Background', val)}
                                                />
                                                <div className="flex items-center gap-2">
                                                    <Label className="text-xs text-gray-600 w-24">Height (px)</Label>
                                                    <Input
                                                        type="number"
                                                        value={config.section3Height ?? ''}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            updateConfig('section3Height', value ? Number(value) : (undefined as any));
                                                        }}
                                                        placeholder="Auto"
                                                        className="h-8 text-xs"
                                                        min="0"
                                                        step="1"
                                                    />
                                                </div>
                                                <ThemeControls
                                                    label="Section 4"
                                                    value={config.section4Background}
                                                    onChange={(val) => updateConfig('section4Background', val)}
                                                />
                                                <div className="flex items-center gap-2">
                                                    <Label className="text-xs text-gray-600 w-24">Height (px)</Label>
                                                    <Input
                                                        type="number"
                                                        value={config.section4Height ?? ''}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            updateConfig('section4Height', value ? Number(value) : (undefined as any));
                                                        }}
                                                        placeholder="Auto"
                                                        className="h-8 text-xs"
                                                        min="0"
                                                        step="1"
                                                    />
                                                </div>
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

                                            {/* Icon Text Font Settings */}
                                            <div className="p-2 bg-white/90 backdrop-blur-sm rounded-lg border border-rose-200 shadow-sm flex flex-col gap-3">
                                                <span className="text-xs font-semibold text-rose-800 uppercase tracking-wider">Icon Text Font Settings</span>
                                                
                                                {/* Text Icon Color */}
                                                <div className="space-y-2">
                                                    <Label htmlFor="footerTextColor" className="text-[10px] text-gray-600">Text Icon Color</Label>
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

                                                {/* Font Family */}
                                                <div className="space-y-2">
                                                    <Label htmlFor="footerTextFontFamily" className="text-[10px] text-gray-600">Font Family</Label>
                                                    <Input
                                                        id="footerTextFontFamily"
                                                        type="text"
                                                        value={config.footerTextFontFamily || 'Helvetica, Arial, sans-serif'}
                                                        onChange={(e) => {
                                                            updateConfig('footerTextFontFamily', e.target.value);
                                                        }}
                                                        placeholder="Helvetica, Arial, sans-serif"
                                                        className="h-8 text-xs"
                                                    />
                                                </div>

                                                {/* Font Size */}
                                                <div className="space-y-2">
                                                    <Label htmlFor="footerTextFontSize" className="text-[10px] text-gray-600">Font Size (px)</Label>
                                                    <Input
                                                        id="footerTextFontSize"
                                                        type="number"
                                                        value={config.footerTextFontSize ?? 10}
                                                        onChange={(e) => {
                                                            const value = Math.max(8, Math.min(24, parseFloat(e.target.value) || 10));
                                                            updateConfig('footerTextFontSize', value as any);
                                                        }}
                                                        className="h-8 text-xs"
                                                        min="8"
                                                        max="24"
                                                        step="1"
                                                    />
                                                </div>

                                                {/* Font Weight */}
                                                <div className="space-y-2">
                                                    <Label htmlFor="footerTextFontWeight" className="text-[10px] text-gray-600">Font Weight</Label>
                                                    <Select
                                                        value={String(config.footerTextFontWeight || 'normal')}
                                                        onValueChange={(value) => {
                                                            // Try to parse as number, otherwise use string
                                                            const numValue = parseInt(value);
                                                            updateConfig('footerTextFontWeight', (isNaN(numValue) ? value : numValue) as any);
                                                        }}
                                                    >
                                                        <SelectTrigger className="h-8 text-xs">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="normal">Normal</SelectItem>
                                                            <SelectItem value="bold">Bold</SelectItem>
                                                            <SelectItem value="100">100 (Thin)</SelectItem>
                                                            <SelectItem value="200">200 (Extra Light)</SelectItem>
                                                            <SelectItem value="300">300 (Light)</SelectItem>
                                                            <SelectItem value="400">400 (Regular)</SelectItem>
                                                            <SelectItem value="500">500 (Medium)</SelectItem>
                                                            <SelectItem value="600">600 (Semi Bold)</SelectItem>
                                                            <SelectItem value="700">700 (Bold)</SelectItem>
                                                            <SelectItem value="800">800 (Extra Bold)</SelectItem>
                                                            <SelectItem value="900">900 (Black)</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>

                                            {/* Box Shadow Footer Control */}
                                            <div className="p-2 bg-white/90 backdrop-blur-sm rounded-lg border border-rose-200 shadow-sm flex flex-col gap-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-semibold text-rose-800 uppercase tracking-wider">Box Shadow Footer</span>
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
                                            <div className="p-2 bg-white/90 backdrop-blur-sm rounded-lg border border-rose-200 shadow-sm flex flex-col gap-3">
                                                <span className="text-xs font-semibold text-rose-800 uppercase tracking-wider mb-1">Custom Icons</span>
                                                
                                                {isMounted ? (
                                                    <DndContext
                                                        sensors={sensors}
                                                        collisionDetection={closestCenter}
                                                        onDragEnd={handleIconDragEnd}
                                                    >
                                                        <SortableContext
                                                            items={sortedIcons.map(icon => icon.key)}
                                                            strategy={verticalListSortingStrategy}
                                                        >
                                                            <div className="space-y-2">
                                                                {sortedIcons.map((iconDef) => {
                                                                const iconConfig = iconDef.config;
                                                                const iconKey = iconDef.key;
                                                                
                                                                return (
                                                                    <SortableIconItem
                                                                        key={iconKey}
                                                                        id={iconKey}
                                                                        label={iconDef.label}
                                                                        iconKey={iconKey}
                                                                        value={iconConfig}
                                                                        order={iconConfig.order ?? iconDef.defaultOrder}
                                                                        visible={iconConfig.visible ?? true}
                                                                        onChange={(newConfig) => {
                                                                            const updatedIcons: FooterIcons = { ...(config.footerIcons || {}) };
                                                                            updatedIcons[iconKey] = newConfig;
                                                                            updateConfig('footerIcons', updatedIcons);
                                                                        }}
                                                                        onRemove={() => {
                                                                            const updatedIcons: FooterIcons = { ...(config.footerIcons || {}) };
                                                                            delete updatedIcons[iconKey];
                                                                            updateConfig('footerIcons', Object.keys(updatedIcons).length > 0 ? updatedIcons : undefined as any);
                                                                        }}
                                                                        onVisibilityChange={(visible) => {
                                                                            const updatedIcons: FooterIcons = { ...(config.footerIcons || {}) };
                                                                            const currentConfig = getIconConfig(updatedIcons, iconKey, iconDef.defaultOrder);
                                                                            updatedIcons[iconKey] = { ...currentConfig, visible };
                                                                            updateConfig('footerIcons', updatedIcons);
                                                                        }}
                                                                    />
                                                                );
                                                            })}
                                                        </div>
                                                    </SortableContext>
                                                    </DndContext>
                                                ) : (
                                                    // Fallback for SSR - render without drag-and-drop
                                                    <div className="space-y-2">
                                                        {sortedIcons.map((iconDef) => {
                                                            const iconConfig = iconDef.config;
                                                            const iconKey = iconDef.key;
                                                            
                                                            return (
                                                                <div key={iconKey}>
                                                                    <IconUploadWithControls
                                                                        label={iconDef.label}
                                                                        iconKey={iconKey}
                                                                        value={iconConfig}
                                                                        order={iconConfig.order ?? iconDef.defaultOrder}
                                                                        visible={iconConfig.visible ?? true}
                                                                        onChange={(newConfig) => {
                                                                            const updatedIcons: FooterIcons = { ...(config.footerIcons || {}) };
                                                                            updatedIcons[iconKey] = newConfig;
                                                                            updateConfig('footerIcons', updatedIcons);
                                                                        }}
                                                                        onRemove={() => {
                                                                            const updatedIcons: FooterIcons = { ...(config.footerIcons || {}) };
                                                                            delete updatedIcons[iconKey];
                                                                            updateConfig('footerIcons', Object.keys(updatedIcons).length > 0 ? updatedIcons : undefined as any);
                                                                        }}
                                                                        onOrderChange={() => {}}
                                                                        onVisibilityChange={(visible) => {
                                                                            const updatedIcons: FooterIcons = { ...(config.footerIcons || {}) };
                                                                            const currentConfig = getIconConfig(updatedIcons, iconKey, iconDef.defaultOrder);
                                                                            updatedIcons[iconKey] = { ...currentConfig, visible };
                                                                            updateConfig('footerIcons', updatedIcons);
                                                                        }}
                                                                        isDragging={false}
                                                                        dragHandleProps={{}}
                                                                    />
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )}

                                                {/* Container Settings */}
                                                <div className="pt-3 border-t border-gray-200 space-y-3">
                                                    <span className="text-xs font-semibold text-rose-800 uppercase tracking-wider">Container Settings</span>
                                                    
                                                    {/* Width Control */}
                                                    <div className="space-y-2">
                                                        <Label className="text-[10px] text-gray-600">Container Width</Label>
                                                        <Select
                                                            value={config.footerContainerConfig?.width || 'custom'}
                                                            onValueChange={(value: 'full' | 'custom') => {
                                                                const currentConfig = config.footerContainerConfig || defaultThemeConfig.footerContainerConfig!;
                                                                updateConfig('footerContainerConfig', {
                                                                    ...currentConfig,
                                                                    width: value,
                                                                } as FooterContainerConfig);
                                                            }}
                                                        >
                                                            <SelectTrigger className="h-8 text-xs">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="full">Full Width</SelectItem>
                                                                <SelectItem value="custom">Custom Width</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    {/* Custom Width Input */}
                                                    {config.footerContainerConfig?.width === 'custom' && (
                                                        <div className="space-y-2">
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <div>
                                                                    <Label htmlFor="containerWidth" className="text-[10px] text-gray-600">Width Value</Label>
                                                                    <Input
                                                                        id="containerWidth"
                                                                        type="number"
                                                                        value={config.footerContainerConfig?.customWidth || 320}
                                                                        onChange={(e) => {
                                                                            const value = parseFloat(e.target.value) || 0;
                                                                            const currentConfig = config.footerContainerConfig || defaultThemeConfig.footerContainerConfig!;
                                                                            updateConfig('footerContainerConfig', {
                                                                                ...currentConfig,
                                                                                customWidth: value,
                                                                            } as FooterContainerConfig);
                                                                        }}
                                                                        className="h-8 text-xs"
                                                                        min="0"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <Label htmlFor="widthUnit" className="text-[10px] text-gray-600">Unit</Label>
                                                                    <Select
                                                                        value={config.footerContainerConfig?.widthUnit || 'px'}
                                                                        onValueChange={(value: 'px' | '%') => {
                                                                            const currentConfig = config.footerContainerConfig || defaultThemeConfig.footerContainerConfig!;
                                                                            updateConfig('footerContainerConfig', {
                                                                                ...currentConfig,
                                                                                widthUnit: value,
                                                                            } as FooterContainerConfig);
                                                                        }}
                                                                    >
                                                                        <SelectTrigger className="h-8 text-xs">
                                                                            <SelectValue />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="px">px</SelectItem>
                                                                            <SelectItem value="%">%</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Bottom Position */}
                                                    <div className="space-y-2">
                                                        <Label htmlFor="bottomPosition" className="text-[10px] text-gray-600">Distance from Bottom (px)</Label>
                                                        <Input
                                                            id="bottomPosition"
                                                            type="number"
                                                            value={config.footerContainerConfig?.bottomPosition ?? 12}
                                                            onChange={(e) => {
                                                                const value = Math.max(0, parseFloat(e.target.value) || 0);
                                                                const currentConfig = config.footerContainerConfig || defaultThemeConfig.footerContainerConfig!;
                                                                updateConfig('footerContainerConfig', {
                                                                    ...currentConfig,
                                                                    bottomPosition: value,
                                                                } as FooterContainerConfig);
                                                            }}
                                                            className="h-8 text-xs"
                                                            min="0"
                                                            placeholder="0"
                                                        />
                                                        <p className="text-[9px] text-gray-500">Minimum: 0 (prevents icons from going out of card)</p>
                                                    </div>

                                                    {/* Border Radius Controls */}
                                                    <div className="space-y-2">
                                                        <Label className="text-[10px] text-gray-600">Border Radius (px)</Label>
                                                        <div className="grid grid-cols-2 gap-2">
                                                            <div>
                                                                <Label htmlFor="borderRadiusTopLeft" className="text-[9px] text-gray-600 mb-0.5 block">Top Left</Label>
                                                                <Input
                                                                    id="borderRadiusTopLeft"
                                                                    type="number"
                                                                    value={config.footerContainerConfig?.borderRadius?.topLeft ?? 16}
                                                                    onChange={(e) => {
                                                                        const value = Math.max(0, parseFloat(e.target.value) || 0);
                                                                        const currentConfig = config.footerContainerConfig || defaultThemeConfig.footerContainerConfig!;
                                                                        updateConfig('footerContainerConfig', {
                                                                            ...currentConfig,
                                                                            borderRadius: {
                                                                                ...currentConfig.borderRadius,
                                                                                topLeft: value,
                                                                            },
                                                                        } as FooterContainerConfig);
                                                                    }}
                                                                    className="h-8 text-xs"
                                                                    min="0"
                                                                    step="1"
                                                                />
                                                            </div>
                                                            <div>
                                                                <Label htmlFor="borderRadiusTopRight" className="text-[9px] text-gray-600 mb-0.5 block">Top Right</Label>
                                                                <Input
                                                                    id="borderRadiusTopRight"
                                                                    type="number"
                                                                    value={config.footerContainerConfig?.borderRadius?.topRight ?? 16}
                                                                    onChange={(e) => {
                                                                        const value = Math.max(0, parseFloat(e.target.value) || 0);
                                                                        const currentConfig = config.footerContainerConfig || defaultThemeConfig.footerContainerConfig!;
                                                                        updateConfig('footerContainerConfig', {
                                                                            ...currentConfig,
                                                                            borderRadius: {
                                                                                ...currentConfig.borderRadius,
                                                                                topRight: value,
                                                                            },
                                                                        } as FooterContainerConfig);
                                                                    }}
                                                                    className="h-8 text-xs"
                                                                    min="0"
                                                                    step="1"
                                                                />
                                                            </div>
                                                            <div>
                                                                <Label htmlFor="borderRadiusBottomLeft" className="text-[9px] text-gray-600 mb-0.5 block">Bottom Left</Label>
                                                                <Input
                                                                    id="borderRadiusBottomLeft"
                                                                    type="number"
                                                                    value={config.footerContainerConfig?.borderRadius?.bottomLeft ?? 16}
                                                                    onChange={(e) => {
                                                                        const value = Math.max(0, parseFloat(e.target.value) || 0);
                                                                        const currentConfig = config.footerContainerConfig || defaultThemeConfig.footerContainerConfig!;
                                                                        updateConfig('footerContainerConfig', {
                                                                            ...currentConfig,
                                                                            borderRadius: {
                                                                                ...currentConfig.borderRadius,
                                                                                bottomLeft: value,
                                                                            },
                                                                        } as FooterContainerConfig);
                                                                    }}
                                                                    className="h-8 text-xs"
                                                                    min="0"
                                                                    step="1"
                                                                />
                                                            </div>
                                                            <div>
                                                                <Label htmlFor="borderRadiusBottomRight" className="text-[9px] text-gray-600 mb-0.5 block">Bottom Right</Label>
                                                                <Input
                                                                    id="borderRadiusBottomRight"
                                                                    type="number"
                                                                    value={config.footerContainerConfig?.borderRadius?.bottomRight ?? 16}
                                                                    onChange={(e) => {
                                                                        const value = Math.max(0, parseFloat(e.target.value) || 0);
                                                                        const currentConfig = config.footerContainerConfig || defaultThemeConfig.footerContainerConfig!;
                                                                        updateConfig('footerContainerConfig', {
                                                                            ...currentConfig,
                                                                            borderRadius: {
                                                                                ...currentConfig.borderRadius,
                                                                                bottomRight: value,
                                                                            },
                                                                        } as FooterContainerConfig);
                                                                    }}
                                                                    className="h-8 text-xs"
                                                                    min="0"
                                                                    step="1"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
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
                            <Button
                                onClick={async () => {
                                    setShowLoadContentDialog(true);
                                    setLoadingProjects(true);
                                    try {
                                        const response = await fetch('/api/designer/themes');
                                        if (response.ok) {
                                            const themes = await response.json();
                                            // Filter only content (not theme or template)
                                            const contentProjects = themes.filter((t: any) => t.type === 'content');
                                            setSavedContent(contentProjects);
                                        } else {
                                            toast.error("Failed to load saved content");
                                        }
                                    } catch (error) {
                                        console.error("Error loading content:", error);
                                        toast.error("Failed to load saved content");
                                    } finally {
                                        setLoadingProjects(false);
                                    }
                                }}
                                variant="outline"
                                className="px-4 py-2"
                            >
                                Load
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-4 items-start">
                            {/* Left Sidebar - Accordion Menus with Forms */}
                            <div className="w-80 shrink-0">
                                <style dangerouslySetInnerHTML={{__html: `
                                    .content-form-wrapper {
                                        width: 100% !important;
                                    }
                                    .content-form-wrapper > div.bg-white {
                                        padding: 1.5rem 0 !important;
                                        background: transparent !important;
                                        width: 100% !important;
                                        max-width: 100% !important;
                                    }
                                    .content-form-wrapper > div.bg-white > div {
                                        width: 100% !important;
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
                                            7: Page7Form,
                                            8: Page8Form,
                                            9: Page9Form,
                                            10: Page10Form,
                                            11: Page11Form,
                                            12: Page12Form,
                                            13: Page13Form,
                                            14: Page14Form,
                                            15: Page15Form,
                                            16: Page16Form,
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
                                                    <div className="bg-white rounded-lg border border-gray-200 max-h-[600px] overflow-y-auto content-form-wrapper w-full">
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
                                    onContactFormClick={() => {
                                        // Navigate to Form 8 (Contacts) when phone icon is clicked
                                        setOpenAccordionSection("8");
                                        setCurrentContentSection(8);
                                        scrollToSection(8);
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
                    </div>
                </>
            )}
        </div>
        </>
    );
}




