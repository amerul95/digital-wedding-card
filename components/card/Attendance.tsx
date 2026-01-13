"use client";

import { useEffect, useState } from "react";
import { EventData } from "./types";

interface AttendanceProps {
  eventId?: string; // Optional event/wedding ID to fetch RSVP records
  event?: EventData; // Event data for styling
}

interface RSVPRecord {
  id: string;
  guestName: string;
  attendance: string | null;
}

export function Attendance({ eventId, event }: AttendanceProps) {
  const [rsvpRecords, setRsvpRecords] = useState<RSVPRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // For now, we'll use mock data since we don't have the actual API endpoint
    // In production, this would fetch from an API endpoint like `/api/rsvp/${eventId}`
    if (!eventId) {
      // Mock data for preview/designer mode
      setRsvpRecords([
        { id: "1", guestName: "Ahmad", attendance: "attend" },
        { id: "2", guestName: "Siti", attendance: "attend" },
        { id: "3", guestName: "Ali", attendance: "not_attend" },
        { id: "4", guestName: "Fatimah", attendance: "attend" },
      ]);
      return;
    }

    // TODO: Fetch actual RSVP records from API
    // fetch(`/api/rsvp/${eventId}`)
    //   .then(res => res.json())
    //   .then(data => setRsvpRecords(data))
    //   .catch(err => console.error('Error fetching RSVP records:', err))
    //   .finally(() => setIsLoading(false));
  }, [eventId]);

  const attendCount = rsvpRecords.filter((r) => r.attendance === "attend").length;
  const notAttendCount = rsvpRecords.filter((r) => r.attendance === "not_attend").length;
  const totalCount = rsvpRecords.length;

  if (isLoading) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-rose-600">Loading attendance...</p>
      </div>
    );
  }

  if (totalCount === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-rose-600">No RSVP records yet</p>
      </div>
    );
  }

  // Get styling from event data
  const labelFontSize = event?.attendanceLabelFontSize ?? 12;
  const labelColor = event?.attendanceLabelColor || "#6b7280";
  const labelFontFamily = event?.attendanceLabelFontFamily || undefined;
  
  const numberFontSize = event?.attendanceNumberFontSize ?? 24;
  const numberColor = event?.attendanceNumberColor;
  const numberFontFamily = event?.attendanceNumberFontFamily || undefined;
  
  // Use default colors if not set: green for attending, red for not attending
  const attendingNumberColor = numberColor || "#16a34a"; // green-600
  const notAttendingNumberColor = numberColor || "#dc2626"; // red-600

  return (
    <div 
      className="py-4 space-y-3"
      style={{
        marginTop: event?.attendanceCounterMarginTop ? `${event.attendanceCounterMarginTop}px` : undefined,
        marginRight: event?.attendanceCounterMarginRight ? `${event.attendanceCounterMarginRight}px` : undefined,
        marginBottom: event?.attendanceCounterMarginBottom ? `${event.attendanceCounterMarginBottom}px` : undefined,
        marginLeft: event?.attendanceCounterMarginLeft ? `${event.attendanceCounterMarginLeft}px` : undefined,
        borderTopWidth: event?.attendanceCounterBorderTop ? `${event.attendanceCounterBorderTop}px` : undefined,
        borderRightWidth: event?.attendanceCounterBorderRight ? `${event.attendanceCounterBorderRight}px` : undefined,
        borderBottomWidth: event?.attendanceCounterBorderBottom ? `${event.attendanceCounterBorderBottom}px` : undefined,
        borderLeftWidth: event?.attendanceCounterBorderLeft ? `${event.attendanceCounterBorderLeft}px` : undefined,
        borderStyle: [
          event?.attendanceCounterBorderTop,
          event?.attendanceCounterBorderRight,
          event?.attendanceCounterBorderBottom,
          event?.attendanceCounterBorderLeft,
        ].some((v) => !!v) ? 'solid' : undefined,
        borderColor: [
          event?.attendanceCounterBorderTop,
          event?.attendanceCounterBorderRight,
          event?.attendanceCounterBorderBottom,
          event?.attendanceCounterBorderLeft,
        ].some((v) => !!v) ? '#e5e7eb' : undefined,
      }}
    >
      <div className="text-center">
        <div className="flex items-center justify-center gap-6">
          <div className="flex flex-col items-center flex-1">
            <div 
              className="font-bold"
              style={{
                fontSize: `${numberFontSize}px`,
                color: attendingNumberColor,
                fontFamily: numberFontFamily,
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
              }}
            >
              Attending
            </div>
          </div>
          {event?.attendanceShowSeparator !== false && (
            <div className="h-12 w-px bg-gray-300 flex-shrink-0"></div>
          )}
          <div className="flex flex-col items-center flex-1">
            <div 
              className="font-bold"
              style={{
                fontSize: `${numberFontSize}px`,
                color: notAttendingNumberColor,
                fontFamily: numberFontFamily,
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
              }}
            >
              Not Attending
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
