"use client";

import { useEditorStore } from "@/components/editor/store";
import { cn } from "@/lib/utils";
import { useDroppable } from "@dnd-kit/core";
import { useEffect, useState } from "react";

interface CountdownWidgetProps {
    id: string;
    data: any;
    style: any;
}

export function CountdownWidget({ id, data, style }: CountdownWidgetProps) {
    const selectNode = useEditorStore((state) => state.selectNode);
    const selectedId = useEditorStore((state) => state.selectedId);

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        selectNode(id);
    };

    const isSelected = selectedId === id;

    // Parse target date or default to 1 week from now
    const targetDate = data.targetDate ? new Date(data.targetDate).getTime() : new Date().getTime() + 7 * 24 * 60 * 60 * 1000;

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
        fontWeight: 'bold',
    };

    const labelStyle = {
        fontSize: data.labelFontSize || '12px',
        color: data.labelColor || '#666666',
        textTransform: 'uppercase' as const,
    };

    const itemStyle = {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        gap: data.internalGap || '4px', // Gap between number and label
    };

    return (
        <div
            className={cn(
                "relative transition-all p-4 group",
                isSelected ? "ring-2 ring-blue-500 z-10" : "hover:ring-1 hover:ring-blue-300",
            )}
            style={style}
            onClick={handleClick}
        >
            <div className="flex justify-center flex-wrap" style={{ gap: data.gap || '20px' }}>
                <div style={itemStyle}>
                    <div style={numberStyle}>{pad(timeLeft.days)}</div>
                    <div style={labelStyle}>Days</div>
                </div>

                <div style={itemStyle}>
                    <div style={numberStyle}>{pad(timeLeft.hours)}</div>
                    <div style={labelStyle}>Hours</div>
                </div>

                <div style={itemStyle}>
                    <div style={numberStyle}>{pad(timeLeft.minutes)}</div>
                    <div style={labelStyle}>Mins</div>
                </div>

                <div style={itemStyle}>
                    <div style={numberStyle}>{pad(timeLeft.seconds)}</div>
                    <div style={labelStyle}>Secs</div>
                </div>
            </div>
        </div>
    );
}
