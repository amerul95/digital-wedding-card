"use client";

import { useEditorStore } from "@/components/editor/store";
import { cn } from "@/lib/utils";
import React from "react";
import { Modal } from "@/components/card/Modal";
import { CalendarModal, ContactModal, LocationModal, RSVPModal } from "@/components/card/ModalContent";
import { VideoModal } from "@/components/card/VideoModal";
import { GiftModal } from "@/components/card/GiftModal";
import { SpeechModal } from "@/components/card/SpeechModal";
import { useEvent } from "@/context/EventContext";

interface ModalWidgetProps {
    id: string;
    data: any;
    style: any;
}

export function ModalWidget({ id, data, style }: ModalWidgetProps) {
    const selectNode = useEditorStore((state) => state.selectNode);
    const selectedId = useEditorStore((state) => state.selectedId);
    const { event } = useEvent();
    const globalSettings = useEditorStore((state) => state.globalSettings);

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        selectNode(id);
    };

    const isSelected = selectedId === id;
    const modalType = data.modalType || 'calendar';

    const renderModalContent = () => {
        switch (modalType) {
            case 'calendar':
                return <CalendarModal
                    event={data.eventData || event}
                    onDownloadICS={() => console.log("Download ICS")}
                    styles={data.modalStyles || {}}
                />;
            case 'rsvp':
                return <RSVPModal
                    onSelectHadir={() => alert("Hadir")}
                    onSelectTidak={() => alert("Tidak")}
                    styles={data.modalStyles || {}}
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
                        borderColor: data.speechBtnBorderTopColor,
                        borderTopColor: data.speechBtnBorderTopColor,
                        borderRightColor: data.speechBtnBorderRightColor,
                        borderBottomColor: data.speechBtnBorderBottomColor,
                        borderLeftColor: data.speechBtnBorderLeftColor,
                    }}
                    styles={data.modalStyles || {}}
                />;
            case 'contact':
                return <ContactModal
                    contacts={data.contactList || event?.contacts || []}
                    styles={data.modalStyles || {}}
                />;
            case 'map':
            case 'location':
                return <LocationModal
                    locationFull={data.locationAddress || event?.locationFull || 'No Address'}
                    mapQuery={data.locationMapQuery || event?.mapQuery || ''}
                    styles={data.modalStyles || {}}
                />;
            case 'video':
                return <VideoModal
                    videoUrl={globalSettings?.backgroundMusic?.url || data.videoUrl}
                    styles={data.modalStyles || {}}
                />;
            case 'gift':
                return <GiftModal
                    bankName={data.giftBankName}
                    accountName={data.giftAccountName}
                    accountNumber={data.giftAccountNumber}
                    qrImage={data.giftQrImage}
                    styles={data.modalStyles || {}}
                />;
            default:
                return null;
        }
    };

    const modalStyle: React.CSSProperties = {
        backgroundColor: data.modalBackgroundColor || '#ffffff',
        borderTopWidth: data.modalBorderTopWidth || 0,
        borderRightWidth: data.modalBorderRightWidth || 0,
        borderBottomWidth: data.modalBorderBottomWidth || 0,
        borderLeftWidth: data.modalBorderLeftWidth || 0,
        borderTopColor: data.modalBorderTopColor || '#e5e7eb',
        borderRightColor: data.modalBorderRightColor || '#e5e7eb',
        borderBottomColor: data.modalBorderBottomColor || '#e5e7eb',
        borderLeftColor: data.modalBorderLeftColor || '#e5e7eb',
        borderStyle: 'solid',
        borderRadius: data.modalBorderRadius || '16px',
        ...style
    };

    // Don't render anything visible - modals are opened by buttons
    // This widget exists only for property editing
    return null;
}
