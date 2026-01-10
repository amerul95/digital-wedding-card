"use client";

import { useEvent } from "@/context/EventContext";
import { Label, Input } from "@/components/card/UI";
import { RichTextEditor } from "@/components/RichTextEditor";

export function Page3Form() {
  const { event, updateEvent } = useEvent();

  return (
    <div className="bg-white p-6">
      <div className="space-y-0">
        {/* 1. Opening Speech - Grouped */}
        <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50 mb-0">
          <Label>1. Opening Speech (Greeting)</Label>
          <RichTextEditor
            content={event.openingSpeech}
            onChange={(html) => updateEvent({ openingSpeech: html })}
            placeholder="Assalamualaikum, hello & selamat sejahtera"
          />
          {/* Margin Controls for Opening Speech */}
          <div className="mt-4 pt-4 border-t border-gray-300">
            <label className="text-sm font-semibold text-gray-700 mb-3 block">Margin Controls (px)</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Top</label>
                <Input
                  type="number"
                  value={event.openingSpeechMarginTop ?? 0}
                  onChange={(e) => updateEvent({ openingSpeechMarginTop: Number(e.target.value) || 0 })}
                  placeholder="0"
                  min="0"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Right</label>
                <Input
                  type="number"
                  value={event.openingSpeechMarginRight ?? 0}
                  onChange={(e) => updateEvent({ openingSpeechMarginRight: Number(e.target.value) || 0 })}
                  placeholder="0"
                  min="0"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Bottom</label>
                <Input
                  type="number"
                  value={event.openingSpeechMarginBottom ?? 0}
                  onChange={(e) => updateEvent({ openingSpeechMarginBottom: Number(e.target.value) || 0 })}
                  placeholder="0"
                  min="0"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Left</label>
                <Input
                  type="number"
                  value={event.openingSpeechMarginLeft ?? 0}
                  onChange={(e) => updateEvent({ openingSpeechMarginLeft: Number(e.target.value) || 0 })}
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 2. Name of Organizer - Grouped */}
        <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50 mb-0">
          <div className="flex items-center justify-between">
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

        {/* 3. Speech - Grouped */}
        <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50 mb-0">
          <Label>3. Speech (Multiline)</Label>
          <RichTextEditor
            content={event.speechContent}
            onChange={(html) => updateEvent({ speechContent: html })}
            placeholder="Dengan penuh kesyukuran, kami mempersilakan..."
          />
          {/* Margin Controls for Speech Content */}
          <div className="mt-4 pt-4 border-t border-gray-300">
            <label className="text-sm font-semibold text-gray-700 mb-3 block">Margin Controls (px)</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Top</label>
                <Input
                  type="number"
                  value={event.speechContentMarginTop ?? 0}
                  onChange={(e) => updateEvent({ speechContentMarginTop: Number(e.target.value) || 0 })}
                  placeholder="0"
                  min="0"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Right</label>
                <Input
                  type="number"
                  value={event.speechContentMarginRight ?? 0}
                  onChange={(e) => updateEvent({ speechContentMarginRight: Number(e.target.value) || 0 })}
                  placeholder="0"
                  min="0"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Bottom</label>
                <Input
                  type="number"
                  value={event.speechContentMarginBottom ?? 0}
                  onChange={(e) => updateEvent({ speechContentMarginBottom: Number(e.target.value) || 0 })}
                  placeholder="0"
                  min="0"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Left</label>
                <Input
                  type="number"
                  value={event.speechContentMarginLeft ?? 0}
                  onChange={(e) => updateEvent({ speechContentMarginLeft: Number(e.target.value) || 0 })}
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


