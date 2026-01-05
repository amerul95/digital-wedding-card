"use client";

import { useState, useEffect } from "react";
import { Page1Form } from "@/components/forms/Page1Form";
import { Page2Form } from "@/components/forms/Page2Form";
import { Page3Form } from "@/components/forms/Page3Form";
import { Page4Form } from "@/components/forms/Page4Form";
import { Page5Form } from "@/components/forms/Page5Form";
import { Page6Form } from "@/components/forms/Page6Form";
import { Page7Form } from "@/components/forms/Page7Form";
import { Page8Form } from "@/components/forms/Page8Form";
import { Page9Form } from "@/components/forms/Page9Form";
import { Page10Form } from "@/components/forms/Page10Form";
import { useEvent } from "@/context/EventContext";

interface EditorPagerProps {
  onSectionChange?: (section: number) => void;
  onCurrentSectionChange?: (section: number) => void;
  currentSection?: number;
}

const SECTIONS = [
  { id: 1, label: "1. Main & Opening", component: Page1Form },
  { id: 2, label: "2. Front Page", component: Page2Form },
  { id: 3, label: "3. Invitation Speech", component: Page3Form },
  { id: 4, label: "4. Location & Navigation", component: Page4Form },
  { id: 5, label: "5. Tentative & More", component: Page5Form },
  { id: 6, label: "6. Page In-Between", component: Page6Form },
  { id: 7, label: "7. RSVP", component: Page7Form },
  { id: 8, label: "8. Contacts", component: Page8Form },
  { id: 9, label: "9. Music & Auto Scroll", component: Page9Form },
  { id: 10, label: "10. Final Segment", component: Page10Form },
];

export function EditorPager({ onSectionChange, onCurrentSectionChange, currentSection }: EditorPagerProps) {
  const current = currentSection || 1;
  const CurrentForm = SECTIONS.find((s) => s.id === current)?.component;

  useEffect(() => {
    onSectionChange?.(current);
    onCurrentSectionChange?.(current);
  }, [current, onSectionChange, onCurrentSectionChange]);

  return (
    <div className="space-y-6">
      {/* Current Form */}
      <div role="region" aria-live="polite">
        {CurrentForm && <CurrentForm />}
      </div>
    </div>
  );
}

