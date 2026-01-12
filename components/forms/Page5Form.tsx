"use client";

import { useEvent } from "@/context/EventContext";
import { useDesignerFonts } from "@/context/DesignerFontContext";
import { Label } from "@/components/card/UI";
import { RichTextEditorWithMargins } from "@/components/forms/RichTextEditorWithMargins";
import { FontFamilySelect } from "@/components/forms/FontFamilySelect";

export function Page5Form() {
  const { event, updateEvent } = useEvent();

  return (
    <div className="bg-white p-6">
      <div className="space-y-0">
        {/* 1. Additional Information - Grouped */}
        <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50 mb-0">
          <Label>1. Additional Information #1 (Optional)</Label>
          <div className="space-y-3">
            <RichTextEditorWithMargins
              content={event.additionalInformation1}
              onChange={(html) => updateEvent({ additionalInformation1: html })}
              placeholder="Additional information (rich text)..."
              marginTop={event.additionalInformation1MarginTop}
              marginRight={event.additionalInformation1MarginRight}
              marginBottom={event.additionalInformation1MarginBottom}
              marginLeft={event.additionalInformation1MarginLeft}
              onMarginTopChange={(value) => updateEvent({ additionalInformation1MarginTop: value })}
              onMarginRightChange={(value) => updateEvent({ additionalInformation1MarginRight: value })}
              onMarginBottomChange={(value) => updateEvent({ additionalInformation1MarginBottom: value })}
              onMarginLeftChange={(value) => updateEvent({ additionalInformation1MarginLeft: value })}
            />
          </div>
        </div>

        {/* 2. Event Tentative - Grouped */}
        <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50 mb-0">
          <Label>2. Event Tentative (Schedule Content)</Label>
          <div className="space-y-3">
            <RichTextEditorWithMargins
              content={event.eventTentative}
              onChange={(html) => updateEvent({ eventTentative: html })}
              placeholder="Enter schedule items..."
              marginTop={event.eventTentativeMarginTop}
              marginRight={event.eventTentativeMarginRight}
              marginBottom={event.eventTentativeMarginBottom}
              marginLeft={event.eventTentativeMarginLeft}
              onMarginTopChange={(value) => updateEvent({ eventTentativeMarginTop: value })}
              onMarginRightChange={(value) => updateEvent({ eventTentativeMarginRight: value })}
              onMarginBottomChange={(value) => updateEvent({ eventTentativeMarginBottom: value })}
              onMarginLeftChange={(value) => updateEvent({ eventTentativeMarginLeft: value })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

