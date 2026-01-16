"use client";

import { useEditorStore } from "@/components/editor/store";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { ExternalLink, Calendar as CalendarIcon, Mail, MessageCircle, Heart, Star, MapPin, Phone, Video } from "lucide-react";
import { Modal } from "@/components/card/Modal";
import { RSVPModal, CalendarModal } from "@/components/card/ModalContent";
import { SpeechModal } from "@/components/card/SpeechModal";
import { useRouter } from "next/navigation";
import { useEvent } from "@/context/EventContext";

interface ButtonWidgetProps {
    id: string;
    data: any;
    style: any;
}

export function ButtonWidget({ id, data, style }: ButtonWidgetProps) {
    const selectNode = useEditorStore((state) => state.selectNode);
    const selectedId = useEditorStore((state) => state.selectedId);
    const addNode = useEditorStore((state) => state.addNode);
    const updateNodeData = useEditorStore((state) => state.updateNodeData);
    const nodes = useEditorStore((state) => state.nodes);
    const rootId = useEditorStore((state) => state.rootId);
    const [showModal, setShowModal] = useState(false);
    const router = useRouter();
    const { event } = useEvent();

    // Get or create modal widget for this button
    const getOrCreateModalWidget = () => {
        const modalId = `modal-${id}`;
        let modalNode = nodes[modalId];
        
        if (!modalNode) {
            // Create new modal widget
            modalNode = {
                id: modalId,
                type: 'modal' as any,
                parentId: rootId,
                children: [],
                data: {
                    modalType: data.actionType,
                    buttonId: id,
                    modalStyles: {},
                    dateFormat: 'dd full month name years',
                    timeFormat: 'start a.m/p.m - end a.m/p.m',
                    // Copy modal container styles from button
                    modalBackgroundColor: data.modalBackgroundColor || '#ffffff',
                    modalBorderTopWidth: data.modalBorderTopWidth || 0,
                    modalBorderRightWidth: data.modalBorderRightWidth || 0,
                    modalBorderBottomWidth: data.modalBorderBottomWidth || 0,
                    modalBorderLeftWidth: data.modalBorderLeftWidth || 0,
                    modalBorderTopColor: data.modalBorderTopColor || '#e5e7eb',
                    modalBorderRightColor: data.modalBorderRightColor || '#e5e7eb',
                    modalBorderBottomColor: data.modalBorderBottomColor || '#e5e7eb',
                    modalBorderLeftColor: data.modalBorderLeftColor || '#e5e7eb',
                    modalBorderRadius: '16px',
                    // Speech modal specific
                    speechPlaceholderName: data.speechPlaceholderName,
                    speechPlaceholderMessage: data.speechPlaceholderMessage,
                    speechSubmitText: data.speechSubmitText,
                    speechBtnBgColor: data.speechBtnBgColor,
                    speechBtnColor: data.speechBtnColor,
                    speechBtnFontFamily: data.speechBtnFontFamily,
                    speechBtnFontSize: data.speechBtnFontSize,
                    speechBtnBorderTopWidth: data.speechBtnBorderTopWidth,
                    speechBtnBorderRightWidth: data.speechBtnBorderRightWidth,
                    speechBtnBorderBottomWidth: data.speechBtnBorderBottomWidth,
                    speechBtnBorderLeftWidth: data.speechBtnBorderLeftWidth,
                    speechBtnBorderTopColor: data.speechBtnBorderTopColor,
                    speechBtnBorderRightColor: data.speechBtnBorderRightColor,
                    speechBtnBorderBottomColor: data.speechBtnBorderBottomColor,
                    speechBtnBorderLeftColor: data.speechBtnBorderLeftColor,
                },
                style: {}
            };
            addNode(modalNode, rootId);
        }
        
        return modalNode;
    };

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
            const modalNode = getOrCreateModalWidget();
            selectNode(modalNode.id); // Select modal widget when opening
            setShowModal(true);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        selectNode(id); // Return selection to button
    };

    const handleModalClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        const modalId = `modal-${id}`;
        selectNode(modalId); // Select modal widget when clicking on modal
    };

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

    // Get modal widget data
    const modalId = `modal-${id}`;
    const modalNode = nodes[modalId];
    const modalData = modalNode?.data || {};

    const renderModalContent = () => {
        const modalType = modalData.modalType || data.actionType;
        switch (modalType) {
            case 'calendar':
                return <CalendarModal
                    event={event}
                    onDownloadICS={() => console.log("Download ICS")}
                    styles={modalData.modalStyles || {}}
                    dateFormat={modalData.dateFormat}
                    timeFormat={modalData.timeFormat}
                />;
            case 'rsvp':
                return <RSVPModal
                    onSelectHadir={() => alert("Hadir")}
                    onSelectTidak={() => alert("Tidak")}
                    styles={modalData.modalStyles || {}}
                />;
            case 'speech':
                return <SpeechModal
                    placeholderName={modalData.speechPlaceholderName || data.speechPlaceholderName}
                    placeholderMessage={modalData.speechPlaceholderMessage || data.speechPlaceholderMessage}
                    submitButtonText={modalData.speechSubmitText || data.speechSubmitText}
                    submitButtonStyle={{
                        backgroundColor: modalData.speechBtnBgColor || data.speechBtnBgColor,
                        color: modalData.speechBtnColor || data.speechBtnColor,
                        fontFamily: modalData.speechBtnFontFamily || data.speechBtnFontFamily,
                        fontSize: modalData.speechBtnFontSize || data.speechBtnFontSize,
                        borderTopWidth: modalData.speechBtnBorderTopWidth || data.speechBtnBorderTopWidth,
                        borderRightWidth: modalData.speechBtnBorderRightWidth || data.speechBtnBorderRightWidth,
                        borderBottomWidth: modalData.speechBtnBorderBottomWidth || data.speechBtnBorderBottomWidth,
                        borderLeftWidth: modalData.speechBtnBorderLeftWidth || data.speechBtnBorderLeftWidth,
                        borderColor: modalData.speechBtnBorderTopColor || data.speechBtnBorderTopColor,
                        borderTopColor: modalData.speechBtnBorderTopColor || data.speechBtnBorderTopColor,
                        borderRightColor: modalData.speechBtnBorderRightColor || data.speechBtnBorderRightColor,
                        borderBottomColor: modalData.speechBtnBorderBottomColor || data.speechBtnBorderBottomColor,
                        borderLeftColor: modalData.speechBtnBorderLeftColor || data.speechBtnBorderLeftColor,
                    }}
                    styles={modalData.modalStyles || {}}
                />;
            default:
                return null;
        }
    };

    const modalStyle: React.CSSProperties = {
        backgroundColor: modalData.modalBackgroundColor || data.modalBackgroundColor || '#ffffff',
        borderTopWidth: modalData.modalBorderTopWidth ?? data.modalBorderTopWidth ?? 0,
        borderRightWidth: modalData.modalBorderRightWidth ?? data.modalBorderRightWidth ?? 0,
        borderBottomWidth: modalData.modalBorderBottomWidth ?? data.modalBorderBottomWidth ?? 0,
        borderLeftWidth: modalData.modalBorderLeftWidth ?? data.modalBorderLeftWidth ?? 0,
        borderTopColor: modalData.modalBorderTopColor || data.modalBorderTopColor || '#e5e7eb',
        borderRightColor: modalData.modalBorderRightColor || data.modalBorderRightColor || '#e5e7eb',
        borderBottomColor: modalData.modalBorderBottomColor || data.modalBorderBottomColor || '#e5e7eb',
        borderLeftColor: modalData.modalBorderLeftColor || data.modalBorderLeftColor || '#e5e7eb',
        borderStyle: 'solid',
        borderRadius: modalData.modalBorderRadius || '16px',
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
                    <div onClick={handleModalClick} className="cursor-pointer">
                        {renderModalContent()}
                    </div>
                </Modal>
            )}
        </>
    );
}
