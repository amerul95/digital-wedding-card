"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import NavBar from '@/components/NavBar'
import { CeremonyCard } from "@/components/card/CeremonyCard";
import { EditorPager } from "@/components/EditorPager";
import { useEvent } from "@/context/EventContext";
import { IconSave } from "@/components/card/Icons";
import { toast } from "sonner";

const SECTIONS = [
  { id: 1, label: "1. Main & Opening" },
  { id: 2, label: "2. Front Page" },
  { id: 3, label: "3. Invitation Speech" },
  { id: 4, label: "4. Location & Navigation" },
  { id: 5, label: "5. Tentative & More" },
  { id: 6, label: "6. Page In-Between" },
  { id: 7, label: "7. RSVP" },
  { id: 8, label: "8. Contacts" },
  { id: 9, label: "9. Music & Auto Scroll" },
  { id: 10, label: "10. Final Segment" },
];

export default function EditorPage() {
  const { resetEvent, event } = useEvent();
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [currentSection, setCurrentSection] = useState(1);
  const [activeTab, setActiveTab] = useState<"standard" | "custom">("standard");

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
    <div>
      <NavBar />
      <div className="min-h-screen  py-8 max-w-7xl mx-auto">
      <div className="container mx-auto px-4">
        <div className="mb-6 text-center flex flex-col items-center">
          <h1 className="font-bold mb-2" style={{ fontSize: '24px', color: '#36463A' }}>Studio</h1>
          
          {/* Tab Menu */}
          <div className="inline-flex rounded-2xl border border-[#36463A] overflow-hidden mb-4">
            <button
              onClick={() => setActiveTab("standard")}
              className={`px-6 py-2 text-sm font-medium transition-colors ${
                activeTab === "standard"
                  ? "bg-[#36463A] text-white"
                  : "bg-white text-[#36463A] hover:bg-gray-50"
              }`}
              style={{ 
                borderTopLeftRadius: '16px',
                borderBottomLeftRadius: '16px'
              }}
            >
              Standard
            </button>
            <button
              onClick={() => setActiveTab("custom")}
              className={`px-6 py-2 text-sm font-medium transition-colors ${
                activeTab === "custom"
                  ? "bg-[#36463A] text-white"
                  : "bg-white text-[#36463A] hover:bg-gray-50"
              }`}
              style={{ 
                borderTopRightRadius: '16px',
                borderBottomRightRadius: '16px'
              }}
            >
              Custom
            </button>
          </div>
          <button
            onClick={resetEvent}
            className="mt-4 px-4 py-2 rounded-full border border-[#36463A] text-[#36463A] bg-white text-sm shadow hover:bg-gray-50"
          >
            Reset to Defaults
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Editor Forms - Paginated */}
          <div className="flex flex-col mx-auto lg:mx-0 lg:justify-self-center" style={{ width: '571px' }}>
            {/* Form Container */}
            <div className="bg-white rounded-2xl shadow-lg border border-[#36463A] p-6" style={{ height: '592px', overflowY: 'auto' }}>
              <EditorPager 
                onSectionChange={scrollToSection}
                onCurrentSectionChange={setCurrentSection}
                currentSection={currentSection}
              />
            </div>
            
            {/* Pagination Outside Form */}
            <div className="mt-4 bg-white rounded-2xl shadow-lg border border-[#36463A] p-4">
              <div className="flex items-center justify-center gap-2 mb-3">
                <button
                  onClick={() => {
                    if (currentSection > 1) {
                      setCurrentSection(currentSection - 1);
                    }
                  }}
                  disabled={currentSection === 1}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    currentSection === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-[#36463A] text-white hover:bg-[#2d3a2f] shadow"
                  }`}
                >
                  ←
                </button>

                {SECTIONS.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setCurrentSection(section.id)}
                    className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                      section.id === currentSection
                        ? "bg-[#36463A] text-white shadow"
                        : "bg-white text-gray-700 border border-gray-300 hover:border-[#36463A]"
                    }`}
                  >
                    {section.id}
                  </button>
                ))}

                <button
                  onClick={() => {
                    if (currentSection < 10) {
                      setCurrentSection(currentSection + 1);
                    }
                  }}
                  disabled={currentSection === 10}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    currentSection === 10
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-[#36463A] text-white hover:bg-[#2d3a2f] shadow"
                  }`}
                >
                  →
                </button>

                <button
                  onClick={() => {
                    try {
                      localStorage.setItem("ceremony-card-event", JSON.stringify(event));
                      toast.success("Data saved successfully!", {
                        description: "All your changes have been saved to local storage.",
                        duration: 3000,
                      });
                    } catch (error) {
                      console.error("Error saving data:", error);
                      toast.error("Error saving data", {
                        description: "Failed to save. Check console for details.",
                        duration: 4000,
                      });
                    }
                  }}
                  className="ml-4 px-4 py-1 rounded-full bg-[#36463A] text-white hover:bg-[#2d3a2f] shadow text-sm font-medium transition-colors flex items-center gap-2"
                  title="Save current data"
                >
                  <IconSave />
                  <span className="hidden sm:inline">Save</span>
                </button>
              </div>

              {/* Section Label */}
              <div className="text-center">
                <p className="text-sm font-medium text-[#36463A] uppercase tracking-wide">
                  {SECTIONS.find((s) => s.id === currentSection)?.label.replace(/^\d+\.\s*/, "") || ""}
                </p>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="lg:sticky lg:top-8 lg:h-fit flex items-start justify-center">
            <div ref={previewContainerRef} className="overflow-visible [&>div]:min-h-0 [&>div]:h-auto [&>div]:w-full [&>div]:flex-none [&>div]:items-start [&>div]:rounded-3xl [&>div>div]:rounded-3xl [&>div>div]:overflow-hidden" style={{ width: '294px', height: '509px', backgroundColor: 'transparent' }}>
              <CeremonyCard editorSection={currentSection} />
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

