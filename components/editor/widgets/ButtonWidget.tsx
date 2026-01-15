"use client";

import { useEditorStore } from "@/components/editor/store";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { ExternalLink, Calendar as CalendarIcon, Mail, MessageCircle, Heart, Star, MapPin, Phone, Video } from "lucide-react";
import { Modal } from "@/components/card/Modal";
import { RSVPModal, CalendarModal } from "@/components/card/ModalContent";
import { SpeechModal } from "@/components/card/SpeechModal";
import { useRouter } from "next/navigation";

interface ButtonWidgetProps {
    id: string;
    data: any;
    style: any;
}

export function ButtonWidget({ id, data, style }: ButtonWidgetProps) {
    const selectNode = useEditorStore((state) => state.selectNode);
    const selectedId = useEditorStore((state) => state.selectedId);
    const [showModal, setShowModal] = useState(false);
    const router = useRouter();

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        selectNode(id);

        if (data.actionType === 'link' && data.linkUrl) {
            if (data.linkTarget === '_blank') {
                window.open(data.linkUrl, '_blank');
            } else {
                // If internal link or same tab
                window.location.href = data.linkUrl;
            }
        } else if (['calendar', 'rsvp', 'speech'].includes(data.actionType)) {
            setShowModal(true);
        }
    };

    const closeModal = () => setShowModal(false);

    const isSelected = selectedId === id;

    const wrapperStyle: React.CSSProperties = {
        display: 'flex',
        width: '100%',
        justifyContent: style.textAlign === 'center' ? 'center' : style.textAlign === 'right' ? 'flex-end' : 'flex-start',
        padding: '4px',
    };

    const buttonStyle: React.CSSProperties = {
        backgroundColor: style.backgroundColor || '#111827',
        color: style.color || '#ffffff',
        padding: style.padding || '10px 24px',
        fontSize: style.fontSize || '14px',
        fontWeight: style.fontWeight || '500',
        fontFamily: style.fontFamily,
        borderTopWidth: style.borderTopWidth,
        borderRightWidth: style.borderRightWidth,
        borderBottomWidth: style.borderBottomWidth,
        borderLeftWidth: style.borderLeftWidth,
        borderColor: style.borderTopColor,
        borderTopColor: style.borderTopColor,
        borderRightColor: style.borderRightColor,
        borderBottomColor: style.borderBottomColor,
        borderLeftColor: style.borderLeftColor,
        borderStyle: style.borderStyle,
        borderTopLeftRadius: style.borderRadiusTopLeft,
        borderTopRightRadius: style.borderRadiusTopRight,
        borderBottomLeftRadius: style.borderRadiusBottomLeft,
        borderBottomRightRadius: style.borderRadiusBottomRight,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        ...style
    };

    const getIcon = (iconName: string, customUrl?: string) => {
        if (customUrl) {
            // eslint-disable-next-line @next/next/no-img-element
            return <img src={customUrl} alt="icon" className="w-4 h-4 object-contain" />;
        }
        switch (iconName) {
            case 'calendar': return <CalendarIcon size={16} />;
            case 'rsvp': return <Mail size={16} />;
            case 'speech': return <MessageCircle size={16} />;
            case 'heart': return <Heart size={16} />;
            case 'star': return <Star size={16} />;
            case 'map': return <MapPin size={16} />;
            case 'phone': return <Phone size={16} />;
            case 'video': return <Video size={16} />;
            case 'link': return <ExternalLink size={16} />;
            default: return <ExternalLink size={16} />;
        }
    };

    const displayType = data.displayType || 'text'; // 'text' | 'icon' | 'both'

    const renderModalContent = () => {
        switch (data.actionType) {
            case 'calendar':
                // Using dummy data or existing logic, could be enhanced to use global event data
                return <CalendarModal
                    event={{ dateFull: 'Your Wedding Date', timeRange: 'Start Time - End Time' }}
                    onDownloadICS={() => console.log("Download ICS")}
                />;
            case 'rsvp':
                return <RSVPModal
                    onSelectHadir={() => alert("Hadir")}
                    onSelectTidak={() => alert("Tidak")}
                />;
            case 'speech':
                return <SpeechModal
                    placeholderName={data.speechPlaceholderName}
                    placeholderMessage={data.speechPlaceholderMessage}
                    submitButtonText={data.speechSubmitText}
                    submitButtonStyle={{
                        backgroundColor: data.speechBtnBgColor,
                        color: data.speechBtnColor,
                        fontFamily: data.speechBtnFontFamily,
                        fontSize: data.speechBtnFontSize,
                        borderTopWidth: data.speechBtnBorderTopWidth,
                        borderRightWidth: data.speechBtnBorderRightWidth,
                        borderBottomWidth: data.speechBtnBorderBottomWidth,
                        borderLeftWidth: data.speechBtnBorderLeftWidth,
                        borderColor: data.speechBtnBorderTopColor, // simplify using one color for all if separate colors not strictly requested, but we can map all
                        // If granular border colors needed for button
                        borderTopColor: data.speechBtnBorderTopColor,
                        borderRightColor: data.speechBtnBorderRightColor,
                        borderBottomColor: data.speechBtnBorderBottomColor,
                        borderLeftColor: data.speechBtnBorderLeftColor,
                    }}
                />;
            default:
                return null;
        }
    };

    const modalStyle: React.CSSProperties = {
        backgroundColor: data.modalBackgroundColor,
        borderTopWidth: data.modalBorderTopWidth,
        borderRightWidth: data.modalBorderRightWidth,
        borderBottomWidth: data.modalBorderBottomWidth,
        borderLeftWidth: data.modalBorderLeftWidth,
        borderTopColor: data.modalBorderTopColor,
        borderRightColor: data.modalBorderRightColor,
        borderBottomColor: data.modalBorderBottomColor,
        borderLeftColor: data.modalBorderLeftColor,
        borderStyle: 'solid', // Ensure border is visible if width > 0
    };

    return (
        <>
            <div
                style={wrapperStyle}
                onClick={handleClick}
                className={cn("group relative", isSelected ? "ring-2 ring-blue-500 ring-offset-2 z-10" : "hover:ring-1 hover:ring-blue-300")}
            >
                <button
                    type="button"
                    className="shadow-sm transition-all duration-200 active:scale-95"
                    style={buttonStyle}
                >
                    {(displayType === 'icon' || displayType === 'both') && (
                        <span>{getIcon(data.icon || 'link', data.customIcon)}</span>
                    )}
                    {(displayType === 'text' || displayType === 'both') && (
                        <span>{data.label || "Button"}</span>
                    )}
                </button>
            </div>

            {showModal && (
                <Modal onClose={closeModal} contentStyle={modalStyle}>
                    {renderModalContent()}
                </Modal>
            )}
        </>
    );
}
