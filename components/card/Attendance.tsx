"use client";

import { useEffect, useState } from "react";

interface AttendanceProps {
  eventId?: string; // Optional event/wedding ID to fetch RSVP records
}

interface RSVPRecord {
  id: string;
  guestName: string;
  attendance: string | null;
}

export function Attendance({ eventId }: AttendanceProps) {
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

  return (
    <div className="py-4 space-y-3">
      <div className="text-center">
        <h3 className="text-sm font-semibold text-rose-700 mb-3">Attendance</h3>
        <div className="flex items-center justify-center gap-6">
          <div className="flex flex-col items-center">
            <div className="text-2xl font-bold text-green-600">{attendCount}</div>
            <div className="text-xs text-gray-600 uppercase tracking-wide">Attending</div>
          </div>
          <div className="h-12 w-px bg-gray-300"></div>
          <div className="flex flex-col items-center">
            <div className="text-2xl font-bold text-red-600">{notAttendCount}</div>
            <div className="text-xs text-gray-600 uppercase tracking-wide">Not Attending</div>
          </div>
        </div>
        <div className="mt-3 text-xs text-gray-500">
          Total: {totalCount} {totalCount === 1 ? "response" : "responses"}
        </div>
      </div>
    </div>
  );
}
