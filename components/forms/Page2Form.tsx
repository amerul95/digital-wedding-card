"use client";

import { useEvent } from "@/context/EventContext";
import { Label, Input, Row } from "@/components/card/UI";
import { DateTimePicker } from "@/components/ui/datetime-picker";

export function Page2Form() {
  const { event, updateEvent } = useEvent();

  return (
    <div className="bg-white p-6">
      <div className="space-y-4">
        {/* 1. Type of event */}
        <div>
          <Label>1. Type of Event (Event Title Name)</Label>
          <Input
            value={event.eventTitle}
            onChange={(e) => updateEvent({ eventTitle: e.target.value })}
            placeholder="Majlis Aqiqah"
            className="mt-2"
          />
        </div>

        {/* 1a. Font size of event name */}
        <div>
          <Label>1a. Font Size of Event Name</Label>
          <input
            type="number"
            value={event.eventTitleFontSize}
            onChange={(e) => updateEvent({ eventTitleFontSize: Number(e.target.value) })}
            className="w-full px-4 py-2 rounded-xl border border-[#36463A] text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#36463A] bg-white mt-2"
            min="8"
            max="72"
          />
        </div>

        {/* 2. Short Name (Celebrated Person) */}
        <div>
          <Label>2. Short Name (Celebrated Person)</Label>
          <Input
            value={event.shortName}
            onChange={(e) => updateEvent({ shortName: e.target.value })}
            placeholder="Aqil"
            className="mt-2"
          />
        </div>

        {/* 2a. Family font */}
        <div>
          <Label>2a. Family Font</Label>
          <input
            type="text"
            value={event.shortNameFamilyFont}
            onChange={(e) => updateEvent({ shortNameFamilyFont: e.target.value })}
            placeholder="Arial"
            className="w-full px-4 py-2 rounded-xl border border-[#36463A] text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#36463A] bg-white mt-2"
          />
        </div>

        {/* 2b. Font size */}
        <div>
          <Label>2b. Font Size</Label>
          <input
            type="number"
            value={event.shortNameFontSize}
            onChange={(e) => updateEvent({ shortNameFontSize: Number(e.target.value) })}
            className="w-full px-4 py-2 rounded-xl border border-[#36463A] text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#36463A] bg-white mt-2"
            min="8"
            max="72"
          />
        </div>

        {/* 2c. Font color */}
        <div>
          <Label>2c. Font Color</Label>
            <div className="flex gap-2 items-center mt-2">
            <div className="relative h-10 w-10">
              <div
                className="absolute inset-0 rounded-full border border-[#36463A] cursor-pointer"
                style={{ backgroundColor: event.shortNameFontColor }}
              />
              <input
                type="color"
                value={event.shortNameFontColor}
                onChange={(e) => updateEvent({ shortNameFontColor: e.target.value })}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                style={{ WebkitAppearance: "none", appearance: "none" }}
              />
            </div>
            <input
              type="text"
              value={event.shortNameFontColor}
              onChange={(e) => updateEvent({ shortNameFontColor: e.target.value })}
              placeholder="#f43f5e"
              className="flex-1 px-4 py-2 rounded-xl border border-[#36463A] text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#36463A] bg-white font-mono"
            />
          </div>
        </div>

        {/* 3. Start of Event */}
        <div>
          <Label>3. Start of Event</Label>
          <div className="mt-2">
            <DateTimePicker
              value={event.startEventDateTime}
              onChange={(value) => updateEvent({ startEventDateTime: value })}
              placeholder="Select start date and time"
            />
          </div>
        </div>

        {/* 4. End of Event */}
        <div>
          <Label>4. End of Event</Label>
          <div className="mt-2">
            <DateTimePicker
              value={event.endEventDateTime}
              onChange={(value) => updateEvent({ endEventDateTime: value })}
              placeholder="Select end date and time"
            />
          </div>
        </div>

        {/* 5. Day and Date */}
        <div>
          <Label>5. Day and Date (Format: Days - dd.mm.yy)</Label>
          <Input
            value={event.dayAndDate}
            onChange={(e) => updateEvent({ dayAndDate: e.target.value })}
            placeholder="Rabu - 29.10.25"
            className="mt-2"
          />
        </div>

        {/* 5a. Checkboxes for name and phone */}
        <Row>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="dayAndDateShowName"
              checked={event.dayAndDateShowName}
              onChange={(e) => updateEvent({ dayAndDateShowName: e.target.checked })}
              className="w-4 h-4 text-[#36463A] border-[#36463A] rounded focus:ring-[#36463A]"
            />
            <Label htmlFor="dayAndDateShowName" className="mb-0">Name</Label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="dayAndDateShowPhone"
              checked={event.dayAndDateShowPhone}
              onChange={(e) => updateEvent({ dayAndDateShowPhone: e.target.checked })}
              className="w-4 h-4 text-[#36463A] border-[#36463A] rounded focus:ring-[#36463A]"
            />
            <Label htmlFor="dayAndDateShowPhone" className="mb-0">Phone</Label>
          </div>
        </Row>

        {/* 5b. Font size */}
        <div>
          <Label>5b. Font Size</Label>
          <input
            type="number"
            value={event.dayAndDateFontSize}
            onChange={(e) => updateEvent({ dayAndDateFontSize: Number(e.target.value) })}
            className="w-full px-4 py-2 rounded-xl border border-[#36463A] text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#36463A] bg-white mt-2"
            min="8"
            max="72"
          />
        </div>

        {/* 6. Place/hashtag/etc (Venue) */}
        <div>
          <Label>6. Place/Hashtag/Etc (Venue)</Label>
          <Input
            value={event.venue}
            onChange={(e) => updateEvent({ venue: e.target.value })}
            placeholder="Dewan Seri Melati, Putrajaya"
            className="mt-2"
          />
        </div>
      </div>
    </div>
  );
}


