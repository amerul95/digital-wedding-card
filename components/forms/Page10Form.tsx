"use client";

import { useEvent } from "@/context/EventContext";
import { Label } from "@/components/card/UI";

export function Page10Form() {
  const { event, updateEvent } = useEvent();

  return (
    <div className="bg-white p-6">
      <div className="space-y-4">
        <Label>Show Segment (Toggle to show/hide segments)</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
          {/* Note: These are checkboxes as they can be toggled independently */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={event.showSegmentLocation}
              onChange={(e) => updateEvent({ showSegmentLocation: e.target.checked })}
              className="w-4 h-4 text-[#36463A] border-[#36463A] rounded focus:ring-[#36463A]"
            />
            <span className="text-sm text-gray-700">Location</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={event.showSegmentDate}
              onChange={(e) => updateEvent({ showSegmentDate: e.target.checked })}
              className="w-4 h-4 text-[#36463A] border-[#36463A] rounded focus:ring-[#36463A]"
            />
            <span className="text-sm text-gray-700">Date</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={event.showSegmentTime}
              onChange={(e) => updateEvent({ showSegmentTime: e.target.checked })}
              className="w-4 h-4 text-[#36463A] border-[#36463A] rounded focus:ring-[#36463A]"
            />
            <span className="text-sm text-gray-700">Time</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={event.showSegmentEndTime}
              onChange={(e) => updateEvent({ showSegmentEndTime: e.target.checked })}
              className="w-4 h-4 text-[#36463A] border-[#36463A] rounded focus:ring-[#36463A]"
            />
            <span className="text-sm text-gray-700">End Time</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={event.showSegmentSaveDate}
              onChange={(e) => updateEvent({ showSegmentSaveDate: e.target.checked })}
              className="w-4 h-4 text-[#36463A] border-[#36463A] rounded focus:ring-[#36463A]"
            />
            <span className="text-sm text-gray-700">Save Date</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={event.showSegmentEventTentative}
              onChange={(e) => updateEvent({ showSegmentEventTentative: e.target.checked })}
              className="w-4 h-4 text-[#36463A] border-[#36463A] rounded focus:ring-[#36463A]"
            />
            <span className="text-sm text-gray-700">Event Tentative</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={event.showSegmentCountingDays}
              onChange={(e) => updateEvent({ showSegmentCountingDays: e.target.checked })}
              className="w-4 h-4 text-[#36463A] border-[#36463A] rounded focus:ring-[#36463A]"
            />
            <span className="text-sm text-gray-700">Counting Days</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={event.showSegmentAttendance}
              onChange={(e) => updateEvent({ showSegmentAttendance: e.target.checked })}
              className="w-4 h-4 text-[#36463A] border-[#36463A] rounded focus:ring-[#36463A]"
            />
            <span className="text-sm text-gray-700">Attendance</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={event.showSegmentSpeech}
              onChange={(e) => updateEvent({ showSegmentSpeech: e.target.checked })}
              className="w-4 h-4 text-[#36463A] border-[#36463A] rounded focus:ring-[#36463A]"
            />
            <span className="text-sm text-gray-700">Speech</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={event.showSegmentConfirmAttendance}
              onChange={(e) => updateEvent({ showSegmentConfirmAttendance: e.target.checked })}
              className="w-4 h-4 text-[#36463A] border-[#36463A] rounded focus:ring-[#36463A]"
            />
            <span className="text-sm text-gray-700">Confirm Attendance</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={event.showSegmentWriteMessage}
              onChange={(e) => updateEvent({ showSegmentWriteMessage: e.target.checked })}
              className="w-4 h-4 text-[#36463A] border-[#36463A] rounded focus:ring-[#36463A]"
            />
            <span className="text-sm text-gray-700">Write a Message</span>
          </label>
        </div>
      </div>
    </div>
  );
}

