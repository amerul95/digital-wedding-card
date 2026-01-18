"use client";

import { useEditorStore } from "@/components/editor/store";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useWidgetAnimations } from "@/components/editor/utils/animationUtils";
import { usePreview } from "@/components/editor/context/PreviewContext";
import { useEffect, useState } from "react";

interface AttendanceWidgetProps {
    id: string;
    data: any;
    style: any;
}

interface RSVPRecord {
    id: string;
    guestName: string;
    attendance: string | null;
}

export function AttendanceWidget({ id, data, style }: AttendanceWidgetProps) {
    const selectNode = useEditorStore((state) => state.selectNode);
    const selectedId = useEditorStore((state) => state.selectedId);
    const { isPreview } = usePreview();
    const [rsvpRecords, setRsvpRecords] = useState<RSVPRecord[]>([]);

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        selectNode(id);
    };

    const isSelected = selectedId === id;

    // Use animation hooks
    const { widgetRef, controls, motionInitial, motionAnimate, animationVariants, useMotion } = useWidgetAnimations(
        id,
        data.initialAnimation,
        data.scrollAnimation
    );

    // Mock RSVP data for preview/designer mode
    useEffect(() => {
        // In production, this would fetch from API using eventId
        // For now, use mock data
        setRsvpRecords([
            { id: "1", guestName: "Ahmad", attendance: "attend" },
            { id: "2", guestName: "Siti", attendance: "attend" },
            { id: "3", guestName: "Ali", attendance: "not_attend" },
            { id: "4", guestName: "Fatimah", attendance: "attend" },
        ]);
    }, []);

    const attendCount = rsvpRecords.filter((r) => r.attendance === "attend").length;
    const notAttendCount = rsvpRecords.filter((r) => r.attendance === "not_attend").length;

    // Get styling from widget data with defaults
    const labelFontSize = data.labelFontSize ?? 12;
    const labelColor = data.labelColor || "#6b7280";
    const labelFontFamily = data.labelFontFamily || undefined;
    const labelFontWeight = data.labelFontWeight || "normal";
    
    const numberFontSize = data.numberFontSize ?? 24;
    const numberFontFamily = data.numberFontFamily || undefined;
    const numberFontWeight = data.numberFontWeight || "bold";
    
    // Text labels (customizable)
    const attendLabel = data.attendLabel || "Attending";
    const notAttendLabel = data.notAttendLabel || "Not Attending";
    
    // Gap between attend and not attend
    const gap = data.gap || 24; // Default 24px gap
    
    // Use individual colors for attending and not attending numbers
    // If individual colors are not set, use defaults: green for attending, red for not attending
    const attendingNumberColor = data.attendingNumberColor || "#16a34a"; // green-600
    const notAttendingNumberColor = data.notAttendingNumberColor || "#dc2626"; // red-600

    const MotionDiv = motion.div as any;

    return (
        <MotionDiv
            ref={widgetRef}
            {...(useMotion ? {
                animate: controls,
                initial: motionInitial,
                variants: animationVariants,
            } : {})}
            className={cn(
                "relative transition-all p-2 group",
                isSelected ? "ring-2 ring-blue-500 z-10" : "hover:ring-1 hover:ring-blue-300",
            )}
            style={style}
            onClick={handleClick}
        >
            <div className="text-center py-4">
                <div className="flex items-center justify-center" style={{ gap: `${gap}px` }}>
                    {/* Attending Section */}
                    <div className="flex flex-col items-center flex-1">
                        <div 
                            style={{
                                fontSize: `${numberFontSize}px`,
                                color: attendingNumberColor,
                                fontFamily: numberFontFamily,
                                fontWeight: numberFontWeight,
                            }}
                        >
                            {attendCount}
                        </div>
                        <div 
                            className="uppercase tracking-wide"
                            style={{
                                fontSize: `${labelFontSize}px`,
                                color: labelColor,
                                fontFamily: labelFontFamily,
                                fontWeight: labelFontWeight,
                            }}
                        >
                            {attendLabel}
                        </div>
                    </div>
                    
                    {/* Separator (optional) */}
                    {data.showSeparator !== false && (
                        <div className="h-12 w-px bg-gray-300 shrink-0"></div>
                    )}
                    
                    {/* Not Attending Section */}
                    <div className="flex flex-col items-center flex-1">
                        <div 
                            style={{
                                fontSize: `${numberFontSize}px`,
                                color: notAttendingNumberColor,
                                fontFamily: numberFontFamily,
                                fontWeight: numberFontWeight,
                            }}
                        >
                            {notAttendCount}
                        </div>
                        <div 
                            className="uppercase tracking-wide"
                            style={{
                                fontSize: `${labelFontSize}px`,
                                color: labelColor,
                                fontFamily: labelFontFamily,
                                fontWeight: labelFontWeight,
                            }}
                        >
                            {notAttendLabel}
                        </div>
                    </div>
                </div>
            </div>
        </MotionDiv>
    );
}
