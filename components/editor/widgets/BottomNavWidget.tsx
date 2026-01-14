"use client";

import { useEditorStore } from "@/components/editor/store";
import { cn } from "@/lib/utils";
import { Home, Calendar, Image as ImageIcon, MessageSquare, Phone } from "lucide-react";
import React from "react";

interface BottomNavWidgetProps {
    id: string;
    data: any;
    style: any;
}

export function BottomNavWidget({ id, data, style }: BottomNavWidgetProps) {
    const selectNode = useEditorStore((state) => state.selectNode);
    const selectedId = useEditorStore((state) => state.selectedId);

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        selectNode(id);
    };

    const isSelected = selectedId === id;

    // Default items
    const defaultItems = [
        { id: '1', label: 'Home', icon: 'home', visible: true },
        { id: '2', label: 'Date', icon: 'calendar', visible: true },
        { id: '3', label: 'Gallery', icon: 'image', visible: true },
        { id: '4', label: 'Wishes', icon: 'message', visible: true },
    ];

    const items = data.items || defaultItems;
    const navStyle = data.style || {};
    const layoutType = data.layoutType || 'float'; // 'float' | 'full'

    const getIcon = (name: string, size: number) => {
        switch (name) {
            case 'home': return <Home size={size} />;
            case 'calendar': return <Calendar size={size} />;
            case 'image': return <ImageIcon size={size} />;
            case 'message': return <MessageSquare size={size} />;
            case 'phone': return <Phone size={size} />;
            default: return <Home size={size} />;
        }
    };

    const iconSize = parseInt(navStyle.iconSize) || 20;
    const iconGap = navStyle.iconGap || '4px';

    // Base Styles
    const containerClasses = [
        "flex items-center justify-around px-2 z-50 transition-all duration-300 pointer-events-auto",
        "bg-white/90 backdrop-blur border border-white/20",
        navStyle.boxShadow || "shadow-lg",
        isSelected ? "ring-2 ring-blue-500" : "hover:ring-1 hover:ring-blue-300"
    ];

    // Layout Specific Styles
    let layoutStyles: React.CSSProperties = {
        position: 'fixed', // Fixed relative to the transformed parent (Phone Frame)
        bottom: layoutType === 'float' ? '16px' : '0px',
        left: layoutType === 'float' ? '16px' : '0px',
        right: layoutType === 'float' ? '16px' : '0px',
        height: '64px', // Standard height
        ...style
    };

    // Border Radius Logic
    if (layoutType === 'float') {
        const defaultRadius = '16px';
        layoutStyles.borderTopLeftRadius = navStyle.borderRadiusTopLeft || defaultRadius;
        layoutStyles.borderTopRightRadius = navStyle.borderRadiusTopRight || defaultRadius;
        layoutStyles.borderBottomLeftRadius = navStyle.borderRadiusBottomLeft || defaultRadius;
        layoutStyles.borderBottomRightRadius = navStyle.borderRadiusBottomRight || defaultRadius;
    } else {
        // Full width
        // Allow user to set top radius if they want, but default bottom to 0
        layoutStyles.borderTopLeftRadius = navStyle.borderRadiusTopLeft || '0px';
        layoutStyles.borderTopRightRadius = navStyle.borderRadiusTopRight || '0px';
        layoutStyles.borderBottomLeftRadius = navStyle.borderRadiusBottomLeft || '0px';
        layoutStyles.borderBottomRightRadius = navStyle.borderRadiusBottomRight || '0px';
    }

    // Colors & Fonts
    const mainStyle: React.CSSProperties = {
        backgroundColor: navStyle.backgroundColor || 'rgba(255, 255, 255, 0.9)',
        borderColor: navStyle.borderColor || 'rgba(255, 255, 255, 0.2)',
        ...layoutStyles
    };

    return (
        <div
            className={cn(...containerClasses, data.className)}
            style={mainStyle}
            onClick={handleClick}
        >
            {items.map((item: any, idx: number) => {
                if (!item.visible) return null;
                return (
                    <button
                        key={idx}
                        className="flex flex-col items-center justify-center rounded-lg hover:bg-gray-100/50 transition-colors w-14"
                        style={{ gap: iconGap }}
                    >
                        <div style={{ color: navStyle.iconColor || '#1f2937' }}>
                            {item.customIcon ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={item.customIcon}
                                    alt={item.label}
                                    style={{
                                        width: `${iconSize}px`,
                                        height: `${iconSize}px`,
                                        objectFit: 'contain'
                                    }}
                                />
                            ) : (
                                getIcon(item.icon, iconSize)
                            )}
                        </div>
                        <span
                            style={{
                                color: navStyle.textColor || '#4b5563',
                                fontSize: navStyle.fontSize || '10px',
                                fontWeight: navStyle.fontWeight || 'normal',
                                fontFamily: navStyle.fontFamily === 'serif' ? 'serif' : navStyle.fontFamily === 'mono' ? 'monospace' : 'sans-serif'
                            }}
                        >
                            {item.label}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
