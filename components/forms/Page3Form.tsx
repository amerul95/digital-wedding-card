"use client";

import { useEvent } from "@/context/EventContext";
import { Label, Input } from "@/components/card/UI";
import { RichTextEditor } from "@/components/RichTextEditor";

export function Page3Form() {
  const { event, updateEvent } = useEvent();

  return (
    <div className="bg-white p-6">
      <div className="space-y-4">
        {/* 1. Opening speech */}
        <div>
          <Label>1. Opening Speech (Greeting)</Label>
          <RichTextEditor
            content={event.openingSpeech}
            onChange={(html) => updateEvent({ openingSpeech: html })}
            placeholder="Assalamualaikum, hello & selamat sejahtera"
          />
        </div>

        {/* 2. No. of Organizer */}
        <div>
          <Label>2. No. of Organizer</Label>
          <div className="flex gap-4 mt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="numberOfOrganizers"
                value="one"
                checked={event.numberOfOrganizers === "one"}
                onChange={(e) => updateEvent({ numberOfOrganizers: e.target.value as "one" | "two" | "others" })}
                className="w-4 h-4 text-[#36463A] border-[#36463A] focus:ring-[#36463A]"
              />
              <span className="text-sm text-gray-700">One</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="numberOfOrganizers"
                value="two"
                checked={event.numberOfOrganizers === "two"}
                onChange={(e) => updateEvent({ numberOfOrganizers: e.target.value as "one" | "two" | "others" })}
                className="w-4 h-4 text-[#36463A] border-[#36463A] focus:ring-[#36463A]"
              />
              <span className="text-sm text-gray-700">Two</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="numberOfOrganizers"
                value="others"
                checked={event.numberOfOrganizers === "others"}
                onChange={(e) => updateEvent({ numberOfOrganizers: e.target.value as "one" | "two" | "others" })}
                className="w-4 h-4 text-[#36463A] border-[#36463A] focus:ring-[#36463A]"
              />
              <span className="text-sm text-gray-700">Others</span>
            </label>
          </div>
        </div>

        {/* 3. Name of organizer */}
        <div>
          <Label>3. Name of Organizer</Label>
          {event.numberOfOrganizers === "one" && (
            <Input
              value={event.organizerName1}
              onChange={(e) => updateEvent({ organizerName1: e.target.value })}
              placeholder="Organizer Name"
              className="mt-2"
            />
          )}
          {event.numberOfOrganizers === "two" && (
            <div className="space-y-2 mt-2">
              <Input
                value={event.organizerName1}
                onChange={(e) => updateEvent({ organizerName1: e.target.value })}
                placeholder="Organizer Name 1"
              />
              <Input
                value={event.organizerName2}
                onChange={(e) => updateEvent({ organizerName2: e.target.value })}
                placeholder="Organizer Name 2"
              />
            </div>
          )}
          {event.numberOfOrganizers === "others" && (
            <div className="space-y-2 mt-2">
              <Input
                value={event.organizerName1}
                onChange={(e) => updateEvent({ organizerName1: e.target.value })}
                placeholder="Organizer Name 1"
              />
              <Input
                value={event.organizerName2}
                onChange={(e) => updateEvent({ organizerName2: e.target.value })}
                placeholder="Organizer Name 2"
              />
            </div>
          )}
        </div>

        {/* 4. Speech */}
        <div>
          <Label>4. Speech (Multiline)</Label>
          <RichTextEditor
            content={event.speechContent}
            onChange={(html) => updateEvent({ speechContent: html })}
            placeholder="Dengan penuh kesyukuran, kami mempersilakan..."
          />
        </div>
      </div>
    </div>
  );
}


