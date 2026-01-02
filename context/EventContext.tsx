"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { EventData } from "@/components/card/types";
import { defaultEvent } from "@/lib/eventTypes";

interface EventContextType {
  event: EventData;
  updateEvent: (updates: Partial<EventData>) => void;
  resetEvent: () => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

const STORAGE_KEY = "ceremony-card-event";

export function EventProvider({ children }: { children: ReactNode }) {
  const [event, setEvent] = useState<EventData>(defaultEvent);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge with defaults to ensure new fields are included
        setEvent({ ...defaultEvent, ...parsed });
      }
    } catch (error) {
      console.error("Failed to load event from localStorage:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage whenever event changes
  useEffect(() => {
    if (!isLoaded || typeof window === "undefined") return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(event));
    } catch (error) {
      console.error("Failed to save event to localStorage:", error);
    }
  }, [event, isLoaded]);

  const updateEvent = (updates: Partial<EventData>) => {
    setEvent((prev) => ({ ...prev, ...updates }));
  };

  const resetEvent = () => {
    setEvent(defaultEvent);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <EventContext.Provider value={{ event, updateEvent, resetEvent }}>
      {children}
    </EventContext.Provider>
  );
}

export function useEvent() {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error("useEvent must be used within an EventProvider");
  }
  return context;
}

