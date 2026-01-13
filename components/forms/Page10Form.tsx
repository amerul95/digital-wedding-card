"use client";

import { useEvent } from "@/context/EventContext";
import { Label } from "@/components/card/UI";
import { Switch } from "@/components/ui/switch";

export function Page10Form() {
  const { event, updateEvent } = useEvent();

  return (
    <div className="bg-white p-6">
      <div className="space-y-0">
        {/* Show Segment - Grouped */}
        <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50 mb-0">
          <Label>Show Segment (Toggle to show/hide segments)</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Location</span>
            <Switch
              checked={event.showSegmentLocation}
              onCheckedChange={(checked) => updateEvent({ showSegmentLocation: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Time</span>
            <Switch
              checked={event.showSegmentTime}
              onCheckedChange={(checked) => updateEvent({ showSegmentTime: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Save Date</span>
            <Switch
              checked={event.showSegmentSaveDate}
              onCheckedChange={(checked) => updateEvent({ showSegmentSaveDate: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Date</span>
            <Switch
              checked={event.showSegmentDate}
              onCheckedChange={(checked) => updateEvent({ showSegmentDate: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Counting Days</span>
            <Switch
              checked={event.showSegmentCountingDays}
              onCheckedChange={(checked) => updateEvent({ showSegmentCountingDays: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Speech</span>
            <Switch
              checked={event.showSegmentSpeech}
              onCheckedChange={(checked) => updateEvent({ showSegmentSpeech: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Write Message</span>
            <Switch
              checked={event.showSegmentWriteMessage}
              onCheckedChange={(checked) => updateEvent({ showSegmentWriteMessage: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">End Time</span>
            <Switch
              checked={event.showSegmentEndTime}
              onCheckedChange={(checked) => updateEvent({ showSegmentEndTime: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Event Tentative</span>
            <Switch
              checked={event.showSegmentEventTentative}
              onCheckedChange={(checked) => updateEvent({ showSegmentEventTentative: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Attendance</span>
            <Switch
              checked={event.showSegmentAttendance}
              onCheckedChange={(checked) => updateEvent({ showSegmentAttendance: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Confirm Attendance</span>
            <Switch
              checked={event.showSegmentConfirmAttendance}
              onCheckedChange={(checked) => updateEvent({ showSegmentConfirmAttendance: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Gallery</span>
            <Switch
              checked={event.showSegmentGallery ?? true}
              onCheckedChange={(checked) => updateEvent({ showSegmentGallery: checked })}
            />
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}

