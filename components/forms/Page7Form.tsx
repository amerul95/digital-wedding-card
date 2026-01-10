"use client";

import { useEvent } from "@/context/EventContext";
import { Label, Input } from "@/components/card/UI";
import { RichTextEditor } from "@/components/RichTextEditor";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import { Button } from "@/components/ui/button";

export function Page7Form() {
  const { event, updateEvent } = useEvent();

  return (
    <div className="bg-white p-6">
      <div className="space-y-0">
        {/* 1. RSVP Mode - Grouped */}
        <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50 mb-0">
          <Label>1. RSVP Mode</Label>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={event.rsvpMode === "rsvp-speech"}
                onChange={(e) => {
                  if (e.target.checked) {
                    updateEvent({ rsvpMode: "rsvp-speech" });
                  }
                }}
                onClick={(e) => {
                  // Prevent unchecking - make it behave like radio buttons
                  if (event.rsvpMode === "rsvp-speech") {
                    e.preventDefault();
                  }
                }}
                className="w-4 h-4 text-[#36463A] border-[#36463A] rounded focus:ring-[#36463A]"
              />
              <span className="text-sm text-gray-700">RSVP + Speech</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={event.rsvpMode === "speech-only"}
                onChange={(e) => {
                  if (e.target.checked) {
                    updateEvent({ rsvpMode: "speech-only" });
                  }
                }}
                onClick={(e) => {
                  if (event.rsvpMode === "speech-only") {
                    e.preventDefault();
                  }
                }}
                className="w-4 h-4 text-[#36463A] border-[#36463A] rounded focus:ring-[#36463A]"
              />
              <span className="text-sm text-gray-700">Speech Only</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={event.rsvpMode === "none"}
                onChange={(e) => {
                  if (e.target.checked) {
                    updateEvent({ rsvpMode: "none" });
                  }
                }}
                onClick={(e) => {
                  if (event.rsvpMode === "none") {
                    e.preventDefault();
                  }
                }}
                className="w-4 h-4 text-[#36463A] border-[#36463A] rounded focus:ring-[#36463A]"
              />
              <span className="text-sm text-gray-700">None</span>
            </label>
          </div>
          <p className="text-xs text-gray-500">
            Note: Only one option can be selected. If RSVP + Speech is selected, both "Sahkan Kehadiran" button and RSVP button at bottom will show.
            If Speech Only is selected, "Sahkan Kehadiran" button and RSVP button at bottom will hide.
            If None is selected, Section 4 and RSVP button at bottom will hide.
          </p>
        </div>

        {/* 2. Notes - Grouped */}
        <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50 mb-0">
          <Label>2. Notes (Optional)</Label>
          <RichTextEditor
            content={event.rsvpNotes}
            onChange={(html) => updateEvent({ rsvpNotes: html })}
            placeholder="RSVP notes..."
          />
        </div>

        {/* 3. RSVP Closing Date - Grouped */}
        <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50 mb-0">
          <div className="flex items-center justify-between">
            <Label>3. RSVP Closing Date</Label>
            <Button
              type="button"
              variant="outline"
              onClick={() => updateEvent({ rsvpClosingDate: "" })}
              className="px-3 py-1 rounded-full border border-[#36463A] text-[#36463A] bg-white text-xs shadow hover:bg-gray-50"
            >
              Reset
            </Button>
          </div>
          <DateTimePicker
            value={event.rsvpClosingDate}
            onChange={(value) => updateEvent({ rsvpClosingDate: value })}
            placeholder="Select RSVP closing date and time"
          />
        </div>

        {/* 4. RSVP Input - Grouped */}
        <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50 mb-0">
          <Label>4. RSVP Input (Checkboxes for fields to show in RSVP)</Label>
          <div className="grid grid-cols-2 gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={event.rsvpInputName}
                onChange={(e) => updateEvent({ rsvpInputName: e.target.checked })}
                className="w-4 h-4 text-[#36463A] border-[#36463A] rounded focus:ring-[#36463A]"
              />
              <span className="text-sm text-gray-700">Name</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={event.rsvpInputPhone}
                onChange={(e) => updateEvent({ rsvpInputPhone: e.target.checked })}
                className="w-4 h-4 text-[#36463A] border-[#36463A] rounded focus:ring-[#36463A]"
              />
              <span className="text-sm text-gray-700">Phone</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={event.rsvpInputEmail}
                onChange={(e) => updateEvent({ rsvpInputEmail: e.target.checked })}
                className="w-4 h-4 text-[#36463A] border-[#36463A] rounded focus:ring-[#36463A]"
              />
              <span className="text-sm text-gray-700">Email</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={event.rsvpInputHomeAddress}
                onChange={(e) => updateEvent({ rsvpInputHomeAddress: e.target.checked })}
                className="w-4 h-4 text-[#36463A] border-[#36463A] rounded focus:ring-[#36463A]"
              />
              <span className="text-sm text-gray-700">Home Address</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={event.rsvpInputCompanyName}
                onChange={(e) => updateEvent({ rsvpInputCompanyName: e.target.checked })}
                className="w-4 h-4 text-[#36463A] border-[#36463A] rounded focus:ring-[#36463A]"
              />
              <span className="text-sm text-gray-700">Company Name</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={event.rsvpInputPosition}
                onChange={(e) => updateEvent({ rsvpInputPosition: e.target.checked })}
                className="w-4 h-4 text-[#36463A] border-[#36463A] rounded focus:ring-[#36463A]"
              />
              <span className="text-sm text-gray-700">Position</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={event.rsvpInputVehiclePlate}
                onChange={(e) => updateEvent({ rsvpInputVehiclePlate: e.target.checked })}
                className="w-4 h-4 text-[#36463A] border-[#36463A] rounded focus:ring-[#36463A]"
              />
              <span className="text-sm text-gray-700">Vehicle Plate Number</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={event.rsvpInputNotes}
                onChange={(e) => updateEvent({ rsvpInputNotes: e.target.checked })}
                className="w-4 h-4 text-[#36463A] border-[#36463A] rounded focus:ring-[#36463A]"
              />
              <span className="text-sm text-gray-700">Notes</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={event.rsvpInputSpeech}
                onChange={(e) => updateEvent({ rsvpInputSpeech: e.target.checked })}
                className="w-4 h-4 text-[#36463A] border-[#36463A] rounded focus:ring-[#36463A]"
              />
              <span className="text-sm text-gray-700">Speech</span>
            </label>
          </div>
        </div>

        {/* 5. Children Attendance Separation - Grouped */}
        <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50 mb-0">
          <Label>5. Children Attendance Separation</Label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={event.childrenAttendanceSeparation}
              onChange={(e) => updateEvent({ childrenAttendanceSeparation: e.target.checked })}
              className="w-4 h-4 text-rose-600 border-rose-300 rounded focus:ring-rose-500"
            />
            <span className="text-sm text-gray-700">Enable Children Attendance Separation</span>
          </label>
        </div>
      </div>
    </div>
  );
}

