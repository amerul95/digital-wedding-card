"use client";

import { useEditorStore } from "@/components/editor/store";
import { cn } from "@/lib/utils";
import { Home, Calendar, Image as ImageIcon, MessageSquare, Phone, MapPin, Video, Gift, Mail } from "lucide-react";
import React, { useState } from "react";
import { Modal } from "@/components/card/Modal";
import { CalendarModal, ContactModal, LocationModal, RSVPModal } from "@/components/card/ModalContent";
import { VideoModal } from "@/components/card/VideoModal";
import { GiftModal } from "@/components/card/GiftModal";

interface BottomNavWidgetProps {
    id: string;
    data: any;
    style: any;
}

export function BottomNavWidget({ id, data, style }: BottomNavWidgetProps) {
    const selectNode = useEditorStore((state) => state.selectNode);
    const selectedId = useEditorStore((state) => state.selectedId);
    const [activeModal, setActiveModal] = useState<string | null>(null);

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        selectNode(id);
    };

    const isSelected = selectedId === id;

    // Default items if none exist
    const defaultItems = [
        { id: '1', type: 'home', label: 'Home', icon: 'home', iconType: 'default', visible: true },
        { id: '2', type: 'calendar', label: 'Date', icon: 'calendar', iconType: 'default', visible: true },
        { id: '3', type: 'contact', label: 'Contact', icon: 'phone', iconType: 'default', visible: true },
        { id: '4', type: 'gift', label: 'Gift', icon: 'gift', iconType: 'default', visible: true },
    ];

    const items = data.items || defaultItems;
    const navStyle = data.style || {};
    const layoutType = data.layoutType || 'float'; // 'float' | 'full'

    const getIcon = (item: any, size: number) => {
        if (item.iconType === 'custom' && item.customIcon) {
            // eslint-disable-next-line @next/next/no-img-element
            return (
                <img
                    src={item.customIcon}
                    alt={item.label}
                    style={{
                        width: `${size}px`,
                        height: `${size}px`,
                        objectFit: 'contain'
                    }}
                />
            );
        }

        if (item.iconType === 'text') {
            return (
                <span style={{
                    fontSize: `${size}px`,
                    fontFamily: item.textIconFontFamily || 'inherit',
                    fontWeight: item.textIconFontWeight || 'bold',
                    color: item.textIconColor || 'inherit'
                }}>
                    {item.textIconContent || item.label.charAt(0)}
                </span>
            );
        }

        // Default icons
        switch (item.icon) {
            case 'home': return <Home size={size} />;
            case 'calendar': return <Calendar size={size} />;
            case 'image': return <ImageIcon size={size} />;
            case 'message': return <MessageSquare size={size} />;
            case 'phone': return <Phone size={size} />;
            case 'map': return <MapPin size={size} />;
            case 'video': return <Video size={size} />;
            case 'gift': return <Gift size={size} />;
            case 'rsvp': return <Mail size={size} />;
            default: return <Home size={size} />;
        }
    };

    const handleItemClick = (e: React.MouseEvent, item: any) => {
        e.stopPropagation();
        // Always select the widget when clicking inside it
        selectNode(id);

        // Open modal if functionality is enabled
        if (['contact', 'video', 'map', 'gift', 'calendar', 'rsvp'].includes(item.type)) {
            setActiveModal(item.id);
        }
    };

    const closeModal = () => setActiveModal(null);

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
        position: 'fixed',
        bottom: navStyle.bottomPosition ? `${navStyle.bottomPosition}px` : (layoutType === 'float' ? '16px' : '0px'),
        left: layoutType === 'float' ? '16px' : '0px',
        right: layoutType === 'float' ? '16px' : '0px',
        height: navStyle.height ? `${navStyle.height}px` : '64px',
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
        layoutStyles.borderTopLeftRadius = navStyle.borderRadiusTopLeft || '0px';
        layoutStyles.borderTopRightRadius = navStyle.borderRadiusTopRight || '0px';
        layoutStyles.borderBottomLeftRadius = navStyle.borderRadiusBottomLeft || '0px';
        layoutStyles.borderBottomRightRadius = navStyle.borderRadiusBottomRight || '0px';
    }

    const mainStyle: React.CSSProperties = {
        backgroundColor: navStyle.backgroundColor || 'rgba(255, 255, 255, 0.9)',
        borderColor: navStyle.borderColor || 'rgba(255, 255, 255, 0.2)',
        ...layoutStyles
    };

    const renderModalContent = (item: any) => {
        switch (item.type) {
            case 'calendar':
                // Creating dummy event data if not present, in real app this should come from item config or global event data
                return <CalendarModal
                    event={item.eventData || { dateFull: 'Date not set', timeRange: '' }}
                    onDownloadICS={() => console.log("Download ICS")}
                />;
            case 'contact':
                return <ContactModal contacts={item.contactList || []} />;
            case 'map':
                return <LocationModal
                    locationFull={item.locationAddress || 'No Address'}
                    mapQuery={item.locationMapQuery || item.locationAddress || ''}
                />;
            case 'video':
                return <VideoModal videoUrl={item.videoUrl} />;
            case 'gift':
                return <GiftModal
                    bankName={item.giftBankName}
                    accountName={item.giftAccountName}
                    accountNumber={item.giftAccountNumber}
                    qrImage={item.giftQrImage}
                />;
            case 'rsvp':
                return <RSVPModal
                    onSelectHadir={() => alert("Hadir selected")}
                    onSelectTidak={() => alert("Tidak Hadir selected")}
                />;
            default:
                return null;
        }
    };

    const activeItem = items.find((i: any) => i.id === activeModal);

    return (
        <>
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
                            className="flex flex-col items-center justify-center rounded-lg hover:bg-gray-100/50 transition-colors"
                            style={{
                                gap: iconGap,
                                minWidth: '48px',
                                flex: 1
                            }}
                            onClick={(e) => handleItemClick(e, item)}
                        >
                            <div style={{ color: navStyle.iconColor || '#1f2937' }}>
                                {getIcon(item, iconSize)}
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

            {/* Render Modal if active */}
            {activeModal && activeItem && (
                <Modal onClose={closeModal}>
                    {renderModalContent(activeItem)}
                </Modal>
            )}
        </>
    );
}
