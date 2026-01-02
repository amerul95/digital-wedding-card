"use client";

import { EventProvider } from "@/context/EventContext";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <EventProvider>
      {children}
      <Toaster position="top-right" richColors />
    </EventProvider>
  );
}


