export type ModalView = "none" | "calendar" | "contact" | "location" | "rsvp" | "hadir" | "tidak" | "ucapan";

// Re-export EventData from lib/eventTypes.ts to maintain compatibility
export type { EventData } from "@/lib/eventTypes";

export interface FormData {
  nama: string;
  phone: string;
  jumlah: number;
  ucapan: string;
}


