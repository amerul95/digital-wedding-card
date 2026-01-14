"use client";

import { useEditorStore } from "@/components/editor/store";
import { cn } from "@/lib/utils";
import { Home, Calendar, Image as ImageIcon, MessageSquare, Phone } from "lucide-react";
import React from "react";

export function BottomNavBar({ className }: { className?: string }) {
    const rootId = useEditorStore((state) => state.rootId);
    const rootNode = useEditorStore((state) => state.nodes[rootId]);

    // Default items
    const defaultItems = [
        { id: '1', label: 'Home', icon: 'home', visible: true },
        { id: '2', label: 'Date', icon: 'calendar', visible: true },
        { id: '3', label: 'Gallery', icon: 'image', visible: true },
        { id: '4', label: 'Wishes', icon: 'message', visible: true },
    ];

    const items = rootNode?.data?.bottomNavItems || defaultItems;
    const style = rootNode?.data?.bottomNavStyle || {};

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

    // Parse size strings to numbers if needed for icons, or use defaults
    const iconSize = parseInt(style.iconSize) || 20;
    const iconGap = style.iconGap || '4px';

    return (
        <div
            className={cn(
                "absolute bottom-4 left-4 right-4 h-16 bg-white/90 backdrop-blur rounded-2xl flex items-center justify-around px-2 z-40 border border-white/20 transition-all duration-300 pointer-events-auto",
                style.boxShadow || "shadow-lg", // Applied dynamically
                className
            )}
            style={{
                backgroundColor: style.backgroundColor || 'rgba(255, 255, 255, 0.9)',
                borderColor: style.borderColor || 'rgba(255, 255, 255, 0.2)',
                // Add height control if we wanted, but h-16 is standard
            }}
        >
            {items.map((item: any, idx: number) => {
                if (!item.visible) return null;
                return (
                    <button
                        key={idx}
                        className="flex flex-col items-center justify-center rounded-lg hover:bg-gray-100/50 transition-colors w-14"
                        style={{ gap: iconGap }}
                    >
                        <div style={{ color: style.iconColor || '#1f2937' }}>
                            {/* If custom icon url exists, use that, else use default icon */}
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
                                color: style.textColor || '#4b5563',
                                fontSize: style.fontSize || '10px',
                                fontWeight: style.fontWeight || 'normal',
                                fontFamily: style.fontFamily === 'serif' ? 'serif' : style.fontFamily === 'mono' ? 'monospace' : 'sans-serif'
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
