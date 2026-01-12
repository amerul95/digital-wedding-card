"use client";

import { useEvent } from "@/context/EventContext";
import { useDesignerFonts } from "@/context/DesignerFontContext";
import { Label, Input } from "@/components/card/UI";
import { RichTextEditorWithMargins } from "@/components/forms/RichTextEditorWithMargins";
import { FontFamilySelect } from "@/components/forms/FontFamilySelect";

export function Page3Form() {
  const { event, updateEvent } = useEvent();
  const { customFonts } = useDesignerFonts();

  return (
    <div className="bg-white p-6">
      <div className="space-y-0">
        {/* 1. Opening Speech - Grouped */}
        <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50 mb-0">
          <Label>1. Opening Speech (Greeting)</Label>
          <div className="space-y-3">
            <RichTextEditorWithMargins
              content={event.openingSpeech}
              onChange={(html) => updateEvent({ openingSpeech: html })}
              placeholder="Assalamualaikum, hello & selamat sejahtera"
              marginTop={event.openingSpeechMarginTop}
              marginRight={event.openingSpeechMarginRight}
              marginBottom={event.openingSpeechMarginBottom}
              marginLeft={event.openingSpeechMarginLeft}
              onMarginTopChange={(value) => updateEvent({ openingSpeechMarginTop: value })}
              onMarginRightChange={(value) => updateEvent({ openingSpeechMarginRight: value })}
              onMarginBottomChange={(value) => updateEvent({ openingSpeechMarginBottom: value })}
              onMarginLeftChange={(value) => updateEvent({ openingSpeechMarginLeft: value })}
            />
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
            <div>
              <label htmlFor="organizerNamesFontFamily" className="text-xs text-gray-600 mb-1 block">Font Family</label>
              <FontFamilySelect
                value={event.organizerNamesFontFamily || ""}
                onValueChange={(value) => updateEvent({ organizerNamesFontFamily: value || undefined })}
                customFonts={customFonts}
                placeholder="Select font..."
              />
            </div>
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
          <div className="space-y-3">
            <RichTextEditorWithMargins
              content={event.speechContent}
              onChange={(html) => updateEvent({ speechContent: html })}
              placeholder="Dengan penuh kesyukuran, kami mempersilakan..."
              marginTop={event.speechContentMarginTop}
              marginRight={event.speechContentMarginRight}
              marginBottom={event.speechContentMarginBottom}
              marginLeft={event.speechContentMarginLeft}
              onMarginTopChange={(value) => updateEvent({ speechContentMarginTop: value })}
              onMarginRightChange={(value) => updateEvent({ speechContentMarginRight: value })}
              onMarginBottomChange={(value) => updateEvent({ speechContentMarginBottom: value })}
              onMarginLeftChange={(value) => updateEvent({ speechContentMarginLeft: value })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}


