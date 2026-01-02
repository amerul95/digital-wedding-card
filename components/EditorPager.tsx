"use client";

import { useState, useEffect } from "react";
import { Section1Form } from "@/components/forms/Section1Form";
import { Section2Form } from "@/components/forms/Section2Form";
import { Section3Form } from "@/components/forms/Section3Form";
import { Section4Form } from "@/components/forms/Section4Form";
import { Section5Form } from "@/components/forms/Section5Form";
import { Section6Form } from "@/components/forms/Section6Form";
import { IconSave } from "@/components/card/Icons";
import { useEvent } from "@/context/EventContext";
import { toast } from "sonner";

interface EditorPagerProps {
  onSectionChange?: (section: number) => void;
  onCurrentSectionChange?: (section: number) => void;
}

const SECTIONS = [
  { id: 1, label: "1. Appearance", component: Section5Form },
  { id: 2, label: "2. Title & Header", component: Section1Form },
  { id: 3, label: "3. Greeting & Details", component: Section2Form },
  { id: 4, label: "4. Aturcara", component: Section3Form },
  { id: 5, label: "5. Ucapan", component: Section4Form },
  { id: 6, label: "6. Song & Autoscroll", component: Section6Form },
];

export function EditorPager({ onSectionChange, onCurrentSectionChange }: EditorPagerProps) {
  const [current, setCurrent] = useState(1);
  const { event } = useEvent();

  useEffect(() => {
    onSectionChange?.(current);
    onCurrentSectionChange?.(current);
  }, [current, onSectionChange, onCurrentSectionChange]);

  const handlePrev = () => {
    if (current > 1) {
      setCurrent(current - 1);
    }
  };

  const handleNext = () => {
    if (current < 6) {
      setCurrent(current + 1);
    }
  };

  const handleSave = () => {
    console.log("=== SAVE EVENT DATA ===");
    console.log("Data Type:", typeof event);
    console.log("Is Array:", Array.isArray(event));
    console.log("Is Object:", event !== null && typeof event === "object" && !Array.isArray(event));
    console.log("\nEvent Data:");
    console.log(event);
    console.log("\nJSON Stringified:");
    console.log(JSON.stringify(event, null, 2));
    console.log("======================");
    
    // Save to localStorage (already handled by context, but explicit save)
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
  };

  const CurrentForm = SECTIONS.find((s) => s.id === current)?.component;

  return (
    <div className="space-y-6">
      {/* Navigation Bar */}
      <div className="bg-white rounded-2xl shadow-lg border border-rose-200 p-4">
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={handlePrev}
            disabled={current === 1}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              current === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-rose-600 text-white hover:bg-rose-700 shadow"
            }`}
          >
            ← Prev
          </button>

          <div className="flex-1">
            <label htmlFor="section-select" className="sr-only">
              Pilih seksyen untuk sunting
            </label>
            <select
              id="section-select"
              value={current}
              onChange={(e) => setCurrent(Number(e.target.value))}
              className="w-full px-4 py-2 rounded-xl border border-rose-200 text-sm text-rose-700 font-medium focus:outline-none focus:ring-2 focus:ring-rose-300 bg-white"
              aria-label="Pilih seksyen untuk sunting"
            >
              {SECTIONS.map((section) => (
                <option key={section.id} value={section.id}>
                  {section.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleNext}
            disabled={current === 6}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              current === 6
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-rose-600 text-white hover:bg-rose-700 shadow"
            }`}
          >
            Next →
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-full bg-green-600 text-white hover:bg-green-700 shadow text-sm font-medium transition-colors flex items-center gap-2"
            title="Save current data"
          >
            <IconSave />
            <span className="hidden sm:inline">Save</span>
          </button>
        </div>

        {/* Progress indicator */}
        <div className="mt-4 flex items-center gap-2">
          {SECTIONS.map((section) => (
            <div
              key={section.id}
              className={`flex-1 h-2 rounded-full transition-colors ${
                section.id === current
                  ? "bg-rose-600"
                  : section.id < current
                  ? "bg-rose-300"
                  : "bg-rose-100"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Current Form */}
      <div role="region" aria-live="polite">
        {CurrentForm && <CurrentForm />}
      </div>
    </div>
  );
}

