"use client";

import { EventProvider } from "@/context/EventContext";
import { LoginModalProvider } from "@/context/LoginModalContext";
import { Toaster } from "sonner";
import LoginModal from "@/components/LoginModal";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <EventProvider>
      <LoginModalProvider>
        {children}
        <LoginModal />
        <Toaster position="top-right" richColors />
      </LoginModalProvider>
    </EventProvider>
  );
}


