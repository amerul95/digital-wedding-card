"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { CeremonyCard } from "@/components/card/CeremonyCard";
import { EditorPager } from "@/components/EditorPager";
import { useEvent } from "@/context/EventContext";
import { CeremonyEditor } from "@/components/CeremonyEditor";

export default function EditorPage() {
  const { resetEvent } = useEvent();
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [currentSection, setCurrentSection] = useState(1);

  const scrollToSection = useCallback((section: number) => {
    // Find the scrollable container within the CeremonyCard
    const container = previewContainerRef.current;
    if (!container) return;

    // The card content has a scrollable div, find it
    const scrollableDiv = container.querySelector('[class*="overflow-y-auto"]');
    if (!scrollableDiv) return;

    // Find the target section
    const targetSection = scrollableDiv.querySelector(`#card-sec-${section}`);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    <div className="min-h-screen bg-neutral-100 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-rose-700 mb-2">Ceremony Card Editor</h1>
          <p className="text-rose-600">Edit the card details and see the preview update in real time</p>
          <button
            onClick={resetEvent}
            className="mt-4 px-4 py-2 rounded-full border border-rose-300 text-rose-700 bg-white text-sm shadow hover:bg-rose-50"
          >
            Reset to Defaults
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor Forms - Paginated */}
          <div className="space-y-6">
            <EditorPager 
              onSectionChange={scrollToSection}
              onCurrentSectionChange={setCurrentSection}
            />
            
            {/* Additional Settings */}
            <div className="bg-white rounded-2xl shadow-lg border border-rose-200 p-6">
              <h3 className="text-xl font-semibold text-rose-700 mb-4">Additional Settings</h3>
              <p className="text-sm text-rose-600 mb-4">Calendar times, map location, and contacts</p>
              <CeremonyEditor />
            </div>
          </div>

          {/* Preview */}
          <div className="lg:sticky lg:top-8 lg:h-fit flex items-center justify-center">
            <div ref={previewContainerRef} className="w-full max-w-sm">
              <CeremonyCard editorSection={currentSection} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

