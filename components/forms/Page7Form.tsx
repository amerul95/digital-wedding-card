"use client";

import { useEvent } from "@/context/EventContext";
import { Label, Input } from "@/components/card/UI";
import { RichTextEditor } from "@/components/RichTextEditor";

export function Page7Form() {
  const { event, updateEvent } = useEvent();

  return (
    <div className="bg-white p-6">
      <div className="space-y-4">
        {/* 1. RSVP Mode */}
        <div>
          <Label>1. RSVP Mode</Label>
          <div className="space-y-2 mt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="rsvpMode"
                value="rsvp-speech"
                checked={event.rsvpMode === "rsvp-speech"}
                onChange={(e) => updateEvent({ rsvpMode: e.target.value as "rsvp-speech" | "speech-only" | "thirdparty" | "none" })}
                className="w-4 h-4 text-[#36463A] border-[#36463A] focus:ring-[#36463A]"
              />
              <span className="text-sm text-gray-700">RSVP + Speech</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="rsvpMode"
                value="speech-only"
                checked={event.rsvpMode === "speech-only"}
                onChange={(e) => updateEvent({ rsvpMode: e.target.value as "rsvp-speech" | "speech-only" | "thirdparty" | "none" })}
                className="w-4 h-4 text-[#36463A] border-[#36463A] focus:ring-[#36463A]"
              />
              <span className="text-sm text-gray-700">Speech Only</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="rsvpMode"
                value="thirdparty"
                checked={event.rsvpMode === "thirdparty"}
                onChange={(e) => updateEvent({ rsvpMode: e.target.value as "rsvp-speech" | "speech-only" | "thirdparty" | "none" })}
                className="w-4 h-4 text-[#36463A] border-[#36463A] focus:ring-[#36463A]"
              />
              <span className="text-sm text-gray-700">Third Party</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="rsvpMode"
                value="none"
                checked={event.rsvpMode === "none"}
                onChange={(e) => updateEvent({ rsvpMode: e.target.value as "rsvp-speech" | "speech-only" | "thirdparty" | "none" })}
                className="w-4 h-4 text-[#36463A] border-[#36463A] focus:ring-[#36463A]"
              />
              <span className="text-sm text-gray-700">None</span>
            </label>
          </div>
        </div>

        {/* 2. Notes (optional) */}
        <div>
          <Label>2. Notes (Optional)</Label>
          <RichTextEditor
            content={event.rsvpNotes}
            onChange={(html) => updateEvent({ rsvpNotes: html })}
            placeholder="RSVP notes..."
          />
        </div>

        {/* 3. RSVP Closing Date */}
        <div>
          <Label>3. RSVP Closing Date</Label>
          <div className="flex gap-2 items-center mt-2">
            <input
              type="datetime-local"
              value={event.rsvpClosingDate}
              onChange={(e) => updateEvent({ rsvpClosingDate: e.target.value })}
              className="flex-1 px-4 py-2 rounded-xl border border-[#36463A] text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#36463A] bg-white"
            />
            <button
              onClick={() => updateEvent({ rsvpClosingDate: "" })}
              className="px-4 py-2 rounded-xl border border-[#36463A] text-[#36463A] bg-white text-sm hover:bg-gray-50"
            >
              Reset
            </button>
          </div>
        </div>

        {/* 4. RSVP Input */}
        <div>
          <Label>4. RSVP Input (Checkboxes for fields to show in RSVP)</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
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

        {/* 5. Children attendance separation */}
        <div>
          <Label>5. Children Attendance Separation</Label>
          <label className="flex items-center gap-2 cursor-pointer mt-2">
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

