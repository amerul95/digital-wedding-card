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

        {/* 2. Name of Organizer */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label>2. Name of Organizer</Label>
            <button
              onClick={() => {
                const currentOrganizers = event.organizerNames || [];
                if (currentOrganizers.length === 0) {
                  // Initialize with one empty organizer if empty
                  updateEvent({ organizerNames: [""] });
                } else {
                  updateEvent({ organizerNames: [...currentOrganizers, ""] });
                }
              }}
              className="px-3 py-1 rounded-full bg-[#36463A] text-white text-xs shadow hover:bg-[#2d3a2f]"
            >
              + Add Organizer
            </button>
          </div>
          <div className="space-y-3">
            {(event.organizerNames && event.organizerNames.length > 0 ? event.organizerNames : [""]).map((name: string, index: number) => (
              <div key={index} className="border border-[#36463A] rounded-xl p-3">
                <div className="flex gap-2">
                  <Input
                    value={name}
                    onChange={(e) => {
                      const currentOrganizers = event.organizerNames || [""];
                      const newOrganizers = [...currentOrganizers];
                      newOrganizers[index] = e.target.value;
                      updateEvent({ organizerNames: newOrganizers });
                    }}
                    placeholder={`Organizer Name ${index + 1}`}
                    className="flex-1"
                  />
                  {(event.organizerNames && event.organizerNames.length > 1) && (
                    <button
                      onClick={() => {
                        const currentOrganizers = event.organizerNames || [];
                        const newOrganizers = currentOrganizers.filter((_, i) => i !== index);
                        updateEvent({ organizerNames: newOrganizers.length > 0 ? newOrganizers : [""] });
                      }}
                      className="px-3 py-2 rounded-xl border border-red-300 text-red-700 text-sm hover:bg-red-50"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
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


