"use client";

import { useEditorStore } from "@/components/editor/store";
import { cn } from "@/lib/utils";
import { useDroppable } from "@dnd-kit/core";
import { useEffect, useState } from "react";
import { useClientStore } from "@/components/studio/clientStore";

interface CountdownWidgetProps {
    id: string;
    data: any;
    style: any;
}

export function CountdownWidget({ id, data, style }: CountdownWidgetProps) {
    const selectNode = useEditorStore((state) => state.selectNode);
    const selectedId = useEditorStore((state) => state.selectedId);
    const clientData = useClientStore((state) => state.clientData);

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        selectNode(id);
    };

    const isSelected = selectedId === id;

    // Determine target date: use ceremony date from studio if available, otherwise use widget's targetDate
    const getTargetDate = () => {
        // Check if ceremony date exists in clientData
        if (clientData.ceremonyDate && clientData.ceremonyDate.trim()) {
            // Combine ceremony date with start time if available
            let dateString = clientData.ceremonyDate;
            if (clientData.ceremonyStartTime && clientData.ceremonyStartTime.trim()) {
                // Combine date and time: "2026-02-12" + "10:00" = "2026-02-12T10:00"
                dateString = `${clientData.ceremonyDate}T${clientData.ceremonyStartTime}`;
            } else {
                // If no time, use midnight (00:00)
                dateString = `${clientData.ceremonyDate}T00:00`;
            }
            const ceremonyDate = new Date(dateString).getTime();
            // Only use ceremony date if it's valid
            if (!isNaN(ceremonyDate)) {
                return ceremonyDate;
            }
        }
        
        // Fall back to widget's targetDate or default
        if (data.targetDate) {
            return new Date(data.targetDate).getTime();
        }
        
        // Default to 1 week from now
        return new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
    };

    const targetDate = getTargetDate();

    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance < 0) {
                clearInterval(interval);
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            } else {
                setTimeLeft({
                    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((distance % (1000 * 60)) / 1000)
                });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [targetDate]);

    const pad = (num: number) => num.toString().padStart(2, '0');

    const numberStyle = {
        fontSize: data.numberFontSize || '24px',
        color: data.numberColor || '#000000',
        fontWeight: data.numberFontWeight || 'bold',
        fontFamily: data.numberFontFamily || undefined,
    };

    const labelStyle = {
        fontSize: data.labelFontSize || '12px',
        color: data.labelColor || '#666666',
        fontFamily: data.labelFontFamily || undefined,
        textTransform: 'uppercase' as const,
    };

    const itemStyle = {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        gap: data.internalGap || '4px', // Gap between number and label
    };

    // Padding handling - individual sides (default to 16px if not set, matching original p-4)
    const paddingTop = data.countdownPaddingTop !== undefined ? `${data.countdownPaddingTop}px` : '16px';
    const paddingRight = data.countdownPaddingRight !== undefined ? `${data.countdownPaddingRight}px` : '16px';
    const paddingBottom = data.countdownPaddingBottom !== undefined ? `${data.countdownPaddingBottom}px` : '16px';
    const paddingLeft = data.countdownPaddingLeft !== undefined ? `${data.countdownPaddingLeft}px` : '16px';

    const containerStyle: React.CSSProperties = {
        ...style,
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft,
    };

    const showLabels = data.showLabels !== false; // Default to true if not set

    return (
        <div
            className={cn(
                "relative transition-all group",
                isSelected ? "ring-2 ring-blue-500 z-10" : "hover:ring-1 hover:ring-blue-300",
            )}
            style={containerStyle}
            onClick={handleClick}
        >
            <div className="flex justify-center flex-wrap" style={{ gap: data.gap || '20px' }}>
                <div style={itemStyle}>
                    <div style={numberStyle}>{pad(timeLeft.days)}</div>
                    {showLabels && <div style={labelStyle}>Days</div>}
                </div>

                <div style={itemStyle}>
                    <div style={numberStyle}>{pad(timeLeft.hours)}</div>
                    {showLabels && <div style={labelStyle}>Hours</div>}
                </div>

                <div style={itemStyle}>
                    <div style={numberStyle}>{pad(timeLeft.minutes)}</div>
                    {showLabels && <div style={labelStyle}>Mins</div>}
                </div>

                <div style={itemStyle}>
                    <div style={numberStyle}>{pad(timeLeft.seconds)}</div>
                    {showLabels && <div style={labelStyle}>Secs</div>}
                </div>
            </div>
        </div>
    );
}
